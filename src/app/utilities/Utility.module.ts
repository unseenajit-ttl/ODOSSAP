import { CommonModule } from '@angular/common'
import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UtilityRoutingModule } from './Utility-routing.module';
import { SharedModule} from '../SharedComponent/shared.module';
import {ManageDialogComponent} from '../wbs/manage-dialog/manage-dialog.component'
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../SharedComponent/material-module';
import { UtilityService } from './Utility.service';
import { UtilitiesComponent } from './utilities.component';
import { CopyGroupmarkingComponent } from './copy-groupmarking/copy-groupmarking.component';
import { CopyWBSComponent } from './copy-wbs/copy-wbs.component';
import { CopyprojectparamComponent } from './copyprojectparam/copyprojectparam.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CheckGmNameComponent } from './copy-groupmarking/check-gm-name/check-gm-name.component';

@NgModule({
    declarations: [
      UtilitiesComponent,
      CopyGroupmarkingComponent,
      CopyWBSComponent,
      CopyprojectparamComponent,
      CheckGmNameComponent    
     
    ],
    imports: [
      CommonModule,      
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      NgbModule,
      UtilityRoutingModule,
      Ng2SearchPipeModule,
      NgMultiSelectDropDownModule,
      NgbAccordionModule,
      MaterialModule,
      NgSelectModule
      
      
      
  
    ],
    providers: [
      UtilityService     
    ],
    entryComponents: [],
    exports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  })
  export class UtilityModule {}
  