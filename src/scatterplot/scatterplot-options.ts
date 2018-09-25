export interface ScatterplotOptions {
  /**
   * Set individual colormap for clusters.
   */
  colormap?: string[]

  /**
   * Set individual width of the scatterplot.
   */
  width?: number

  /**
   * Set individual height of the scatterplot.
   */
  height?: number

  /**
   * Turn on/off the axis of the plot. Default: off.
   */
  axis?: boolean

  /**
   * Turn on/off the drawing of polygonal hulls of the clusters (if clusters are given).
   */
  clusterHulls?: boolean

  /**
   * Turn on/off the drawing of voronoi cells.
   */
  voronoiCells?: boolean
}
