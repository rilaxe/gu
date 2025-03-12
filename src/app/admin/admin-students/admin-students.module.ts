import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router'
import { AdminStudentsRoutingModule } from './admin-students-routing.module';
import { ImportStudentsComponent } from './import-students.component';
import { AdmissionComponent } from './admission.component';
import { OtherInfoComponent } from './other-info.component';
import { ParentInfoComponent } from './parent-info.component';
import { RegisterStudentComponent } from './register-students.component';
import { AllStudentsComponent } from './all-students.component';
import { StudentProfileComponent } from './student-profile.component';
import { GraduatedComponent } from './graduated.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DeactivatedStudentsComponent } from './deactivated-students.component';
import { ViewEnrollComponent } from './view-enroll.component';
import { EnrollStudentsComponent } from './enroll-students.component';
import { StudentDirectory } from './student-directory.component';
import { StudentIdCardComponent } from './student-id-card.component';
import { BodyMassComponent } from './bodymass.component';
import { AcademicRecordComponent } from './academic-record.component';
import { EstimatedAttendanceComponent } from './estimatedAttendance.component';
import { HouseComponent } from './house.component';
import { AssignHouseComponent } from './assign-house.component';


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, AdminStudentsRoutingModule, NgApexchartsModule],
    declarations: [RegisterStudentComponent, ImportStudentsComponent, AdmissionComponent, OtherInfoComponent, 
        ParentInfoComponent, AllStudentsComponent, StudentProfileComponent, GraduatedComponent, DeactivatedStudentsComponent, 
        ViewEnrollComponent, EnrollStudentsComponent, StudentDirectory, StudentIdCardComponent, BodyMassComponent, AcademicRecordComponent, 
    EstimatedAttendanceComponent, HouseComponent, AssignHouseComponent],
})
export class AdminStudentsModule {}