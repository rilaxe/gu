import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminBarsComponent } from './bars/admin-bar.component';
import { UserBarsComponent } from './bars/user-bar.component';
import { StaffBarsComponent } from './bars/staff-bar.component';

const routes: Routes = [
  {
    path: '',
    //component: StartComponent,
    loadChildren: () =>
      import('./start/start.module').then((m) => m.StartModule),
  },
  {
    path: 'start',
    //component: StartComponent,
    loadChildren: () =>
      import('./start/start.module').then((m) => m.StartModule),
  },
  {
    path: 'school',
    //component: UserSidebarComponent,
    loadChildren: () =>
      import('./school/school.module').then((m) => m.SchoolModule),
  },

  {
    path: 'student',
    component: UserBarsComponent,
    loadChildren: () =>
      import('./student/student.module').then((m) => m.StudentModule),
  },
  {
    path: 'staff',
    component: StaffBarsComponent,
    //component: UserBarsComponent,
    loadChildren: () =>
      import('./staff/staff.module').then((m) => m.StaffModule),
  },
  {
    path: 'admin',
    component: AdminBarsComponent,
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'payment',
    component: AdminBarsComponent,
    loadChildren: () =>
      import('./admin/payment/payment.module').then((m) => m.PaymentModule),
  },
  {
    path: 'bars',
    //component: UserSidebarComponent,
    loadChildren: () =>
      import('./bars/bars.module').then((m) => m.BarsModule),
  },
  {
    path: 'account',
    //component: UserSidebarComponent,
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'calendar',
    component: AdminBarsComponent,
    loadChildren: () =>
      import('./calendar/calendar.module').then((m) => m.CalendarModule),
  },
  {
    path: 'attendance',
    component: AdminBarsComponent,
    loadChildren: () =>
      import('./attendance/attendance.module').then((m) => m.AttendanceModule),
  },
  {
    path: 'medicals',
    component: AdminBarsComponent,
    loadChildren: () =>
      import('./medicals/medical.module').then((m) => m.MedicalModule),
  },
  {
    path: 'chat',
    component: AdminBarsComponent,
    loadChildren: () =>
      import('./chat/chat.module').then((m) => m.ChatModule),
  },
  {
    path: 'notice',
    component: AdminBarsComponent,
    loadChildren: () =>
      import('./notice/notice.module').then((m) => m.NoticeModule),
  },
  {
    path: 'assignment',
    component: AdminBarsComponent,
    loadChildren: () =>
      import('./assignment/assignment.module').then((m) => m.AssignmentModule),
  },
  {
    path: 'test',
    loadChildren: () =>
      import('./test/test.module').then((m) => m.TestModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
