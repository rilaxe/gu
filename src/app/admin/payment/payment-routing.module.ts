import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { BillingComponent } from './billing.component';
import { VerifyPaymentComponent } from './verify-payment.component';


const routes: Routes = [
  { path: '', component: BillingComponent},
  { path: 'payment', component: PaymentComponent},
  { path: 'billing', component: BillingComponent},
  { path: 'verify-payment', component: VerifyPaymentComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }