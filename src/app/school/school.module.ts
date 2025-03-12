import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { SchoolComponent } from './school.component';
import { SchoolRoutingModule } from './school-routing.component';
import { AuthModule } from '../auth/auth.module';


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, SchoolRoutingModule, AuthModule],
    declarations: [SchoolComponent],
})
export class SchoolModule {}