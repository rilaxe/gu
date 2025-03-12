import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AdminBarRoutingModule } from './bars-routing.component';
import { AdminBarsComponent } from './admin-bar.component';
import { TopBarComponent } from './top-bar.component';
import { UserBarsComponent } from './user-bar.component';
import { AdminBarsMobileComponent } from './admin-bar-mobile.component';
import { StaffBarsComponent } from './staff-bar.component';
import { StaffBarsMobileComponent } from './staff-bar-mobile.component';
import { UserBarsMobileComponent } from './user-bar-mobile.component';


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, AdminBarRoutingModule],
    declarations: [AdminBarsComponent, TopBarComponent, UserBarsComponent, AdminBarsMobileComponent, StaffBarsComponent, 
        StaffBarsMobileComponent, UserBarsMobileComponent],
})
export class BarsModule {}