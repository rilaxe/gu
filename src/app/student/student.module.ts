import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { StudentRoutingModule } from './student-routing.module';
import { ParentProfileComponent } from './parent-profile.component';
import { ParentResultComponent } from './parent-result.component';
import { StudentCalendarComponent } from './student-calendar.component';
import { StudentNoticeboardComponent } from './student-noticeboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ParentResultViewComponent } from './result-view.component';
import { ResultAnalysisComponent } from './result-analysis.component';
import { SubjectTeacherComponent } from './subject-teacher.component';
import { MyResultListComponent } from './myresult-list.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, StudentRoutingModule, NgApexchartsModule, FullCalendarModule, PdfViewerModule],
    declarations: [ParentResultComponent, ParentProfileComponent, StudentCalendarComponent, StudentNoticeboardComponent, 
        ParentResultViewComponent, ResultAnalysisComponent, SubjectTeacherComponent, MyResultListComponent],
})
export class StudentModule {}