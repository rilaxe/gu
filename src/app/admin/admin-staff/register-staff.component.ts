import { Component, Inject, Input, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { Staff } from '../../_models/school.model';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-admin-register',
  templateUrl: './register-staff.component.html',
  styleUrls: ['../../admin/admin-students/admin-students.component.css', '../../stage.css']
})
export class RegisterStaffComponent {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  tabActive = 'Person';
  staff = new Staff();
  step1 = true;
  step2 = false;
  loading = false;
  imgFile: File = null;
  imgError: string;
  passportName: string;
  destroy = new Subject;

  constructor( 
    private router: Router,
    private auth: AuthenticationService,
    private gen: GenericService
    ) {
      this.genk = gen;
      this.userName = auth.currentUserValue.name;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = auth.currentUserValue.status;
}

get setImg() {
    if (this.userImgPath && this.userImgPath.length > 0) {
      return this.genk.imgurl + this.userImgPath;
    } else {
      return this.genk.defaultImg;
    }
  }

  toggle(value: string) {
    this.tabActive = value;
  }

  moveToTwo() {
    this.step1 = false;
    this.step2 = true;
  }

  moveToOne() {
    this.step1 = true;
    this.step2 = false;
  }

  saveStaff(f: HTMLFormElement) {
    this.loading = true;
    this.staff.schoolId = this.auth.currentUserValue.schoolId;
    this.staff.passport = this.genk.staffImgFile;
    const formDat: FormData = new FormData();
    for (const key in this.staff) {
        if (this.staff[key]) {
            switch (key.toString()) {
                case 'passport':
                    formDat.append("media", this.genk.staffImgFile, this.passportName);
                    break;
                default:
                    formDat.append(key.toString(), this.staff[key]);
                    break;
            }
        }
    }
    
Swal.fire({
  title: 'Processing Data...',
  allowEscapeKey: false,
  allowOutsideClick: false,
  //timer: 2000,
  didOpen: () => {
    Swal.showLoading();
    this.auth.saveStaff(formDat)
  .pipe(takeUntil(this.destroy))
  .subscribe(res => {
      Swal.close();
      this.loading = false;
  });
    
  }
}).then(x => {
  f.reset();
  this.staff = new Staff();
  this.genk.imag = '';
  Swal.fire({
    icon: 'success',
    title: 'Staff registered successfully!.',
    showConfirmButton: false,
    timer: 2000
  });
})
}


  
  logout() {
    this.auth.logout();
    this.router.navigate(['/', this.genk.account]);
  }
}
