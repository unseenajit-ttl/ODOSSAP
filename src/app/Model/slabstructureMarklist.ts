import { slabproductcode } from "./slabproductcode";

export interface SlabStructureMarklist 
 {
   SEDetailingID:number,// 304,
   StructureMarkId: number,//552,
   ParentStructureMarkId: number,//0,
   StructureMarkingName:string ,//,
   ParamSetNumber: number,
   MainWireLength: number,
   CrossWireLength: number,
   MemberQty: number,
   BendingCheck: any,
   MachineCheck: any,
   TransportCheck: any,
   ProductCode: slabproductcode,
   MultiMesh: any,
   ProduceIndicator: any,
   PinSize: number,
   SlabProduct: any[],
   ProductGenerationStatus: any,
   ParameterSet: any,
   SideForCode:any,
   ProductSplitUp: any
}