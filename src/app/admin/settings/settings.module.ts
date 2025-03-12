import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthModule } from '../../auth/auth.module';
import { SettingsRoutingModule } from './settings-routing.component';
import { ClassLevelComponent } from './class-level.component';
import { ManageSubjectsComponent } from './manage-subjects.component';
import { GradeScaleComponent } from './grade-scale.component';
import { CASetupComponent } from './ca-setup.component';
import { PsycomotorSetupComponent } from './psycomotor-setup.component';
import { SessionComponent } from './session.component';
import { SchoolProfileComponent } from './school-profile.component';
import { CoreSubjectComponent } from './core-subject.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PromotionComponent } from './promotion.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ElectiveSubjectComponent } from './elective-subjects.component';
import { ResultSettingsComponent } from './result-settings.component';
import { AutoCommentComponent } from './autocomment.component';
import { SpecialCASetupComponent } from './special-ca-setup.component';


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, SettingsRoutingModule, AuthModule, NgSelectModule, NgApexchartsModule],
    declarations: [ClassLevelComponent, ManageSubjectsComponent, GradeScaleComponent, CASetupComponent, PsycomotorSetupComponent,
         SessionComponent, SchoolProfileComponent, CoreSubjectComponent, PromotionComponent, ElectiveSubjectComponent, 
         ResultSettingsComponent, AutoCommentComponent, SpecialCASetupComponent],
})
export class SettingsModule {}