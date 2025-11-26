import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomerProjectService {
//order
  customerCode: any;
  projectCode:any []=[];
  CustomerName: any;
  ProjectName:any;
  AddressList: any[] = [];

  DetailingprojectId:number=0;
  customerCode_Detailing: any;
  projectCode_Detailing: any;

  selectCreateOrder_Flag: any;

  constructor() { }

  setCustomerCode(code: any) {
    this.customerCode = code;
  }
  setProjectCode(list: any) {
    this.projectCode = list;
  }
  getCustomerCode() {
    return this.customerCode;
  }
  getProjectCode() {
    return this.projectCode;
  }

  setAddressList(AddressList: any) {
    this.AddressList = Array.isArray(AddressList)
    ? AddressList.map(e => e?.toString?.() ?? '')
    : [];
  }
  getAddressList() {
    return this.AddressList;
  }



  setDetailingProjectId(code: any) {
    this.DetailingprojectId = code;
  }
  getDetailingProjectId(){
    return this.DetailingprojectId;
  }

  setCustomerName(Name:any){
    this.CustomerName= Name;
  }

  getCustomerName(){
    return this.CustomerName;
  }

  setProjectName(Name:any){
    this.ProjectName = Name;
  }

  getProjectName(){
    return this.ProjectName;
  }
  setCustomerCode_Detailing(code: any) {
    this.customerCode_Detailing = code;
  }
  setProjectCode_Detailing(list: any) {
    this.projectCode_Detailing = list;
  }
  getCustomerCode_Detailing() {
    return this.customerCode_Detailing;
  }
  getProjectCode_Detailing() {
    return this.projectCode_Detailing;
  }
  UpdateProjectCodeSequence(target: string): any {
    let lProjects = this.projectCode;
    const index = lProjects.indexOf(target);

    if (index > -1) {
      // Remove the item from its current position
      lProjects.splice(index, 1);
      // Add it to the beginning
      lProjects.unshift(target);
    }

    return lProjects;
  }
}
