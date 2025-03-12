import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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


const routes: Routes = [
  { path: '', component: PsycomotorEntryComponent},
  { path: 'psycomotor-entry', component: PsycomotorEntryComponent},
  { path: 'result-entry', component: ResultEntryComponent},
  { path: 'view-result', component: ViewResultComponent},
  { path: 'comment', component: CommentComponent},
  { path: 'student-result/:id', component: StudentResultComponent},
  { path: 'mastersheet', component: MasterSheetComponent},
  { path: 'publish-result', component: PublishResultComponent},
  { path: 'subject-result', component: SubjectResultComponent},
  { path: 'block-result', component: BlockResultComponent},
  { path: 'louisville-result/:id', component: LouisvilleResultComponent},
  { path: 'annual-result/:id', component: AnnualResultComponent},
  { path: 'result-multiple', component: ResultMultipleComponent},
  { path: 'annual-result-multiple', component: AnnualResultMultipleComponent},
  {path: 'process-midterm', component: ProcessMidtermComponent},
  { path: 'louisville-annual-result/:id', component: LouisvilleAnnualResultComponent},
  { path: 'view-midterm-result', component: ViewMidtermResultComponent},
  { path: 'midterm-result/:id', component: MidtermResultComponent},
  { path: 'notre-dame-result/:id', component: NotreDameResultComponent},
  { path: 'louisville-midterm-result/:id', component: LouisvilleMidtermResultComponent},
  { path: 'weeekly-result-entry', component: WeeklyResultEntryComponent},
  { path: 'weekly-mastersheet', component: WeeklyMasterSheetComponent},
  { path: 'trailblazer-result/:id', component: TrailblazersResultComponent},
  { path: 'trailblazer-result-multiple', component: TrailblazerMultipleResultComponent},
  { path: 'special-result-entry', component: SpecialResultEntryComponent},
  { path: 'view-special-result', component: ViewSpecialResultComponent},
  { path: 'special-comment', component: SpecialCommentComponent},
  { path: 'result-entries', component: EntriesComponent},
  { path: 'view', component: ViewComponent},
  { path: 'result-comment', component: ResultCommentComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultRoutingModule { }