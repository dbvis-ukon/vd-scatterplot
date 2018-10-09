import { ClusterItem } from './scatterplot/cluster-item'
import { DataItem } from './scatterplot/data-item'
import { VdScatterplot } from './scatterplot/vd-scatterplot'
import { VdScatterplotEvent } from './scatterplot/vd-scatterplot-event'
import './styles.less'

const data: DataItem[] = [
  {
    id: '0',
    x: 0,
    y: 0,
  },
  {
    id: '4',
    x: 0.5,
    y: 0.5,
  },
  {
    id: '5',
    x: 0.5,
    y: 0.8,
  },
  {
    id: '1',
    x: 1,
    y: 1,
  },
  {
    id: '2',
    x: 1,
    y: 0,
  },
  {
    id: '3',
    x: 0,
    y: 1,
  },
]


const cluster: ClusterItem[] = [
  {
    id: '1',
    relatedIDs: ["0", "1", "4", "5"],
  },
  {
    id: '2',
    relatedIDs: ["2", "3"],
  },
]


const scatterplot: VdScatterplot = new VdScatterplot(document.getElementById('scatterplot') as HTMLElement, {
  colormap: ['#2ECCFA', '#58FA82', '#FA8258'],
  axis: true,
  voronoiCells: true,
  clusterHulls: true,
})



scatterplot.setData(data)
scatterplot.setCluster(cluster)
