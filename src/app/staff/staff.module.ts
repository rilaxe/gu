import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { StaffRoutingModule } from './staff-routing.module';
import { StaffProfileComponent } from './staff-profile.component';
import { StaffResultEntryComponent } from './staff-result-entry.component';
import { StaffSubjectResultComponent } from './staff-subject-result.component';
import { TeacherCommentComponent } from './teacher-comment.component';
import { StaffCalendarComponent } from './staff-calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { StaffWeeklyResultEntryComponent } from './staff-weekly-result-entry.component';
import { HostelCommentComponent } from './hostel-comment.component';
import { SpecialStaffResultEntryComponent } from './special-staff-result-entry.component';


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, StaffRoutingModule, NgApexchartsModule, FullCalendarModule],
    declarations: [StaffProfileComponent, StaffResultEntryComponent, StaffSubjectResultComponent, TeacherCommentComponent, 
        StaffCalendarComponent, StaffWeeklyResultEntryComponent, HostelCommentComponent, SpecialStaffResultEntryComponent],
})
export class StaffModule {}