import { Component, EventEmitter, HostListener, Input, OnInit, Output ,ElementRef} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UpcomingMailModel } from 'src/app/Model/upcoming_mail';
import { CustomerProjectService } from 'src/app/SharedServices/customer-project.service';
import { OrderService } from '../../orders.service';

@Component({
  selector: 'app-email-notification',
  templateUrl: './email-notification.component.html',
  styleUrls: ['./email-notification.component.css'],
})
export class EmailNotificationComponent implements OnInit {
  @Input() gOrderList: any;
  @Input() gSuggestionMail: any;
  @Input() gWBS1: any;

  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();

  imputEmailTo: any = '';
  emailList: any[] = [];

  filteredSuggestions: any[] = [];
  previousInputs: any = [];
  NotificationLoading: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private orderService: OrderService,
    private dropdown: CustomerProjectService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    // this.previousInputs =
    //   JSON.parse(localStorage.getItem('notifiedEmails')!) ?? [];
    // this.GetEmail();
    // this.UpdatePrevEmail();

    /**USERNAME FROM CUSTOMER PROJECT */
    this.LastUpcomingMail();
    // this.GetUserNameUpcoming();
    // this.GetPrevUserName();
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
      this.showFilterSuggestion=false;
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
    if(suggestion){
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
  emailCount: number = 0;
  SendNotification() {
    let lSentTo = this.emailList.join(';');
    /** Check if there are email entered */
    if (lSentTo) {
      /** Filter the Selected records based on their ProjectCodes */
      let lProjectCodes: any[] = [];
      for (let i = 0; i < this.gOrderList.length; i++) {
        if (lProjectCodes.includes(this.gOrderList[i].ProjectCode)) {
          continue;
        }
        lProjectCodes.push(this.gOrderList[i].ProjectCode);
      }

      /** Take user confirmation for orders with multiple Projects */
      if (lProjectCodes.length > 1) {
        if (
          confirm(
            'The Selcted orders have differnt Projects. A separate E-Mail will be sent for each Project.'
          ) == false
        ) {
          return;
        }
      }
      this.NotificationLoading = true;
      this.emailCount = lProjectCodes.length;
      /** Send a different mail for different ProjectCode */
      for (let i = 0; i < lProjectCodes.length; i++) {
        /** Clu all the orders which have the same ProjectCodes */
        let lObj = this.getSelectedOrderNos(lProjectCodes[i], this.gOrderList);
        let lCustomerCode = this.dropdown.getCustomerCode();
        let obj: UpcomingMailModel = {
          EmailTo: lSentTo, // "Ajit.kamble@tatatechnologies.com;kunal.ayer@tatatechnologies.com",
          CustomerCode: lCustomerCode, //"0001101170",
          ProjectCode: lProjectCodes[i], // "0000113012",
          WBS1: lObj.WBS1,
          WBS2: lObj.WBS2,
          WBS3: lObj.WBS3,
          StructureElement: lObj.StructureElement,
          ProductType: lObj.ProdType,
          ForeCastDate: lObj.EstForecastDate,

          EmailBy: '',
        };
        this.orderService.sendEmailNotification(obj).subscribe({
          next: (response) => {
            if (response) {
              // this.modalService.dismissAll();
              if (this.emailCount == 1) {
                this.toastr.success('Email sent Successfully 邮件发送成功');
                this.emailCount = 0;
                this.NotificationLoading = false;

                //**Collapse popUp */
                this.modalService.dismissAll();
                this.saveTrigger.emit(this.emailList.join(';'));
              } else {
                this.emailCount -= 1;
              }
            }
          },
          error: (e) => {
            alert('Cannot send Email. Please check the Internet connection.');
            this.NotificationLoading = false;
          },
          complete: () => {},
        });
      }
    } else {
      this.toastr.error('In-Valid Email Id!');
    }
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
      complete: () => {},
    });
  }

  UpdatePrevEmail() {
    // for (let i = 0; i < this.gOrderList.length; i++) {
    //   let lItem = this.gOrderList[i];
    //   let lEmail = lItem.NotifiedEmailId;
    //   if (lEmail) {
    //     if (lEmail.includes(',')) {
    //       let lEmailIds = lEmail.split(',');
    //       lEmailIds.forEach((element: any) => this.emailList.push(element));
    //     } else {
    //       this.emailList.push(lEmail);
    //     }
    //     this.emailList = [...new Set(this.emailList)];
    //   }
    // }
    this.emailList = this.gSuggestionMail;
    this.emailList = [...new Set(this.emailList)];
  }

  userNameUpcoming: any[] = [];
showFilterSuggestion:boolean=false;
  GetUserNameUpcomingSuggestion(){
    let customerCode = this.dropdown.getCustomerCode();
    let projectCode = this.dropdown.getProjectCode()[0];
    this.NotificationLoading = true;

    this.orderService
      .Get_UserNameUpcoming(customerCode, projectCode)
      .subscribe({
        next: (response) => {
          this.userNameUpcoming = response;

          this.filteredSuggestions = [...this.filteredSuggestions, ...response];
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

  GetUserNameUpcoming() {
    let customerCode = this.dropdown.getCustomerCode();
    let projectCode = this.dropdown.getProjectCode()[0];
    this.NotificationLoading = true;

    this.orderService
      .Get_UserNameUpcoming(customerCode, projectCode)
      .subscribe({
        next: (response) => {
          this.userNameUpcoming = response;

          this.emailList = [...this.emailList, ...response];
          this.emailList = [...new Set(this.emailList)];
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

  async LastUpcomingMail() {
    let customerCode = this.dropdown.getCustomerCode();
    let projectCode = this.dropdown.getProjectCode()[0];
    let wbs1 = this.gWBS1;
    this.NotificationLoading = true;

    let lUserNames: any[] = [];

    for (let i = 0; i < wbs1.length; i++) {
      let response: any = await this.getLastUpcomingMail(
        customerCode,
        projectCode,
        wbs1[i]
      );
      if (response != 'error') {
        if (response.length != 0) {
            let lTempList: any[] = [];
            for (let i = 0; i<response.length; i++) {
              let lItem = response[i];
              if (lItem.EmailTo) {

                let lTemp = lItem.EmailTo.split(';');
                // lTempList.push(lItem.EmailTo);
                lTempList = [...lTempList, ...lTemp];
                lTempList = [...new Set(lTempList)];
              }
            }
            lUserNames = [...lUserNames, ...lTempList];
        }
        // if (response.length != 0) {

        //   for (let i = 0; response.result.length; i++) {
        //     let lItem = response.result[i];
        //     if (lItem.EmailTo) {
        //       lTempList.push(lItem.EmailTo);
        //     }
        //   }
        //   lUserNames = [...lUserNames, ...response];
        // }
      }
    }
    //CLOSE LOADER
    this.NotificationLoading = false;
    //REMOVE DUPLICATES
    lUserNames = [...new Set(lUserNames)];

    if (lUserNames.length == 0) {
      this.GetUserNameUpcoming();
    } else {
      this.emailList = [...this.emailList, ...lUserNames];
      this.emailList = [...new Set(this.emailList)];
    }
    this.GetUserNameUpcomingSuggestion();
  }

  async getLastUpcomingMail(
    customerCode: any,
    projectCode: any,
    wbs1: any
  ): Promise<any> {
    try {
      const data = await this.orderService
        .LastUpcomingMail(customerCode, projectCode, wbs1)
        .toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return 'error';
    }
  }

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
      this.showFilterSuggestion =false;
      // Your logic when clicking outside
    }
  }
}
