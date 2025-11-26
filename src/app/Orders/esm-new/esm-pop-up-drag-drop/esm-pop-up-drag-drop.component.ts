import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { error } from 'jquery';
import { DrainService } from 'src/app/Detailing/MeshDetailing/drain-service.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-esm-pop-up-drag-drop',
  templateUrl: './esm-pop-up-drag-drop.component.html',
  styleUrls: ['./esm-pop-up-drag-drop.component.css']
})
export class EsmPopUpDragDropComponent {
  @Input() selectedRow: any;
  @Input() Method:any;
  customViewName:string = '';
  viewDescription: string = '';
  ProcessOrderLoading = false;
  availableColumns:any = [];
  displayColumns:any[] = [];
  splited_Col_IDs:any[]=[];

  constructor(public activeModal: NgbActiveModal,private modalService: NgbModal,private drainService:DrainService,private loginService:LoginService) {}
  ngOnInit(): void {
    this.loadInitialData();


  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      // Same list reorder
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Different list transfer
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  onClose() {
    this.activeModal.close(); // closes the dialog
  }

  onSave() {
    // save logic
    let colIDs:string = ""
    if(this.displayColumns.length>0)
    {
      this.displayColumns.forEach(element => {
        colIDs+=element.ID + ";";
      });
      colIDs = colIDs.slice(0, -1);  // removes last character
      let obj ={
        ID:this.Method=="Edit"?this.selectedRow.ID:0,
        TRACKINGNO:this.selectedRow.TRACKINGNO,
        VIEWNAME:this.selectedRow.VIEWNAME,
        VIEWDESCRIPTION:this.selectedRow.VIEWDESCRIPTION,
        CREATEDBY:this.loginService.GetDislayName(),
        COLUMNIDS:colIDs,
      }

       this.AddUpdateData(obj);



    }
    console.log('Saved data:', this.availableColumns, this.displayColumns);


  }

  loadInitialData() {
    debugger
    this.getAvailableColumns();
    // this.getSelectedColumns();
  }
  getAvailableColumns(){
    debugger
    this.drainService.GetAllColumnsEsm().subscribe({
      next: (response) => {
        debugger
        console.log(response);
        if(response && response.Data.length > 0){
          this.availableColumns = response.Data;

        }
      },
      error: (e) => {},
      complete: () => {
        // this.loading = false;
        if(this.selectedRow)
          {

            this.splited_Col_IDs = this.selectedRow.COLUMNIDS.split(";");
            let displaycol;
            this.splited_Col_IDs.forEach(element => {
               displaycol = this.availableColumns.findIndex((col:any)=>col.ID.toString() == element);
               if(displaycol!=-1)
               {
                this.displayColumns.push(this.availableColumns[displaycol]);
                this.availableColumns.splice(displaycol, 1);
               }
            });

          }
      },
    });
  }
  getSelectedColumns(){
    this.drainService.GetAllColumnsEsm().subscribe({
      next: (response) => {
        if(response && response.Data.length > 0){
          this.displayColumns = response.Data.slice(-10);
        }
      },
      error: (e) => {},
      complete: () => {
        // this.loading = false;
      },
    });
  }
    AddUpdateData(obj:any){
    this.drainService.AddUpdate(obj).subscribe({
      next:(response)=>{
        console.log("API Response:", response);

      },
      error:(error)=>{
        this.activeModal.close({
          availableColumns: this.availableColumns, displayColumns: this.displayColumns
        });
      },complete:()=> {
        this.activeModal.close({
          availableColumns: this.availableColumns, displayColumns: this.displayColumns
        });
      },
    })

  }
}
