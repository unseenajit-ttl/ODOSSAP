import { DatePipe } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UpcomingMailModel } from 'src/app/Model/upcoming_mail';
import { OrderService } from 'src/app/Orders/orders.service';
import { LoginService } from 'src/app/services/login.service';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { WbsService } from 'src/app/wbs/wbs.service';

@Component({
  selector: 'app-email-notification-to-detailer',
  templateUrl: './email-notification-to-detailer.component.html',
  styleUrls: ['./email-notification-to-detailer.component.css']
})
export class EmailNotificationToDetailerComponent {

  @Input() gOrderList: any;
  @Input() gStatus: any;
  @Input() gSuggestionMail: any;
  @Input() gWBS1: any;
  @Input() SelectedRecord: any
  @Input() selectedArray:any


  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();

  imputEmailTo: any = '';
  emailList: any[] = [];
  CCList :any[]=[];

  filteredSuggestions: any[] = [];
  previousInputs: any = [];
  NotificationLoading: boolean = false;

  Remarks: string = '';
  sentEmail: any;
  CustomerCode: any;
  ProjectCode: any;
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private orderService: OrderService,
    private wbsService: WbsService,
    private dropdown: CustomerProjectService,
    private elementRef: ElementRef,
    private loginServic:LoginService,
    private datePipe:DatePipe,
    private router:Router
  ) { }

  ngOnInit(): void {
    // this.previousInputs =
    //   JSON.parse(localStorage.getItem('notifiedEmails')!) ?? [];
    // this.GetEmail();
    // this.UpdatePrevEmail();

    this.CustomerCode = this.dropdown.getCustomerCode();
    //this.ProjectCode = this.dropdown.getProjectCode_Detailing();
    /**USERNAME FROM CUSTOMER PROJECT */
    this.LastUpcomingMail();

    // this.GetPrevUserName();
    console.log("selectedrecord",this.SelectedRecord)
    console.log("selectedArray",this.selectedArray)
  }

  GetEmail() {
    for (let i = 0; i < this.gOrderList.length; i++) {
      this.GetSubmitByEmail(this.gOrderList[i].OrderNo);
    }
  }

  SelectSuggestion(pEmail: any) {
    if (pEmail) {
      this.imputEmailTo = pEmail;
    }
  }

  AddEmail(pEmailId: string) {
    debugger
    if (pEmailId) {
      let lEmailId: any[] = [];
      let lRemainingEmail: any[] = [];
      if (pEmailId.includes(';')) {
        lEmailId = pEmailId.split(';');
      } else {
        lEmailId.push(pEmailId);
      }

      for (let i = 0; i < lEmailId.length; i++) {
        let tEmailId = lEmailId[i];

        if (this.ValidateEmail(tEmailId) == false) {
          this.toastr.error('InValid Email Id - ' + tEmailId);
          lRemainingEmail.push(tEmailId);
          continue;
        } else {
          if (tEmailId && !this.previousInputs.includes(tEmailId)) {
            this.previousInputs.push(tEmailId);
            this.imputEmailTo = '';
            //this.filteredSuggestions = [];
            localStorage.setItem(
              'notifiedEmails',
              JSON.stringify(this.previousInputs)
            );
          }
        }
        let lIndex = this.emailList.findIndex(
          (x) => x.toLowerCase() === tEmailId.toLowerCase()
        );
        if (lIndex != -1) {
          this.toastr.error('Email Id - ' + tEmailId + ' already added!');
          continue;
        }
        this.emailList.push(tEmailId);
        this.emailList = [...new Set(this.emailList)];
      }
      if (lRemainingEmail.length > 0) {
        this.imputEmailTo = lRemainingEmail.join(';');
      } else {
        this.imputEmailTo = '';
      }
      this.showFilterSuggestion = false;
    } else {
      this.toastr.error('In-Valid Email Id!');
    }
  }
  onInputChange() {
    if (this.imputEmailTo) {
      if (this.imputEmailTo.includes(';')) {
        let emails = this.imputEmailTo
          .split(';')
          .map((email: string) => email.trim().toLowerCase());
        console.log('Emails:', emails);
        this.filteredSuggestions = this.previousInputs.filter((input: any) => {
          let lowercasedInput = input.toLowerCase();
          console.log('Checking input:', lowercasedInput);
          let result = emails.some((emailPart: any) =>
            lowercasedInput.includes(emailPart)
          );
          console.log('Result:', result);
          return result;
        });
      } else {
        this.filteredSuggestions = this.previousInputs.filter((input: any) =>
          input.toLowerCase().includes(this.imputEmailTo.toLowerCase())
        );
      }
    } else {
      //this.filteredSuggestions = [];
    }
  }
  selectSuggestion(suggestion: any) {
    if (this.imputEmailTo && this.imputEmailTo.length > 0) {
      // if (this.imputEmailTo.includes(';')) {
      //   this.imputEmailTo = this.imputEmailTo + '' + suggestion;
      // } else {
      //   this.imputEmailTo = suggestion;
      // }

      this.AddEmail(suggestion);
      //this.filteredSuggestions = [];
    }
    if (suggestion) {
      this.AddEmail(suggestion);
    }
  }
  RemoveEmail(pEmailId: string) {
    let lIndex = this.emailList.findIndex(
      (x) => x.toLowerCase() === pEmailId.toLowerCase()
    );
    if (lIndex != -1) {
      this.emailList.splice(lIndex, 1);
    }
  }
   RemoveCC(pEmailId: string) {
    let lIndex = this.CCList.findIndex(
      (x) => x.toLowerCase() === pEmailId.toLowerCase()
    );
    if (lIndex != -1) {
      this.CCList.splice(lIndex, 1);
    }
  }
  emailCount: number = 0;
  SendNotificationtoDetailer() {
    debugger;
    // this.sentEmail = this.emailList.join(';');
     this.sentEmail = [...this.emailList];
    this.UpdateDrawingApprovedStatus();
    //this.activeModal.close(true);

  }

  getSelectedOrderNos(pProjectCode: any, pOrderList: any) {
    let lWBS1: any[] = [];
    let lWBS2: any[] = [];
    let lWBS3: any[] = [];
    let lStructureElement: any[] = [];
    let lProductType: any[] = [];
    let lForeCastDate: any[] = [];
    for (let i = 0; i < pOrderList.length; i++) {
      let lItem = pOrderList[i];
      if (lItem.ProjectCode == pProjectCode) {
        lWBS1.push(lItem.WBS1);
        lWBS2.push(lItem.WBS2);
        lWBS3.push(lItem.WBS3);
        lStructureElement.push(lItem.StructureElement);
        lProductType.push(lItem.ProdType);
        lForeCastDate.push(lItem.EstForecastDate);
      }
    }

    return {
      WBS1: lWBS1,
      WBS2: lWBS2,
      WBS3: lWBS3,
      StructureElement: lStructureElement,
      ProdType: lProductType,
      EstForecastDate: lForeCastDate,
    };
  }

  ValidateEmail(email: any) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  GetSubmitByEmail(pOrderNo: any) {
    this.orderService.GetSubmitByEmail(pOrderNo).subscribe({
      next: (response) => {
        if (response) {
          if (response.SubmitBy) {
            this.emailList.push(response.SubmitBy);
            this.emailList = [...new Set(this.emailList)];
          }
        }
      },
      error: (e) => {
        console.log(e.error);
      },
      complete: () => { },
    });
  }

  UpdatePrevEmail() {

    this.emailList = this.gSuggestionMail;
    this.emailList = [...new Set(this.emailList)];
  }

  userNameUpcoming: any[] = [];
  showFilterSuggestion: boolean = false;

  GetPrevUserName() {
    for (let i = 0; i < this.gOrderList.length; i++) {
      this.NotificationLoading = true;

      let obj = {
        CustomerCode: this.gOrderList[i].CustomerCode,
        ProjectCode: this.gOrderList[i].ProjectCode,
        WBS1: this.gOrderList[i].WBS1,
        WBS2: this.gOrderList[i].WBS2,
        WBS3: this.gOrderList[i].WBS3,
        StructureElement: this.gOrderList[i].StructureElement,
        ProductType: this.gOrderList[i].ProdType,
      };

      this.orderService.Upcoming_NotificationMail(obj).subscribe({
        next: (response) => {
          if (response.response == 'success') {
            if (response.result) {
              let lTempList = [];
              for (let i = 0; response.result.length; i++) {
                let lItem = response.result[i];
                if (lItem.EmailTo) {
                  lTempList.push(lItem.EmailTo);
                }
              }

              this.emailList = [...this.emailList, ...lTempList];
              this.emailList = [...new Set(this.emailList)];
            }
          }
        },
        error: (e) => {
          this.NotificationLoading = false;
        },
        complete: () => {
          //debugger;
          this.NotificationLoading = false;
        },
      });
    }
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;

    // Check if the clicked element is outside the target div
    if (!this.elementRef.nativeElement.querySelector('.clickable-div')?.contains(clickedElement)) {
      this.showFilterSuggestion = false;
      // Your logic when clicking outside
    }
  }

  //added
  async LastUpcomingMail() {
    debugger
    let customerCode = this.dropdown.getCustomerCode();
    let projectCode = this.gOrderList.ProjectCode;

    // for (let i = 0; i < this.gOrderList.length; i++) {
    //   projectCode = this.gOrderList[i].ProjectCode;
    // }
    let wbs1 = this.gWBS1;
    this.NotificationLoading = true;

    let lUserNames: any[] = [];

    this.GetDetailerName();
    this.GetDetailerNameSuggestion();
  }
  GetDetailerName() {
    debugger
    let customerCode = this.dropdown.getCustomerCode();
    let projectCode = this.gOrderList.ProjectCode;
    let wbselementId = this.gOrderList.intWBSElementID
    // for (let i = 0; i < this.gOrderList.length; i++) {
    //   projectCode = this.gOrderList[i].ProjectCode;
    // }
    this.NotificationLoading = true;
     this.wbsService
      . GetDetailersByCustomerAndProject(customerCode, projectCode,wbselementId)
      .subscribe({
        next: (response) => {
          this.emailList = response[0].EmailTo.split(';');
           this.CCList = response[0].EmailCc.split(';');
          this.userNameUpcoming = this.emailList;

          // this.userNameUpcoming = response.EmailTo;
          // this.emailList = [...this.emailList, ...response.EmailTo];
          // this.emailList = [...new Set(this.emailList)];
          // this.CCList=[...response.EmailCc];
          // this.CCList=[...new Set(this.CCList)]
        },
        error: (e) => {
          this.NotificationLoading = false;
        },
        complete: () => {
          //debugger;
          this.NotificationLoading = false;
        },
      });
  }
  GetDetailerNameSuggestion() {
    debugger
    let customerCode = this.dropdown.getCustomerCode();
    let projectCode = this.gOrderList.ProjectCode;
    let wbselementId =this.gOrderList.intWBSElementID
    // for (let i = 0; i < this.gOrderList.length; i++) {
    //   projectCode = this.gOrderList[i].ProjectCode;
    // }
    this.NotificationLoading = true;

    this.wbsService
      . GetDetailersByCustomerAndProject(customerCode, projectCode,wbselementId)
      .subscribe({
        next: (response) => {
          this.userNameUpcoming = response.EmailTo;
          this.filteredSuggestions = [...this.filteredSuggestions, ...response.EmailTo];
          this.filteredSuggestions = [...new Set(this.filteredSuggestions)];
        },
        error: (e) => {
          this.NotificationLoading = false;
        },
        complete: () => {
          //debugger;
          this.NotificationLoading = false;
        },
      });
  }

  RemarkInput() {
    const inputElement = document.getElementById('Remark');
    if (inputElement) {
      inputElement.focus();
    }
  }

  isUpdated:any;
  UpdateDrawingApprovedStatus() {
    let obj = {
      ProjectCode: this.gOrderList.ProjectCode,
      WBSElementId: this.gOrderList.intWBSElementID,
      CustRemark: this.Remarks,
      ApprovedBy: this.loginServic.GetGroupName(),
      Status: this.gStatus
    };

    this.wbsService.UpdateDrawingApprovalStatus(obj).subscribe({
      next: (response) => {
        debugger
        this.isUpdated=response;
        if (this.gStatus == true && response == 1) {
          this.toastr.success("WBS Drawing is Approved Successfully!");
          this.ApproveDrawing();

        }
        else if (this.gStatus == false && response == 1) {
          this.toastr.error("WBS Drawing is Rejected");
          this.ApproveDrawing();

        }
        else {
          this.toastr.warning("Failed to Approve/Reject drawing!");
          return
        }


      },
      error: (e) => {
        console.log(e.error);
      },
      complete: () => {
        if (this.gStatus==true && this.isUpdated==1) {
          //this.toastr.success("WBS Drawing is Approved Successfully!");

          setTimeout(() => {
            if (confirm("Proceed to place the order?")) {
              this.redirectToCreateOrderPage();
            }
          }, 300);
        }
        //this.ApproveDrawing();
        this.activeModal.close(true);
      },
    });
  }


  ApproveDrawing()
  {

    let content = this.getTableHTML_AfterRejection(this.gOrderList);
    const obj = {
       EmailTo: this.sentEmail.join(';'),
       EmailCc: this.CCList.join(';'),
       Subject: 'Drawing Status',
       Content: content
    }
  this.wbsService.SendEmail(obj).subscribe({

    next:(response)=>{
      this.toastr.success("Email send Successfully")

    },
    error:(error)=>{
      this.toastr.error("Failed to send email")
    },
    complete:()=>{
    }
  })
  }
  getTableHTML_AfterRejection(item:any): string {
    // this.selectedprojectName = this.dropdown.getProjectCode();
    return `
    <div style="display: flex;justify-content: center;margin-top: 20px; margin-bottom: 20px;">
    <span><strong>DRAWING SUBMITTED FOR APPROVAL  (图纸已提交审批)</strong></span>
  </div>
      <table style="width:100.0%"; margin-top: 20px;" cellpadding="0" border="1" class="x_MsoNormalTable">
        <tbody>
          <tr>
            <td style="width:20.0%; padding:.75pt .75pt .75pt .75pt" width="20%">
              <p class="x_MsoNormal">Customer (<span lang="ZH-CN">客户名称</span>)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt" colspan="5">
              <p class="x_MsoNormal">${this.CustomerCode}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:.75pt .75pt .75pt .75pt">
              <p class="x_MsoNormal">Project (<span lang="ZH-CN">工程项目</span>)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt" colspan="5">
              <p class="x_MsoNormal">${this.ProjectCode}</p>
            </td>
          </tr>
          <!-- Block, Storey, and Part in one row -->
          <tr>
            <td style="width:20.0%; padding:.75pt .75pt .75pt .75pt" width="20%">
              <p class="x_MsoNormal">Block (WBS1) <br>(<span lang="ZH-CN">座号</span>/<span lang="ZH-CN">大牌</span>)</p>
            </td>
            <td style="width:15.0%; padding:.75pt .75pt .75pt .75pt" width="15%">
              <p class="x_MsoNormal"><strong><span style="font-family:SimSun">${item.WBS1}</span></strong></p>
            </td>
            <td style="width:17.0%; padding:.75pt .75pt .75pt .75pt" width="17%">
              <p class="x_MsoNormal">Storey (WBS2) <br>(<span lang="ZH-CN">楼层</span>)</p>
            </td>
            <td style="width:14.0%; padding:.75pt .75pt .75pt .75pt" width="14%">
              <p class="x_MsoNormal"><strong><span style="font-family:SimSun">${item.WBS2}</span></strong></p>
            </td>
            <td style="width:16.0%; padding:.75pt .75pt .75pt .75pt" width="16%">
              <p class="x_MsoNormal">Part (WBS3) <br>(<span lang="ZH-CN">分部</span>)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt">
              <p class="x_MsoNormal"><strong><span style="font-family:SimSun">${item.WBS3}</span></strong></p>
            </td>
          </tr>
          <!-- Additional Rows -->
          <tr>
            <td style="padding:.75pt .75pt .75pt .75pt">
              <p class="x_MsoNormal">Structure Element (构件)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt" colspan="5">
              <p class="x_MsoNormal"><strong>${item.StructureElement}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding:.75pt .75pt .75pt .75pt">
              <p class="x_MsoNormal">Product Type (产品类型)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt" colspan="5">
              <p class="x_MsoNormal"><strong>${item.ProductType}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding:.75pt .75pt .75pt .75pt">
              <p class="x_MsoNormal">Order Weight (详细说明)</p>
            </td>
            <td style="padding:.75pt .75pt .75pt .75pt" colspan="5">1.00</td>
          </tr>
        </tbody>
      </table>

       <div style="display: flex;justify-content: center;margin-top: 20px; margin-bottom: 20px;">
      <span><strong>ADDITIONAL DRAWING DETAILS</strong></span>
    </div>
    <table style="width:100%; margin-top: 20px;" cellpadding="0" border="1" class="x_MsoNormalTable">
      <thead>
        <tr>
        <th style="width:5%; padding:.75pt .75pt .75pt .75pt">Drawing No</th>
          <th style="width:20%; padding:.75pt .75pt .75pt .75pt">Document Name</th>
          <th style="width:5%; padding:.75pt .75pt .75pt .75pt">Revision</th>
          <th style="width:20%; padding:.75pt .75pt .75pt .75pt">Detailer Remarks</th>
          <th style="width:10%; padding:.75pt .75pt .75pt .75pt">Date of Submission</th>
          <th style="width:20%; padding:.75pt .75pt .75pt .75pt">Customer Remark</th>
          <th style="width:20%; padding:.75pt .75pt .75pt .75pt">Date of Approval</th>
                    <th style="width:5%; padding:.75pt .75pt .75pt .75pt">Status</th>

        </tr>
      </thead>
      <tbody>
        ${item.Drawing_List.map((drawing:any) => `
          <tr>
            <td style="padding:.75pt .75pt .75pt .75pt"><p class="x_MsoNormal">${drawing.DrawingNo}</p></td>
            <td style="padding:.75pt .75pt .75pt .75pt"><p class="x_MsoNormal">${drawing.FileName}</p></td>
            <td style="padding:.75pt .75pt .75pt .75pt"><p class="x_MsoNormal">${drawing.Revision}</p></td>
            <td style="padding:.75pt .75pt .75pt .75pt"><p class="x_MsoNormal">${drawing.Remarks}</p></td>
            <td style="padding:.75pt .75pt .75pt .75pt"><p class="x_MsoNormal">${this.formatDate(drawing.UpdatedDate.toString())}</p></td>
            <td style="padding:.75pt .75pt .75pt .75pt"><p class="x_MsoNormal">${ this.Remarks || ''}</p></td>
            <td style="padding:.75pt .75pt .75pt .75pt"><p class="x_MsoNormal">${this.gStatus?this.formatDate((new Date().toString())):''}</p></td>

                        <td style="padding:.75pt .75pt .75pt .75pt"><p class="x_MsoNormal">${this.gStatus?'Approved':'Rejected'}</p></td>

          </tr>
        `).join('')}
      </tbody>
    </table>
    `;
  }
  ConvertToDate(dateString:string)
  {
    const date = new Date(dateString);

    // Convert the date to ISO format
    return date.toISOString();
  }
  formatDate(isoDate: string): string | null {
    return this.datePipe.transform(isoDate, 'yyyy-MM-dd hh:mm a');
  }

  redirectToCreateOrderPage() {
    debugger
    this.NotificationLoading = true;

    // Navigate to the order creation route with query params
    this.router.navigate(['/order/createorder'], {
      queryParams: {
        customer: this.CustomerCode,
        project: this.gOrderList.ProjectCode,
        wbs1: this.gOrderList.WBS1,
        wbs2: this.gOrderList.WBS2,
        wbs3: this.gOrderList.WBS3,
        structure: this.gOrderList.StructureElement
      }
    })

  }

}
