import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { wbsPosting } from 'src/app/Model/wbsPosting';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { WbsService } from '../wbs.service';
import { EsmCABPosting } from 'src/app/Model/esm-cabposting';
import { BBSPostingCABGM } from 'src/app/Model/bbsposting-cabgm';
import { EsmBBSCABPost } from 'src/app/Model/esm-bbscabpost';
import { e, i, string } from 'mathjs';
import { GroupMarkIdCAB } from 'src/app/Model/group-mark-id-cab';
import { BBSReleaseCAB } from 'src/app/Model/bbsrelease-cab';

@Component({
  selector: 'app-esmcabbbsposting',
  templateUrl: './esmcabbbsposting.component.html',
  styleUrls: ['./esmcabbbsposting.component.css']
})
export class ESMCABBBSPostingComponent {

  ESMCabBBSpostingForm!: FormGroup;
  loading: boolean = false;
  toggleFilters = false;
  searchText: any = '';
  searchResult = true;

  searchSOR: any;
  searchReqDelivery: any;
  searchWBS1: any;
  searchWBS2: any;
  searchWBS3: any;
  searchBBS: any;
  searchsor: any;
  searchStructure: any;
  searchProductType: any;
  searchTotWt: any;
  searchTotQty: any;
  searchStatus: any;

  masterSelected = false;


  backupData: any;
  esmcabpostingarray: EsmCABPosting[] = [];
  esmcabpostingarray_backup: any;
  Groupmarkinglist: BBSPostingCABGM[] = [];
  esmcabpostingarrayCount: number = 0;
  SORList: any = [];

  disablepost: boolean = false;
  disableunpost: boolean = false;
  disablerelease: boolean = false;
  disablecreate: boolean = false;
  disablecancel: boolean = false;
  temparray: any[] = [];

  TrackingId: any;
  currentPage = 1;
  pageSize = 0;
  maxSize: number = 10;
  itemsPerPage: number = 10;

  enableEditIndex: any = null; selectedCustomer: any;
  FilterdList: any;
  isEditing: boolean = false;
  postingreport: any;
  transferObject: any={};

  strQueryString: string | undefined;

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
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {



    this.ESMCabBBSpostingForm = this.formBuilder.group({
      sor: new FormControl('', Validators.required),

    });

  }

  ngOnInit() {
    this.commonService.changeTitle('ESMCAB | ODOS');
    let getsortransfer=localStorage.getItem("SORTRANSFER");
    localStorage.setItem("SORTRANSFER","");
    if(getsortransfer!="") 
    {
      this.ESMCabBBSpostingForm.get('sor')?.setValue(getsortransfer);
      this.changeSOR("");
      this.showDetails();
    }
    this.GetTrackingNumber();

    this.GetStructElement();
  }


  GetTrackingNumber(): void {
    debugger;
    
    this.wbsService.LoadTrackingNo(this.TrackingId).subscribe({
      next: (response) => {

        this.SORList = response;
        console.log("SORlist", this.SORList);
      },
      error: (e) => {
      },
      complete: () => {
      },
    });
  }


  searchCABPostListData() {
    // this.GetCabProducuctCodeList();
    //;
    this.esmcabpostingarray = JSON.parse(JSON.stringify(this.FilterdList));
    if (this.searchSOR != undefined && this.searchSOR != "") {
      this.esmcabpostingarray = this.esmcabpostingarray.filter(item =>
        item.ORD_REQ_NO?.toLowerCase().includes(this.searchSOR.trim().toLowerCase())
      );
    }
    if (this.searchBBS != undefined && this.searchBBS != "") {
      this.esmcabpostingarray = this.esmcabpostingarray.filter(item =>
        item.BBS_NO?.toLowerCase().includes(this.searchBBS.trim().toLowerCase())
      );
    }
    if (this.searchStructure != undefined && this.searchStructure != "") {
      this.esmcabpostingarray = this.esmcabpostingarray.filter(item =>
        item.STRUC_ELEM?.toLowerCase().includes(this.searchStructure.trim().toLowerCase())
      );
    }
    if (this.searchProductType != undefined && this.searchsor != "") {
      this.esmcabpostingarray = this.esmcabpostingarray.filter(item =>
        item.PROD_TYPE?.toLowerCase().includes(this.searchsor.trim().toLowerCase())
      );
    }

    if (this.searchWBS1 != undefined && this.searchWBS1 != "") {
      this.esmcabpostingarray = this.esmcabpostingarray.filter(item =>
        item.WBS1?.toLowerCase().includes(this.searchWBS1.trim().toLowerCase())
      );
    }

    if (this.searchWBS2 != undefined && this.searchWBS2 != "") {
      this.esmcabpostingarray = this.esmcabpostingarray.filter(item =>
        item.WBS2?.toLowerCase().includes(this.searchWBS2.trim().toLowerCase())
      );
    }

    if (this.searchWBS3 != undefined && this.searchWBS3 != "") {
      this.esmcabpostingarray = this.esmcabpostingarray.filter(item =>
        item.WBS3?.toLowerCase().includes(this.searchWBS3.trim().toLowerCase())
      );
    }

    if (this.searchTotWt != undefined && this.searchTotWt != "") {
      this.esmcabpostingarray = this.esmcabpostingarray.filter(item =>
        item.TotalWeight?.toString().toLowerCase().includes(this.searchTotWt.trim().toLowerCase())
      );
    }

    if (this.searchTotQty != undefined && this.searchTotQty != "") {
      this.esmcabpostingarray = this.esmcabpostingarray.filter(item =>
        item.TotalQty?.toString().toLowerCase().includes(this.searchTotQty.trim().toLowerCase())
      );
    }



    if (this.searchStatus != undefined && this.searchStatus != "") {
      this.esmcabpostingarray = this.esmcabpostingarray.filter(item =>
        item.WBSSTATUS?.toLowerCase().includes(this.searchStatus.trim().toLowerCase())
      );
    }

    if (this.searchReqDelivery != undefined && this.searchReqDelivery != "") {
      this.esmcabpostingarray = this.esmcabpostingarray.filter(item =>
        item.ReqDate?.toLowerCase().includes(this.searchReqDelivery.trim().toLowerCase())
      );
    }




  }

  giveRowcolor(item: any) {
    var color = '#ffffff'
    if (item.WBSSTATUS == "Created") {
      color='#ffffff';
    }
    if (item.WBSSTATUS == "Confirmed") {
      color='#e6e6fa';
    }
    else if (item.WBSSTATUS == "Cancel") {
      color = '#808080';
    }
    else if (item.WBSSTATUS == "Posted") {
      
      color = '#90ee90';
      
    }
    else if (item.WBSSTATUS == "Released") {
      
      color = '#ffb6c1';
      
    }
    return color
  }
  checkUncheckAll() {
    let rec_selected = 0
    for (var i = 0; i < this.esmcabpostingarray.length; i++) {
      if (this.esmcabpostingarray[i].isSelected == true) {
        rec_selected += 1;
      }
    }
    if (rec_selected == 0) {
      return false;
    }
    return true;

  }
  multipleSelect(item: any) {

    let isRecordSelected = this.checkUncheckAll()
    this.disablepost = false;
    this.disableunpost = false;
    this.disablerelease = false;

    if (isRecordSelected == true) {
      if (item.isSelected == true) {
        for (let i = 0; i < this.esmcabpostingarray.length; i++) {
          this.isAllSelected(item)
          if (this.esmcabpostingarray[i].WBSSTATUS != item.WBSSTATUS) {
            this.esmcabpostingarray[i].ReadOnly = true
          }
        }
      }
    } else {
      for (let i = 0; i < this.esmcabpostingarray.length; i++) {
        this.esmcabpostingarray[i].ReadOnly = false

      }
    }
  }

  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
    this.enableEditIndex = null;

    //this.LoadShapeGroupList();
  }

  OnPageSizeChange(pageSize: number) {
    this.pageSize = 0;
    this.currentPage = 1;
    this.enableEditIndex = null;


  }

  SelectedProjectID: any;
  selectedProductTypeID: any;

  isAllSelected(item: any) {
    console.log(item);

    if (item.isSelected == false) {
      this.disablepost = false;
      this.disableunpost = false;
      this.disablerelease = false;
      return;
    }

    if (item.WBSSTATUS == "Confirmed") {
      this.disablecreate = false;
      this.disablepost = false;
      this.disableunpost = true;
      this.disablerelease = true;

    }
    if (item.WBSSTATUS == "Create") {
      this.disablecreate = false;
      this.disablepost = false;
      this.disableunpost = true;
      this.disablerelease = true;
      this.disablecancel = true;

    }
    else if (item.WBSSTATUS == "Ready") {
      this.disablepost = false;
      this.disableunpost = false;
      this.disablerelease = false;

    } else if (item.WBSSTATUS == "Posted") {
      this.disablecreate = true;
      this.disableunpost = false;
      this.disablepost = true;
      this.disablerelease = false;

    } else if (item.WBSSTATUS == "Released") {
      this.disablepost = true;
      this.disableunpost = true;
      this.disablerelease = true;
      this.disablecancel = false;
      this.disablecreate=true
    }

    else if (item.TNTSTATUSID == "Cancel") {
      this.disablepost = true;
      this.disableunpost = false;
      this.disablerelease = true;
      this.disablecreate = true;

    }


    this.masterSelected = this.esmcabpostingarray.every(function (item: any) {
      return item.isSelected == true;
    })
    // let temparray = this.wbspostingarray.filter((x: { isSelected: boolean; }) => x.isSelected == true);
    let temparray = [{}]
    console.log(temparray)

  }

  showDetails() {

    if (this.ESMCabBBSpostingForm.valid) {

      debugger;
      let TrackingNoFrom = this.ESMCabBBSpostingForm.value.sor;
      let TrackingNoTo = this.ESMCabBBSpostingForm.value.sor;

      //let ProjectId = this.projectList.find((x: any) => x.ProjectId === this.trackDetailsForm.value.project).ProjectId;

      this.GetESMCABBBSGrid(TrackingNoFrom, TrackingNoTo)

    }
    // else {
    //   this.toastr.warning("Select Contract")
    // }

  }


  async Posting() {

    debugger;
    let checkselectedcount = 0
    for (var i = 0; i < this.esmcabpostingarray.length; i++) {
      if (this.esmcabpostingarray[i]['isSelected'] == true) {
        checkselectedcount = checkselectedcount + 1;
        console.log(checkselectedcount);
      }
    }

    if (checkselectedcount == 0) {
      alert("You haven't selected any SOR.");
    }
    else {

      for (var i = 0; i < this.esmcabpostingarray.length; i++) {
        if (this.esmcabpostingarray[i]['isSelected'] == true) {

          let wbsStatus = this.esmcabpostingarray[i].WBSSTATUS;

          if (wbsStatus == "Posted") {

            this.toastr.warning("The WBS POSTED already.")
            break

          }
          else if (wbsStatus == "Released") {
            this.toastr.warning("The WBS is RELEASED already.")

          }
          else if (wbsStatus == "Cancel") {

            this.toastr.warning("The WBS is CANCELED already.")
          }

          else {

            let ProjectId = this.esmcabpostingarray[i].INTPROJECTID;
            let WBSElementsId = this.esmcabpostingarray[i].intWBSElementId;
            let BBSNo = this.esmcabpostingarray[i].BBS_NO;
            let Trackingno = this.esmcabpostingarray[i].ORD_REQ_NO;


            var response = await this.getBBSPostingCABGM_Get(ProjectId, BBSNo);

            this.Groupmarkinglist = response;


            if (this.Groupmarkinglist.length > 0) {

              const postBBS: EsmBBSCABPost = {
                IntProjectID: ProjectId,
                IntWBSElementID: WBSElementsId,
                IntGroupMarkID: this.Groupmarkinglist[i].intGroupMarkId,
                BBS_NO: BBSNo,
                UserID:1,
                Username: ''
              }
              this.loading = true
              this.wbsService.PostBBSPostingCAB(postBBS).subscribe({
                next: (response) => {
                  debugger
                  console.log("Posted response", response)
                  if (response >= 1)
                    this.toastr.success("The selected WBS are posted successfully.");
                  else
                    this.toastr.error("Error in posting the selected WBS.");
                },
                error: (e) => {
                  console.log("error", e);
                  this.toastr.error(e.error);

                },
                complete: () => {

                  this.loading = false;
                  let TrackingNoFrom = this.ESMCabBBSpostingForm.value.sor;
                  let TrackingNoTo = this.ESMCabBBSpostingForm.value.sor;
                  this.GetESMCABBBSGrid(TrackingNoFrom, TrackingNoTo);


                },
              });


            }
            else {
              this.toastr.error('Record cannot be posted without a Groupmark')
              this.loading = false



            }

            let TrackingNoFrom = this.ESMCabBBSpostingForm.value.sor;
            let TrackingNoTo = this.ESMCabBBSpostingForm.value.sor;
            this.GetESMCABBBSGrid(TrackingNoFrom, TrackingNoTo);
          }
        }
      }

      let TrackingNoFrom = this.ESMCabBBSpostingForm.value.sor;
      let TrackingNoTo = this.ESMCabBBSpostingForm.value.sor;
      await this.GetESMCABBBSGrid(TrackingNoFrom, TrackingNoTo);
    }

  }
  async Unposting() {

    debugger
    let checkselectedcount = 0
    for (var i = 0; i < this.esmcabpostingarray.length; i++) {
      if (this.esmcabpostingarray[i]['isSelected'] == true) {
        checkselectedcount = checkselectedcount + 1;
        console.log(checkselectedcount);
      }
    }

    if (checkselectedcount == 0) {
      alert("You haven't selected any WBS.");
    }
    else {
      this.loading = true
      //let checkselectedcount = 0
      for (var i = 0; i < this.esmcabpostingarray.length; i++) {
        if (this.esmcabpostingarray[i]['isSelected'] == true) {
          //checkselectedcount = checkselectedcount + 1;
          //console.log(checkselectedcount);

          let wbsStatus = this.esmcabpostingarray[i].WBSSTATUS;

          if (wbsStatus != "Posted" && wbsStatus != "Released" && wbsStatus != "Cancel") {

            this.toastr.warning("The WBS is not yet Posted !")
           
            this.loading=false

          }
          else {

            let IntProjectID = this.esmcabpostingarray[i].INTPROJECTID;
            let IntWBSElementID = this.esmcabpostingarray[i].intWBSElementId;
            let BBSNo = this.esmcabpostingarray[i].BBS_NO;

            var response = await this.getBBSPostingCABGM_Get(IntProjectID, BBSNo);

            this.Groupmarkinglist = response;

            if (this.Groupmarkinglist.length > 0) {
              if (this.Groupmarkinglist.length > 1) {
                this.toastr.warning("There are multiple groupmarking exist for " + BBSNo + ".");
                //alert('This transaction has more than one group marking list.\nPlease contact your administrator
              }

            }

            else {
              this.toastr.warning("There is no groupmarking exists for " + BBSNo + ".");

            }



            this.loading = true
            let GroupMarkId = this.Groupmarkinglist[i].intGroupMarkId;
            this.wbsService.UnpostPostBBSPostingCAB(IntProjectID, IntWBSElementID, GroupMarkId, BBSNo).subscribe({
              next: (response) => {
                debugger
                console.log("Result Unpost", response)
                if (response >= 1)
                  this.toastr.success("The selected WBS are unposted Successfully.");


              },
              error: (e) => {
                console.log("error", e);
                this.toastr.error("Error in posting the selected WBS.");
                this.loading = false;
              },
              complete: () => {

                this.loading = false;
                let TrackingNoFrom = this.ESMCabBBSpostingForm.value.sor;
                let TrackingNoTo = this.ESMCabBBSpostingForm.value.sor;
                this.GetESMCABBBSGrid(TrackingNoFrom, TrackingNoTo);
              },
            });


          }
        }
      }
    }


  }

  async btnCreateEdit() {

    let checkselectedcount = 0
    for (var i = 0; i < this.esmcabpostingarray.length; i++) {
      if (this.esmcabpostingarray[i]['isSelected'] == true) {
        checkselectedcount = checkselectedcount + 1;
        console.log(checkselectedcount);
      }
    }
    if (checkselectedcount == 0) {
      alert("Please select the WBS to proceed.");

    }

    else {

      for (var i = 0; i < this.esmcabpostingarray.length; i++) {
        if (this.esmcabpostingarray[i]['isSelected'] == true) {

          let intProjectID = this.esmcabpostingarray[i].INTPROJECTID;
          let intWBSElementID = this.esmcabpostingarray[i].intWBSElementId;
          let vchBBSNumber = this.esmcabpostingarray[i].BBS_NO;
          let wbsStatus = this.esmcabpostingarray[i].WBSSTATUS;
          let vchStructureElementType = this.esmcabpostingarray[i].STRUC_ELEM;


          if (wbsStatus == "RELEASED" || wbsStatus == "CANCEL") {

            this.toastr.warning("The WBS is released / cancelled already.")

          }
          else {
            //let GroupMarkId = 0;
            this.loading = true;
            var response = await this.GroupMarkIdCAB_Get(i);

            this.Groupmarkinglist = response;

            if (this.Groupmarkinglist.length > 0) {

              this.SendParameters(this.esmcabpostingarray[0],this.Groupmarkinglist[0].intGroupMarkId,this.Groupmarkinglist[0].intSEDetailingId);
              console.log("GroupId" + this.Groupmarkinglist[i].intGroupMarkId + "SEDetailID" + this.Groupmarkinglist[i].intSEDetailingId);

              //add navigation for ESMCabDetailing
              this.router.navigate(['/wbs/esmcabbbsposting/esmcab']);

            }
            else {
              this.toastr.warning("There is no groupmarking exists");
            }
            this.loading = false;
          }

        }


      }




    }


  }

  async btnViewReport() {
    debugger

    let checkselectedcount = 0
    for (var i = 0; i < this.esmcabpostingarray.length; i++) {
      if (this.esmcabpostingarray[i]['isSelected'] == true) {
        checkselectedcount = checkselectedcount + 1;
        console.log(checkselectedcount);
      }
    }
    if (checkselectedcount == 0) {
      alert("Please select the WBS to proceed.");

    }

    else {


      for (var i = 0; i < this.esmcabpostingarray.length; i++) {
        if (this.esmcabpostingarray[i]['isSelected'] == true) {

          let intProjectID = this.esmcabpostingarray[i].INTPROJECTID;
          let intWBSElementID = this.esmcabpostingarray[i].intWBSElementId;
          let vchBBSNumber = this.esmcabpostingarray[i].BBS_NO;
          let wbsStatus = this.esmcabpostingarray[i].WBSSTATUS;
          let vchStructureElementType = this.esmcabpostingarray[i].STRUC_ELEM;


          if (wbsStatus == "Cancel") {

            this.toastr.warning("The WBS is cancelled.")

          }
          else {
            let GroupMarkId = 0;
            this.loading = true;
            var response = await this.GroupMarkIdCAB_Get(i);

            GroupMarkId = response[0].intGroupMarkId;

            if (GroupMarkId > 0) {
              console.log("GroupId" + GroupMarkId);

              //let cabgroupmarkingreport="http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_Reports%2fCABGroupMarkingReport&rs:Command=Render&";
              let cabgroupmarkingreport="http://nsprddb10:8080/ReportServer/Pages/ReportViewer.aspx?%2fODOS_Reports%2fCABGroupMarkingReport_Latest&rs:Command=Render&";

              this.strQueryString = cabgroupmarkingreport + "intGroupMarkingId=" + GroupMarkId + "&sitProductTypeId="+4 +"&rc:Parameters=false ";
              

              console.log(this.strQueryString);
              window.open(this.strQueryString, "_blank");
            }
           
      
            else {
              this.toastr.warning("There is no groupmarking exists");
             
            }
            this.loading = false;

          }

        }


      }




    }


  }

  btnRelease() {
    debugger

    let checkselectedcount = 0
    for (var i = 0; i < this.esmcabpostingarray.length; i++) {
      if (this.esmcabpostingarray[i]['isSelected'] == true) {
        checkselectedcount = checkselectedcount + 1;
        console.log(checkselectedcount);
      }
    }
    if (checkselectedcount == 0) {
      alert("You haven't selected any WBS.");

    } else {

      for (var i = 0; i < this.esmcabpostingarray.length; i++) {
        if (this.esmcabpostingarray[i]['isSelected'] == true) {

          let wbsStatus = this.esmcabpostingarray[i].WBSSTATUS;

          if (wbsStatus != "Posted" && wbsStatus != "Released" && wbsStatus != "Cancel") {

            this.toastr.warning("The WBS is not yet Posted !")
            break

          }
          else if (wbsStatus == "Released") {

            this.toastr.warning("The WBS is Released already!")
            break
          }
          else if (wbsStatus == "Cancel") {

            this.toastr.warning("The WBS is cancelled already!")
            break
          }
          else {

            let ProjectId = this.esmcabpostingarray[i].INTPROJECTID;
            let WBSElementsId = this.esmcabpostingarray[i].intWBSElementId;
            let BBSNo = this.esmcabpostingarray[i].BBS_NO;
            let Trackingno = this.esmcabpostingarray[i].ORD_REQ_NO;

            if (this.esmcabpostingarray[i].ORD_REQ_NO) {

              const WBSobj: BBSReleaseCAB = {
                ORD_REQ_NO: Trackingno,
                intProjectId: ProjectId,
                intWBSElementId: WBSElementsId,
                BBS_NO: BBSNo,
                chrBBSStatus: "R",
                UserID: 1,
                Username: ''
              }
              if (WBSobj.UserID <= 0) {
                this.toastr.warning("You are not authorized to perform this operation");
              }
              else {
                this.loading = true

                this.wbsService.BBSReleaseCAB(WBSobj).subscribe({
                  next: (response) => {
                    debugger
                    console.log("release response", response)
                    if (response >= 1)
                      this.toastr.success("The selected WBS are Relesed successfully.");
                    else
                      this.toastr.error("Error in release the selected WBS.");
                  },
                  error: (e) => {
                    console.log("error", e);
                    this.toastr.error(e.error);

                  },
                  complete: () => {

                    this.loading = false;
                    let TrackingNoFrom = this.ESMCabBBSpostingForm.value.sor;
                    let TrackingNoTo = this.ESMCabBBSpostingForm.value.sor;
                    this.GetESMCABBBSGrid(TrackingNoFrom, TrackingNoTo);


                  },
                });

              }

            }
            else {
              //this.toastr.error('Record cannot be released without generating Order Rquest Number');
            }
          }
        }


      }
    }


  }

  btnCancel() {

    debugger
    let checkselectedcount = 0
    for (var i = 0; i < this.esmcabpostingarray.length; i++) {
      if (this.esmcabpostingarray[i]['isSelected'] == true) {
        checkselectedcount = checkselectedcount + 1;
        console.log(checkselectedcount);
      }
    }
    if (checkselectedcount == 0) {
      alert("You haven't selected any WBS.");

    } else {

      for (var i = 0; i < this.esmcabpostingarray.length; i++) {
        if (this.esmcabpostingarray[i]['isSelected'] == true) {

          let wbsStatus = this.esmcabpostingarray[i].WBSSTATUS;

          if (wbsStatus != "Posted" && wbsStatus != "Released" && wbsStatus != "Cancel") {

            this.toastr.warning("The WBS is not yet Posted !")
            break

          }
          else if (wbsStatus == "Cancel") {

            this.toastr.warning("The WBS is cancelled already!")
            break
          }
          else {

            let ProjectId = this.esmcabpostingarray[i].INTPROJECTID;
            let WBSElementsId = this.esmcabpostingarray[i].intWBSElementId;
            let BBSNo = this.esmcabpostingarray[i].BBS_NO;
            let Trackingno = this.esmcabpostingarray[i].ORD_REQ_NO;

            if (this.esmcabpostingarray[i].ORD_REQ_NO) {

              const WBSobj: BBSReleaseCAB = {
                ORD_REQ_NO: Trackingno,
                intProjectId: ProjectId,
                intWBSElementId: WBSElementsId,
                BBS_NO: BBSNo,
                chrBBSStatus: "C",
                UserID: 1,
                Username: ''
              }
              if (WBSobj.UserID <= 0) {
                this.toastr.warning("You are not authorized to perform this operation");
              }

              else {
                this.loading = true

                this.wbsService.BBSReleaseCAB(WBSobj).subscribe({
                  next: (response) => {
                    debugger
                    console.log("Released response", response)
                    if (response >= 1)
                      this.toastr.success("The selected WBS are Cancelled successfully.");
                    else
                      this.toastr.error("Error in release the selected WBS.");
                  },
                  error: (e) => {
                    console.log("error", e);
                    this.toastr.error(e.error);

                  },
                  complete: () => {

                    this.loading = false;
                    let TrackingNoFrom = this.ESMCabBBSpostingForm.value.sor;
                    let TrackingNoTo = this.ESMCabBBSpostingForm.value.sor;
                    this.GetESMCABBBSGrid(TrackingNoFrom, TrackingNoTo);


                  },
                });

              }

            }
            else {
              //this.toastr.error('Record cannot be released without generating Order Rquest Number');
            }
          }

        }

      }
    }


  }

  async GetESMCABBBSGrid(TrackingNoFrom: any, TrackingNoTo: any) {


    try {
      this.loading = true;
      debugger;

      //this.esmcabpostingarray = [];
      const data = await this.wbsService.ESM_BBSPostingCAB_Get_Range(TrackingNoFrom, TrackingNoTo).toPromise();
      this.esmcabpostingarray = data;
      console.log("Grid data", data)
      console.log("esmcabpostingarray",this.esmcabpostingarray);
      this.loading = false;
      if (this.esmcabpostingarray.length <= 0) {
        this.esmcabpostingarray = [];
        this.esmcabpostingarrayCount = 0;
        alert("Record not found");
        return;
      }

      this.esmcabpostingarrayCount = this.esmcabpostingarray.length;

    }
    catch (err: any) {
      alert(err.error);
    }
  }


  selectedValue:any;
  changeSOR(event: any) {
    debugger;
    if(event){
       this.selectedValue=this.ESMCabBBSpostingForm.get('sor')?.value;
     localStorage.setItem("SORTRANSFER",this.selectedValue);
    this.GetTrackingNumber()

    }  
  }


  async getBBSPostingCABGM_Get(ProjectId: any, BBSNo: any): Promise<any> {
    try {

      var a = await this.wbsService.BBSPostingCABGM_Get(ProjectId, BBSNo).toPromise();
      return a;
    }
    catch (error) {
      return error;
    }
  }

  async GroupMarkIdCAB_Get(index:any): Promise<any> {

    try {

      debugger;

      let ProjectId = this.esmcabpostingarray[index].INTPROJECTID;
      let WBSElementsId = this.esmcabpostingarray[index].intWBSElementId;
      let structureElement = this.esmcabpostingarray[index].STRUC_ELEM;
      let BBSNo = this.esmcabpostingarray[index].BBS_NO;

      const obj: GroupMarkIdCAB = {
        intProjectId: ProjectId,
        intWBSElementId: WBSElementsId,
        vchStructureElementName: structureElement,
        BBS_NO: BBSNo,
        intUserId: 1,
        Username: ''
      }
      var result = await this.wbsService.GroupMarkIdCAB_Get(obj).toPromise();
      return result;

    }
    catch (error) {
      return error;
    }
  }



  // async  BBSPostingCAB_Post(ProjectId: any, WBSElementsId: any, GroupMarkId: any,BBSNO:any,UserId:any):Promise<any>
  // {
  //   try {
  //     var a  = await  this.wbsService.PostBBSPostingCAB(ProjectId,WBSElementsId,GroupMarkId,BBSNO,UserId).toPromise();      

  //     return a;
  //   } 
  //   catch (error) {
  //     return error;
  //   }
  // }
  SendParameters(item: any,groupmarkid:any, seDetailingID:any) {
    debugger;
    let INTSTRUCTUREELEMENTTYPEID=0;
    console.log(item);

    for(let i=0;i<this.structureList.length;i++) 
    {
      if(this.structureList[i].StructureElementType==item.STRUC_ELEM) 
      {
        INTSTRUCTUREELEMENTTYPEID=this.structureList[i].StructureElementTypeId;
        break;
      }
    }


    let INTSEDETAILINGID = seDetailingID;
    let VCHSTRUCTUREELEMENTTYPE = item.STRUC_ELEM;
    //let INTPROJECTID = item.PROJ_ID; by vk
    let INTPROJECTID = item.INTPROJECTID;
    // let INTPARAMETESET = item.ParameterstructureElementTypeSet;

    // Add this afterwards
    this.transferObject['ProjectId'] = item.INTPROJECTID;
    this.transferObject['CustomerId'] = "0001101170";
    this.transferObject['ProjectName'] = "";
    this.transferObject['CustomerName'] = "";
    this.transferObject['ProjectCode'] = item.PROJ_ID.trim();

    this.transferObject['INTTRANSFERID'] = this.selectedValue;//ADDED BY VW
    this.transferObject['INTSEDETAILINGID'] = INTSEDETAILINGID;
    this.transferObject['VCHSTRUCTUREELEMENTTYPE'] = VCHSTRUCTUREELEMENTTYPE;
    this.transferObject['INTPROJECTID'] = item.INTPROJECTID;
    this.transferObject['INTPARAMETESET'] = "";
    this.transferObject['INTSTRUCTUREELEMENTTYPEID'] = INTSTRUCTUREELEMENTTYPEID;
    this.transferObject['INTGROUPMARKID'] = groupmarkid;

    // /IntGroupMarkId
    // this.transferObject['SeDetailing'] = (this.projectList.find((x: { ProjectId: any; }) => x.ProjectId === this.projectName)).ProjectCode;
    // this.seDetailingID = this.MeshData.INTSEDETAILINGID;
    // this.structElement = this.MeshData.VCHSTRUCTUREELEMENTTYPE;
    // this.projectId = this.MeshData.INTPROJECTID;
    // this.ParameterSetNo = this.MeshData.INTPARAMETESET;
    // this.structureElementId = this.MeshData.INTSTRUCTUREELEMENTTYPEID;
    // this.CustomerCode = this.MeshData.CustomerId;
    // this.ProjectCode = this.MeshData.ProjectCode;

    localStorage.setItem('ESMBBSCabData', JSON.stringify(this.transferObject));






  }

  structureList:any;
  GetStructElement(): void {
    debugger;
    this.wbsService.GetStructElement()
      .subscribe({
        next: (response) => {
          this.structureList = response;
          console.log("this.structureList",this.structureList);
        },
        error: (e) => {
          //console.log(e.error);
        },
        complete: () => {
        },
      });
  }

}
