import { CommonModule } from '@angular/common'
import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ParameterSetRoutingModule } from './ParameterSet-routing.module';

import { SharedModule } from '../SharedComponent/shared.module'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../app.component';
import { NgSelectModule } from '@ng-select/ng-select';
import {MeshparameterComponent} from './MeshParameterSet/Meshparameter.component';
import {AddstructeleComponent} from './MeshParameterSet/addstructureElement/addstructele.component';


import { TabsModule, TabsetConfig } from 'ngx-bootstrap/tabs';
import { ParametersetService } from './Services/Parameterset/parameterset.service';
import { DrainParameterSetComponent } from './drain-parameter-set/drain-parameter-set.component';
import { DrainParameterSetService } from './Services/Drain/drain-parameter-set.service';
import { BorePileParametersetComponent } from './bore-pile-parameterset/bore-pile-parameterset.component';
import { PopupComponent } from './bore-pile-parameterset/popup/popup.component';


@NgModule({
    declarations: [
      MeshparameterComponent,
      AddstructeleComponent,
      DrainParameterSetComponent,
      BorePileParametersetComponent,
      PopupComponent,
    
     
    
    ],
    imports: [
      CommonModule,      
      FormsModule,
      ReactiveFormsModule,
      NgbModule,
      SharedModule,
      ParameterSetRoutingModule ,
      NgMultiSelectDropDownModule ,
      NgbAccordionModule,
      NgSelectModule,
      TabsModule


    ],
    providers: [
      ParametersetService,     
      DrainParameterSetService,
    ],
    entryComponents: [],
    exports: [MeshparameterComponent],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  })
  export class ParameterSetModule {}
  