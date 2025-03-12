import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthenticationService, GenericService } from '../services';
import { SchoolService } from '../services/school.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ImageService } from '../services/image.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['start.component.css'],
})
export class StartComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;

  loginForm: FormGroup;
  loginStudentForm: FormGroup;
    email: string = '';
    password: string = '';
    loading = false;
    submitted = false;
    returnUrl: string;
    passwordError: string;
    emailError: string;
    loginModal = false;

  schools: any[];
  schoolClasses = [];
  students = [];
  //schoolId: string;
  studentCheck = true;
  staffCheck = false;
  logpage = 'none';
  currentClassId: string;
  surname: string;
  isNoStudents = false;

  constructor( 
    private router: Router,
    private route: ActivatedRoute,
    private image_service: ImageService,
    private locate: Location,
    private authenticationService: AuthenticationService,
    private school: SchoolService,
    private auth: AuthenticationService,
    private gen: GenericService
    ) {
      this.genk = gen;
      if (this.genk.selectedSchoolId) {
        let moo = this.genk.selectedSchoolId;
      }
      // this.userName = auth.currentUserValue.name;
      // this.userImgPath = auth.currentUserValue.imgPath;
      // this.adminStatus = auth.currentUserValue.status;
}

ngOnInit(): void {
  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';

  this.loginForm = new FormGroup({
    'email': new FormControl(this.email, [Validators.required]),
    'password': new FormControl(this.password, [Validators.required])
}, {});

this.loginStudentForm = new FormGroup({
  'studentEmail': new FormControl(this.email, [Validators.required]),
  'studentPassword': new FormControl(this.password, [Validators.required])
}, {});
  this.getSchools();
}

get setImg() {
    if (this.userImgPath && this.userImgPath.length > 0) {
      return this.genk.imgurl + this.userImgPath;
    } else {
      return this.genk.defaultImg;
    }
  }

  changeSchool(fir: any) {
    debugger
    this.genk.selectedSchoolId = Number(fir.value); 
    this.getClassNames()
  }

  getSchools() {
    this.school.listSchools().subscribe(res => {
      this.schools = res;
      //this.getClassNames()
    });
  }

  getClassNames() {
    this.school.getClassNamesBySchool(this.genk.selectedSchoolId.toString())
    .subscribe(res => {
      this.schoolClasses = res;
    });
  }

  searchSurname() {
    this.school.getSurnamesByClass(this.genk.selectedSchoolId.toString(), this.currentClassId.toString(), this.surname)
    .subscribe(res => {
      this.students = res;
      this.isNoStudents = this.students.length > 0 ? false : true;
    });
  }

  switchPage() {
    if (this.staffCheck) {
      this.logpage = 'staff';
    }
    if (this.studentCheck) {
      this.logpage = 'student';
    }
  }

  returnPage() {
    this.logpage = 'none';
  }

  submitAdmin() {
    this.submitted = true;
    // // stop here if form is invalid
    // if (this.loginForm.invalid) {
    //     return;
    // }

    this.loading = true;
        this.authenticationService.login(this.email, this.password, Number(this.genk.selectedSchoolId.toString()))
        .subscribe(
            data => {
                switch (data.code) {
                  case 0:
                    this.loading = false;
                    //this.togLoginModal();
                    break;
                  case 2:
                    this.passwordError = 'Password is incorrect';
                    this.emailError = '';
                    this.loading = false;
                    //this.cd.markForCheck();
                    break;
                  case 3:
                    this.emailError = 'This email is not on our record';
                    this.passwordError = '';
                    this.loading = false;
                    //this.cd.markForCheck();
                    break;
                  default:
                    this.loading = false;
                    //this.cd.markForCheck();
                    const url = this.returnUrl;
                  
                    debugger;

                    if (data.status == '1') {
                      if (url) {
                        this.locate.replaceState(url);
                      } else {
                        this.locate.replaceState('/admin/dashboard');
                      }
                    } else {
                      if (url) {
                        this.locate.replaceState(url);
                      } else {
                        this.locate.replaceState('/staff/dashboard');
                      }
                    }
                   
                    
                    
                    // if (data.status === 'ADMIN') {
                    //     this.locate.replaceState('/admin/dashboard');
                    // } else {
                    //     this.locate.replaceState(url);
                    // }
                    window.location.reload();
                    
                    // this.clearForm();
                    // this.router.navigate([url]);
                }
            }
        );
}

submit() {
  this.submitted = true;
  // stop here if form is invalid
  if (this.loginStudentForm.invalid) {
      return;
  }

  this.loading = true;
      this.authenticationService.loginStudent(this.email, this.password, Number(this.genk.selectedSchoolId.toString()))
      .subscribe(
          data => {
              debugger;
              switch (data.code) {
                case 0:
                  this.loading = false;
                  break;
                case 2:
                  this.passwordError = 'Password is incorrect';
                  this.emailError = '';
                  this.loading = false;
                  break;
                case 3:
                  this.emailError = 'This Admission No. is not on our record';
                  this.passwordError = '';
                  this.loading = false;
                  break;
                default:
                  this.loading = false;
                  const url = this.returnUrl;
                  this.returnUrl = '';
                 
                  this.locate.replaceState('/student/dashboard');
                  
                  // if (data.status === 'ADMIN') {
                  //     this.locate.replaceState('/admin/dashboard');
                  // } else {
                  //     this.locate.replaceState(url);
                  // }
                  window.location.reload();
                  
                  // this.clearForm();
                  // this.router.navigate([url]);
              }
          }
      );
}



textToCopy: string = 'This is the text to copy.';

  copyTextToClipboard(admission: string): void {
    navigator.clipboard.writeText(admission.trim()).then(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Admission Number copied!',
          showConfirmButton: false,
          timer: 2000
      });;
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Failed to copy Admission Number!',
          showConfirmButton: false,
          timer: 2000
      });
      }
    );
  }

}
