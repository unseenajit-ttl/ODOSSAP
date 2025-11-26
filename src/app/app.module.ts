import { Injectable, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from '../app/SharedComponent/header/header.component';
import { FooterComponent } from '../app/SharedComponent/footer/footer.component';
import { LayoutComponent } from '../app/SharedComponent/layout/layout.component';
import { HomeComponent } from './home/home.component';
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieConsentComponent } from './cookie-consent.component';
import moment from 'moment';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgbDateParserFormatter, NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { MaterialModule } from '../app/SharedComponent/material-module'
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToggleButtonComponent } from '../app/SharedComponent/ToggleButton/togglebutton.component';
import { SideMenu } from './SharedComponent/SideMenu/SideMenu';
import { ToastrModule } from 'ngx-toastr';
import { ResolverForShapesurchargeGuard } from 'src/app/guards/shapesurcharge/resolver-for-shapesurcharge.guard'
//import { TokenInterceptor } from './core/token.interceptor';
import { DeleteDialogComponent } from './SharedComponent/Dialogs/delete-dialog/delete-dialog.component';
import { LoadingComponent } from 'src/app/SharedComponent/loader/loading';
import { SharedModule } from './SharedComponent/shared.module';
import { ConfirmDialogComponent } from './SharedComponent/ConfirmBox/confirm-dialog.component';

import { MasterModule } from './Masters/Master.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';


import { AngularSlickgridModule } from 'angular-slickgrid';
import { NgxSpinnerModule } from 'ngx-spinner';
import { InvalidTokenComponent } from './SharedComponent/invalid-token/invalid-token.component';
import { ReportsComponent } from './reports/reports.component';
import { TabsModule, TabsetConfig } from 'ngx-bootstrap/tabs';
import { AuthInterceptor } from './auth.interceptor';


@Injectable()
export class MomentDateFormatter extends NgbDateParserFormatter {

  readonly DT_FORMAT = 'DD/MM/YYYY';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      value = value.trim();
      let mdt = moment(value, this.DT_FORMAT)
    }
    return null;
  }
  format(date: NgbDateStruct): string {
    if (!date) return '';
    let mdt = moment([date.year, date.month - 1, date.day]);
    if (!mdt.isValid()) return '';
    return mdt.format(this.DT_FORMAT);
  }
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    CookieConsentComponent,
    HomeComponent,
    SideMenu,
    ToggleButtonComponent,
    DeleteDialogComponent,
    LoadingComponent,
    ConfirmDialogComponent,
    InvalidTokenComponent,
    ReportsComponent,

  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    NgbModule,
    NgbTooltipModule,
    MaterialModule,
    BrowserAnimationsModule,
    PdfViewerModule,
    HttpClientModule,
    SharedModule,
    MasterModule,
    NgxSpinnerModule,
    TabsModule,
    ToastrModule.forRoot(),
    AngularSlickgridModule.forRoot(),
    NgxDaterangepickerMd.forRoot()
    //     {positionClass: 'toast-bottom-right', timeOut: 5000,
    //         preventDuplicates: true,
    //         progressBar: true,
    //         maxOpened: 1,
    //         autoDismiss: true,
    //         enableHtml: true},
    // ),
  ],
  entryComponents: [],
  providers: [
    ResolverForShapesurchargeGuard,
    DatePipe,
    // ConfigService,
    // DOAuthService,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: configInitializer,
    //   multi: true,
    //   deps: [ConfigService],
    // },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: OAuthInterceptor,
    //   multi: true,
    //   deps: [
    //     ConfigService,
    //     OAuthStorage,
    //     OAuthService,
    //     OAuthResourceServerErrorHandler,
    //     OAuthModuleConfig,
    //   ],
    // },
    // {
    //   provide: RouteReuseStrategy,
    //   useClass: CustomRouteReuseStrategy,
    // },
    { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }

    // { provide : HTTP_INTERCEPTORS , useClass: TokenInterceptor, multi: true }

  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]



})
export class AppModule { }
