import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from 'src/app/Orders/orders.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-import-order-details',
  templateUrl: './import-order-details.component.html',
  styleUrls: ['./import-order-details.component.css'],
})
export class ImportOrderDetailsComponent implements OnInit {
  selectedFile: File | null = null;

  @Input() CustomerCode:any;
  @Input() ProjectCode:any;
  @Input() JobID:any;
  @Input() BBSID:any;
  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();

  ImportOrderLoading: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private http: HttpClient,
    private orderService: OrderService,
    private loginService: LoginService
  ) { }
  ngOnInit(): void {

    let receivedData: any = localStorage.getItem('ImportOrderDetails');
    receivedData = JSON.parse(receivedData);
    if (receivedData) {
      this.CustomerCode = receivedData.CustomerCode;
      this.ProjectCode = receivedData.ProjectCode;
      this.BBSID = receivedData.BBSId;
      this.JobID = receivedData.Jobids;
    }
    localStorage.removeItem('ImportOrderDetails');

  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  onUpload() {
    debugger;
    this.ImportOrderLoading = true; // Start loading.
    const formData = new FormData();
    // this.CustomerCode = '0001101510';
    // this.ProjectCode = '0000113015';
    // this.JobID = '7';
    // this.BBSID = '1';
    formData.append('excelImport', this.selectedFile as Blob);
    formData.append('CustomerCode', this.CustomerCode);
    formData.append('ProjectCode', this.ProjectCode);
    formData.append('JobID', this.JobID);
    formData.append('BBSID', this.BBSID);
    formData.append('UserName', this.loginService.GetGroupName());
    console.log('formData', formData);
    this.orderService.ExcelImport(formData).subscribe({
      next: (response) => {
        console.log(response);
        this.ImportOrderLoading = false; // Stop loading.
        if (response.success == true) {
          alert(
            'Excel import is completed sucessfully. (导入钢筋加工表已成功完成.)'
          );
          this.activeModal.dismiss('Cross click') // Close Popup.
        } else {
          alert('Import error. Please try again.');
          this.activeModal.dismiss('Cross click') // Close Popup.
        }
      },
      error: (e) => { 
        this.ImportOrderLoading = false; // Stop loading.
      },
      complete: () => {
        this.ImportOrderLoading = true; // Stop loading.
      },
    });
  }
}
