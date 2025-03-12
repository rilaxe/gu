import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessPinComponent } from './access-pin.component';


const routes: Routes = [
  { path: '', component: AccessPinComponent},
  { path: 'access-pin', component: AccessPinComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessPinRoutingModule { }