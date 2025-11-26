import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TonnagereportComponent } from './tonnagereport/tonnagereport.component';
import { EsmtonnagereportComponent } from './esmtonnagereport/esmtonnagereport.component';
import { TonnageReportCustomerProjectComponent } from './tonnage-report-customer-project/tonnage-report-customer-project.component';
import { BpcordereentryreportComponent } from './bpcordereentryreport/bpcordereentryreport.component';
import { OrderAssignmentComponent } from '../Schnell/order-assignment/order-assignment.component';
//import { ConfirmedOrderSummaryComponent } from '../Schnell/confirmed-order-summary/confirmed-order-summary.component';
import { OrderAssignmentOutsourceComponent } from '../Schnell/order-assignment-outsource/order-assignment-outsource.component';
import { BatchgenerationfullComponent } from '../Outsource/batchgenerationfull/batchgenerationfull.component';
import { OrderStatusMonitoringComponent } from './order-status-monitoring/order-status-monitoring.component';
import { BatchprintingComponent } from '../Outsource/batchprinting/batchprinting.component';
import { BatchgenerationpartialComponent } from '../Outsource/batchgenerationpartial/batchgenerationpartial.component';

const routes: Routes = [



  {
    path: 'tonnagereport',
    component: TonnagereportComponent,

    data: {
      breadcrumb: 'Tonnage Report',
    }
  },
  {
    path: 'projectTonnageReport',
    component: TonnageReportCustomerProjectComponent,

    data: {
      breadcrumb: 'Tonnage Report',
    }
  },

  {
    path: 'esmtonnagereport',
    component: EsmtonnagereportComponent,

    data: {
      breadcrumb: 'ESM Tonnage Report',
    }
  },
  {
    path: 'bpcordereentryreport',
    component: BpcordereentryreportComponent,

    data: {
      breadcrumb: 'BPC Order Entry Report',
    }
  },
  {

    path: 'OrderAssignment',

    component: OrderAssignmentComponent,



    data: {

      breadcrumb: 'Order Assignment',

    }

  },
  {

    path: 'OutsourceOrderAssignment',

    component: OrderAssignmentOutsourceComponent,



    data: {

      breadcrumb: 'Outsource Order Assignment',

    }

  },{

    path: 'OutsourceFull',

    component: BatchgenerationfullComponent,



    data: {

      breadcrumb: 'Full Outsource ',

    }

  },

  {

    path: 'OutsourcePartial',

    component: BatchgenerationpartialComponent,



    data: {

      breadcrumb: 'Partial Outsource ',

    }

  },
  // {
  //   path: 'OrderSummary',
  //   component: ConfirmedOrderSummaryComponent,

  //   data: {
  //     breadcrumb: 'Order Summary',
  //   }
  // },
  {
    path: 'OrderAssignmentOutsource',
    component: OrderAssignmentOutsourceComponent,
    data: {
      breadcrumb: 'Order Assignment Outsource',
    }
  },
  {
    path: 'Batchgenerationfull',
    component: BatchgenerationfullComponent,
    data: {
      breadcrumb: 'Full Outsource',
    }
  },
  {
    path: 'OrderStatusMonitoring',
    component: OrderStatusMonitoringComponent,
    data: {
      breadcrumb: 'Order Status Monitoring',
    }
  },
  {
    path: 'BatchPrinting',
    component: BatchprintingComponent,
    data: {
      breadcrumb: 'Batch Printing for Outsoutcing',
    }
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
