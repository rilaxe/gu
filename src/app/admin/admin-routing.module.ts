import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';



const routes: Routes = [
  {
    path: 'dashboard',
    //component: AdminBarsComponent,
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'payment',
    //component: AdminBarsComponent,
    loadChildren: () =>
      import('./payment/payment.module').then((m) => m.PaymentModule),
  },
  {
    path: 'admin-students',
    //component: AdminBarsComponent,
    loadChildren: () =>
      import('./admin-students/admin-students.module').then((m) => m.AdminStudentsModule),
  },
  {
    path: 'admin-staff',
    //component: AdminBarsComponent,
    loadChildren: () =>
      import('./admin-staff/admin-staff.module').then((m) => m.AdminStaffModule),
  },
  {
    path: 'settings',
    component: SettingsComponent,
    loadChildren: () =>
      import('./settings/settings.module').then((m) => m.SettingsModule),
  },
  {
    path: 'result',
    loadChildren: () =>
      import('./result/result.module').then((m) => m.ResultModule),
  },
  {
    path: 'discipline',
    loadChildren: () =>
      import('./discipline/discipline.module').then((m) => m.DisciplineModule),
  },
  {
    path: 'report',
    loadChildren: () =>
      import('./report/report.module').then((m) => m.ReportModule),
  },
  {
    path: 'access-pin',
    loadChildren: () =>
      import('./access-pin/access-pin.module').then((m) => m.AccessPinModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }