import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UpdateParameterSet_BPC } from 'src/app/Model/UpdateParameterSet_BPC';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { BorePileService } from '../Services/BPC/bore-pile.service';
import { DrainParameterSetService } from '../Services/Drain/drain-parameter-set.service';
import { ParametersetService } from '../Services/Parameterset/parameterset.service';
import { PopupComponent } from './popup/popup.component';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-bore-pile-parameterset',
  templateUrl: './bore-pile-parameterset.component.html',
  styleUrls: ['./bore-pile-parameterset.component.css']
})
export class BorePileParametersetComponent implements OnInit {
  
  userId:any;

  tntParameterSet:any;
  Top_Parameters: any[]=[
    {
      Product_Type:'',
      Lap_Length:'',
      Lap_End:'',
      Adj_Factor:'',
      Cover_to_link:''
      
    }
  ];
  CreateNew:boolean = true;
  ProductTypeList:any[]=[]
  ParameterSetList: any[]=[];
  enableParameterEditIndex: boolean=false;
  selectedCustomer: any;
  SelectedProjectID: any;
  searchResult: any;
  selectparameter: any;
  New_added: boolean=false;


  constructor(
    public commonService: CommonService,
    public parametersetservice: ParametersetService,
    private tosterService: ToastrService,
    private formBuilder: FormBuilder,
    private reloadService: ReloadService,
    private dropdown: CustomerProjectService,
    private changeDetectorRef: ChangeDetectorRef,
    private modalService: NgbModal,
    private parametersetService: ParametersetService,
    private BPCService:BorePileService,
    private loginService: LoginService
    
    ) 
    {
      
    }

  ngOnInit(): void {
    this.commonService.changeTitle('BPC | ODOS');
this.userId = this.loginService.GetUserId()

    this.Load_ProductType();
    this.reloadService.reloadCustomer$.subscribe((data) => {
      this.selectedCustomer = this.dropdown.getCustomerCode()
    });


    this.reloadService.reload$.subscribe((data) => {
      if (true) {
        this.SelectedProjectID = this.dropdown.getDetailingProjectId();
        console.log("Changed  Project id=" + this.SelectedProjectID)
        if (this.SelectedProjectID !== undefined) {
          this.searchResult = true;
          this.selectparameter = null;

          this.LoadParameterSetList(this.SelectedProjectID);
          this.changeDetectorRef.detectChanges();
        }

      }
      // this.GetDeleteGridList(this.activeorderForm.controls['customer'].value, this.ProjectList);
    });
    debugger;

    this.selectedCustomer = this.dropdown.getCustomerCode()
    this.SelectedProjectID = this.dropdown.getDetailingProjectId();



    if (this.SelectedProjectID != undefined && this.SelectedProjectID != 0) {
      this.LoadParameterSetList(this.SelectedProjectID);
    }

  }

  onChangeParameterList() {
    debugger;
    this.enableParameterEditIndex = false;
    let item = this.ParameterSetList.find(x => x.tntParamSetNumber === this.tntParameterSet);
    console.log("Item ", item)
    this.Top_Parameters[0].Lap_Length = item.intlaplength
    this.Top_Parameters[0].Lap_End= item.intendlength
    this.Top_Parameters[0].Adj_Factor = item.intadjfactor
    this.Top_Parameters[0].Cover_to_link = item.intcovertolink
    this.Top_Parameters[0].Lap_Length = item.intlaplength
    this.Top_Parameters[0].Product_Type = item.sitProductTypel2Id
    





  }
  openPopup() {
    const modalRef = this.modalService.open(PopupComponent);
    modalRef.componentInstance.title = 'My Popup Title';
    modalRef.componentInstance.content = 'This is the content of my popup.';

    modalRef.result.then(
      (result) => {
        this.New_added=true
        this.LoadParameterSetList(this.SelectedProjectID);
        // Handle the returned data here
      },
      (reason) => {
        console.log(`Modal dismissed with reason: ${reason}`);
      }
    );

  }     
  AddNewParameter() {
   
    if (this.selectedCustomer != undefined && this.SelectedProjectID != undefined) {

      this.openPopup();
    }
    else{
      this.tosterService.warning("Please Select Customer and Project");
    }
  }

  LoadParameterSetList(projectId: any) {
    debugger;

    // if (this.selectedType == 'MSH') {  //MESH
    this.BPCService.GetParameterSetLis_BorePile(projectId).subscribe({
      next: (response) => {
        console.log(response);
        debugger;
        this.ParameterSetList = response;
        console.log("ParameterSetList", this.ParameterSetList)

      },
      error: (e) => {
      },
      complete: () => {
          if(this.New_added)
          {
            this.tntParameterSet = this.ParameterSetList[this.ParameterSetList.length-1].tntParamSetNumber;
            this.onChangeParameterList();
          }
      },
    });


    //}


  }
  Load_ProductType()
  {
    this.BPCService.GetProductType_BorePile()
        .subscribe({
          next: (response) => {
            debugger;
            this.ProductTypeList = response;
            console.log("Product type",this.ProductTypeList)
          },
          error: (e) => {

          },
          complete: () => {

          },
        });
  }

  Update_Parameter(item:any)
  {
    debugger;

    if(this.ParameterSetList.length>0)
    {
      const obj:UpdateParameterSet_BPC={
        ProjectId:this.SelectedProjectID,
        ParameterSetId: this.tntParameterSet,
        TransportModeId: 0,
        LapLength: item.Lap_Length,
        EndLength: item.Lap_End,
        AdjFactor: item.Adj_Factor,
        CoverToLink: item.Cover_to_link,
        ProductTypeL2Id: item.Product_Type,
        UserId: this.userId,
        Description: ''
      }

      this.BPCService.UpdateParameterSet_BorePile(obj)
      .subscribe({
        next: (response) => {
          debugger;
     
        },
        error: (e) => {

        },
        complete: () => {
          this.LoadParameterSetList(this.SelectedProjectID);
this.tosterService.success("ParameterSet Updated Successfully")
        },
      });
    }
  }

  
}
