import { CommonModule } from '@angular/common'
import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminRoutingModule } from './Admin-routing.module';
import { AdminService } from './Admin.service';
import { SharedModule } from '../SharedComponent/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../app.component';
import { NgSelectModule } from '@ng-select/ng-select';
import {CreateRoleComponent} from './RoleMaster/create-Role/create-Role.component'
import { RoleMasterComponent } from './RoleMaster/RoleMaster.component';
import { ConfirmationDialogComponent } from './RoleMaster/confirmation-dialog/confirmation-dialog.component';
import { UpdateRoleComponent } from './RoleMaster/update-role/update-role.component';

@NgModule({
    declarations: [
      RoleMasterComponent,
      CreateRoleComponent,
      ConfirmationDialogComponent,
      UpdateRoleComponent
     
      

    ],
    imports: [
      CommonModule,      
      FormsModule,
      ReactiveFormsModule,
      NgbModule,
      SharedModule,
      AdminRoutingModule ,
      NgMultiSelectDropDownModule ,
      NgbAccordionModule,
      NgSelectModule
    ],
    providers: [
        AdminService     
    ],
    entryComponents: [],
    exports: [],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  })
  export class AdminModule {}
  