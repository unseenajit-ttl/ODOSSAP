import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { BorePileService } from '../../Services/BPC/bore-pile.service';


@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

Product_Type: any=undefined;
ProductTypeList: any;
  selectedCustomer: any;
  SelectedProjectID:number =0;

  constructor(public activeModal: NgbActiveModal,
    private BPCService:BorePileService,
    private reloadService: ReloadService,
    private dropdown: CustomerProjectService,
    private tosterService: ToastrService,
    ) {}
  ngOnInit(): void {
    this.Load_ProductType()  
    this.reloadService.reloadCustomer$.subscribe((data) => {
      this.selectedCustomer = this.dropdown.getCustomerCode()
    });


    this.reloadService.reload$.subscribe((data) => {
      if (true) {
        this.SelectedProjectID = this.dropdown.getDetailingProjectId();
        console.log("Changed  Project id=" + this.SelectedProjectID)
        if (this.SelectedProjectID !== undefined) {
      

    
        }

      }
    });
    debugger;

    this.selectedCustomer = this.dropdown.getCustomerCode()
    this.SelectedProjectID = this.dropdown.getDetailingProjectId();
  }

 
  


  Submit() {
   if(this.Product_Type)
   {
    this.BPCService.InsertParameterSet_BorePile(this.SelectedProjectID,this.Product_Type)
    .subscribe({
      next: (response) => {
       
      },
      error: (e) => {
        this.tosterService.error(e.error);
      },
      complete: () => {
        this.tosterService.success("Parameterset Added Successfully")
        this.activeModal.close(this.Product_Type);

      },
    });
   }
   else{
    this.tosterService.warning("Please Select Product Type");
   }

  }

  Load_ProductType()
  {
    this.BPCService.GetProductType_BorePile()
        .subscribe({
          next: (response) => {
            debugger;
            this.ProductTypeList = response;
          },
          error: (e) => {

          },
          complete: () => {

          },
        });
  }
}
