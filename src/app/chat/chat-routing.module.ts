import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat.component';
import { ReplyComponent } from './reply.component';


const routes: Routes = [
  { path: '', component: ChatComponent},
  { path: 'medicals', component: ChatComponent},
  { path: 'reply', component: ReplyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }