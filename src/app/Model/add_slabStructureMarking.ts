import { Slab_ProductCode } from "./productcode";
import { ShapeCodeParameterSet } from "./ShapeCodeParameterSet";

export interface ADD_SLAB_STRUCTURE_MARKING{
    
      SEDetailingID :number,
      StructureMarkId: number,
      ParentStructureMarkId :number,
      StructureMarkingName :string,
      ParamSetNumber :number,
      MainWireLength :number,
      CrossWireLength :number,
      MemberQty :number,
      BendingCheck :boolean
      MachineCheck :boolean,
      TransportCheck :boolean,
      ProductCode :Slab_ProductCode,
      Shapecode:any,
      MultiMesh :boolean,
      ProduceIndicator :boolean,
      PinSize :number,     
      ProductGenerationStatus: boolean,
      ParameterSet :ShapeCodeParameterSet,
    // ParameterSet :any,
      SideForCode :string
      ProductSplitUp :boolean,
      MWLength:number,
      CWLength:number,
      MO1:number,
      MO2:number,
      CO1:number,
      CO2:number,
}