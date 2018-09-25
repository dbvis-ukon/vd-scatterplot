import { DataItem } from './data-item'

export interface ScatterplotEvent {
  /**
   * The dataItems which were selected/hovered.
   */
  dataItems: DataItem[]

  sourceElement: HTMLElement
}
