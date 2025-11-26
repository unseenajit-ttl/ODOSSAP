import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportRoutingModule } from './report-routing.module';
import { TonnagereportComponent } from './tonnagereport/tonnagereport.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { NgbModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MasterRoutingModule } from '../Masters/Master-routing.module';
import { MaterialModule } from '../SharedComponent/material-module';
import { SharedModule } from '../SharedComponent/shared.module';
import { EsmtonnagereportComponent } from './esmtonnagereport/esmtonnagereport.component';
import { TonnageReportCustomerProjectComponent } from './tonnage-report-customer-project/tonnage-report-customer-project.component';
import { BpcordereentryreportComponent } from './bpcordereentryreport/bpcordereentryreport.component';
import { OrderAssignmentComponent } from '../Schnell/order-assignment/order-assignment.component';
//import { ConfirmedOrderSummaryComponent } from '../Schnell/confirmed-order-summary/confirmed-order-summary.component';
import { OrderAssignmentOutsourceComponent } from '../Schnell/order-assignment-outsource/order-assignment-outsource.component';
import { BatchgenerationfullComponent } from '../Outsource/batchgenerationfull/batchgenerationfull.component';
import { OrderStatusMonitoringComponent } from './order-status-monitoring/order-status-monitoring.component';
import { BatchgenerationpartialComponent } from '../Outsource/batchgenerationpartial/batchgenerationpartial.component';

import { BatchprintingComponent } from '../Outsource/batchprinting/batchprinting.component';

@NgModule({
  declarations: [
    TonnagereportComponent,
    EsmtonnagereportComponent,
    TonnageReportCustomerProjectComponent,
    BpcordereentryreportComponent,
    OrderAssignmentComponent,
    //ConfirmedOrderSummaryComponent,
    OrderAssignmentOutsourceComponent,
    BatchgenerationfullComponent,
    OrderStatusMonitoringComponent,
    BatchgenerationpartialComponent,
    BatchprintingComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    NgbModule,
    SharedModule,
    MasterRoutingModule,
    Ng2SearchPipeModule,
    NgMultiSelectDropDownModule,
    NgbAccordionModule,
    NgSelectModule,
    MaterialModule,
    MatNativeDateModule

  ]
})
export class ReportModule { }
