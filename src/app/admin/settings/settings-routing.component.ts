import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClassLevelComponent } from './class-level.component';
import { ManageSubjectsComponent } from './manage-subjects.component';
import { GradeScaleComponent } from './grade-scale.component';
import { CASetupComponent } from './ca-setup.component';
import { PsycomotorSetupComponent } from './psycomotor-setup.component';
import { SessionComponent } from './session.component';
import { SchoolProfileComponent } from './school-profile.component';
import { CoreSubjectComponent } from './core-subject.component';
import { PromotionComponent } from './promotion.component';
import { ElectiveSubjectComponent } from './elective-subjects.component';
import { ResultSettingsComponent } from './result-settings.component';
import { AutoCommentComponent } from './autocomment.component';
import { SpecialCASetupComponent } from './special-ca-setup.component';


const routes: Routes = [
  { path: '', component: SchoolProfileComponent},
  { path: 'class-level', component: ClassLevelComponent},
  { path: 'manage-subjects', component: ManageSubjectsComponent},
  { path: 'grade-scale', component: GradeScaleComponent},
  { path: 'ca-setup', component: CASetupComponent},
  { path: 'pyscomotor-setup', component: PsycomotorSetupComponent},
  { path: 'session', component: SessionComponent},
  { path: 'school-profile', component: SchoolProfileComponent},
  { path: 'core-subject', component: CoreSubjectComponent},
  { path: 'promotion', component: PromotionComponent},
  { path: 'elective-subjects', component: ElectiveSubjectComponent},
  { path: 'result-settings', component: ResultSettingsComponent},
  { path: 'autocomment', component: AutoCommentComponent},
  { path: 'special-ca-setup', component: SpecialCASetupComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }