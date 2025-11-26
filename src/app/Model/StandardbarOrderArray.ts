export interface StandardbarOrderArray {
  SNo: number;
  ProdType: string;
  ProdCode: string;
  ProdDesc: string;
  Diameter: Float32Array;
  Grade: string;
  UnitWT: number;
  order_pcs: number;
  order_wt: number;
  customerCode: string;
  projectCode: string;
  projectTitle: string;
  siteEngr_Name: string;
  siteEngr_HP: string;
  siteEngr_Tel: string;
  scheduler_Name: string;
  scheduler_HP: string;
  scheduler_Tel: string;
  contact1: string;
  contact2: string;
  contact3: string;
  contact4: string;
  contact5: string;
  contact6: string;
  tel1: string;
  tel2: string;
  tel3: string;
  tel4: string;
  tel5: string;
  tel6: string;
  email1: string;
  email2: string;
  email3: string;
  email4: string;
  email5: string;
  email6: string;
  projectCodeCAB: string;
  projectCodeMESH: string;
  projectCodeCage: string;
  espliceN: boolean;
  espliceS: boolean;
  nsplice: boolean;
  emailDistribution: string;
  advancedOrder: boolean;
  projectCAB: boolean;
  projectMESH: true;
  projectBPC: boolean;
  projectCage: boolean;
  MaxBarLength: number;
  bpc_template_editable: boolean;
  bpc_change_cagedata: boolean;
  bpc_order_misccages: boolean;
  bpc_spiral_lapping: string;
  customerBar: string;
  skipBendCheck: string;
  allowGrade500M: boolean;
  varianceBarSplit: string;
  transportMode: string;
  paymentType: string;
  bbsStandard: string;
  updateDate: string;
  updateBy: string;
  multiplier: number;
  GreenType: any
}

export interface ColumnMeshArray{
    CustomerCode :string;
    ProjectCode :string;
   JobID :number;
   BBSID :number;
   MeshID :number;
   MeshSort :number;
    MeshMark :string;
    MeshWidth :number;
    MeshLength :number;
    MeshProduct :string;
    MeshShapeCode :string;
    MeshTotalLinks :number;
    MeshHeight :number;
    MeshMemberQty :number;
    MeshCLinkRowsAtLen :number;
    MeshCLinkProductAtLen :string;
    MeshCLinkRowsAtWidth :string;
    MeshCLinkProductAtWidth :string;
    A :number;
    B :number;
    C :number;
    D :number;
    E :number;
    F :number;
    P :number;
    Q :number;
    LEG :number;
    MeshTotalWT :number;
    Remarks :string;
    MWLength :number;
    MWBOM :string;
    CWBOM :string;
    SplitNotes :string;

    MeshShapeParameters :string;
    MeshEditParameters :string;
    MeshShapeParamTypes :string;
    MeshShapeMinValues :string;
    MeshShapeMaxValues :string;
    MeshShapeWireTypes :string;

    ProdMWDia :number;
    ProdMWSpacing :number;
    ProdCWDia :number;
    ProdCWSpacing :number;
    ProdMass :number;
    ProdMinFactor :number;
    ProdMaxFactor :number;
    ProdTwinInd :string;
}


export interface BeamMeshArray {

    CustomerCode :string;

    ProjectCode :string;

    JobID :number;

    BBSID :number;

    MeshID :number;
    MeshSort :number;
    MeshMark :string;
    MeshWidth :number;
    MeshDepth :number;
    MeshSlope :number;
    MeshProduct :string;
    MeshShapeCode :string;
    MeshTotalLinks :number;
    MeshSpan :number;
    MeshMemberQty :number;
    MeshCapping :boolean;
    MeshCPProduct :string;
    A :number;
    B :number;
    C :number;
    D :number;
    E :number;
    F: Number;
    P :number;
    Q :number;
    HOOK :number;
    LEG :number;
    MeshTotalWT :number;
    Remarks :string;
    MWLength :number;
    MWBOM :string;
    CWBOM :string;
    SplitNotes :string;

    // MeshShapeParameters :string;
    // MeshEditParameters :string;
    // MeshShapeParamTypes :string;
    // MeshShapeMinValues :string;
    // MeshShapeMaxValues :string;
    // MeshShapeWireTypes :string;

    ProdMWDia :number;
    ProdMWSpacing :number;
    ProdCWDia :number;
    ProdCWSpacing :number;
    ProdMass :number;
    ProdMinFactor :number;
    ProdMaxFactor :number;
    ProdTwinInd :string;
}

export interface ctsmesharray{

  CustomerCode : string
  ProjectCode : number

   JobID : number

   BBSID : number

   MeshID : number
   MeshSort : number
   MeshMark : string
   MeshProduct : string
   MeshMainLen : number
   MeshCrossLen : number
   MeshMO1 : number
   MeshMO2 : number
   MeshCO1 : number
   MeshCO2 : number
   MeshMemberQty : number
   MeshShapeCode : string
   A : number
   B : number
   C : number
   D : number
   E : number
   F : number
   G : number
   H : number
   I : number
   J : number
   K : number
   L : number
   M : number
   N : number
   O : number
   P : number
   Q : number
   R : number
   S : number
   T : number
   U : number
   V : number
   W : number
   X : number
   Y : number
   Z : number
   HOOK : number
   MeshTotalWT : number
   Remarks : string
   MWBOM : string
   CWBOM : string

   MeshShapeParameters : string
   MeshEditParameters : string
   MeshShapeParamTypes : string
   MeshShapeMinValues : string
   MeshShapeMaxValues : string
   MeshShapeWireTypes : string

   MeshCreepMO1 : boolean
   MeshCreepCO1 : boolean

   ProdMWDia : number
   ProdMWSpacing : number
   ProdCWDia : number
   ProdCWSpacing : number
   ProdMass : number
   ProdTwinInd : string
   [key: string]: string | number | boolean | undefined; // Include boolean type

}

export interface precageArray{


  CustomerCode : string;

  ProjectCode : string;

  JobID : number;

  BBSID : number;

  BBSOrder : boolean;
  BBSStrucElem : string;
  BBSAssembly : boolean;
  BBSDrawing : number;

  BBSWidth : number;
  BBSDepth : number;
  BBSLength : number;

  BBSQty : number;

  BBSCABPcs : number;
  BBSCABWT : number;

  BBSBeamMESHPcs : number;
  BBSBeamMESHWT : number;

  BBSColumnMESHPcs : number;
  BBSColumnMESHWT : number;

  BBSCTSMESHPcs : number;
  BBSCTSMESHWT : number;

  BBSTotalPcs : number;
  BBSTotalWT : number;
  BBSCageMark : string;

  BBSRemarks : string;

  BBSNDSPostID : number;
  BBSNDSGroupMark : string;
  BBSNDSGroupMarkID : number;

  BBSSOR : string;

  UpdateDate : Date;
  UpdateBy : string;

}

export interface cabprcArray{

    CustomerCode : string;

    ProjectCode :string;

    JobID :number;

    BBSID :number;

    BarID :number;

    BarSort :number;

    Cancelled :boolean;

    BarCAB :boolean;

    BarSTD :boolean;

    ElementMark : string;

    BarMark :string;

    BarType :string;

    BarSize :number;

    BarMemberQty :number;

    BarEachQty :number;

    BarTotalQty :number;

    BarShapeCode :string;

    A :string;

    B :string;

    C :string;

    D :string;

    E :string;

    F :string;

    G :string;

    H :string;

    I :string;

    J :string;

    K :string;

    L :string;

    M :string;

    N :string;

    O :string;

    P :string;

    Q :string;

    R :string;

    S :string;
    T :string;
    U :string;
    V :string;
   W :string;

    X :string;
    Y :string;
    Z :string;

    BarLength :string;
    BarWeight :number;
    Remarks :string;

    shapeParameters :string;
    shapeLengthFormula :string;
    shapeParaValidator :string;
    shapeTransportValidator :string;

    shapeTransport : string;
  //null ; 0 -- normal 1 -- Low Bed 2 -- Low Bed wirh police escort

    PinSize :number;

   UpdateDate :Date;
}

export interface PreCastDetails {
  Precast_ID: string;
  CustomerCode: string;
  ProjectCode: string;
  JobID: number;
  ComponentMarking: string;
  Block: string;
  Level: number;
  Qty: string;
  Remark: string;
  PageNo: number;
  StructureElement: string;
  CreateDate: string; // ISO format date string
  CreatedBy: string;
  ModifiedDate: string; // ISO format date string
  ModifiedBy: string;
  OrderNumber: any;
  InGmList:number

}
