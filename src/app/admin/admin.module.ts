import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';
import { SettingsComponent } from './settings.component';


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, AdminRoutingModule],
    declarations: [SettingsComponent],
})
export class AdminModule {}