import { _YAxis } from "@angular/cdk/scrolling";

export interface BBSOrderdetailsTableInput {
    elementmark: string,
    Mark: string,
    Type: string,
    BarSize: string,
    standardbar: boolean,
    Memberqty: string,
    Eachqty: string,
    BarTotalQty: string,
    Shapecode: string,
    A: string,
    B: string,
    C: string,
    D: string,
    E: string,
    F: string,
    G: string,
    //-----------
    H: string,
    I: string,
    J: string,
    K: string,
    L :string,
    M: string,
    N: string,
    O: string,
    P: string,
    Q: string,
    R: string,
    S: string,
    T :string,
    U: string,
    V: string,
    W: string,
    X: string,
    Y: string,
    Z: string,
    //-----------
    PinSize: string,
    BarLength: string,
    BarWeight: string,
    Remarks: string,
}

export interface BeamlinkmeshOrderTableInput {
   
    CustomerCode: string,
    ProjectCode:string,
    JobID: number,
    BBSID: number,
    D: number,
    E:number,
    P:number,
    Q:number,
    I:number,
    J:number,
    SplitNotes:string,
    UpdateDate: Date,
    UpdateBy: string,
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
    HOOK :number;
    LEG :number;
    MeshTotalWT :number;
    Remarks :string;
    MWLength :number;
    MWBOM :string;
    CWBOM :string;
    ProdMWDia :number;
  ProdMWSpacing :number;
  ProdCWDia :number;
  ProdCWSpacing :number;
  ProdMass :number;
  ProdMinFactor :number;
  ProdMaxFactor :number;
  ProdTwinInd :string;

   
}


export interface ctsmeshTableInput{
       
        CustomerCode : string
         ProjectCode : string
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
         UpdateDate : Date
         UpdateBy : string
         ProdMWDia :number;
         ProdMWSpacing :number;
         ProdCWDia :number;
         ProdCWSpacing :number;
         ProdMass :number;
         ProdMinFactor :number;
         ProdMaxFactor :number;
         ProdTwinInd :string;
         MeshShapeParameters : string
         MeshEditParameters : string
         MeshShapeParamTypes : string
         MeshShapeMinValues : string
         MeshShapeMaxValues : string
         MeshShapeWireTypes : string
}


export interface CTSMESHOthersDetailsModels{
  
  CustomerCode : string
   ProjectCode : string
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
   UpdateDate : Date
   UpdateBy : string
   
}



