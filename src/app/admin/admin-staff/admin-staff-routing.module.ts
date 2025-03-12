import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterStaffComponent } from './register-staff.component';
import { ImportStaffComponent } from './import-staff.component';
import { ViewClassesComponent } from './view-classes.component';
import { AllStaffComponent } from './all-staff.component';
import { ClassPlacementComponent } from './class-placement.component';
import { ViewStaffComponent } from './view-staff.component';
import { DeactivatedStaffComponent } from './deactivated-staff.component';


const routes: Routes = [
  //{ path: '', component: DashboardComponent},
  { path: 'register-staff', component: RegisterStaffComponent},
  { path: 'import-staff', component: ImportStaffComponent},
  { path: 'view-classes', component: ViewClassesComponent},
  { path: 'all-staff', component: AllStaffComponent},
  { path: 'class-placement', component: ClassPlacementComponent},
  { path: 'view-staff/:id', component: ViewStaffComponent},
  { path: 'deactivated-staff', component: DeactivatedStaffComponent},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminStaffRoutingModule { }