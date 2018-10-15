# VdScatterplot

This module is for easily plotting data in scatterplots using D3.
It provides options like showing axes, setting titles, width, and height related to
scatterplot, but also further extensions like plotting voronoi cells and cluster hulls,
brushing data groups or hovering single data items.

## Assumptions
A data point has at least the attributes "id", "x", and "y",
whereas the id is assumed to be unique. All occurrings of item ids related to a cluster 
have to be contained in the data (otherwise an error is thrown).

## Notes
When activating the voronoi cells there is no brushing of data item groups possible anymore.

## Doc Links
(for total doc and most important parts)

* ["doc"](./docs/)
* ["vd-scatterplot"](./docs/classes/_vd_scatterplot_.vdscatterplot.md)
* ["vd-scatterplot-options"](./docs/interfaces/_vd_scatterplot_options_.vdscatterplotoptions.md)


## Example
```typescript
const data: DataItem[] = [
  {
    id: '0',
    x: 0,
    y: 0,
  },
  {
    id: '1',
    x: 1,
    y: 1,
  }];
  
  
const cluster: ClusterItem[] = [
    {
      id: '1',
      relatedItems: [data[0]]
    },
    {
      id: '2',
      relatedItems: [data[1]]
    }
  ]
  
  
const scatterplot: VdScatterplot = new VdScatterplot(document.getElementById('scatterplot') as HTMLElement, { voronoiCells: true})
  
scatterplot.setData(data)
  
  
scatterplot.setCluster(cluster);
  
  
scatterplot.setOptions({axis: true, clusterHulls: true, voronoieCells: false, width: 500, height:500});

scatterplot.observeHoverBrush().subscribe((evt: VdScatterplotEvent) => {
  if(evt.dataItems.length > 0) {
    console.log("observing the hovering of ", evt.dataItems);
  }
})
```

