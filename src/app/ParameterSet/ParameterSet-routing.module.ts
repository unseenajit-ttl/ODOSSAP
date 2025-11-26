import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router';
import { BorePileParametersetComponent } from './bore-pile-parameterset/bore-pile-parameterset.component';
import { DrainParameterSetComponent } from './drain-parameter-set/drain-parameter-set.component';
import { MeshparameterComponent } from './MeshParameterSet/Meshparameter.component';


const routes: Routes = [

  {
    path: 'Meshparameter',
    component: MeshparameterComponent,
    data: {
      breadcrumb: 'Mesh Paramter',
    }
  },
  {
    path: 'Drain',
    component: DrainParameterSetComponent,
    data: {
      breadcrumb: 'Drain Paramter',
    }
  },

  {
    path: 'BorePile',
    component: BorePileParametersetComponent,
    data: {
      breadcrumb: 'Bore Pile  Paramter',
    }
  },


];





@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParameterSetRoutingModule { }
