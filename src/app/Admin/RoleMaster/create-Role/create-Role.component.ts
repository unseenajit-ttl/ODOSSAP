import { Component, OnInit, Input } from '@angular/core'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'
import { AdminService } from '../../Admin.service';
import { ToastrService } from 'ngx-toastr';
import { FormDetails } from 'src/app/Model/form-details';
import { Event } from 'jquery';
import { ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { forEach } from 'mathjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-create-Role',
  templateUrl: './create-Role.component.html',
  styleUrls: ['./create-Role.component.css']
})
export class CreateRoleComponent implements OnInit {
  RoleMasterForm!: FormGroup;


  @Input() name: any;
  @Input() formname: any;
  @Input() wbsitemdata: any;
  userProfile: any
  disableSubmit: boolean = false
  iConfirm: boolean = false
  rolelist: any[] = [];
  departmentList: any[] = [];
  employeelist: any[] = [];
  Formlist: any[] = [];
  FormlistbyRole: any[] = [];
  selectedItems = [];
  dropdownSettings = {};
  isnewRole: boolean = false
  loading: boolean = false;

  activeSwitche: boolean = false;

  roleId: any;
  UserNames: any = '';
  EmailIds: any = ''
  LoginNames: any = ''
  Initials: any = ''
  Event: any
  UserName: any
  EmailId: any
  LoginName: any
  Initial: any

  CurrentLoginId: any

  constructor(public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    public adminService: AdminService,
    private tosterService: ToastrService,
    private loginService: LoginService,
    private elRef: ElementRef,
    public router: Router,) { }


  ngOnInit(): void {

     this.CurrentLoginId = this.loginService.GetUserId();
    
    this.GetRoles();
    this.GetActiveDirectoryUsers()

    this.RoleMasterForm = this.formBuilder.group({
      rolename: new FormControl('', Validators.required),
      remark: new FormControl(''),
      form: new FormControl('', Validators.required),
      status: new FormControl(''),
      empname: new FormControl(''),

    });
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

  changeRole(event: any) {
    console.log("Event=>", event);
    if (event) {
      this.roleId = event;
      this.GetPageAccessByRoleId(event)
    }

  }
  GetFormList(): void {
    debugger;

    this.adminService.GetFormList().subscribe({
      next: (response) => {
        debugger;
        this.Formlist = response;
        console.log("Forms =", this.Formlist);
      },
      error: (e) => {
      },
      complete: () => {
        debugger;


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

  username: any;
  password: any
  GetActiveDirectoryUsers(): void {
    debugger;
    this.loading = true
    this.adminService.GetActiveAllUserDirectory(this.username, this.password).subscribe({
      next: (response) => {
        debugger;
        this.employeelist = response;

        console.log("AD Users", this.employeelist);
      },
      error: (e) => {
      },
      complete: () => {
        debugger;

        this.loading = false;
      },
    });

  }

  ChangeUser(event: any) {
    debugger;

    //this.Event = event

    this.UserName = event.DisplayName;
    if (event.Email != "") {
      this.EmailId = event.Email;
    }
    else {
      this.EmailId = "xxx";
    }

    this.LoginName = event.SAMAccountName;
    this.Initial = event.SAMAccountName;

  }
  addnewrole() {
    this.isnewRole = true

  }
  submitReview() {
    debugger
    if (this.isnewRole) {
      let role = this.RoleMasterForm.value.rolename;
      if (role != '') {

        this.adminService.CheckDuplicateRole(role).subscribe((Response) => {
          debugger
          if (Response[0].isDuplicate == "Yes") {
            this.tosterService.warning('Role already exists.')
          }
          else {
            if (this.activeSwitche) {
              this.RoleMasterForm.controls['status'].setValue(1);
            } else {
              this.RoleMasterForm.controls['status'].setValue(0);

            }
            let RoleData = {
              "ROLENAME": role,
              "REMARKS": this.RoleMasterForm.value.remark,
              "CREATEDUSERID":this.CurrentLoginId,
              "STATUSID": this.RoleMasterForm.value.status
            }

            this.adminService.InsertNewRoles(RoleData).subscribe({
              next: (response) => {
                debugger;
                if (response == 1) {

                  this.tosterService.success("New Role Added Succesfully");
                }

              },

              error: (e) => {
              },
              complete: () => {

                this.activeModal.close();
                location.reload();

              }

            });

          }
        })
      }
      else {
        this.tosterService.error("Role name is empty.");
        this.RoleMasterForm.controls["rolename"].markAsTouched();
        const fieldElement = this.elRef.nativeElement.querySelector('[formControlName="rolename"]');
        fieldElement.focus();

        return
      }
    }
    else {
      debugger

      // this.Event.forEach((element: any) => {
      //   this.UserNames += element.DisplayName+"ì"
      //   this.EmailIds+=element.Email+'í' 
      //   this.LoginNames+=element.SAMAccountName+'í'
      //   this.Initials+=element.SAMAccountName+'í'

      // });

      if (this.LoginName != "") {
        if (this.roleId == undefined || this.roleId == "") {
          this.tosterService.error("Please select the role!")

        }
        else {
          this.adminService.CheckDuplicateUserforRole(this.LoginName, this.roleId).subscribe((Response) => {
            debugger
            if (Response[0].isDuplicate == "Yes") {
              this.tosterService.error('Selected user is already in the list')
              return
            }
            else {

              debugger

              // this.UserNames = this.UserNames + "ì" + this.UserName;
              // this.EmailIds = this.EmailIds + "ì" + this.EmailId;
              // this.LoginNames = this.LoginNames + "ì" + this.LoginName;
              // this.Initials = this.Initials + "ì" + this.Initial;

              if (this.UserName == null) {
                this.tosterService.error("Please select the User from Available User")
              }
              else {


                let AddEmp = {
                  "RoleId": this.roleId,
                  "UserNames": this.UserName,
                  "EmailIds": this.EmailId,
                  "LoginNames": this.LoginName,
                  "Initials": this.Initial,
                  "CurrentLoginUserId":this.CurrentLoginId

                };

                this.adminService.InsertNewUSers(AddEmp).subscribe({
                  next: (response) => {
                    debugger;
                    if (response == 1) {
                      this.tosterService.success("User Added Successfully")

                    }
                    else {
                      this.tosterService.success("User's Role Updated Successfully")
                    }

                  },

                  error: (e) => {
                  },
                  complete: () => {
                    // Execute when all data is ready

                    this.activeModal.close();
                  }

                });


              }

            }
          })



        }


      }
      else {
        this.tosterService.error("Please select the User from Available User")
      }
    }

  }

  public onItemSelect(item: any) {
    console.log(item);
  }
  cancel() {
    this.modalService.dismissAll()
  }


}





