import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminBarsComponent } from './admin-bar.component';
import { TopBarComponent } from './top-bar.component';


const routes: Routes = [
  { path: 'admin-bar', component: AdminBarsComponent},
  { path: 'top-bar', component: TopBarComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminBarRoutingModule { }