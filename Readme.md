# VdScatterplot

This module is for easily plotting data in scatterplots using D3.
It provides options like showing axes, setting titles, width, and height related to
scatterplot, but also further extensions like plotting voronoi cells and cluster hulls,
brushing data groups or hovering single data items.

## Assumptions
A data point has at least the attributes "id", "x", and "y",
whereas the id is assumed to be unique.

## Example
<code>

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
  
  
const scatterplot: Scatterplot = new Scatterplot(document.getElementById('scatterplot') as HTMLElement, { voronoiCells: true})
  
  scatterplot.setData(data)
  
  
  scatterplot.setCluster(cluster);
  
  
  scatterplot.setOptions({axis: true, clusterHulls: true, voronoieCells: false, width: 500, height:500});

</code>

