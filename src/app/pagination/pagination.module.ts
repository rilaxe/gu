import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { PaginationComponent } from './pagination.component';
import { PaginationRoutingModule } from './pagination-routing.module';


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, PaginationRoutingModule],
    declarations: [PaginationComponent],
    exports: [PaginationComponent]
})
export class PaginationModule {}