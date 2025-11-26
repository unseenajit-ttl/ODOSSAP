import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../orders.service';
import { OfflineCopyBBS } from 'src/app/Model/OfflineCopyBBS';

@Component({
  selector: 'app-copybbsoffline',
  templateUrl: './copybbsoffline.component.html',
  styleUrls: ['./copybbsoffline.component.css']
})
export class CopybbsofflineComponent implements OnInit {
  CustomerList: any[] = [];
  ProjectCodeList: any[] = [];
  POList: any[] = [];
  option1 = true;
  option2 = false;
  SearchData: OfflineCopyBBS = {
    PONo: '',
    CustomerName: '',
    ProjectTitle: ['']
    
  };
  ngOnInit(): void {
    this.GetCustomerSelectList();
    //throw new Error('Method not implemented.');
  }
  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrderService,
  
  ) { }
  GetCustomerSelectList() {
    // var pUserType = 'AD';
    // var pGroupName = 'jagdishh_ttl@natsteel.com.sg';
    this.orderService.getCustomerSelectList().subscribe({
      next: (response) => {
        console.log('CustomerList', response);
        this.CustomerList = response;
      },
      error: (e) => { },
      complete: () => { },
    });
  }

  GetProjectSelectList() {
    console.log(this.SearchData.CustomerName);
    var CustomerCode = this.SearchData.CustomerName;
    // var pUserType = "AD";
    // var pGroupName = "jagdishh_ttl@natsteel.com.sg";
    this.orderService.getProjectSelectList(CustomerCode).subscribe({
      next: (response) => {
        console.log('ProjectCodeList', response);
        this.ProjectCodeList = response;
        this.SearchData.ProjectTitle = [];
      },
      error: (e) => { },
      complete: () => { },
    });
  }
  setProjectSelectList() {
    console.log(this.SearchData.CustomerName);
    var CustomerCode = this.SearchData.CustomerName;
    this.orderService.getProjectSelectList(CustomerCode).subscribe({
      next: (response) => {
        this.ProjectCodeList = response;
      },
      error: (e) => { },
      complete: () => { },
    });
  }
  
  GetPOList() {
    console.log(this.SearchData.CustomerName);
    var CustomerCode = this.SearchData.CustomerName;
    var ProjectCode = this.SearchData.ProjectTitle;
    // var pUserType = "AD";
    // var pGroupName = "jagdishh_ttl@natsteel.com.sg";
    this.orderService.getPOSelectList(CustomerCode,ProjectCode).subscribe({
      next: (response) => {
        console.log('POList', response);
        this.POList = response;
        //this.SearchData.ProjectTitle = [];
      },
      error: (e) => { },
      complete: () => { },
    });
  }

  changediv(divid:string) {
    if (divid === "OfflineBBS") {
      this.option1 = true;
      this.option2 = false;
    }
    else if (divid === "OnlineBBS") {
      this.option1 = false;
      this.option2 = true;
    }

  }
}
