import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { WbsService } from '../wbs.service';
import { i, number } from 'mathjs';
import { EsmCABPosting } from 'src/app/Model/esm-cabposting';
import { GroupMarkIdCAB } from 'src/app/Model/group-mark-id-cab';


@Component({
  selector: 'app-copy-bbs',
  templateUrl: './copy-bbs.component.html',
  styleUrls: ['./copy-bbs.component.css']
})
export class CopyBBSComponent {

  CopypostingForm!: FormGroup;
  loading: boolean = false;

  searchbbs: string = '';
  searchResults: string[] = [];
  BBSList: any = [];

  copybbsarray: EsmCABPosting[] = [];;
  copybbsarrayCount: number = 0;
  objCopyBBS = {
    ProjectID: 0,
    WBSElementID: 0,
    BBSNumber: "",
    wbsStatus: "",
    structureElementType: "",
    SourceBBSNumber: ""
  };

  AccessoryCopyBBS = {
    seIdSource: 0,
    seIdTarget: 0,
    groupMarkId: 0,
    prodmarkName: "",
    accProdMarkName: ""
  };
  isSelected: boolean = false;
  isformsubmit: boolean = false;
  LoadingSor: boolean = true;
  SORList: any = [];


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


    this.CopypostingForm = this.formBuilder.group({
      Sor: new FormControl('', Validators.required),
      Bbs: new FormControl(''),
    });

  }

  ngOnInit() {
    this.commonService.changeTitle('CopyBBS | ODOS');
    //this.LoadSOR();
    this.CopypostingForm.controls['Sor'].reset();

  }

  SorNo: any='';

  LoadSOR(): void {
    debugger;

    if(this.SorNo.length>=4){
      this.wbsService.LoadSOR_CopyBBS(this.SorNo).subscribe({
        next: (response) => {
          debugger;
          this.SORList = response;
          console.log("SORlist", this.SORList);
        },
        error: (e) => {
        },
        complete: () => {
          debugger;
          this.LoadingSor = false;
  
        },
      });

    }

    

  }
  
  //BBS_NO
  enteredtext: any='';
  LoadBBS(): void {
    debugger;
    if (this.copybbsarray.length == 0) {
      return;
    }
    let ProjectId = this.copybbsarray[0].INTPROJECTID;

    if(this.enteredtext.length>=4){
      this.wbsService.LoadBBS_CopyBBS(ProjectId, this.enteredtext).subscribe({
        next: (response) => {
          debugger;
          this.BBSList = response;
          console.log("BBSList", this.BBSList);
        },
        error: (e) => {
        },
        complete: () => {
          debugger;
          //this.LoadingSor = false;
  
        },
      });
      
    }
     
  }
  ChangeBBS(event: any) {

    debugger;
    this.enteredtext = event.value;
    
    if(this.enteredtext.length<4){
      this.BBSList=[];
      return ;
    }
    else{
      this.LoadBBS();
    }
  }


  ChangeSor(event: any) {

    debugger;
    this.SorNo = event.value;

    if(this.SorNo.length<4){
      this.SORList=[];
      return ;

    }
    else{
      this.LoadSOR();
    }
    
  }

  async GetCopyBBSGrid(TrackingNoFrom: any, TrackingNoTo: any) {


    try {
      this.loading = true;
      debugger;

      //this.copybbsarray = [];
      const data = await this.wbsService.GetBBSPostingCABRange(TrackingNoFrom, TrackingNoTo).toPromise();
      this.copybbsarray = data;
      console.log("Grid data", data)
      this.loading = false;
      if (this.copybbsarray.length <= 0) {
        this.copybbsarray = [];
        this.copybbsarrayCount = 0;
        alert("Record not found");
        return;
      }
      else if(this.copybbsarray.length>= 0 && this.copybbsarray[0].WBSSTATUS==="Released"||this.copybbsarray[0].WBSSTATUS==="Cancel"){
        this.toastr.error("Selected WBS is already " + this.copybbsarray[0].WBSSTATUS);
        this.copybbsarray=[];
        return;
      }

      else {
        this.copybbsarrayCount = this.copybbsarray.length;
      }

    }
    catch (err: any) {
      alert(err.error);
    }
  }


   showDetails() {
    debugger

    if (this.CopypostingForm.valid) {

      debugger;
      let TrackingNoFrom = this.CopypostingForm.value.Sor;
      let TrackingNoTo = this.CopypostingForm.value.Sor;
      console.log("TrackingNoFrom", TrackingNoFrom);
      console.log("TrackingNoTo", TrackingNoTo)



       this.GetCopyBBSGrid(TrackingNoFrom, TrackingNoTo)

    }

  }

  copybbsclick() {
    debugger;
    try {

      let selectedValue = this.CopypostingForm.get('Sor')?.value;
      let txtBBSSearch = this.bbstxt;
      if (selectedValue == "" || selectedValue == undefined) {
        this.toastr.error("Enter target Number");
      }

      if (txtBBSSearch == "" || txtBBSSearch == undefined || txtBBSSearch == null) {
        this.toastr.error("Please select a BBS to copy");
      }
      else {

        this.wbsService.CheckBbsSource(txtBBSSearch).subscribe({
          next: (response) => {
            if (response) {
              debugger;
              this.objCopyBBS.BBSNumber = this.copybbsarray[0].BBS_NO;
              //this.objCopyBBS.ProjectID=parseInt(this.copybbsarray[0].PROJ_ID);
              this.objCopyBBS.ProjectID = this.copybbsarray[0].INTPROJECTID;

              this.objCopyBBS.SourceBBSNumber = txtBBSSearch;
              this.objCopyBBS.WBSElementID = this.copybbsarray[0].intWBSElementId;
              this.objCopyBBS.structureElementType = this.copybbsarray[0].STRUC_ELEM;
              this.objCopyBBS.wbsStatus = this.copybbsarray[0].WBSSTATUS;
              this.worker_DoWork(this.objCopyBBS);
              //this.worker_RunWorkerCompleted(Result);

            }
            else {
              this.toastr.error("Selected BBS belongs to Arma plus. Can not copy.");
            }
          },
          error: (e) => {
          },
          complete: () => {


          },
        });

      }

    }
    catch (err: any) {


      alert(err.error);
      this.toastr.error("There is some problem in OES application. Please contact the administrator.")

    }



  }
  bbstxt: any;
  worker_DoWork(obj: any) {
    debugger;

    if (
      obj.ProjectID === 0 ||
      obj.WBSElementID === 0 ||
      obj.BBSNumber === "" ||
      obj.wbsStatus === "" ||
      obj.structureElementType === "" ||
      obj.SourceBBSNumber === "") {
      this.toastr.error("Please select a valid SOR");
    }
    else {

      // var response = await this.checkBbsSource(obj.SourceBBSNumber);
      // if(response==true){

      // }

      // else
      // {
      //   this.toastr.error("Selected BBS belongs to Arma plus. Can not copy.");

      // }

      let seIdSource = 0;
      let wbsTypeId = 0;
      let groupRevNo = 0;
      let groupMarkIdTarget = 0;
      let seIdTarget = 0;
      let rowCount = 0;

      this.wbsService.GetCopyBBSUID(obj.SourceBBSNumber, obj.BBSNumber, obj.WBSElementID, obj.structureElementType, obj.ProjectID).subscribe({
        next: (response) => {
          if (response) {
            debugger;
            seIdSource = parseInt(response[0].SEIDSOURCE.toString());
            wbsTypeId = parseInt(response[0].INTWBSTYPEID.toString());
            groupRevNo = parseInt(response[0].TNTGROUPREVNO.toString());
            groupMarkIdTarget = parseInt(response[0].INTGROUPMARKID.toString());
            seIdTarget = parseInt(response[0].SEIDTARGET.toString());
            rowCount = parseInt(response[0].NOOFROWS.toString());

            if (seIdSource == 0 || wbsTypeId == 0 || groupMarkIdTarget == 0 || seIdTarget == 0 || rowCount == 0) {
              this.toastr.error("Please select a valid SOR");
            }
            else if (rowCount == -2) {
              this.toastr.error("Source BBS has no entries to copy");
            }
            else if (rowCount == -1) {
              this.toastr.error("Target BBS has exsisting entries. Can not copy BBS");
            }
            else {
              this.wbsService.InsertProductMarkCopyBBS(seIdSource, seIdTarget, groupMarkIdTarget).subscribe({
                next: (response) => {
                  debugger;
                  if (response) {
                    if (response.length > 0) {
                      if (rowCount == response.length) {
                        let count = 0;
                        let sourceTranshdrId = 0;
                        for (let i = 0; i < rowCount; i++) {
                          sourceTranshdrId = response[i].INTSHAPETRANSHEADERID;
                          this.wbsService.InsertTransdetailsCopyBBS(sourceTranshdrId, seIdTarget).subscribe({

                            next: (response) => {
                              debugger;
                            },
                            error: (e) => {
                            },
                            complete: () => {
                              sourceTranshdrId = 0;
                              count++;
                            },
                          });

                        }
                        //here
                        this.wbsService.GetAccessoryCopyBBS(seIdTarget).subscribe({
                          next: (response) => {
                            debugger;
                            if (response.length > 0) {
                              let prodmarkName = null;
                              let accProdMarkName = null;

                              for (let i = 0; i < response.length; i++) {
                                prodmarkName = response[i].VCHCABPRODUCTMARKNAME.toString();
                                accProdMarkName = response[i].VCHACCPRODUCTMARKINGNAME.toString();
                                //another call

                                this.AccessoryCopyBBS.accProdMarkName = accProdMarkName;
                                this.AccessoryCopyBBS.groupMarkId = groupMarkIdTarget;
                                this.AccessoryCopyBBS.prodmarkName = prodmarkName;
                                this.AccessoryCopyBBS.seIdSource = seIdSource;
                                this.AccessoryCopyBBS.seIdTarget = seIdTarget;

                                this.wbsService.InsertAccessoryCopyBBS(this.AccessoryCopyBBS).subscribe({
                                  next: (response) => {
                                    debugger;

                                  },
                                  error: (e) => {
                                  },
                                  complete: () => {
                                    prodmarkName = null;
                                    accProdMarkName = null;
                                    count++;
                                  },
                                });


                              }
                            }
                            this.toastr.success("Success");


                          },
                          error: (e) => {
                          },
                          complete: () => {

                          },
                        });
                      }
                      else {
                        this.toastr.error("Data Error");
                      }
                    }
                    else {
                      this.toastr.error("Data Error");
                    }
                  }
                  else {
                    this.toastr.error("Selected BBS belongs to Arma plus. Can not copy.");
                  }
                },
                error: (e) => {
                },
                complete: () => {


                },
              });

            }
          }
          else {
            // this.toastr.error("Selected BBS belongs to Arma plus. Can not copy.");
          }
        },
        error: (e) => {
        },
        complete: () => {


        },
      });
    }

  }


  worker_RunWorkerCompleted(success: any) {
    try {

      if (success.Contains("Success")) {

        this.toastr.success("BBS Copied successfully.")
      }
      else if (success.Contains("Source")) {

        this.toastr.warning("Source BBS has no entries to copy")

      }
      else if (success.Contains("Target")) {
        this.toastr.warning("Target BBS has exsisting entries. Can not copy BBS")
      }
      else if (success.Contains("Arma plus")) {
        this.toastr.warning("Selected BBS belongs to Arma plus. Can not copy.")
      }
      else if (success.Contains("Data Error")) {

        this.toastr.warning("Source data has some error. Please connect with administrator.")
      }
      else {

        this.toastr.warning("Some problem while copy. Please contact administrator.")

      }

    }
    catch (err: any) {
      alert(err.error);
    }
  }




  Reset() {

    this.CopypostingForm.reset();
  }



  async checkBbsSource(SourceBBSNumber: any): Promise<any> {
    try {

      var a = this.wbsService.CheckBbsSource(SourceBBSNumber).toPromise();
      return a;
    }
    catch (error) {
      return error;
    }
  }

  async GetGroupMarkID_CopyBBS(index:any): Promise<any> {

    try {

      debugger;

      let ProjectID = this.copybbsarray[index].INTPROJECTID;
      let WBSElementID = this.copybbsarray[index].intWBSElementId;
      let structureElementType = this.copybbsarray[index].STRUC_ELEM;
      let BBSNumber = this.copybbsarray[index].BBS_NO;
      let userName="";
      const obj: GroupMarkIdCAB = {
        intProjectId: ProjectID,
        intWBSElementId: WBSElementID,
        vchStructureElementName: structureElementType,
        BBS_NO: BBSNumber,
        intUserId: 1,
        Username: ''
      }
      var result = await this.wbsService.GetGroupMarkID_CopyBBS(obj).toPromise();
      return result;
    }
    catch (error) {
      return error;
    }
  }

  // async GetCopyBBSGrid(TrackingNoFrom: any, TrackingNoTo: any): Promise<any> {



  //   try {

  //     var a = await this.wbsService.GetBBSPostingCABRange(TrackingNoFrom, TrackingNoTo).toPromise();
  //     return a;
  //   }
  //   catch (error) {
  //     return error;
  //   }



  // }

  // async showDetails() {
  //   debugger

  //   if (this.CopypostingForm.valid) {

  //     debugger;
  //     let TrackingNoFrom = this.CopypostingForm.value.Sor;
  //     let TrackingNoTo = this.CopypostingForm.value.Sor;
  //     console.log("TrackingNoFrom", TrackingNoFrom);
  //     console.log("TrackingNoTo", TrackingNoTo)


  //     const response = await this.GetCopyBBSGrid(TrackingNoFrom, TrackingNoTo);
  //     this.copybbsarray = response;
  //     console.log("Grid data", response)
  //     this.loading = false;
  //     if (this.copybbsarray.length <= 0) {
  //       this.copybbsarray = [];
  //       this.copybbsarrayCount = 0;
  //       alert("Record not found");
  //       return;
  //     }
  //     else if(this.copybbsarray.length>= 0 && this.copybbsarray[0].WBSSTATUS==="Released"||this.copybbsarray[0].WBSSTATUS==="Cancel"){
  //       this.toastr.error("Selected WBS is already " + this.copybbsarray[0].WBSSTATUS);
  //       this.copybbsarray=[];
  //       return;
  //     }
  //     else if (this.copybbsarray[0].INTPROJECTID == 0 || this.copybbsarray[0].intWBSElementId == 0 || this.copybbsarray[0].BBS_NO == "" || this.copybbsarray[0].WBSSTATUS == "" || this.copybbsarray[0].STRUC_ELEM == "") {
  //       this.toastr.warning("Please select a valid SOR to proceed")
  //     }
      
  //     else{
        
  //       this.copybbsarrayCount = this.copybbsarray.length;
        
  //       // let groupMarkId = await this.GetGroupMarkID_CopyBBS(i);
     
  //       // if (groupMarkId>0){
  //       //   this.LoadBBS();

  //       // }

  //       // else{
  //       //   this.toastr.warning("There is no group mark available")
  //       // }

  //     }

  //   }
  //   else {
  //     this.toastr.warning("Please enter a valid SOR")
  //   }

  // }


}



