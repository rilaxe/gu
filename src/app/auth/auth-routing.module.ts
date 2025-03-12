import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register.component';


const routes: Routes = [
  //{ path: '', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  // { path: 'login', component: LoginComponent},
  // { path: 'admin-login', component: AdminLoginComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }