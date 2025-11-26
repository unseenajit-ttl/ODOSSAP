import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from './Dialogs/manage-dialog/confirm-dialog.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { dataTransferService } from 'src/app/SharedServices/dataTransferService';
import { NgSelectModule } from '@ng-select/ng-select';
import{ResizableComponent} from 'src/app/SharedComponent/resizable/resizable.component'
import{ResizableDirective} from 'src/app/SharedComponent/resizable/resizable.directive'
import { BootsrtapDateRangePickerForSearchComponent } from './bootsrtap-date-range-picker-for-search/bootsrtap-date-range-picker-for-search.component';
import { TabsModule, TabsetConfig } from 'ngx-bootstrap/tabs';
import { InvalidTokenPopupComponent } from './invalid-token-popup/invalid-token-popup.component';
import { BootstrapDateRangePickerForDeliveredComponent } from './bootstrap-date-range-picker-for-delivered/bootstrap-date-range-picker-for-delivered.component';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    BreadcrumbComponent,
    ResizableComponent,
    ResizableDirective,
    BootsrtapDateRangePickerForSearchComponent,
    InvalidTokenPopupComponent,
    BootstrapDateRangePickerForDeliveredComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    TabsModule

  ],
  providers: [dataTransferService],
  exports: [ResizableComponent,BootsrtapDateRangePickerForSearchComponent,BootstrapDateRangePickerForDeliveredComponent],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [ConfirmDialogComponent],
})
export class SharedModule { }
