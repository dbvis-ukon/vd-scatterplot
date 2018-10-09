import { DataItem } from './data-item'

export interface VdScatterplotEvent {
  /**
   * The dataItems which were selected/hovered.
   */
  dataItems: DataItem[]

  sourceElement: HTMLElement
}
