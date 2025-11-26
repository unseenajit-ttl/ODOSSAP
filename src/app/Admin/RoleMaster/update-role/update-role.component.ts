import { Component } from '@angular/core';
import { OnInit, Input } from '@angular/core'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'
import { AdminService } from '../../Admin.service';
import { ToastrService } from 'ngx-toastr';
import { FormDetails } from 'src/app/Model/form-details';
import { Event } from 'jquery';
import { ElementRef, ViewChild } from '@angular/core';
@Component({
  selector: 'app-update-role',
  templateUrl: './update-role.component.html',
  styleUrls: ['./update-role.component.css']
})
export class UpdateRoleComponent {
  //RoleMasterForm!: FormGroup;
  disableSubmit: boolean = false
  @Input() roleData: any;
  @Input() SelectedRole: any;
  @Input() UserId: any;

  introleid: any;

  loading: boolean = false;


  rolelist: any[] = [];
  FormlistbyRole: any[] = [];

  constructor(public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    public adminService: AdminService,
    private tosterService: ToastrService,
    private elRef: ElementRef) { }

  ngOnInit(): void {

    this.GetRoles();

    console.log("User Id is " + this.UserId);

    console.log("Selected Role", this.SelectedRole)

    // this.RoleMasterForm = this.formBuilder.group({
    //   rolename: new FormControl('', Validators.required),
    //   remark: new FormControl(''),
    //   // form: new FormControl('', Validators.required),

    // });
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
        this.introleid = this.SelectedRole;

        console.log(this.introleid, "introleid")
        this.GetPageAccessByRoleId(this.introleid)

      },
    });

  }

  pagesList: FormDetails[] = [];
  GetPageAccessByRoleId(RoleId: any): void {
    debugger;

    this.adminService.GetPageAccessByRoleId(RoleId).subscribe({
      next: (response) => {
        debugger;
        this.pagesList = response;

        console.log("PageAccessByRoleID=", response);
      },
      error: (e) => {
      },
      complete: () => {
        debugger;


      },
    });

  }

  changeRole(event: any) {
    if (event) {
      this.GetPageAccessByRoleId(event)
    }
    else (this.pagesList = []);

  }
  cancel() {
    this.modalService.dismissAll()

  }

  updaterole() {
    if (this.introleid != "") {
      debugger
      let UserId = this.UserId;
      let RoleId = this.introleid;
      try {
        /*if (form.invalid) {
          return;
        }*/
        this.adminService.UpdateRole(UserId, RoleId).subscribe(
          {

            next: (response) => {

              if (response == 1) {
                this.tosterService.success("Role Updated Successfully");
                this.modalService.dismissAll();

              }

            },
            error: (error: any) => {
              console.log(error);
            },
            complete: () => {
              // Complete!
              this.activeModal.close();

            }
          });
      } catch (error) {
        console.log(error);
      }



    }
    else {
      this.tosterService.warning("Select Role to Update")
    }

  }

  employeelist = []
  GetUserDetailsById(RoleId: any): void {
    debugger;

    this.adminService.GetUserByRoleId(RoleId).subscribe({
      next: (response) => {
        debugger;
        this.employeelist = response;
        console.log("UsersByRoleID=", this.employeelist);

        if (this.employeelist.length <= 0) {
          this.employeelist = [];
          alert("Record not found");
          return;
        }
      },
      error: (e) => {
      },
      complete: () => {
        debugger;


      },
    });

  }
}
