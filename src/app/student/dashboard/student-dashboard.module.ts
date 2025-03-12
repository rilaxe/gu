import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { StudentDashboardComponent } from './dashboard.component';
import { StudentDashboardRoutingModule } from './student-dashboard-routing.module';
import { ParentProfileComponent } from '../parent-profile.component';


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, StudentDashboardRoutingModule],
    declarations: [StudentDashboardComponent],
})
export class StudentDashboardModule {}