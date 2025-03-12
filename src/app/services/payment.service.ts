export interface IInitializeTransaction {
  amount: number;
  email: string;
  currency: string; 
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, any>;
}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { SchoolService } from './school.service';

@Injectable({ providedIn: 'root' })
export class PaystackService {
  constructor(private sch: SchoolService) {
  }
    meta = {
        "custom_fields": [
          {
            "display_name": "Invoice ID",
            "variable_name": "Invoice ID",
            "value": 209
          }
        ]
      }
    

  API_URL = 'https://api.paystack.co';
  API_KEY = environment.secret_key;

  initializedTransaction(data: IInitializeTransaction, selectedPlan: string) {
    fetch(`${this.API_URL}/transaction/initialize`, {method: 'POST',
    headers: {
        Authorization: `Bearer ${this.API_KEY}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)})
    .then(response => response.text())
    .then((res: any) => {
        debugger;
        let resobj = JSON.parse(res) as any;
        console.log(resobj);
        if (resobj.status) {
            let url = resobj.data.authorization_url;
            this.sch.saveTemporaryPayment(selectedPlan, (data.amount / 100).toString())
            .subscribe(res => {
              window.open(url, "_blank");
            })
        } else {
          alert('An error has occured while initializing payment!');
        }
        // const fee = JSON.parse(res) as any
        // let mydi =  fee.data;
        // return res;
    } );
  }

  verifyTransaction(reference: string) {
    fetch(`${this.API_URL}/transaction/verify/${reference}`, {method: 'GET',
    headers: {
        Authorization: `Bearer ${this.API_KEY}`,
        'Content-Type': 'application/json',
    }})
    .then(response => response.text())
    .then((res: any) => {
        debugger;
        let resobj = JSON.parse(res) as any;
        console.log(resobj);
        if (resobj.data.status) {
          // this.sch.savePayment()
          // .subscribe(res => {
          //   window.open(url, "_blank");
          // })
        }
    } );

    // const response = await axios.get(
    //   `${this.API_URL}/transaction/verify/${reference}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${this.API_KEY}`,
    //       'Content-Type': 'application/json',
    //     },
    //   },
    // );
  }


//   public sendGetRequest() {
//     const myFormData = { email: 'abc@abc.com', password: '123' };
//     const headers = new HttpHeaders();
//     headers.append('Content-Type', 'application/json');
  
//     this.http.post(this.REST_API_SERVER, myFormData, {
//       headers: headers,
//     })
//     .subscribe((data) => {
//       console.log(data, myFormData, headers);
//       return data;
//     });
//   }
  
}