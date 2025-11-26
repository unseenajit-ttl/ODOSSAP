import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from 'src/app/SharedComponent/Dialogs/manage-dialog/confirm-dialog.component';
import { ShapeMasterService } from '../../Services/shape-master.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-addValidation',
  templateUrl: './addValidation.component.html',
  styleUrls: ['./addValidation.component.css']
})
export class addValidationComponent implements OnInit {

  @Input() name: any;
  @Input() formname: any;
  @Input() wbsitemdata: any;
  userProfile: any
  disableSubmit: boolean = false
  iConfirm: boolean = false
  attributelist: any[] = [];
  validationconstraintList: any;

  enableEditIndex = null
  isEditing: boolean = false;
  loading: boolean = false;

  newattribute: attribute[] = [{
    Attribute: '',
    ValidationConstraint: '',
    Fk_ShapeId: '',
    Type: '',
    Id: 0
  }];

  attributelist_backup: any;
  selected_attribute: any;
  ShapeId: any;

  constructor(public dialog: MatDialog,public activeModal: NgbActiveModal, private changeDetectorRef: ChangeDetectorRef, private modalService: NgbModal, private formBuilder: FormBuilder, private shapemastersrvice: ShapeMasterService, private tosterService: ToastrService) { }

  ngOnInit(): void {


    this.GetAttributesDropdown(this.ShapeId);
    this.GetValidationConstraintList(this.ShapeId);

  }
  

  AddReset() {
    this.newattribute = [{
      Attribute: '', ValidationConstraint: '',
      Fk_ShapeId: '',
      Type: '',
      Id: 0
    }];
  }

  GetAttributesDropdown(ShapeId: any) {
    debugger;
    this.loading = true;
    this.shapemastersrvice.GetAttributes(ShapeId).subscribe({
      next: (response) => {
        this.attributelist = response;
        console.log("Attribute List", this.attributelist);

      },
      error: (e) => {
      },
      complete: () => {
        this.loading = false;
        //this.attributelist_backup = JSON.parse(JSON.stringify(this.  attributelist));

      },
    });
  }

  GetValidationConstraintList(ShapeId: any) {
    debugger;
    this.loading = true;
    this.shapemastersrvice.GetValidationConstraintList(ShapeId).subscribe({
      next: (response) => {
        this.validationconstraintList = response;
        console.log("Validation Grid List", this.validationconstraintList);

      },
      error: (e) => {
      },
      complete: () => {
        this.loading = false;
        //this.attributelist_backup = JSON.parse(JSON.stringify(this.  attributelist));

      },
    });
  }
  onEdit(item: any, index: any) {
    debugger
    this.isEditing = true;

    this.enableEditIndex = index;
  }

  Editcancel() {
    this.isEditing = false;
    this.enableEditIndex = null;
  }


  AddNewValidation() {

    if (this.newattribute[0].Attribute == '') {
      this.tosterService.warning("Attribute can not be empty.")
    }
    else if (this.newattribute[0].ValidationConstraint == '') {
      this.tosterService.warning("Validation Constraint can not be empty.")

    }
    else {
      this.loading = true;
      debugger
      const obj: attribute = {
        Fk_ShapeId: this.ShapeId,
        Attribute: this.newattribute[0].Attribute,
        Type: this.newattribute[0].Type,
        ValidationConstraint: this.newattribute[0].ValidationConstraint,
        Id: 0
      };

      this.shapemastersrvice.InsertIpOpValidationConstraints(obj).subscribe({
        next: (response) => {
          if (response!=0) {

            this.tosterService.success("Data added sucessfully ! ");

          }
          else {
            this.tosterService.error("Error occured while saving data ! ");
          }

        },
        error: (e: any) => {

        },
        complete: () => {
          this.loading = false;

          this.GetValidationConstraintList(this.ShapeId)

        },
      });



    }

  }

  UpdateValidation(item:any, index: any) {
    console.log(item);
    
    if (item.ValidationConstraint == '') {
      this.tosterService.warning("Validation Constraint can not be empty.")

    }
    else {
      this.loading = true;
      debugger
      try{
        const obj: attribute = {
          Fk_ShapeId: this.ShapeId,
          Attribute:item.Attribute,
          Type:item.Type,
          ValidationConstraint:item.ValidationConstraint,
          Id:item.Id
        };
  
        this.shapemastersrvice.UpdateIpOpValidationConstraints(obj).subscribe({
          next: (response) => {
            if (response==1) {
  
              this.tosterService.success("Data Updated sucessfully ! ");
  
            }
            else {
              this.tosterService.error("Error occured while saving data ! ");
            }
  
          },
          error: (e: any) => {
  
          },
          complete: () => {
            this.loading = false;
            this.isEditing = false;
            this.enableEditIndex = null;
            this.GetValidationConstraintList(this.ShapeId)
  
          },
        });
  
  

      }
      catch(ex)
      {

      }

    }



  }

  DeleteValidation(Id: any): void {
    debugger
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        debugger
        this.loading = true
        this.shapemastersrvice.DeleteIpOpValidationConstraints(Id).subscribe({
          next: (response) => {
           
            if(response==1){
              this.tosterService.success("Record Deleted Succcessfully");

            }

          },
          error: (e) => {
          },
          complete: () => {
            debugger;

            this.loading = false
            this.GetValidationConstraintList(this.ShapeId)
          },
        });
      }
    });
  }
  

}

export interface attribute {
  Id:number,
  Fk_ShapeId: string,
  Attribute: string,
  Type: string,
  ValidationConstraint: string

}