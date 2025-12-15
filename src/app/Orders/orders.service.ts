import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, tap, throwError, timeout } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddToCart } from '../Model/addToCart';
import { OrderDetailsForCab } from '../Model/orderdetailsforcab';
import { SaveBarDetailsModel } from '../Model/saveBarDetailsModel';
import { PostOrederSummary } from '../Model/postOrderSummary';
import { saveOrderDetailsModel } from '../Model/saveOrderDetailsModel';
import { UpdateProcessSORModel } from '../Model/UpdateProcessSORModel';
import { SubmitProcessModel } from '../Model/SubmitProcessModel';
import { CheckOrdersUpdateModel } from '../Model/CheckOrdersUpdateModel';
import { GetSubmittedPOSearchModel } from '../Model/GetSubmittedPOSearchModel';
import { CheckOrderCancelModel } from '../Model/CheckOrderCancelModel';
import { BatchChangeStatusModel } from '../Model/BatchChangeStatusModel';
import { SaveBBSOrderDetails } from '../Model/SaveBBSOrderDetails';
import { OrdersForAmendment } from '../Model/ordersforamendment';
import { AmendmentIndicators } from '../Model/amendmentindicators';
import { AmendmentRequiredDate } from '../Model/amendmentrequireddate';
import { OrderDetailsRetModels } from '../Model/orderdetailsretmodels';
import { JobAdviceModels } from '../Model/jobadvicemodels';
import { SaveEsmTracker } from '../Model/save-esm-tracker';
import { BarDetails } from '../Model/bardetails';
import { SaveJobAdvice_CAB } from '../Model/SaveJobAdvice_CAB';
import { ForecastdataModel } from '../Model/ForecastdataModel';
import { CheckFile_Exist } from '../Model/checkfile_exist';
import { LoginService } from '../services/login.service';
import { GETWBS_Copy } from '../Model/GetWBS_Copy';
import { checkIfFileExistsModel, checkOrderModel, deleteDrawingModel, deleteDrawingOrderModel, getAssignStrEleModel, getDrawingListModel, getOrderListModel, getWBSListModel, modifyDrawingModel, printDrawingsModel, searchDrawingListModel } from '../Model/drawing_repo_models';
import { UpcomingMailModel } from '../Model/upcoming_mail';
import { getDocumentIndexDto } from '../Model/getDocumentIndexDto';
import { PreCastDetails } from './bored-pile-cage/pile-entry/pile-entry.component';
import { BoredPileCustomMainBarModel, BoredPileElevationStiffenerModel } from '../Model/bpc_elevation_stiffener';
import { CommonService } from '../SharedServices/CommonService';
import { CustomerProjectService } from '../SharedServices/customer-project.service';


@Injectable({
  providedIn: 'root',
})
export class OrderService {
//apiUrl: any = 'http://172.25.1.224:78/';
apiUrl: any = environment.apiUrl +'OrderService/';
// apiUrl: any ='https://localhost:5009/'

  constructor(
    private httpClient: HttpClient,
    private loginService: LoginService,
    private commonService:CommonService,
    private dropdown: CustomerProjectService

  ) { }

 getFullOrdersDetails(orderRequestNos: string[]): Observable<any> {
  return this.httpClient.post(`${this.apiUrl}getFullOrdersDetails`, orderRequestNos);
}
getVendorList( TypeService:string,ProcessType:string){
  return this.httpClient.get<any[]>(
      this.apiUrl +
      `GetVendorList/${TypeService}/${ProcessType}`
    );
}

 generateBatchFullOutSource(soNums: string[],type: string,deliveredBy: string,vendorCode: string,vendorName:string,contractNo: string,reqDelDate:any): Observable<any> {
  const dataList = {
      soNums: soNums,
      type: type,
      deliveredBy: deliveredBy,
      vendorCode: vendorCode,
      vendorName: vendorName,
      contractNo: contractNo,
      reqDelDate:reqDelDate
    };

    return this.httpClient.post(`${this.apiUrl}GenerateBatch`, dataList);
  }
assignOrderOutSource(soNums: string[],type: string,deliveredBy: string,vendorCode: string,vendorName:string,contractNo: string,ReqDelDate:any): Observable<any> {
  const dataList = {
      soNums: soNums,
      type: type,
      deliveredBy: deliveredBy,
      vendorCode: vendorCode,
      vendorName: vendorName,
      contractNo: contractNo,
      reqDelDate:ReqDelDate

    };

    return this.httpClient.post(`${this.apiUrl}assignOrderOutSource`, dataList);
  }

getSupplierData(productType: string | null): Observable<{
  success: boolean;
  message: string;
  data: {
      SupplierCode: string;
      SupplierName: string;
      ProductType: string | null;
      ServiceType: string | null;
      Contracts: {
        ContractNo: string;
        ContractDesc: string;
      }[];
    }[];
}> {
  // Add query parameter safely (empty string if null)
  const query = `?productType=${encodeURIComponent(productType ?? '')}`;

  // Call API with query parameter and empty body
  return this.httpClient.post<{
    success: boolean;
    message: string;
   data: {
      SupplierCode: string;
      SupplierName: string;
      ProductType: string | null;
      ServiceType: string | null;
      Contracts: {
        ContractNo: string;
        ContractDesc: string;
      }[];
    }[];
  }>(this.apiUrl + 'PostSupplierData' + query, {});
}




  GetCustomers(pGroupName: any, pUserType: any): Observable<any> {
    if(!pUserType){
          pUserType="null";
    }
    return this.httpClient.get<any[]>(
      this.apiUrl + `GetCustomers/${pUserType}/${pGroupName}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/GetCustomers/${pUserType}/${pGroupName}`);
  }

  //Address
  GetAddress(AddressCode: any): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl + `GetHmiAddress/${AddressCode}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/GetHmiAddress/${AddressCode}`);
  }


  GetSchnellOrderAssign(FromReqDelDate:any,ToReqDelDate:any,Customercode:any,
    Project:any,Producttype:any,Status:any,OrderNo:any): Observable<any> {

      const params: any = {};

      if (FromReqDelDate != null) params.FromReqDelDate = FromReqDelDate;
      if (ToReqDelDate != null) params.ToReqDelDate = ToReqDelDate;
      if (Customercode) params.Customercode = Customercode;
      if (Project) params.Project = Project;
      if (Producttype) params.Producttype = Producttype;
      if (Status) params.Status = Status;
      if (OrderNo) params.OrderNo = OrderNo;
    return this.httpClient.get<any[]>(
      this.apiUrl + `SchnellOrderAssignment`, {
        params: params
      }
    );
  }

  GetSchnellOrderItem(OrderRequestNo : string): Observable<any> {

    return this.httpClient.get<any[]>(
      this.apiUrl + `SchnellOrderItemData/${OrderRequestNo}`
    );
  }

  // SaveOrderAssignment(OrderdataList: any,AssignedTo: any) {
  //   const obj = {
  //     OrderdataList: OrderdataList,
  //     assignedTo: AssignedTo
  //   };
  //   return this.httpClient.post<any>(
  //     this.apiUrl +
  //     `SaveOrderAssignment`,obj
  //   );

  // }
  SaveOrderAssignment(OrderRequestNo: any,AssignedTo: any) {
    //let username=this.loginService.GetGroupName();
    const obj = {
      orderRequestNo: OrderRequestNo,
      assignedTo: AssignedTo,
      //assignedby: username
    };
    return this.httpClient.post<any>(
      this.apiUrl +
      `SaveOrderAssignment`,obj
    );

  }

  SaveOrderWithdraw(orderRequestNo: string[]) {
    // const obj = {
    //   orderRequestNo: OrderRequestNo
    // };
    return this.httpClient.post<any>(
      this.apiUrl +
      `SaveOrderWithdraw`,orderRequestNo
    );
  }

  // OrderAssignmentInsertAPI() {
  //   return this.httpClient.post<any>('http://172.25.1.224:65/Insert_OrderAssignmentData',null);
  // }

  // Delete_OrderAssignmentData(orderRequestNo: string[]) {
  //   // const obj = {
  //   //   orderRequestNo: OrderRequestNo
  //   // };
  //   let username = this.loginService.GetGroupName();
  //   const obj = {
  //     orderRequestNo: orderRequestNo,
  //     withdrawBy: username
  //   };
  //   return this.httpClient.post<any>(
  //     this.apiUrl +
  //     `Delete_OrderAssignmentData`, obj
  //   );

  // }

  Delete_OrderAssignmentData(orderRequestNo: string[]) {
    // const obj = {
    //   orderRequestNo: OrderRequestNo
    // };
    return this.httpClient.post<any>(
      this.apiUrl +
      `Delete_OrderAssignmentData`,orderRequestNo
    );
    
  }

   DeleteOutsourceData(orderNo: string[]) {
    
    return this.httpClient.post<any>(
      this.apiUrl +
      `DeleteOutsourceData`,orderNo
    );
    
  }
  ExportOrderAssignmentToExcel(FromReqDelDate:any,ToReqDelDate:any,Customercode:any,
    Project:any,Producttype:any,Status:any) {
      const formData: FormData = new FormData();
    formData.append('FromReqDelDate', FromReqDelDate);
    formData.append('ToReqDelDate', ToReqDelDate);
    if (Customercode) formData.append("Customercode", Customercode);
    if (Project) formData.append("Project", Project);
    if (Producttype) formData.append("Producttype", Producttype);
    if (Status) formData.append("Status", Status);
      debugger
      // if (FromReqDelDate != null) params.FromReqDelDate = FromReqDelDate;
      // if (ToReqDelDate != null) params.ToReqDelDate = ToReqDelDate;
      // if (Customercode) params.Customercode = Customercode;
      // if (Project) params.Project = Project;
      // if (Producttype) params.Producttype = Producttype;
      // if (Status) params.Status = Status;
    return this.httpClient.post(
      this.apiUrl + `ExportOrderAssignmentToExcel`,
      formData,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  GetProjects(
    pCustomerCode: any,
    pUserType: any,
    pGroupName: any
  ): Observable<any> {
    if(!pUserType){
      pUserType="null";
          }
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `GetProjects/${pCustomerCode}/${pUserType}/${pGroupName}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/GetProjects/${pCustomerCode}/${pUserType}/${pGroupName}`);
  }

  
  GetGridList(customerCode: any, projectCode: any): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl + `GetGridList/${customerCode}/${projectCode}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/GetGridList/${customerCode}/${projectCode}`);
  }
  GetActiveOrderGridList(
    customerCode: any,
    projectCode: any,
    AllProjects: boolean
  ): Observable<any> {
    let UserName = this.loginService.GetGroupName();
    let AddressList = this.dropdown.getAddressList();
    let obj = {
      CustomerCode: customerCode,
      ProjectCode: projectCode,
      AddressCode: AddressList,
      AllProjects: AllProjects,
      UserName: UserName
    }

    // return this.httpClient.post<any[]>(`https://localhost:5009/getActiveOrders`, obj );
    return this.httpClient.post<any[]>( this.apiUrl + `getActiveOrders`, obj );
  }

  GetDeliveredGridList(
    CustomerCode: any,
    ProjectCode: any,
    IsAllProject: boolean
  ): Observable<any> {
    let UserName = this.loginService.GetGroupName();
    let AddressList = this.dropdown.getAddressList();
    let obj = {
      CustomerCode: CustomerCode,
      ProjectCode: ProjectCode,
      AddressCode: AddressList,
      AllProjects: IsAllProject,
      UserName: UserName
    }

    return this.httpClient.post<any[]>(this.apiUrl + `getDeliveredOrders`, obj );
    // return this.httpClient.post<any[]>(`https://localhost:5009/getDeliveredOrders`, obj );
  }

  GetCancelledGridList(
    CustomerCode: any,
    ProjectCode: any,
    IsAllProject: boolean
  ): Observable<any> {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getCancelledOrders/${CustomerCode}/${ProjectCode}/${IsAllProject}/${UserName}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getCancelledOrders/${CustomerCode}/${ProjectCode}/${IsAllProject}`);
  }

  GetDraftedGridList(
    CustomerCode: any,
    ProjectCode: any,
    IsAllProject: boolean
  ): Observable<any> {
    let UserName = this.loginService.GetGroupName();
    let AddressList = this.dropdown.getAddressList();
    let obj = {
      CustomerCode: CustomerCode,
      ProjectCode: ProjectCode,
      AddressCode: AddressList,
      AllProjects: IsAllProject,
      UserName: UserName
    }

    return this.httpClient.post<any[]>( this.apiUrl + `getDraftOrdersController`, obj );
    //return this.httpClient.post<any[]>(`https://localhost:5009/getDraftOrdersController`, obj);
  }

  GetDeleteOrderGridList(
    customerCode: any,
    projectCode: any,
    AllProjects: boolean
  ) {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getDeletedOrders/${customerCode}/${projectCode}/${AllProjects}/${UserName}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getDeletedOrders/${customerCode}/${projectCode}/${AllProjects}`);
  }

  DraftBatchChangeStatus(
    CustomerCode: string,
    ProjectCode: string,
    orderNumber: string,
    pOrderStatus: string
  ) {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getDraftOrdersController/${CustomerCode}/${ProjectCode}/${orderNumber}/${pOrderStatus}/${UserName}`
    );
    //return this.httpClient.post<any[]>(`https://localhost:5009/getDraftOrdersController/BatchChangeStatus`,DraftBatchChangeOrderArray);
  }

  BatchChangeStatus(obj: any) {
    obj.UserName = this.loginService.GetGroupName();
    return this.httpClient.post<any>(
      this.apiUrl + `BatchChangeStatus`,
      obj
    );
    //return this.httpClient.post<any[]>(`https://localhost:5009/BatchChangeStatus`, obj)
  }

  GetWBS1Multiple(obj: any) {
    // return this.httpClient.post<any>(
    //   this.apiUrl + `getWBS1Multiple`,
    //   obj
    // );
    //return this.httpClient.post<any>(`https://localhost:5009/getWBS1Multiple`, obj);
    return this.httpClient.post<any>(
      this.apiUrl + `getWBS1Multiple`,
      obj
    );
    // return this.httpClient.post<any>(`https://localhost:5009/getWBS1Multiple`, obj);
  }
  GetWBS2Multiple(obj: any) {
    return this.httpClient.post<any>(
      this.apiUrl + `getWBS2Multiple`,
      obj
    );
    // return this.httpClient.post<any>(
    //   `https://localhost:5009/getWBS2Multiple`,
    //   obj
    // );
  }
  GetWBS3Multiple(obj: any) {
    return this.httpClient.post<any>(
      this.apiUrl + `getWBS3Multiple`,
      obj
    );
    // return this.httpClient.post<any>(`https://localhost:5009/getWBS3Multiple`, obj);
  }
  GetMeshPRCData(obj: any) {
    return this.httpClient.post<any[]>(
      this.apiUrl + `getScheduledData`,
      obj
    );
    //return this.httpClient.post<any[]>(`https://localhost:5009/getScheduledData`, obj);
  }

  ProductSelect(pCustomerCode: any, pProjectCode: any, UserName: any) {
    //debugger;
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `ProductSelect/${pCustomerCode}/${pProjectCode}/${UserName}`
    );
    // return this.httpClient.get<any[]>(`https://localhost:5009/ProductSelect/${pCustomerCode}/${pProjectCode}/${UserName}`);
  }
  getProjCategorey(appCustomerCode: any, appProjectCode: any): Observable<any> {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getProjectCategorey/${appCustomerCode}/${appProjectCode}/${UserName}`
    );
    // return this.httpClient.get<any[]>(`https://localhost:5009/getProjectCategorey/${appCustomerCode}/${appProjectCode}/${UserName}`);
  }
  getStandardProducts(ProdCategory: any,GreenType:string): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl + `getStandardProducts/${ProdCategory}/${GreenType}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getStandardProducts/${ProdCategory}/${GreenType}`);
  }
  GetOrderSummary(obj: PostOrederSummary) {
    let UserName = this.loginService.GetGroupName();
    let UserType = this.loginService.GetUserType();
    return this.httpClient.post<any[]>(
      this.apiUrl + `OrderSummary/${UserName}/${UserType}`,
      obj
    );
    // return this.httpClient.post<any[]>(
    //   `https://localhost:5009/OrderSummary/${UserName}/${UserType}`,
    //   obj
    // );
  }
  getBBSOrder(obj: any): Observable<any> {
    return this.httpClient.post<any[]>(
      this.apiUrl + `getBBSOrder`,
      obj
    );
    // return this.httpClient.post<any[]>(`https://localhost:5009/getBBSOrder`, obj);
  }
  getCouplerType(CustomerCode: string, ProjectCode: string): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl + `getCouplerType/${CustomerCode}/${ProjectCode}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getCouplerType/${CustomerCode}/${ProjectCode}`);
  }
  getOrderDetailsCAB(
    CustomerCode: string,
    ProjectCode: string,
    JobID: number
  ): Observable<any> {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getOrderDetailsCAB/${CustomerCode}/${ProjectCode}/${JobID}/${UserName}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getOrderDetailsCAB/${CustomerCode}/${ProjectCode}/${JobID}/${UserName}`);
  }
  AddToCart(obj: AddToCart) {
    return this.httpClient.post<any>(
      this.apiUrl + `AddToCartUI`,
      obj
    );
    // return this.httpClient.post<any>(`https://localhost:5009/AddToCartUI`, obj);
  }
  SaveOrderDetails(obj: saveOrderDetailsModel) {
    return this.httpClient.post<any[]>(
      this.apiUrl + `SaveOrderDetails`,
      obj
    );
    //return this.httpClient.post<any[]>(`https://localhost:5009/SaveOrderDetails`, obj);
  }
  // https://localhost:5009/SaveOrderDetails
  OrderDetailsForCABPOPUP(obj: OrderDetailsForCab) {
    return this.httpClient.post<any[]>(
      this.apiUrl + `getBBSOrder`,
      obj
    );
    //return this.httpClient.post<any[]>(`https://localhost:5009/getBBSOrder`, obj);
  }
  SaveBarDetails(obj: SaveBarDetailsModel) {
    return this.httpClient.post<any[]>(
      this.apiUrl + `saveBarDetails`,
      obj
    );
    //return this.httpClient.post<any>(`https://localhost:5009/saveBarDetails`, obj);
  }
  GetBarDetails(
    CustomerCode: string,
    ProjectCode: string,
    JobID: number,
    BBSID: number
  ): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getBarDetails/${CustomerCode}/${ProjectCode}/${JobID}/${BBSID}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getBarDetails/${CustomerCode}/${ProjectCode}/${JobID}/${BBSID}`);
  }

  getShapeCodeList(
    CustomerCode: string,
    ProjectCode: string,
    CouplerType: string
  ): Observable<any> {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getShapeCodeList/${CustomerCode}/${ProjectCode}/${CouplerType}/${UserName}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getShapeCodeList/${CustomerCode}/${ProjectCode}/${CouplerType}/${UserName}`);
  }

  getShapeCodeList_cab(
    CustomerCode: string,
    ProjectCode: string,
    CouplerType: string
  ) {
    debugger;
    return this.httpClient
      .get<any>(
        this.apiUrl +
        `getShapeCodeList/${CustomerCode}/${ProjectCode}/${CouplerType}`
      )
      .pipe(
        map((response: any[]) => {
          // Map the response to the desired format, for example, returning an array of objects with 'value' and 'label' properties
          return response.map((item) => ({
            value: item.shapeCode,
            label: item.shapeCode,
          }));
        }),
        tap((x) => {
          console.log('HERE', x);
        })
      );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getShapeCodeList/${CustomerCode}/${ProjectCode}/${CouplerType}`);
  }
  getBendingList(): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl + `getFormerLimitation`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getFormerLimitation`);
  }
  getSBDetails(CustomerCode: string, ProjectCode: string): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl + `getSBDetails/${CustomerCode}/${ProjectCode}`
    );
    // return this.httpClient.get<any[]>(
    //   `https://localhost:5009/getSBDetails/${CustomerCode}/${ProjectCode}`
    // );
  }

  //getStandardProducts/{ProdCategory}

  SaveBBS(obj: any): Observable<any> {
    //debugger;

    return this.httpClient.post<any[]>(
      this.apiUrl + `saveBBS`,
      obj
    );

    //  return this.httpClient.post<any[]>(`https://localhost:5009/saveBBS`, obj);

    //this.apiUrl + `
  }

  SaveJobAdvice(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    OrderStatus: any,
    TotalPcs: number,
    TotalWeight: any
  ): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `SaveJobAdvice/${CustomerCode}/${ProjectCode}/${JobID}/${OrderStatus}/${TotalPcs}/${TotalWeight}`
    );

    //return this.httpClient.get<any[]>(`https://localhost:5009/SaveJobAdvice/${CustomerCode}/${ProjectCode}/${JobID}/${OrderStatus}/${TotalPcs}/${TotalWeight}`);
  }

  printOrderDetail(CustomerCode: any, ProjectCode: any, JobID: any) {
    // return this.httpClient.get(
    //   `https://localhost:5009/printOrderDetail/${CustomerCode}/${ProjectCode}/${JobID}`,
    //   {
    //     responseType: 'blob', // Important to specify blob as the response type
    //   }
    // );
    return this.httpClient.get(
      this.apiUrl +
      `printOrderDetail/${CustomerCode}/${ProjectCode}/${JobID}`,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  getProductTypeList() {
    return this.httpClient.get<any[]>(
      this.apiUrl + 'getProductTypeList_mesh'
    );
    //return this.httpClient.get<any[]>("https://localhost:5009/getProductTypeList_mesh");
  }

  reloadStdSheetMaster(SeriesCode: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl + `getStdSheetsBySeries/${SeriesCode}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getStdSheetsBySeries/${SeriesCode}`);
  }

  saveBBS_mesh(obj: any): Observable<any> {
    return this.httpClient.post<any[]>(
      this.apiUrl + `saveBBS_mesh`,
      obj
    );
    //return this.httpClient.post<any[]>(`https://localhost:5009/saveBBS_mesh`, obj);
  }

  SaveJobAdvice_mesh(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    OrderStatus: any,
    TotalPcs: number,
    TotalWeight: any
  ): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `SaveJobAdvice_mesh/${CustomerCode}/${ProjectCode}/${JobID}/${OrderStatus}/${TotalPcs}/${TotalWeight}`
    );

    // return this.httpClient.get<any[]>(`https://localhost:5009/SaveJobAdvice_mesh/${CustomerCode}/${ProjectCode}/${JobID}/${OrderStatus}/${TotalPcs}/${TotalWeight}`);
  }

  printOrderDetail_mesh(CustomerCode: any, ProjectCode: any, JobID: number) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `printOrderDetail_mesh/${CustomerCode}/${ProjectCode}/${JobID}`
    );

    //return this.httpClient.get<any[]>(`https://localhost:5009/printOrderDetail_mesh/${CustomerCode}/${ProjectCode}/${JobID}`);
  }

  //added for coupler head

  getStandardProducts_coupler(ProdCategory: any): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl + `getStandardProducts_coupler/${ProdCategory}`
    );

    //return this.httpClient.get<any[]>(`https://localhost:5009/getStandardProducts_coupler/${ProdCategory}`);
  }

  saveBBS_coupler(obj: any): Observable<any> {
    return this.httpClient.post<any[]>(
      this.apiUrl + `saveBBS_coupler`,
      obj
    );

    //return this.httpClient.post<any[]>(`https://localhost:5009/saveBBS_coupler`,obj);
  }

  SaveJobAdvice_coupler(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    OrderStatus: any,
    TotalPcs: number,
    TotalWeight: any
  ): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `SaveJobAdvice_coupler/${CustomerCode}/${ProjectCode}/${JobID}/${OrderStatus}/${TotalPcs}/${TotalWeight}`
    );

    //return this.httpClient.get<any[]>(`https://localhost:5009/SaveJobAdvice_coupler/${CustomerCode}/${ProjectCode}/${JobID}/${OrderStatus}/${TotalPcs}/${TotalWeight}`);
  }

  printOrderDetail_coupler(CustomerCode: any, ProjectCode: any, JobID: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `printOrderDetail_coupler/${CustomerCode}/${ProjectCode}/${JobID}`
    );

    // return this.httpClient.get<any[]>(`https://localhost:5009/printOrderDetail_coupler/${CustomerCode}/${ProjectCode}/${JobID}`);
  }

  //coil

  GetProductType(
    CustomerCode: any,
    ProjectCode: any,
    Username: any,
    appOrderNo: any
  ) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `Index_coil/${CustomerCode}/${ProjectCode}/${Username}/${appOrderNo}`
    );

    //return this.httpClient.get<any[]>(`https://localhost:5009/Index_coil/${CustomerCode}/${ProjectCode}/${Username}/${appOrderNo}`);
  }

  getStandardProducts_coil(ProdCategory: any,GreenType:string): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl + `getStandardProducts_coil/${ProdCategory}/${GreenType}`
    );
    // return this.httpClient.get<any[]>(`https://localhost:5009/getStandardProducts_coil/${ProdCategory}/${GreenType}`);
  }

  SaveBBS_coil(obj: any): Observable<any> {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.post<any[]>(
      this.apiUrl + `saveBBS_coil/${UserName}`,
      obj
    );

    //return this.httpClient.post<any[]>(`https://localhost:5009/saveBBS_coil/${UserName}`,obj);
  }

  SaveJobAdvice_coil(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    OrderStatus: any,
    TotalPcs: number,
    TotalWeight: any
  ): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `SaveJobAdvice_coil/${CustomerCode}/${ProjectCode}/${JobID}/${OrderStatus}/${TotalPcs}/${TotalWeight}`
    );

    //return this.httpClient.get<any[]>(`https://localhost:5009/SaveJobAdvice_coil/${CustomerCode}/${ProjectCode}/${JobID}/${OrderStatus}/${TotalPcs}/${TotalWeight}`);
  }

  printOrderDetail_coil(CustomerCode: any, ProjectCode: any, JobID: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `printOrderDetail_coil/${CustomerCode}/${ProjectCode}/${JobID}`
    );

    //return this.httpClient.get<any[]>(`https://localhost:5009/printOrderDetail_coil/${CustomerCode}/${ProjectCode}/${JobID}`);
  }
  //beam link mesh

  // saveMeshBeamDetails_beam(obj: BeamlinkmeshOrderTableInput) {
  //   return this.httpClient.post<any[]>(
  //     this.apiUrl + `saveMeshBeamDetails_beam`,
  //     obj
  //   );

  //   //return this.httpClient.post<any[]>(`https://localhost:5009/saveMeshBeamDetails_beam`, obj);
  // }

  getBeamDetailsNSH_beam(CustomerCode: any, ProjectCode: any, PostID: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getBeamDetailsNSH_beam/${CustomerCode}/${ProjectCode}/${PostID}`
    );

    //return this.httpClient.get<any[]>(`https://localhost:5009/getBeamDetailsNSH_beam/${CustomerCode}/${ProjectCode}/${PostID}`);
  }

  getShapeImagesByCat_beam(ShapeCategory: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl + `getShapeImagesByCat_beam/${ShapeCategory}`
    );

    // return this.httpClient.get<any[]>(`https://localhost:5009/getShapeImagesByCat_beam/${ShapeCategory}`);
  }

  getProductList_beam(ProductCategory: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl + `getProductList_beam/${ProductCategory}`
    );

    //return this.httpClient.get<any[]>(`https://localhost:5009/getProductList_beam/${ProductCategory}`);
  }

  printShapes_beam(ShapeCategory: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl + `printShapes_beam/${ShapeCategory}`
    );

    // return this.httpClient.get<any[]>(`https://localhost:5009/printShapes_beam/${ShapeCategory}`);
  }

  printProduct_beam(ProductCategory: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl + `printProduct_beam/${ProductCategory}`
    );

    //return this.httpClient.get<any[]>(`https://localhost:5009/printProduct_beam/${ProductCategory}`);
  }

  showdir(ProjectCode: string, JobID: number) {
    // return this.httpClient.get(
    //   `https://localhost:5009/ShowDir/${ProjectCode}/${JobID}`,
    //   {
    //     responseType: 'blob', // Important to specify blob as the response type
    //   }
    // );
    return this.httpClient.get(
      this.apiUrl + `ShowDir/${ProjectCode}/${JobID}`,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  getMeshBeamDetails_beam(
    CustomerCode: any,
    ProjectCode: any,
    PostID: any,
    BBSID: any
  ) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getMeshBeamDetails_beam/${CustomerCode}/${ProjectCode}/${PostID}/${BBSID}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getMeshBeamDetails_beam/${CustomerCode}/${ProjectCode}/${PostID}/${BBSID}`);
  }

  GetPendingENT(obj: any) {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getIncomingRD/${obj.OrderStatus}/${obj.Forecast}/${UserName}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getIncomingRD/${obj.OrderStatus}/${obj.Forecast}`);
  }
  GetIncomingData(obj: any) {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getIncomingRD/${obj.OrderStatus}/${obj.Forecast}/${UserName}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getIncomingRD/${obj.OrderStatus}/${obj.Forecast}/${UserName}`);
  }

  GetAllData(obj: any) {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.post<any[]>(
      this.apiUrl +
      `getSubmittedPOSearch`, obj
    );
    // return this.httpClient.post<any[]>(
    //   `https://localhost:5009/getSubmittedPOSearch`,obj
    // );
  }

  GetProcessContractList(obj: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getAllContractNos/${obj.CustomerCode}/${obj.ProjectCode}/${obj.ProdType}`
    );
    // return this.httpClient.get<any[]>(
    //   `https://localhost:5009/getAllContractNos/${obj.CustomerCode}/${obj.ProjectCode}/${obj.ProdType}`
    // );
  }

  GetVehicleTypeList() {
    return this.httpClient.get<any[]>(
      this.apiUrl + `getVehicleType`
    );
    // return this.httpClient.get<any[]>(`https://localhost:5009/getVehicleType`);
  }

  GetStdSheetList(obj: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl + `getVehicleType`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getVehicleType`);
  }

  getPOHistory(
    CustomerCode: string,
    ProjectCode: string,
    ProdTypes: string
  ): Observable<any> {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getPOHistory/${CustomerCode}/${ProjectCode}/${ProdTypes}/${UserName}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getPOHistory/${CustomerCode}/${ProjectCode}/${ProdTypes}/${UserName}`);
  }
  getDeliveryAddress(
    CustomerCode: string,
    ProjectCode: string,
    WBS1: string
  ): Observable<any> {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getDeliveryAddress/${CustomerCode}/${ProjectCode}/${WBS1}/${UserName}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getDeliveryAddress/${CustomerCode}/${ProjectCode}/${WBS1}/${UserName}`);
  }
  // getJobId(OrderNumber: string): Observable<any> {
  //   return this.httpClient.get<any[]>(
  //     this.apiUrl + `getJobId/${OrderNumber}`
  //   );
  //   //return this.httpClient.get<any[]>(`https://localhost:5009/getJobId/${OrderNumber}`);
  // }

  getJobId(OrderNumber: string, ProdType: string, StructurEelement: string, ScheduleProd: string): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl + `getJobId/${OrderNumber}/${ProdType}/${StructurEelement}/${ScheduleProd}`
    );
    // return this.httpClient.get<any[]>(`https://localhost:5009/getJobId/${OrderNumber}/${ProdType}/${StructurEelement}/${ScheduleProd}`);
  }
  ChangeStatus(
    pCustomerCode: string,
    pProjectCode: string,
    pOrderNo: number,
    pOrderStatus: string,
    userName: string
  ): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `ChangeStatus/${pCustomerCode}/${pProjectCode}/${pOrderNo}/${pOrderStatus}/${userName}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/ChangeStatus/${pCustomerCode}/${pProjectCode}/${pOrderNo}/${pOrderStatus}/${userName}`);
  }
  OrderClone(
    CustomerCode: string,
    sProjectCode: string,
    dProjectCode: string,
    OrderNo: number,
    CloneNo: number
  ): Observable<any> {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `setCloneOrderNonWBS/${CustomerCode}/${sProjectCode}/${dProjectCode}/${OrderNo}/${CloneNo}/${UserName}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/setCloneOrderNonWBS/${CustomerCode}/${sProjectCode}/${dProjectCode}/${OrderNo}/${CloneNo}/${UserName}`);
  }
  getBBS(CustomerCode: string, ProjectCode: string, JobId: number) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getBBS/${CustomerCode}/${ProjectCode}/${JobId}`
    );
    // return this.httpClient.get<any[]>(`https://localhost:5009/getBBS/${CustomerCode}/${ProjectCode}/${JobId}`);
  }
  getBBS_mesh(CustomerCode: string, ProjectCode: string, JobId: number) {
    // return this.httpClient.get<any[]>(`https://localhost:5009/getBBS_mesh/${CustomerCode}/${ProjectCode}/${JobId}`);
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getBBS_mesh/${CustomerCode}/${ProjectCode}/${JobId}`
    );
  }
  getShapeInfo(
    CustomerCode: string,
    ProjectCode: string,
    JobId: number,
    ShapeCode: string
  ) {
    //return this.httpClient.get<any[]>(`https://localhost:5009/getShapeInfo/${CustomerCode}/${ProjectCode}/${JobId}/${ShapeCode}`);
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getShapeInfo/${CustomerCode}/${ProjectCode}/${JobId}/${ShapeCode}`
    );
  }
  getAllContractNos(
    ProjectCode: string,
  ) {
    //return this.httpClient.get<any[]>(`https://localhost:5009/getAllContractNos/${CustomerCode}/${ProjectCode}/${ProdType}`);
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getAllContractNos/${ProjectCode}`
    );
  }
  getContractList(
    CustomerCode: string,
    ProjectCode: string,
    ProdType: string,
    ProdTypeL2: string,
    OrderNumber: number,
    StructureElement: string
  ) {
    let obj = {
      CustomerCode: CustomerCode,
      ProjectCode: ProjectCode,
      ProdType: ProdType,
      ProdTypeL2: ProdTypeL2,
      OrderNumber: OrderNumber,
      StructureElement: StructureElement,
    };
    //return this.httpClient.post<any[]>(`https://localhost:5009/getContractList`,obj);
    return this.httpClient.post<any[]>(
      this.apiUrl + `getContractList`,
      obj
    );
  }
  getShipToParty(ProjectCode: string, ContractNo: string) {
    //return this.httpClient.get<any[]>(`https://localhost:5009/getShipToParty/${CustomerCode}/${ContractNo}`
    return this.httpClient.get<any[]>(
      this.apiUrl + `getShipToParty/${ProjectCode}/${ContractNo}`
    );
  }

  GetTECHRemarksDB(obj: any) {
    //return this.httpClient.post<any>(`https://localhost:5009/GetTECHRemarksDB`, obj)
    return this.httpClient.post<any>(
      this.apiUrl + `GetTECHRemarksDB`,
      obj
    );
  }
  UpdateTECHRemarksDB(obj: any) {
    //return this.httpClient.post<any>(`https://localhost:5009/UpdateTECHRemarksDB`, obj)
    return this.httpClient.post<any>(
      this.apiUrl + `UpdateTECHRemarksDB`,
      obj
    );
  }
  UpdatePMRemarksDB(obj: any) {
    //return this.httpClient.post<any>(`https://localhost:5009/UpdatePMRemarksDB`, obj)
    return this.httpClient.post<any>(
      this.apiUrl + `UpdatePMRemarksDB`,
      obj
    );
  }
  UpdateProjInchargeDB(obj: any) {
    //return this.httpClient.post<any>(`https://localhost:5009/UpdateProjInchargeDB`, obj)
    return this.httpClient.post<any>(
      this.apiUrl + `UpdateProjInchargeDB`,
      obj
    );
  }
  UpdateDetInchargeDB(obj: any) {
    //return this.httpClient.post<any>(`https://localhost:5009/UpdateDetInchargeDB`, obj)
    return this.httpClient.post<any>(
      this.apiUrl + `UpdateDetInchargeDB`,
      obj
    );
  }

  // Process Order Button POST Services
  UpdateProcessSOR(obj: UpdateProcessSORModel) {
    //return this.httpClient.post<any>(`https://localhost:5009/UpdateProcessSOR`, obj)
    return this.httpClient.post<any>(
      this.apiUrl + `UpdateProcessSOR`,
      obj
    );
  }
  CancelProcess(
    CustomerCode: string,
    ProjectCode: string,
    ContractNo: string,
    JobID: number,
    StructureElement: string,
    ProdType: string,
    OrderSource: string,
    ScheduledProd: string,
    ActionType: string
  ) {
    let UserName = this.loginService.GetGroupName();

  // return this.httpClient.get<any>(`https://localhost:5009/CancelProcess/${CustomerCode}/${ProjectCode}/${ContractNo}/${JobID}/${StructureElement}/${ProdType}/${OrderSource}/${ScheduledProd}/${ActionType}/${UserName}`);
    return this.httpClient.get<any>(
      this.apiUrl +
      `CancelProcess/${CustomerCode}/${ProjectCode}/${ContractNo}/${JobID}/${StructureElement}/${ProdType}/${OrderSource}/${ScheduledProd}/${ActionType}/${UserName}`
    );
  }
  SubmitProcess(obj: SubmitProcessModel) {
    obj.UserName = this.loginService.GetGroupName();
    //return this.httpClient.post<any>(`https://localhost:5009/SubmitProcess` , obj, {
    return this.httpClient.post<any>(
      this.apiUrl + `SubmitProcess`,
      obj, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
       })
       })
      .pipe(
        timeout(900000), // 30 seconds timeout
        catchError(this.handleError)
      );
  }

  getProjectIncharge() {
    //return this.httpClient.get<any>(`https://localhost:5009/getProjectIncharge`);
    return this.httpClient.get<any>(
      this.apiUrl + `getProjectIncharge`
    );
  }
  getDetailingIncharge() {
    //return this.httpClient.get<any>(`https://localhost:5009/getDetailingIncharge`);
    return this.httpClient.get<any>(
      this.apiUrl + `getDetailingIncharge`
    );
  }
  checkContract(ContractNo: any) {
    //return this.httpClient.get<any>(`https://localhost:5009/checkContract/${ContractNo}`);
    return this.httpClient.get<any>(
      this.apiUrl + `checkContract/${ContractNo}`
    );
  }
  getProjectStage() {
    //return this.httpClient.get<any>(`https://localhost:5009/getProjectStage`);
    return this.httpClient.get<any>(
      this.apiUrl + `getProjectStage`
    );
  }
  getBBS_Process(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    OrderSource: any,
    StructureElement: any,
    ProductType: any,
    ScheduledProd: any
  ) {
    //return this.httpClient.get<any>(`https://localhost:5009/getBBS/${CustomerCode}/${ProjectCode}/${JobID}/${OrderSource}/${StructureElement}/${ProductType}/${ScheduledProd}`);
    return this.httpClient.get<any>(
      this.apiUrl +
      `getBBS/${CustomerCode}/${ProjectCode}/${JobID}/${OrderSource}/${StructureElement}/${ProductType}/${ScheduledProd}`
    );
  }
  getStdSheet_Process(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    OrderSource: any,
    StructureElement: any,
    ProductType: any,
    ScheduledProd: any
  ) {
    //return this.httpClient.get<any>(`https://localhost:5009/getStdSheet/${CustomerCode}/${ProjectCode}/${JobID}/${OrderSource}/${StructureElement}/${ProductType}/${ScheduledProd}`);
    return this.httpClient.get<any>(
      this.apiUrl +
      `getStdSheet/${CustomerCode}/${ProjectCode}/${JobID}/${OrderSource}/${StructureElement}/${ProductType}/${ScheduledProd}`
    );
  }
  CheckSBContract(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    ContractNo: any,
    SBWeight: any,
    ProdType: any,
    ProdTypeL2: any
  ) {
    //  return this.httpClient.get<any>(`https://localhost:5009/CheckSBContract/${CustomerCode}/${ProjectCode}/${JobID}/${ContractNo}/${SBWeight}/${ProdType}/${ProdTypeL2}`);
    return this.httpClient.get<any>(
      this.apiUrl +
      `CheckSBContract/${CustomerCode}/${ProjectCode}/${JobID}/${ContractNo}/${SBWeight}/${ProdType}/${ProdTypeL2}`
    );
  }
  SendExceedContractEmail(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    ContractNo: any,
    OrderSource: any,
    ProdType: any,
    ProdTypeL2: any,
    TotalOrderWT: any,
    ContractCap: any
  ) {
    let obj={
      ProdType:ProdType,
      ProdTypeL2 :ProdTypeL2,
      CustomerCode :CustomerCode,
      ProjectCode:ProjectCode,
      JobID :JobID,
      ContractNo:ContractNo,
      ContractCap:ContractCap,
      TotalOrderWT:TotalOrderWT,
      OrderSource :OrderSource
    }
    // return this.httpClient.post<any>(`https://localhost:5009/sendExceedContractEmail`,obj);
    return this.httpClient.post<any>(`${this.apiUrl}sendExceedContractEmail`,obj);
    //return this.httpClient.get<any>(`${this.apiUrl}sendExceedContractEmail/${ProdType}/${ProdTypeL2}/${CustomerCode}/${ProjectCode}/${JobID}/${ContractNo}/${ContractCap}/${TotalOrderWT}/${OrderSource}`);
    // return this.httpClient.get<any>(
    //   this.apiUrl +
    //   `sendExceedContractEmail/${ProdType}/${ProdTypeL2}/${CustomerCode}/${ProjectCode}/${JobID}/${ContractNo}/${ContractCap}/${TotalOrderWT}/${OrderSource}`
    // );
  }
  CheckBBSNo(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    StructureElement: any,
    ProdType: any,
    ScheduledProd: any,
    OrderSource: any,
    BBSNo: any
  ) {
      let obj={
      CustomerCode :CustomerCode,
      ProjectCode:ProjectCode,
      JobID :JobID,
    StructureElement: StructureElement,
    ProdType: ProdType,
    ScheduledProd: ScheduledProd,
    OrderSource: OrderSource,
      BBSNo: BBSNo
    }
       return this.httpClient.post<any>(`${this.apiUrl}checkBBSNoProcess`,obj);
     //return this.httpClient.post<any>(`https://localhost:5009/checkBBSNoProcess`,obj);
     // return this.httpClient.post<any>(`https://localhost:5009/checkBBSNoProcess`,obj);
    //return this.httpClient.get<any>(`https://localhost:5009/checkBBSNo/${CustomerCode}/${ProjectCode}/${JobID}/${StructureElement}/${ProdType}/${ScheduledProd}/${OrderSource}/${BBSNo}`);
    // return this.httpClient.get<any>(
    //   this.apiUrl +
    //   `checkBBSNo/${CustomerCode}/${ProjectCode}/${JobID}/${StructureElement}/${ProdType}/${ScheduledProd}/${OrderSource}/${BBSNo}`
    // );
  }

  GetProcessingData(obj: any) {
    let UserName = this.loginService.GetGroupName();
    //return this.httpClient.post<any[]>(`https://localhost:5009/getSubmittedPOSearch`,obj);
    return this.httpClient.post<any>(
      this.apiUrl +
      `getSubmittedPOSearch`, obj
    );
  }

  CheckCustomShape(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    StructureElement: any,
    OrderSource: any
  ) {
    //return this.httpClient.get<any>(`https://localhost:5009/checkCustomShape/${CustomerCode}/${ProjectCode}/${JobID}/${StructureElement}/${OrderSource}`);
    return this.httpClient.get<any>(
      this.apiUrl +
      `checkCustomShape/${CustomerCode}/${ProjectCode}/${JobID}/${StructureElement}/${OrderSource}`
    );
  }

  showdirProcess(
    CustomerCode1: string,
    ProjectCode1: string,
    JobID: number,
    OrderSource: string,
    StructureElement: string,
    ProdType: string,
    ScheduledProd: string
  ) {
    let UserName = this.loginService.GetGroupName();
    // return this.httpClient.get(
    //   `https://localhost:5009/printOrderDetail/${CustomerCode1}/${ProjectCode1}/${JobID}/${OrderSource}/${StructureElement}/${ProdType}/${ScheduledProd}`,
    //   {
    //     responseType: 'blob', // Important to specify blob as the response type
    //   }
    // );
    return this.httpClient.get(
      this.apiUrl +
      `printOrderDetail/${CustomerCode1}/${ProjectCode1}/${JobID}/${OrderSource}/${StructureElement}/${ProdType}/${ScheduledProd}/${UserName}`,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }
  showdirOrderProcess(
    CustomerCode1: string,
    ProjectCode1: string,
    OrderSource: string,
    JobID: number,
    StructreElement: string,
    ProdType: string,
    ScheduledProd: string
  ) {
    // return this.httpClient.get(
    //   `https://localhost:5009/printOrderProcess/${CustomerCode1}/${ProjectCode1}/${OrderSource}/${JobID}/${StructreElement}/${ProdType}/${ScheduledProd}`,
    //   {
    //     responseType: 'blob', // Important to specify blob as the response type
    //   }
    // );
    return this.httpClient.get(
      this.apiUrl +
      `printOrderProcess/${CustomerCode1}/${ProjectCode1}/${OrderSource}/${JobID}/${StructreElement}/${ProdType}/${ScheduledProd}`,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  getAccountManager() {
    //return this.httpClient.get<any>(`https://localhost:5009/getAccountManager`);
    return this.httpClient.get<any[]>(
      this.apiUrl + `getAccountManager`
    );
  }

  CheckOrdersUpdate(obj: CheckOrdersUpdateModel) {
    //return this.httpClient.post<any>(`https://localhost:5009/CheckOrdersUpdate`, obj);
    return this.httpClient.post<any[]>(
      this.apiUrl + `CheckOrdersUpdate`,
      obj
    );
  }

  // getSearchResultData(obj: GetSubmittedPOSearchModel) {
  //   return this.httpClient.post<any[]>(`https://localhost:5009/getSubmittedPOSearchResult`, obj);
  //   // return this.httpClient.post<any[]>(
  //   //   this.apiUrl + `getSubmittedPOSearchResult`,
  //   //   obj
  //   // );
  // }

  getSearchResultData(obj: GetSubmittedPOSearchModel): Observable<any> {
     //return this.httpClient.post<any[]>(`https://localhost:5009/getSubmittedPOSearchResult`, obj, {
    return this.httpClient.post<any[]>(
      this.apiUrl + `getSubmittedPOSearchResult`,
      obj, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(
        timeout(900000), // 30 seconds timeout
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError('Something bad happened; please try again later.');
  }

  getCustomerSelectList() {
    let UserName = this.loginService.GetGroupName();
    let UserType = this.loginService.GetUserType();
    //return this.httpClient.get<any>(`https://localhost:5009/getCustomerSelectList/${pUserType}/${pGroupName}`);
    return this.httpClient.get<any[]>(
      this.apiUrl + `getCustomerSelectList/${UserType}/${UserName}`
    );
  }
  getProjectSelectList(CustomerCode: any) {
    let UserName = this.loginService.GetGroupName();
    //return this.httpClient.get<any[]>(`https://localhost:5009/getProject_SearchProcess/${CustomerCode}`);
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getProject_SearchProcess/${CustomerCode}/${UserName}`
    );
  }

  getProjectAllList(CustomerCode: any) {
    //return this.httpClient.get<any[]>(`https://localhost:5009/getAllProject/${CustomerCode}`);
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get<any[]>(
      this.apiUrl + `getAllProject/${CustomerCode}/${UserName}`
    );
  }

  ShowShapeList() {
    return this.httpClient.get(this.apiUrl + `ShowShapeList`, {
      responseType: 'blob', // Important to specify blob as the response type
    });

    // return this.httpClient.get(`https://localhost:5009/ShowShapeList`, {
    //   responseType: 'blob', // Important to specify blob as the response type
    // });
  }

  saveMeshBeamDetails_beam(obj: any) {
    // return this.httpClient.post<any>(
    //   `https://localhost:5009/saveMeshBeamDetails_beam`,
    //   obj
    // );
    return this.httpClient.post<any[]>(
      this.apiUrl + `saveMeshBeamDetails_beam`,
      obj
    );
  }

  getMeshColumnDetails_beam(
    CustomerCode: any,
    ProjectCode: any,
    PostID: any,
    BBSID: any
  ) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getMeshBeamDetails_beam/${CustomerCode}/${ProjectCode}/${PostID}/${BBSID}`
    );

    //return this.httpClient.get<any[]>(`https://localhost:5009/getMeshBeamDetails_beam/${CustomerCode}/${ProjectCode}/${PostID}/${BBSID}`);
  }
  getMeshColumnDetails_column(
    CustomerCode: any,
    ProjectCode: any,
    PostID: any,
    BBSID: any
  ) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getMeshColumnDetails_column/${CustomerCode}/${ProjectCode}/${PostID}/${BBSID}`
    );

    // return this.httpClient.get<any[]>(
    //   `https://localhost:5009/getMeshColumnDetails_column/${CustomerCode}/${ProjectCode}/${PostID}/${BBSID}`
    // );
  }

  getColumnDetailsNSH_column(CustomerCode: any, ProjectCode: any, PostID: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getColumnDetailsNSH_column/${CustomerCode}/${ProjectCode}/${PostID}`
    );

    // return this.httpClient.get<any[]>(
    //   `https://localhost:5009/getColumnDetailsNSH_column/${CustomerCode}/${ProjectCode}/${PostID}`
    // );
  }

  getOthersDetailsNSH(CustomerCode: any, ProjectCode: any, PostID: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getOthersDetailsNSH_ctsmesh/${CustomerCode}/${ProjectCode}/${PostID}`
    );

    // return this.httpClient.get<any[]>(
    //   `https://localhost:5009/getOthersDetailsNSH_ctsmesh/${CustomerCode}/${ProjectCode}/${PostID}`
    // );
  }

  getMeshOtherDetails(
    CustomerCode: any,
    ProjectCode: any,
    PostID: any,
    BBSID: any
  ) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getMeshOtherDetails_ctsmesh/${CustomerCode}/${ProjectCode}/${PostID}/${BBSID}`
    );

    // return this.httpClient.get<any[]>(
    //   `https://localhost:5009/getMeshOtherDetails_ctsmesh/${CustomerCode}/${ProjectCode}/${PostID}/${BBSID}`
    // );
  }

  getOthersProductCode_ctsmesh() {
    return this.httpClient
      .get<any[]>(this.apiUrl + `getOthersProductCode_ctsmesh`)
      .pipe(
        map((response: any[]) => {
          // Map the response to the desired format, for example, returning an array of objects with 'value' and 'label' properties
          return response.map((item) => ({
            value: item.MeshProductCode,
            label: item.MeshProductCode,
          }));
        }),
        tap((data) => {
          console.log('data', data);
        })
      );
    // return this.httpClient.get<any[]>(`https://localhost:5009/getOthersProductCode_ctsmesh`).pipe(
    //   map((response: any[]) => {

    //     return response.map(item => ({ value: item.MeshProductCode, label: item.MeshProductCode }));
    //   }),
    //   tap((data) => {
    //     console.log("data", data);
    //   })
    // );;
  }

  getOthersShapeCode_ctsmesh() {
    // return this.httpClient.get<any[]>(`https://localhost:5009/getOthersShapeCode_ctsmesh`).pipe(
    //   map((response: any[]) => {

    //     return response.map(item => ({ value: item, label: item }));
    //   }),
    //   tap((data) => {
    //     console.log("data", data);
    //   })
    // );
    let UserName = localStorage.getItem('ODOSUserName')
      ? localStorage.getItem('ODOSUserName')
      : 'vishalw_ttl@natsteel.com.sg';

    return this.httpClient
      .get<any[]>(
        this.apiUrl + `getOthersShapeCode_ctsmesh/${UserName}`
      )
      .pipe(
        map((response: any[]) => {
          // Map the response to the desired format, for example, returning an array of objects with 'value' and 'label' properties
          return response.map((item) => ({ value: item, label: item }));
        }),
        tap((data) => {
          console.log('data', data);
        })
      );
  }

  getShapeInfo_ctsmesh(
    CustomerCode: any,
    ProjectCode: any,
    PostID: any,
    ShapeCode: any
  ) {
    // return this.httpClient.get<any[]>(
    //   `https://localhost:5009/getShapeInfo_ctsmesh/${CustomerCode}/${ProjectCode}/${PostID}/${ShapeCode}`
    // );

    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getShapeInfo_ctsmesh/${CustomerCode}/${ProjectCode}/${PostID}/${ShapeCode}`
    );
  }
  getProductInfo_ctsmesh(ProductCode: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl + `getProductInfo_ctsmesh/${ProductCode}`
    );

    // return this.httpClient.get<any[]>(
    //   `https://localhost:5009/getProductInfo_ctsmesh/${ProductCode}`
    // );
  }
  ChkCreationStatus(obj: any) {
    //return this.httpClient.post<any>(`https://localhost:5009/chkCreationStatus`, obj);
    return this.httpClient.post<any>(
      this.apiUrl + `chkCreationStatus`,
      obj
    );
  }
  CheckCancelStatus(obj: any) {
    //return this.httpClient.post<any>(`https://localhost:5009/CheckCancelStatus`, obj);
    return this.httpClient.post<any>(
      this.apiUrl + `CheckCancelStatus`,
      obj
    );
  }
  CheckOrdersCancel(obj: CheckOrderCancelModel) {
    //return this.httpClient.post<any[]>(`https://localhost:5009/CheckOrdersCancel`, obj);
    return this.httpClient.post<any[]>(
      this.apiUrl + `CheckOrdersCancel`,
      obj
    );
  }
  getProjectDetails_bpc(obj: any) {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getProjectDetails_bpc/${obj.CustomerCode}/${obj.ProjectCode}/${UserName}`
    );
  }

  saveBBS(obj: any) {
    return this.httpClient.post<any[]>(
      this.apiUrl +
      `saveBBS_bpc​/SourceCustomerCode​/ProjectCode​/Template​/JobID`,
      obj
    );
  }

  BatchChangeStatus_Data(obj: BatchChangeStatusModel) {
    let UserName = this.loginService.GetGroupName();
    //return this.httpClient.post<any>(`https://localhost:5009/BatchChangeStatus_Data/${UserName}`, obj);
    return this.httpClient.post<any>(
      this.apiUrl + `BatchChangeStatus_Data/${UserName}`,
      obj
    );
  }
  SaveBBS_OrderDetails(obj: SaveBBSOrderDetails) {
    //return this.httpClient.post<any>(`https://localhost:5009/saveBBS_OrderDetails`, obj);
    return this.httpClient.post<any>(
      this.apiUrl + `saveBBS_OrderDetails`,
      obj
    );
  }

  getDOMaterial_Delivered(
    CustomerCode: any,
    ProjectCode: any,
    DONumbers: any,
    DODate: any
  ) {
    // return this.httpClient.get<any>(
    //   `https://localhost:5009/getDOMaterial_Delivered/${CustomerCode}/${ProjectCode}/${DONumbers}/${DODate}`
    // );
    return this.httpClient.get<any>(
      this.apiUrl +
      `getDOMaterial_Delivered/${CustomerCode}/${ProjectCode}/${DONumbers}/${DODate}`
    );
  }

  get_AddlLimmit() {
    //return this.httpClient.get<any>(`https://localhost:5009/getAddlLimmit`);
    return this.httpClient.get<any>(this.apiUrl + `getAddlLimmit`);
  }

  get_AddlLimmitShape() {
    // return this.httpClient.get<any>(
    //   `https://localhost:5009/getAddlLimmitShape`
    // );
    return this.httpClient.get<any>(
      this.apiUrl + `getAddlLimmitShape`
    );
  }

  reload_AddnParLimit() {
    //return this.httpClient.get<any>(`https://localhost:5009/getAddlParLimmit`);
    return this.httpClient.get<any>(
      this.apiUrl + `getAddlParLimmit`
    );
  }

  RetriveData(
    OrdersAmendment: OrdersForAmendment,
    RDateFrom: string,
    RDateTo: string,
    Rev_required_Conf_date_from: string,
    Rev_required_Conf_date_to: string,
    Rev_Req_Confirmed_Date_Search_Range: string
  ) {
    // return this.httpClient.post<any>(
    //   `https://localhost:5009/OrdersForAmendment/${RDateFrom}/${RDateTo}/${Rev_required_Conf_date_from}/${Rev_required_Conf_date_to}/${Rev_Req_Confirmed_Date_Search_Range}`,
    //   OrdersAmendment
    // );
    return this.httpClient.post<any>(
      this.apiUrl +
      `OrdersForAmendment/${RDateFrom}/${RDateTo}/${Rev_required_Conf_date_from}/${Rev_required_Conf_date_to}/${Rev_Req_Confirmed_Date_Search_Range}`,
      OrdersAmendment
    );
  }
  GetDesignationList(DesignationType: any) {
    // return this.httpClient.get<any>(
    //   `https://localhost:5009/GetDesignationData/${DesignationType}`
    // );
    return this.httpClient.get<any>(
      this.apiUrl + `GetDesignationData/${DesignationType}`
    );
  }
  GetAmendmentCustandProj() {
    // return this.httpClient.get<any>(
    //   `https://localhost:5009/GetCustomerAndProject`
    // );
    return this.httpClient.get<any>(
      this.apiUrl + `GetCustomerAndProject`
    );
  }
  GetAmendmentProjects(CustomerCode: any) {
    // return this.httpClient.get<any>(
    //   `https://localhost:5009/getProject/${CustomerCode}/${UserName}`
    // );
    let UserName=this.loginService.GetGroupName();
    return this.httpClient.get<any>(
      this.apiUrl + `getProject_Amendment/${CustomerCode}/${UserName}`
    );
  }
  AmendmentIndicators(AmendmentInd: AmendmentIndicators) {
    // return this.httpClient.post<any>(
    //   `https://localhost:5009/Amendment_Indicators`,
    //   AmendmentInd
    // );
    return this.httpClient.post<any>(
      this.apiUrl + `Amendment_Indicators`,
      AmendmentInd
    );
  }

  AmendmentRequiredDates(obj: AmendmentRequiredDate) {
    // return this.httpClient.post<any>(
    //   `https://localhost:5009/Amendment_Required_Dates`,
    //   obj
    // );
    return this.httpClient.post<any>(
      this.apiUrl + `Amendment_Required_Dates`,
      obj
    );
  }

  saveMeshOthersDetails_ctsmesh(obj: any) {
    let UserName = this.loginService.GetGroupName();
    // return this.httpClient.post<any>(
    //   `https://localhost:5009/saveMeshOthersDetails_ctsmesh/${UserName}`,
    //   obj
    // );
    return this.httpClient.post<any[]>(
      this.apiUrl + `saveMeshOthersDetails_ctsmesh`,
      obj
    );
  }
  getOthersProductCode_ctsmesh_weight() {
    // return this.httpClient.get<any[]>(
    //   this.apiUrl +
    //   `getBeamDetailsNSH_beam/${CustomerCode}/${ProjectCode}/${PostID}`
    // );
    return this.httpClient
      .get<any[]>(this.apiUrl + `getOthersProductCode_ctsmesh`)
      .pipe(
        map((response: any[]) => {
          // Map the response to the desired format, for example, returning an array of objects with 'value' and 'label' properties
          return response.map((item) => ({
            value: item.MeshWeightArea,
            label: item.MeshWeightArea,
          }));
        }),
        tap((data) => {
          console.log('data', data);
        })
      );

    // return this.httpClient
    //   .get<any[]>(`https://localhost:5009/getOthersProductCode_ctsmesh`)
    //   .pipe(
    //     map((response: any[]) => {
    //       // Map the response to the desired format, for example, returning an array of objects with 'value' and 'label' properties
    //       return response.map((item) => ({
    //         value: item.MeshWeightArea,
    //         label: item.MeshWeightArea,
    //       }));
    //     }),
    //     tap((data) => {
    //       console.log('data', data);
    //     })
    //   );
  }

  GetShapeList(ShapeCategory: any) {
    return this.httpClient.get<any[]>(
      this.apiUrl + `getShapeImagesByCat/${ShapeCategory}`
    );
    // return this.httpClient.get<any[]>(
    //   `https://localhost:5009/getShapeImagesByCat/${ShapeCategory}`
    // );
  }

  getShapeCodeList_ctsmesh(
    CustomerCode: string,
    ProjectCode: string,
    CouplerType: string
  ): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getShapeCodeList_ctsmesh/${CustomerCode}/${ProjectCode}/${CouplerType}`
    );
    // return this.httpClient.get<any[]>(
    //   `https://localhost:5009/getShapeCodeList_ctsmesh/${CustomerCode}/${ProjectCode}/${CouplerType}`
    // );
  }

  getShapeImagesByCat_CAB(
    CustomerCode: string,
    ProjectCode: string,
    ShapeCategory: string,
    CouplerType: string
  ) {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getShapeImagesByCat/${CustomerCode}/${ProjectCode}/${ShapeCategory}/${CouplerType}/${UserName}`
    );
    // return this.httpClient.get<any[]>(`https://localhost:5009/getShapeImagesByCat/${CustomerCode}/${ProjectCode}/${ShapeCategory}/${CouplerType}/${UserName}`);
  }

  getShapeImagesByCat(ShapeCategory: string): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl + `getShapeImagesByCat/${ShapeCategory}`
    );
    // return this.httpClient.get<any[]>(
    //   `https://localhost:5009/getShapeImagesByCat/${ShapeCategory}`
    // );
  }

  PrintShapes(ShapeCategory: any) {
    // return this.httpClient.get(
    //   `https://localhost:5009/printshapes_ctsmesh/${ShapeCategory}`,
    //   {
    //     responseType: 'blob', // Important to specify blob as the response type
    //   }
    // );
    return this.httpClient.get(
      this.apiUrl + `printshapes_ctsmesh/${ShapeCategory}`,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  PrintProduct(ShapeCategory: any) {
    // return this.httpClient.get(
    //   `https://localhost:5009/printProduct_ctsmesh/${ShapeCategory}`,
    //   {
    //     responseType: 'blob', // Important to specify blob as the response type
    //   }
    // );
    return this.httpClient.get(
      this.apiUrl + `printProduct_ctsmesh/${ShapeCategory}`,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  UpdateSUM_ctsmesh(
    CustomerCode: any,
    ProjectCode: any,
    JobID: any
  ): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `UpdateSUM_ctsmesh/${CustomerCode}/${ProjectCode}/${JobID}`
    );
    // return this.httpClient.get<any[]>(
    //   `https://localhost:5009/UpdateSUM_ctsmesh/${CustomerCode}/${ProjectCode}/${JobID}`
    // );
  }

  getBBSOrderNSH(
    CustomerCode: any,
    ProjectCode: any,
    PostID: any,
    StructureElement: any
  ) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getBBSOrderNSH_prc/${CustomerCode}/${ProjectCode}/${PostID}/${StructureElement}`
    );
    // return this.httpClient.get<any[]>(`https://localhost:5009/getBBSOrderNSH_prc/${CustomerCode}/${ProjectCode}/${PostID}/${StructureElement}`);
  }

  getBBSOrder_prc(
    CustomerCode: any,
    ProjectCode: any,
    PostID: any,
    StructureElement: any
  ) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getBBSOrder_prc/${CustomerCode}/${ProjectCode}/${PostID}/${StructureElement}`
    );

    // return this.httpClient.get<any[]>(
    //   `https://localhost:5009/getBBSOrder_prc/${CustomerCode}/${ProjectCode}/${PostID}/${StructureElement}`
    // );
  }

  showdirCreate(pOrderNumber: number) {
    let UserName = this.loginService.GetGroupName();
    // return this.httpClient.get(
    //   `https://localhost:5009/printOrderDetail_neworder/${pOrderNumber}/${UserName}`,
    //   {
    //     responseType: 'blob', // Important to specify blob as the response type
    //   }
    // );
    return this.httpClient.get(
      this.apiUrl + `printOrderDetail_neworder/${pOrderNumber}/${UserName}`,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  showdirCreateSummary(pOrderNumber: number) {
    // return this.httpClient.get(
    //   `https://localhost:5009/printOrderDetailSummary_neworder/${pOrderNumber}`,
    //   {
    //     responseType: 'blob', // Important to specify blob as the response type
    //   }
    // );
    return this.httpClient.get(
      this.apiUrl +
      `printOrderDetailSummary_neworder/${pOrderNumber}`,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  Save_JobAdvice(obj: JobAdviceModels) {
    // return this.httpClient.post<any>(
    //   `https://localhost:5009/saveMeshOthersDetails_ctsmesh`,
    //   obj
    // );
    return this.httpClient.post<any[]>(
      this.apiUrl + `SaveJobAdvice`,
      obj
    );
  }

  check_BBSNo(
    CustomerCode: string,
    ProjectCode: string,
    JobID: number,
    BBSNo: string
   )
   {   let obj={
      CustomerCode :CustomerCode,
      ProjectCode:ProjectCode,
      JobID :JobID,
      BBSNo: BBSNo
    }
    //return this.httpClient.post<any>(`https://localhost:5009/checkBBSNo`,obj);
    return this.httpClient.post<any>(`${this.apiUrl}checkBBSNo`,obj);
   //: Observable<any> {
  //   return this.httpClient.get<any[]>(
  //     this.apiUrl +
  //     `checkBBSNo/${CustomerCode}/${ProjectCode}/${JobID}/${BBSNo}`
  //   );
    // return this.httpClient.get<any[]>(
    //   `https://localhost:5009/checkBBSNo/${CustomerCode}/${ProjectCode}/${JobID}/${BBSNo}`
    // );
  }
  GetMinimumBundlePcs() {
    // return this.httpClient.get<any>(`https://localhost:5009/SBDetails`);
    return this.httpClient.get<any>(this.apiUrl + `SBDetails`);
  }



  get_CreepDeduction(obj: OrderDetailsRetModels, InvLength: number) {
    // return this.httpClient.post<any>(
    //   `https://localhost:5009/getCreepDeduction/${RDateFrom}/${RDateTo}/${Rev_required_Conf_date_from}/${Rev_required_Conf_date_to}/${Rev_Req_Confirmed_Date_Search_Range}`,
    //   OrdersAmendment
    // );
    return this.httpClient.post<any>(
      this.apiUrl + `getCreepDeduction/${InvLength}`,
      obj
    );
  }
  // [("/getOrderDetails_bpc/CustomerCode/ProjectCode/Template/JobID")]

  // [("/getBBS_bpc/CustomerCode/ProjectCode/Template/JobID")]

  //getBBSOrder_prc

  //Bpc changes starts here
  // localUrl = 'http://172.25.1.224:78';
  localUrl = this.apiUrl;
  // [("/getTemplateData_bpc/CustomerCode/ProjectCode/PileDia/BarDia/BarQty")]
  getTemplateData_bpc(obj: any) {
    console.log('getTemplateData_bpc=>', obj);
    let params = new HttpParams()
      .set('CustomerCode', obj.CustomerCode)
      .set('ProjectCode', obj.ProjectCode);
    return this.httpClient.get<any[]>(
      `${this.localUrl}getTemplateData_bpc/${obj.CustomerCode}/${obj.ProjectCode}/${obj.PileDia}/${obj.BarDia}/${obj.BarQty}`
    );
    // https://localhost:5009/getTemplateData_bpc/0001101200/0000113013/null/null/null
  }
  // [Route("/deletePODocs_bpc/{CustomerCode}/{ProjectCode}/{JobID}/{PODocID}")]
  deletePODocs_bpc(obj: any) {
    return this.httpClient.get<any[]>(
      `${this.localUrl}deletePODocs_bpc/${obj.CustomerCode}/${obj.ProjectCode}/${obj.JObiD}/${obj.PODocID}`
    );
  }
  // [Route("/downloadPODocs_bpc/{CustomerCode}/{ProjectCode}/{JobID}/{PODocID}")]
  downloadPODocs_bpc(obj: any) {
    return this.httpClient.get<any[]>(
      `${this.localUrl}downloadPODocs_bpc/${obj.CustomerCode}/${obj.ProjectCode}/${obj.JObiD}/${obj.PODocID}`
    );
  }
  // [Route("/checkPODocs_bpc/{CustomerCode}/{ProjectCode}/{JobID}")]
  checkPODocs_bpc(obj: any) {
    return this.httpClient.get<any[]>(
      `${this.localUrl}checkPODocs_bpc/${obj.CustomerCode}/${obj.ProjectCode}/${obj.JObiD}`
    );
  }
  // [Route("/sendOrderSubmittedEmail_bpc/{CustomerCode}/{ProjectCode}/{JobID}")]
  sendOrderSubmittedEmail_bpc(obj: any) {
    return this.httpClient.get<any[]>(
      `${this.localUrl}sendOrderSubmittedEmail_bpc/${obj.CustomerCode}/${obj.ProjectCode}/${obj.JObiD}`
    );
  }
  // [Route("/getProject_bpc/{CustomerCode}")]
  getProject_bpc(obj: any) {
    obj.UserName = this.loginService.GetGroupName();
    return this.httpClient.get<any[]>(
      `${this.localUrl}getProject_bpc/${obj.CustomerCode}/${obj.UserName}`
    );
  }
  // [Route("/RemoveNonBPCProject_Oracle_bpc")] POST
  RemoveNonBPCProject_Oracle_bpc(obj: any) {
    return this.httpClient.get<any[]>(
      `${this.localUrl}RemoveNonBPCProject_Oracle_bpc`
    );
  }
  // [Route("/RemoveNonBPCProject_bpc")] poST
  RemoveNonBPCProject_bpc(obj: any) {
    return this.httpClient.get<any[]>(
      `${this.localUrl}RemoveNonBPCProject_bpc/${obj.CustomerCode}/${obj.ProjectCode}/${obj.JObiD}/${obj.PODocID}`
    );
  }
  // [Route("/getOrderList_bpc/{CustomerCode}/{ProjectCode}/{Template}")]
  getOrderList_bpc(obj: any) {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get<any[]>(
      `${this.localUrl}getOrderList_bpc/${obj.CustomerCode}/${obj.ProjectCode}/${obj.template}/${UserName}`
    );
  }
  // [Route("/getOrderDetails_bpc/{CustomerCode}/{ProjectCode}/{Template}/{JobID}")]
  getOrderDetails_bpc(obj: any) {
    return this.httpClient.get<any[]>(
      `${this.localUrl}getOrderDetails_bpc/${obj.CustomerCode}/${obj.ProjectCode}/${obj.template}/${obj.JObiD}`
    );
  }
  // [Route("/getRebarData_bpc/{CustomerCode}/{ProjectCode}/{JobID}/CageID/{Template}")]
  getRebarData_bpc(obj: any) {
    return this.httpClient.get<any[]>(
      `${this.localUrl}getRebarData_bpc/${obj.CustomerCode}/${obj.ProjectCode}/${obj.JobID}/CageID/${obj.Template}?CageID=${obj.CageID}`
    );
  }
  // [Route("/getBPCConfig_bpc/{CustomerCode}/{ProjectCode}")]
  getBPCConfig_bpc(obj: any) {
    return this.httpClient.get<any[]>(
      `${this.localUrl}getBPCConfig_bpc/${obj.CustomerCode}/${obj.ProjectCode}`
    );
  }
  // [Route("/SaveBPCConfig_bpc/{CustomerCode}/{ProjectCode}/{SLLapping}")]
  SaveBPCConfig_bpc(obj: any) {
    return this.httpClient.get<any[]>(
      `${this.localUrl}SaveBPCConfig_bpc/${obj.CustomerCode}/${obj.ProjectCode}/${obj.SLLapping}`
    );
  }
  // [Route("/SaveJobAdvice_bpc")] Post
  SaveJobAdvice_bpc(obj: any) {
    obj.UpdateBy = this.loginService.GetGroupName();
    return this.httpClient.post<any[]>(
      `${this.localUrl}SaveJobAdvice_bpc`,
      obj
    );
  }
  // [Route("/OrderWithdraw_bpc/{CustomerCode}/{ProjectCode}/{JobID}")]
  OrderWithdraw_bpc(obj: any) {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get<any[]>(
      `${this.localUrl}OrderWithdraw_bpc/${obj.CustomerCode}/${obj.ProjectCode}/${obj.JObiD}/${UserName}`
    );
  }
  // [Route("/getLibraryData_bpc/{SearchType}/{SearchString}")]
  getLibraryData_bpc(obj: any) {
    return this.httpClient.get<any[]>(
      `${this.localUrl}getLibraryData_bpc/${obj.SearchType}/${obj.SearchString}`
    );
  }
  // [Route("/getBBS_bpc/{CustomerCode}/{ProjectCode}/{Template}/{JobID}")]
  getBBS_bpc(obj: any) {
    return this.httpClient.get<any[]>(
      `${this.localUrl}getBBS_bpc/${obj.CustomerCode}/${obj.ProjectCode}/${obj.Template}/${obj.JobID}`
    );
  }
  // [Route("/getCopyOrderList_bpc/{CustomerCode}/{ProjectCode}/{CopyModel}")]
  getCopyOrderList_bpc(obj: any) {
    return this.httpClient.get<any[]>(
      `${this.localUrl}getCopyOrderList_bpc/${obj.CustomerCode}/${obj.ProjectCode}/${obj.CopyModel}`
    );
  }
  // [Route("/getCopyOrderDetails_bpc/{CustomerCode}/{ProjectCode}/CopyModel/{JobID}")]
  getCopyOrderDetails_bpc(obj: any) {
    return this.httpClient.get<any[]>(
      `${this.localUrl}getCopyOrderDetails_bpc/${obj.CustomerCode}/${obj.ProjectCode}/${obj.CopyModel}/${obj.JObiD}`
    );
  }
  // [Route("/setCloneOrder_bpc/{CustomerCode}/{ProjectCode}/{JobID}/{Template}/CloneNo")]
  setCloneOrder_bpc(obj: any) {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get<any[]>(
      `${this.localUrl}setCloneOrder_bpc/${obj.CustomerCode}/${obj.ProjectCode}/${obj.JObiD}/${obj.template}/${obj.CloneNo}/${UserName}`
    );
  }
  // [Route("/copyBPCLibrary_bpc/{SourceCustomerCode}/{SourceProjectCode}/{SourceJobIDs}/{DesCustomerCode}/{DesProjectCode}")]
  copyBPCLibrary_bpc(obj: any) {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get<any[]>(
      `${this.localUrl}copyBPCLibrary_bpc/${obj.SourceCustomerCode}/${obj.SourceProjectCode}/${obj.SourceJobIDs}/${obj.DesCustomerCode}/${obj.DesProjectCode}/${UserName}`
    );
  }
  // [Route("/saveBBS_bpc/{SourceCustomerCode}/{ProjectCode}/{Template}/{JobID}")]

  saveBBS_bpc(obj: any) {
    return this.httpClient.post<any[]>(
      `${this.localUrl}saveBBS_bpc/${obj.CustomerCode}/${obj.ProjectCode}/${obj.Template}/${obj.JobID}?CustomerCode=${obj.CustomerCode}`,
      { BPCModels: obj.BPCModels }
    );
  }
  // [Route("/saveLibData_bpc/{CustomerCode}/{ProjectCode}/{JobID}/{LinkToCover}/{CageName}")]
  saveLibData_bpc(
    obj: any,
    ProjectCode: any,
    JobID: any,
    LinkToCover: any,
    CageName: any,
    CustomerCode: any
  ) {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.post<any[]>(
      `${this.localUrl}saveLibData_bpc/${CustomerCode}/${ProjectCode}/${JobID}/${LinkToCover}/${CageName}/${UserName}`,
      // `${this.localUrl}saveLibData_bpc/${CustomerCode}/${ProjectCode}/${JobID}/${LinkToCover}/${CageName}`,
      obj
    );
  }
  updateStiffenerRing(obj:BoredPileElevationStiffenerModel){
    return this.httpClient.post<any[]>(
      `${this.localUrl}updateStiffenerRing`,
      obj
    );

  }
  updateMainBar_Customization(obj:BoredPileCustomMainBarModel){
    return this.httpClient.post<any[]>(
      `${this.localUrl}updateMainBar_Customization`,
      obj
    );

  }
  // [Route("/deleteLibItem_bpc/{CustomerCode}/{ProjectCode}/{JobID}")]
  deleteLibItem_bpc(obj: any) {
    return this.httpClient.get<any[]>(
      `${this.localUrl}deleteLibItem_bpc/${obj.CustomerCode}/${obj.ProjectCode}/${obj.JobID}`
    );
  }
  // [Route("/genBPCSAPMaterialCode_bpc")] Post
  genBPCSAPMaterialCode_bpc(obj: any) {
    return this.httpClient.get<any[]>(
      `${this.localUrl}genBPCSAPMaterialCode_bpc`
    );
  }
  // [Route("/genBPCSetCode_bpc/{pID}")]
  genBPCSetCode_bpc(obj: any) {
    return this.httpClient.get<any[]>(
      `${this.localUrl}genBPCSetCode_bpc/${obj.pID}`
    );
  }
  // [Route("/SaveRebarDetails_bpc")] POST
  SaveRebarDetails_bpc(obj: any) {
    return this.httpClient.post<any[]>(
      `${this.localUrl}SaveRebarDetails_bpc`,
      obj
    );
  }
  // [Route("/SaveMainBar_bpc/{pBarID}/{pSortID}/{pShapeCode}/{pElemMark}/{pBarMark}/{pBarDia}/{pBarLength}/{pBarQty}/{pA}/{pB}/{pC}/{pD}/{pE}/{pF}/{pG}")]
  SaveMainBar_bpc(obj: any) {
    return this.httpClient.get<any[]>(
      `${this.localUrl}SaveMainBar_bpc/${obj.pBarID}/${obj.pSortID}/${obj.pShapeCode}/${obj.pElemMark}/${obj.pBarMark}/${obj.pBarDia}/${obj.pBarLength}/${obj.pBarQty}/${obj.pA}/${obj.pB}/${obj.pC}/${obj.pD}/${obj.pE}/${obj.pF}/${obj.pG}`
    );
  }
  // [Route("/getRebarWeight_bpc/{pDia}/{pLength}")]
  getRebarWeight_bpc(obj: any) {
    return this.httpClient.get<any[]>(
      `${this.localUrl}getRebarWeight_bpc/${obj.pDia}/${obj.pLength}`
    );
  }
  // [Route("/AssignTemplates_bpc")] POST
  AssignTemplates_bpc(obj: any) {
    return this.httpClient.get<any[]>(`${this.localUrl}AssignTemplates_bpc`);
  }
  // [Route("/ValidatePONumber_bpc/{CustomerCode}/{ProjectCode}/{Template}/{JobID}/PONumber")]
  ValidatePONumber_bpc(obj: any) {
    return this.httpClient.get<any[]>(
      `${this.localUrl}ValidatePONumber_bpc/${obj.CustomerCode}/${obj.ProjectCode}/${obj.Template}/${obj.JobID}/${obj.PONumber}`
    );
  }
  // [Route("/printOrderDetail_bpc/{CustomerCode}/{ProjectCode}/{Template}/{JobID}")]
  printOrderDetail_bpc(obj: any) {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get(
      `${this.localUrl}printOrderDetail_bpc/${obj.CustomerCode}/${obj.ProjectCode}/${obj.Template}/${obj.JobID}/${UserName}`,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }
  // [Route("/printLib_bpc/{CustomerCode}/{ProjectCode}/{Template}/{JobID}")]
  printLib_bpc(obj: any) {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get(
      `${this.localUrl}printLib_bpc/${obj.CustomerCode}/${obj.ProjectCode}/${obj.Template}/${obj.JobID}/${UserName}`,
      {
        responseType: 'blob',
      }
    );
  }
  // [Route("/GetPDF_bpc/{pHTML}")]
  GetPDF_bpc(obj: any) {
    return this.httpClient.get<any[]>(
      `${this.localUrl}GetPDF_bpc/${obj.pHTML}`
    );
  }
  // [Route("/SaveDrawing_bpc/{CustomerCode}/{ProjectCode}/{JobID}")]
  SaveDrawing_bpc(obj: any) {
    return this.httpClient.get<any[]>(
      `${this.localUrl}SaveDrawing_bpc/${obj.CustomerCode}/${obj.ProjectCode}/${obj.JobID}`
    );
  }
  // [Route("/Dispose_bpc/disposing")]
  Dispose_bpc(obj: any) {
    return this.httpClient.get<any[]>(`${this.localUrl}Dispose_bpc/disposing`);
  }
  // [Route("/getSupportBarSetting_bpc")]
  getSupportBarSetting_bpc() {
    return this.httpClient.post<any[]>(
      `${this.localUrl}getSupportBarSetting_bpc`,
      {}
    );
  }
  getBPCData(obj: any) {
    return this.httpClient.post<any[]>(`${this.localUrl}getBPCData`, obj);
  }

  deleteMeshOthersDetails_ctsmesh(
    CustomerCode: any,
    ProjectCode: any,
    JobID: any,
    BBSID: any,
    MeshID: any
  ) {
    // return this.httpClient.get<any[]>(
    //   this.apiUrl +
    //   `getBeamDetailsNSH_beam/${CustomerCode}/${ProjectCode}/${PostID}`
    // );
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `deleteMeshOthersDetails_ctsmesh/${CustomerCode}/${ProjectCode}/${JobID}/${BBSID}/${MeshID}`
    );
    // return this.httpClient.get<any[]>(`https://localhost:5009/deleteMeshOthersDetails_ctsmesh/${CustomerCode}/${ProjectCode}/${JobID}/${BBSID}/${MeshID}`);
  }
  getCouplerType_prc(
    CustomerCode: string,
    ProjectCode: string
  ): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getCouplerType_prc/${CustomerCode}/${ProjectCode}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getCouplerType/${CustomerCode}/${ProjectCode}`);
  }

  getProjectsOrder(CustomerCode: any): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl + `getProject/${CustomerCode}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getProject/${CustomerCode}`);
  }

  getCopyBBSOrderListOrder(
    CustomerCode: any,
    ProjectCode: any
  ): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getCopyBBSOrderList/${CustomerCode}/${ProjectCode}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getCopyBBSOrderList/${CustomerCode}/${ProjectCode}`);
  }

  CopyOrders(obj: any): Observable<any> {
    return this.httpClient.post<any[]>(
      this.apiUrl + `copyBBS`,
      obj
    );
    //return this.httpClient.post<any[]>(`https://localhost:5009/copyBBS`, obj);
  }

  getCustomerOrder(CustomerCode: any, UserName: any): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `ORderDetailCustomer/${CustomerCode}/${UserName}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/ORderDetailCustomer/${CustomerCode}${UserName}`);
  }

  DeleteBBSOrder(
    CustomerCode: any,
    ProjectCode: any,
    JobID: any,
    BBSID: any,
    BarsCount: any,
    UpdateBy: any
  ): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `deleteBBS/${CustomerCode}/${ProjectCode}/${JobID}/${BBSID}/${BarsCount}/${UpdateBy}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/deleteBBS/${CustomerCode}/${ProjectCode}/${JobID}/${BBSID}/${BarsCount}/${UpdateBy}`);
  }

  getBarDetails_prc(
    CustomerCode: string,
    ProjectCode: string,
    JobID: number,
    BBSID: number,
    BYNSH: any,
    GroupMarkID: any,
    MemberQty: any
  ): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getBarDetails_prc/${CustomerCode}/${ProjectCode}/${JobID}/${BBSID}/${BYNSH}/${GroupMarkID}/${MemberQty}`
    );
    // return this.httpClient.get<any[]>(

    //   `https://localhost:5009/getBarDetails_prc/${CustomerCode}/${ProjectCode}/${JobID}/${BBSID}/${BYNSH}/${GroupMarkID}/${MemberQty}`
    // );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getBarDetails/${CustomerCode}/${ProjectCode}/${JobID}/${BBSID}`);
  }

  //added by vidhya for ESM Tracker

  PrintBBSDocument(CustomerCode: string, ProjectCode: string, JobID: number) {
    // return this.httpClient.get(
    //   `https://localhost:5009/printOrderDetails_bbs/${CustomerCode}/${ProjectCode}/${JobID}`,
    //   {
    //     responseType: 'blob', // Important to specify blob as the response type
    //   }
    // );
    return this.httpClient.post(
      this.apiUrl +
      `printOrderDetails_bbs/${CustomerCode}/${ProjectCode}/${JobID}`,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  getESMTrackingDetails(
    structureElementTypeId: any,
    productTypeId: any,
    projectId: any
  ) {
    // return this.httpClient.get<any>(`https://localhost:5009/ESMTrackingDetailsGet/${structureElementTypeId}/${productTypeId}/${projectId}`);
    return this.httpClient.get<any>(
      this.apiUrl +
      `ESMTrackingDetailsGet/${structureElementTypeId}/${productTypeId}/${projectId}`
    );
  }

  getESMTrackingDetailsById(trackingId: any) {
    //return this.httpClient.get<any>(`https://localhost:5009/GetESMTrackingDetailsByTrackNum/${trackingId}`);
    return this.httpClient.get<any>(
      this.apiUrl + `GetESMTrackingDetailsByTrackNum/${trackingId}`
    );
  }

  SaveESMTrackingDetails(obj: SaveEsmTracker) {
    //return this.httpClient.post<any>(`https://localhost:5009/SaveESMTrackingDetails`, obj);
    return this.httpClient.post<any>(
      this.apiUrl + `SaveESMTrackingDetails`,
      obj
    );
  }

  UpdateESMTrackingDetails(obj: SaveEsmTracker) {
    //return this.httpClient.post<any>(`https://localhost:5009/UpdateESMTrackingDetails`, obj);
    return this.httpClient.post<any>(
      this.apiUrl + `UpdateESMTrackingDetails`,
      obj
    );
  }

  Get_WBS1(projectid: any, structElement: any, ProductType: any) {
    //return this.httpClient.get<any[]>(`https://localhost:5010/GetWBS1/${projectid}/${structElement}/${ProductType}`);
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `UtilityService/GetWBS1/${projectid}/${structElement}/${ProductType}`
    );
  }

  Get_WBS2(projectid: any, structElement: any, ProductTypeId: any, wbs1: any) {
    const obj: GETWBS_Copy = {
      ProjectId: 0,
      structureElementId: 0,
      productTypeId: 0,
      WBS1: wbs1,
      WBSFrom: '',
      WBSTo: '',
      WBS3: '',
    };
    //return this.httpClient.post<any[]>(`https://localhost:5010/GetWBS2/${projectid}/${structElement}/${ProductTypeId}`, obj);
    return this.httpClient.post<any[]>(
      this.apiUrl +
      `UtilityService/GetWBS2/${projectid}/${structElement}/${ProductTypeId}`,
      obj
    );
  }
  Get_WBS3(
    projectid: any,
    structElement: any,
    ProductTypeId: any,
    wbs1: any,
    wbs2: any
  ) {
    const obj: GETWBS_Copy = {
      ProjectId: 0,
      structureElementId: 0,
      productTypeId: 0,
      WBS1: wbs1,
      WBSFrom: wbs2,
      WBSTo: '',
      WBS3: '',
    };

    //return this.httpClient.post<any[]>(`https://localhost:5010/GetWBS3/${projectid}/${structElement}/${ProductTypeId}`,obj);
    return this.httpClient.post<any[]>(
      this.apiUrl +
      `UtilityService/GetWBS3/${projectid}/${structElement}/${ProductTypeId}`,
      obj
    );
  }

  //END BY VIDHYA
  BarDetails(obj: BarDetails) {
    //return this.httpClient.post<any>(`https://localhost:5009/getVarBarDetails`, obj);
    return this.httpClient.post<any>(
      this.apiUrl + `getVarBarDetails`,
      obj
    );
  }

  ExcelImport(obj: any) {
    //return this.httpClient.post<any>(`https://localhost:5009/ExcelImport`, obj);
    return this.httpClient.post<any>(
      this.apiUrl + `ExcelImport`,
      obj
    );
  }
  VarianceData(obj: any) {
    //return this.httpClient.post<any>(`https://localhost:5009/getVarBarDetails`, obj);
    return this.httpClient.post<any>(
      this.apiUrl + `getVarBarDetails`,
      obj
    );
  }

  showdirPrintOrder(
    CustomerCode1: string,
    ProjectCode1: string,
    JobID: number,
    formatId:number
  ) {
    // return this.httpClient.get(
    //   `https://localhost:5009/printOrderDetail_PrintBBS/${CustomerCode1}/${ProjectCode1}/${JobID}/${formatId}`,
    //   {
    //     responseType: 'blob', // Important to specify blob as the response type
    //   }
    // );
    return this.httpClient.get(
      this.apiUrl +
      `printOrderDetail_PrintBBS/${CustomerCode1}/${ProjectCode1}/${JobID}/${formatId}`,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  showdirBBSShape(CustomerCode1: string, ProjectCode1: string, JobID: number) {
    //   return this.httpClient.get(
    //     `https://localhost:5009/printOrderDetailShape/${CustomerCode1}/${ProjectCode1}/${JobID}`,
    //     {
    //       responseType: 'blob', // Important to specify blob as the response type
    //     }
    //   );
    return this.httpClient.get(
      this.apiUrl +
      `printOrderDetailShape/${CustomerCode1}/${ProjectCode1}/${JobID}`,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  Get_WBS1Order(
    CustomerCode: any,
    ProjectCode: any,
    JobID: any,
    ProdType: any,
    WBS1: any,
    WBS2: any
  ): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getWBSAll/${CustomerCode}/${ProjectCode}/${JobID}/${ProdType}/${WBS1}/${WBS2}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getWBSAll/${CustomerCode}/${ProjectCode}/${JobID}/${ProdType}/${WBS1}/${WBS2}`);
  }

  Get_WBS2Order(
    CustomerCode: any,
    ProjectCode: any,
    JobID: any,
    ProdType: any,
    WBS1: any
  ): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getWBS2/${CustomerCode}/${ProjectCode}/${JobID}/${ProdType}/${WBS1}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getWBS2/${CustomerCode}/${ProjectCode}/${JobID}/${ProdType}/${WBS1}`);
  }
  Get_WBS3Order(
    CustomerCode: any,
    ProjectCode: any,
    JobID: any,
    ProdType: any,
    WBS1: any,
    WBS2: any
  ): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getWBS3/${CustomerCode}/${ProjectCode}/${JobID}/${ProdType}/${WBS1}/${WBS2}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getWBS3/${CustomerCode}/${ProjectCode}/${JobID}/${ProdType}/${WBS1}/${WBS2}`);
  }

  GetWBS1ForProject(
    ProjectCode: string,
    WBS1: string,
    WBS2: string
  ): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl + `getWBS1Clone/${ProjectCode}/${WBS1}/${WBS2}`
    );
    // return this.httpClient.get<any[]>(`https://localhost:5009/getWBS1Clone/${ProjectCode}/${WBS1}/${WBS2}`);
  }

  GetWBS2ForProject(
    ProjectCode: string,
    WBS1: string,
    WBS2: string
  ): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl + `getWBS2Clone/${ProjectCode}/${WBS1}/${WBS2}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getWBS2Clone/${ProjectCode}/${WBS1}/${WBS2}`);
  }

  GetWBS3ForProject(
    obj: any,
    ProjectCode: any,
    WBS1O: any,
    WBS2O: any,
    WBS3O: any,
    WBS1: any,
    WBS2FR: any,
    WBS2TO: any,
    ScheduledProd: any
  ): Observable<any> {
    return this.httpClient.post<any[]>(
      this.apiUrl + `getWBS3Clone`,
      obj
    );
    // return this.httpClient.post<any[]>(`https://localhost:5009/getWBS3Clone`,obj);
  }
  SUbmitCloneForProject(
    wbs3: any,
    CustomerCode: any,
    sProjectCode: any,
    dProjectCode: any,
    OrderNo: any,
    WBS1: any,
    WBS2From: any,
    WBS2To: any,
    CloneNo: any,
    StructureElement: any
  ): Observable<any> {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.post<any>(
      this.apiUrl +
      `setCloneOrderWBSClone/${CustomerCode}/${sProjectCode}/${dProjectCode}/${OrderNo}/${WBS1}/${WBS2From}/${WBS2To}/${CloneNo}/${StructureElement}/${UserName}`,
      wbs3
    );
    // return this.httpClient.post<any>(`https://localhost:5009/setCloneOrderWBSClone/${CustomerCode}/${sProjectCode}/${dProjectCode}/${OrderNo}/${WBS1}/${WBS2From}/${WBS2To}/${CloneNo}/${StructureElement}/${UserName}`, wbs3);
  }
  CheckTransportModeCAB(OrderNumber: number | string) {
    // return this.httpClient.get<any>(`https://localhost:5009/CheckTransportModeCAB/${OrderNumber}`);
    return this.httpClient.get<any>(this.apiUrl + `CheckTransportModeCAB/${OrderNumber}`);
  }
  SaveJobAdvice_CAB(obj: SaveJobAdvice_CAB) {
    //return this.httpClient.post<any>(`https://localhost:5009/SaveJobAdvice`, obj);
    return this.httpClient.post<any>(
      this.apiUrl + `SaveJobAdvice`,
      obj
    );
  }

  ExcelExportOrder(CustomerCode1: string, ProjectCode1: string, JobID: number) {
    // return this.httpClient.get(
    //   `https://localhost:5009/exportOrderDetailsToExcel/${CustomerCode1}/${ProjectCode1}/${JobID}`,
    //   {
    //     responseType: 'blob', // Important to specify blob as the response type
    //   }
    // );
    return this.httpClient.get(
      this.apiUrl +
      `exportOrderDetailsToExcel/${CustomerCode1}/${ProjectCode1}/${JobID}`,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  ExcelExportOrderDiaSummary(
    CustomerCode1: string,
    ProjectCode1: string,
    OrderNumber: number,
    JobID: number
  ) {
    // return this.httpClient.get(
    //   `https://localhost:5009/exportDiaSummaryToExcel/${CustomerCode1}/${ProjectCode1}/${OrderNumber}/${JobID}`,
    //   {
    //     responseType: 'blob', // Important to specify blob as the response type
    //   }
    // );
    return this.httpClient.get(
      this.apiUrl +
      `exportDiaSummaryToExcel/${CustomerCode1}/${ProjectCode1}/${OrderNumber}/${JobID}`,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  usedBBSNoList(CustomerCode: any, ProjectCode: any, JobID: any) {
    //return this.httpClient.get<any>(`https://localhost:5009/usedBBSNoList/${CustomerCode}/${ProjectCode}/${JobID}`);
    return this.httpClient.get<any>(
      this.apiUrl +
      `usedBBSNoList/${CustomerCode}/${ProjectCode}/${JobID}`
    );
  }

  printShapes(CustomerCode: any, ProjectCode: any) {
    // return this.httpClient.get(`https://localhost:5009/printShapes/${CustomerCode}/${ProjectCode}/${UserName}`,
    //   {
    //     responseType: 'blob', // Important to specify blob as the response type
    //   });
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get(
      this.apiUrl +
      `printShapes/${CustomerCode}/${ProjectCode}/${UserName}`,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  getMeshBBS(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    OrderSource: any,
    StructureElement: any,
    ProductType: any,
    ScheduledProd: any
  ) {
    //return this.httpClient.get<any>(`https://localhost:5009/getMeshBBS/${CustomerCode}/${ProjectCode}/${JobID}/${OrderSource}/${StructureElement}/${ProductType}/${ScheduledProd}`);
    return this.httpClient.get<any>(
      this.apiUrl +
      `getMeshBBS/${CustomerCode}/${ProjectCode}/${JobID}/${OrderSource}/${StructureElement}/${ProductType}/${ScheduledProd}`
    );
  }

  getBBSBar(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    OrderSource: any,
    StructureElement: any,
    ProductType: any,
    ScheduledProd: any
  ) {
    //return this.httpClient.get<any>(`https://localhost:5009/getBBSBar/${CustomerCode}/${ProjectCode}/${JobID}/${OrderSource}/${StructureElement}/${ProductType}/${ScheduledProd}`);
    return this.httpClient.get<any>(
      this.apiUrl +
      `getBBSBar/${CustomerCode}/${ProjectCode}/${JobID}/${OrderSource}/${StructureElement}/${ProductType}/${ScheduledProd}`
    );
  }
  getBPCData_CAB(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    OrderSource: any,
    StructureElement: any,
    ProductType: any,
    ScheduledProd: any
  ) {
    let UserName = this.loginService.GetGroupName();
    let obj={
      CustomerCode:CustomerCode,
      ProjectCode: ProjectCode,
      JobID: JobID,
      OrderSource: OrderSource,
      StructureElement:StructureElement ,
      ProductType:ProductType,
      ScheduledProd: ScheduledProd,
      UserName:UserName
    }
    //return this.httpClient.post<any>(`https://localhost:5009/getBPCData`,obj);
    return this.httpClient.post<any>(
      this.apiUrl +
      `getBPCData`,obj
    );
  }

  showdirPrintDiscrepancy(
    CustomerCode1: string,
    ProjectCode1: string,
    JobID: number,
    BBSID: number
  ) {
    //   return this.httpClient.get(
    //     `https://localhost:5009/printDiscrepancy/${CustomerCode1}/${ProjectCode1}/${JobID}/${BBSID}`,
    //     {
    //       responseType: 'blob', // Important to specify blob as the response type
    //     }
    //   );
    return this.httpClient.get(
      this.apiUrl +
      `printDiscrepancy/${CustomerCode1}/${ProjectCode1}/${JobID}/${BBSID}`,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  getForecastRec(obj: ForecastdataModel) {
    //return this.httpClient.post<any>(`https://localhost:5009/getForecastRec`,obj);
    return this.httpClient.post<any>(
      this.apiUrl + `getForecastRec`,
      obj
    );
  }

  //upload
  chk_FileExist(obj: CheckFile_Exist) {
    //return this.httpClient.post<any>(`https://localhost:5009/chkFileExist`,obj);
    return this.httpClient.post<any>(
      this.apiUrl + `chkFileExist`,
      obj
    );
  }

  //Document Attached popup
  Show_DirDownload(
    ddCustomerCode: string,
    ddProjectCode: string,
    ddFileName: string,
    ddRevision: number
  ) {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get(
      `https://odossap.natsteel.com.sg/SAP_API/api/SharePointAPI/ShowDirDownload/${ddCustomerCode}/${ddProjectCode}/${ddFileName}/${ddRevision}`
      //  {
      //       responseType: 'blob', // Important to specify blob as the response type
      //     }
    );

    // return this.httpClient.get(
    //   `http://localhost:55592/api/SharePointAPI/ShowDirDownload/${ddCustomerCode}/${ddProjectCode}/${ddFileName}/${ddRevision}/${UserName}`,
    //    {
    //         responseType: 'blob', // Important to specify blob as the response type
    //     }
    // );
    // return this.httpClient.get(
    //   this.apiUrl +
    //   `downloadOrderDoc/${OrderNumber}/${StructureElement}/${ProductType}/${ScheduledProd}/${DocID}`,
    //   {
    //     responseType: 'blob', // Important to specify blob as the response type
    //   }
    // );
  }

  Modify(obj: any) {
    //return this.httpClient.post<any>(`https://localhost:5009/modifyDrawing`, obj);
    return this.httpClient.post<any>(
      this.apiUrl + `modifyDrawing`,
      obj
    );
  }

  Remove(
    OrderNuber: number,
    StructureElement: String,
    ProductType: string,
    ScheduledProd: string,
    CustomerCode: string,
    ProjectCode: string,
    DrawingID: number,
    Revision: number
  ) {
    //return this.httpClient.get<any>(`https://localhost:5009/deleteDrawingOrder/${OrderNuber}/${StructureElement}/${ProductType}/${ScheduledProd}/${CustomerCode}/${ProjectCode}/${DrawingID}/${Revision}`);
    return this.httpClient.get<any>(
      this.apiUrl +
      `deleteDrawingOrder/${OrderNuber}/${StructureElement}/${ProductType}/${ScheduledProd}/${CustomerCode}/${ProjectCode}/${DrawingID}/${Revision}`
    );
  }

  Remove_Drawing(CustomerCode: string, ProjectCode: string, DrawingID: number) {
    let UserName = this.loginService.GetGroupName();
    // return this.httpClient.get<any>(`https://localhost:5009/deleteDrawing/${CustomerCode}/${ProjectCode}/${DrawingID}`);
    return this.httpClient.get<any>(
      this.apiUrl +
      `deleteDrawing/${CustomerCode}/${ProjectCode}/${DrawingID}`
    );
  }

  OESImport(obj: any) {
    //return this.httpClient.post<any>(`https://localhost:5009/OrderExcelImport`, obj);
    return this.httpClient.post<any>(
      this.apiUrl + `OrderExcelImport`,
      obj
    );
  }

  check_OrderDocs(
    OrderNumber: number,
    StructureElement: string,
    ProductType: string,
    ScheduledProd: string
  ) {
    //return this.httpClient.get<any>(`https://localhost:5009/checkOrderDocs/${OrderNumber}/${StructureElement}/${ProductType}/${ScheduledProd}`);
    return this.httpClient.get<any>(
      this.apiUrl +
      `checkOrderDocs/${OrderNumber}/${StructureElement}/${ProductType}/${ScheduledProd}`
    );
  }

  uploadFile(
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
    UserName = this.loginService.GetGroupName(),
    UserType = this.loginService.GetUserType()
  ): Observable<any> {
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
    formData.append('UserType', UserType);

    // return this.httpClient.post<any>(
    //   'http://localhost:55592/api/SharePointAPI/uploadDrawingFiles',
    //   formData
    // );
    //http://172.25.1.224:8989/api/SAPAPI/
    //https://odossap.natsteel.com.sg:8999/
    return this.httpClient.post<any>(
      'https://odossap.natsteel.com.sg/SAP_API/api/SharePointAPI/uploadDrawingFiles',
      formData
    );
  }

  setDoubleCapture(
    CustomerCode: string,
    ProjectCode: string,
    JobID: number,
    BBSID: number
  ) {
    //return this.httpClient.get<any>(`https://localhost:5009/setDoubleCapture/${CustomerCode}/${ProjectCode}/${JobID}/${BBSID}`);
    return this.httpClient.get<any>(
      this.apiUrl +
      `setDoubleCapture/${CustomerCode}/${ProjectCode}/${JobID}/${BBSID}`
    );
  }

  deleteDrawing(CustomerCode: string, ProjectCode: string, DrawingID: number) {
    //let UserName=this.loginService.GetGroupName();
    // return this.httpClient.get<any>(`http://localhost:55592/api/SharePointAPI/deleteDrawing/${CustomerCode}/${ProjectCode}/${DrawingID}`);
    return this.httpClient.get<any>(
      `https://odossap.natsteel.com.sg/SAP_API/api/SharePointAPI/deleteDrawing/${CustomerCode}/${ProjectCode}/${DrawingID}`
    );
  }

  ValidatePO_CAB(CustomerCode: string, ProjectCode: string, POnumber: number) {
    //return this.httpClient.get<any>(`https://localhost:5009/ValidatePONumber_OS/${CustomerCode}/${ProjectCode}/${POnumber}`);
    return this.httpClient.get<any>(
      this.apiUrl +
      `ValidatePONumber_OS/${CustomerCode}/${ProjectCode}/${POnumber}`
    );
  }
  deleteBarDetails(
    CustomerCode: string,
    ProjectCode: string,
    JobID: number,
    BBSID: number,
    BarID: number,
    UserName: string
  ) {
    //return this.httpClient.get<any>(`https://localhost:5009/deleteBarDetails/${CustomerCode}/${ProjectCode}/${JobID}/${BBSID}/${BarID}/${UserName}`);
    return this.httpClient.get<any>(
      this.apiUrl +
      `deleteBarDetails/${CustomerCode}/${ProjectCode}/${JobID}/${BBSID}/${BarID}/${UserName}`
    );
  }
  setCAB2SB(
    CustomerCode: string,
    ProjectCode: string,
    JobID: number,
    UserName: string
  ) {
    // return this.httpClient.get<any>(`https://localhost:5009/setCAB2SB/${CustomerCode}/${ProjectCode}/${JobID}/${UserName}`);
    return this.httpClient.get<any>(
      this.apiUrl +
      `setCAB2SB/${CustomerCode}/${ProjectCode}/${JobID}/${UserName}`
    );
  }

  ExcelExportActive(obj: any) {
 
  let AllProjects = this.commonService.includeOptionalProjects ? 'Y' : 'N';
  let addrescodes:any=this.dropdown.getAddressList();
  let projectCodes = '';
if(addrescodes){
      addrescodes=addrescodes.join(',')
}
else{
  addrescodes='';
}
  if (obj.ProjectCode) {
    if (AllProjects === 'Y') {
      // If including all projects, you might want to send all available project codes
      // or handle this differently on the backend
      projectCodes = obj.ProjectCode[0];
    } else {
      projectCodes = obj.ProjectCode.join(',');
    }
  }

  const formData: FormData = new FormData();
  formData.append('CustomerCode', obj.CustomerCode);
  formData.append('ProjectCodes', projectCodes);
  formData.append('UserName', this.loginService.GetGroupName());
      formData.append('AddressCodes', addrescodes);
  formData.append('AllProjects', AllProjects === 'Y' ? 'true' : 'false'); // Backend expects boolean string

    // return this.httpClient.post(
    //   'https://localhost:5009/exportActiveOrdersToExcel', formData,
    //   {
    //     responseType: 'blob', // Important to specify blob as the response type
    //   }
    // );
    return this.httpClient.post(
      this.apiUrl + `exportActiveOrdersToExcel`,
      formData,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  WithdrawOrderPE(obj: any) {
    //return this.httpClient.post<any>(`https://localhost:5009/WithdrawOrderPE`, obj);
    return this.httpClient.post<any>(
      this.apiUrl + `WithdrawOrderPE`,
      obj
    );
  }

  Order_Index(userName: string) {
    // return this.httpClient.get<any>(`https://localhost:5009/OrderIndex/${userName}`);
    return this.httpClient.get<any>(
      this.apiUrl + `OrderIndex/${userName}`
    );
  }

  SaveBBS_Process(obj: SaveBBSOrderDetails) {
    //return this.httpClient.post<any>(`https://localhost:5009/SaveBBS_Process`, obj);
    return this.httpClient.post<any>(
      this.apiUrl + `SaveBBS_Process`,
      obj
    );
  }

  DownloadDeliveredDocs(obj:getDocumentIndexDto) {
    // return this.httpClient.get<any>(
    //   `https://localhost:5009/getDocumentIndex/${CustomerCode}/${ProjectCode}/${DONumbers}`
    // );
    // return this.httpClient.get<any>(
    //   this.apiUrl +
    //   `getDocumentIndex/${CustomerCode}/${ProjectCode}/${DONumbers}`
    // );
  //return this.httpClient.post<any>(`https://localhost:5009/getDocumentIndex`, obj);
    return this.httpClient.post<any>(
      this.apiUrl + `getDocumentIndex`,
      obj
    );
  }
  DODetailsDownload(CustomerCode: any, ProjectCode: any, DONumbers: any) {
    // return this.httpClient.get<any>(
    //   `https://localhost:5009/getDocumentIndex/${CustomerCode}/${ProjectCode}/${DONumbers}`
    // );
    return this.httpClient.get<any>(
      this.apiUrl +
      `getDocumentIndex/${CustomerCode}/${ProjectCode}/${DONumbers}`
    );
  }

  Download_MillCert(
    CustomerCode: any,
    ProjectCode: any,
    DONumbers: any,
    DoDate: any
  ) {
    // return this.httpClient.get<any>(
    //   `https://localhost:5009/getDocumentIndex/${CustomerCode}/${ProjectCode}/${DONumbers}/${DoDate}`
    // );
    return this.httpClient.get<any>(
      this.apiUrl +
      `getDocumentIndex/${CustomerCode}/${ProjectCode}/${DONumbers}/${DoDate}`
    );
  }

  GetDocumentIndex(
    CustomerCode: any,
    ProjectCode: any,
    DONumber: any,
    DocType: any,
    DODate: any
  ) {
    // return this.httpClient.get<any>(
    //   `https://localhost:5009/getDocumentIndex/${CustomerCode}/${ProjectCode}/${DONumber}/${DocType}/${DODate}`
    // );
    return this.httpClient.get<any>(
      this.apiUrl +
      `getDocumentIndex/${CustomerCode}/${ProjectCode}/${DONumber}/${DocType}/${DODate}`
    );
  }

  DownloadDocFile(DocumentIndex: string, FileName: string, FileType: string) {
    let UserName = this.loginService.GetGroupName();
    // return this.httpClient.get(
    //   `https://localhost:5009/downloadDocument/${DocumentIndex}/${FileName}/${FileType}`,
    //   {
    //     responseType: 'blob', // Important to specify blob as the response type
    //   }
    // );
    return this.httpClient.get(
      this.apiUrl +
      `downloadDocument/${DocumentIndex}/${FileName}/${FileType}`,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  getBeamDetailsNSH_beam_prc(
    CustomerCode: any,
    ProjectCode: any,
    PostID: any,
    BBSID: any
  ) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getBeamDetailsNSH_prc/${CustomerCode}/${ProjectCode}/${PostID}/${BBSID}`
    );

    // return this.httpClient.get<any[]>(`https://localhost:5009/getBeamDetailsNSH_prc/${CustomerCode}/${ProjectCode}/${PostID}/${BBSID}`);
  }

  ExcelExportIncoming(obj: any) {
    // return this.httpClient.post(
    //   `https://localhost:5009/ExportIncoming`,obj,
    //   {
    //     responseType: 'blob', // Important to specify blob as the response type
    //   }
    // );
    return this.httpClient.post(
      this.apiUrl + `ExportIncoming`,
      obj,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  ExcelExportPO(obj: any) {
    // return this.httpClient.post(
    //   `https://localhost:5009/ExportPOSearch`,obj,
    //   {
    //     responseType: 'blob', // Important to specify blob as the response type
    //   }
    // );
    return this.httpClient.post(
      this.apiUrl + `ExportPOSearch`,
      obj,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  Get_ProcessRec(
    CustomerCode: string,
    ProjectCode: string,
    JobID: number,
    StructureElement: string,
    ProdType: string,
    ScheduledProd: string,
    OrderSource: string,
    SAPSOR: string
  ) {
    //return this.httpClient.get<any>(`https://localhost:5009/getProcessRec/${CustomerCode}/${ProjectCode}/${JobID}/${StructureElement}/${ProdType}/${ScheduledProd}/${OrderSource}/${SAPSOR}`);
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get<any>(
      this.apiUrl +
      `getProcessRec/${CustomerCode}/${ProjectCode}/${JobID}/${StructureElement}/${ProdType}/${ScheduledProd}/${OrderSource}/${SAPSOR}`
    );
  }

  GetPinMaster(pinStandard: any) {
    //return this.httpClient.get<any>(`https://localhost:5009/getPinMaster/${pinStandard}`);
    return this.httpClient.get<any>(
      this.apiUrl + `getPinMaster/${pinStandard}`
    );
  }

  getColumnDetailsNSH_prc(
    CustomerCode: any,
    ProjectCode: any,
    PostID: any,
    BBSID: any
  ) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getColumnDetailsNSH_prc/${CustomerCode}/${ProjectCode}/${PostID}/${BBSID}`
    );

    // return this.httpClient.get<any[]>(
    //   `https://localhost:5009/getColumnDetailsNSH_prc/${CustomerCode}/${ProjectCode}/${PostID}/${BBSID}`
    // );
  }

  getOthersDetailsNSH_PRC(
    CustomerCode: any,
    ProjectCode: any,
    PostID: any,
    BBSID: any
  ) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getOthersDetailsNSH_prc/${CustomerCode}/${ProjectCode}/${PostID}`
    );

    // return this.httpClient.get<any[]>(
    //   `https://localhost:5009/getOthersDetailsNSH_prc/${CustomerCode}/${ProjectCode}/${PostID}/${BBSID}`
    // );
  }

  getMeshOtherDetails_prc(
    CustomerCode: any,
    ProjectCode: any,
    PostID: any,
    BBSID: any
  ) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getMeshOtherDetails_prc/${CustomerCode}/${ProjectCode}/${PostID}/${BBSID}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/getMeshBeamDetails_beam/${CustomerCode}/${ProjectCode}/${PostID}/${BBSID}`);
  }

  CABItemCancelProcess(obj: any) {
    //return this.httpClient.post<any>(`https://localhost:5009/CABItemCancelProcess`, obj);
    return this.httpClient.post<any>(
      this.apiUrl + `CABItemCancelProcess`,
      obj
    );
  }

  sendSelfCollectionEmail(
    ProdType: any,
    CustomerCode: any,
    ProjectCode: any,
    JobID: any
  ) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `sendSelfCollectionEmail/${ProdType}/${CustomerCode}/${ProjectCode}/${JobID}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5009/sendSelfCollectionEmail/${ProdType}/${CustomerCode}/${ProjectCode}/${JobID}`
  }

  // sendCreditBlockEmail(obj: any) {
  //   return this.httpClient.post<any[]>(
  //     this.apiUrl + `sendCreditBlockEmail`,
  //     obj
  //   );
  //   //return this.httpClient.post<any[]>(`https://localhost:5009/sendCreditBlockEmail`, obj);
  // }

  // CheckCreditBlock(obj: any) {
  //   return this.httpClient.post<any[]>(
  //     this.apiUrl + `CheckCreditBlock`,
  //     obj
  //   );
  //   //return this.httpClient.post<any[]>(`https://localhost:5009/CheckCreditBlock`, obj);
  // }
  GetOrderSet(OrderNumber: any, RouteFlag: boolean) {
    return this.httpClient.get<any>(
      this.apiUrl +
      `GetReferenceNoByOrderNo/${OrderNumber}/${RouteFlag}`
    );
    //return this.httpClient.get<any>(`https://localhost:5009/GetReferenceNoByOrderNo/${OrderNumber}/${RouteFlag}`);
  }

  CABItemCancel_Process(obj: any) {
    return this.httpClient.post<any[]>(
      this.apiUrl + `CABItemCancelProcess`,
      obj
    );
    // return this.httpClient.post<any[]>(`https://localhost:5009/CABItemCancelProcess`, obj);
  }

  SplitVariousBar(obj: any) {
    return this.httpClient.post<any[]>(
      this.apiUrl + `SplitVariousBar`,
      obj
    );
    // return this.httpClient.post<any[]>(`https://localhost:5009/SplitVariousBar`, obj);
  }

  BPCItemCancelProcess(obj: any) {
    //return this.httpClient.post<any>(`https://localhost:5009/BPCItemCancelProcess`, obj);
    return this.httpClient.post<any>(
      this.apiUrl + `BPCItemCancelProcess`,
      obj
    );
  }

  updateBPCData(obj: any) {
    obj.UserName = this.loginService.GetGroupName();
    //return this.httpClient.post<any>(`https://localhost:5009/updateBPCData`, obj);
    return this.httpClient.post<any>(
      this.apiUrl + `updateBPCData`,
      obj
    );
  }

  checktableforUserEntryBPC(CustomerCode: any, ProjectCode: any, JobID: any) {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get<any>(
      this.apiUrl +
      `checktableforUserEntry/${CustomerCode}/${ProjectCode}/${JobID}/${UserName}`
    );
    // return this.httpClient.get<any>(
    //   `https://localhost:5009/checktableforUserEntry/${CustomerCode}/${ProjectCode}/${JobID}/${UserName}`
    // );
  }

  GetWBSFor_CTSMesh(OrderNumber: any) {
    return this.httpClient.get<any>(
      this.apiUrl +
      `GetWBSForCTSMesh/${OrderNumber}`
    );
    // return this.httpClient.get<any>(
    //   `https://localhost:5009/GetWBSForCTSMesh/${OrderNumber}`
    // );
  }
  GetAccess_Right(pCustomerCode: any, pProjectCode: any) {
    let UserName = this.loginService.GetGroupName();
    return this.httpClient.get<any>(
      this.apiUrl +
      `getAccessRight/${pCustomerCode}/${pProjectCode}/${UserName}`
    );
    // return this.httpClient.get<any>(
    //   `https://localhost:5009/getAccessRight/${pCustomerCode}/${pProjectCode}/${UserName}`
    // );
  }

  getPOSelectList(CustomerCode: any, ProjectCode: any) {
    let UserName = this.loginService.GetGroupName();
    //return this.httpClient.get<any[]>(`https://localhost:5009/getCopyBBSOrderList/${CustomerCode}/${ProjectCode}`);
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getCopyBBSOrderList/${CustomerCode}/${ProjectCode}`
    );
  }

  getLoadDetailList(CustomerCode: any, ProjectCode: any, LoadNumbers: any) {
    let UserName = this.loginService.GetGroupName();
    //return this.httpClient.get<any[]>(`https://localhost:5009/getLoadDetails/${CustomerCode}/${ProjectCode}/${LoadNumbers}`);
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getLoadDetails/${CustomerCode}/${ProjectCode}/${LoadNumbers}`
    );
  }

  DownloadDeliveredDocuments(CustomerCode: any, ProjectCode: any, DONumber: any): Observable<any> {
    // return this.httpClient.get<any>(`https://devappui.natsteel.com.sg:8080/project-document/v1/share-point/do/${CustomerCode}/${ProjectCode}/${DONumber}`);
    return this.httpClient.get<any>(`https://prodash.natsteel.com.sg:8080/project-document/v1/share-point/do/${CustomerCode}/${ProjectCode}/${DONumber}`);
  }

  CheckDoubleEntry(CustomerCode: any, ProjectCode: any, JobID: any) {
    let UserName = this.loginService.GetGroupName();
    //return this.httpClient.get<any[]>(`https://localhost:5009/checkDoubleEntry/${CustomerCode}/${ProjectCode}/${JobID}/${UserName}`);
    return this.httpClient.get<any[]>(this.apiUrl + `checkDoubleEntry/${CustomerCode}/${ProjectCode}/${JobID}/${UserName}`);
  }

  upcomingOrderList(CustomerCode: any, ProjectCode: any,) {
    //return this.httpClient.get<any>(`https://localhost:5009/getUpcomingOrders/${CustomerCode}/${ProjectCode}`);
    return this.httpClient.get<any>(
      this.apiUrl + `getUpcomingOrders/${CustomerCode}/${ProjectCode}`
    );
  }



  DeleteUpcoming(nWBS1:any, nWBS2:any,nWBS3:any,nStructureElement:any,nProductType:any,CustomerCode:any,ProjectCode:any) {
    //return this.httpClient.get<any>(`https://localhost:5009/DeleteUpcoming/${nWBS1}/${nWBS2}/${nWBS3}/${nStructureElement}/${nProductType}/${CustomerCode}/${ProjectCode}`);
    return this.httpClient.get<any>(this.apiUrl + `DeleteUpcoming/${nWBS1}/${nWBS2}/${nWBS3}/${nStructureElement}/${nProductType}/${CustomerCode}/${ProjectCode}`);
  }

  GetSubmitByEmail(OrderNo: any) {
    // return this.httpClient.get<any>(`https://localhost:5009/GetSubmitByEmail/${OrderNo}`);
      return this.httpClient.get<any>(this.apiUrl + `GetSubmitByEmail/${OrderNo}`);
  }

  UpdateConvertedOrder(pOrderNo: any, nWBS1:any ,nWBS2:any,nWBS3:any,nStructureElement:any,nProductType:any,CustomerCode:any,ProjectCode:any) {
    let UserName = this.loginService.GetGroupName();
    //return this.httpClient.get<any>(`https://localhost:5009/UpdateConvertedOrder/${pOrderNo}/${nWBS1}/${nWBS2}/${nWBS3}/${nStructureElement}/${nProductType}/${CustomerCode}/${ProjectCode}/${UserName}`);
    return this.httpClient.get<any>(this.apiUrl + `UpdateConvertedOrder/${pOrderNo}/${nWBS1}/${nWBS2}/${nWBS3}/${nStructureElement}/${nProductType}/${CustomerCode}/${ProjectCode}/${UserName}`);
  }

  //Drawing Repository Api's
  // drawUrl = "https://localhost:5009/";
  drawUrl = this.apiUrl + '';
  getDrawingList(obj:getDrawingListModel){
    return this.httpClient.post<any[]>(this.drawUrl + `getDrawingList`,obj);
  }

  searchDrawingList(obj:searchDrawingListModel){
    return this.httpClient.post<any>(
      this.drawUrl + `searchDrawingList`,obj
    );
  }
  getWBSList(obj:getWBSListModel){
  let UserName = this.loginService.GetGroupName();
    return this.httpClient.get<any>(
      this.drawUrl + `getWBSList/${obj.CustomerCode}/${obj.ProjectCode}/${obj.DrawingID}/${obj.Revision}/${UserName}`
    );
  }
  deleteDrawingRepoRecord(obj:deleteDrawingModel){
    return this.httpClient.get<any>(
      this.drawUrl + `deleteDrawing/${obj.CustomerCode}/${obj.ProjectCode}/${obj.DrawingID}`
    );
  }
  chkFileExist(obj:checkIfFileExistsModel){
    return this.httpClient.post<any[]>(this.drawUrl + `chkFileExist`,obj);
  }
  // { "DrawingID ": 0, "Revision ": 0,}
  checkOrder(obj:checkOrderModel){
    return this.httpClient.post<any[]>(this.drawUrl + `checkOrder`,obj);
  }
  getOrderList(obj:getOrderListModel){
    return this.httpClient.post<any[]>(this.drawUrl + `getOrderList_Drawing`,obj);
  }
  getAssignStrEle(obj:getAssignStrEleModel){
    return this.httpClient.post<any[]>(this.drawUrl + `getAssignStrEle/${obj.ProjectCode}`,obj);
  }
  printDrawings(obj:printDrawingsModel){
    return this.httpClient.get<any[]>(this.drawUrl + `PrintDrawings/${obj.CustomerCode}/${obj.ProjectCode}/${obj.FileName}/${obj.Revision}`);
  }
  deleteDrawingOrder(obj:deleteDrawingOrderModel){
    return this.httpClient.get<any[]>(this.apiUrl + `deleteDrawingOrder/${obj.OrderNuber}/${obj.StructureElement}/${obj.ProductType}/${obj.ScheduledProd}/${obj.CustomerCode}/${obj.ProjectCode}/${obj.DrawingID}/${obj.Revision}`)
  }
  // { "DrawingID": 0, "DrawingNo": "string", "Remarks": "string" }
  modifyDrawing(obj:modifyDrawingModel){
    return this.httpClient.post<any[]>(this.apiUrl + `modifyDrawing`,obj);
  }
  getAssignWBS1(obj:any){
    return this.httpClient.post<any[]>(this.drawUrl + `getAssignWBS1`,obj);
  }
  getAssignWBS2(obj:any){
    return this.httpClient.post<any[]>(this.drawUrl + `getAssignWBS2`,obj);
  }
  getAssignWBS3(obj:any){
    return this.httpClient.post<any[]>(this.drawUrl + `getAssignWBS3`,obj);
  }
  assignDrawing(obj:any){
    return this.httpClient.post<any[]>(this.drawUrl + `AssigDrawing`,obj);
  }
  // Test1.txt
  unAssignDrawing(obj:any){
    return this.httpClient.post<any[]>(this.drawUrl + `UnassigDrawing`,obj);
  }

  uploadDrawingRepoFile(formData:FormData){
    return this.httpClient.post<any>(
      'https://odossap.natsteel.com.sg/SAP_API/api/SharePointAPI/uploadDrawingFiles',
      formData
    );
  }

  sendEmailNotification(obj: UpcomingMailModel) {
    obj.EmailBy=this.loginService.GetGroupName();
    //return this.httpClient.post<any[]>(`https://localhost:5009/UpcomingMail`, obj);
    return this.httpClient.post<any[]>(this.apiUrl + `UpcomingMail`, obj);
  }

  //Batch Amendment
  WatchlistSearch(SONumber: any, SORNumber: any) {
    // return this.httpClient.get<any>(`https://localhost:5009/Watchlist_Search/${SONumber}/${SORNumber}`);
    return this.httpClient.get<any>(this.apiUrl + `Watchlist_Search/${SONumber}/${SORNumber}`);
  }
  WatchlistQueryResult(SORNumbers_to_amend: any) {
    // return this.httpClient.get<any>(`https://localhost:5009/Watchlist_Query_Result/${SORNumbers_to_amend}`);
    return this.httpClient.get<any>(this.apiUrl + `Watchlist_Query_Result/${SORNumbers_to_amend}`);
  }
  DeleteFromWatchlist(SORNumbers_to_amend: any) {
    // return this.httpClient.get<any>(`https://localhost:5009/Delete_From_Watchlist/${SORNumbers_to_amend}`);
    return this.httpClient.get<any>(this.apiUrl + `Delete_From_Watchlist/${SORNumbers_to_amend}`);
  }

  SaveToWatchlist(SORNumbers_to_amend: any) {
    // return this.httpClient.get<any>(`https://localhost:5009/Save_To_Watchlist/${SORNumbers_to_amend}`);
    return this.httpClient.get<any>(this.apiUrl + `Save_To_Watchlist/${SORNumbers_to_amend}`);
  }

  reloadWatchlist() {
    // return this.httpClient.get<any>(`https://localhost:5009/reload_Watchlist`);
    return this.httpClient.get<any>(this.apiUrl + `reload_Watchlist`);
  }

  //Drawing Repository
  viewDrawing(customerCode:any,projectCode:any,fileName:any,revision:any) {
    let UserName = this.loginService.GetGroupName().split('@')[0];
    let drawingObj = {
                        ddCustomerCode:customerCode,
                        ddProjectCode:projectCode,
                        ddFileName:fileName,
                        ddRevision:revision,
                        UserType:UserName
                      }
    return this.httpClient.post(`https://odossap.natsteel.com.sg/SAP_API/api/SharePointAPI/ShowDirView`,drawingObj,{
      responseType: 'blob', // Important to specify blob as the response type
    });
    // return this.httpClient.get<any>(this.apiUrl + `reload_Watchlist`);
  }

  uploadDrawingFile(
    files: File[], // Accept an array of files
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
    UserName = this.loginService.GetGroupName(),
    UserType = this.loginService.GetUserType()
  ): Observable<any[]> {
    const requests: Observable<any>[] = [];

    files.forEach((file) => {
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
      formData.append('UserType', UserType);

      const request = this.httpClient.post<any>(
        'https://odossap.natsteel.com.sg/SAP_API/api/SharePointAPI/uploadDrawingFiles',
        formData
      );
      requests.push(request);
    });

    return forkJoin(requests); // Return an observable that emits an array of results when all uploads are complete
  }

  drawingDownloadUrl(
    ddCustomerCode: string,
    ddProjectCode: string,
    ddFileName: string,
    ddRevision: number
  ) {
    let UserType = this.loginService.GetUserType();
    return `https://odossap.natsteel.com.sg/api/SAP_API/SharePointAPI/ShowDirDownload/${ddCustomerCode}/${ddProjectCode}/${ddFileName}/${ddRevision}/${UserType}`;
  }


  DeleteSubmittedUpcomingOrders(COrderNumber: any) {
    //return this.httpClient.get<any>(`https://localhost:5009/DeleteSubmittedOrder/${COrderNumber}`);
     return this.httpClient.get<any>(this.apiUrl + `DeleteSubmittedOrder/${COrderNumber}`);
  }


  Get_UserNameUpcoming(pCustomerCode: any,pProjectCode:any) {
   // return this.httpClient.get<any>(`https://localhost:5009/GetUserNameUpcoming/${pCustomerCode}/${pProjectCode}`);
      return this.httpClient.get<any>(this.apiUrl + `GetUserNameUpcoming/${pCustomerCode}/${pProjectCode}`);
  }

  LastUpcomingMail(CustomerCode: any, ProjectCode: any,wbs1: any) {
    //return this.httpClient.get<any>(`https://localhost:5009/LastUpcomingMail/${CustomerCode}/${ProjectCode}/${wbs1}`);
    return this.httpClient.get<any>(
      this.apiUrl + `LastUpcomingMail/${CustomerCode}/${ProjectCode}/${wbs1}`
    );
  }

  Upcoming_NotificationMail(obj: any) {
    //return this.httpClient.post<any>(`https://localhost:5009/UpcomingNotificationMail`,obj);
     return this.httpClient.post<any>(this.apiUrl + `UpcomingNotificationMail`, obj);
  }

  ExcelExportUpcoming(obj: any) {
    // return this.httpClient.post(
    //   `https://localhost:5009/ExportUpcoming`,obj,
    //   {
    //     responseType: 'blob', // Important to specify blob as the response type
    //   }
    // );
    return this.httpClient.post(
      this.apiUrl + `ExportUpcoming`,
      obj,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  ExportDeletedOrdersToExcel(CustomerCode: any, ProjectCodes: any) {
    let AllProjects = this.commonService.includeOptionalProjects? 'Y': 'N';

    if(ProjectCodes){
      if(AllProjects=="Y"){
        ProjectCodes = ProjectCodes.split(',')[0];
        // ProjectCodes = ProjectCodes.splice[1];
      }
    }
    const formData: FormData = new FormData();
    formData.append('CustomerCode', CustomerCode);
    formData.append('ProjectCodes', ProjectCodes);
    formData.append('UserName', this.loginService.GetGroupName());
    formData.append('AllProjectsFlag', AllProjects);
    // return this.httpClient.post(
    //   `https://localhost:5009/exportDeletedOrdersToExcel`,formData,
    //   {
    //     responseType: 'blob', // Important to specify blob as the response type
    //   }
    // );
    return this.httpClient.post(
      this.apiUrl + `exportDeletedOrdersToExcel`,
      formData,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  ExportDeliveredOrdersToExcel(CustomerCode: any, ProjectCodes: any, RDate: any) {
    let AllProjects = this.commonService.includeOptionalProjects? 'Y': 'N';
let addrescodes:any=this.dropdown.getAddressList();

if(addrescodes){
      addrescodes=addrescodes.join(',')
}
else{
  addrescodes='';
}

    if(ProjectCodes){
      if(AllProjects=="Y"){
        ProjectCodes = ProjectCodes.split(',')[0];
        // ProjectCodes = ProjectCodes.splice[1];
      }
    }
    const formData: FormData = new FormData();
    formData.append('CustomerCode', CustomerCode);
    formData.append('ProjectCodes', ProjectCodes);
    formData.append('RDate', RDate);

    formData.append('UserName', this.loginService.GetGroupName());
    formData.append('AddressCodes', addrescodes);
    formData.append('AllProjectsFlag', AllProjects);
    //  return this.httpClient.post(
    //   `https://localhost:5009/exportDeliveredOrdersToExcel`,formData,
    //   {
    //     responseType: 'blob', // Important to specify blob as the response type
    //   }
    // );
    return this.httpClient.post(
      this.apiUrl + `exportDeliveredOrdersToExcel`,
      formData,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  ExportCancelledOrdersToExcel(CustomerCode: any, ProjectCodes: any) {
    let AllProjects = this.commonService.includeOptionalProjects? 'Y': 'N';

    if(ProjectCodes){
      if(AllProjects=="Y"){
        ProjectCodes = ProjectCodes.split(',')[0];
        // ProjectCodes = ProjectCodes.splice[1];
      }
    }
    const formData: FormData = new FormData();
    formData.append('CustomerCode', CustomerCode);
    formData.append('ProjectCodes', ProjectCodes);
    formData.append('UserName', this.loginService.GetGroupName());
    formData.append('AllProjectsFlag', AllProjects);
    // return this.httpClient.post(
    //   `https://localhost:5009/exportCancelledOrdersToExcel`,formData,
    //   {
    //     responseType: 'blob', // Important to specify blob as the response type
    //   }
    // );
    return this.httpClient.post(
      this.apiUrl + `exportCancelledOrdersToExcel`,
      formData,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  ExportDraftOrdersToExcel(CustomerCode: any, ProjectCodes: any) {
    let AllProjects = this.commonService.includeOptionalProjects? 'Y': 'N';
let addrescodes:any=this.dropdown.getAddressList();
if(addrescodes){
      addrescodes=addrescodes.join(',')
}
else{
  addrescodes='';
}
    if(ProjectCodes){
      if(AllProjects=="Y"){
        ProjectCodes = ProjectCodes.split(',')[0];
        // ProjectCodes = ProjectCodes.splice[1];
      }
    }
    const formData: FormData = new FormData();
    formData.append('CustomerCode', CustomerCode);
    formData.append('ProjectCodes', ProjectCodes);
    formData.append('UserName', this.loginService.GetGroupName());
    formData.append('AddressCodes', addrescodes);
    formData.append('AllProjectsFlag', AllProjects);
    // return this.httpClient.post(
    //   `https://localhost:5009/exportDraftOrdersToExcel`,formData,
    //   {
    //     responseType: 'blob', // Important to specify blob as the response type
    //   }
    // );
    return this.httpClient.post(
      this.apiUrl + `exportDraftOrdersToExcel`,
      formData,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  DeleteAfterSubmission(
    obj: any,
  ): Observable<any> {
    return this.httpClient.post<any[]>(
      this.apiUrl + `DeleteAfterSubmission`,
      obj
    );
    // return this.httpClient.post<any[]>(`https://localhost:5009/DeleteAfterSubmission`,obj);
  }

  GetDataBy_EmailID(userName: any) {
    //return this.httpClient.get<any>(`https://localhost:5009/GetDataByEmailId/${userName}`);
    return this.httpClient.get<any>(
      this.apiUrl + `GetDataByEmailId/${userName}`
    );
  }

  GetRoleIdBy_EmailId(EmailId: any) {
    //return this.httpClient.get<any>(`https://localhost:5009/GetRoleIdByEmailId/${EmailId}`);
    return this.httpClient.get<any>(
      this.apiUrl + `GetRoleIdByEmailId/${EmailId}`
    );
  }

  GetDistinctBarShapeCodes(){
    return this.httpClient.get<any>(
      this.apiUrl + `GetDistinctBarShapeCodes`
    );
    // return this.httpClient.get<any>(`https://localhost:5009/GetDistinctBarShapeCodes`);
  }
  updateBPCCabDetails(obj:any){
    return this.httpClient.post<any>(
      this.apiUrl + `UpdateBarShapeCodeDetails`,
      obj
    );
  }

  DeletedupcomingOrderList(CustomerCode: any, ProjectCode: any,) {
    // return this.httpClient.get<any>(`https://localhost:5009/getDeletedUpcomingOrders/${CustomerCode}/${ProjectCode}`);
    return this.httpClient.get<any>(
      this.apiUrl + `getDeletedUpcomingOrders/${CustomerCode}/${ProjectCode}`
    );
  }

  RecoverUpcoming(nWBS1:any, nWBS2:any,nWBS3:any,nStructureElement:any,nProductType:any,CustomerCode:any,ProjectCode:any) {
    // return this.httpClient.get<any>(`https://localhost:5009/RecoverUpcoming/${nWBS1}/${nWBS2}/${nWBS3}/${nStructureElement}/${nProductType}/${CustomerCode}/${ProjectCode}`);
    return this.httpClient.get<any>(this.apiUrl + `RecoverUpcoming/${nWBS1}/${nWBS2}/${nWBS3}/${nStructureElement}/${nProductType}/${CustomerCode}/${ProjectCode}`);
  }

  GetIsCABEdit(customerCode:any,projectCode:any,jobId:any,cageId:any){
    // return this.httpClient.get<any>(`https://localhost:5009/GetIsCABEdit?customerCode=${customerCode}&projectCode=${projectCode}&template=true&jobId=${jobId}&cageId=${cageId}`);
    return this.httpClient.get<any>(
      this.apiUrl + `GetIsCABEdit?customerCode=${customerCode}&projectCode=${projectCode}&template=true&jobId=${jobId}&cageId=${cageId}`
    );
  }
  GetBPCJobAdviceDetails(CustomerCode: any, ProjectCode: any,JobID:number): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `GetBPCJobAdviceDetails/${CustomerCode}/${ProjectCode}/${JobID}`);
    // return this.httpClient.get<any[]>(`https://localhost:5009/GetBPCJobAdviceDetails/${CustomerCode}/${ProjectCode}/${JobID}`);
  }
  Get_PrecastData(CustomerCode:string,ProjectCode:string,)
  {
       return this.httpClient.get<any[]>( this.apiUrl + `GetPrecastDetails/${CustomerCode},${ProjectCode}` )
      //return this.httpClient.get<any[]>(`https://localhost:5009/GetPrecastDetails/${CustomerCode}/${ProjectCode}`);
  }

  Insert_PRecastData(obj:any)
  {
   return this.httpClient.post<any>(this.apiUrl + `InsertPrecastDetails`,obj)
    // return this.httpClient.post<any[]>(`https://localhost:5009/InsertPrecastDetails`,obj);
  }
  Delete_Precast(id:any)
  {
     return this.httpClient.delete<any>(this.apiUrl + `DeletePrecastDetailsById/${id}`)
    // return this.httpClient.delete<any[]>(`https://localhost:5009/DeletePrecastDetailsById/${id}`);
  }

 //ADDED BY VISHAL
  getPrecastDetails(CustomerCode: string, ProjectCode: string, JobId: number) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getPrecastDetails/${CustomerCode}/${ProjectCode}/${JobId}`
    );
    // console.log("we are to reload");
    // return this.httpClient.get<any[]>(`https://localhost:5009/getPrecastDetails/${CustomerCode}/${ProjectCode}/${JobId}`);
  }

  SavePrecastJobAdvice(
    CustomerCode: any,
    ProjectCode: any,
    JobID: number,
    OrderStatus: any,
    TotalPcs: number,
    TotalWeight: any
  ): Observable<any> {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `SavePrecastJobAdvice/${CustomerCode}/${ProjectCode}/${JobID}/${OrderStatus}/${TotalPcs}/${TotalWeight}`
    );

    // return this.httpClient.get<any[]>(`https://localhost:5009/SavePrecastJobAdvice/${CustomerCode}/${ProjectCode}/${JobID}/${OrderStatus}/${TotalPcs}/${TotalWeight}`);
    }



    savePrecastDetails(obj: any): Observable<any> {
    //debugger;

    return this.httpClient.post<any[]>(
      this.apiUrl + `savePrecastDetails`,
      obj
    );

    //  return this.httpClient.post<any[]>(`https://localhost:5009/savePrecastDetails`, obj);
  }

  //UpdatePrecastFlag
  UpdatePrecastFlag(PostHeaderID: number, flag: number) {
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `UpdatePrecastFlag/${PostHeaderID}/${flag}`
    );
    // console.log("we are to reload");
    // return this.httpClient.get<any[]>(`https://localhost:5009/getPrecastDetails/${CustomerCode}/${ProjectCode}/${JobId}`);
  }

  InsertBPCJobAdviceDetails(Object: PreCastDetails) {
    let UserID = this.loginService.GetUserId();
     return this.httpClient.post<any>(this.apiUrl + `InsertBPCJobAdviceDetails/${UserID}`,Object);
    // return this.httpClient.post<any>(`https://localhost:5009/InsertBPCJobAdviceDetails/${UserID}`,Object);
  }

  UpdateBPCJobAdviceDetails(Object: PreCastDetails) {
    let UserID = this.loginService.GetUserId();
    return this.httpClient.post<any>(this.apiUrl + `UpdateBPCJobAdviceDetails/${UserID}`,Object);
    // return this.httpClient.post<any>(`https://localhost:5009/UpdateBPCJobAdviceDetails/${UserID}`,Object);
  }
  DeleteBPCJobAdviceDetails(PileId: any) {
    // return this.httpClient.delete<any>(`https://localhost:5009/DeleteBPCJobAdviceDetails/${PileId}`);
    return this.httpClient.delete<any>(this.apiUrl + `DeleteBPCJobAdviceDetails/${PileId}`);
  }
  //-----------

  check_OrderDocs_docs(
    OrderNumber: number,
    StructureElement: string,
    ProductType: string,
    ScheduledProd: string
  ) {
    ScheduledProd="N";
    // return this.httpClient.get<any>(`https://localhost:5009/checkOrderDocs_2/${OrderNumber}/${StructureElement}/${ProductType}/${ScheduledProd}`);
    return this.httpClient.get<any>(
      this.apiUrl +
      `checkOrderDocs_2/${OrderNumber}/${StructureElement}/${ProductType}/${ScheduledProd}`
    );
  }

  UpdateStructureElementIncoming(obj:any){
    return this.httpClient.post<any>(
      this.apiUrl + `UpdateStructureElementIncoming`,
      obj
    );
  }
  uploadFile2(
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
    UserName = this.loginService.GetGroupName(),
    UserType = this.loginService.GetUserType()
  ): Observable<any> {
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
    formData.append('UserType', UserType);

    // return this.httpClient.post<any>(
    //   'http://localhost:55592/api/SharePointAPI/uploadDrawingFiles',
    //   formData
    // );
    //http://172.25.1.224:8989/api/SAPAPI/
    //https://odossap.natsteel.com.sg:8999/
    return this.httpClient.post<any>(
      'https://odossap.natsteel.com.sg/SAP_API/api/SharePointAPI/uploadDrawingFiles_2',
      formData
    );

    // return this.httpClient.post<any>(
    //   'http://localhost:55592/api/SharePointAPI/uploadDrawingFiles_2',
    //   formData
    // );
  }

  //Popup
  GetActiveOrderDetails(POnumber:any) {
    //return this.httpClient.get<any>(`https://localhost:5009/ActiveOrderPopup/${POnumber}`);
    return this.httpClient.get<any>(this.apiUrl + `ActiveOrderPopup/${POnumber}`);
  }
  reload_ProjectDetails(CustomerCode: any, ProjectCode: any) {
    let UserName = this.loginService.GetGroupName();
    // return this.httpClient.get<any>(
    //   `https://localhost:5009/getProjectDetails/${CustomerCode}/${ProjectCode}/${UserName}`
    // );
    return this.httpClient.get<any>(
      this.apiUrl +
      `getProjectDetails/${CustomerCode}/${ProjectCode}/${UserName}`
    );
  }

  reload_ProjectDetails_Mesh(CustomerCode: any, ProjectCode: any) {
    let UserName = this.loginService.GetGroupName();
    // return this.httpClient.get<any>(
    //   `https://localhost:5009/getProjectDetails_mesh/${CustomerCode}/${ProjectCode}/${UserName}`
    // );
    return this.httpClient.get<any>(
      this.apiUrl +
      `getProjectDetails_mesh/${CustomerCode}/${ProjectCode}/${UserName}`
    );
  }

  reload_ProjectDetails_PRC(CustomerCode: any, ProjectCode: any) {
    let UserName = this.loginService.GetGroupName();
    // return this.httpClient.get<any>(
    //   `https://localhost:5009/getOrderDetails_prc/${CustomerCode}/${ProjectCode}/${UserName}`
    // );
    return this.httpClient.get<any>(
      this.apiUrl +
      `getOrderDetails_prc/${CustomerCode}/${ProjectCode}/${UserName}`
    );
  }

  reload_ProjectDetails_coupler(CustomerCode: any, ProjectCode: any) {
    let UserName = this.loginService.GetGroupName();
    // return this.httpClient.get<any>(
    //   `https://localhost:5009/getProjectDetails_coupler/${CustomerCode}/${ProjectCode}/${UserName}`
    // );
    return this.httpClient.get<any>(
      this.apiUrl +
      `getProjectDetails_coupler/${CustomerCode}/${ProjectCode}/${UserName}`
    );
  }

  reload_ProjectDetails_Coil(CustomerCode: any, ProjectCode: any) {
    let UserName = this.loginService.GetGroupName();
    // return this.httpClient.get<any>(
    //   `https://localhost:5009/getProjectDetails_coil/${CustomerCode}/${ProjectCode}/${UserName}`
    // );
    return this.httpClient.get<any>(
      this.apiUrl +
      `getProjectDetails_coil/${CustomerCode}/${ProjectCode}/${UserName}`
    );
  }


  reload_ProjectDetails_bpc(CustomerCode: any, ProjectCode: any) {
    let UserName = this.loginService.GetGroupName();
    // return this.httpClient.get<any>(
    //   `https://localhost:5009/getProjectDetails_bpc/${CustomerCode}/${ProjectCode}/${UserName}`
    // );
    return this.httpClient.get<any>(
      this.apiUrl +
      `getProjectDetails_bpc/${CustomerCode}/${ProjectCode}/${UserName}`
    );
  }

  reload_ProjectDetails_Std(CustomerCode: any, ProjectCode: any) {
    let UserName = this.loginService.GetGroupName();
    // return this.httpClient.get<any>(
    //   `https://localhost:5009/getProjectDetails_Std/${CustomerCode}/${ProjectCode}/${UserName}`
    // );
    return this.httpClient.get<any>(
      this.apiUrl +
      `getProjectDetails_Std/${CustomerCode}/${ProjectCode}/${UserName}`
    );
  }
  getGreenSteelDetails(
    ContractNo: string,
  ) {
    // return this.httpClient.get<any[]>(`https://localhost:5009/getGreenSteelValue/${ContractNo}`);
    return this.httpClient.get<any[]>(
      this.apiUrl +
      `getGreenSteelValue/${ContractNo}`
    );
  }

  GetGreenSteelToggleValue(SAPSOR: any) {
    // return this.httpClient.get<any>(`https://localhost:5009/GetGreenSteelToggleValue/${SAPSOR}`);
    return this.httpClient.get<any>(
      this.apiUrl + `GetGreenSteelToggleValue/${SAPSOR}`
    );
  }

  // GetGreenType( CustomerCode: string, ProjectCode: string) {
  //   // return this.httpClient.get<any[]>(`https://localhost:5009/GetGreenType/${CustomerCode}/${ProjectCode}`);
  //   return this.httpClient.get<any[]>(this.apiUrl +`GetGreenType/${CustomerCode}/${ProjectCode}`);
  // }

  CheckTransportModeCABOrderSummary(OrderNumber: number | string) {
    // return this.httpClient.get<any>(`https://localhost:5009/CheckTransportModeCABOrderSummary/${OrderNumber}`);
    return this.httpClient.get<any>(
      this.apiUrl + `CheckTransportModeCABOrderSummary/${OrderNumber}`
    );
  }
  GetSb_Conversion_Status(CustomerCode:string,ProjectCode:string,Ordernumber:number) {
    // return this.httpClient.get<any>(`https://localhost:5009/GetSb_Conversion_Status/${CustomerCode}/${ProjectCode}/${Ordernumber}`);
    return this.httpClient.get<any>(
      this.apiUrl + `GetSb_Conversion_Status/${CustomerCode}/${ProjectCode}/${Ordernumber}`
    );
  }

  ResetOrderRefNo(pOrderList: any): Observable<any> {
    return this.httpClient.post<any[]>(
      this.apiUrl + `ResetOrderRefNo`,
      pOrderList
    );
    // return this.httpClient.post<any[]>(`https://localhost:5009/ResetOrderRefNo`, pOrderList);
  }

   GetPrecastFlag(customerCode:any,projectCode:any){
     return this.httpClient.get<any>(
       this.apiUrl + `GetIsPrecast/${customerCode}/${projectCode}`
      );
   }
  GetProductGreenSteelValue(pObj: any): Observable<any> {
    return this.httpClient.post<any[]>(
      this.apiUrl + `getProductGreenSteelValue`,
      pObj
    );
    // return this.httpClient.post<any[]>(`https://localhost:5009/getProductGreenSteelValue`, pObj);
  }
  
  GetGreenSteelFlag(pObj: any): Observable<any> {
    return this.httpClient.post<any[]>(
      this.apiUrl + `GetGreenSteelFlag`,
      pObj
    );
    // return this.httpClient.post<any[]>(`https://localhost:5009/GetGreenSteelFlag`, pObj);
  }
  
  UpdateGreenSteelFlag(OrderNumber: any, GreenSteel: boolean) {
    OrderNumber = Number(OrderNumber);
      return this.httpClient.get<any>(this.apiUrl + `UpdateGreenSteelFlag/${OrderNumber}/${GreenSteel}`);
    // return this.httpClient.get<any>(`https://localhost:5009/UpdateGreenSteelFlag/${OrderNumber}/${GreenSteel}`);
  }

  
  GetCarpetDetailsNSH( CustomerCode: any,  ProjectCode: any,  PostID: number) {
    return this.httpClient.get<any>(
      this.apiUrl + `getCarpetDetailsNSH/${CustomerCode}/${ProjectCode}/${PostID}`
    );
    // return this.httpClient.get<any>(`https://localhost:5009/getCarpetDetailsNSH/${CustomerCode}/${ProjectCode}/${PostID}`);
  }

  GetProjectDetails( CustomerCode: any,  ProjectCode: any) {
    let UserName = this.loginService.GetGroupName();

    return this.httpClient.get<any>(
      this.apiUrl + `getProjectDetails_Carpet/${CustomerCode}/${ProjectCode}/${UserName}`
    );
    // return this.httpClient.get<any>(`https://localhost:5009/getProjectDetails_Carpet/${CustomerCode}/${ProjectCode}/${UserName}`);
  }
  
  GetShapeInfo( CustomerCode: any,  ProjectCode: any, JobId: number, ShapeCode: any) {
    let UserName = this.loginService.GetGroupName();

    return this.httpClient.get<any>(
      this.apiUrl + `getShapeInfo_Carpet/${CustomerCode}/${ProjectCode}/${JobId}/${ShapeCode}`
    );
    // return this.httpClient.get<any>(`https://localhost:5009/getShapeInfo_Carpet/${CustomerCode}/${ProjectCode}/${JobId}/${ShapeCode}`);
  }

  GetShapeImagesByCarpet() {
    let Product = 'CARPET';
    return this.httpClient.get<any>(
      this.apiUrl + `getShapeImagesByCarpet/${Product}`
    );
    // return this.httpClient.get<any>(`https://localhost:5009/getShapeImagesByCarpet/${Product}`);
  }
  GetProductListCarpet() {
    let Product = 'CARPET';
    return this.httpClient.get<any>(
      this.apiUrl + `getProductListCarpet/${Product}`
    );
    // return this.httpClient.get<any>(`https://localhost:5009/getProductListCarpet/${Product}`);
  }
  printShapesCarpet() {
    let Product = 'CARPET';
    return this.httpClient.get(
      this.apiUrl + `printShapesCarpet/${Product}`,{
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
    // return this.httpClient.get<Blob>(`https://localhost:5009/printShapesCarpet/${Product}`);
  }
  printProductCarpet(): Observable<Blob>  {
    let Product = 'CARPET';
    return this.httpClient.get(
      this.apiUrl + `printProductCarpet/${Product}`,{
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  //   return this.httpClient.get(`https://localhost:5009/printProductCarpet/${Product}`, {
  //   responseType: 'blob',
  // });
  }

  GetPMMProjectDetails(ProjectCode: any,CustomerCode:any) {
   // return this.httpClient.post<any>(`http://172.25.1.224:82/GetPMMProjectDetails/${ProjectCode}`, null);
    //GetAddressAndGateData
    return this.httpClient.post<any[]>(
      this.apiUrl + `GetAddressAndGateData/${ProjectCode}/${CustomerCode}`,
      null
    );
    //return this.httpClient.post<any>(`https://localhost:5009/GetAddressAndGateData/${ProjectCode}/${CustomerCode}`,null);
  }

  GetAddCodeforOrder(OrderNumber: any) {
    return this.httpClient.get<any>( this.apiUrl + `GetAddCodeforOrder/${OrderNumber}`);
    // return this.httpClient.get<any>(`https://localhost:5009/GetAddCodeforOrder/${OrderNumber}`);
  }

  GetOutsourceOrderAssign(FromReqDelDate:any,ToReqDelDate:any,Customercode:any,
    Project:any,Producttype:any,Status:any,OrderNo:any): Observable<any> {
      const params: any = {};
      if (FromReqDelDate != null) params.FromReqDelDate = FromReqDelDate;
      if (ToReqDelDate != null) params.ToReqDelDate = ToReqDelDate;
      if (Customercode) params.Customercode = Customercode;
      if (Project) params.Project = Project;
      if (Producttype) params.Producttype = Producttype;
      if (Status) params.Status = Status;
      if (OrderNo) params.OrderNo = OrderNo;
    return this.httpClient.get<any[]>(
      this.apiUrl + `OutsourceOrderAssignment`, {
      params: params
    }
    );
  }

  GetSupplier_BatchPrinting(): Observable<any> {
    debugger;
    return this.httpClient.get<any[]>(
      this.apiUrl + `GetSupplier_BatchPrinting`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5005/GetProductType/${FromDate}/${ToDate}`);
  }

  GetSONO_BatchPrinting(NoofDays: number, Vendorcode: any): Observable<any> {
    debugger;
    return this.httpClient.get<any[]>(
      this.apiUrl + `GetSONO_BatchPrinting/${NoofDays}/${Vendorcode}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5005/GetProductType/${FromDate}/${ToDate}`);
  }

  GetBatch_BatchPrinting(SONo: any): Observable<any> {
    debugger;
    return this.httpClient.get<any[]>(
      this.apiUrl + `GetBatch_BatchPrinting/${SONo}`
    );
    //return this.httpClient.get<any[]>(`https://localhost:5005/GetProductType/${FromDate}/${ToDate}`);
  }
  uploadBPCFile(obj:any):Observable<any>{
    
    const formData = new FormData();
    formData.append('CustomerCode', obj.CustomerCode);
    formData.append('ProjectCode', obj.ProjectCode);
    formData.append('JobID', obj.JobID);
    formData.append('CageID', obj.CageID);
    formData.append('ElevatedView', obj.ElevatedView);
    formData.append('PlanView', obj.PlanView);
    formData.append('Template', obj.Template);


    // return this.httpClient.post<any>(
    //   'https://localhost:5009/' + `UploadBPCImage`,formData
    // );

        return this.httpClient.post<any>(
      this.apiUrl + `UploadBPCImage`,formData
    );
  }

   downloadDOMaterial_Delivered(
    CustomerCode: any,
    ProjectCode: any,
    DONumbers: any,
    DODate: any
  ) {
    return this.httpClient.get<any>(
      `https://devappui.natsteel.com.sg:8080/project-document/v1/share-point/document/${CustomerCode}/${ProjectCode}/do/${DONumbers}`
    );
    // return this.httpClient.get<any>(
    //   this.apiUrl +
    //   `getDOMaterial_Delivered/${CustomerCode}/${ProjectCode}/${DONumbers}/${DODate}`
    // );
  }
}
