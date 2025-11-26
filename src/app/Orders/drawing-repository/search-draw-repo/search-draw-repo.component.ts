import { Component } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from 'src/app/services/login.service';
import { NgbDateFRParserFormatter } from 'src/app/SharedComponent/bootsrtap-date-range-picker-for-search/ngb-date-fr-parser-formatter';

@Component({
  selector: 'app-search-draw-repo',
  templateUrl: './search-draw-repo.component.html',
  styleUrls: ['./search-draw-repo.component.css']
})
export class SearchDrawRepoComponent {
  // {"CustomerCode":"0001101170","ProjectCode":"0000113012","FileName":"","DrawingNo":"","UpdateBy":"","UpdateDateFr":"2024-01-01","UpdateDateTo":"2024-07-17"}
  lHolidays:any;
  customerCode:any;
  projectCode:any;
  searchData:any = {
    updatedDateFrom:'',
    updatedDateTo:'',
    fileName:"",
    drawing_no:"",
    updateBy:""
  }
  constructor(
    public modal : NgbActiveModal,
    private dateFormatter: NgbDateFRParserFormatter,
    private calendar: NgbCalendar,
    private loginService: LoginService,
  ) {
    this.lHolidays = this.loginService.GetHoliday();
  }
  dismissModal(){
    this.modal.dismiss("User closed modal!");
  }
  applyData(){
    this.searchData.updatedDateFrom = this.validaDateValue(this.searchData.updatedDateFrom);
    this.searchData.updatedDateTo = this.validaDateValue(this.searchData.updatedDateTo);
    let obj ={
      CustomerCode:this.customerCode,
      ProjectCode:this.projectCode,
      FileName:this.searchData.fileName,
      DrawingNo:this.searchData.drawing_no,
      UpdateBy:this.searchData.updateBy,
      UpdateDateFr:this.searchData.updatedDateFrom,
      UpdateDateTo:this.searchData.updatedDateTo
    }
    this.modal.close(obj)
  }
  isWeekend = (date: NgbDate) => this.calendar.getWeekday(date) > 6;
  shouldHighlightDate(date: NgbDate): boolean {
    const dateToCheck = new Date(date.year, date.month - 1, date.day);
    let isHoliday = this.lHolidays.some((highlightedDate: any) => {
      return new Date(highlightedDate).getTime() === dateToCheck.getTime()
    });
    console.log("dateToCheck=>", isHoliday);
    return isHoliday || this.calendar.getWeekday(date) > 6;
  }
  validaDateValue(dateVal: any) {
    return dateVal ? this.dateFormatter.format(dateVal) : '';
  }
}
