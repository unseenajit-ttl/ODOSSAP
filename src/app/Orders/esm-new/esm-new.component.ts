import { Component } from '@angular/core';
import { EsmCustomViewsComponent } from './esm-custom-views/esm-custom-views.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DrainService } from 'src/app/Detailing/MeshDetailing/drain-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-esm-new',
  templateUrl: './esm-new.component.html',
  styleUrls: ['./esm-new.component.css']
})
export class EsmNewComponent {
  // generate 160 columns
  availableColumns:any[] = [];
  rows = [];
  sorNo:any;
  SoNo:any
  loading:boolean=false;


  constructor(private modalService: NgbModal,private drainService: DrainService,private router:Router,private route: ActivatedRoute) {}

  ngOnInit() {
    this.sorNo = this.route.snapshot.queryParamMap.get('sorNo');
    this.SoNo = this.route.snapshot.queryParamMap.get('soNo');
    this.getAvailableColumns();

    // this.getEsmTrackingDetails();
  }
  trackByRow(index: number, item: any) {
    // each row is stable by index here; if rows have id use that
    return index;
  }

  trackByCol(index: number, col: string) {
    return col;
  }

  // OpenESMPopUp() {
  // // this.Collapse=true;
  //   const ngbModalOptions: NgbModalOptions = {
  //     backdrop: 'static',
  //     keyboard: false,
  //     centered: true,
  //     size: 'xl',
  //     windowClass: 'your-custom-dialog-class',
  //   };
  //   const modalRef = this.modalService.open(
  //     EsmCustomViewsComponent,
  //     ngbModalOptions
  //   );
  //   // modalRef.componentInstance.selectedRow = this.selectedRow[0];
  // }

  OpenESM(){
    this.router.navigate(['/order/esm-new/esm-custom-views'],{
      queryParams: { sorNo: this.sorNo },
    })
  }
  getAvailableColumns(){
    this.loading = true;
    this.drainService.GetAllColumnsEsm().subscribe({
      next: (response) => {
        console.log("getAvailableColumns",response);
        if(response && response.Data.length > 0){
          this.availableColumns = response.Data;
        }
      },
      error: (e) => {},
      complete: () => {
        // this.loading = false;
        if(this.sorNo && this.sorNo !='' && this.sorNo != null){
          this.getEsmTrackingDetails();
        }else{
          alert("SOR No is required");
          this.router.navigate(['/order/process-order']);
        }

      },
    });
  }


  getEsmTrackingDetails(){
    let trackingNo="1000017240";
    this.drainService.GetEsmTrackingDetails(this.sorNo).subscribe({
      next: (response) => {
        if(response && response.Data.length > 0){
          this.rows = response.Data;
          console.log("getEsmTrackingDetails",this.rows);
        }
      },
      error: (e) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
