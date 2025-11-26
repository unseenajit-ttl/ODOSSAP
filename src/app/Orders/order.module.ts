import { CommonModule } from '@angular/common'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderRoutingModule } from './orders-routing.module';
import { OrderService } from './orders.service';
import { SharedModule } from '../SharedComponent/shared.module';
import { ManageDialogComponent } from '../wbs/manage-dialog/manage-dialog.component'
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../SharedComponent/material-module';
import { NgSelectModule } from '@ng-select/ng-select';
import { orderdraftComponent } from './draftorder/orderdraft.component';
import { activeorderComponent } from './activeorder/activeorder.component';
import { DeliveredorderComponent } from './deliveredorder/deliveredorder.component';
import { DeletedorderComponent } from './deletedOrder/deletedorder.component';
import { CancelledorderComponent } from './cancelledorder/cancelledorder.component';
import { OrdercomponentComponent } from './ordercomponent/ordercomponent.component';
import { createorderComponent } from './createorder/createorder.component';
import { ProjectComponent } from './createorder/project/project.component';
import { NonProjectComponent } from './createorder/non-project/non-project.component';
import { TabsModule, TabsetConfig } from 'ngx-bootstrap/tabs';
import { NewPartComponent } from './createorder/new-part/new-part.component';
import { OrdersummaryComponent } from './ordersummary/ordersummary.component';
import { StandardbarorderComponent } from './standardbarorder/standardbarorder.component';
//import { BbsorderComponent } from './bbsorder/bbsorder.component';
import { OrderdetailsComponent } from './createorder/orderdetails/orderdetails.component';
import { StandardmeshorderComponent } from './standardmeshorder/standardmeshorder.component';
import { CoilproductsorderComponent } from './coilproductsorder/coilproductsorder.component';
import { CouplerheadorderComponent } from './couplerheadorder/couplerheadorder.component';
import { OrderdetailsproductComponent } from './orderdetailsproduct/orderdetailsproduct.component';
// import { BbsorderdetailsComponent } from './createorder/orderdetails/bbsorderdetails/bbsorderdetails.component';

import { BindingLimitComponent } from './createorder/orderdetails/binding-limit/binding-limit.component';
import { BeamlinkmeshorderComponent } from './beamlinkmeshorder/beamlinkmeshorder.component';
import { ColumnlinkmeshorderComponent } from './columnlinkmeshorder/columnlinkmeshorder.component';
import { ProcessOrderComponent } from './process-order/process-order.component';
import { AssignWBSComponent } from './assign-wbs/assign-wbs.component';
import { OfflineBBSComponent } from './offline-bbs/offline-bbs.component';
import { DrawingRepositoryComponent } from './drawing-repository/drawing-repository.component';
import { ProcessordercontractlistComponent } from './process-order/processordercontractlist/processordercontractlist.component';
import { ProcessordersearchPOComponent } from './process-order/processordersearch-po/processordersearch-po.component';
import { CloneOrderComponent } from './ordersummary/clone-order/clone-order.component';
import { PrintOrderComponent } from './ordersummary/print-order/print-order.component';
import { UpdateProjectManagementComponent } from './process-order/update-project-management/update-project-management.component';
import { UpdateTechnicalRemarksComponent } from './process-order/update-technical-remarks/update-technical-remarks.component';
import { UpdateProjectInchargeComponent } from './process-order/update-project-incharge/update-project-incharge.component';
import { UpdateDetaillingInchargeComponent } from './process-order/update-detailling-incharge/update-detailling-incharge.component';
import { UpdateConfirmationComponent } from './process-order/update-confirmation/update-confirmation.component';
import { DocumentsAttachedComponent } from './process-order/documents-attached/documents-attached.component';
import { BbsNumberListComponent } from './process-order/bbs-number-list/bbs-number-list.component';
import { CtsmeshComponent } from './ctsmesh/ctsmesh.component';
import { PrecageComponent } from './precage/precage.component';
import { BeamprcComponent } from './precage/beamprc/beamprc.component';
import { ColumnprcComponent } from './precage/columnprc/columnprc.component';
import { CtsmeshprcComponent } from './precage/ctsmeshprc/ctsmeshprc.component';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { BoredPileCageComponent } from './bored-pile-cage/bored-pile-cage.component';
import { SpiralDialogComponent } from './bored-pile-cage/spiral-dialog/spiral-dialog.component';
import { AdvanceOptionDialogComponent } from './bored-pile-cage/advance-option-dialog/advance-option-dialog.component';
import { MultipleOrderAmendmentComponent } from './multiple-order-amendment/multiple-order-amendment.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { CopyGridDataModalComponent } from './bored-pile-cage/copy-grid-data-modal/copy-grid-data-modal.component';
import { ViewLoadComponent } from './bored-pile-cage/view-load/view-load.component';
import { PrcsharedserviceService } from './precage/PrecageService/prcsharedservice.service';
import { CopyOrderDetailsComponent } from './createorder/orderdetails/copy-order-details/copy-order-details.component';
import { ImportOrderDetailsComponent } from './createorder/orderdetails/import-order-details/import-order-details.component';
import { SORWatchlistComponent } from './multiple-order-amendment/sor-watchlist/sor-watchlist.component';

import { CabprcComponent } from './precage/cabprc/cabprc.component';
import { ColumnLinkMeshProductListModalComponent } from './column-link-mesh-product-list-modal/column-link-mesh-product-list-modal.component';
import { OrderImageModalComponent } from './order-image-modal/order-image-modal.component';
import { BarDetailsInfoComponent } from './createorder/orderdetails/bar-details-info/bar-details-info.component';
import { CtsmeshorderComponent } from './ctsmeshorder/ctsmeshorder.component';
import { BarDetailsComponent } from './createorder/orderdetails/bar-details/bar-details.component';
import { CloneOrderProjectComponent } from './ordersummary/clone-order-project/clone-order-project.component';
import { CreateShapeComponent } from './createorder/orderdetails/create-shape/create-shape.component';
import { ListOfShapesComponent } from './createorder/orderdetails/list-of-shapes/list-of-shapes.component';
import { ImportBbsFromIfcComponent } from './createorder/orderdetails/import-bbs-from-ifc/import-bbs-from-ifc.component';
import { ImportOesComponent } from './createorder/orderdetails/import-oes/import-oes.component';
import { DocsattachedComponent } from './createorder/docsattached/docsattached.component';
import { ImportOESSucessComponent } from './createorder/orderdetails/import-oes/import-oessucess/import-oessucess.component';
import { ColumnResizeDirective } from './process-order/resizable-process.directive';
import { DeliveredOrderDocumentComponent } from './deliveredorder/delivered-order-document/delivered-order-document.component';
import { TrackStatusComponent } from './activeorder/track-status/track-status.component';
import { DrawingprcComponent } from './precage/drawingprc/drawingprc.component';
import { CancelCabOrdersComponent } from './process-order/cancel-cab-orders/cancel-cab-orders.component';
import { UpdatingBbsComponent } from './createorder/orderdetails/updating-bbs-remark/updating-bbs/updating-bbs.component';
import { AlertBoxComponent } from './createorder/orderdetails/alert-box/alert-box.component';
import { ProcessSelectionModelComponent } from './process-order/selection-model/process-selection-model/process-selection-model.component';
import { LoadDetailsComponent } from './process-order/load-details/load-details/load-details.component';
import { UpcomingOrdersComponent } from './upcoming-orders/upcoming-orders.component';
import { EmailNotificationComponent } from './upcoming-orders/email-notification/email-notification.component';
import { NotificationInfoComponent } from './upcoming-orders/notification-info/notification-info/notification-info.component';
import { OfflineBBSOrderComponent } from './offline-bbsorder/offline-bbsorder.component';
import { NewpoComponent } from './offline-bbsorder/newpo/newpo.component';
import { CopybbsofflineComponent } from './offline-bbsorder/copybbsoffline/copybbsoffline.component';
import { DragDropFileDirective } from './drawing-repository/drective/drag-drop-file.directive';
import { SearchDrawRepoComponent } from './drawing-repository/search-draw-repo/search-draw-repo.component';
import { FileDropZoneComponent } from './drawing-repository/file-drop-zone/file-drop-zone.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ViewPdfModalComponent } from './drawing-repository/view-pdf-modal/view-pdf-modal.component';
import { PrintBPCPdfModalComponent } from './bored-pile-cage/print-bpc-pdf-modal/print-bpc-pdf-modal.component';
import { NgSelectEditorComponent } from './bored-pile-cage/ng-select-editor.components';
import { FilterPipe } from './filter.pipe';
import { PrintpdfpopupComponent } from './process-order/printpdfpopup/printpdfpopup.component';
import { ActiveOrderDetailsComponent } from './activeorder/active-oreer-details/active-order-details/active-order-details.component';
import { BPCCabEditComponent } from './bored-pile-cage/cab-edit/cab-edit.component';
import { PrecastComponent } from './precast/precast.component';
import { PileEntryComponent } from './bored-pile-cage/pile-entry/pile-entry.component';
import { DimensioningRuleComponent } from './createorder/orderdetails/dimensioning-rule/dimensioning-rule.component';
import { ElevationEditComponent } from './bored-pile-cage/elevation-edit/elevation-edit.component';
import { MainBarNumberComponent } from './bored-pile-cage/main-bar-number/main-bar-number.component';
import { ListOfShapesESpliceComponent } from './createorder/orderdetails/list-of-shapes-esplice/list-of-shapes-esplice.component';
import { ListOfShapesNSpliceComponent } from './createorder/orderdetails/list-of-shapes-nsplice/list-of-shapes-nsplice.component';
import { ConfirmExcessMailComponent } from './process-order/confirm-excess-mail/confirm-excess-mail.component';
import { DocumentAttachForCustomerComponent } from '../customer-drawing-review/document-attach/document-attach.component';
import { PrintBBSOrderComponent } from './ordersummary/print-bbsorder/print-bbsorder.component';
import { PrecastpopupComponent } from './precastpopup/precastpopup.component';
import { GroupprecastpopupComponent } from './groupprecastpopup/groupprecastpopup.component';
import { CarpetorderComponent } from './carpetorder/carpetorder.component';
import { CarpetShapeListComponent } from './carpetorder/carpet-shape-list/carpet-shape-list.component';
import { CarpetProductListComponent } from './carpetorder/carpet-product-list/carpet-product-list.component';
import { EsmNewComponent } from './esm-new/esm-new.component';
import { EsmPopUpDragDropComponent } from './esm-new/esm-pop-up-drag-drop/esm-pop-up-drag-drop.component';
import { EsmCustomViewsComponent } from './esm-new/esm-custom-views/esm-custom-views.component';

@NgModule({
  declarations: [
    orderdraftComponent,
    activeorderComponent,
    DeliveredorderComponent,
    DeletedorderComponent,
    CancelledorderComponent,
    OrdercomponentComponent,
    createorderComponent,
    ProjectComponent,
    NonProjectComponent,
    NewPartComponent,
    OrdersummaryComponent,
    StandardbarorderComponent,
    OrderdetailsComponent,
    StandardmeshorderComponent,
    CoilproductsorderComponent,
    CouplerheadorderComponent,
    OrderdetailsproductComponent,

    BindingLimitComponent,
    BeamlinkmeshorderComponent,
    ColumnlinkmeshorderComponent,
    ProcessOrderComponent,
    AssignWBSComponent,
    OfflineBBSComponent,
    DrawingRepositoryComponent,
    ProcessordercontractlistComponent,
    ProcessordersearchPOComponent,
    CloneOrderComponent,
    PrintOrderComponent,
    UpdateProjectManagementComponent,
    UpdateTechnicalRemarksComponent,
    UpdateProjectInchargeComponent,
    UpdateDetaillingInchargeComponent,
    UpdateConfirmationComponent,
    DocumentsAttachedComponent,
    BbsNumberListComponent,
    CtsmeshComponent,
    PrecageComponent,
    BeamprcComponent,
    ColumnprcComponent,
    CtsmeshprcComponent,
    BoredPileCageComponent,
    SpiralDialogComponent,
    AdvanceOptionDialogComponent,
    MultipleOrderAmendmentComponent,
    //BbsorderdetailComponent,
    CopyGridDataModalComponent,
    ViewLoadComponent,
    CopyOrderDetailsComponent,
    ImportOrderDetailsComponent,
    SORWatchlistComponent,
    CabprcComponent,
    ColumnLinkMeshProductListModalComponent,
    OrderImageModalComponent,
    BarDetailsInfoComponent,
    CtsmeshorderComponent,
    BarDetailsComponent,
    CloneOrderProjectComponent,
    CreateShapeComponent,
    ListOfShapesComponent,
    ImportBbsFromIfcComponent,
    ImportOesComponent,
    DocsattachedComponent,
    ImportOESSucessComponent,
    ColumnResizeDirective,
    DeliveredOrderDocumentComponent,
    TrackStatusComponent,
    DrawingprcComponent,
    CancelCabOrdersComponent,
    UpdatingBbsComponent,
    AlertBoxComponent,
    ProcessSelectionModelComponent,
    LoadDetailsComponent,
    UpcomingOrdersComponent,
    EmailNotificationComponent,
    NotificationInfoComponent,
    OfflineBBSOrderComponent,
    NewpoComponent,
    CopybbsofflineComponent,
    DragDropFileDirective,
    SearchDrawRepoComponent,
    FileDropZoneComponent,
    ViewPdfModalComponent,
    PrintBPCPdfModalComponent,
    NgSelectEditorComponent,
    FilterPipe,
    PrintpdfpopupComponent,
    ActiveOrderDetailsComponent,
    BPCCabEditComponent,
    PrecastComponent,
    PileEntryComponent,
    DimensioningRuleComponent,
    ElevationEditComponent,
    MainBarNumberComponent,
    ListOfShapesESpliceComponent,
    ListOfShapesNSpliceComponent,
    ConfirmExcessMailComponent,
    DocumentAttachForCustomerComponent,
    PrintBBSOrderComponent,
    PrecastpopupComponent,
    GroupprecastpopupComponent,
    CarpetorderComponent,
    CarpetShapeListComponent,
    CarpetProductListComponent,
    EsmNewComponent,
    EsmPopUpDragDropComponent,
    EsmCustomViewsComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    OrderRoutingModule,
    Ng2SearchPipeModule,
    NgMultiSelectDropDownModule,
    NgbAccordionModule,
    MaterialModule,
    NgSelectModule,
    TabsModule,
    AngularSlickgridModule,
    NgxDaterangepickerMd,
    ScrollingModule



  ],
  providers: [
    OrderService
  ],
  entryComponents: [AdvanceOptionDialogComponent],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderModule { }
