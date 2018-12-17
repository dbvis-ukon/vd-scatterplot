import {LineItem} from "./line-item";

export interface LineObject{

  /**
   * The id of a line
   */
  id: string

  /**
   * The data associated with the line
   */
  data: LineItem[]

}
