import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AttendanceComponent } from './attendance.component';
import { AttendanceRoutingModule } from './attendance-routing.module';


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, AttendanceRoutingModule, FullCalendarModule],
    declarations: [AttendanceComponent],
})
export class AttendanceModule {}