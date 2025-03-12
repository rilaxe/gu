import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { RegisterStaffComponent } from './register-staff.component';
import { AdminStaffRoutingModule } from './admin-staff-routing.module';
import { ImportStaffComponent } from './import-staff.component';
import { ViewClassesComponent } from './view-classes.component';
import { AllStaffComponent } from './all-staff.component';
import { ClassPlacementComponent } from './class-placement.component';
import { ViewStaffComponent } from './view-staff.component';
import { DeactivatedStaffComponent } from './deactivated-staff.component';


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, AdminStaffRoutingModule],
    declarations: [RegisterStaffComponent, ImportStaffComponent, ViewClassesComponent, AllStaffComponent,
         ClassPlacementComponent, ViewStaffComponent, DeactivatedStaffComponent],
})
export class AdminStaffModule {}