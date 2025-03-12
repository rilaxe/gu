import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParentProfileComponent } from './parent-profile.component';
import { ParentResultComponent } from './parent-result.component';
import { StudentCalendarComponent } from './student-calendar.component';
import { StudentNoticeboardComponent } from './student-noticeboard.component';
import { ParentResultViewComponent } from './result-view.component';
import { ResultAnalysisComponent } from './result-analysis.component';
import { SubjectTeacherComponent } from './subject-teacher.component';
import { MyResultListComponent } from './myresult-list.component';



const routes: Routes = [
  {
    path: '',
    //component: AdminBarsComponent,
    loadChildren: () =>
      import('./dashboard/student-dashboard.module').then((m) => m.StudentDashboardModule),
  },
  {
    path: 'dashboard',
    //component: AdminBarsComponent,
    loadChildren: () =>
      import('./dashboard/student-dashboard.module').then((m) => m.StudentDashboardModule),
  },
  {
    path: 'student',
    //component: AdminBarsComponent,
    loadChildren: () =>
      import('./student.module').then((m) => m.StudentModule),
  },
  { path: 'profile', component: ParentProfileComponent},
  { path: 'parent-result', component: ParentResultComponent},
  { path: 'parent-result-view', component: ParentResultViewComponent},
  { path: 'student-calendar', component: StudentCalendarComponent},
  { path: 'student-noticeboard', component: StudentNoticeboardComponent},
  { path: 'result-analysis', component: ResultAnalysisComponent},
  { path: 'subject-teacher', component: SubjectTeacherComponent},
  { path: 'myresultlist', component: MyResultListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }