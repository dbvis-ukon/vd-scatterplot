import { extent, merge } from 'd3-array'
import { Axis, axisBottom, AxisContainerElement, axisLeft } from 'd3-axis'
import { brush, BrushBehavior } from 'd3-brush'
import { polygonHull } from 'd3-polygon'
import { scaleLinear, ScaleLinear } from 'd3-scale'
import { event, select, selectAll, Selection } from 'd3-selection'
import { line } from 'd3-shape'
import { transition } from 'd3-transition'
import { voronoi, VoronoiDiagram, VoronoiLayout, VoronoiPolygon } from 'd3-voronoi'
import { Observable, Subject } from 'rxjs'
import { ClusterItem } from './cluster-item'
import { DataItem } from './data-item'
import { LineItem } from './line-item'
import { LineObject } from './line-object'
import { VdScatterplotEvent } from './vd-scatterplot-event'
import { VdScatterplotOptions } from './vd-scatterplot-options'

export class VdScatterplot {
  private static DEFAULT_OPTIONS: VdScatterplotOptions = {
    height: 225,
    width: 225,
    colormap: [
      '#a6cee3',
      '#b2df8a',
      '#fb9a99',
      '#fdbf6f',
      '#cab2d6',
      '#1f78b4',
      '#33a02c',
      '#e31a1c',
      '#ff7f00',
      '#6a3d9a',
    ],
    axis: false,
    clusterHulls: false,
    voronoiCells: false,
  }

  private rootElement: HTMLElement
  private plot: Selection<SVGElement, DataItem, null, undefined>
  private data: DataItem[] = []
  private cluster: ClusterItem[] | undefined

  /**
   * A line-object with id "i" consists of multiple line-items [{x:, y:}, {x:, y: },...]; it can be
   * related to one specific data item with id "i", and if so, it will have the same color as the data item.
   * The line can for example represent a process flow of this data item dependent on changing a
   * specific parameter. If the id is not related to a data item, the line will be black.
   */
  private lines: LineObject[] = []
  /**
   * map cluster id to related data items of cluster
   * @type {Map<string, DataItem[]>}
   */
  private mapDataItems: Map<string, DataItem[]> = new Map<string, DataItem[]>()
  /**
   * map data item to its related cluster id
   * @type {Map<DataItem, string>}
   */
  private mapClusterID: Map<DataItem, string> = new Map<DataItem, string>()
  /**
   * Map each data id to its data item.
   * @type {Map<string, DataItem>}
   */
  private mapData: Map<string, DataItem> = new Map<string, DataItem>()
  private options: VdScatterplotOptions = VdScatterplot.DEFAULT_OPTIONS

  private width = 0
  private height = 0
  private margin = 30

  private xExtent: [number, number] | [undefined, undefined] = [undefined, undefined]
  private yExtent: [number, number] | [undefined, undefined] = [undefined, undefined]

  private xMiddle = 0
  private yMiddle = 0

  private xScale: ScaleLinear<number, number> = scaleLinear()
  private yScale: ScaleLinear<number, number> = scaleLinear()

  private xAxis: Axis<number> | undefined
  private yAxis: Axis<number> | undefined

  private voronoiLayer: Selection<SVGElement, DataItem, null, undefined> | undefined
  private clusterHullLayer: Selection<SVGElement, DataItem, null, undefined> | undefined
  private voronoiCells: VoronoiDiagram<DataItem> | undefined
  private colormap: string[] = []

  private circleSelection: Selection<SVGCircleElement, DataItem, SVGElement, DataItem> | undefined

  /**
   * created by d3.brush()
   */
  private brush: BrushBehavior<DataItem> | undefined

  private brushSelectionSubject: Subject<VdScatterplotEvent> = new Subject<VdScatterplotEvent>()
  private brushSelectionObservable: Observable<VdScatterplotEvent> = this.brushSelectionSubject.asObservable()

  // # another UGLY HACK
  private brushHoverSubject: Subject<VdScatterplotEvent> = new Subject<VdScatterplotEvent>()
  private brushHoverObservable: Observable<VdScatterplotEvent> = this.brushHoverSubject.asObservable()

  /**
   * Constructor of a VdScatterplot element.
   * @param {HTMLElement} rootElement
   * @param {Options} options
   */
  constructor(rootElement: HTMLElement, options: VdScatterplotOptions) {
    this.rootElement = rootElement

    this.plot = select<HTMLElement, DataItem>(this.rootElement)
      .append<SVGElement>('svg')
      .attr('class', 'ukon-scatterplot')
      .attr('width', 100)
      .attr('height', 100)

    this.addGroupSelection()

    this.setOptions(options)

    this.observeSelectionBrush().subscribe((scatterplotEvent: VdScatterplotEvent) => {
      this.receiveSelection(scatterplotEvent)
    })
    this.observeHoverBrush().subscribe((scatterplotEvent: VdScatterplotEvent) => {
      this.receiveHover(scatterplotEvent)
    })
  }

  /**
   * Send selection of a group of dataitems to observers.
   * @param {VdScatterplotEvent} scatterplotEvent
   */
  public sendSelection(scatterplotEvent: VdScatterplotEvent): void {
    this.brushSelectionSubject.next(scatterplotEvent)
  }

  /**
   * Get observation of selecting a group of data items.
   * @returns {Observable<VdScatterplotEvent>}
   */
  public observeSelectionBrush(): Observable<VdScatterplotEvent> {
    return this.brushSelectionObservable
  }

  /**
   * Send the data item that was hovered to observers.
   * @param {VdScatterplotEvent} scatterplotEvent
   */
  public sendHover(scatterplotEvent: VdScatterplotEvent): void {
    this.brushHoverSubject.next(scatterplotEvent)
  }

  /**
   * Get observation of hovering a data item.
   * @returns {Observable<VdScatterplotEvent>}
   */
  public observeHoverBrush(): Observable<VdScatterplotEvent> {
    return this.brushHoverObservable
  }

  /**
   * Set data for the scatterplot.
   * @param {DataItem[]} data
   */
  public setData(data: DataItem[]): void {
    this.mapData.clear()
    this.data = data
    for (const d of data) {
      this.mapData.set(d.id, d)
    }
    this.update()
  }

  /**
   * Set data lines of scatterplot
   * @param {LineObject[]} lines
   */
  public setLines(lines: LineObject[]): void {
    this.lines = lines
    this.update()
  }

  /**
   * Set the cluster for the scatterplot.
   * All item ids related to a cluster have to be contained in the data of the scatterplot.
   * @param {ClusterItem[]} cluster
   */
  public setCluster(cluster: ClusterItem[]): void {
    this.mapClusterID.clear()
    this.mapDataItems.clear()

    // check if the related IDs are contained in the data and filter
    // if not -> throw error
    // insert the items in the maps
    for (const c of cluster) {
      const items: DataItem[] = new Array<DataItem>()

      for (const d of c.relatedIDs) {
        const item: DataItem | undefined = this.mapData.get(d)
        if (item) {
          items.push(item)
          this.mapClusterID.set(item, c.id)
        } else {
          throw new Error("there is a data id in a cluster which is not contained in the scatterplot's data!")
        }
      }
      this.mapDataItems.set(c.id, items)
    }

    this.cluster = cluster
    this.update()
  }

  /**
   * Set/Change options externally from constructor.
   * NOTE: If voronoi cells are activated, there is no brush/group selection possible.
   * @param {Options} options
   */
  public setOptions(options: VdScatterplotOptions): void {
    this.options = Object.assign({}, VdScatterplot.DEFAULT_OPTIONS, this.options, options)

    // set the colormap which should be used for possible clusters
    this.colormap = this.options.colormap as string[]
    // set the height/width of the scatterplot
    this.height = this.options.height as number
    this.width = this.options.width as number

    this.plot.attr('width', this.width).attr('height', this.height)

    if (this.brush !== undefined) {
      this.brush.extent([[0, 0], [this.width, this.height]])
      this.plot.select<SVGGElement>('g.brush').call(this.brush)
    }

    if (this.options.axis === true) {
      this.plot.append('g').attr('class', 'x axis')
      this.plot.append('g').attr('class', 'y axis')
    } else {
      this.plot.selectAll('.x.axis').remove()
      this.plot.selectAll('.y.axis').remove()
    }

    if (this.options.clusterHulls === true) {
      this.clusterHullLayer = this.plot.append<SVGElement>('svg').attr('class', 'clusterHullLayer')
    }

    if (this.options.voronoiCells === true) {
      console.log('Note: If voronoi cells are plotted, the group selection is not possible anymore')
      if (this.clusterHullLayer) {
        this.voronoiLayer = this.clusterHullLayer.append<SVGElement>('svg').attr('class', 'voronoiLayer')
      } else {
        this.voronoiLayer = this.plot.append<SVGElement>('svg').attr('class', 'voronoiLayer')
      }
      // remove the brush
      this.brush = undefined
      this.plot.selectAll('g.brush').remove()
    }

    this.update()
  }

  /**
   * Resizes the height and width of plot.
   * @param {number} width
   * @param {number} height
   */
  public resize(newWidth: number, newHeight: number): void {
    this.setOptions({ width: newWidth, height: newHeight })
  }

  /**
   * This function is intended to adjust the scatterplot to given target data in the following sense:
   * when having plots of data items with same id but of different projections, the x- and y-axes of the
   * scatterplot at hand are flipped if this leads to a smaller (euclidean) distance between the data items.
   * For example, this will cause scatterplots of a pca and mds to have the same shape which makes them
   * better comparable.
   * @param {DataItem[]} targetData
   */
  public alignData(targetData: DataItem[]): void {
    let sumNormalX = 0
    let sumMirroredX = 0

    let sumNormalY = 0
    let sumMirroredY = 0

    // do the comparison only if the number of data points is the same
    if (this.data.length === targetData.length) {
      for (let i = 0; i < this.data.length; i++) {
        sumNormalX = sumNormalX + Math.pow(this.data[i].x - targetData[i].x, 2)
        sumMirroredX = sumMirroredX + Math.pow(-(this.data[i].x - this.xMiddle) + this.xMiddle - targetData[i].x, 2)

        sumNormalY = sumNormalY + Math.pow(this.data[i].y - targetData[i].y, 2)
        sumMirroredY = sumMirroredY + Math.pow(-(this.data[i].y - this.yMiddle) + this.yMiddle - targetData[i].y, 2)
      }

      // if mirroring the data lead to more similar data according to target data -> switch
      if (sumNormalX > sumMirroredX) {
        for (const dataItem of this.data) {
          const oldValX = dataItem.x
          const newValX = -(oldValX - this.xMiddle) + this.xMiddle
          dataItem.x = newValX
        }
      }

      if (sumNormalY > sumMirroredY) {
        for (const dataItem of this.data) {
          const oldValY = dataItem.y
          const newValY = -(oldValY - this.yMiddle) + this.yMiddle
          dataItem.y = newValY
        }
      }
    }
  }

  /**
   * Add a title to the scatterplot below the diagram.
   * @param {string} title
   */
  public updateTitle(title: string): void {
    // remove possible earlier title
    this.plot.selectAll('.title').remove()

    this.plot
      .append('text')
      .attr('class', 'title')
      .text(title)

    // arrange the title
    this.plot
      .selectAll('.title')
      .attr('x', this.width / 2)
      .attr('y', this.height - this.margin)
  }

  /**
   * Updates the appearance of the hovered element.
   * @param {VdScatterplotEvent} scatterplotEvent
   */
  private receiveHover(scatterplotEvent: VdScatterplotEvent): void {
    // reset appearance of all circles
    this.plot.selectAll('circle.datapoint').classed('selected', false)
    this.plot.selectAll('.linetrace').classed('selected', false)

    // change class of selected datapoints
    this.plot
      .selectAll<SVGCircleElement, DataItem>('circle.datapoint')
      .data(scatterplotEvent.dataItems, (d: DataItem) => d.id)
      .classed('selected', true)

    // change appearance of related line - if available
    if (this.lines.length > 0 && scatterplotEvent.dataItems.length > 0) {
      this.plot
        .selectAll('.linetrace')
        .data(this.lines.map((lo: LineObject) => lo.id))
        .classed('selected', d => {
          return d === scatterplotEvent.dataItems[0].id
        })
    }
  }

  /**
   * Draws/updates the scatterplot according to options, or if new data/cluster are set, and so on..
   */
  private update(): void {
    if (!this.plot) {
      return
    } else if (!this.data) {
      return
    }

    this.calculateExtent()
    this.calculateMiddle()
    this.scaleData()

    const xScale = this.xScale
    const yScale = this.yScale

    if (this.options.axis === true) {
      this.updateAxis()
    }

    // remove any path (possible earlier cluster hulls/voronoi cells before resizing/updating)
    this.plot.selectAll('path').remove()

    const dataItems = this.data || []

    this.circleSelection = this.plot
      .selectAll<SVGCircleElement, DataItem>('circle.datapoint')
      .data<DataItem>(dataItems, (d: DataItem) => d.id)

    const transitiontime = 500
    const transitionFunction: any = transition()
      .duration(transitiontime)
      .delay((d, i) => {
        if (transitiontime === (0 as number)) {
          return 0
        }

        return (i / this.data.length) * 500 // Dynamic delay (i.e. each item delays a little longer)
      })

    // exit:
    this.circleSelection
      .exit()
      .transition(transitionFunction)
      .style('fill-opacity', 1e-6)
      .remove()

    // update: move the existing circles around
    this.circleSelection
      .transition(transitionFunction)
      .attr('transform', (d: DataItem) => {
        return 'translate(' + xScale(d.x) + ', ' + yScale(d.y) + ')'
      })
      .style('fill', (d: DataItem) => {
        return this.getColorOfDataItem(d)
      })

    // enter
    this.circleSelection
      .enter()
      .append('circle')
      .attr('transform', (d: DataItem) => {
        return 'translate(' + xScale(d.x) + ', ' + yScale(d.y) + ')'
      })
      .attr('class', 'datapoint')
      .style('fill', (d: DataItem) => {
        return this.getColorOfDataItem(d)
      })
      .on('mouseover', (d: DataItem) => {
        this.sendHover({
          dataItems: [d],
          sourceElement: event.target,
        })
      })
      .on('mouseout', () => {
        this.sendHover({ dataItems: [], sourceElement: event.target })
      })

    if (this.lines.length > 0) {
      this.drawLines()
    }

    if (this.options.voronoiCells === true) {
      this.voronoiCells = undefined
      this.plotVoronoiCells()
    }

    if (this.cluster !== undefined && this.options.clusterHulls === true) {
      this.drawClusterHulls()
    }

    // (re-)arrange the title after possible rescaling the plot
    this.plot
      .selectAll('.title')
      .attr('x', this.width / 2)
      .attr('y', this.height)
  }

  /**
   * Determine the color according to cluster color (if set). Otherwise return cluster color according to colormap.
   * If there are no clusters, just return "black"
   * @param {DataItem} d
   * @returns {string} the color string
   */
  private getColorOfDataItem(d: DataItem): string {
    const clusterID: string | undefined = this.mapClusterID.get(d)
    // check whether the clusters for this scatterplot are set
    if (this.cluster !== undefined && clusterID !== undefined) {
      // get index of cluster id
      const ind: number = this.cluster.map((c: ClusterItem) => c.id).indexOf(clusterID)
      // if id is not contained in cluster ids -> color black
      // or case: data item is noise in DBSCAN / cluster is not set for data point
      if (ind < 0 || ind >= this.cluster.length) {
        return 'black'
      }

      // check whether the color is predefined
      if (this.cluster[ind].color) {
        return this.cluster[ind].color || 'black'
      } else {
        // take an appropriate color from the colormap (using modulo in case for #clusters > #colors
        return this.colormap[ind % this.colormap.length]
      }
    } else {
      return 'black'
    }
  }

  /**
   * Given cluster data, the polygon hulls of the clusters are drawn
   */
  private drawClusterHulls(): void {
    if (this.cluster) {
      const clusterPath = (c: ClusterItem) => {
        const items: DataItem[] | undefined = this.mapDataItems.get(c.id)
        if (items) {
          const hull = items.map((d: DataItem) => {
            return [this.xScale ? this.xScale(d.x) : 0, this.yScale ? this.yScale(d.y) : 0] as [number, number]
          })

          return 'M' + (polygonHull(hull) as [number, number][]).join('L') + 'Z'
        } else {
          return null
        }
      }

      // this.plot
      if (this.clusterHullLayer) {
        this.clusterHullLayer
          .selectAll<SVGPathElement, ClusterItem[]>('path.hull')
          .data<ClusterItem>(
            this.cluster.filter(g => {
              return g.relatedIDs.length > 2
            })
          )
          .enter()
          .insert('path', 'circle')
          .attr('d', clusterPath)
          .attr('id', (c: ClusterItem) => {
            return 'path_' + c.id
          })
          .style('fill', (c: ClusterItem) => {
            let color: string | null = null

            if (c.color) {
              color = c.color
            } else if (this.cluster) {
              for (let i = 0; i < this.cluster.length; i++) {
                if (c.id === this.cluster[i].id) {
                  const noOfClusterColors = this.colormap.length

                  color = this.colormap[i % noOfClusterColors]
                }
              }
            }

            return color
          })
          .style('opacity', 0.1)
          .classed('hull', true)
          .on('mouseover', (c: ClusterItem) => {
            const items: DataItem[] | undefined = this.mapDataItems.get(c.id)
            if (items) {
              // send selection because this might be multiple data items
              this.sendSelection({
                dataItems: items,
                sourceElement: event.target,
              })

              // highlights the cluster hull itself
              this.plot.select('#path_' + c.id).style('opacity', 0.4)
            }
          })
          .on('mouseout', (d: ClusterItem) => {
            // hides the tooltip
            this.sendSelection({ dataItems: [], sourceElement: event.target })

            // reset the hull's appearance
            this.plot.select('#path_' + d.id).style('opacity', 0.1)
          })
      }
    }
  }

  /**
   *  Calculate the extent for the plot.
   */
  private calculateExtent(): void {
    if (this.lines.length === 0) {
      this.xExtent = extent(this.data, d => d.x)
      this.yExtent = extent(this.data, d => d.y)
    } else {
      // if there are lines, extent might have to be adapted
      const dataXExtent = extent(this.data, d => d.x)
      const dataYExtent = extent(this.data, d => d.y)

      const m: LineItem[] = merge<LineItem>(this.lines.map((l: LineObject) => l.data))

      const lineXExtent = extent(m, d => d.x)
      const lineYExtent = extent(m, d => d.y)

      this.xExtent = extent([dataXExtent[0], dataXExtent[1], lineXExtent[0], lineXExtent[1]], d => d)
      this.yExtent = extent([dataYExtent[0], dataYExtent[1], lineYExtent[0], lineYExtent[1]], d => d)
    }
  }

  /**
   * Deduce the middle of the axes from the extent.
   */
  private calculateMiddle(): void {
    if (this.xExtent[0] !== undefined && this.xExtent[1] !== undefined) {
      this.xMiddle = ((this.xExtent[0] as number) + (this.xExtent[1] as number)) / 2
    }

    if (this.yExtent[0] !== undefined && this.yExtent[1] !== undefined) {
      this.yMiddle = ((this.yExtent[0] as number) + (this.yExtent[1] as number)) / 2
    }
  }

  /**
   * Scale the data items appropriate to screen.
   */
  private scaleData(): void {
    this.xScale = scaleLinear()
      .range([this.margin, this.width - this.margin])
      .domain(this.xExtent as [number, number])

    this.yScale = scaleLinear()
      .range([this.height - this.margin, this.margin])
      .domain(this.yExtent as [number, number])
  }

  /**
   * Add the axes.
   */
  private updateAxis(): void {
    this.xAxis = axisBottom<number>(this.xScale)
    this.yAxis = axisLeft<number>(this.yScale)

    this.plot
      .selectAll<AxisContainerElement, null>('.x.axis')
      .attr('transform', 'translate(0, ' + (this.height - this.margin) + ')')
      .call(this.xAxis)

    this.plot
      .selectAll<AxisContainerElement, null>('.y.axis')
      .attr('transform', 'translate( ' + this.margin + ', 0 )')
      .call(this.yAxis)
  }

  /**
   * Compute the voronoi cells.
   */
  private computeVoronoi(): void {
    const voronoiConstruction: VoronoiLayout<DataItem> = voronoi<DataItem>()
      .x(d => (this.xScale ? this.xScale(d.x) : 0))
      .y(d => (this.yScale ? this.yScale(d.y) : 0))
      .extent([[0, 0], [this.width, this.height]])

    this.voronoiCells = voronoiConstruction(this.data)
  }

  /**
   * Plot the voronoi cells and add hovering function.
   */
  private plotVoronoiCells(): void {
    this.computeVoronoi()
    if (this.voronoiCells === undefined) {
      return
    }

    const polygons: VoronoiPolygon<DataItem>[] = this.voronoiCells.polygons()

    if (this.voronoiLayer) {
      this.voronoiLayer
        .selectAll<SVGPathElement, VoronoiPolygon<DataItem>>('path')
        .data(polygons)
        .enter()
        .filter(d => {
          // tslint:disable-next-line
          return d !== undefined
        })
        .append('path')
        .attr('d', d => {
          return 'M' + d.join('L') + 'Z'
        })
        .attr('class', d => {
          return 'voronoiPath cell-' + d.data.id
        })
        .style('stroke', '#e1e8f7')
        .style('stroke-width', '0.5px')
        .style('fill', 'none')
        .style('pointer-events', 'all')
        .on('mouseenter', d => {
          const item: DataItem = { id: d.data.id, x: d.data.x, y: d.data.y }
          this.sendHover({ dataItems: [item], sourceElement: event.target })
        })
        .on('mouseout', d => {
          this.sendHover({ dataItems: [], sourceElement: event.target })
        })
    }
  }

  /**
   * Adds a d3-brush to the scatterplot allowing a group selection of data points.
   */
  private addGroupSelection(): void {
    // brushable region
    this.brush = brush<DataItem>()
      .extent([[0, 0], [this.width, this.height]])
      .on('start brush', () => {
        this.receiveSelection(null)
      })
      .on('end', () => {
        if (!event.selection) {
          this.sendSelection({ dataItems: [], sourceElement: event.target })
        } else {
          // coordinates of brush
          const s = event.selection
          const x0 = s[0][0]
          const y0 = s[0][1]
          const x1 = s[1][0]
          const y1 = s[1][1]

          const selectedDataItems: DataItem[] = []

          for (const dataItem of this.data) {
            if (this.xScale && this.yScale) {
              const xValue = this.xScale(dataItem.x)
              const yValue = this.yScale(dataItem.y)
              const brushed = x1 > xValue && xValue > x0 && (y1 > yValue && yValue > y0)

              // if data item is inside of brushed rectangle -> add id to array
              if (brushed) {
                selectedDataItems.push(dataItem)
              }
            }
          }

          const targetElement: HTMLElement = this.plot.select<HTMLElement>('rect.selection').node() as HTMLElement

          this.sendSelection({ dataItems: selectedDataItems, sourceElement: targetElement })
        }

        // make rectangle and brush-function invisible
        selectAll('.selection,.handle')
          .style('display', 'none')
          .attr('x', null)
          .attr('y', null)
          .attr('width', null)
          .attr('height', null)
      })

    this.plot
      .append<SVGGElement>('g')
      .attr('class', 'brush')
      .call(this.brush)
  }

  /**
   * Updates the appearance of the selected elements.
   * @param {VdScatterplotEvent} scatterplotEvent
   */
  private receiveSelection(scatterplotEvent: VdScatterplotEvent | null): void {
    // reset the appearance of all data items
    this.plot.selectAll('circle.datapoint').classed('selected', false)
    this.plot.selectAll('.linetrace').classed('selected', false)

    if (scatterplotEvent === null) {
      this.plot.selectAll('rect.selection').style('opacity', 0.5)
    } else {
      this.plot
        .selectAll<SVGCircleElement, DataItem>('circle.datapoint')
        .data(scatterplotEvent.dataItems, (d: DataItem) => d.id)
        .classed('selected', true)

      // select related lines - if available
      if (this.lines.length > 0 && scatterplotEvent.dataItems.length > 0) {
        this.plot
          .selectAll<SVGLineElement, LineObject>('.linetrace')
          .data<LineItem[]>(this.lines.map((lo: LineObject) => lo.data))
          .filter((d, i) => {
            const lineID: string = this.lines[i].id

            return scatterplotEvent.dataItems.map((data: DataItem) => data.id).includes(lineID)
          })
          .classed('selected', true)
      }
    }
  }

  /**
   * Draw lines contained in scatterplot
   */
  private drawLines(): void {
    const l = line<LineItem>()
      .x((d: LineItem) => this.xScale(d.x))
      .y((d: LineItem) => this.yScale(d.y))

    this.plot
      .selectAll('.linetrace')
      .data<LineItem[]>(this.lines.map((lo: LineObject) => lo.data))
      .enter()
      .append('path')
      .attr('class', 'linetrace')
      .style('stroke-dasharray', '2 2')
      .attr('fill', 'none')
      .attr('d', l)
      .attr('stroke', (d, i) => {
        const id = this.lines[i].id
        const dataItem: DataItem | undefined = this.mapData.get(id)
        if (dataItem !== undefined) {
          const color: string = this.getColorOfDataItem(dataItem)

          return color
        } else {
          return 'black'
        }
      })
      .on('mouseenter', (d, i) => {
        // get related data item - if possible
        const id: string = this.lines[i].id
        const dataItem: DataItem | undefined = this.mapData.get(id)

        if (dataItem !== undefined) {
          this.sendHover({ dataItems: [dataItem], sourceElement: event.target })
        }
      })
      .on('mouseout', d => {
        this.sendHover({ dataItems: [], sourceElement: event.target })
      })
  }
}
