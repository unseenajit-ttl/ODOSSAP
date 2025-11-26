import { CommonModule } from '@angular/common'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MasterRoutingModule } from './Master-routing.module';
import { MasterService } from './Master.service';
import { ShapesurchargeComponent } from './shapesurcharge/shapesurcharge.component';
import { CreateShapesurchargeComponent } from './shapesurcharge/create-shapesurcharge/create-shapesurcharge.component';
import { SharedModule } from '../SharedComponent/shared.module'
import { MasterDialogComponent } from './master-dialog/master-dialog.component';
import { masterComponent } from './master.component';

import { ShapegroupMasterComponent } from './shapegroup-master/shapegroup-master.component';
import { ProductcodeComponent } from './productcode/productcode.component';

import { ProjectlistComponent } from './projectlist/projectlist.component';
import { ProjectcontractlistComponent } from './projectcontractlist/projectcontractlist.component';


import { CreateshapegroupComponent } from '././shapegroup-master/createshapegroup/createshapegroup.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ShapemasterComponent } from './shapemaster/shapemaster.component';
import { CreateshapemasterComponent } from './shapemaster/createshapemaster/createshapemaster.component';
import { AddparameterComponent } from './shapemaster/addparameter/addparameter.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../app.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CreateProjectComponent } from './projectlist/Addproject/create-project.component';
import { addProductcodeComponent } from './productcode/addproductcode/create-productcode.component';
import { addValidationComponent } from './shapemaster/AddValidation/addValidation.component';
import { addFormulaComponent } from './shapemaster/AddFormula/addFormula.component';
import { MaterialModule } from '../SharedComponent/material-module';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { ResolveGuard } from './resolve.guard';
import { ESMTrackerComponent } from './esmtracker/esmtracker.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AllshapesComponent } from './shapemaster/allshapes/allshapes.component';
import { ConfirmationDialogComponent } from './shapemaster/confirmation-dialog/confirmation-dialog.component';



@NgModule({
  declarations: [
    ShapesurchargeComponent,
    CreateShapesurchargeComponent,
    MasterDialogComponent,
    ProductcodeComponent,
    ShapegroupMasterComponent,
    masterComponent,
    ProjectlistComponent,
    ProjectcontractlistComponent,
    CreateshapegroupComponent,
    ShapemasterComponent,
    CreateshapemasterComponent,
    AddparameterComponent,
    CreateProjectComponent,
    addProductcodeComponent,
    addValidationComponent,
    addFormulaComponent,
    ESMTrackerComponent,
    AllshapesComponent,
    ConfirmationDialogComponent,



  ],
  imports: [
    CommonModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    MasterRoutingModule,
    Ng2SearchPipeModule,
    NgMultiSelectDropDownModule,
    NgbAccordionModule,
    NgSelectModule,
    MaterialModule,
    MatNativeDateModule
  ],
  providers: [
    MasterService, MasterService, ResolveGuard
  ],
  entryComponents: [],
  exports: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MasterModule { }
