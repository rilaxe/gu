import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportStudentsComponent } from './import-students.component';
import { RegisterStudentComponent } from './register-students.component';
import { AllStudentsComponent } from './all-students.component';
import { StudentProfileComponent } from './student-profile.component';
import { GraduatedComponent } from './graduated.component';
import { DeactivatedStudentsComponent } from './deactivated-students.component';
import { ViewEnrollComponent } from './view-enroll.component';
import { EnrollStudentsComponent } from './enroll-students.component';
import { StudentDirectory } from './student-directory.component';
import { StudentIdCardComponent } from './student-id-card.component';
import { BodyMassComponent } from './bodymass.component';
import { EstimatedAttendanceComponent } from './estimatedAttendance.component';
import { HouseComponent } from './house.component';
import { AssignHouseComponent } from './assign-house.component';


const routes: Routes = [
  //{ path: '', component: DashboardComponent},
  { path: 'register-student', component: RegisterStudentComponent},
  { path: 'import-students', component: ImportStudentsComponent},
  { path: 'student-directory', component: StudentDirectory},
  { path: 'all-students', component: AllStudentsComponent},
  { path: 'student-profile/:id', component: StudentProfileComponent},
  { path: 'graduated-students', component: GraduatedComponent},
  { path: 'deactivated-students', component: DeactivatedStudentsComponent},
  { path: 'view-enroll/:id', component: ViewEnrollComponent},
  { path: 'enroll-students/:id', component: EnrollStudentsComponent},
  { path: 'student-idcard/:id', component: StudentIdCardComponent},
  { path: 'bodymass', component: BodyMassComponent},
  { path: 'estimatedattendance', component: EstimatedAttendanceComponent},
  { path: 'house', component: HouseComponent},
  { path: 'assign-house', component: AssignHouseComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminStudentsRoutingModule { }