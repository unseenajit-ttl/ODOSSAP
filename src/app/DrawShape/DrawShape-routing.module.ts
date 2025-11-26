import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
// import { DrawShapeComponent } from './DrawShape.component';
import { CabShapeMasterComponent } from './cab-shape-master/cab-shape-master.component';

const routes: Routes = [

        // {
        //     path: 'DrawShape',
        //     component: DrawShapeComponent,
        //     data: {
        //           breadcrumb: 'DrawShape',
        //         }
        // },
        {
          path: 'master',
          component: CabShapeMasterComponent,
          data: {
                breadcrumb: 'DrawShape',
              }
      },

  ];


  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class DrawShapeRoutingModule {}
