
export interface ADD_NewGroupMarkModel {
    GroupMarkId: number,
    GroupMarkName: string,
    GroupRevisionNumber: number,
    ProjectId: number,
    WBSTypeId: number,
    StructureElementTypeId: number,
    SitProductTypeId: number,
    ParameterSetNumber: number,
    transport: number,
    IsCABOnly: number,
    Remarks: string,
    CreatedUserId: number,
    CreatedUserName: string,
    SiderForCode: string
}