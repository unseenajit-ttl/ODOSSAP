import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { GroupMarkComponent } from './Groupmark/GroupMark.component';

// import { MeshparameterComponent } from './MeshParameterSet/Meshparameter.component';
// import { ColumnparameterComponent} from './ColumnParameterSet/Columnparameter.component';

const routes: Routes = [ 
        {
            path: 'GroupMark',
            component: GroupMarkComponent,
            data: {
                  breadcrumb: 'Group Mark',
                }
        },
       
       
      // {
      //   path: 'ColumnParameter',
      //   component: ColumnparameterComponent,
      //   data:{
      //     breadcrumb: 'Column Parameter',
      //   }
      // },
    
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
  ];
        
    


  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class GroupMarkingRoutingModule {}
  