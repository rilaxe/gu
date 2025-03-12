import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { StaffDashboardComponent } from './dashboard.component';
//import { ParentProfileComponent } from '../parent-profile.component';
import { StaffDashboardRoutingModule } from './staff-dashboard-routing.module';


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, StaffDashboardRoutingModule],
    declarations: [StaffDashboardComponent],
})
export class StaffDashboardModule {}