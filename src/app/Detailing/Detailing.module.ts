import { CommonModule } from '@angular/common'
import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DetailingRoutingModule } from './Detailing-routing.module';
import { DetailingService } from './DetailingService';
import { SharedModule } from '../SharedComponent/shared.module'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../app.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MeshDetailingComponent } from './MeshDetailing/MeshDetailing.component';
import { GroupMarkComponent } from './MeshDetailing/addgroupmark/addgroupmark.component';
import {DetailingGroupMarkComponent } from './DeatilingGroupMark/DetailingGroupMark.component';
//import {NewGroupMarkComponent} from './Groupmark/addgroupmark/newgroupmark.component';
import { TabsModule, TabsetConfig } from 'ngx-bootstrap/tabs';
import { BeamComponent } from './DeatilingGroupMark/beam/beam.component';
import { ColumnComponent } from './DeatilingGroupMark/column/column.component';
import { AccessoriesComponent } from './DeatilingGroupMark/accessories/accessories.component';
import { SlabTabComponent } from './DeatilingGroupMark/slab-tab/slab-tab.component';
import { BomComponent} from './BOM/bom.component';
import { PRCDetailingComponent} from './DeatilingGroupMark/PRC/PRCDetailing.component';
import { BindingLimitComponent } from './DeatilingGroupMark/binding-limit/binding-limit.component';
import { DrainComponent } from './DeatilingGroupMark/drain/drain.component';
import { BorePileComponent } from './DeatilingGroupMark/bore-pile/bore-pile.component';
import { BbsOrderdetailsComponent } from '../SharedComponent/OrderDetails/bbs-orderdetails/bbs-orderdetails.component';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { MainBarPatternComponent } from './DeatilingGroupMark/bore-pile/main-bar-pattern/main-bar-pattern.component';
import { StiffnerRingPopupComponent } from './DeatilingGroupMark/bore-pile/stiffner-ring-popup/stiffner-ring-popup.component';
import { AdditionalSpiralPopupComponent } from './DeatilingGroupMark/bore-pile/additional-spiral-popup/additional-spiral-popup.component';
import { CageNotesPopupComponent } from './DeatilingGroupMark/bore-pile/cage-notes-popup/cage-notes-popup.component';
import { CircularRingPopupComponent } from './DeatilingGroupMark/bore-pile/circular-ring-popup/circular-ring-popup.component';
import { ElevationPopupComponent } from './DeatilingGroupMark/bore-pile/elevation-popup/elevation-popup.component';
import { MachineTypeComponent } from './DeatilingGroupMark/bore-pile/machine-type/machine-type.component';
import { CarpetComponent } from './DeatilingGroupMark/carpet/carpet.component';
import { CreateBorePileCageComponent } from './create-bore-pile-cage/create-bore-pile-cage.component';
import { AdvanceOptionDialogComponent } from './create-bore-pile-cage/advance-option-dialog/advance-option-dialog.component';
import { CopyGridDataModalComponent } from './create-bore-pile-cage/copy-grid-data-modal/copy-grid-data-modal.component';
import { SpiralDialogComponent } from './create-bore-pile-cage/spiral-dialog/spiral-dialog.component';
import { CabShapeCodeComponent } from './cab-shape-code/cab-shape-code.component';
import { CabEditComponent } from './cab-edit/cab-edit.component';
import { CustomerDrawingReviewComponent } from '../customer-drawing-review/customer-drawing-review.component';
import { EmailNotificationToDetailerComponent } from '../customer-drawing-review/email-notification-to-detailer/email-notification-to-detailer.component';

import { PendingbpcDetailingComponent } from './pendingbpc-detailing/pendingbpc-detailing.component';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
 import { FilterPipe } from '../Detailing/filter.pipe';
import { ColumnResizeDirective } from './resizable-process.directive';




@NgModule({
    declarations: [
      MeshDetailingComponent,
      GroupMarkComponent,
      DetailingGroupMarkComponent,
     // NewGroupMarkComponent,
      BeamComponent,
      ColumnComponent,
      AccessoriesComponent,
      SlabTabComponent,
      BomComponent,
      PRCDetailingComponent,
      BindingLimitComponent,
      DrainComponent,
      BorePileComponent,
      BbsOrderdetailsComponent,
      MainBarPatternComponent,
      ElevationPopupComponent,
      StiffnerRingPopupComponent,
      AdditionalSpiralPopupComponent,
      CageNotesPopupComponent,
      CircularRingPopupComponent,
      MachineTypeComponent,
      CarpetComponent,
      CreateBorePileCageComponent,
      AdvanceOptionDialogComponent,
      CopyGridDataModalComponent,
      SpiralDialogComponent,
      CabEditComponent,
      CabShapeCodeComponent,
      CustomerDrawingReviewComponent,
      EmailNotificationToDetailerComponent,
      PendingbpcDetailingComponent,
      ColumnResizeDirective,
        FilterPipe,

    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      NgbModule,
      SharedModule,
      DetailingRoutingModule,
      NgMultiSelectDropDownModule ,
      NgbAccordionModule,
      NgSelectModule,
      TabsModule,
      AngularSlickgridModule,
      MatTooltipModule,
      DragDropModule,
      ScrollingModule

    ],
    providers: [
      DetailingService
    ],
    entryComponents: [],
    exports: [],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  })
  export class DetailingModule {}
