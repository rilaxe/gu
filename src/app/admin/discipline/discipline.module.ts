import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { DisciplineComponent } from './discipline.component';
import { DisciplineRoutingModule } from './discipline-routing.module';


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, DisciplineRoutingModule],
    declarations: [DisciplineComponent],
})
export class DisciplineModule {}