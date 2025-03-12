// import { ChangeDetectorRef, Component } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { AuthenticationService, GenericService } from '../services';
// import { FormControl, FormGroup, Validators } from '@angular/forms';

// import { Location } from '@angular/common';

// @Component({
//   selector: 'app-login',
//   templateUrl: 'login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//     loginForm: FormGroup;
//     email: string = '';
//     password: string = '';
//     loading = false;
//     submitted = false;
//     returnUrl: string;
//     passwordError: string;
//     emailError: string;
//     genk: GenericService;
//     loginModal = false;

//     constructor(
//         private route: ActivatedRoute,
//         private router: Router,
//         private locate: Location,
//         private cd: ChangeDetectorRef,
//         private authenticationService: AuthenticationService,
//         private gen: GenericService
//     ) {
//         this.genk = gen;
//         if (this.authenticationService.currentUserValue) {
//             if (this.authenticationService.currentUserValue.status === 'ADMIN') {
//                 this.router.navigate(['/' + this.genk.adminprofile]);
//             }
//             else {
//                 this.router.navigate(['/' + this.genk.profile]);
//             }
//         }
//         // redirect to home if already logged in
//     }

//     ngOnInit() {
//         this.loginForm = new FormGroup({
//             'email': new FormControl(this.email, [Validators.required]),
//             'password': new FormControl(this.password, [Validators.required])
//         }, {});

//         // get return url from route parameters or default to '/'
//         this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
//     }

//     // convenience getter for easy access to form fields
//     get f() {
//         return this.loginForm.controls;
//      }

//     submit() {
//         this.submitted = true;
//         // stop here if form is invalid
//         if (this.loginForm.invalid) {
//             this.cd.markForCheck();
//             return;
//         }

//         this.loading = true;
//             this.authenticationService.loginStudent(this.email, this.password)
//             .subscribe(
//                 data => {
//                     debugger;
//                     switch (data.code) {
//                       case 0:
//                         this.loading = false;
//                         this.togLoginModal();
//                         break;
//                       case 2:
//                         this.passwordError = 'Password is incorrect';
//                         this.emailError = '';
//                         this.loading = false;
//                         this.cd.markForCheck();
//                         break;
//                       case 3:
//                         this.emailError = 'This Admission No. is not on our record';
//                         this.passwordError = '';
//                         this.loading = false;
//                         this.cd.markForCheck();
//                         break;
//                       default:
//                         this.loading = false;
//                         this.cd.markForCheck();
//                         const url = this.returnUrl;
//                         this.returnUrl = '';
                       
//                         this.locate.replaceState('/student/dashboard');
                        
//                         // if (data.status === 'ADMIN') {
//                         //     this.locate.replaceState('/admin/dashboard');
//                         // } else {
//                         //     this.locate.replaceState(url);
//                         // }
//                         window.location.reload();
                        
//                         // this.clearForm();
//                         // this.router.navigate([url]);
//                     }
//                 }
//             );
//     }

//     togLoginModal() {
//         if (this.loginModal) {
//             this.loginModal = false;
//             this.cd.markForCheck();
//         } else {
//             this.loginModal = true;
//             this.cd.markForCheck();
//         }
//     }

//     closeLogin() {
//         this.genk.isLogin = false;
//     }
// }
