import { VdScatterplot } from '../vd-scatterplot'
import {DataItem} from "../data-item";
import {ClusterItem} from "../cluster-item";

describe('VdScatterplot', () => {
  it('should initialize class', () => {
    const scatterplot = new VdScatterplot(document.body, {})
    expect(scatterplot).toBeInstanceOf(VdScatterplot)
  })

  it('should reject illegal data itmes', () => {
    const scatterplot = new VdScatterplot(document.body, {})
    const data: DataItem[] = [
      {
        id: '0',
        x: 0,
        y: 0,
      },
      {
        id: '1',
        x: 0.5,
        y: 0.5,
      },
    ]


    const cluster: ClusterItem[] = [
      {
        id: '1',
        relatedIDs: ["0", "4", "5"],
      },
    ]

    scatterplot.setData(data);
    expect(function(){scatterplot.setCluster(cluster)}).toThrowError()

  })
})
