import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CopyGroupmarkingComponent } from './copy-groupmarking/copy-groupmarking.component';
import { CopyWBSComponent } from './copy-wbs/copy-wbs.component';
import { CopyprojectparamComponent } from './copyprojectparam/copyprojectparam.component';

const routes: Routes = [ 
    
    {
    path: 'CopyGroupmarking',
    component: CopyGroupmarkingComponent,
    data: {
      breadcrumb: 'Copy Groupmarking',
    }
  },
  {

    path: 'CopyWBS',
    component: CopyWBSComponent,
    data: {
      breadcrumb: 'Copy WBS',
    }
  },
  {

    path: 'Copyprojectparam',
    component: CopyprojectparamComponent,
    data: {
      breadcrumb: 'Copy projectparam',
    }
  }
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UtilityRoutingModule { }
