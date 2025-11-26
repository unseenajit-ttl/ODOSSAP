import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
//import { MasterDialogComponent } from '../master-dialog/master-dialog.component';
import { CreateRoleComponent } from './create-Role/create-Role.component';
import { AdminService } from '../Admin.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { RoleManagementDetails } from 'src/app/Model/role-management-details';
import { FormDetails } from 'src/app/Model/form-details';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { UpdateRoleComponent } from './update-role/update-role.component';
import { boolean, i } from 'mathjs';
import { LoginService } from 'src/app/services/login.service';
import { CommonService } from 'src/app/SharedServices/CommonService';

@Component({
  selector: 'app-RoleMaster',
  templateUrl: './RoleMaster.component.html',
  styleUrls: ['./RoleMaster.component.css']
})
export class RoleMasterComponent implements OnInit {


  RoleMasterForm!: FormGroup;
  submitted = false;
  searchResult = true;
  closeResult = '';

  departmentList: any[] = [];
  toggleFilters = false;
  RolemasterList: any[] = [];
  isExpand = false;
  loading: boolean = false;
  employeelist: RoleManagementDetails[] = [];
  employeelistarrayCount: number = 0;
  employeelist_backup: RoleManagementDetails[]=[];

  toggleValue: boolean = false;
  hasReadAccess: boolean = false;
  hasWriteAccess: boolean = false;
  hasApproveAccess: boolean = false;

  rolelist: any[] = [];
  pagesList: FormDetails[] = [];

  SelectedRole: any;
  Entered_Remark: any

  searchText: any = '';
  searchName: any;
  searchLoginId: any;
  searchMailID: any;

  enableEditIndex: any;
  accessList: any = []
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public adminService: AdminService,
    private tosterService: ToastrService,
    private loginService: LoginService,
    private commonService:CommonService,
    public dialog: MatDialog) {
    this.accessList = [{ value: true, viewval: "Yes" }, { value: false, viewval: "No" }]
  }


  ngOnInit() {
    this.commonService.changeTitle('RoleMaster | ODOS');
    this.GetRoles();
    
    this.RoleMasterForm = this.formBuilder.group({
      role: new FormControl('', Validators.required),
      //status: new FormControl(''),
      roleremark: new FormControl('')
    });


  }
  // convenience getter for easy access to form fields
  get f() { return this.RoleMasterForm.controls; }

  showPageDetails() {
    this.isExpand = !this.isExpand;
  }

  GetRoles(): void {
    debugger;

    this.adminService.GetRole().subscribe({
      next: (response) => {
        debugger;
        this.rolelist = response;
        console.log("RoleList=", this.rolelist);
      },
      error: (e) => {
      },
      complete: () => {
        debugger;


      },
    });

  }

  ChangeRole(event: any) {

    debugger;


    let RoleRemark = this.rolelist.find((x: any) => x.RoleId === this.RoleMasterForm.value.role).RoleRemarks;
    this.toggleValue = this.rolelist.find((x: any) => x.RoleId === this.RoleMasterForm.value.role).StatusId;
    this.RoleMasterForm.controls['roleremark'].patchValue(RoleRemark);


    this.GetUserDetailsById(event);
    this.GetPageAccessByRoleId(event);
  }

  GetUserDetailsById(RoleId: any): void {
    debugger;

    this.adminService.GetUserByRoleId(RoleId).subscribe({
      next: (response) => {
        debugger;
        this.employeelist = response;
        console.log("UsersByRoleID=", this.employeelist);

        if (this.employeelist.length <= 0) {
          this.employeelist = [];
          this.employeelistarrayCount = 0;
          alert("Record not found");
          return;
        }
        this.employeelistarrayCount = this.employeelist.length;
      },
      error: (e) => {
      },
      complete: () => {
        debugger;
        this.employeelist_backup = JSON.parse(JSON.stringify(this.employeelist));
       


      },
    });

  }

  GetPageAccessByRoleId(RoleId: any): void {
    debugger;
    //let RoleId = this.RoleMasterForm.value.role;
    this.adminService.GetPageAccessByRoleId(RoleId).subscribe({
      next: (response) => {
        debugger;
        this.pagesList = response;

        this.hasReadAccess == this.pagesList[0].HasReadAccess;

        console.log("PageAccessByRoleID=", response);
      },
      error: (e) => {
      },
      complete: () => {
        debugger;


      },
    });

  }


  // onSearch_btn() {
  //   if (this.RoleMasterForm.valid) {
  //     debugger;
  //     let Role = this.RoleMasterForm.value.role;

  //     this.GetUserDetailsById(Role);
  //   }
  //   else{
  //     this.tosterService.error( "Please select Role");
  //   }
  // }

  onReset() {
    this.submitted = false;
    this.RoleMasterForm.reset();
    this.employeelist = [];
    this.pagesList = [];
  }
  onPageChange(currentPage: number): void {
    // this.state.page = currentPage
    // this.cpdService._search(this.state).subscribe(result => (this.searchResult = result))
  }
  open() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'lg',

    }
    const modalRef = this.modalService.open(CreateRoleComponent, ngbModalOptions);
    modalRef.componentInstance.name = 'World';
    modalRef.componentInstance.formname = 'RoleMaster';

  }

  Edit(item: any) {
    debugger
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      // centered: true,
      size: 'lg',


    }
    const modalRef = this.modalService.open(UpdateRoleComponent, ngbModalOptions);
    modalRef.componentInstance.name = 'World';
    // modalRef.componentInstance.roleData = item;
    modalRef.componentInstance.SelectedRole = this.SelectedRole;
    modalRef.componentInstance.UserId = item.UserId;

    modalRef.componentInstance.formname = 'RoleMaster';

  }

  OnDelete(userId: any) {
    debugger
    let roleId = this.RoleMasterForm.controls['role'].value;
    console.log("role id is ", roleId, " userid is", userId)

    this.loading = true
    this.adminService.RemoveUSers(userId).subscribe({
      next: (response) => {
        debugger;
        console.log('isDeleted', response);
        this.tosterService.success("Role has been removed Succcessfully");

      },
      error: (e) => {
      },
      complete: () => {
        debugger;

        this.loading = false
        if (roleId == undefined || roleId == '') {
          window.location.reload();
        } else {

          this.GetUserDetailsById(roleId);
        }

      },
    });



  }

  openConfirmationDialog(userId: any): void {
    debugger
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Perform delete action
        this.OnDelete(userId);
      }
    });
  }

  searchUserData() {
    debugger
    // if (this.searchText != undefined) {
    //   this.employeelist = this.employeelist.filter(item =>
    //     item.UserName.toLowerCase().includes(this.searchText.toLowerCase()) ||
    //     item.LoginName.toLowerCase().includes(this.searchText.toLowerCase()) ||
    //     item.EmailId.toLowerCase().includes(this.searchText.toLowerCase())
    //   );
    // }
    // this.employeelist = this.employeelist_backup;
    
    this.employeelist = JSON.parse(JSON.stringify(this.employeelist_backup));
   
    if (this.searchName != undefined) {
      this.employeelist = this.employeelist.filter(item =>
        this.checkFilterData(this.searchName, item.UserName)
      );
    }

    if (this.searchLoginId != undefined) {
      this.employeelist = this.employeelist.filter(item =>
        this.checkFilterData(this.searchLoginId, item.LoginName)
      );
    }

    if (this.searchMailID != undefined) {
      this.employeelist = this.employeelist.filter(item =>
        this.checkFilterData(this.searchMailID, item.EmailId)
      );
    }

    console.log("data = ", this.employeelist)

  }

  checkFilterData(ctlValue: any, item: any) {
    if (ctlValue.toString().includes(',')) {
      let value = ctlValue.toString().toLowerCase().trim().split(',');
      return value.some((char: string) => item.toString().toLowerCase().includes(char))
    } else {
      return item
        .toString()
        .toLowerCase()
        .includes(
          ctlValue
            .toString()
            .toLowerCase()
            .trim()
        )
    }
  }

  OnSave() {


    if (this.RoleMasterForm.valid) {
      debugger

      let RoleRemark = this.RoleMasterForm.value.roleremark;
      let ActiveStatus = 0;
      if (this.toggleValue == true) { ActiveStatus = 1; } else { ActiveStatus = 0 }

      let RoleData = {
        "RoleId": this.SelectedRole,
        "RoleRemark": RoleRemark,
        "RoleStatus": ActiveStatus
      }

      this.adminService.UpdateRoleStatus(RoleData).subscribe({
        next: (response) => {
          debugger;
          if (response == 0) {

            this.tosterService.success("Role Status Updated Successfully");
          } else {
            this.tosterService.error("Something went wrong!");
          }


        },

        error: (e) => {
        },
        complete: () => {
          this.GetRoles();

        },

      });
    }
    else {
      this.tosterService.error("Please select the role.");
    }

  }

  backup_pagesList: any;

  EditPrevilage(item: any, index: any) {
    debugger;
    //this.pagesList = JSON.parse(JSON.stringify(this.backup_pagesList));
    this.enableEditIndex = index;
  }

  EditPrevilageCancle() {
    debugger;
    this.enableEditIndex = -1;
    this.pagesList = JSON.parse(JSON.stringify(this.backup_pagesList));
  }
  SavePrevilage(item: any) {
    debugger

    const data = {

      "RoleId": this.SelectedRole,
      "FormId": item.PageId,
      "HasReadAccess": boolean(item.HasReadAccess),
      "HasWriteAccess": item.HasWriteAccess,
      "HasApproveAccess": item.HasApproveAccess
    }

    this.adminService.InsertUpdateRolePrivilage(data).subscribe({
      next: (response) => {
        debugger
        if (response != null && response > 0) {

          this.tosterService.success("Successfully updated Privilege");
        } else {
          this.tosterService.warning("Something went wrong!");
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.EditPrevilageCancle()
      }
    })

  }
}
