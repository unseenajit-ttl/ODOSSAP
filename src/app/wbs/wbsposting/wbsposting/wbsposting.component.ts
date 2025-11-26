import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSortModule } from '@angular/material/sort';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { AddGroupMarkComponent } from '../addgroupmark/addgroupmark.component';
import { AddWbsBbsComponent } from '../addWBSBBS/addwbsbbs.component';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/SharedComponent/Dialogs/manage-dialog/confirm-dialog.component';
import { CapPostingComponent } from '../camppingdata/capposting.component';
import { ReleasewbsComponent } from '../Release/releasewbs.component';
import { formatDate } from '@angular/common';
import { WbsService } from '../wbs.service';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { wbsPosting } from 'src/app/Model/wbsPosting';
import { ToastrService } from 'ngx-toastr';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { BomData } from 'src/app/Model/BomData';
import { Breakpoints } from '@angular/cdk/layout';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-wbsposting',
  templateUrl: './wbsposting.component.html',
  styleUrls: ['./wbsposting.component.css'],
})
export class wbspostingComponent implements OnInit, OnDestroy {
  wbspostingForm!: FormGroup;
  wbsgroupMarkingForm!: FormGroup;
  submitted = false;
  searchResult = true;
  closeResult = '';
  searchText: any = '';
  customerList: any = [];
  producttypeList: any = [];
  structureList: any = [];
  projectList: any = [];
  selectedItems = [];
  dropdownSettings = {};
  istoggel: boolean = false;
  selectedcustomerName: any;
  selectedprojectName: any;
  loadingData = false;
  wbspostingarray: wbsPosting[] = [];
  backup_wbspostingarray: wbsPosting[] = [];
  isExpand: boolean = false;
  toggleFilters = true;

  loading: boolean = false;
  groupMarkLoading: boolean = true;

  iscreated: boolean = false;
  isdetailing: boolean = false;
  isposted: boolean = false;
  isreleased: boolean = false;

  disablepost: boolean = false;
  disableunpost: boolean = false;
  disablerelease: boolean = false;
  iscapping: boolean = true;
  temparray: any[] = [];

  currentPage = 1;
  pageSize = 0;
  maxSize: number = 10;
  itemsPerPage: number = 10;

  masterSelected = false;
  ArrayLength: any;

  last_currentPage: any = 0;
  last_pageSize: any = 0;

  SelectedProjectID: any;
  selectedProductTypeID: any;
  selectedWbs1: any[] = [];
  selectedWbs2: any[] = [];
  selectedWbs3: any[] = [];
  // selectedWbs2temp:string[] = [];
  searchSOR: any;
  searchReqDelivery: any;
  searchWBS1: any;
  searchWBS2: any;
  searchWBS3: any;
  searchBBS: any;
  searchBBSDesc: any;
  searchProductType: any;
  searchStructure: any[] = [];
  searchTotWt: any;
  searchTotQty: any;
  searchPostedBy: any;
  searchReleasedBy: any;
  IsModular: any;

  selectedGroupmarkItem: any;

  selectedStatusID: any;
  statusList: any;
  wbspostingarray_backup: any;

  Prev_Selected: any;

  groupMarkingQty: any;
  groupMarkingRemark: any;

  enableEditIndex: any = null;
  selectedCustomer: any;
  FilterdList: any;
  isEditing: boolean = false;

  PreviousSelectedList: any[] = [];

  structureElement: any = [];
  selectAllCheck: boolean = false;
  Approve: any=false;

  constructor(
    private toastr: ToastrService,
    public wbsService: WbsService,
    public commonService: CommonService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private reloadService: ReloadService,
    private dropdown: CustomerProjectService,
    private loginService: LoginService,
  ) {
    this.statusList = [
      { statusId: 3, status: 'Posted' },
      { statusId: 6, status: 'Created' },
      { statusId: 12, status: 'Released' },
      { statusId: 11, status: 'Under Detailing' },
    ];

    this.wbsgroupMarkingForm = this.formBuilder.group({
      qty: new FormControl('', Validators.required),
      remarks: new FormControl('', Validators.required),
    });

    this.wbspostingForm = this.formBuilder.group({
      customer: new FormControl('', Validators.required),
      project: new FormControl('', Validators.required),
      posted: new FormControl('', Validators.required),
      Created: new FormControl('', Validators.required),
      detailing: new FormControl('', Validators.required),
      released: new FormControl('', Validators.required),
      projecttype: new FormControl('', Validators.required),
      producttype: new FormControl('', Validators.required),
      status: new FormControl([]),
      qty: new FormControl('', Validators.required),
      remarks: new FormControl('', Validators.required),
    });
  }
  ngOnDestroy(): void {
    localStorage.setItem(
      'wbsPosting_ProductType',
      JSON.stringify(this.selectedProductTypeID)
    );
    localStorage.setItem(
      'wbsPosting_StructureElement',
      JSON.stringify(this.structureElement)
    );
  }

  async ngOnInit() {
    this.commonService.changeTitle('Wbs Posting | ODOS');
    // this.dataSource.sort = this.sort;
    let approve= this.loginService.GetGroupName();
    if(approve.toString().includes("@natsteel.com"))
    {
      this.Approve = true;
    }
    this.reloadService.reload$.subscribe((data) => {
      if (true) {
        // this.selectedcustomerName = this.dropdown.getCustomerCode();
        // this.SelectedProjectID = this.dropdown.getDetailingProjectId();
        // this.selectedprojectName = this.dropdown.getProjectCode();

        // this.GetCustomer();
        // this.GetProject(this.selectedcustomerName);

        // if (this.selectedprojectName !== undefined) {
        //   this.GetCustomer();
        //   this.GetProject(this.selectedcustomerName);
        //   this.changeproject(this.selectedprojectName);
        //   this.selectedProductTypeID = [7,];

        //   this.GetProductType()
        // }
        this.resetAllFilters();
        this.loadData();
      }
    });

    this.loadData();
  }
  loadData() {
    this.selectedCustomer = this.dropdown.getCustomerCode();
    this.selectedcustomerName = this.dropdown.getCustomerCode();
    this.SelectedProjectID = this.dropdown.getDetailingProjectId();

    console.log(this.selectedCustomer, 'This is this.selectedCustomer');
    console.log(this.selectedcustomerName, 'This is this.selectedcustomerName');
    if (this.SelectedProjectID != undefined && this.SelectedProjectID != 0) {
      let productType: any = localStorage.getItem('wbsPosting_ProductType');
      if (productType == 'undefined') {
        this.selectedProductTypeID = [7];
      } else {
        this.selectedProductTypeID = JSON.parse(productType);
      }

      let StructureElement: any = localStorage.getItem(
        'wbsPosting_StructureElement'
      );
      if (StructureElement == 'undefined') {
        this.structureElement = [];
      } else {
        this.structureElement = JSON.parse(StructureElement);
      }
      if (this.selectedProductTypeID == null) {
        this.selectedProductTypeID = [7];
      }
      if (this.structureElement == null) {
        this.structureElement = [];
      }
      if (this.selectedProductTypeID.length == 0) {
        this.selectedProductTypeID = [7];
      }
      this.GetCustomer();
      this.GetProject(this.selectedcustomerName);
      this.changeproject(this.selectedprojectName);
      this.GetProductType();
    }
    this.changeDetectorRef.detectChanges();
    this.loadingData = true;
    console.log(this.loadingData);
    this.ArrayLength = this.wbspostingarray.length;
  }

  showDetails(item: any) {
    this.isExpand = true;
  }
  public onItemSelect(item: any) {
    console.log(item.item_text);
    // console.log(e.target.value);
    // console.log(this.wbspostingForm)

    //  let projecttName =e.target.value
    this.wbspostingForm.patchValue({ projectname: item.item_text });
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.wbspostingForm.controls;
  }

  Search() {
    console.log(this.wbspostingForm.value);
    this.temparray = [];
    // for (var i = 0; i < this.wbspostingForm.value.producttype.length; i++) {
    //   let prod_type = this.wbspostingForm.value.producttype[i];

    // let arrayobj = this.wbspostingarray.filter((x: { prodttype: any; }) => x.prodttype === prod_type);

    // console.log(arrayobj);
    // if (arrayobj.length > 0) {
    //   for (var k = 0; k < arrayobj.length; k++) {
    //     this.temparray.push(arrayobj[k]);
    //   }

    // }
    // }
    this.wbspostingarray = this.temparray;

    //  this.temparray.push(arrayobj);
    console.log(this.temparray);
    console.log(this.wbspostingarray);
  }

  onReset() {
    this.submitted = false;
    this.wbspostingForm.reset();
    this.projectList = [];
    this.wbspostingarray = [];
    this.structureElement = [];
  }

  open(item: any) {
    //;

    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'lg',
    };
    const modalRef = this.modalService.open(
      AddGroupMarkComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.projectId = this.SelectedProjectID;
    modalRef.componentInstance.selectedItem = item;
    modalRef.componentInstance.wbselementId = item.INTWBSELEMENTID;
    modalRef.componentInstance.prodttype = item.ProductTypeID;
    modalRef.componentInstance.structure = item.StructureElementID;
    modalRef.componentInstance.postHeaderId = item.INTPOSTHEADERID;
    let isDisablePost;

    let checkselectedcount = 0;
    for (var i = 0; i < this.wbspostingarray.length; i++) {
      if (this.wbspostingarray[i]['isSelected'] == true) {
        checkselectedcount = checkselectedcount + 1;
        // this.PreviousSelectedList.push(this.wbspostingarray[i].INTWBSELEMENTID);
      }
    }
    console.log('checkselectedcount', checkselectedcount);

    // console.log("this.PreviousSelectedList.length",this.PreviousSelectedList.length)
    this.PreviousSelectedList.length;
    if (checkselectedcount < 2) {
      isDisablePost = false;
    } else {
      isDisablePost = true;
    }
    modalRef.componentInstance.isDisablePost = isDisablePost;

    // modalRef.componentInstance.prodttype = prodttype;
    // modalRef.componentInstance.structure = structure;

    modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
      if (x) {
        // item.isSelected = true;
        this.wbspostingarray.forEach((element) => {
          if (item.INTWBSELEMENTID === element.INTWBSELEMENTID) {
            element.isSelected = true;
          } else {
            element.isSelected = false;
          }
        });
        this.PreviousSelectedList.push(item.INTWBSELEMENTID);
        this.multipleSelect(item);
        this.Posting();
      } else {
        this.getGroupMarkingTable(item);
        this.GetWBSPostingGridList();
      }
      // this.searchWbsPostListData();
    });
  }

  postingreport: any;
  postedreport: any;

  showPostingReport(item: any) {
    let arrayToShowReports = this.wbspostingarray.filter((el: any) => {
      return (
        el.isSelected == true && (el.TNTSTATUSID == 12 || el.TNTSTATUSID == 3)
      );
    });
    if (arrayToShowReports.length > 0) {
      // arrayToShowReports.forEach((arrItem)=> this.openPostingReportInNewTab(arrItem));
      let postingReportArray =
        this.groupByStructureElementId(arrayToShowReports); //separate slab,column,beam with given structure element id
      let postingReportArrayKeys = Object.keys(postingReportArray); //get key of array
      console.log('selected postingReportArrayKeys=>', postingReportArrayKeys);
      postingReportArrayKeys.forEach((key) => {
        //traverse keys
        let normalPost: any = {
          headerIds: null,
          sitProductTypeId: null,
          structureElementID: null,
        };
        postingReportArray[key].forEach((arrItem: any) => {
          //traverse actual array based on key and also crate multiple postheaders
          normalPost['headerIds'] =
            normalPost['headerIds'] != null
              ? normalPost['headerIds'] + ',' + arrItem.INTPOSTHEADERID
              : arrItem.INTPOSTHEADERID;
          normalPost['sitProductTypeId'] = arrItem.ProductTypeID;
          normalPost['structureElementID'] = arrItem.StructureElementID;
        });
        this.postingreport =
          'http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_Reports%2fWBSPostingReports&rs%3aCommand=Render&INTPOSTHEADERIDS=' +
          normalPost.headerIds +
          '&SITPRODUCTTYPEID=' +
          normalPost.sitProductTypeId +
          '&INTSTRUCTUREELEMENTID=' +
          normalPost.structureElementID +
          '&rc:Parameters=false';
        window.open(this.postingreport, '_blank');
      });
    } else {
      this.openPostingReportInNewTab(item);
    }
  }
  openPostingReportInNewTab(item: any) {
    this.postingreport =
      'http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_Reports%2fWBSPostingReports&rs%3aCommand=Render&INTPOSTHEADERIDS=' +
      item.INTPOSTHEADERID +
      '&SITPRODUCTTYPEID=' +
      item.ProductTypeID +
      '&INTSTRUCTUREELEMENTID=' +
      item.StructureElementID +
      '&rc:Parameters=false';
    window.open(this.postingreport, '_blank');
  }
  openPostingMultipleUrlInNewTab(normalPost: any) {
    if (normalPost.headerIds != null) {
      this.postedreport =
        'http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_REPORTS%2fWBSPostedReports&rs:Command=Render&INTPOSTHEADERIDS=' +
        normalPost.headerIds +
        '&SITPRODUCTTYPEID=' +
        normalPost.sitProductTypeId +
        '&INTSTRUCTUREELEMENTID=' +
        normalPost.structureElementID +
        '&ISSUMMARYREPORT=0&rc:Parameters=false';
      window.open(this.postedreport, '_blank');
    }
  }
  showPostedReport(item: any) {
    let arrayToShowReports = this.wbspostingarray.filter((el: any) => {
      return (
        el.isSelected == true && (el.TNTSTATUSID == 12 || el.TNTSTATUSID == 3)
      );
    });
    if (arrayToShowReports.length > 0) {
      arrayToShowReports.forEach((arrItem) => {
        if (arrItem.ProductTypeID == 7 && arrItem.StructureElementID == 5) {
          this.postedreport =
            'http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_Reports%2fWBSPostedDrain&rs:Command=Render&INTPOSTHEADERIDS=' +
            arrItem.INTPOSTHEADERID +
            '&sitProductTypeId=' +
            arrItem.ProductTypeID +
            '&intStructureElementId=' +
            arrItem.StructureElementID +
            '&IsSummaryReport=0&rc:Parameters=false';
          window.open(this.postedreport, '_blank');
        } else if (arrItem.ProductTypeID == 9) {
          this.postedreport =
            'http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_Reports%2fWBSPostedReportBPC&rs:Command=Render&INTPOSTHEADERIDS=' +
            arrItem.INTPOSTHEADERID +
            '&SITPRODUCTTYPEID=' +
            arrItem.ProductTypeID +
            '&INTSTRUCTUREELEMENTID=' +
            arrItem.StructureElementID +
            '&ISSUMMARYREPORT=0&rc:Parameters=false';
          window.open(this.postedreport, '_blank');
        } else if (
          arrItem.ProductTypeID == 14 &&
          arrItem.StructureElementID == 4
        ) {
          this.postedreport =
            'http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_Reports%2fWBSPostedReports_carpet&rs:Command=Render&INTPOSTHEADERIDS=' +
            arrItem.INTPOSTHEADERID +
            '&SITPRODUCTTYPEID=' +
            arrItem.ProductTypeID +
            '&INTSTRUCTUREELEMENTID=' +
            arrItem.StructureElementID +
            '&ISSUMMARYREPORT=0&rc:Parameters=false';
          window.open(this.postedreport, '_blank');
        } else {
          // normalPost['headerIds'] = normalPost['headerIds']!=null ? normalPost['headerIds'] + ',' + arrItem.INTPOSTHEADERID : arrItem.INTPOSTHEADERID;
          // normalPost['sitProductTypeId'] = arrItem.ProductTypeID;
          // normalPost['structureElementID'] = arrItem.StructureElementID;
          // this.postedreport = 'http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_REPORTS%2fWBSPostedReports&rs:Command=Render&INTPOSTHEADERIDS=' + arrItem.INTPOSTHEADERID + '&SITPRODUCTTYPEID=' + arrItem.ProductTypeID + '&INTSTRUCTUREELEMENTID=' + arrItem.StructureElementID + '&ISSUMMARYREPORT=0&rc:Parameters=false';
        }
      });
      let newArrayTest = arrayToShowReports.filter((el: any) => {
        return (
          el.ProductTypeID != 9 &&
          (el.StructureElementID != 5 || el.StructureElementID != 4)
        );
      }); // filters mesh element like slab,colum,beam
      let postedReportArray = this.groupByStructureElementId(newArrayTest); //separate slab,column,beam with given structure element id
      let postedReportArrayKeys = Object.keys(postedReportArray); //get key of array
      postedReportArrayKeys.forEach((key) => {
        //traverse keys
        let normalPost: any = {
          headerIds: null,
          sitProductTypeId: null,
          structureElementID: null,
        };
        postedReportArray[key].forEach((arrItem: any) => {
          //traverse actual array based on key and also crate multiple postheaders
          normalPost['headerIds'] =
            normalPost['headerIds'] != null
              ? normalPost['headerIds'] + ',' + arrItem.INTPOSTHEADERID
              : arrItem.INTPOSTHEADERID;
          normalPost['sitProductTypeId'] = arrItem.ProductTypeID;
          normalPost['structureElementID'] = arrItem.StructureElementID;
        });
        this.openPostedMultipleUrlInNewTab(normalPost);
      });
    } else {
      this.openPostedUrlInNewTab(item);
    }
  }
  openPostedUrlInNewTab(item: any) {
    if (item.ProductTypeID == 7 && item.StructureElementID == 5) {
      this.postedreport =
        'http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_Reports%2fWBSPostedDrain&rs:Command=Render&INTPOSTHEADERIDS=' +
        item.INTPOSTHEADERID +
        '&sitProductTypeId=' +
        item.ProductTypeID +
        '&intStructureElementId=' +
        item.StructureElementID +
        '&IsSummaryReport=0&rc:Parameters=false';
    } else if (item.ProductTypeID == 9) {
      this.postedreport =
        'http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_Reports%2fWBSPostedReportBPC&rs:Command=Render&INTPOSTHEADERIDS=' +
        item.INTPOSTHEADERID +
        '&SITPRODUCTTYPEID=' +
        item.ProductTypeID +
        '&INTSTRUCTUREELEMENTID=' +
        item.StructureElementID +
        '&ISSUMMARYREPORT=0&rc:Parameters=false';
    } else if (item.ProductTypeID == 14 && item.StructureElementID == 4) {
      this.postedreport =
        'http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_Reports%2fWBSPostedReports_carpet&rs:Command=Render&INTPOSTHEADERIDS=' +
        item.INTPOSTHEADERID +
        '&SITPRODUCTTYPEID=' +
        item.ProductTypeID +
        '&INTSTRUCTUREELEMENTID=' +
        item.StructureElementID +
        '&ISSUMMARYREPORT=0&rc:Parameters=false';
    } else {
      this.postedreport =
        'http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_REPORTS%2fWBSPostedReports&rs:Command=Render&INTPOSTHEADERIDS=' +
        item.INTPOSTHEADERID +
        '&SITPRODUCTTYPEID=' +
        item.ProductTypeID +
        '&INTSTRUCTUREELEMENTID=' +
        item.StructureElementID +
        '&ISSUMMARYREPORT=0&rc:Parameters=false';
    }
    window.open(this.postedreport, '_blank');
  }
  openPostedMultipleUrlInNewTab(normalPost: any) {
    if (normalPost.headerIds != null) {
      this.postedreport =
        'http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_REPORTS%2fWBSPostedReports&rs:Command=Render&INTPOSTHEADERIDS=' +
        normalPost.headerIds +
        '&SITPRODUCTTYPEID=' +
        normalPost.sitProductTypeId +
        '&INTSTRUCTUREELEMENTID=' +
        normalPost.structureElementID +
        '&ISSUMMARYREPORT=0&rc:Parameters=false';
      window.open(this.postedreport, '_blank');
    }
  }
  groupByStructureElementId(array: any[]): any {
    return array.reduce((acc, obj) => {
      const key = obj.StructureElementID;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  }
  AddwbsBbs() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'lg',
    };
    const modalRef = this.modalService.open(
      AddWbsBbsComponent,
      ngbModalOptions
    );
  }
  //
  edit(index: any) {
    //console.log("edit");
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'lg',
    };
    //console.log(index);
    // const modalRef = this.modalService.open(CreateWbsComponent, ngbModalOptions);
    // modalRef.componentInstance.name = 'World';
    // modalRef.componentInstance.formname = 'wbsposting'
    // modalRef.componentInstance.wbsdata = this.arrayObj[index];
  }
  delete() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      // size: 'lg',
    };
    // const modalRef = this.modalService.open(ConfirmDialogComponent, ngbModalOptions);
    // modalRef.componentInstance.name = 'World';
    // modalRef.componentInstance.formname = 'wbsposting'
  }
  // changeProject(e: any) {
  //   console.log(e.target.value);
  //   // console.log(this.wbsForm)

  //   let projecttName = e.target.value
  //   this.wbspostingForm.patchValue({ projectname: projecttName });

  // }

  Toggle() {
    this.istoggel = !this.istoggel;
    console.log(this.istoggel);
  }

  isAllCheckBoxChecked() {
    //return this.wbspostingarray.every(p => p.checked);
  }

  checkAllCheckBox(ev: any) {
    // Angular 9
  }

  deletegroupmark(mainitem: any, item: any, index: any) {
    //
    console.log(mainitem);
    console.log(item);
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      // size: 'lg',
    };
    const modalRef = this.modalService.open(
      ConfirmDialogComponent,
      ngbModalOptions
    );

    modalRef.result.then((modalResult) => {
      if (modalResult.isConfirm) {
        this.DeleteGroupMark(mainitem.INTPOSTHEADERID, item.intSMGroupMarkId);
        console.log(modalResult.isConfirm);
        mainitem.Groupmarkinglist.splice(index, 1);
      }
    });

    console.log(item.storeyfrom);

    // mainitem.Storey.splice(mainitem.Storey.indexOf(item.storeyfrom), 1)
  }

  changecustomer(event: any): void {
    //;
    this.wbspostingForm.controls['project'].reset();
    this.GetProject(event);
    this.searchResult = false;
  }

  changeproject(event: any) {
    this.searchResult = true;
    if (event == undefined) {
      this.selectedStatusID = undefined;
      this.wbspostingarray = [];
    }
  }

  distinctNamesWBS1: any[] = [];
  distinctNamesWBS2: any[] = [];
  distinctNamesWBS3: any[] = [];
  filteredArray: any[] = [];
  originalarray: any[] = [];
  originalArrayForFilter: any[] = [];

  filterwbs(event: any) {
    if (event.length > 0 || (this.selectedWbs1.length>0||this.selectedWbs2.length>0||this.selectedWbs3.length>0)) {
      let larray:any[] = [...this.originalArrayForFilter];
      if(this.selectedWbs1.length>0){
        larray = larray.filter((item) => {
          console.log('filtered arraya=>', event, item);
          return this.selectedWbs1.includes(item.VCHWBS1);
        });
      }
      if(this.selectedWbs2.length>0){
        larray = larray.filter((item) => {
          console.log('filtered arraya=>', event, item);
          return this.selectedWbs2.includes(item.VCHWBS2);
        });
      }
      if(this.selectedWbs3.length>0){
        larray = larray.filter((item) => {
          console.log('filtered arraya=>', event, item);
          return this.selectedWbs3.includes(item.VCHWBS3);
        });
      }
    
      this.filteredArray=larray;
      this.wbspostingarray = this.filteredArray;
    } else {
      this.wbspostingarray = [...this.originalArrayForFilter];
    }
  }

  // filterwbs3(event: any) {
  //   if (event.length > 0) {
  //     const larray = [...this.originalArrayForFilter];
  //     this.filteredArray = larray.filter((item) => {
  //       console.log('filtered arraya=>', event, item.VCHWBS3);
  //       return this.selectedWbs3.includes(item.VCHWBS3);
  //     });
  //     this.wbspostingarray = this.filteredArray;
  //   } else {
  //     this.wbspostingarray = [...this.originalArrayForFilter];
  //   }
  // }
  // filterwbs2(event: any) {
  //   debugger;
  //   // this.wbspostingarray = this.originalarray;
  //   // console.log("OnselectedEmp", this.selectedWbs2);
  //   // this.selectedWbs2temp=this.selectedWbs2;

  //   // if (event.length > 0) {
  //   //   this.filteredArray = this.wbspostingarray;
  //   //   this.wbspostingarray = this.wbspostingarray.filter(
  //   //     (ids) => event.indexOf(ids.VCHWBS2) != -1
  //   //   );
  //   // } else {
  //   //   this.wbspostingarray = this.originalarray;
  //   // }
  //   if (event.length > 0) {
  //     const larray = [...this.originalArrayForFilter];
  //     this.filteredArray = larray.filter((item) => {
  //       console.log('filtered arraya=>', event, item.VCHWBS2);
  //       return this.selectedWbs2.includes(item.VCHWBS2);
  //     });
  //     this.wbspostingarray = this.filteredArray;
  //   } else {
  //     this.wbspostingarray = [...this.originalArrayForFilter];
  //   }
  // }
  changestatus(
    iscreated: any,
    isdetailing: any,
    isposted: any,
    isreleased: any
  ) {
    // Can't call the methos to load list as it calls the data synchronously
    // this.GetWBSPostingGridList();

    this.wbspostingarray = [];
    for (let i = 0; i < this.selectedProductTypeID.length; i++) {
      this.wbsService
        .GetWBSPostingGridList(
          this.SelectedProjectID,
          this.selectedProductTypeID[i]
        )
        .subscribe({
          next: (response) => {
            this.wbspostingarray = this.wbspostingarray.concat(response);

            this.wbspostingarray.forEach((item) => {
              const name1 = item.VCHWBS1;
              const name2 = item.VCHWBS2;
              const name3 = item.VCHWBS3;
              if (
                !this.distinctNamesWBS1.some(
                  (vendor) => vendor['label'] === item.VCHWBS1
                )
              ) {
                this.distinctNamesWBS1.push({ label: name1, value: name1 });
              }
              if (
                !this.distinctNamesWBS2.some(
                  (vendor) => vendor['label'] === item.VCHWBS2
                )
              ) {
                this.distinctNamesWBS2.push({ label: name2, value: name2 });
              }
              if (
                !this.distinctNamesWBS3.some(
                  (vendor) => vendor['label'] === item.VCHWBS3
                )
              ) {
                this.distinctNamesWBS3.push({ label: name3, value: name3 });
              }
            });
            console.log('this.distinctNamesWBS1', this.distinctNamesWBS1);
            console.log('this.distinctNamesWBS2', this.distinctNamesWBS2);
            console.log('this.distinctNamesWBS3', this.distinctNamesWBS3);

            console.log(this.wbspostingarray);
            for (let j = 0; j < this.wbspostingarray.length; j++) {
              if (
                this.producttypeList.find(
                  (x: { ProductTypeID: number }) =>
                    x.ProductTypeID === this.wbspostingarray[j].ProductTypeID
                )
              ) {
                this.wbspostingarray[j].ProductType = this.producttypeList.find(
                  (x: { ProductTypeID: number }) =>
                    x.ProductTypeID === this.wbspostingarray[j].ProductTypeID
                ).ProductType;
              }
              if (
                this.structureList.find(
                  (x: { StructureElementTypeId: number }) =>
                    x.StructureElementTypeId ===
                    this.wbspostingarray[j].StructureElementID
                )
              ) {
                this.wbspostingarray[j].StructureElement =
                  this.structureList.find(
                    (x: { StructureElementTypeId: number }) =>
                      x.StructureElementTypeId ===
                      this.wbspostingarray[j].StructureElementID
                  ).StructureElementType;
              }
            }
          },
          error: (e) => {},
          complete: () => {
            this.iscreated = iscreated;
            this.isdetailing = isdetailing;
            this.isposted = isposted;
            this.isreleased = isreleased;

            //INITIAL STATE OF BUTTONS
            this.disablepost = false;
            this.disableunpost = false;
            this.disablerelease = false;

            if (this.iscreated) {
              this.disablepost = false;
              this.disableunpost = true;
              this.disablerelease = true;
              this.wbspostingarray = this.wbspostingarray.filter(
                (object) => object.TNTSTATUSID == 10
              );
            }
            // else if (isdetailing) {
            //   this.disablepost = false;
            //   this.disableunpost = true;
            //   this.disablerelease = true;
            //   this.wbspostingarray = this.wbspostingarray.filter((object: { isdetailing: boolean; }) =>
            //     object.isdetailing == true);

            // }
            else if (isposted) {
              this.disableunpost = false;
              this.disablepost = true;
              this.wbspostingarray = this.wbspostingarray.filter(
                (object) => object.TNTSTATUSID == 3
              );
            } else if (isreleased) {
              this.disablepost = true;
              this.disableunpost = true;
              this.wbspostingarray = this.wbspostingarray.filter(
                (object) => object.TNTSTATUSID == 12 || object.TNTSTATUSID == 11
              );
            }
          },
        });
    }
  }
  resetAllFilters() {
    this.searchSOR = null;
    this.searchReqDelivery = null;
    this.searchWBS1 = null;
    this.selectedWbs1 = [];
    this.selectedWbs2 = [];
    this.selectedWbs3 = [];
    this.searchWBS3 = null;
    this.searchBBS = null;
    this.searchBBSDesc = null;
    this.searchProductType = null;
    this.searchStructure = [];
    this.searchTotWt = null;
    this.searchTotQty = null;
    this.searchPostedBy = null;
    this.searchReleasedBy = null;
    this.selectAllCheck = false;
    this.wbspostingarray.map((litem) => {
      litem.ReadOnly = false;
      litem.isSelected = false;
    });
  }
  giveRowcolor(item: any) {
    var color = '#ffffff';
    if (item.TNTSTATUSID == 6) {
      // created
      //color='#6AB200';
    } else if (item.TNTSTATUSID == 11) {
      // Under Detailing
      color = '#8debfb';
    } else if (item.TNTSTATUSID == 3) {
      // Posted
      // color = '#ADEDAD';
      color = '#fffd88';
      // color = ' #8FBAAD'
    } else if (item.TNTSTATUSID == 12) {
      // Released
      // color = '#00A589'
      color = '#ADEDAD';
      // color = '#F5C4CD';
    }
    return color;
  }

  checkUncheckAll() {
    let rec_selected = 0;
    for (var i = 0; i < this.wbspostingarray.length; i++) {
      if (this.wbspostingarray[i].isSelected == true) {
        rec_selected += 1;
      }
    }
    if (rec_selected == 0) {
      return false;
    }
    return true;
  }

  multipleSelect(item: any) {}

  isAllSelected(item: any) {
    console.log('isAllSelected', item);

    if (item.isSelected == false) {
      this.disablepost = false;
      this.disableunpost = false;
      this.disablerelease = false;
      return;
    }
    if (item.TNTSTATUSID == 6) {
      //Created
      this.disablepost = false;
      this.disableunpost = true;
      this.disablerelease = true;
    } else if (item.TNTSTATUSID == 11) {
      //In Detailing
      this.disablepost = false;
      this.disableunpost = true;
      this.disablerelease = true;
    } else if (item.TNTSTATUSID == 3) {
      //Posted
      this.disableunpost = false;
      this.disablepost = true;
      this.disablerelease = false;
    } else if (item.TNTSTATUSID == 12) {
      //Released
      this.disablepost = true;
      this.disableunpost = true;
      this.disablerelease = true;
    }

    this.masterSelected = this.wbspostingarray.every(function (item: any) {
      return item.isSelected == true;
    });
    // let temparray = this.wbspostingarray.filter((x: { isSelected: boolean; }) => x.isSelected == true);
    let temparray = [{}];
    console.log(temparray);
  }

  async Posting() {

    /** Validation for POSTING */
    let lResp: any = this.PostingValidation();
    if(lResp.isSuccess == false){
      alert(lResp.ErrorMessage);
      return;
    }

    this.PreviousSelectedList = [];
    let checkselectedcount = 0;
    for (var i = 0; i < this.wbspostingarray.length; i++) {
      if (this.wbspostingarray[i]['isSelected'] == true) {
        checkselectedcount = checkselectedcount + 1;
        this.PreviousSelectedList.push(this.wbspostingarray[i].INTWBSELEMENTID);
        console.log(checkselectedcount);
      }
    }
    console.log(this.PreviousSelectedList);

    if (checkselectedcount == 0) {
      alert("You haven't selected any WBS.");
    } else {
      for (var i = 0; i < this.wbspostingarray.length; i++) {
        if (this.wbspostingarray[i]['isSelected'] == true) {
          this.loading = true;
          let ProjectId,
            WBSElementsId,
            StructureElementId,
            ProductTypeId,
            BBSNo: string;
          ProjectId = this.SelectedProjectID;

          // this.wbspostingarray[i].isExpand = false
          WBSElementsId = this.wbspostingarray[i].INTWBSELEMENTID;
          StructureElementId = this.wbspostingarray[i].StructureElementID;
          ProductTypeId = this.wbspostingarray[i].ProductTypeID;
          BBSNo = this.wbspostingarray[i].VCHBBSNO;

          let postHeaderId_new = this.wbspostingarray[i].INTPOSTHEADERID;

          var response = await this.getGroupMarkingTable_Wrapper(
            postHeaderId_new,
            WBSElementsId,
            StructureElementId,
            ProductTypeId,
            BBSNo
          );

          let index = this.wbspostingarray.findIndex(
            (x) => x.VCHBBSNO === BBSNo
          );
          this.wbspostingarray[index].Groupmarkinglist = response;

          if (this.wbspostingarray[index].Groupmarkinglist.length != 0) {
            let Modular = '';
            if (
              this.IsModular &&
              this.wbspostingarray[index].ProductTypeID == 7 &&
              this.wbspostingarray[index].StructureElementID == 1
            ) {
              Modular = 'Y';
            } else {
              Modular = 'N';
            }

            var a = await this.PostBBSAsync_Wrapper(
              this.wbspostingarray[index].INTPOSTHEADERID,
              1,
              Modular
            );

            this.loading = false;

            if (a !== true) {
              this.toastr.error(a.error);
              continue;
            }

            // this.PostBBSAsync(this.wbspostingarray[index].INTPOSTHEADERID,1,Modular)
            // this.GetWBSPostingGridList();

            debugger;

            if (
              this.iscapping &&
              (this.wbspostingarray[index].StructureElementID == 1 ||
                this.wbspostingarray[index].StructureElementID == 2)
            ) {
              let custName = this.customerList.find(
                (x: { CustomerNo: any }) =>
                  x.CustomerNo === this.selectedcustomerName
              ).Customername;
              let projNo = this.projectList.find(
                (x: { ProjectId: any }) => x.ProjectId == this.SelectedProjectID
              ).ProjectCode;
              let projDesc = this.projectList.find(
                (x: { ProjectId: any }) => x.ProjectId == this.SelectedProjectID
              ).Description;

              let wbselementID,
                structure,
                productType,
                block,
                storey,
                part,
                postHeaderId;
              wbselementID = this.wbspostingarray[index].INTWBSELEMENTID;
              structure = this.wbspostingarray[index].StructureElement;
              productType = this.wbspostingarray[index].ProductType;
              block = this.wbspostingarray[index].VCHWBS1;
              storey = this.wbspostingarray[index].VCHWBS2;
              part = this.wbspostingarray[index].VCHWBS3;
              postHeaderId = this.wbspostingarray[index].INTPOSTHEADERID;

              const ngbModalOptions: NgbModalOptions = {
                backdrop: 'static',
                keyboard: false,
                // centered: true,
                size: 'xl',
              };

              const modalRef = this.modalService.open(
                CapPostingComponent,
                ngbModalOptions
              );
              modalRef.componentInstance.postHeaderId = postHeaderId;
              modalRef.componentInstance.wbselementID = wbselementID;
              modalRef.componentInstance.custName = custName;
              modalRef.componentInstance.projectNum = projNo;
              modalRef.componentInstance.projectDesc = projDesc;
              modalRef.componentInstance.block = block;
              modalRef.componentInstance.productType = productType;
              modalRef.componentInstance.structureElement = structure;
              modalRef.componentInstance.part = part;
              modalRef.componentInstance.storey = storey;
              this.loading = false;
              // modalRef.componentInstance.loading = this.loading
              // loading

              // modalRef.componentInstance.storey = ''
              // modalRef.componentInstance.storey = ''

              modalRef.result.then((modalResult) => {
                if (modalResult.isConfirm) {
                  console.log(modalResult.isConfirm);
                  this.GetWBSPostingGridList();
                  for (var i = 0; i < this.wbspostingarray.length; i++) {
                    if (this.wbspostingarray[i]['isSelected'] == true) {
                      // this.wbspostingarray[i]['SOR'] = 800040120;
                      // this.wbspostingarray[i]['ReqDeli'] = formatDate(new Date(), 'dd/MM/yyyy', 'en');
                      // this.wbspostingarray[i]['TotQty'] = 0.9767;
                      // this.wbspostingarray[i]['TotWt'] = 82;
                      this.iscapping = false;
                      // this.Posting();

                      this.wbspostingarray[i]['isposted'] = true;
                      this.wbspostingarray[i]['iscreated'] = false;
                      this.wbspostingarray[i]['isdetailing'] = false;
                      this.wbspostingarray[i]['isreleased'] = false;
                      this.wbspostingarray[i]['isSelected'] = false;
                      this.disablerelease = true;
                    }
                  }
                }
              });
            }
            // else {
            //   console.log(this.wbspostingarray[index]);
            //   console.log(this.iscapping);
            //   let Posted_By = 1;
            //   // "PostHeaderId": 0,
            //   const WBSobj: any = {
            //     PostHeaderId: this.wbspostingarray[index].INTPOSTHEADERID,
            //     PostedBy: Posted_By
            //   };

            //   this.wbsService.POSTwbs(WBSobj).subscribe({
            //     next: (response) => {
            //       this.loading = false
            //       // if (response == 1) {
            //       //   this.toastr.success("WBS Saved Successfully.");
            //       // }
            //       // else if (response == 2) {
            //       //   this.toastr.warning("WBS Allready Exists.");
            //       // }
            //     },
            //     error: (e) => {
            //       // this.toastr.error('Can not add blank record.')
            //     },
            //     complete: () => {
            //       debugger;
            //       this.GetWBSPostingGridList();
            //       this.PostBBSAsync(this.wbspostingarray[i].INTPOSTHEADERID,1,Modular)
            //     },
            //   });
            // }
          } else {
            this.toastr.error('Record cannot be posted without a Groupmark');
            this.loading = false;
          }
          // this.wbsService.getGroupMarkingTable(ProjectId, WBSElementsId, StructureElementId, ProductTypeId, BBSNo).subscribe({
          //   next: (response) => {

          //     let index = this.wbspostingarray.findIndex(x => x.VCHBBSNO === BBSNo)
          //     this.wbspostingarray[index].Groupmarkinglist = response;

          //     if (this.wbspostingarray[index].Groupmarkinglist.length != 0) {

          //       let Modular=''
          //       if(this.IsModular && this.wbspostingarray[index].ProductTypeID == 7 && this.wbspostingarray[index].StructureElementID == 1)
          //       {
          //         Modular = 'Y'
          //       }
          //       else{
          //         Modular = 'N'
          //       }

          //       // var a  =  await this.PostBBSAsync_Wrapper(this.wbspostingarray[index].INTPOSTHEADERID,1,Modular);
          //       this.PostBBSAsync(this.wbspostingarray[index].INTPOSTHEADERID,1,Modular)
          //       this.GetWBSPostingGridList();
          //       this.loading = false;

          //       debugger;

          //       if (this.iscapping && (this.wbspostingarray[index].StructureElementID == 1 || this.wbspostingarray[index].StructureElementID == 2)) {
          //         let custName = this.customerList.find((x: { CustomerNo: any; }) => x.CustomerNo === this.selectedcustomerName).Customername
          //         let projNo = this.projectList.find((x: { ProjectId: any; }) => x.ProjectId == this.SelectedProjectID).ProjectCode
          //         let projDesc = this.projectList.find((x: { ProjectId: any; }) => x.ProjectId == this.SelectedProjectID).Description

          //         let wbselementID, structure, productType, block, storey, part, postHeaderId
          //         wbselementID = this.wbspostingarray[index].INTWBSELEMENTID
          //         structure = this.wbspostingarray[index].StructureElement
          //         productType = this.wbspostingarray[index].ProductType
          //         block = this.wbspostingarray[index].VCHWBS1
          //         storey = this.wbspostingarray[index].VCHWBS2
          //         part = this.wbspostingarray[index].VCHWBS3
          //         postHeaderId = this.wbspostingarray[index].INTPOSTHEADERID

          //         const ngbModalOptions: NgbModalOptions = {
          //           backdrop: 'static',
          //           keyboard: false,
          //           // centered: true,
          //           size: 'xl',
          //         }

          //         const modalRef = this.modalService.open(CapPostingComponent, ngbModalOptions);
          //         modalRef.componentInstance.postHeaderId = postHeaderId;
          //         modalRef.componentInstance.wbselementID = wbselementID
          //         modalRef.componentInstance.custName = custName;
          //         modalRef.componentInstance.projectNum = projNo;
          //         modalRef.componentInstance.projectDesc = projDesc;
          //         modalRef.componentInstance.block = block
          //         modalRef.componentInstance.productType = productType;
          //         modalRef.componentInstance.structureElement = structure;
          //         modalRef.componentInstance.part = part
          //         modalRef.componentInstance.storey = storey
          //         this.loading = false
          //         // modalRef.componentInstance.loading = this.loading
          //         // loading

          //         // modalRef.componentInstance.storey = ''
          //         // modalRef.componentInstance.storey = ''

          //         modalRef.result.then(modalResult => {
          //           if (modalResult.isConfirm) {
          //             console.log(modalResult.isConfirm);
          //             this.GetWBSPostingGridList();
          //             for (var i = 0; i < this.wbspostingarray.length; i++) {
          //               if (this.wbspostingarray[i]['isSelected'] == true) {
          //                 // this.wbspostingarray[i]['SOR'] = 800040120;
          //                 // this.wbspostingarray[i]['ReqDeli'] = formatDate(new Date(), 'dd/MM/yyyy', 'en');
          //                 // this.wbspostingarray[i]['TotQty'] = 0.9767;
          //                 // this.wbspostingarray[i]['TotWt'] = 82;
          //                 this.iscapping = false
          //                 // this.Posting();

          //                 this.wbspostingarray[i]['isposted'] = true;
          //                 this.wbspostingarray[i]['iscreated'] = false;
          //                 this.wbspostingarray[i]['isdetailing'] = false;
          //                 this.wbspostingarray[i]['isreleased'] = false;
          //                 this.wbspostingarray[i]['isSelected'] = false;
          //                 this.disablerelease = true;
          //               }
          //             }
          //           }
          //         });
          //       }
          //       // else {
          //       //   console.log(this.wbspostingarray[index]);
          //       //   console.log(this.iscapping);
          //       //   let Posted_By = 1;
          //       //   // "PostHeaderId": 0,
          //       //   const WBSobj: any = {
          //       //     PostHeaderId: this.wbspostingarray[index].INTPOSTHEADERID,
          //       //     PostedBy: Posted_By
          //       //   };

          //       //   this.wbsService.POSTwbs(WBSobj).subscribe({
          //       //     next: (response) => {
          //       //       this.loading = false
          //       //       // if (response == 1) {
          //       //       //   this.toastr.success("WBS Saved Successfully.");
          //       //       // }
          //       //       // else if (response == 2) {
          //       //       //   this.toastr.warning("WBS Allready Exists.");
          //       //       // }
          //       //     },
          //       //     error: (e) => {
          //       //       // this.toastr.error('Can not add blank record.')
          //       //     },
          //       //     complete: () => {
          //       //       debugger;
          //       //       this.GetWBSPostingGridList();
          //       //       this.PostBBSAsync(this.wbspostingarray[i].INTPOSTHEADERID,1,Modular)
          //       //     },
          //       //   });
          //       // }

          //     }
          //      else {
          //       this.toastr.error('Record cannot be posted without a Groupmark')
          //       this.loading = false
          //     }
          //   },
          //   error: (e) => {
          //   },
          //   complete: () => {
          //     this.GetWBSPostingGridList();
          //     // this.wbspostingarray_backup = JSON.parse(JSON.stringify(this.wbspostingarray))
          //   },
          // });
        }
      }
      this.GetWBSPostingGridList();
    }
    // else {

    //   for (var i = 0; i < this.wbspostingarray.length; i++) {
    //     if (this.wbspostingarray[i]['isSelected'] == true) {
    //       console.log(this.wbspostingarray[i]);
    //       console.log(this.iscapping);
    //       let Posted_By = 1;
    //       // "PostHeaderId": 0,
    //       const WBSobj: any = {
    //         PostHeaderId: this.wbspostingarray[i].INTPOSTHEADERID,
    //         PostedBy: Posted_By
    //       };

    //       this.wbsService.POSTwbs(WBSobj).subscribe({
    //         next: (response) => {
    //           // if (response == 1) {
    //           //   this.toastr.success("WBS Saved Successfully.");
    //           // }
    //           // else if (response == 2) {
    //           //   this.toastr.warning("WBS Allready Exists.");
    //           // }
    //         },
    //         error: (e) => {
    //           // this.toastr.error('Can not add blank record.')
    //         },
    //         complete: () => {
    //           this.GetWBSPostingGridList()
    //         },
    //       });
    //       return;

    //     }
    //   }
    // }

    // }
  }
  async Unposting() {

    /** Validation for UNPOSTING */
    let lResp: any = this.UnPostingValidation();
    if (lResp.isSuccess == false) {
      alert(lResp.ErrorMessage);
      return;
    }

    this.PreviousSelectedList = [];
    let checkselectedcount = 0;
    for (var i = 0; i < this.wbspostingarray.length; i++) {
      if (this.wbspostingarray[i]['isSelected'] == true) {
        checkselectedcount = checkselectedcount + 1;
        this.PreviousSelectedList.push(this.wbspostingarray[i].INTWBSELEMENTID);

        console.log(checkselectedcount);
      }
    }

    if (checkselectedcount == 0) {
      alert("You haven't selected any WBS.");
    } else {
      this.loading = true;
      let checkselectedcount = 0;
      for (var i = 0; i < this.wbspostingarray.length; i++) {
        if (this.wbspostingarray[i]['isSelected'] == true) {
          checkselectedcount = checkselectedcount + 1;
          console.log(checkselectedcount);

          let PostHeaderId = this.wbspostingarray[i].INTPOSTHEADERID;

          let res = await this.Unposting_Wrapper(PostHeaderId);
          // this.wbsService.UN_POSTwbs(PostHeaderId).subscribe({
          //   next: (response) => {
          //     this.loading = false
          //     // if (response == 1) {
          //     //   this.toastr.success("WBS Saved Successfully.");
          //     // }
          //     // else if (response == 2) {
          //     //   this.toastr.warning("WBS Allready Exists.");
          //     // }
          //   },
          //   error: (e) => {
          //     // this.toastr.error('Can not add blank record.')
          //   },
          //   complete: () => {
          //     this.GetWBSPostingGridList()
          //   },
          // });
        }
      }
    }

    this.GetWBSPostingGridList();
  }
  async Release() {
    
    /** Validation for RELEASE */
    let lResp: any = this.ReleaseValidation();
    if (lResp.isSuccess == false) {
      alert(lResp.ErrorMessage);
      return;
    }
    this.PreviousSelectedList = [];
    let checkselectedcount = 0;
    for (var i = 0; i < this.wbspostingarray.length; i++) {
      if (this.wbspostingarray[i]['isSelected'] == true) {
        checkselectedcount = checkselectedcount + 1;
        this.PreviousSelectedList.push(this.wbspostingarray[i].INTWBSELEMENTID);

        console.log(checkselectedcount);
      }
    }
    if (checkselectedcount == 0) {
      alert("You haven't selected any WBS.");
    } else {
      for (var i = 0; i < this.wbspostingarray.length; i++) {
        if (this.wbspostingarray[i]['isSelected'] == true) {
          if (this.wbspostingarray[i].ORD_REQ_NO) {
            if (
              this.wbspostingarray[i].TOTALQTY == 0 ||
              this.wbspostingarray[i].TOTALWEIGHT == 0
            ) {
              this.toastr.warning('Total Weight or Quantity cannot be Zero');
            } else {
              this.loading = true;
              let WBSobj = {
                SalesOrderId: String(
                  this.wbspostingarray[i].SOReqDetailsId + 'i'
                ),
                PostHeaderId: String(
                  this.wbspostingarray[i].INTPOSTHEADERID + 'i'
                ),
                BBSStatusId: 'R',
                Releaseby: 1,
              };

              let res = await this.BBSRelease_Wrapper(WBSobj);

              // this.wbsService.BBSRelease(WBSobj).subscribe({
              //   next: (response) => {
              //     console.log(response);
              //   },
              //   error: (e) => {
              //   },
              //   complete: () => {
              //     this.loading = false
              //     this.GetWBSPostingGridList()
              //   },
              // });
            }
          } else {
            this.toastr.error(
              'Record cannot be released without generating Order Rquest Number'
            );
          }
        }
      }
      this.GetWBSPostingGridList();
    }

    // if (isCapping) {
    //   const ngbModalOptions: NgbModalOptions = {
    //     backdrop: 'static',
    //     keyboard: false,
    //     // centered: true,
    //     size: 'lg',

    //   }
    //   const modalRef = this.modalService.open(ReleasewbsComponent, ngbModalOptions);

    //   modalRef.result.then(modalResult => {
    //     if (modalResult.isConfirm) {
    //       console.log(modalResult.isConfirm);
    //       for (var i = 0; i < this.wbspostingarray.length; i++) {
    //         if (this.wbspostingarray[i]['isSelected'] == true) {
    //           // this.wbspostingarray[i]['SOR'] = 900401434;
    //           // this.wbspostingarray[i]['ReqDeli'] = formatDate(new Date(), 'dd/MM/yyyy', 'en');

    //           this.wbspostingarray[i]['isposted'] = false;
    //           this.wbspostingarray[i]['iscreated'] = false;
    //           this.wbspostingarray[i]['isdetailing'] = false;
    //           this.wbspostingarray[i]['isreleased'] = true;
    //           this.wbspostingarray[i]['isSelected'] = false;
    //           this.disablerelease = true;
    //         }
    //       }
    //     }
    //   });

    // }
    // else {
    //   let checkselectedcount = 0
    //   for (var i = 0; i < this.wbspostingarray.length; i++) {
    //     if (this.wbspostingarray[i]['isSelected'] == true) {
    //       checkselectedcount = checkselectedcount + 1;
    //       console.log(checkselectedcount);
    //     }
    //   }
    //   if (checkselectedcount == 0) {
    //     alert("You haven't selected any WBS.");

    //   } else {

    //     for (var i = 0; i < this.wbspostingarray.length; i++) {
    //       if (this.wbspostingarray[i]['isSelected'] == true) {
    //         // this.wbspostingarray[i]['SOR'] = 900401434;
    //         // this.wbspostingarray[i]['ReqDeli'] = formatDate(new Date(), 'dd/MM/yyyy', 'en');

    //         this.wbspostingarray[i]['isposted'] = false;
    //         this.wbspostingarray[i]['iscreated'] = false;
    //         this.wbspostingarray[i]['isdetailing'] = false;
    //         this.wbspostingarray[i]['isreleased'] = true;
    //         this.wbspostingarray[i]['isSelected'] = false;
    //         this.disablerelease = true;
    //       }
    //     }

    //   }

    // }
  }
  ChangeCapping() {}
  GetCustomer(): void {
    //;
    this.commonService.GetCutomerDetails().subscribe({
      next: (response) => {
        this.customerList = response;

        //console.log(this.customerList);
      },
      error: (e) => {},
      complete: () => {
        this.loading = false;
      },
    });
  }
  GetProject(customercode: any): void {
    this.commonService.GetProjectDetails(customercode).subscribe({
      next: (response) => {
        this.projectList = response;
      },

      error: (e) => {},
      complete: () => {},
    });
  }
  GetStructElement(): void {
    this.wbsService.GetStructElement().subscribe({
      next: (response) => {
        this.structureList = response;
      },
      error: (e) => {
        //console.log(e.error);
      },
      complete: () => {
        this.changeProductType();
      },
    });
  }

  GetProductType(): void {
    this.wbsService.GetProductType().subscribe({
      next: (response) => {
        this.producttypeList = response;
      },
      error: (e) => {},
      complete: () => {
        this.GetStructElement();
      },
    });
  }

  changeProductType() {
    this.GetWBSPostingGridList();
  }

  async GetWBSPostingGridListasync(
    ProjectID: any,
    ProductTypeID: any
  ): Promise<any> {
    try {
      const data = await this.wbsService
        .GetWBSPostingGridList(ProjectID, ProductTypeID)
        .toPromise();
      return data;
    } catch (error) {
      return false;
    }
  }

  async GetWBSPostingGridList() {
    //;
    debugger;
    this.loading = true;
    this.last_currentPage = this.currentPage;
    this.last_pageSize = this.pageSize;
    this.wbspostingarray = [];

    for (let i = 0; i < this.selectedProductTypeID.length; i++) {
      // ASYNC GET CALL
      let response = await this.GetWBSPostingGridListasync(
        this.SelectedProjectID,
        this.selectedProductTypeID[i]
      );

      if (response == false) {
      } else {
        this.wbspostingarray = this.wbspostingarray.concat(response);
        console.log(this.wbspostingarray);
        for (let j = 0; j < this.wbspostingarray.length; j++) {
          this.wbspostingarray[j].ReadOnly = false;
          this.wbspostingarray[j].isSelected = false;
          if (
            this.producttypeList.find(
              (x: { ProductTypeID: number }) =>
                x.ProductTypeID === this.wbspostingarray[j].ProductTypeID
            )
          ) {
            this.wbspostingarray[j].ProductType = this.producttypeList.find(
              (x: { ProductTypeID: number }) =>
                x.ProductTypeID === this.wbspostingarray[j].ProductTypeID
            ).ProductType;
          }
          if (
            this.structureList.find(
              (x: { StructureElementTypeId: number }) =>
                x.StructureElementTypeId ===
                this.wbspostingarray[j].StructureElementID
            )
          ) {
            this.wbspostingarray[j].StructureElement = this.structureList.find(
              (x: { StructureElementTypeId: number }) =>
                x.StructureElementTypeId ===
                this.wbspostingarray[j].StructureElementID
            ).StructureElementType;
          }
        }
      }

      // this.wbsService.GetWBSPostingGridList(this.SelectedProjectID, this.selectedProductTypeID[i]).subscribe({
      //   next: (response) => {
      //     this.wbspostingarray = this.wbspostingarray.concat(response);
      //     console.log(this.wbspostingarray)
      //     for (let j = 0; j < this.wbspostingarray.length; j++) {
      //       this.wbspostingarray[j].ReadOnly = false
      //       this.wbspostingarray[j].isSelected = false
      //       if (this.producttypeList.find((x: { ProductTypeID: number; }) => x.ProductTypeID === this.wbspostingarray[j].ProductTypeID)) {
      //         this.wbspostingarray[j].ProductType = this.producttypeList.find((x: { ProductTypeID: number; }) => x.ProductTypeID === this.wbspostingarray[j].ProductTypeID).ProductType
      //       }
      //       if (this.structureList.find((x: { StructureElementTypeId: number; }) => x.StructureElementTypeId === this.wbspostingarray[j].StructureElementID)) {
      //         this.wbspostingarray[j].StructureElement = this.structureList.find((x: { StructureElementTypeId: number; }) => x.StructureElementTypeId === this.wbspostingarray[j].StructureElementID).StructureElementType
      //       }
      //     }
      //   },
      //   error: (e) => {
      //   },
      //   complete: () => {
      //     this.currentPage = this.last_currentPage;
      //     this.pageSize = this.last_pageSize;
      //     // this.searchWbsPostListData()
      //     this.wbspostingarray_backup = JSON.parse(JSON.stringify(this.wbspostingarray))
      //     this.originalarray=this.wbspostingarray;
      //     this.wbspostingarray.forEach(item => {
      //       const name = item.VCHWBS2;
      //       if (!this.distinctNamesWBS2.includes(name)) {
      //         this.distinctNamesWBS2.push(name);
      //       }
      //     });
      // console.log("this.distinctNamesWBS2",this.distinctNamesWBS2);

      //     this.changeStatusType(this.wbspostingForm.controls['status'].value)

      //   },
      // });
    }

    this.loading = false;
    this.currentPage = this.last_currentPage;
    this.pageSize = this.last_pageSize;
    // this.searchWbsPostListData()
    this.originalarray = this.wbspostingarray;
    console.log('this.wbspostingarray=>', this.wbspostingarray);
    this.wbspostingarray.forEach((item) => {
      const name1 = item.VCHWBS1;
      const name2 = item.VCHWBS2;
      const name3 = item.VCHWBS3;
      if (
        !this.distinctNamesWBS1.some(
          (vendor) => vendor['label'] === item.VCHWBS1
        )
      ) {
        this.distinctNamesWBS1.push({ label: name1, value: name1 });
      }
      if (
        !this.distinctNamesWBS2.some(
          (vendor) => vendor['label'] === item.VCHWBS2
        )
      ) {
        this.distinctNamesWBS2.push({ label: name2, value: name2 });
      }
      if (
        !this.distinctNamesWBS3.some(
          (vendor) => vendor['label'] === item.VCHWBS3
        )
      ) {
        this.distinctNamesWBS3.push({ label: name3, value: name3 });
      }
    });
    console.log('this.distinctNamesWBS1', this.distinctNamesWBS1);
    console.log('this.distinctNamesWBS2', this.distinctNamesWBS2);
    console.log('this.distinctNamesWBS3', this.distinctNamesWBS3);
    console.log(this.wbspostingForm.controls['status'].value);
    console.log(this.wbspostingForm);
    console.log('this.wbspostingarray before', this.wbspostingarray);
    // let lDataList = JSON.parse(JSON.stringify(this.wbspostingarray));
    this.PreviousSelectedList.forEach((element) => {
      this.wbspostingarray.forEach((element_) => {
        if (
          element_.INTWBSELEMENTID === element
        ) {
          element_.isSelected = true;
          if(element_.TNTSTATUSID == 12){
            this.wbspostingarray = this.RearrangeListOrder(this.wbspostingarray, element);
          }
          // this.wbspostingarray[element_]['isSelected'] = true;
        }
      });
    });
    // this.wbspostingarray = [];
    // this.wbspostingarray = lDataList;

    console.log('this.PreviousSelectedList', this.PreviousSelectedList);
    if (this.PreviousSelectedList.length) {
      let index = this.wbspostingarray.findIndex(
        (x) => x.INTWBSELEMENTID == this.PreviousSelectedList[0]
      );
      debugger;
      /** Condition added to not select the previously selected record if the record is released */
      if (this.wbspostingarray[index].TNTSTATUSID != 12) {
        this.multipleSelect(this.wbspostingarray[index]);
      }
    }

    this.wbspostingarray_backup = JSON.parse(
      JSON.stringify(this.wbspostingarray)
    );

    console.log('this.wbspostingarray After', this.wbspostingarray);

    this.changeStatusType(this.wbspostingForm.controls['status'].value);
  }

  getGroupMarkingTable(item: any): void {
    //;
    this.selectedGroupmarkItem = item;
    this.groupMarkLoading = true;
    item.Groupmarkinglist = [];
    item.isExpand = !item.isExpand;

    let ProjectId, WBSElementsId, StructureElementId, ProductTypeId, BBSNo;
    ProjectId = this.SelectedProjectID;

    // item.isExpand = false
    WBSElementsId = item.INTWBSELEMENTID;
    StructureElementId = item.StructureElementID;
    ProductTypeId = item.ProductTypeID;
    BBSNo = item.VCHBBSNO;
    this.wbsService
      .getGroupMarkingTable(
        item.INTPOSTHEADERID,
        WBSElementsId,
        StructureElementId,
        ProductTypeId,
        BBSNo
      )
      .subscribe({
        next: (response) => {
          item.Groupmarkinglist = response;
        },
        error: (e) => {},
        complete: () => {
          this.groupMarkLoading = false;
          // this.wbspostingarray_backup = JSON.parse(JSON.stringify(this.wbspostingarray))
        },
      });
  }

  DeleteGroupMark(PostHeaderId: any, GroupMarkId: any) {
    this.wbsService
      .DeletePostingGroupMarkingDetail(PostHeaderId, GroupMarkId)
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (e) => {},
        complete: () => {},
      });
  }
  changeStatusType(item: any) {
    //;
    this.wbspostingarray = [];
    if (item === undefined) {
      item = [];
    }

    this.wbspostingarray = JSON.parse(
      JSON.stringify(this.wbspostingarray_backup)
    );
    this.FilterdList = JSON.parse(JSON.stringify(this.wbspostingarray));

    console.log(item);
    if (item.length != 0) {
      let final_list: wbsPosting[] = [];
      for (let i = 0; i < item.length; i++) {
        let temp_list: wbsPosting[] = [];
        if (item[i] == 3) {
          temp_list = this.wbspostingarray.filter(
            (object) => object.TNTSTATUSID == 3
          );
        } else if (item[i] == 12) {
          temp_list = this.wbspostingarray.filter(
            (object) => object.TNTSTATUSID == 12
          );
        } else if (item[i] == 11) {
          temp_list = this.wbspostingarray.filter(
            (object) => object.TNTSTATUSID == 11
          );
        } else if (item[i] == 6) {
          temp_list = this.wbspostingarray.filter(
            (object) => object.TNTSTATUSID == 6
          );
        }
        final_list = final_list.concat(temp_list);
      }
      this.wbspostingarray = final_list;
      this.FilterdList = JSON.parse(JSON.stringify(this.wbspostingarray));
    }
    // this.changestructureElement();
    this.searchWbsPostListData();
  }

  onEdit(row2: any, index: any) {
    //;
    // console.log("index", this.prev_index)
    // console.log("backup", this.backup_update)
    // if (this.prev_index != null) {
    //   this.groupmarkingEditlist[this.prev_index] = JSON.parse(JSON.stringify(this.backup_update));
    // }

    this.groupMarkingQty = row2.intSMProductQty;
    this.groupMarkingRemark = row2.vchSMRemarks;

    // this.prev_index = this.groupmarkingEditlist.findIndex(x => x.GroupMark === row2.GroupMark);
    // this.backup_update = JSON.parse(JSON.stringify(row2));
    // this.wbscreateForm.controls['qty'].patchValue(this.backup_update.Qty);
    // this.wbscreateForm.controls['remarks'].patchValue(this.backup_update.Remark);

    // console.log("after backup", this.backup_update);
    this.isEditing = true;
    this.enableEditIndex = index;
  }
  Update(row2: any, subArrayIndex: any, index: any) {
    //;

    // UPDATES VALUE IN THE TABLE LOCALLY
    this.wbspostingarray[index].Groupmarkinglist[
      subArrayIndex
    ].intSMProductQty = this.groupMarkingQty;
    this.wbspostingarray[index].Groupmarkinglist[subArrayIndex].vchSMRemarks =
      this.groupMarkingRemark;

    // UPDATES VALUES IN THE DB
    let PostHeaderId = this.wbspostingarray[index].INTPOSTHEADERID;
    let groupMark = row2.intSMGroupMarkId;
    let qty = this.groupMarkingQty;
    let remark = this.groupMarkingRemark;
    // if(remark==null)
    // {
    //   remark = "";
    // }
    let intupdateId = 1;
    if (remark.trim() == '') {
      remark = null;
    }
    this.wbsService
      .updateGroupMarkDetails(PostHeaderId, groupMark, qty, remark, intupdateId)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.toastr.success('Group Mark Updated successfully');
          //this.saveTrigger.emit(this.ShapegroupObj);
        },
        error: (e) => {
          console.log(e.error);
        },
        complete: () => {
          // this.GetGroupMarkingList()
          // this.LoadTagList(this.selected_station);
        },
      });

    this.isEditing = false;
    this.enableEditIndex = null;
    // this.prev_index = null;
  }
  // GetProductType(): void {
  //   this.wbsService.GetProductType().subscribe({
  //     next: (response) => {
  //       this.producttypeList = response;
  //     },
  //     error: (e) => {
  //     },
  //     complete: () => {
  //     },
  //   });
  // }

  //  Update(item: WBS, index: any) {
  //     //

  //     if (!this.storeyValidated) {
  //       this.toastr.error(this.StoreyErrorMessage);
  //       return;
  //     }

  //     if (this.is_new_Item) {
  //       console.log(item)
  //       const WBSobj: WBS = {
  //         intWBSMTNCId: 0,
  //         intWBSId: 1,
  //         Block: item.Block?.trim(),
  //         StoryFrom: item.StoryFrom,
  //         StoryTo: item.StoryTo,
  //         Part: item.Part?.trim(),
  //         ProductType: item.ProductType.toString(),
  //         Structure: item.Structure.toString(),
  //       };

  //       this.wbsService.SaveWBS(WBSobj, this.SelectedProjectID).subscribe({
  //         next: (response) => {
  //           if (response == 1) {
  //             this.toastr.success("WBS Saved Successfully.");
  //           }
  //           else if (response == 2) {
  //             this.toastr.warning("WBS Allready Exists.");
  //           }
  //           this.AddReset();
  //         },
  //         error: (e) => {
  //           this.toastr.error('Can not add blank record.')
  //         },
  //         complete: () => {
  //           this.LoadWBSList(this.SelectedProjectID);
  //         },
  //       });
  public onPageChange(pageNum: number): void {
    debugger;
    this.pageSize = this.itemsPerPage * (pageNum - 1);
    this.enableEditIndex = null;

    //this.LoadShapeGroupList();
  }

  OnPageSizeChange(pageSize: number) {
    this.pageSize = 0;
    this.currentPage = 1;
    this.enableEditIndex = null;
  }

  searchWbsPostListData() {
    // this.GetCabProducuctCodeList();
    //;
    this.selectAllCheck = false;
    debugger;
    this.wbspostingarray = JSON.parse(JSON.stringify(this.FilterdList));

    if (this.structureElement.length > 0) {
      this.changestructureElement();
    }
    if (this.searchSOR != undefined && this.searchSOR != '') {
      this.wbspostingarray = this.wbspostingarray.filter((item) =>
        item.ORD_REQ_NO?.toLowerCase().includes(
          this.searchSOR.trim().toLowerCase()
        )
      );
    }

    if (this.searchReqDelivery != undefined && this.searchReqDelivery != '') {
      this.wbspostingarray = this.wbspostingarray.filter((item) =>
        item.ReqDate?.toLowerCase().includes(
          this.searchReqDelivery.trim().toLowerCase()
        )
      );
    }

    if (this.searchWBS1 != undefined && this.searchWBS1 != '') {
      this.wbspostingarray = this.wbspostingarray.filter((item) =>
        item.VCHWBS1?.toLowerCase().includes(
          this.searchWBS1.trim().toLowerCase()
        )
      );
    }

    // if (this.searchWBS2 != undefined && this.searchWBS2 != "") {
    //   this.wbspostingarray = this.wbspostingarray.filter(item =>
    //     item.VCHWBS2?.toLowerCase().includes(this.searchWBS2.trim().toLowerCase())
    //   );
    // }

    if (this.searchWBS3 != undefined && this.searchWBS3 != '') {
      this.wbspostingarray = this.wbspostingarray.filter((item) =>
        item.VCHWBS3?.toLowerCase().includes(
          this.searchWBS3.trim().toLowerCase()
        )
      );
    }

    if (this.searchBBS != undefined && this.searchBBS != '') {
      this.wbspostingarray = this.wbspostingarray.filter((item) =>
        item.VCHBBSNO?.toLowerCase().includes(
          this.searchBBS.trim().toLowerCase()
        )
      );
    }

    if (this.searchBBSDesc != undefined && this.searchBBSDesc != '') {
      this.wbspostingarray = this.wbspostingarray.filter((item) =>
        item.BBS_DESC?.toLowerCase().includes(
          this.searchBBSDesc.trim().toLowerCase()
        )
      );
    }

    if (this.searchProductType != undefined && this.searchProductType != '') {
      this.wbspostingarray = this.wbspostingarray.filter((item) =>
        item.ProductType?.toLowerCase().includes(
          this.searchProductType.trim().toLowerCase()
        )
      );
    }
    if (this.searchStructure.length > 0) {
      this.changestructureElement_Filter();
    }

    if (this.searchTotWt != undefined && this.searchTotWt != '') {
      this.wbspostingarray = this.wbspostingarray.filter((item) =>
        // item.TOTALQTY?.toString().toLowerCase().includes(this.searchTotWt.trim().toLowerCase())
        this.checkFilterData(this.searchTotWt, item.TOTALWEIGHT)
      );
    }

    if (this.searchTotQty != undefined && this.searchTotQty != '') {
      this.wbspostingarray = this.wbspostingarray.filter((item) =>
        // item.TOTALWEIGHT?.toString().toLowerCase().includes(this.searchTotQty.trim().toLowerCase())
        this.checkFilterData(this.searchTotQty, item.TOTALQTY)
      );
    }

    if (this.searchPostedBy != undefined && this.searchPostedBy != '') {
      this.wbspostingarray = this.wbspostingarray.filter((item) =>
        item.POSTEDBY?.toLowerCase().includes(
          this.searchPostedBy.trim().toLowerCase()
        )
      );
    }

    if (this.searchReleasedBy != undefined && this.searchReleasedBy != '') {
      this.wbspostingarray = this.wbspostingarray.filter((item) =>
        item.INTRELEASEBY?.toLowerCase().includes(
          this.searchReleasedBy.trim().toLowerCase()
        )
      );
    }

    this.originalArrayForFilter = [...this.wbspostingarray];
    if (this.selectedWbs2.length > 0 ||this.selectedWbs1.length > 0||this.selectedWbs3.length > 0) {
      this.filterwbs('AA');
    }
  }
  PostBBSAsync(postHeaderId: any, userId: any, Modular: any) {
    this.wbsService.PostBBSAsync(postHeaderId, userId, Modular).subscribe({
      next: (response) => {},
      error: (e) => {},
      complete: () => {},
    });
  }

  NEw_Posting(WBSobj: any, i: any, Modular: any) {
    this.wbsService.POSTwbs(WBSobj).subscribe({
      next: (response) => {
        this.loading = false;
        // if (response == 1) {
        //   this.toastr.success("WBS Saved Successfully.");
        // }
        // else if (response == 2) {
        //   this.toastr.warning("WBS Allready Exists.");
        // }
      },
      error: (e) => {
        // this.toastr.error('Can not add blank record.')
      },
      complete: () => {
        debugger;
        this.Posting();
        this.GetWBSPostingGridList();
        this.PostBBSAsync(this.wbspostingarray[i].INTPOSTHEADERID, 1, Modular);
      },
    });
  }

  async PostBBSAsync_Wrapper(
    postHeaderId: any,
    userId: any,
    Modular: any
  ): Promise<any> {
    try {
      var a = await this.wbsService
        .PostBBSAsync(postHeaderId, userId, Modular)
        .toPromise();
      return a;
    } catch (error) {
      return error;
    }
  }
  async Unposting_Wrapper(postHeaderId: any): Promise<any> {
    try {
      var a = await this.wbsService.UN_POSTwbs(postHeaderId).toPromise();
      return a;
    } catch (error) {
      return error;
    }
  }

  async BBSRelease_Wrapper(WBSobj: any): Promise<any> {
    try {
      var a = await this.wbsService.BBSRelease(WBSobj).toPromise();
      return a;
    } catch (error) {
      return error;
    }
  }

  async getGroupMarkingTable_Wrapper(
    ProjectId: any,
    WBSElementsId: any,
    StructureElementId: any,
    ProductTypeId: any,
    BBSNo: any
  ): Promise<any> {
    try {
      var a = await this.wbsService
        .getGroupMarkingTable(
          ProjectId,
          WBSElementsId,
          StructureElementId,
          ProductTypeId,
          BBSNo
        )
        .toPromise();
      return a;
    } catch (error) {
      return error;
    }
  }

  RouteToBom(item: any) {
    // item.StructureElement = this.MeshData.VCHSTRUCTUREELEMENTTYPE;
    debugger;
    // let BomData: BomData = {
    //   StructureElement: item.StructureElement,
    //   ProductMarkId: item.ProductMarkId,
    //   CO1: item.CO1,
    //   CO2: item.CO2,
    //   MO1: item.MO1,
    //   MO2: item.MO2,
    //   ParamValues: item.ParamValues,
    //   ShapeCodeName: item.ShapeCode,
    //   ShapeID: item.ShapeCodeId
    // }
    let BomData: BomData = {
      StructureElement: undefined,
      ProductMarkId: undefined,
      CO1: undefined,
      CO2: undefined,
      MO1: undefined,
      MO2: undefined,
      ParamValues: undefined,
      ShapeCodeName: undefined,
      ShapeID: undefined,
    };
    localStorage.setItem('BomData', JSON.stringify(BomData));
    this.router.navigate(['/detailing/BOM']);
  }

  changestructureElement() {
    debugger;
    if (this.structureElement.length > 0) {
      let temp_list: any;
      let final_list: wbsPosting[] = [];
      this.structureElement.forEach((element: any) => {
        temp_list = this.wbspostingarray.filter(
          (item) => item.StructureElement == element
        );
        final_list = final_list.concat(temp_list);
      });

      this.wbspostingarray = final_list;
    }
  }

  checkFilterData(ctlValue: any, item: any) {
    if (ctlValue.toString().includes(',')) {
      let value = ctlValue.toString().toLowerCase().trim().split(',');
      return value.some((char: string) =>
        item.toString().toLowerCase().includes(char)
      );
    } else {
      return item
        .toString()
        .toLowerCase()
        .includes(ctlValue.toString().toLowerCase().trim());
    }
  }
  changestructureElement_Filter() {
    debugger;
    if (this.searchStructure.length > 0) {
      let temp_list: any;
      let final_list: wbsPosting[] = [];
      this.searchStructure.forEach((element: any) => {
        temp_list = this.wbspostingarray.filter(
          (item) => item.StructureElement == element
        );
        final_list = final_list.concat(temp_list);
      });
      this.wbspostingarray = final_list;
    }
  }

  /** 
 * Toggle function for SelectAll Button
 * Dated: 14-08-2024
 */

  ToggleSelectAll(pEvent: any) {
    if (pEvent) {
      if (pEvent.target.checked) {
        this.SelectAll_Selected();
      } else {
        this.UnselectAll_Selected();
      }
    }
  }

  SelectAll_Selected() {
    for (let i = 0; i < this.wbspostingarray.length; i++) {
      let lItem = this.wbspostingarray[i];
      lItem.isSelected = true;
    }
  }

  UnselectAll_Selected() {
    for (let i = 0; i < this.wbspostingarray.length; i++) {
      let lItem = this.wbspostingarray[i];
      lItem.isSelected = false;
    }
  }

  UpdateSelection(pFlag: boolean) {
    if(pFlag == false) {
      this.selectAllCheck = false;
    }
  }

  PostingValidation(): any {
    let lSelectedStatus: any = '';
    let lReturn: boolean = true;
    let lErrorMsg: string = '';
    for (let i = 0; i < this.wbspostingarray.length; i++) {
      let lItem = this.wbspostingarray[i];
      if (lItem.isSelected) {
        if (lSelectedStatus == '') {
          lSelectedStatus = lItem.TNTSTATUSID;
        } else if (lSelectedStatus != lItem.TNTSTATUSID) {
          lReturn = false;
          lErrorMsg = 'Warning: Cannot select records of different Statuses.'
          break;
        }
      }
    }

    if (lReturn) {
      if (lSelectedStatus == 3) {
        lReturn = false;
        lErrorMsg = 'Warning: Selected records are already Posted.';
      } else if (lSelectedStatus == 12) {
        lReturn = false;
        lErrorMsg = 'Warning: Selected records are already Released.';
      }
    }

    return { isSuccess: lReturn, ErrorMessage: lErrorMsg };
  }

  UnPostingValidation(){
    let lSelectedStatus: any = '';
    let lReturn: boolean = true;
    let lErrorMsg: string = '';
    for (let i = 0; i < this.wbspostingarray.length; i++) {
      let lItem = this.wbspostingarray[i];
      if (lItem.isSelected) {
        if (lSelectedStatus == '') {
          lSelectedStatus = lItem.TNTSTATUSID;
        } else if (lSelectedStatus != lItem.TNTSTATUSID) {
          lReturn = false;
          lErrorMsg = 'Warning: Cannot select records of different Statuses.'
          break;
        }
      }
    }

    if (lReturn) {
      if (lSelectedStatus == 6 || lSelectedStatus == 11) {
        lReturn = false;
        lErrorMsg = 'Warning: Selected records are not Posted.';
      } else if (lSelectedStatus == 12) {
        lReturn = false;
        lErrorMsg = 'Warning: Selected records are already Released.';
      }
    }

    return { isSuccess: lReturn, ErrorMessage: lErrorMsg };
  }

  ReleaseValidation(){
    let lSelectedStatus: any = '';
    let lReturn: boolean = true;
    let lErrorMsg: string = '';
    for (let i = 0; i < this.wbspostingarray.length; i++) {
      let lItem = this.wbspostingarray[i];
      if (lItem.isSelected) {
        if (lSelectedStatus == '') {
          lSelectedStatus = lItem.TNTSTATUSID;
        } else if (lSelectedStatus != lItem.TNTSTATUSID) {
          lReturn = false;
          lErrorMsg = 'Warning: Cannot select records of different Statuses.'
          break;
        }
      }
    }

    if (lReturn) {
      if (lSelectedStatus == 6 || lSelectedStatus == 11) {
        lReturn = false;
        lErrorMsg = 'Warning: Selected records are not Posted.';
      } else if (lSelectedStatus == 12) {
        lReturn = false;
        lErrorMsg = 'Warning: Selected records are already Released.';
      }
    }

    return { isSuccess: lReturn, ErrorMessage: lErrorMsg };
  }

  RearrangeListOrder(pDataList: any, pWBSElementsId: any) {
    let lDataList = [...pDataList];
    let lIndex = lDataList.findIndex(x => x.INTWBSELEMENTID == pWBSElementsId);
    let lItem = lDataList.splice(lIndex, 1);

    lItem[0].isSelected = true;
    lDataList.unshift(lItem[0]);

    this.pageSize = 0;
    this.currentPage = 1;

    return lDataList;
  }

}
