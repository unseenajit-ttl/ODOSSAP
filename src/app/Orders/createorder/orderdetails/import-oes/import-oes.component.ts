import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from 'src/app/Orders/orders.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { ImportOESSucessComponent } from './import-oessucess/import-oessucess.component';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-import-oes',
  templateUrl: './import-oes.component.html',
  styleUrls: ['./import-oes.component.css'],
})
export class ImportOesComponent implements OnInit {
  @Input() CustomerCode: any;
  @Input() ProjectCode: any;
  @Input() JobID: any;
  SelectedFile: any;


  UpdatedBBSNo: any;

  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();

  ImportOrderLoading: boolean = false;
  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrderService,
    private dropdown: CustomerProjectService,
    private modalService: NgbModal,
    private loginService: LoginService
  ) { }
  ngOnInit(): void { }

  Import() {
    debugger;
    this.ImportOrderLoading = true;
    const formData = new FormData();
    // this.CustomerCode = '0001101200';
    // this.ProjectCode = '0000113013';
    // this.JobID = '700';
    var Temp: any = document.getElementById('OrderExcelImport');
    let file: File = Temp.files[0];
    // formData.append('file', file, file.name);
    formData.append('excelImport', file as Blob);
    formData.append('CustomerCode', this.CustomerCode);
    formData.append('ProjectCode', this.ProjectCode);
    formData.append('JobID', this.JobID);
    formData.append('UserName', this.loginService.GetGroupName());
    

    console.log('formData', formData);
    this.orderService.OESImport(formData).subscribe({
      next: async (response) => {
        console.log(response);
        if (response.success == true) {
          alert(
            'Excel import is completed sucessfully. (导入钢筋加工表已成功完成.)'
          );
          // this.saveTrigger.emit(response);
          let lTotal = response.message;
          if(!isNaN(lTotal)){
            lTotal = (Math.round(Number(lTotal) * 100) / 100).toString();
          }
          let lPONo = response.pono;
          let lBBSNo = response.bbsno;
          let lWt=0;
          let lWeightResponse = await this.GetImportWeight(this.JobID);
          if (lWeightResponse != 'error') {
            if (lWeightResponse.TotalWeight) {
              lWt = lWeightResponse.TotalWeight;
            }
          }
          this.UpdatedBBSNo = response.bbsno;

          this.ImportOESSucess(lWt, lTotal, lPONo, lBBSNo);
          // this.modalService.dismissAll();
          this.ImportOrderLoading = false;
        } else {
          alert('Import error. Please try again.');
          this.ImportOrderLoading = false;
        }
      },
      error: (e) => { 
        alert('Import error. Please try again.');
        this.ImportOrderLoading = false;
      },
      complete: () => {
        // this.loading = false;
      },
    });
  }

  async GetImportWeight(lJobId: any): Promise<any> {
    try {
      let lCustomerCode = this.dropdown.getCustomerCode();
      let lProjectCode = this.dropdown.getProjectCode()[0];
      const data = await this.orderService
        .getOrderDetailsCAB(lCustomerCode, lProjectCode, lJobId)
        .toPromise();
      return data;
    } catch (error) {
      console.log(error);
      return 'error';
    }
  }

  ImportOESSucess(lWt: any, lTotal: any, lPONo: any, lBBSNo: any) {
    debugger;

    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'xl',
      windowClass: 'your-custom-dialog-class',
    };
    const modalRef = this.modalService.open(
      ImportOESSucessComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.lWt = lWt;
    modalRef.componentInstance.lTotal = lTotal;
    modalRef.componentInstance.lPONo = lPONo;
    modalRef.componentInstance.lBBSNo = lBBSNo;
modalRef.componentInstance.saveTrigger.subscribe((x: any) => {
      if (x==true){  
        this.Cancel();
      }
    });
  }

  Cancel() {
    this.modalService.dismissAll();
    this.saveTrigger.emit(this.UpdatedBBSNo);
  }

  ExcelfileCheck(obj: any) {
    var fileExtension = ['xlsx', 'xlsm'];

    if (this.SelectedFile.split('.').pop()) {
      if (
        !fileExtension.includes(
          this.SelectedFile.split('.').pop().toLowerCase()
        )
      ) {
        alert("Only '.xlsx','.xlsm' formats are allowed.");
        this.SelectedFile = undefined;
        return;
      }
    } else {
      alert("Only '.xlsx','.xlsm' formats are allowed.");
      this.SelectedFile = undefined;
      return;
    }
  }
}
