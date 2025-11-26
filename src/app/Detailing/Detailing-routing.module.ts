import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DetailingGroupMarkComponent } from './DeatilingGroupMark/DetailingGroupMark.component';
import { MeshDetailingComponent } from './MeshDetailing/MeshDetailing.component';
import { BomComponent } from './BOM/bom.component';
import { PRCDetailingComponent } from './DeatilingGroupMark/PRC/PRCDetailing.component';
import { DrainComponent } from './DeatilingGroupMark/drain/drain.component';
import { BorePileComponent } from './DeatilingGroupMark/bore-pile/bore-pile.component';
import { CarpetComponent } from './DeatilingGroupMark/carpet/carpet.component';
import { CreateBorePileCageComponent } from './create-bore-pile-cage/create-bore-pile-cage.component';
import { CabShapeCodeComponent } from './cab-shape-code/cab-shape-code.component';
import { CabEditComponent } from './cab-edit/cab-edit.component';
import { PendingbpcDetailingComponent } from './pendingbpc-detailing/pendingbpc-detailing.component';


const routes: Routes = [

  {
    path: 'MeshDetailing',
    component: MeshDetailingComponent,
    data: {
      breadcrumb: 'Mesh Detaling',
    }
  },
  {
    path: 'DetailingGroupMark',
    component: DetailingGroupMarkComponent,
    data: {
      breadcrumb: 'Detailing GroupMark',
    }
  },
  {
    path: 'DetailingGroupMark/Drain',
    component: DrainComponent,
    data: {
      breadcrumb: 'Drain Detailing ',
    }
  },
  {
    path: 'DetailingGroupMark/BorePile',
    component: BorePileComponent,
    data: {
      breadcrumb: 'Bore Pile  Detailing ',
    }
  },
  {
    path: 'DetailingGroupMark/Carpet',
    component: CarpetComponent,
    data: {
      breadcrumb: 'Carpet Detailing ',
    }
  },
  {
    path: 'PRCDetailing',
    component: PRCDetailingComponent,
    data: {
      breadcrumb: 'PRC Detailing ',
    }
  },

  {
    path: 'DetailingGroupMark/BOM',
    component: BomComponent,
    data: {
      breadcrumb: 'bom',
    }
  },
  {
    path: 'BPC',
    component: CreateBorePileCageComponent,
    data: {
      breadcrumb: 'PRC Detailing ',
    }
  },
  {
    path: 'Pending-BPC',
    component: PendingbpcDetailingComponent,
    data: {
      breadcrumb: 'Pending BPC',
    }

  },


  // { path: 'customer-drawing-review', component: CustomerDrawingReviewComponent },
  // {
  //   path: 'cabproductcode',
  //   component: CabproductcodeComponent,
  //   data:{
  //     breadcrumb: 'CAB Product Code',
  //   }
  // },

  // {
  //   path: 'shapegroup',
  //   component: ShapegroupMasterComponent,
  //   data: {
  //    breadcrumb: 'Shape Master',
  //   }
  // },
  // {
  //   path: 'projectlist',
  //   component: ProjectlistComponent,
  //   data: {
  //    breadcrumb: 'project list',
  //   }
  // },
  // {
  //   path: 'contractlist',
  //   component: ContractlistComponent,
  //   data: {
  //    breadcrumb: 'project list',
  //   }
  // },
  // {
  //   path: 'projectcontractlist',
  //   component: ProjectcontractlistComponent,
  //   data: {
  //    breadcrumb: 'project contract list',
  //   }
  // },
  // {
  //   path: 'shapemaster',
  //   component: ShapemasterComponent,
  //   data: {
  //    breadcrumb: 'Shape  Master',
  //   }
  // },
  {
    path: 'bpcCabEdit',
    component: CabEditComponent,
    data: {
      breadcrumb: 'Cab Shape ',
    }
  },
  {
    path: 'cabShape',
    component: CabShapeCodeComponent,
    data: {
      breadcrumb: 'Cab Shape ',
    }
  },
];





@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailingRoutingModule { }
