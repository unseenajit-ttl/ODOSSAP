import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { orderdraftComponent } from './draftorder/orderdraft.component';
import { activeorderComponent } from './activeorder/activeorder.component';
import { DeliveredorderComponent } from './deliveredorder/deliveredorder.component';
import { DeletedorderComponent } from './deletedOrder/deletedorder.component';
import { CancelledorderComponent } from './cancelledorder/cancelledorder.component';
import { OrdercomponentComponent } from './ordercomponent/ordercomponent.component';
import { createorderComponent } from './createorder/createorder.component';
import { OrdersummaryComponent } from './ordersummary/ordersummary.component';

import { StandardbarorderComponent } from './standardbarorder/standardbarorder.component';
import { OrderdetailsComponent } from './createorder/orderdetails/orderdetails.component';
import { StandardmeshorderComponent } from './standardmeshorder/standardmeshorder.component';
import { CoilproductsorderComponent } from './coilproductsorder/coilproductsorder.component';
import { CouplerheadorderComponent } from './couplerheadorder/couplerheadorder.component';
import { BeamlinkmeshorderComponent } from './beamlinkmeshorder/beamlinkmeshorder.component';
import { ProcessOrderComponent } from './process-order/process-order.component';
import { DrawingRepositoryComponent } from './drawing-repository/drawing-repository.component';
import { OfflineBBSComponent } from './offline-bbs/offline-bbs.component';
import { AssignWBSComponent } from './assign-wbs/assign-wbs.component';
import { ColumnlinkmeshorderComponent } from './columnlinkmeshorder/columnlinkmeshorder.component';
import { PrecageComponent } from './precage/precage.component';
import { CtsmeshComponent } from './ctsmesh/ctsmesh.component';
import { BoredPileCageComponent } from './bored-pile-cage/bored-pile-cage.component';
import { MultipleOrderAmendmentComponent } from './multiple-order-amendment/multiple-order-amendment.component';
import { CtsmeshorderComponent } from './ctsmeshorder/ctsmeshorder.component';
import { UpcomingOrdersComponent } from './upcoming-orders/upcoming-orders.component';
import { BPCCabEditComponent } from './bored-pile-cage/cab-edit/cab-edit.component';
import { PrecastComponent } from './precast/precast.component';
import { PileEntryComponent } from './bored-pile-cage/pile-entry/pile-entry.component';
import { CustomerDrawingReviewComponent } from '../customer-drawing-review/customer-drawing-review.component';
import { CarpetorderComponent } from './carpetorder/carpetorder.component';
import { EsmNewComponent } from './esm-new/esm-new.component';
import { EsmCustomViewsComponent } from './esm-new/esm-custom-views/esm-custom-views.component';

const routes: Routes = [
  {
    path: 'draftorder',
    component: orderdraftComponent,
    data: {
      breadcrumb: 'Order Draft',
    },
  },
  {
    path: 'upcomingorders',
    component: UpcomingOrdersComponent,
    data: {
      breadcrumb: 'Upcoming',
    },
  },
  {
    path: 'activeorder',
    component: activeorderComponent,
    data: {
      breadcrumb: 'Active Order',
    }
  },
  {
    path: 'deliveredorder',
    component: DeliveredorderComponent,
    data: {
      breadcrumb: 'Active Order',
    },
  },
  {
    path: 'deletedorder',
    component: DeletedorderComponent,
    data: {
      breadcrumb: 'Deleted Order',
    }
  },
  {
    path: 'cancelledorder',
    component: CancelledorderComponent,
    data: {
      breadcrumb: 'Cancelled Order',
    }
  },
  {
    path: 'component',
    component: OrdercomponentComponent,
    data: {
      breadcrumb: 'Component ',
    }
  },
  {
    path: 'createorder',
    component: createorderComponent,
    data: {
      breadcrumb: 'Create Order ',
    }
  },
  {
    path: 'processorder',
    component: ProcessOrderComponent,
    data: {
      breadcrumb: 'Process Order ',
    },
  },
  {
    path: 'OrderDetails',
    component: OrdersummaryComponent,
    data: {
      breadcrumb: 'Order Details',
    },
  },
  {
    path: 'assignwbs',
    component: AssignWBSComponent,
    data: {
      breadcrumb: 'Assign WBS',
    },
  },
  {
    path: 'OfflineBBS',
    component: OfflineBBSComponent,
    data: {
      breadcrumb: 'OfflineBBS',
    },
  },
  {
    path: 'drawingrepository',
    component: DrawingRepositoryComponent,
    data: {
      breadcrumb: 'Drawing Repository ',
    },
  },



  {
    path: 'createorder/standardbarorder',
    component: StandardbarorderComponent,
    data: {
      breadcrumb: 'standardbar order',
    }
  },
  {
    path: 'createorder/Precast',
    component: PrecastComponent,
    data: {
      breadcrumb: 'Precast order',
    }
  },
  {
    path: 'createorder/orderdetails',
    component: OrderdetailsComponent,
    data: {
      breadcrumb: 'Order Details',
    }
  },
  {
    path: 'createorder/standardmeshorder',
    component: StandardmeshorderComponent,
    data: {
      breadcrumb: 'standardMesh order',
    }
  },
  {
    path: 'createorder/coilproductsorder',
    component: CoilproductsorderComponent,
    data: {
      breadcrumb: 'Coilproducts order',
    }
  },
  {
    path: 'createorder/Couplerheadorder',
    component: CouplerheadorderComponent,
    data: {
      breadcrumb: 'Couplerhead order',
    }
  },
  {
    path: 'createorder/CarpetOrder',
    component: CarpetorderComponent,
    data: {
      breadcrumb: 'Carpet order',
    }
  },
  {
    path: 'createorder/Beamlinkmeshorder',
    component: BeamlinkmeshorderComponent,
    data: {
      breadcrumb: 'Beamlinkmesh order',
    }
  },
  {
    path: 'createorder/Columnlinkmeshorder',
    component: ColumnlinkmeshorderComponent,
    data: {
      breadcrumb: 'Columnlinkmesh order',
    }
  },
  {
    path: 'createorder/Precage',
    component: PrecageComponent,
    data: {
      breadcrumb: 'Precage order',
    }
  },
  {
    path: 'createorder/CtsMesh',
    component: CtsmeshComponent,
    data: {
      breadcrumb: 'CTSMesh Order',
    },
  },

  {
    path: 'createorder/bpc',
    component: BoredPileCageComponent,
    data: {
      breadcrumb: 'Bored Pile Cage',
    },
  },
  {
    path: 'createorder/bpc/editAdvancedCAB',
    component: BPCCabEditComponent,
    data: {
      breadcrumb: 'Bored Pile Cage Edit CAB',
    },
  },
  {
    path: 'processorder/amendment',
    component: MultipleOrderAmendmentComponent,
    data: {
      breadcrumb: 'Multiple Order Amendment',
    },
  },
  {
    path: 'createorder/Ctsmeshorder',
    component: CtsmeshorderComponent,
    data: {
      breadcrumb: 'Ctsmeshorder Componentt',
    },
  },
  {
    path: 'createorder/bpc/pileEntry',
    component: PileEntryComponent,
    data: {
      breadcrumb: 'Pile Entry ',
    },
  },
  { path: 'customer-drawing-review', component: CustomerDrawingReviewComponent },
  {
    path: 'esm-new',
    component: EsmNewComponent,
    data: {
      breadcrumb: 'ESM New Component',
    }
  },
  {
    path:'esm-new/esm-custom-views',
    component:EsmCustomViewsComponent
  }



    //CtsmeshorderComponent



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule { }
