import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { RoleMasterComponent } from './RoleMaster/RoleMaster.component';

const routes: Routes = [ 

        {
            path: 'RoleMaster',
            component: RoleMasterComponent,
            data: {
                  breadcrumb: 'Role Master',
                }
        }    
  ];
        
    


  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class AdminRoutingModule {}
  