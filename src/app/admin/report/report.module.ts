import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { PerformanceReportComponent } from './performance-report.component';
import { ReportRoutingModule } from './report-routing.module';
import { AwardListingComponent } from './award-listing.component';
import { ResultUploadStatisticsComponent } from './result-upload-statistics.component';
import { AllocationOverviewComponent } from './allocation-overview.component';


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, ReportRoutingModule],
    declarations: [PerformanceReportComponent, AwardListingComponent, ResultUploadStatisticsComponent, AllocationOverviewComponent],
})
export class ReportModule {}