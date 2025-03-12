import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ResultRoutingModule } from './result-routing.module';
import { PsycomotorEntryComponent } from './psycomotor-entry.component';
import { ResultEntryComponent } from './result-entry.component';
import { ViewResultComponent } from './view-result.component';
import { StudentResultComponent } from './student-result.component';
import { CommentComponent } from './comment.component';
import { MasterSheetComponent } from './mastersheet.component';
import { PublishResultComponent } from './publish-result.component';
import { SubjectResultComponent } from './subject-result.component';
import { BlockResultComponent } from './block-result.component';
import { LouisvilleResultComponent } from './louisville-result.component';
import { AnnualResultComponent } from './annual-result.component';
import { ResultMultipleComponent } from './result-multiple.component';
import { AnnualResultMultipleComponent } from './annual-result-multiple.component';
import { ProcessMidtermComponent } from './process-midterm.component';
import { LouisvilleAnnualResultComponent } from './louisville-annual-result.component';
import { ViewMidtermResultComponent } from './view-midterm-result.component';
import { MidtermResultComponent } from './midterm-result.component';
import { NotreDameResultComponent } from './notre-dame-result.component';
import { NotreDameResultAnalysis } from './notre-dame-result-analysis.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LouisvilleMidtermResultComponent } from './louisville-midterm-result.component';
import { WeeklyResultEntryComponent } from './weekly-result-entry.component';
import { WeeklyMasterSheetComponent } from './weekly-mastersheet.component';
import { TrailblazersResultComponent } from './trailblazers-result.component';
import { TrailblazerMultipleResultComponent } from './trailblazers-multiple-result.component';
import { SpecialResultEntryComponent } from './special-result-entry.component';
import { ViewSpecialResultComponent } from './view-special-result.component';
import { SpecialCommentComponent } from './special-comment.component';
import { EntriesComponent } from './entries.component';
import { ViewComponent } from './view.component';
import { ResultCommentComponent } from './result-comment.component';


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, NgApexchartsModule, ResultRoutingModule],
    declarations: [PsycomotorEntryComponent, ResultEntryComponent, ViewResultComponent, StudentResultComponent, 
        CommentComponent, MasterSheetComponent, PublishResultComponent, SubjectResultComponent, BlockResultComponent, 
        LouisvilleResultComponent, AnnualResultComponent, ResultMultipleComponent, AnnualResultMultipleComponent, 
    ProcessMidtermComponent, LouisvilleAnnualResultComponent, ViewMidtermResultComponent, MidtermResultComponent, 
    NotreDameResultComponent, NotreDameResultAnalysis, LouisvilleMidtermResultComponent, WeeklyResultEntryComponent, 
    WeeklyMasterSheetComponent, TrailblazersResultComponent, TrailblazerMultipleResultComponent, SpecialResultEntryComponent, 
    ViewSpecialResultComponent, SpecialCommentComponent, EntriesComponent, ViewComponent, ResultCommentComponent],
})
export class ResultModule {}