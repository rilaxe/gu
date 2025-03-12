import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MedicalComponent } from './medical.component';
import { MedicalRoutingModule } from './medical-routing.module';
import { NgApexchartsModule } from 'ng-apexcharts';


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, MedicalRoutingModule, NgApexchartsModule],
    declarations: [MedicalComponent],
})
export class MedicalModule {}