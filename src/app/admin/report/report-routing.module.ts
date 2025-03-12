import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerformanceReportComponent } from './performance-report.component';
import { AwardListingComponent } from './award-listing.component';
import { ResultUploadStatisticsComponent } from './result-upload-statistics.component';
import { AllocationOverviewComponent } from './allocation-overview.component';


const routes: Routes = [
  //{ path: '', component: BillingComponent},
  { path: 'performance-report', component: PerformanceReportComponent},
  { path: 'award-listing', component: AwardListingComponent},
  { path: 'result-upload-statistics', component: ResultUploadStatisticsComponent},
  { path: 'allocation-overview', component: AllocationOverviewComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }