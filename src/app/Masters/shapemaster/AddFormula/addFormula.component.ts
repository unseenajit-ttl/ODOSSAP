import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from 'src/app/SharedComponent/Dialogs/manage-dialog/confirm-dialog.component';
import { ShapeMasterService } from '../../Services/shape-master.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-addFormula',
  templateUrl: './addFormula.component.html',
  styleUrls: ['./addFormula.component.css']
})
export class addFormulaComponent implements OnInit {


  @Input() name: any;
  @Input() formname: any;
  @Input() wbsitemdata: any;
  userProfile: any
  disableSubmit: boolean = false
  iConfirm: boolean = false
  Formulalist: any[] = [];
  FormulalistByID: any[] = [];

  LibraryId: any;
  isDisabled: boolean = false;

  enableEditIndex = null
  isEditing: boolean = false;
  loading: boolean = false;
  newFormula: AddFormula[] = [{
    LibraryId: 0,
    FormulaName: '',
    Formula: '',
    Fk_shapeId: 0,
    Id: 0
  }];
  ShapeCodeList: any[] = [];

  ShapeId: any;
  shapegroup: any;
  strelementtype: any;

  constructor(public dialog: MatDialog, public activeModal: NgbActiveModal, private changeDetectorRef: ChangeDetectorRef, private modalService: NgbModal, private formBuilder: FormBuilder, private shapemastersrvice: ShapeMasterService, private tosterService: ToastrService) { }

  ngOnInit(): void {

    this.GetShapeCodeList();
    this.GetFormulaList(this.ShapeId);


  }

  GetShapeCodeList() {
    debugger;

    this.shapemastersrvice.GetShapeCodeList().subscribe({
      next: (response) => {
        this.ShapeCodeList = response;
        console.log("ShapeCode List", this.ShapeCodeList);
      },
      error: (e) => {
      },
      complete: () => {

      },
    });
  }

  GetFormulaList(ShapeId: any) {
    debugger;
    this.loading = true;
    this.shapemastersrvice.GetFormulaList(ShapeId).subscribe({
      next: (response) => {
        this.Formulalist = response;
        console.log("Formula Grid List", this.Formulalist);
        if (response.length == 0) {
          this.GetProductMArkingFormulasById();
        }

      },
      error: (e) => {
      },
      complete: () => {
        this.loading = false;

      },
    });
  }

  GetProductMArkingFormulasById() {

    if (this.shapegroup = 'product_beam') {
      this.strelementtype = "beam"
    }
    else if (this.shapegroup = 'product_column') {
      this.strelementtype = "column"
    }
    else {
      this.strelementtype = "slab"
    }
    debugger;
    this.loading = true;
    this.shapemastersrvice.GetProductMArkingFormulasById(this.strelementtype).subscribe({
      next: (response) => {
        this.Formulalist = response;
        console.log("Formula Grid List by id", this.Formulalist);

      },
      error: (e) => {
      },
      complete: () => {
        this.loading = false;

      },
    });
  }



  // GetLibraryID() {


  //   if (this.shapegroup == 'product_beam') {
  //     this.strelementtype = "beam"
  //   }
  //   else if (this.shapegroup == 'product_column') {
  //     this.strelementtype = "column"
  //   }
  //   else {
  //     this.strelementtype = "slab"
  //   }
  //   debugger;
  //   this.loading = true;

  //   let FormulaName = this.newFormula[0].FormulaName;

  //   this.shapemastersrvice.GetLibraryId(this.strelementtype, FormulaName).subscribe({
  //     next: (response) => {

  //       console.log("LibraryID", response);

  //       if (response.length==0) {
  //         this.LibraryId == 1;
  //       }
  //       else {
  //         this.LibraryId=response[0].LibraryId;
  //       }

  //       this.AddNewFormula()

  //     },
  //     error: (e) => {
  //     },
  //     complete: () => {

  //     },
  //   });
  // }

  // AddNewFormula() {


  //   if (this.newFormula[0].FormulaName == '') {
  //     this.tosterService.warning("Formula name cannnot be empty.")
  //   }
  //   else if (this.newFormula[0].Formula == '') {
  //     this.tosterService.warning("Formula cannnot be empty.")

  //   }
  //   else {
  //     this.loading = true;
  //     debugger


  //     const obj: AddFormula = {
  //       Fk_shapeId: this.ShapeId,
  //       LibraryId: this.LibraryId,
  //       FormulaName: this.newFormula[0].FormulaName,
  //       Formula: this.newFormula[0].Formula,
  //       Id: 0
  //     };

  //     this.shapemastersrvice.InsertProductMArkingFormula(obj).subscribe({
  //       next: (response) => {
  //         if (response == 1) {

  //           this.tosterService.success("Data added sucessfully ! ");

  //         }
  //         else {
  //           this.tosterService.error("Error occured while saving data ! ");
  //         }

  //       },
  //       error: (e: any) => {

  //       },
  //       complete: () => {
  //         this.loading = false;

  //         this.GetFormulaList(this.ShapeId)

  //       },
  //     });



  //   }

  // }


  btnSaveClick() {


    if (this.newFormula[0].FormulaName == '') {
      this.tosterService.warning("Formula name cannnot be empty.")
    }
    else if (this.newFormula[0].Formula == '') {
      this.tosterService.warning("Formula cannnot be empty.")

    }
    else {

      let FormulaName = this.newFormula[0].FormulaName;

      if (this.shapegroup = 'product_beam') {
        this.strelementtype = "beam"
      }
      else if (this.shapegroup = 'product_column') {
        this.strelementtype = "column"
      }
      else {
        this.strelementtype = "slab"
      }



      this.shapemastersrvice.GetLibraryId(this.strelementtype, FormulaName).subscribe({
        next: (response) => {

          console.log("LibraryID", response);

          if (response.length == 0) {
            this.LibraryId = null;
            this.tosterService.error("Error occured while saving data !")
          }
          else {
            this.LibraryId = response[0].LibraryId;
            this.AddNewFormula()
          }

        },
        error: (e) => {
        },
        complete: () => {

        },
      });
    }
  }

  AddNewFormula() {

    this.loading = true;
    debugger

    const obj: AddFormula = {
      Fk_shapeId: this.ShapeId,
      LibraryId: this.LibraryId,
      FormulaName: this.newFormula[0].FormulaName,
      Formula: this.newFormula[0].Formula,
      Id: 0
    };

    this.shapemastersrvice.InsertProductMArkingFormula(obj).subscribe({
      next: (response) => {
        if (response == 1) {

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

        this.GetFormulaList(this.ShapeId)

      },
    });


  }

  cancel() {
    this.modalService.dismissAll()
  }
  AddReset() {
    this.newFormula = [{
      LibraryId: 0,
      FormulaName: '',
      Formula: '',
      Fk_shapeId: 0,
      Id: 0
    }];
  }


  onEdit(item: any, index: any) {
    this.isEditing = true;

    this.enableEditIndex = index;
  }
  Editcancel() {
    this.isEditing = false;
    this.enableEditIndex = null;
    this.GetFormulaList(this.ShapeId);
  }
  UpdateFormula(item: any, index: any) {

    debugger

    if (item.Formula == '') {
      this.tosterService.warning("Formula cannnot be empty.")

    }
    else {
      this.loading = true;
      debugger
      try {
        const obj: AddFormula = {
          Fk_shapeId: this.ShapeId,
          LibraryId: item.LibraryId,
          FormulaName: item.FormulaName,
          Formula: item.Formula,
          Id: item.Id
        };

        this.shapemastersrvice.UpdateProductMArkingFormula(obj).subscribe({
          next: (response) => {
            if (response == 1) {

              this.tosterService.success("Record updated successfully ! ");

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
            this.GetFormulaList(this.ShapeId)

          },
        });



      }
      catch (ex) {

      }

    }
  }

  // DeleteValidation(Id: any): void {
  //   debugger
  //   const dialogRef = this.dialog.open(ConfirmationDialogComponent);
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       debugger
  //       this.loading = true
  //        this.shapemastersrvice.DeleteIpOpValidationConstraints(Id).subscribe({
  //         next: (response) => {
           
  //           if(response==1){
  //             this.tosterService.success("Record Deleted Succcessfully");

  //           }

  //         },
  //         error: (e) => {
  //         },
  //         complete: () => {
  //           debugger;
  //           this.loading = false
  //           this.GetFormulaList(this.ShapeId)
  //         },
  //       });
  //     }
  //   });
  // }
  
DeleteValidation(Id: number): void {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent);
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.loading = true;
      this.shapemastersrvice.DeleteIpOpValidationConstraints(Id).subscribe({
          next: (response) => {
          if (response === 1) {
            this.tosterService.success('Record Deleted Successfully');
            this.GetFormulaList(this.ShapeId);
          }
        },
        error: (error) => {
          console.error('Delete error:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  });
}

}

export interface AddFormula {
  LibraryId: number,
  FormulaName: string,
  Formula: string
  Fk_shapeId: number
  Id: number
}