import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatDateFormats,
} from '@angular/material/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/Orders/orders.service';
export const MY_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD', //YYYY-MM-DD
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-notification-info',
  templateUrl: './notification-info.component.html',
  styleUrls: ['./notification-info.component.css'],
  providers: [
    DatePipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class NotificationInfoComponent implements OnInit {
  @Input() OrderInfo: any;

  gNotificationDate: any = '';
  gNotificationEmails: any;
  gIsNotifiactionSent: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private orderService: OrderService
  ) {}
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.GetNotificationInfo(this.OrderInfo);
    this.GetPrevUserName();
  }

  GetNotificationInfo(pOrderInfo: any) {
    /**
     * API call to get whether notification has been reiously sent to anyone, if YES then depla records.
     */

    this.gIsNotifiactionSent = false;

    if (pOrderInfo.NotifiedEmailId) {
      this.gNotificationDate = pOrderInfo.NotifiedEmailDate;
      this.gIsNotifiactionSent = true;

      if (pOrderInfo.NotifiedEmailId.includes(';')) {
        let lNotificationSentTo = pOrderInfo.NotifiedEmailId.replaceAll(
          ';',
          ', '
        );
        this.gNotificationEmails = lNotificationSentTo;
      } else {
        let lNotificationSentTo = pOrderInfo.NotifiedEmailId;
        this.gNotificationEmails = lNotificationSentTo;
      }
    }
  }

  GetPrevUserName() {
    // this.NotificationLoading = true;
    //this.OrderInfo.OrderNo
    let obj = {
      CustomerCode: this.OrderInfo.CustomerCode,
      ProjectCode: this.OrderInfo.ProjectCode,
      WBS1: this.OrderInfo.WBS1,
      WBS2: this.OrderInfo.WBS2,
      WBS3: this.OrderInfo.WBS3,
      StructureElement: this.OrderInfo.StructureElement,
      ProductType: this.OrderInfo.ProdType,
    };
    this.orderService.Upcoming_NotificationMail(obj).subscribe({
      next: (response) => {
        if (response.response == 'success') {
          if (response.result) {
            this.UpdateNotificationInfo(response.result);
            // let lTempList = [];
            // for (let i = 0; response.result.length; i++) {
            //   let lItem = response.result[i];
            //   if (lItem.EmailTo) {
            //     lTempList.push(lItem.EmailTo);
            //   }
            // }

            // this.emailList = [...this.emailList, ...lTempList];
            // this.emailList = [...new Set(this.emailList)];
          }
        }
      },
      error: (e) => {
        // this.NotificationLoading = false;
      },
      complete: () => {
        //debugger;
        // this.NotificationLoading = false;
      },
    });
  }

  pNotificationInfo: any[] = [];
  UpdateNotificationInfo(pData: any) {
    for (let i = 0; i < pData.length; i++) {
      let lItem = pData[i];
      let obj = {
        lNotificationTo: lItem.EmailTo.split(';'),
        lNotificationDate: this.SetDateTime(lItem.Date),
      };
      this.pNotificationInfo.push(obj);
    }
  }

  SetDateTime(pDate: any) {
    const pDateTime = new Date(pDate);
    const pDateTimeString = pDateTime.toLocaleString();
    const time = pDateTimeString.split(',')[1];
    const lDate =
      pDateTime.getDate() < 10
        ? '0' + pDateTime.getDate()
        : pDateTime.getDate();
    const lMonth =
      pDateTime.getMonth() + 1 < 10
        ? '0' + (pDateTime.getMonth() + 1)
        : pDateTime.getMonth() + 1;
    const lYear = pDateTime.getFullYear();

    return `${lDate}/${lMonth}/${lYear}, ${time}`;
  }
}
