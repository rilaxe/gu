import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentDashboardComponent } from './dashboard.component';
import { ParentProfileComponent } from '../parent-profile.component';


const routes: Routes = [
  { path: '', component: StudentDashboardComponent},
  { path: 'dashboard', component: StudentDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentDashboardRoutingModule { }