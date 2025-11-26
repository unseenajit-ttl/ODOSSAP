import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { WbsComponent } from "./wbsmaintenance/wbs.component";
import { CreateWbsComponent } from './create-wbs/create-wbs.component';
import { wbspostingComponent } from './wbsposting/wbsposting.component';
import { wbspostingreportComponent } from './Reports/WBSPostingReport/wbspostingreport.component';
import { ESMCABBBSPostingComponent } from './esmcabbbsposting/esmcabbbsposting.component';
import { CopyBBSComponent } from './copy-bbs/copy-bbs.component';
import { ESMCabComponent } from './esmcabbbsposting/esmcab/esmcab.component';
import { PrecastComponent } from '../Orders/precast/precast.component';
import { DrawingReportComponent } from './wbsposting/drawing-report/drawing-report.component';


const routes: Routes = [
  {
    path: 'wbsmaintenace',
    component: WbsComponent,
    data: {
      breadcrumb: 'WBS Maintenance',
    },
    // children: [
    //   { path:':id/detail', component: CustomerDetailComponent },
    //   { path: '', component: CustomerListComponent }
    // ]
  },
  {
    path: 'wbpposting',
    component: wbspostingComponent,
    data: {
      breadcrumb: 'Shape Master',
    }
  },


  {
    path: 'WbspostingReport',
    component: wbspostingreportComponent,
    data: {
      breadcrumb: 'posting report',
    }
  },




  {
    path: 'esmcabbbsposting',
    component: ESMCABBBSPostingComponent,
    data: {
      breadcrumb: 'ESM CAB BBSPosting',
    }
  },

  {
    path: 'esmcabbbsposting/esmcab',
    component: ESMCabComponent,
    data: {
      breadcrumb: 'ESM CAB BBSPosting',
    }
  },

  {
    path: 'copy-bbs',
    component: CopyBBSComponent,
    data: {
      breadcrumb: 'Copy BBS',
    }
  },{
    path: 'Precast',
    component: PrecastComponent,
    data: {
      breadcrumb: 'Precast',
    }
  },
  {
    path: 'wbsposting/drawingreport',
    component: DrawingReportComponent,
    data: {
      breadcrumb: 'Drawing Report',
    },
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WBSRoutingModule { }
