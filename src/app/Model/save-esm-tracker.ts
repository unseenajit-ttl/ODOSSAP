export interface SaveEsmTracker {
    TrakingId: string,
    ProjectId: number,
    ContractNo: number,
    PONumber: string,
    WBSElementId: number,
    StructureElementTypeId: number,
    ProductTypeId: number,
    BBSNO: string,
    BBSSDesc: string,
    ReqDate: string,
    IntRemark: string,
    ExtRemark: string,
    OrdDate: string,
    ProdDate: string,
    OrderType: string,
    Location: string,
    OverDelTolerance: number,//double
    UnderDelTolerance: number,//
    ContactPerson: string,
    EstimatedWeight: number,
}