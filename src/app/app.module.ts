import { TuiRootModule, TuiDialogModule, TuiAlertModule } from '@taiga-ui/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CovidDataService } from './services/covid-data/covid-data.service';
import { HttpClientModule } from '@angular/common/http';
import { NotificationService } from './services/notification/notification.service';

@NgModule({
  declarations: [AppComponent, DashboardComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    GoogleChartsModule,
  ],
  providers: [NotificationService, CovidDataService, ],
  bootstrap: [AppComponent],
})
export class AppModule {}
