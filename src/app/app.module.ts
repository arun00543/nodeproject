import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { JwtInterceptor } from './core/interceptor/jwt.interceptor';
import { ErrorInterceptor } from './core/interceptor/error.interceptor';
import { NotificationsComponent } from './additional-components/notifications/notifications.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SharedService } from './shared/shared.service';
import { ConfirmationDialogComponent } from './additional-components/confirmation-dialog/confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslationService } from './core/service/translation.service';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    MatSidenavModule,
    MatIconModule,
    NgxSpinnerModule,
    MatTableExporterModule,
    MatDialogModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    NotificationsComponent,
    ConfirmationDialogComponent,
  ],
  providers: [
    JwtHelperService,
    SharedService,
    TranslationService,
    NotificationsComponent,
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
