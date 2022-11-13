import { TuiRootModule, TuiDialogModule, TuiAlertModule, TuiHintModule, TuiLoaderModule } from '@taiga-ui/core';
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
import { SidebarStatsComponent } from './components/sidebar-stats/sidebar-stats.component';
import {TuiPieChartModule, TuiBarChartModule, TuiAxesModule, TuiRingChartModule, TuiBarSetModule} from '@taiga-ui/addon-charts';
import { TuiIslandModule } from '@taiga-ui/kit';
import { NgHttpCachingModule, NgHttpCachingConfig } from 'ng-http-caching';

export const CACHE_INTERVAL = 600000; // 10 minutes
export const POLL_INTERVAL = 900000; // 15 minutes

const ngHttpCachingConfig: NgHttpCachingConfig = {
  lifetime: CACHE_INTERVAL // cache expires after 10 minutes
};

@NgModule({
  declarations: [AppComponent, DashboardComponent, SidebarStatsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgHttpCachingModule.forRoot(ngHttpCachingConfig),
    TuiRootModule,
    TuiIslandModule,
    TuiLoaderModule,
    TuiDialogModule,
    TuiAlertModule,
    TuiHintModule,
    TuiPieChartModule,
    TuiBarChartModule,
    TuiBarSetModule,
    TuiAxesModule,
    TuiRingChartModule,
    GoogleChartsModule,
  ],
  providers: [NotificationService, CovidDataService, ],
  bootstrap: [AppComponent],
})
export class AppModule {}
