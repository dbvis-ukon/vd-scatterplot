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
   * The data-item-ids that belong to the cluster.
   */
  relatedItemIds: string[]
}
