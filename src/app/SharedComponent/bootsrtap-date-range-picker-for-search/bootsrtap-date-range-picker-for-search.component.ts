import {Component, ViewChild, OnInit, ElementRef, Renderer2, EventEmitter, Output, Input, SimpleChanges} from '@angular/core';
import {
    NgbDatepicker,
    NgbInputDatepicker,
    NgbDateStruct,
    NgbCalendar,
    NgbDateAdapter,
    NgbDateParserFormatter,
    NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {NgModel} from "@angular/forms";

import {Subscription} from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import moment from 'moment';
import { ReloadService } from 'src/app/SharedServices/reload.service';
import { CommonService } from 'src/app/SharedServices/CommonService';

const now = new Date();
const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;

@Component({
  selector: 'app-bootsrtap-date-range-picker-for-search',
  templateUrl: './bootsrtap-date-range-picker-for-search.component.html',
  styleUrls: ['./bootsrtap-date-range-picker-for-search.component.css'],
})
export class BootsrtapDateRangePickerForSearchComponent {
  startDate!: NgbDateStruct;
  maxDate!: NgbDateStruct;
  minDate!: NgbDateStruct;
  hoveredDate!: NgbDateStruct;
  fromDate: any;
  toDate: any;
  model!: { begin: NgbDateStruct; end: NgbDateStruct } | null;
  private _subscription!: Subscription;
  private _selectSubscription!: Subscription;
  @ViewChild('d') input!: NgbInputDatepicker;
  @ViewChild(NgModel) datePick!: NgModel;
  @ViewChild('myRangeInput') myRangeInput!: ElementRef;
  @Input() controlName!: any;
  @Input() clearInput!: any;
  @Input() isDelivery: boolean = false;
  @Output() dateRangeSelection = new EventEmitter<{ from: any; to: any }>();
  holidayList: any;
  dateParsed: string = '';

  isHovered = (date: any) =>
    this.fromDate &&
    !this.toDate &&
    this.hoveredDate &&
    after(date, this.fromDate) &&
    before(date, this.hoveredDate);
  isInside = (date: any) =>
    after(date, this.fromDate) && before(date, this.toDate);
  isFrom = (date: any) => equals(date, this.fromDate);
  isTo = (date: any) => equals(date, this.toDate);

  constructor(
    element: ElementRef,
    private renderer: Renderer2,
    private calendar: NgbCalendar,
    private _parserFormatter: NgbDateParserFormatter,
    private loginService: LoginService,
    private reloadService: ReloadService,
    private commonService:CommonService
  ) {}
  ngOnInit() {
    debugger;
    this.reloadService.reload$.subscribe((data) => {
      if (true) {
        this.isRefreshDeliveredDate();
      }
    });
    this.startDate = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    };
    this.maxDate = {
      year: now.getFullYear() + 1,
      month: now.getMonth() + 1,
      day: now.getDate(),
    };
    this.minDate = {
      year: now.getFullYear() - 5,
      month: 1,
      day: 1,
    };
    this.holidayList = this.loginService.GetHoliday();
  }
  ngAfterViewInit() {
    if (this.isDelivery) {
      const date = moment().subtract(7, 'days');
      this.fromDate = {
        year: date.year(),
        month: date.month() + 1,
        day: date.date(),
      };

      this.toDate = {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
      };
      this.model = { begin: this.fromDate, end: this.toDate };
      let delvValue = '';
      delvValue += this._parserFormatter.format(this.fromDate);
      delvValue += '-';
      delvValue += this._parserFormatter.format(this.toDate);
      this.renderer.setProperty(
        this.myRangeInput.nativeElement,
        'placeholder',
        delvValue
      );
      console.log(
        'this.holidayList=>',
        this.myRangeInput.nativeElement,
        delvValue,
        this.model
      );
    }
  }

  onDateSelection(date: NgbDateStruct) {
    let parsed = '';
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate) {
      this.toDate = date;
      // this.model = `${this.fromDate.year} - ${this.toDate.year}`;
      this.input.close();
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    if (this.fromDate) {
      parsed += this._parserFormatter.format(this.fromDate);
    }
    if (this.toDate) {
      parsed += ' - ' + this._parserFormatter.format(this.toDate);
      const dateRange = {
        from: moment([
          this.fromDate.year,
          this.fromDate.month - 1,
          this.fromDate.day,
        ]),
        to: moment([this.toDate.year, this.toDate.month - 1, this.toDate.day]),
        controlName: this.controlName,
      };
      console.log('onDateSelection=>', dateRange);
      this.dateRangeSelection.emit(dateRange);
    }

    this.renderer.setProperty(this.myRangeInput.nativeElement, 'value', parsed);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clearInput'] && changes['clearInput'].currentValue) {
      console.log('delivered');
      this.renderer.setProperty(this.myRangeInput.nativeElement, 'value', '');
      this.renderer.setProperty(
        this.myRangeInput.nativeElement,
        'placeholder',
        'yyyy/mm/dd - yyyy/mm/dd'
      );
      this.fromDate = null;
      this.toDate = null;
    }
  }
  shouldHighlightDate(date: NgbDate): boolean {
    const dateToCheck = new Date(date.year, date.month - 1, date.day);
    let isHoliday = this.holidayList.some((highlightedDate: any) => {
      return new Date(highlightedDate).getTime() === dateToCheck.getTime();
    });
    console.log('dateToCheck=>', isHoliday);
    return isHoliday || this.calendar.getWeekday(date) > 6;
  }

  dateToday(date: NgbDate): boolean {
    const dateToCheck = new Date(date.year, date.month - 1, date.day);
    if (dateToCheck.toDateString() == new Date().toDateString()) {
      return true;
    }
    return false;
  }
  isWeekend = (date: NgbDate) => this.calendar.getWeekday(date) > 6;
  clearDate() {
    this.model = null;
    const dateRange = {
      from: null,
      to: null,
      controlName: this.controlName,
    };
    this.renderer.setProperty(
      this.myRangeInput.nativeElement,
      'placeholder',
      'yyyy/mm/dd - yyyy/mm/dd'
    );
    //set clear date range loader true
    this.commonService.clearDateRangeLoader=true;
    this.dateRangeSelection.emit(dateRange);
  }

  isRefreshDeliveredDate() {
    if (this.isDelivery) {
      if (this.fromDate) {
      }
      const date = moment().subtract(7, 'days');
      this.fromDate = {
        year: date.year(),
        month: date.month() + 1,
        day: date.date(),
      };

      this.toDate = {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
      };
      this.model = { begin: this.fromDate, end: this.toDate };
      let delvValue = '';
      delvValue += this._parserFormatter.format(this.fromDate);
      delvValue += '-';
      delvValue += this._parserFormatter.format(this.toDate);
      this.renderer.setProperty(
        this.myRangeInput.nativeElement,
        'placeholder',
        delvValue
      );
      const dateRange = {
        from: moment([
          this.fromDate.year,
          this.fromDate.month - 1,
          this.fromDate.day,
        ]),
        to: moment([this.toDate.year, this.toDate.month - 1, this.toDate.day]),
        controlName: this.controlName,
      };
      this.dateRangeSelection.emit(dateRange);
    }else{
      this.model = null;
    }
  }
}
