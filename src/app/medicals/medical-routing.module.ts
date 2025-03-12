import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MedicalComponent } from './medical.component';


const routes: Routes = [
  { path: '', component: MedicalComponent},
  { path: 'medicals', component: MedicalComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicalRoutingModule { }