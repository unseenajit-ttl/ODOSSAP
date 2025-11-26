


import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
// import { DrawShapeComponent } fro  m './DrawShape/DrawShape.component';
import { HomeComponent } from './home/home.component';
import { InvalidTokenComponent } from './SharedComponent/invalid-token/invalid-token.component';


const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./Admin/Admin.module').then(m => m.AdminModule),
    data: {
      breadcrumb: 'admin',
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'master',
    loadChildren: () => import('./Masters/Master.module').then(m => m.MasterModule),
    data: {
      breadcrumb: 'Master',
    },
    canActivate: [AuthGuard]
  },

  {
    path: 'wbs',
    loadChildren: () => import('./wbs/wbs.module').then(m => m.WbsModule),
    data: {
      breadcrumb: 'WBS',
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'parameter',
    loadChildren: () => import('./ParameterSet/ParameterSet.module').then(m => m.ParameterSetModule),
    data: {
      breadcrumb: 'parameter',
    },
    canActivate: [AuthGuard]
  },

  {
    path: 'detailing',
    loadChildren: () => import('./Detailing/Detailing.module').then(m => m.DetailingModule),
    data: {
      breadcrumb: 'groupmark',
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'order',
    loadChildren: () => import('./Orders/order.module').then(m => m.OrderModule),
    data: {
      breadcrumb: 'groupmark',
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'Draw',
    loadChildren: () => import('./DrawShape/DrawShape.module').then(m => m.DrawShapeModule),
    data: {
      breadcrumb: 'Draw',
    }
  },
  {
    path: 'Utility',
    loadChildren: () => import('./utilities/Utility.module').then(m => m.UtilityModule),
    data: {
      breadcrumb: 'groupmark',
    },
    canActivate: [AuthGuard]
  },
  // FOR INVALID TOKEN
  {
    path: 'Invalid',
    component: InvalidTokenComponent,
    data: {
      breadcrumb: 'invalid',
    }
  },

  {
    path: 'reports',
    loadChildren: () => import('./reports/report.module').then(m => m.ReportModule),
    data: {
      breadcrumb: 'Reports',
    },
    //canActivate: [AuthGuard]
  },
  //draftorder
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
    component: HomeComponent
  }

];

@NgModule({
  imports: [ RouterModule.forRoot(routes)  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
