import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TestComponent } from './test.component';
import { TestRoutingModule } from './test-routing.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, TestRoutingModule, PdfViewerModule],
    declarations: [TestComponent],
})
export class TestModule {}