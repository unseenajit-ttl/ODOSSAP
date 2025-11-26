import { ColumnProduct } from "./add_ColumnProduct"
import { C_ProductCode } from "./add_C_ProductCode"

export interface ColumnStructure
{
     SEDetailingID :number,
     StructureMarkId  :number,//
     StructureMarkingName  :string,//
     ProductCode :any ,//
     ParamSetNumber  :number,//
     MemberQty   :number,//
     ColumnWidth  :number,//
     ColumnLength  :number,//
     ColumnHeight  :number,//
     TotalNoOfLinks  :number,    //
     IsCLink  :any,  
     CLOnly  :any, 
     ProduceIndicator  :any, 
     BendingCheckInd  :any,
     ShapeCode :any
     TotalQty   :number,
     PinSize  :number,
     RowatLength  :number,
     RowatWidth  :number,    
     ClinkProductLength  :any ,
     ClinkProductWidth  :any ,
     ParentStructureMarkId:number
     
}