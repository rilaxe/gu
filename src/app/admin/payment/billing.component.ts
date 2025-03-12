import { Component, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import { PaystackService } from '../../services/payment.service';

@Component({
  templateUrl: './billing.component.html',
  styleUrls: []
})
export class BillingComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  billingdata: any;
  subscriptionPlan: string;
  selectedPlan: string;


  constructor( 
    private router: Router,
    private auth: AuthenticationService,
    private paystack: PaystackService,
    private sch: SchoolService,
    private gen: GenericService
    ) {
      this.genk = gen;
      this.userName = auth.currentUserValue.name;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = auth.currentUserValue.status;

      
}

ngOnInit(): void {
  this.genk.topdata = 'Billing';
  this.getBillingData();
}

// changeCategorySession() {
//   this.category = 'SESSION';
// }

// changeCategoryTermly() {
//   this.category = 'TERMLY';
// }

get setImg() {
    if (this.userImgPath && this.userImgPath.length > 0) {
      return this.genk.imgurl + this.userImgPath;
    } else {
      return this.genk.defaultImg;
    }
  }

  get isBasic() {
    return this.subscriptionPlan == 'BASIC' ? true : false;
  }

  get isStandard() {
    return this.subscriptionPlan == 'STANDARD' ? true : false;
  }

  get isPremium() {
    return this.subscriptionPlan == 'PREMIUM' ? true : false;
  }

  get isCustom() {
    return this.subscriptionPlan == 'CUSTOM' ? true : false;
  }

  getBillingData() {
    this.sch.getBillingData()
      .subscribe(res => {
        this.billingdata = res[0];
        this.subscriptionPlan = res[0].subscription;
        this.selectedPlan = res[0].subscription;
      })
  }

  // payOnline() {
  //   let amount = this.getAmount();
  //   let email = this.billingdata.email;
  //   this.sch.getBillingData()
  //     .subscribe(res => {
  //       this.billingdata = res[0];
  //       this.subscriptionPlan = res[0].subscription;
  //     })
  // }

  getAmount() {
    return this.subscriptionPlan == 'BASIC' ? this.billingdata.studentCount * 1500 * 100 : this.billingdata.studentCount * 3000 * 100 ;
  }

  getDisplayAmount() {
      return this.selectedPlan == 'BASIC' ? this.billingdata.studentCount * 3000 : this.billingdata.studentCount * 5000;
  }

  displayBasicPrice() {
    return 3000;
  }

  displayStandardPrice() {
    return 5000;
  }

  displayPremiumPrice() {
    return 7500;
  }

  payOnline() {
    let amount = this.getAmount();
    let email = this.billingdata.email;
    let meta = {cancel_action: "http://localhost:4200/admin/payment"};
    let datae = {amount: amount, email: email, currency: 'NGN', callback_url: 'http://localhost:4200/admin/payment/verify-payment', metadata: meta};
    try {
      this.paystack.initializedTransaction(datae, this.selectedPlan);

      // if (!transaction.status) {
      //   throw new Error(transaction.message);
      // }

      // return { authorization_url: transaction.data.authorization_url };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // switchCat(value: string) {
  //   this.genk.isCategoryActive = value == 'pass'? true : false;
  //   this.resultlist = value == 'pass'? this.passedResult : this.failedResult;
  //   this.isPassed = value == 'pass'? true : false;
  // }
}
