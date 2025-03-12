import { Component, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import { PaystackService } from '../../services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: []
})
export class PaymentComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  countdata: any;
  genderStat: any;


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
  this.genk.topdata = 'Payment and Billing';
  this.getPopulationData();
  this.genderStat();
  
}

get setImg() {
    if (this.userImgPath && this.userImgPath.length > 0) {
      return this.genk.imgurl + this.userImgPath;
    } else {
      return this.genk.defaultImg;
    }
  }

  getPopulationData() {
    this.sch.getPopulationData()
      .subscribe(res => {
        this.countdata = res[0];
      })
  }

  
  // async paySubscription() {


  //   try {
  //     const transaction = await this.paystack.initializedTransaction({
  //       amount: amount * 100,
  //       email,
  //       metadata: { reoccurring, frequency, fullName },
  //     });

  //     if (!transaction.status) {
  //       throw new Error(transaction.message);
  //     }

  //     return { authorization_url: transaction.data.authorization_url };
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }

  // async verifyDonation(trxref: string) {
  //   try {
  //     const transaction = await this.paystack.verifyTransaction(trxref);

  //     if (!transaction.status) {
  //       throw new Error(transaction.message);
  //     }

  //     if (transaction.data.status !== 'success') {
  //       throw new Error(transaction.data.gateway_response);
  //     }

  //     const {
  //       amount,
  //       reference,
  //       customer: { email },
  //       metadata: { fullName, reoccurring, frequency },
  //     } = transaction.data;

  //     const donation = this.donationRepo.create({
  //       fullName,
  //       amount: amount / 100,
  //       email,
  //       reference,
  //       reoccurring: reoccurring === 'true' ? true : false,
  //       frequency,
  //     });

  //     await this.donationRepo.save(donation);

  //     return { donation };
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }
}
