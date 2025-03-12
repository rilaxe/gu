import { Component, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import { PaystackService } from '../../services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './verify-payment.component.html',
  styleUrls: ['verify-payment.component.css']
})
export class VerifyPaymentComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  countdata: any;
  genderStat: any;
  refobj: any;


  constructor( 
    private router: Router,
    private auth: AuthenticationService,
    private activeRoute: ActivatedRoute,
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
  this.genk.topdata = 'Verify Transaction';
  this.activeRoute.queryParamMap
  .subscribe((params) => {
    this.refobj = {...params };
    console.log(this.refobj);
    console.log(this.refobj.params.reference);
    this.paystack.verifyTransaction(this.refobj.params.reference)
  }
);
  
}

get setImg() {
    if (this.userImgPath && this.userImgPath.length > 0) {
      return this.genk.imgurl + this.userImgPath;
    } else {
      return this.genk.defaultImg;
    }
  }

  verifyTransaction(reference: string) {
    fetch(`${this.paystack.API_URL}/transaction/verify/${reference}`, {method: 'GET',
    headers: {
        Authorization: `Bearer ${this.paystack.API_KEY}`,
        'Content-Type': 'application/json',
    }})
    .then(response => response.text())
    .then((res: any) => {
        debugger;
        let resobj = JSON.parse(res) as any;
        console.log(resobj);
        // if (resobj.status) {
        //     let url = resobj.data.authorization_url;
        //     window.open(url, "_blank");
        // }
    } );
  }
}
