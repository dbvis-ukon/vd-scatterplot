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
   * The IDs of the data items that belong to the cluster.
   */
  relatedIDs: string[]
}
