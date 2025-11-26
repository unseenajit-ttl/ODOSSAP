import { CommonModule } from '@angular/common'
import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GroupMarkingRoutingModule } from './GroupMarking-routing.module';
import { GroupMarkingService } from './GroupMarkingService';
import { SharedModule } from '../SharedComponent/shared.module'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../app.component';
import { NgSelectModule } from '@ng-select/ng-select';
import {GroupMarkComponent} from './Groupmark/GroupMark.component';
import { NewGroupMarkComponent } from './Groupmark/addgroupmark/newgroupmark.component';


@NgModule({
    declarations: [    
      GroupMarkComponent ,     
      NewGroupMarkComponent
    ],
    imports: [
      CommonModule,      
      FormsModule,
      ReactiveFormsModule,
      NgbModule,
      SharedModule,
      GroupMarkingRoutingModule ,
      NgMultiSelectDropDownModule ,
      NgbAccordionModule,
      NgSelectModule,
      
    ],
    providers: [
      GroupMarkingService     
    ],
    entryComponents: [],
    exports: [],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  })
  export class GroupMarkingModule {}
  