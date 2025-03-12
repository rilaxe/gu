import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StaffDashboardComponent } from './dashboard.component';


const routes: Routes = [
  { path: '', component: StaffDashboardComponent},
  { path: 'dashboard', component: StaffDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffDashboardRoutingModule { }