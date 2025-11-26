import { CommonModule } from '@angular/common'
import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WBSRoutingModule } from './wbs-routing.module';
import { WbsComponent } from './wbsmaintenance/wbs.component';
import { WbsService } from './wbs.service';
import { SharedModule} from '../SharedComponent/shared.module';
import { CreateWbsComponent } from './create-wbs/create-wbs.component';
import {ManageDialogComponent} from '../wbs/manage-dialog/manage-dialog.component'
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import {wbspostingComponent} from './wbsposting/wbsposting.component';
import { MaterialModule } from '../SharedComponent/material-module';
import { NgSelectModule } from '@ng-select/ng-select';
import {AddGroupMarkComponent} from './addgroupmark/addgroupmark.component';
import {AddWbsBbsComponent} from './addWBSBBS/addwbsbbs.component';
import {wbspostingreportComponent} from './Reports/WBSPostingReport/wbspostingreport.component';
import {CapPostingComponent} from './camppingdata/capposting.component';
import {ReleasewbsComponent} from './Release/releasewbs.component';
import { ESMCABBBSPostingComponent } from './esmcabbbsposting/esmcabbbsposting.component';
import { CopyBBSComponent } from './copy-bbs/copy-bbs.component';
import { ESMCabComponent } from './esmcabbbsposting/esmcab/esmcab.component';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { AttachDocumentComponent } from './wbsposting/attachdocuments/attachdocuments.component';
import { PrintWBSpdfpopupComponent } from './wbsposting/wbs-pritn-pdf/wbs-pritn-pdf.component';
import { EmailnotificationComponent } from './wbsposting/emailnotification/emailnotification.component';
import { DrawingReportComponent } from './wbsposting/drawing-report/drawing-report.component';
import { WbsDocumentsAttachedComponent } from './wbsposting/documents-attached-posted/documents-attached-posted.component';

@NgModule({
    declarations: [
        WbsComponent,
        CreateWbsComponent,
        ManageDialogComponent,
        wbspostingComponent,
        AddGroupMarkComponent,
        AddWbsBbsComponent,
        wbspostingreportComponent,
        CapPostingComponent,
        ReleasewbsComponent,
        ESMCABBBSPostingComponent,
        CopyBBSComponent,
        ESMCabComponent,
        AttachDocumentComponent,
        PrintWBSpdfpopupComponent,
        EmailnotificationComponent,
        DrawingReportComponent,
        WbsDocumentsAttachedComponent

    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      NgbModule,
      WBSRoutingModule,
      Ng2SearchPipeModule,
      NgMultiSelectDropDownModule,
      NgbAccordionModule,
      MaterialModule,
      NgSelectModule,
      AngularSlickgridModule



    ],
    providers: [
        WbsService
    ],
    entryComponents: [],
    exports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  })
  export class WbsModule {}
