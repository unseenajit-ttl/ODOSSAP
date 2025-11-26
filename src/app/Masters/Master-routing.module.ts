import { NgModule } from '@angular/core'
import { ShapesurchargeComponent } from '../Masters/shapesurcharge/shapesurcharge.component'
import { CreateShapesurchargeComponent } from '../Masters/shapesurcharge/create-shapesurcharge/create-shapesurcharge.component';
import { masterComponent } from '../Masters/master.component'

import { ShapegroupMasterComponent } from './shapegroup-master/shapegroup-master.component';
import { ProductcodeComponent } from './productcode/productcode.component';

import { ProjectlistComponent } from './projectlist/projectlist.component';
import { ProjectcontractlistComponent } from './projectcontractlist/projectcontractlist.component';
import { ShapemasterComponent } from './shapemaster/shapemaster.component';
import { ResolverForShapegroupmsterGuard } from '../guards/shapegroup-master/resolve.guard';
import { ResolverForShapesurchargeGuard } from '../guards/shapesurcharge/resolver-for-shapesurcharge.guard';
import { ProductcodeGuard } from './productcode/guards/Cabproductcode/productcode.guard';
import { MeshproductcodeGuard } from './productcode/guards/meshproductcode/meshproductcode.guard';
import { CorecageproductcodeGuard } from './productcode/guards/Corecageproductcode/corecageproductcode.guard';
import { AccesproductcodeGuard } from './productcode/guards/Accessproductcode/accesproductcode.guard';
import { CommonproductcodeGuard } from './productcode/guards/Commonproductcode/commonproductcode.guard';
import { RawmaterialproductcodeGuard } from './productcode/guards/Rawmatproductcode/rawmaterialproductcode.guard';
import { ESMTrackerComponent } from './esmtracker/esmtracker.component';
import { Routes, RouterModule } from '@angular/router';
import { AllshapesComponent } from './shapemaster/allshapes/allshapes.component';

//import { ShapecodedrawComponent } from './shapecodedraw/shapecodedraw.component';

const routes: Routes = [

  {
    path: 'shapesurcharge',
    component: ShapesurchargeComponent,
    resolve: {
      data: ResolverForShapesurchargeGuard,
    },
    data: {
      breadcrumb: 'Shape Surcharge',
    }
  },

  {
    path: 'productcode',
    component: ProductcodeComponent,
    data: {
      breadcrumb: 'Product Code',
    },
    resolve: {
      cab: ProductcodeGuard,
      mesh:MeshproductcodeGuard,
      corecage: CorecageproductcodeGuard,
      accs: AccesproductcodeGuard,
      rawmat: RawmaterialproductcodeGuard,
      common: CommonproductcodeGuard,
     
    },
  
  },

  {
    path: 'shapegroup',
    component: ShapegroupMasterComponent,
    resolve: {
      data: ResolverForShapegroupmsterGuard,
    },
    data: {
      breadcrumb: 'Shape Master',
    }
  },
  {
    path: 'projectlist',
    component: ProjectlistComponent,
    data: {
      breadcrumb: 'project list',
    }
  },
  {
    path: 'projectcontractlist',
    component: ProjectcontractlistComponent,
    data: {
      breadcrumb: 'project contract list',
    }
  },
  {
    path: 'shapemaster',
    component: ShapemasterComponent,
    data: {
      breadcrumb: 'Shape  Master',
    }
  },
  //   {

  //     path: 'drawshapecode',
  //     component: ShapecodedrawComponent,
  //     data: {
  //      breadcrumb: 'Draw Shape Code',
  //     }

  // }

  {
    path: 'esmtracker',
    component: ESMTrackerComponent,
    
    data: {
      breadcrumb: 'ESM Tracker',
    }
  },

  {
    path: 'allshapes',
    component: AllshapesComponent,
    data: {
      breadcrumb: 'All Shapes',
    }
  },
];





@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule { }
