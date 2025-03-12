import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisciplineComponent } from './discipline.component';


const routes: Routes = [
  { path: '', component: DisciplineComponent},
  { path: 'discipline', component: DisciplineComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisciplineRoutingModule { }