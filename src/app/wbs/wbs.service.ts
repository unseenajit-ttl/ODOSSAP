import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WBS } from '../Model/wbs';
import { WBSElements } from '../Model/WBSElements';
import { addPostingCCLMarkDetails } from '../Model/addPostingCCLMarkDetails';
import { GroupMark } from '../Model/groupmark';
import { SaveEsmTracker } from '../Model/save-esm-tracker';
import { EsmBBSCABPost } from '../Model/esm-bbscabpost';
import { BBSReleaseCAB } from '../Model/bbsrelease-cab';
import { GroupMarkIdCAB } from '../Model/group-mark-id-cab';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class WbsService {
  apiurl: any = environment.apiUrl;

  constructor(private httpClient: HttpClient,private loginService: LoginService) { }

  GetProductType(): Observable<any> {
    return this.httpClient.get<any[]>(this.apiurl + "WBSService/GetProductType");
    //return this.httpClient.get<any[]>("https://localhost:5006/GetProductType");

  }

  GetStructElement(): Observable<any> {
    return this.httpClient.get<any[]>(this.apiurl + "WBSService/GetStructElement");
    // return this.httpClient.get<any[]>("https://localhost:5006/GetStructElement");
    // https://localhost:5006/GetStructElement
  }


  SaveWBS_Extension(Wbsobject: WBS, ProjectCode: any) {
    // ProjectId = Number(ProjectId);
    // return this.httpClient.post<any>(this.apiurl + `WBSService/AddWbs/${ProjectId}`, Wbsobject);
    return this.httpClient.post<any>(this.apiurl + `WBSService/AddWBSExtension/${ProjectCode}`, Wbsobject);
    // https://localhost:5006/AddWbs/1
  }

  SaveWBS(Wbsobject: WBS, ProjectId: any) {
    ProjectId = Number(ProjectId);
    let UserID = this.loginService.GetUserId();
    return this.httpClient.post<any>(this.apiurl + `WBSService/AddWbs/${ProjectId}/${UserID}`, Wbsobject);
    // return this.httpClient.post<any>(`https://localhost:5006/AddWbs/${ProjectId}/${UserID}`, Wbsobject);
    //https://localhost:5006/AddWbs/1
  }
  GetWbsMaintainanceList(ProjectId: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiurl + `WBSService/GetWbsMaintainanceList/${ProjectId}`);
    //return this.httpClient.get<any[]>(`https://localhost:5006/GetWbsMaintainanceList/${ProjectId}`);
    // https://localhost:5006/GetWbsMaintainanceList/1
  }

  GetWBSCollapseLevel(wbsid: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiurl + `WBSService/GetWBSCollapseLevel/${wbsid}`);
    // return this.httpClient.get<any[]>(`https://localhost:5006/GetWBSCollapseLevel/${wbsid}`);
    // https://localhost:5006/GetWBSCollapseLevel

  }
  GetWBSElementsList(wbsid: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiurl + `WBSService/GetWBSElementsList/${wbsid}`);
    //return this.httpClient.get<any[]>(`https://localhost:5006/GetWBSElementsList/${wbsid}`);
    // https://localhost:5006/GetWBSElementsList
  }


  updatewbslist(Wbsobject: WBS) {
    let UserID = this.loginService.GetUserId();
    return this.httpClient.post<any>(this.apiurl + `WBSService/UpdateWbs/${UserID}`, Wbsobject);
    //return this.httpClient.post<any>(`https://localhost:5006/UpdateWbs/${UserID}`, Wbsobject);
    // https://localhost:5006/UpdateWbs
  }


  DeleteWbs(wbsid: any) {
    return this.httpClient.delete<any>(this.apiurl + `WBSService/deleteWbs/${wbsid}`);
    //return this.httpClient.delete<any>(`https://localhost:5006/deleteWbs/${wbsid}`);
    // https://localhost:5006/deleteWbs
  }

  DeleteSelectedWbs(selectedWBS: string) {
    return this.httpClient.delete<any>(this.apiurl + `WBSService/DeleteSelectedWbs/${selectedWBS}`);
    //return this.httpClient.delete<any>(`https://localhost:5006/DeleteSelectedWbs/${selectedWBS}`);

  }

  GetWbsStorey(): Observable<any> {
    return this.httpClient.get<any[]>(this.apiurl + "WBSService/GetWbsStorey");
    // return this.httpClient.get<any[]>("https://localhost:5006/GetWbsStorey");

  }

  DeleteSelectedStorey(WBSElementsObj: WBSElements, IsSet: any): Observable<any> {
    //  return this.httpClient.post<any[]>(`https://localhost:5006/DeleteSelectedStorey/${IsSet}`, WBSElementsObj);
    return this.httpClient.post<any[]>(this.apiurl + `WBSService/DeleteSelectedStorey/${IsSet}`, WBSElementsObj);
  }
  DeleteCollapseLevel(CollapseLevelId: any): Observable<any> {
    //return this.httpClient.delete<any[]>(`https://localhost:5006/DeleteWbsCollapseLevel/${CollapseLevelId}`);
    return this.httpClient.delete<any[]>(this.apiurl + `WBSService/DeleteWbsCollapseLevel/${CollapseLevelId}`);
  }


  // WBS POSTING

  GetWBSPostingGridList(ProjectId: any, ProductTypeId: any) {
    return this.httpClient.get<any[]>(this.apiurl + `WBSService/GetWbsPostingList/${ProjectId}/${ProductTypeId}`);
    // return this.httpClient.get<any[]>(`https://localhost:5006/GetWbsPostingList/${ProjectId}/${ProductTypeId}`);
  }

  POSTwbs(WBSobj: any) {
    let UserName = this.loginService.GetGroupName();
    WBSobj.UserName = UserName;
    return this.httpClient.post<any[]>(this.apiurl + `WBSService/PostBBS_Update`, WBSobj);
    //return this.httpClient.post<any[]>(`https://localhost:5006/PostBBS_Update`, WBSobj)
  }
  UN_POSTwbs(postHeaderId: number) {
    return this.httpClient.get<any[]>(this.apiurl + `WBSService/UnPostBBS_Update/${postHeaderId}`);
    //return this.httpClient.get<any[]>(`https://localhost:5006/UnPostBBS_Update/${postHeaderId}`)
  }

  GetGroupMarkingList(ProjectId: any, StructureElementId: any, ProductTypeId: any) {
    return this.httpClient.get<any[]>(this.apiurl + `WBSService/GetGroupMarkingList?intProjectId=${ProjectId}&intStructureElementId=${StructureElementId}&sitProductTypeId=${ProductTypeId}`);
    // return this.httpClient.get<any>(`https://localhost:5006/GetGroupMarkingList?intProjectId=${ProjectId}&intStructureElementId=${StructureElementId}&sitProductTypeId=${ProductTypeId}`);
    // https://localhost:5006/GetGroupMarkingList?intProjectId=5600&intWBSElementsId=265&intStructureElementId=1&sitProductTypeId=7
  }
  getGroupMarkingTable(postHeaderId: any, WBSElementsId: any, StructureElementId: any, ProductTypeId: any, BBSNo: any) {

    return this.httpClient.get<any[]>(this.apiurl + `WBSService/GetWBSAttachedGroupMark/${postHeaderId}`);
    // return this.httpClient.get<any[]>(`https://localhost:5006/GetWBSAttachedGroupMark/${postHeaderId}`);



  }

  updateGroupMark(WBSobj: any): Observable<any> {
    return this.httpClient.post<any[]>(this.apiurl + `WBSService/AddGroupMarkingAsync`, WBSobj);

    //return this.httpClient.post<any[]>(`https://localhost:5006/AddGroupMarkingAsync`, WBSobj)
  }
  GetPostCappingInfoList(PostHeaderId: any) {
    return this.httpClient.get<any>(this.apiurl + `WBSService/GetPostCappingInfoList/${PostHeaderId}`);

    //return this.httpClient.get<any>(`https://localhost:5006/GetPostCappingInfoList/${PostHeaderId}`);
    //https://localhost:5006/GetPostCappingInfoList/159
  }
  GetPostClinkInfoList(PostHeaderId: any) {
    return this.httpClient.get<any>(this.apiurl + `WBSService/GetPostClinkInfoList/${PostHeaderId}`);
    //return this.httpClient.get<any>(`https://localhost:5006/GetPostClinkInfoList/${PostHeaderId}`);
    // https://localhost:5006/GetPostClinkInfoList/159
  }
  AddPostingCCLMarkDetails(WBSobj: addPostingCCLMarkDetails) {
    return this.httpClient.post<any[]>(this.apiurl + `WBSService/AddPostingCCLMarkDetails`, WBSobj);
    //return this.httpClient.post<any[]>(`https://localhost:5006/AddPostingCCLMarkDetails`, WBSobj)
  }
  AddPostingCLinkCCLMarkDetails(WBSobj: addPostingCCLMarkDetails) {
    return this.httpClient.post<any[]>(this.apiurl + `WBSService/AddPostingCLinkCCLMarkDetails`, WBSobj);
    //return this.httpClient.post<any[]>(`https://localhost:5006/AddPostingCLinkCCLMarkDetails`, WBSobj)
  }
  GetPostingCappingHeaderInfo(WBSElementsId: any, ParentId: any) {
    return this.httpClient.get<any>(this.apiurl + `WBSService/GetPostingCappingHeaderInfo/${WBSElementsId}/${ParentId}`);
    // return this.httpClient.get<any>(`https://localhost:5006/GetPostingCappingHeaderInfo/${WBSElementsId}/${ParentId}`)
    // https://localhost:5006/GetPostingCappingHeaderInfo/25/0
  }
  GetPostingCLinkHeaderInfo(WBSElementsId: any, ParentId: any) {
    return this.httpClient.get<any>(this.apiurl + `WBSService/GetPostingCLinkHeaderInfo/${WBSElementsId}/${ParentId}`);
    //return this.httpClient.get<any>(`https://localhost:5006/GetPostingCLinkHeaderInfo/${WBSElementsId}/${ParentId}`)
    // https://localhost:5006/GetPostingCLinkHeaderInfo/25/0
  }
  BBSRelease(WBSobj: any) {
    let UserName = this.loginService.GetGroupName();
    const username = UserName.split('@')[0];
    WBSobj.UserName = username;
    return this.httpClient.post<any[]>(this.apiurl + `WBSService/AddBBSRelease`, WBSobj);
    //return this.httpClient.post<any[]>(`https://localhost:5006/AddBBSRelease`, WBSobj)
  }
  DeletePostingGroupMarkingDetail(PostHeaderId: any, GroupMarkId: any): Observable<any> {
    return this.httpClient.delete<any[]>(this.apiurl + `WBSService/DeletePostingGroupMarkingDetail/${PostHeaderId}/${GroupMarkId}`);
    // return this.httpClient.delete<any[]>(`https://localhost:5006/DeletePostingGroupMarkingDetail/${PostHeaderId}/${GroupMarkId}`);
    // return this.httpClient.delete<any[]>(this.apiurl + `WBSService/DeletePostingGroupMarkingDetail/${PostHeaderId}/${GroupMarkId}`);
  }
  DeletePostingCapStructure(PostHeaderId: any, vchProductCode: any, Width: any, ShapeCode: any, StructMarkId: any): Observable<any> {
    return this.httpClient.delete<any[]>(this.apiurl + `WBSService/DeletePostingCapStructure/${PostHeaderId}/${vchProductCode}/${Width}/${ShapeCode}/${StructMarkId}`);
    //return this.httpClient.delete<any[]>(`https://localhost:5006/DeletePostingCapStructure/${PostHeaderId}/${vchProductCode}/${Width}/${ShapeCode}/${StructMarkId}`);
    //https://localhost:5006/DeletePostingCapStructure/0/0/0/0/0
  }
  DeletePostingCLinkStructure(PostHeaderId: any, vchProductCode: any, Width: any, ShapeCode: any, StructMarkId: any): Observable<any> {
    return this.httpClient.delete<any[]>(this.apiurl + `WBSService/DeletePostingCLinkStructure/${PostHeaderId}/${vchProductCode}/${Width}/${ShapeCode}/${StructMarkId}`);

    //return this.httpClient.delete<any[]>(`https://localhost:5006/DeletePostingCLinkStructure/${PostHeaderId}/${vchProductCode}/${Width}/${ShapeCode}/${StructMarkId}`);
    //https://localhost:5006/DeletePostingCapStructure/0/0/0/0/0
  }
  GetCapProductList(ENTEREDTEXT: any) {
    return this.httpClient.get<any>(this.apiurl + `WBSService/GetCapProductList/${ENTEREDTEXT}`);

    // return this.httpClient.get<any>(`https://localhost:5006/GetCapProductList/${ENTEREDTEXT}`)
    // https://localhost:5006/GetCapProductList/SD
  }
  GetClinkProductList(ENTEREDTEXT: any) {
    return this.httpClient.get<any>(this.apiurl + `WBSService/GetClinkProductList/${ENTEREDTEXT}`);
    //return this.httpClient.get<any>(`https://localhost:5006/GetClinkProductList/${ENTEREDTEXT}`)
    // https://localhost:5006/GetClinkProductList/SD
  }
  GetCapShapeCodeList(ENTEREDTEXT: any) {
    return this.httpClient.get<any>(this.apiurl + `WBSService/GetCapShapeCodeList/${ENTEREDTEXT}`);
    // return this.httpClient.get<any>(`https://localhost:5006/GetCapShapeCodeList/${ENTEREDTEXT}`)
    // https://localhost:5006/GetCapShapeCodeList/C
  }
  GetClinkShapeCodeList(ENTEREDTEXT: any) {
    return this.httpClient.get<any>(this.apiurl + `WBSService/GetClinkShapeCodeList/${ENTEREDTEXT}`);
    //return this.httpClient.get<any>(`https://localhost:5006/GetClinkShapeCodeList/${ENTEREDTEXT}`)
    // https://localhost:5006/GetClinkShapeCodeList/2
  }

  GetMO1CO1MO2CO2List(PostHeaderId: any, vchProductCode: any, MWLength: any, CWlength: any) {
    return this.httpClient.get<any>(this.apiurl + `WBSService/GetPostClinkMO1MO2CO1Co2/${PostHeaderId}/${MWLength}/${vchProductCode}/${CWlength}`);
    // return this.httpClient.get<any>(`https://localhost:5006/GetPostClinkMO1MO2CO1Co2/${PostHeaderId}/${MWLength}/${vchProductCode}/${CWlength}`);
    // https://localhost:5006/GetGroupMarkingList?intProjectId=5600&intWBSElementsId=265&intStructureElementId=1&sitProductTypeId=7
  }

  // updateGroupMarkDetails(PostHeaderId: any, intGroupMarkId: any, tntGroupQty: any, VCHRemarks: any, intUpdatedId: any): Observable<any> {
  //   // return this.httpClient.get<any>(this.apiurl + `WBSService/UpdatePostingGroupMarkingDetail/${PostHeaderId}/${intGroupMarkId}/${tntGroupQty}/${VCHRemarks}/${intUpdatedId}`);

  //   return this.httpClient.get<any[]>(`https://localhost:5006/UpdatePostingGroupMarkingDetail/${PostHeaderId}/${intGroupMarkId}/${tntGroupQty}/${VCHRemarks}/${intUpdatedId}`);
  // }
  updateGroupMarkDetails(PostHeaderId: any, intGroupMarkId: any, tntGroupQty: any, VCHRemarks: any, intUpdatedId: any): Observable<any> {
    // Creating the object directly within the function
    const groupMarkDetails = {
      PostHeaderId: PostHeaderId,
      intGroupMarkId: intGroupMarkId,
      tntGroupQty: tntGroupQty,
      VCHRemarks: VCHRemarks,
      intUpdatedId: intUpdatedId
    };

    // Sending the object as the body in the POST request
    return this.httpClient.post<any>(
      this.apiurl + 'WBSService/UpdatePostingGroupMarkingDetailNew',
      groupMarkDetails
    );

    // return this.httpClient.post<any>(
    //   `https://localhost:5006/UpdatePostingGroupMarkingDetailNew`,
    //   groupMarkDetails
    // );
  }
  PostBBSAsync(postHeaderId: any, userId: any, Modular: any) {

    let UserName = this.loginService.GetGroupName();
    const username = UserName.split('@')[0];
    // return this.httpClient.get<any>(`https://localhost:5006/PostBBSAsync/${postHeaderId}/${userId}/${Modular}/${username}`);
    return this.httpClient.get<any[]>(this.apiurl + `WBSService/PostBBSAsync/${postHeaderId}/${userId}/${Modular}/${username}`);

  }

  //getContractNo

  getContractNo(pCustomerCode: any, pProjectCode: any, pProdType: any,) {
    return this.httpClient.get<any>(this.apiurl + `OrderService/getContractNo_WBSExtension/${pCustomerCode}/${pProjectCode}/${pProdType}`);
    // return this.httpClient.get<any>(`https://localhost:5009/getContractNo_WBSExtension/${pCustomerCode}/${pProjectCode}/${pProdType}`);

  }

  //added by vidya for ESMCABBBS

  LoadTrackingNo(TrackingId: any) {
   return this.httpClient.get<any>(this.apiurl + `DrainService/LoadSOR/${TrackingId}`);
   //return this.httpClient.get<any>(`https://localhost:5012/LoadSOR/${TrackingId}`);

  }

  ESM_BBSPostingCAB_Get_Range(FROM_SOR: any, TO_SOR: any) {
    return this.httpClient.get<any>(this.apiurl + `DrainService/LoadWBSBySorRange/${FROM_SOR}/${TO_SOR}`);
    //return this.httpClient.get<any>(`https://localhost:5012/LoadWBSBySorRange/${FROM_SOR}/${TO_SOR}`);

  }

  BBSPostingCABGM_Get(intProjectId: any, BBSNo: any) {
    let obj={
      projectId:intProjectId,
      enteredText :BBSNo
    }
    return this.httpClient.post<any>(this.apiurl + `DrainService/BBSPostingCABGM_Get`,obj);
    //return this.httpClient.post<any>(`https://localhost:5012/BBSPostingCABGM_Get`,obj);

  }

  PostBBSPostingCAB(obj: EsmBBSCABPost) {

    let UserName = this.loginService.GetGroupName();
    const username = UserName.split('@')[0];
    obj.Username = username;
    //return this.httpClient.post<any>(`https://localhost:5012/BBSPostingCAB_Post`,obj);

    return this.httpClient.post<any>(
      this.apiurl + `DrainService/BBSPostingCAB_Post`,obj
    );
  }

  UnpostPostBBSPostingCAB(ProjectId:any, WBSElementId: any, GroupMarkId: any, BBS_NO: any) {

    let obj={
      intProjectId:ProjectId,
      intWBSElementId :WBSElementId,
      intGroupMarkId:GroupMarkId,
      BBS_NO:BBS_NO
    }

    //return this.httpClient.post<any>(`https://localhost:5012/BBSPostingCAB_Unpost`,obj);

    return this.httpClient.post<any>(
      this.apiurl + `DrainService/BBSPostingCAB_Unpost`,obj
    );
  }

  BBSReleaseCAB(obj:BBSReleaseCAB) {

    let UserName = this.loginService.GetGroupName();
    const username = UserName.split('@')[0];
    obj.Username = username;
    //return this.httpClient.post<any>(`https://localhost:5012/ESM_BBSReleaseCAB_Insert`,obj);

    return this.httpClient.post<any>(
      this.apiurl + `DrainService/ESM_BBSReleaseCAB_Insert`,obj
    );
  }

  GroupMarkIdCAB_Get(obj:GroupMarkIdCAB) {

    let UserName = this.loginService.GetGroupName();
    const username = UserName.split('@')[0];
    obj.Username = username;
    //return this.httpClient.post<any>(`https://localhost:5012/GroupMarkIdCAB_Get`,obj);

    return this.httpClient.post<any>(
      this.apiurl + `DrainService/GroupMarkIdCAB_Get`,obj
    );
  }

  ///COPYbbS
  LoadSOR_CopyBBS(SorNo: any) {
    if (!SorNo) {
      SorNo = 1;
    }
  return this.httpClient.get<any>(this.apiurl + `DrainService/LoadSOR_CopyBBS/${SorNo}`);
   //return this.httpClient.get<any>(`https://localhost:5012/LoadSOR_CopyBBS/${SorNo}`);

  }


  GetBBSPostingCABRange(fromSor: any, toSor: any) {
    return this.httpClient.get<any>(this.apiurl + `DrainService/GetBBSPostingCABRange/${fromSor}/${toSor}`);
    //return this.httpClient.get<any>(`https://localhost:5012/GetBBSPostingCABRange/${fromSor}/${toSor}`);

  }


  CheckBbsSource(bbsSource: any) {
    let obj={
      enteredText:bbsSource,
      projectId:0

    }
    return this.httpClient.post<any>(this.apiurl + `DrainService/CheckBbsSource`,obj);
   //return this.httpClient.post<any>(`https://localhost:5012/CheckBbsSource`,obj);

  }

  GetCopyBBSUID(SourceBBSNumber: any,BBSNumber:any, WBSElementID:any, structureElementType:any, ProjectID:any) {
    let obj={
      bbsSource:SourceBBSNumber,
      bbsTarget:BBSNumber,
      wbsId:WBSElementID,
      vchStructureElementType:structureElementType,
      pojId:ProjectID

    }
    return this.httpClient.post<any>(this.apiurl + `DrainService/GetCopyBBSUID`,obj);
    //return this.httpClient.post<any>(`https://localhost:5012/GetCopyBBSUID`,obj);

  }

  InsertProductMarkCopyBBS(seIdSource: any,seIdTarget:any, groupMarkId:any) {
     return this.httpClient.get<any>(this.apiurl + `DrainService/InsertProductMarkCopyBBS/${seIdSource}/${seIdTarget}/${groupMarkId}`);
    //return this.httpClient.get<any>(`https://localhost:5012/InsertProductMarkCopyBBS/${seIdSource}/${seIdTarget}/${groupMarkId}`);

  }

  InsertTransdetailsCopyBBS(sourceTransId: any,seIdTarget:any) {
    let obj={
      sourceTransId:sourceTransId,
      seIdTarget:seIdTarget,

    }
    return this.httpClient.post<any>(this.apiurl + `DrainService/InsertTransdetailsCopyBBS`,obj);
    //return this.httpClient.post<any>(`https://localhost:5012/InsertTransdetailsCopyBBS/${sourceTransId}/${seIdTarget}`);
    //return this.httpClient.post<any>(`https://localhost:5012/InsertTransdetailsCopyBBS`,obj);

  }

  GetAccessoryCopyBBS(seIdSource: any) {
   return this.httpClient.get<any>(this.apiurl + `DrainService/GetAccessoryCopyBBS/${seIdSource}`);
  //  return this.httpClient.get<any>(`https://localhost:5012/GetAccessoryCopyBBS/${seIdSource}`);

  }


  InsertAccessoryCopyBBS(obj: any) {
    return this.httpClient.post<any>(this.apiurl + `DrainService/InsertAccessoryCopyBBS`,obj);
    //return this.httpClient.post<any>(`https://localhost:5012/InsertAccessoryCopyBBS`, obj);

  }

  LoadBBS_CopyBBS(ProjId: any,enteredText:any) {
    let obj={
      projectId:ProjId,
      enteredText :enteredText
    }
    return this.httpClient.post<any>(this.apiurl + `DrainService/LoadBBS_Copybbs`,obj);
    //return this.httpClient.post<any>(`https://localhost:5012/LoadBBS_Copybbs`,obj);

   }


   InvalidData_Get(groupmarkingId: any,) {
    return this.httpClient.get<any>(this.apiurl + `WBSService/InvalidData_Get/${groupmarkingId}`);
    // return this.httpClient.get<any>(`https://localhost:5006/InvalidData_Get/${groupmarkingId}`);

   }
   GetGroupMarkID_CopyBBS(obj:GroupMarkIdCAB) {

    let UserName = this.loginService.GetGroupName();
    const username = UserName.split('@')[0];
    obj.Username = username;
    //return this.httpClient.post<any>(`https://localhost:5012/GetGroupMarkID_CopyBBS`,obj);

     return this.httpClient.post<any>(
       this.apiurl + `DrainService/GetGroupMarkID_CopyBBS`,obj
     );
  }
  GetPrecastCount(ProjectCode: string, CustomerCode : string, Postheaderid: number) {
    // return this.httpClient.get<any>(this.apiurl + `WBSService/GetPrecastCount/${ProjectCode}/${CustomerCode}/${Postheaderid}`);
     return this.httpClient.get<any>(`https://localhost:5006/GetPrecastCount/${ProjectCode}/${CustomerCode}/${Postheaderid}`);

  }
  Drawing_Approval(wbsid:number,status:any)
   {
    return this.httpClient.get<any>(this.apiurl + `WBSService/Drawing_Status/${status}/${wbsid}`);
    // return this.httpClient.get<any>(`https://localhost:5006/Drawing_Status/${status}/${wbsid}`)
   }


   SendEmail(obj:any) {


    //  return this.httpClient.post<any>(`https://localhost:5006/SendEmail`,obj );
     return this.httpClient.post<any>(
      this.apiurl + `WBSService/SendEmail`,obj
    );
  }
  Drawing_User_data(projectCode:any)
  {

   return this.httpClient.get<any>(this.apiurl + `WBSService/Get_User_drawingData/${projectCode}`)
  //  return this.httpClient.get<any>(`https://localhost:5006/Get_User_drawingData/${projectCode}`)

  }
  Edit_user_review(UserReview:any,DrawingId:any)
  {

   return this.httpClient.get<any>(this.apiurl + `WBSService/Insert_User_review/${UserReview}/${DrawingId}`)
  //  return this.httpClient.get<any>(`https://localhost:5006/Insert_User_review/${UserReview}/${DrawingId}`)

  }
  GetUserNamesByCustomerAndProject(pCustomerCode: any,pProjectCode:any,wbselementids:any) {
    // return this.httpClient.get<any>(`https://localhost:5006/GetUserNamesByCustomerAndProject/${pCustomerCode}/${pProjectCode}`);
      return this.httpClient.get<any>(this.apiurl + `WBSService/GetUserNamesByCustomerAndProject/${pCustomerCode}/${pProjectCode}/${wbselementids}`);
  }
  GetDetailersByCustomerAndProject(pCustomerCode: any,pProjectCode:any,WBSid:any) {
    // return this.httpClient.get<any>(`https://localhost:5006/GetDetailersByCustomerAndProject/${pCustomerCode}/${pProjectCode}`);
      return this.httpClient.get<any>(this.apiurl + `WBSService/GetDetailersByCustomerAndProject/${pCustomerCode}/${pProjectCode}/${WBSid}`);
  }
  Submit_drawing_details(obj:any)
  {
    return this.httpClient.post<any>(this.apiurl + `WBSService/uploadDrawingFiles_New`,obj)
    // return this.httpClient.post<any>(`https://localhost:5006/uploadDrawingFiles_New`,obj)

  }
  Get_Drawing_Data_new(wbsid:any)
  {

   return this.httpClient.get<any>(this.apiurl + `WBSService/Get_Drawing_Data_new/${wbsid}`)
  //  return this.httpClient.get<any>(`https://localhost:5006/Get_Drawing_Data_new/${wbsid}`)

  }
  Submit_drawing_details_New(obj:any)
  {
    return this.httpClient.post<any>(this.apiurl + `WBSService/uploadDrawingFiles_New_Table`,obj)
    // return this.httpClient.post<any>(`https://localhost:5006/uploadDrawingFiles_New_Table`,obj)

  }
  Drawing_User_data_new(projectCode:any)
  {

   return this.httpClient.get<any>(this.apiurl + `WBSService/Get_User_drawingData_new/${projectCode}`)
  //  return this.httpClient.get<any>(`https://localhost:5006/Get_User_drawingData_new/${projectCode}`)

  }
  Get_submission_status(wbsid:any)
  {

   return this.httpClient.get<any>(this.apiurl + `WBSService/Get_Submission_status/${wbsid}`)
  //  return this.httpClient.get<any>(`https://localhost:5006/Get_Submission_status/${wbsid}`)

  }
  deleteDrawing(CustomerCode: string, ProjectCode: string, DrawingID: number) {
    let UserName = this.loginService.GetGroupName();
    // return this.httpClient.get<any>(`http://localhost:55592/api/SharePointAPI/deleteDrawing_wbsPosting/${CustomerCode}/${ProjectCode}/${DrawingID}`);
    return this.httpClient.get<any>(
      `https://devodos.natsteel.com.sg/SAP_API/api/SharePointAPI/deleteDrawing_wbsPosting/${CustomerCode}/${ProjectCode}/${DrawingID}`
    );
  }
  Modify(obj: any) {
    // return this.httpClient.post<any>(`https://localhost:5006/modiftDrawing_posting`, obj);
    return this.httpClient.post<any>(
      this.apiurl + `WBSService/modiftDrawing_posting`,
      obj
    );
  }
  UpdateDrawingApprovalStatus(obj: any) {


    // return this.httpClient.post<any>(`https://localhost:5006/UpdateDrawingApprovalStatus`,obj );
    return this.httpClient.post<any>(
      this.apiurl + `WBSService/UpdateDrawingApprovalStatus`, obj
    );
  }
  check_Order_docs(
    OrderNumber: number,
    StructureElement: string,
    ProductType: string,
    ScheduledProd: string
  ) {
    ScheduledProd="N";
    // return this.httpClient.get<any>(`https://localhost:5006/checkOrderDocs_2/${OrderNumber}/${StructureElement}/${ProductType}/${ScheduledProd}`);
    return this.httpClient.get<any>(
      this.apiurl +
      `WBSService/checkOrderDocs_2/${OrderNumber}/${StructureElement}/${ProductType}/${ScheduledProd}`
    );
  }

  uploadFile_Posting(
    file: File,
    customer: any,
    project: any,
    OrderNumber: any,
    DrawingNo: any,
    Remarks: any,
    WBS1: any,
    WBS2: any,
    WBS3: any,
    ProdType: any,
    StructureElement: any,
    UploadType: any,
    ScheduledProd: any,
    Revision: any,
    wbsElementId:any,
    UserName :any,
    IsDuplicate:any,
    FileSumittedBy:any

  ): Observable<any> {
    OrderNumber = wbsElementId;
    UserName = this.loginService.GetGroupName()
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('Customer', customer);
    formData.append('Project', project);
    formData.append('OrderNumber', OrderNumber);
    formData.append('DrawingNo', DrawingNo);
    formData.append('Remarks', Remarks);
    formData.append('WBS1', WBS1);
    formData.append('WBS2', WBS2);
    formData.append('WBS3', WBS3);
    formData.append('ProdType', ProdType);
    formData.append('StructureElement', StructureElement);
    formData.append('UploadType', UploadType);
    formData.append('ScheduledProd', ScheduledProd);
    formData.append('Revision', Revision);
    formData.append('UserName', UserName);
    formData.append('IsDuplicate', IsDuplicate);
    formData.append('FileSumittedBy', FileSumittedBy);
    // formData.append('UserName', UserName);
    // // formData.append('UserType', UserType);
  //   const formData = {
  //     DrawingId: 0, // Assign DrawingId here, if available
  //     DrawingNo: DrawingNo,
  //     CustomerCode: customer, // Mapping 'customer' to 'CustomerCode'
  //     ProjectCode: project, // Mapping 'project' to 'ProjectCode'
  //     FileName: file.name, // Using file's name for FileName
  //     Revision: Revision,
  //     DetailerRemark: Remarks, // Mapping 'Remarks' to 'DetailerRemark'
  //     CustomerRemark: '', // If needed, else leave as an empty string or handle appropriately
  //     WBSElementID: 0, // Combine WBS1, WBS2, WBS3 into a proper ID, or leave null for now
  //     SubmitDate: new Date().toISOString(), // Assuming the current date for submission
  //     SubmitBy: UserName, // Mapping 'UserName' to 'SubmitBy'
  //     ApprovedBy: '', // If needed, else leave empty or handle appropriately
  //     ApprovedDate: null, // Optional: handle the approval process
  //     IsApproved: false, // Handle this based on your logic
  //     IsSubmitted: true, // Assuming the form is being submitted
  //     IsSubmitMail: false, // Handle based on your use case
  //     IsApprovedMail: false, // Handle based on your use case
  //     IsDeleted: false, // Initially false
  //     File:file
  // };

  // const formData: FormData = new FormData();

  // // Sample values for the object fields
  // const DrawingId: number = 1;

  // const FileName: string = file.name;
  // // const Revision: number = 1;
  // const DetailerRemark: string = Remarks;
  // const CustomerRemark: string = "Approved";
  // // const WBSElementID: number = 2456;
  // const SubmitDate: Date = new Date("2025-03-06");
  // const SubmitBy: string = UserName;
  // const ApprovedBy: string = "Manager";
  // const ApprovedDate: Date = new Date("2025-03-06");
  // const IsApproved: boolean = true;
  // const IsSubmitted: boolean = true;
  // const IsSubmitMail: boolean = true;
  // const IsApprovedMail: boolean = false;
  // const IsDeleted: boolean = false;

  // // Append data to FormData
  // formData.append('File', file, file.name);
  // formData.append('DrawingId', DrawingId.toString());
  // formData.append('DrawingNo', DrawingNo);
  // formData.append('CustomerCode', CustomerCode);
  // formData.append('ProjectCode', ProjectCode);
  // formData.append('FileName', FileName);
  // formData.append('Revision', Revision.toString());
  // formData.append('DetailerRemark', DetailerRemark);
  // formData.append('CustomerRemark', CustomerRemark);
  // formData.append('WBSElementID', wbsElementId.toString());
  // formData.append('SubmitDate', SubmitDate.toISOString()); // Convert to ISO string
  // formData.append('SubmitBy', SubmitBy);
  // formData.append('ApprovedBy', ApprovedBy);
  // formData.append('ApprovedDate', ApprovedDate.toISOString()); // Convert to ISO string
  // formData.append('IsApproved', IsApproved.toString());
  // formData.append('IsSubmitted', IsSubmitted.toString());
  // formData.append('IsSubmitMail', IsSubmitMail.toString());
  // formData.append('IsApprovedMail', IsApprovedMail.toString());
  // formData.append('IsDeleted', IsDeleted.toString());

    // return this.httpClient.post<any>(
    //   `http://localhost:55592/api/SharePointAPI/uploadDrawingFiles_2`,
    //   formData
    // );

    return this.httpClient.post<any>(
      `https://devodos.natsteel.com.sg/SAP_API/api/SharePointAPI/uploadDrawingFiles_2`,formData
    );
  }
  modifyDrawing_Status(WBSID: any) {
    // return this.httpClient.get<any>(`https://localhost:5006/modifyDrawing_Status/${WBSID}`);
    return this.httpClient.get<any>(
      this.apiurl + `WBSService/modifyDrawing_Status/${WBSID}`
    );
  }
  getDrawingReport(
    FromDate: any,
    ToDate: any,
    customerCode: any,
    projectCode: any,

  ): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiurl +
      `WBSService/GetDrawingReport/${FromDate}/${ToDate}/${customerCode}/${projectCode}`
    );
     //return this.httpClient.get<any[]>(`https://localhost:5006/GetDrawingReport/${FromDate}/${ToDate}/${customerCode}/${projectCode}`);
  }

  // GetPrecastFlag(wbsID: any) {
  //   // return this.httpClient.get<any>(`https://localhost:5006/GetIsPrecast/${wbsID}`);
  //   return this.httpClient.get<any>(
  //     this.apiurl + `WBSService/GetIsPrecast/${wbsID}`
  //   );
  // }

  //   GetPrecastFlag(customerCode:any,projectCode:any){
  //    return this.httpClient.get<any>(
  //      this.apiurl + `WBSService/GetIsPrecast/${customerCode}/${projectCode}`
  //     );
  //  }
  GetFileSubmissionStatus(customercode:string, projectcode:string,filename:string,wbselementid:number)
  {
    return this.httpClient.get<any>(this.apiurl + `WBSService/GetFileSubmissionStatus/${customercode}/${projectcode}/${filename}/${wbselementid}`);
    // return this.httpClient.get<any>(`https://localhost:5006/GetFileSubmissionStatus/${customercode}/${projectcode}/${filename}/${wbselementid}`);

  }
}


