import { DataItem } from './data-item'

export interface ClusterItem {
  /**
   * The id of the cluster.
   */
  id: string

  /**
   * Color of this cluster, optional.
   */
  color?: string

  /**
   * The Data items that belong to the cluster.
   */
  relatedItems: DataItem[]
}
