import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PaymentComponent } from './payment.component';
import { PaymentRoutingModule } from './payment-routing.module';
import { BillingComponent } from './billing.component';
import { VerifyPaymentComponent } from './verify-payment.component';


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, PaymentRoutingModule, NgApexchartsModule],
    declarations: [PaymentComponent, BillingComponent, VerifyPaymentComponent],
})
export class PaymentModule {}