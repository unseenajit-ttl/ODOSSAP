// import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
// import { ControlContainer, FormControl, FormGroup, NgForm } from '@angular/forms'

// import moment from 'moment'

// @Component({
//   selector: 'do-date-picker',
//   template: `
 
//     <form #cmDateForm="ngForm">     
//       <div class="input-group flex-nowrap w-140px ">
//       <input
//           class="form-control "
//           [ngClass]="class"
//           [class.disabled]="disabled"
//           placeholder="dd/mm/yyyy"
//           name="dateField"
//           [(ngModel)]="date"
//           ngbDatepicker
//           #d="ngbDatepicker"
//           (click)="d.toggle()"
//           (blur)="onBlur()"
//           [placement]="placementPosition ? placementPosition : 'bottom-left'"
//           (dateSelect)="onSelect($event)"
//           [attr.isReadonly]="isReadonly"
//           [attr.tabindex]="isTabIndexDisable ? '-1' : '0'"
//           [minDate]="{ year: 1900, month: 1, day: 1 }"
//           [maxDate]="{ year: currentYear + 10, month: 12, day: 31 }"
//         />
    
//         <span class="input-group-append" >
//          <span class="input-group-text">  
//            <i class="fa fa-calendar"    (click)="d.toggle()" style="font-size:15px;;color:Blue"></i>
//           </span>                          
//         </span>
//    </div>       
//     </form>
//   `,
// })
// export class DODatePickerComponent implements OnInit {
//   public form!: FormGroup
//   public control!: FormControl
//   date: any = {}
//   @Input() class!: string
//   @Input() isReadonly = false
//   @Input() placementPosition!: string
//   @Input() isTabIndexDisable: boolean = false
//   @Input() disabled = false
//   @Input() controlName!: string
//   @Input() max: any
//   @Input() startView: any
//   @Output() blur: EventEmitter<any> = new EventEmitter<any>()
//   currentYear: number = new Date().getFullYear()
//   constructor(private controlContainer: ControlContainer) { }
//   ngOnInit() {
//     this.form = <FormGroup>this.controlContainer.control
//     this.control = <FormControl>this.form.get(this.controlName)
//     if (this.control.value) {
//       const selectedDate = new Date(this.control.value)
//       this.date = {
//         year: selectedDate.getFullYear(),
//         month: selectedDate.getMonth() + 1,
//         day: selectedDate.getDate(),
//       }
//     }
//   }

//   onSelect(evt: any) {
//     this.control.markAsDirty()
//     this.getDateString(evt)
//   }

//   getDateString(value: any) {
//     const selectedDate =
//       value.year +
//       '-' +
//       `0${value.month.toString()}`.slice(-2) +
//       '-' +
//       `0${value.day.toString()}`.slice(-2)

//     var m = moment(selectedDate, 'YYYY-MM-DD')
//     if (m.isValid()) {
//       this.control.patchValue(selectedDate)
//     } else {
//       this.control.patchValue(null)
//     }
//   }

//   onBlur() {
//     if (this.date != null && this.date != undefined && typeof this.date === 'string') {
//       this.control.markAsDirty()
//       const value = this.date.trim()
//       let dateArray = value.split('/')
//       if (dateArray.length === 3) {
//         try {
//           this.date = {
//             year: parseInt(dateArray[2], 10),
//             month: parseInt(dateArray[1], 10),
//             day: parseInt(dateArray[0], 10),
//           }
//           if (isNaN(this.date.year) || isNaN(this.date.month) || isNaN(this.date.day)) {
//             this.date = {}
//             this.control.patchValue(null)
//           } else {
//             this.getDateString(this.date)
//           }
//         } catch (error) {
//           this.date = {}
//           this.control.patchValue(null)
//         }
//       } else {
//         this.date = {}
//         this.control.patchValue(null)
//       }
//     } else if (this.date === null) {
//       this.date = {}
//       this.control.patchValue(null)
//     }
//     this.blur.emit(true)
//   }
// }
