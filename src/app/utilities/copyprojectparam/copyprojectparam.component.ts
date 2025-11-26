import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProductCodeService } from 'src/app/Masters/Services/ProductCode/product-code.service';
import { ContactListService } from 'src/app/Masters/Services/ProjectContractList/contact-list.service';
import { copyprojectparam } from 'src/app/Model/Copy_projectaram';
import { ParametersetService } from 'src/app/ParameterSet/Services/Parameterset/parameterset.service';
import { CommonService } from 'src/app/SharedServices/CommonService';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { UtilityService } from '../Utility.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-copyprojectparam',
  templateUrl: './copyprojectparam.component.html',
  styleUrls: ['./copyprojectparam.component.css'],
})
export class CopyprojectparamComponent {
  Customerlist: any = [];
  LoadingCustomerName: boolean = true;

  projectList_source: any;
  projectList_destination: any;
  transferObject: any;
  projectName: any;
  customerName: any;
  productcodelist: any;
  structureList: any[] = [];
  Contractlist: any[] = [];
  ProductCodeTypeList: any[] = [];
  Source!: FormGroup;

  Destination!: FormGroup;
  ParameterSetList: any;
  isformsubmit: boolean = false;
  ProjectID_source: any;
  ProjectID_destination: any;
  ParameterSetList_source: any;
  ParameterSetList_destination: any;
  Initial_Value: boolean = false;

  userId: any;

  constructor(
    public router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public commonService: CommonService,
    private tosterService: ToastrService,
    private productcodeService: ProductCodeService,
    private projectcontractlistService: ContactListService,
    private parametersetService: ParametersetService,
    private utilityservice: UtilityService,
    private reloadService: ReloadService,
    private dropdown: CustomerProjectService,
    private loginService: LoginService
  ) {}
  ngOnInit() {
    this.commonService.changeTitle('CopyProjectParam | ODOS');
    this.userId = this.loginService.GetUserId();

    this.Source = this.formBuilder.group({
      customer: new FormControl('', Validators.required),
      project: new FormControl('', Validators.required),
      producttype: new FormControl('', Validators.required),
      structureelement: new FormControl('', Validators.required),
      parameterset: new FormControl(''),
    });

    this.Destination = this.formBuilder.group({
      customer: new FormControl('', Validators.required),
      project: new FormControl('', Validators.required),
      producttype: new FormControl('', Validators.required),
      structureelement: new FormControl('', Validators.required),
      parameterset: new FormControl(null),
    });
    this.GetCustomer();
    this.GetProductTypeList();
    debugger;

    this.reloadService.reloadCustomer$.subscribe((data) => {
      console.log('yes yes yes ');
      debugger;
      this.Source.reset();
      this.Destination.reset();
      this.customerName = this.dropdown.getCustomerCode();
      this.Source.controls['customer'].patchValue(this.customerName);
      this.Destination.controls['customer'].patchValue(this.customerName);
      if (this.customerName !== undefined) {
        this.Initial_Value = true;
        this.changecustomer(this.customerName, 'S');
      }
    });
    this.reloadService.reload$.subscribe((data) => {
      if (true) {
        this.projectName = this.dropdown.getDetailingProjectId();
        debugger;
        console.log('No No No ');
        let projectCOde = this.projectList_source.find(
          (x: { ProjectId: any }) => x.ProjectId === this.projectName
        ).ProjectCode;
        this.Source.controls['project'].patchValue(projectCOde);
        this.changeproject(projectCOde, 'S');
        console.log('Changed  Project id=' + this.projectName);
        if (this.projectName !== undefined) {
          this.changeDetectorRef.detectChanges();
        }
      }
      // this.GetDeleteGridList(this.activeorderForm.controls['customer'].value, this.ProjectList);
    });

    debugger;

    this.customerName = this.dropdown.getCustomerCode();
    this.projectName = this.dropdown.getDetailingProjectId();

    this.SetCustomerProject();
    debugger;
  }
  GetCustomer(): void {
    debugger;
    this.commonService.GetCutomerDetails().subscribe({
      next: (response) => {
        debugger;
        this.Customerlist = response;

        console.log('Customerlist', this.Customerlist);
      },
      error: (e) => {
        this.LoadingCustomerName = false;
      },
      complete: () => {
        debugger;
        this.LoadingCustomerName = false;
        // if(this.transferObject["CustomerId"]!=undefined)
        // {

        //   this.customerName = this.transferObject['CustomerId'];
        // }
      },
    });
  }

  GetProject(customercode: any, CopyType: any): void {
    this.commonService.GetProjectDetails(customercode).subscribe({
      next: (response) => {
        if (CopyType === 'S') {
          this.projectList_source = response;
          this.projectList_destination = response;
        } else {
          this.projectList_destination = response;
        }
      },

      error: (e) => {},
      complete: () => {
        if (this.projectName !== undefined && this.Initial_Value) {
          let ProjectCode = this.projectList_source.find(
            (x: any) => x.ProjectId === this.projectName
          ).ProjectCode;
          this.changeproject(ProjectCode, 'S');

          this.changeDetectorRef.detectChanges();
          this.Initial_Value = false;
        }
      },
    });
  }

  GetProductTypeList() {
    this.productcodeService.GetProductType_List().subscribe({
      next: (response) => {
        this.ProductCodeTypeList = response;
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  changeproject(event: any, CopyType: any) {
    debugger;
    if (CopyType === 'S') {
      debugger;
      this.ProjectID_source = this.projectList_source.find(
        (x: any) => x.ProjectCode === event
      ).ProjectId;
      this.ProjectID_destination = this.projectList_destination.find(
        (x: any) => x.ProjectCode === event
      ).ProjectId;
      this.Destination.controls['project'].patchValue(event);
      this.Source.controls['project'].patchValue(event);
    } else {
      this.Destination.controls['project'].patchValue(event);
      this.ProjectID_destination = this.projectList_destination.find(
        (x: any) => x.ProjectCode === event
      ).ProjectId;

      let projectid = this.ProjectID_destination;
      let ProductTypeId = Number(this.Destination.value.producttype);
      let structureelement = this.structureList.find(
        (x) =>
          x.StructureElementTypeId === this.Destination.value.structureelement
      ).StructureElementType;

      if (projectid && ProductTypeId && structureelement) {
        this.LoadParameterSetDropdown(
          projectid,
          ProductTypeId,
          structureelement,
          CopyType
        );
      }
    }
  }
  GetStructureElement() {
    this.productcodeService.GetStructureElement_Dropdown_Mesh().subscribe({
      next: (response) => {
        debugger;

        if (response.length > 0) {
          response.forEach((element: any) => {
            if (
              element.StructureElementTypeId == 4 ||
              element.StructureElementTypeId == 5 ||
              element.StructureElementTypeId == 6 ||
              element.StructureElementTypeId == 13
            ) {
              this.structureList.push(element);
            }
          });
        }
        console.log('This Is StructureElement ', this.structureList);
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  LoadContractList(Project_code: any) {
    debugger;
    this.projectcontractlistService.GetContractList(Project_code).subscribe({
      next: (response) => {
        console.log(response);
        debugger;
        this.Contractlist = response;

        //  console.log("contrDBJdsajbkbkjbkjbkbkbkbbbb,,bkbk,badsasdactlist", this.Contractlist)
      },
      error: (e) => {},
      complete: () => {},
    });
  }
  reset() {
    this.Source.reset();
    this.Destination.reset();
    this.isformsubmit = false;
  }
  LoadParameterSetList(projectId: any) {
    debugger;

    this.parametersetService.GetParameterSetList(projectId).subscribe({
      next: (response) => {
        console.log(response);
        debugger;
        this.ParameterSetList = response;
        console.log('ParameterSetList', this.ParameterSetList);
      },
      error: (e) => {},
      complete: () => {
        // this.contractListData = this.selectFilter(this.CoreCageProductListData)
        //this.backup_contractListData = JSON.parse(JSON.stringify(this.contractListData));
      },
    });

    //}
  }
  changecustomer(event: any, CopyType: any): void {
    // console.log("customer id" + event)
    debugger;

    // this.projectName=undefined;

    if (CopyType === 'S') {
      this.Source.reset();
      this.Destination.reset();
      this.projectList_source = [];
      this.projectList_destination = [];

      this.Destination.controls['customer'].patchValue(event);
      this.Source.controls['customer'].patchValue(event);
      this.GetProject(event, 'S');
      this.GetProject(event, 'D');
    } else {
      // this.Destination.reset();
      this.projectList_destination = [];
      this.Destination.controls['project'].patchValue(undefined);

      this.GetProject(event, 'D');
    }
  }
  onCopy() {
    debugger;
    this.isformsubmit = true;
    if (this.Source.valid && this.Destination.valid) {
      const copy_projectparam: copyprojectparam = {
        tntParamSetNumberSource: this.Source.value.parameterset,
        intProjectIdDest: this.ProjectID_destination,
        intParameteSetDest: this.ParameterSetList_destination,
        intUserId: this.userId,
      };
      this.utilityservice.Copy_ProjectParam(copy_projectparam).subscribe({
        next: (response) => {
          debugger;
        },
        error: (e) => {
          debugger;
        },
        complete: () => {
          debugger;
          this.reset();
          this.SetCustomerProject();
          this.tosterService.success('Project Parameter Copied Successfully ');
        },
      });
    }
  }
  changeStrElement(event: any, CopyType: any) {
    debugger;
    if (this.Source.value.producttype) {
      this.Destination.controls['structureelement'].patchValue(event);
      this.Source.controls['parameterset'].patchValue(undefined);
      this.ParameterSetList_destination = null;
      if (CopyType === 'S') {
        let projectid = this.ProjectID_source;
        let ProductTypeId = Number(this.Source.value.producttype);
        let structureelement = this.structureList.find(
          (x) => x.StructureElementTypeId === event
        ).StructureElementType;

        this.LoadParameterSetDropdown(
          projectid,
          ProductTypeId,
          structureelement,
          CopyType
        );
      } else {
        let projectid = this.ProjectID_destination;
        let ProductTypeId = Number(this.Destination.value.producttype);
        let structureelement = this.structureList.find(
          (x) => x.StructureElementTypeId === event
        ).StructureElementType;

        this.LoadParameterSetDropdown(
          projectid,
          ProductTypeId,
          structureelement,
          CopyType
        );
      }
    }
  }

  LoadParameterSetDropdown(
    projectid: any,
    ProductTypeId: any,
    structureelement: any,
    CopyType: any
  ) {
    debugger;
    this.utilityservice
      .Get_ParameterSetList(projectid, ProductTypeId, structureelement, 1)
      .subscribe({
        next: (response) => {
          debugger;
          if (CopyType === 'S') {
            this.ParameterSetList_source = response;
            this.ParameterSetList_destination =
              response[response.length - 1].intParameteSet + 1;
          } else {
            this.ParameterSetList_destination =
              response[response.length - 1].intParameteSet + 1;
          }

          console.log('Customerlist', this.Customerlist);
        },
        error: (e) => {
          this.LoadingCustomerName = false;
        },
        complete: () => {
          debugger;
          this.LoadingCustomerName = false;
        },
      });
  }
  changeProd(event: any) {
    debugger;
    this.structureList = [];
    this.Destination.controls['producttype'].patchValue(event);
    if (event != undefined) {
      this.GetStructureElement();
    }
  }

  SetCustomerProject() {
    if (this.customerName !== undefined) {
      this.changecustomer(this.customerName, 'S');
      this.Initial_Value = true;
    }
  }
}
