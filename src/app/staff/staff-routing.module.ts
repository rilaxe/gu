import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StaffProfileComponent } from './staff-profile.component';
import { StaffResultEntryComponent } from './staff-result-entry.component';
import { StaffSubjectResultComponent } from './staff-subject-result.component';
import { TeacherCommentComponent } from './teacher-comment.component';
import { StaffCalendarComponent } from './staff-calendar.component';
import { StaffWeeklyResultEntryComponent } from './staff-weekly-result-entry.component';
import { HostelCommentComponent } from './hostel-comment.component';
import { SpecialStaffResultEntryComponent } from './special-staff-result-entry.component';



const routes: Routes = [
  {
    path: '',
    //component: AdminBarsComponent,
    loadChildren: () =>
      import('./dashboard/staff-dashboard.module').then((m) => m.StaffDashboardModule),
  },
  {
    path: 'dashboard',
    //component: AdminBarsComponent,
    loadChildren: () =>
        import('./dashboard/staff-dashboard.module').then((m) => m.StaffDashboardModule),
  },
  {
    path: 'staff',
    //component: AdminBarsComponent,
    loadChildren: () =>
      import('./staff.module').then((m) => m.StaffModule),
  },
  { path: 'profile', component: StaffProfileComponent},
  { path: 'result-entry', component: StaffResultEntryComponent},
  { path: 'staff-result-entry', component: SpecialStaffResultEntryComponent},
  { path: 'subject-result', component: StaffSubjectResultComponent},
  { path: 'teacher-comment', component: TeacherCommentComponent},
  { path: 'calendar', component: StaffCalendarComponent},
  { path: 'staff-weeekly-entry', component: StaffWeeklyResultEntryComponent},
  { path: 'hostel-comment', component: HostelCommentComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }