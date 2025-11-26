import { number } from "mathjs"

export interface BoredPileElevationStiffenerModel {
    CustomerCode : string,
    ProjectCode : string,
    Template : boolean,
    JobId : number,
    CageId : number,
    Sr1Location : number,
    Sr2Location: number,
    Sr3Location: number,
    Sr4Location: number,
    Sr5Location: number,
    NoOfSr: number,
    LminTop: number,
    LminEnd: number,
    rings_start?: number,
    no_of_sr?: number
}
export interface BoredPileCustomMainBarModel {
  CustomerCode : string,
  ProjectCode : string,
  Template : boolean,
  JobId : number,
  CageId : number,
  CustomizeBarsJSON: string,
  main_bar_ct?: string
}
