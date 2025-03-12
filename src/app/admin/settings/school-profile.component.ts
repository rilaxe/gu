import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { AuthenticationService, GenericService } from '../../services';
import { schoolModel } from '../../_models/school.model';
import { SchoolService } from '../../services/school.service';

@Component({
  selector: 'app-admin-register',
  templateUrl: './school-profile.component.html',
  styleUrls: ['../../stage.css']
})
export class SchoolProfileComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  tabActive = 'Person';
  school = new schoolModel();
  step1 = true;
  step2 = false;
  loading = false;
  imgFile: File = null;
  imgError: string;
  passportName: string;
  destroy = new Subject;
  schoolObj: any;
  isChangeEmail = false;
  isChangePassword = false;
  myadmin: any;
  adminEmail: string;
  currentAdminPassword: string;
  adminPassword: string;
  newAdminPassword: string;
  newTestAdminPassword: string;
  emailChanged = false;
  isSurname = false;
  isAdmissionNo = false;
  isAccessPin = false;
  isPhone = false;

  isStaffSurname = false;
  isStaffIdCardNo = false;
  isStaffEmail = false;
  isStaffPhone = false;
  loginFieldList = [];
  staffLoginFieldList = [];

  constructor( 
    private router: Router,
    private auth: AuthenticationService,
    private gen: GenericService,
    private sch: SchoolService
    ) {
      this.genk = gen;
      this.userName = auth.currentUserValue.name;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = auth.currentUserValue.status;
}

ngOnInit(): void {
  this.getSchool();
  this.getAdminUser();
  this.getLoginFields();
  this.getStaffLoginFields();
  this.genk.topdata = 'School Profile';
}

getSchool() {
  this.sch.getSchoolById(this.auth.currentUserValue.schoolId.toString()).subscribe(res => {
    this.school = res;
  })
}

getAdminUser() {
  this.sch.getAdminUser().subscribe(res => {
    this.myadmin = res;
    this.adminEmail = res.username;
  })
}

getStaffLoginFields() {
  this.sch.getStaffLoginFields().subscribe(res => {
    this.staffLoginFieldList = res;
    this.isStaffIdCardNo = this.checkStaffLoginFields('idcardno');
    this.isStaffPhone = this.checkStaffLoginFields('phone');
    this.isStaffSurname = this.checkStaffLoginFields('surname');
    this.isStaffEmail = this.checkStaffLoginFields('email');
  })
}

getLoginFields() {
  this.sch.getLoginFields().subscribe(res => {
    this.loginFieldList = res;
    this.isAdmissionNo = this.checkLoginFields('admissionno');
    this.isPhone = this.checkLoginFields('phone');
    this.isSurname = this.checkLoginFields('surname');
    this.isAccessPin = this.checkLoginFields('accesspin');
  })
}

checkLoginFields(value: string) {
  let fieldlist = this.loginFieldList.filter(t => t.name == value);
  return fieldlist.length > 0 ? true : false;
}

checkStaffLoginFields(value: string) {
  let fieldlist = this.staffLoginFieldList.filter(t => t.name == value);
  return fieldlist.length > 0 ? true : false;
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

  setField(value: boolean, fieldname: string) {
    if (value) {
      this.sch.addLoginField(fieldname)
      .pipe(takeUntil(this.destroy))
      .subscribe(res => {
        Swal.fire({
          icon: 'success',
          title: 'Login fields updated successfully!.',
          showConfirmButton: false,
          timer: 2000
        });
      });
    } else {
      this.sch.removeLoginField(fieldname)
      .pipe(takeUntil(this.destroy))
      .subscribe(res => {
        Swal.fire({
          icon: 'success',
          title: 'Login fields updated successfully!.',
          showConfirmButton: false,
          timer: 2000
        });
      });
    }
  }

  setStaffField(value: boolean, fieldname: string) {
    if (value) {
      this.sch.addStaffLoginField(fieldname)
      .pipe(takeUntil(this.destroy))
      .subscribe(res => {
        Swal.fire({
          icon: 'success',
          title: 'Login fields updated successfully!.',
          showConfirmButton: false,
          timer: 2000
        });
      });
    } else {
      this.sch.removeStaffLoginField(fieldname)
      .pipe(takeUntil(this.destroy))
      .subscribe(res => {
        Swal.fire({
          icon: 'success',
          title: 'Login fields updated successfully!.',
          showConfirmButton: false,
          timer: 2000
        });
      });
    }
  }

  moveToTwo() {
    this.step1 = false;
    this.step2 = true;
  }

  moveToOne() {
    this.step1 = true;
    this.step2 = false;
  }

  saveSchoolProfile(f: HTMLFormElement) {
    this.loading = true;
    this.school.id = this.auth.currentUserValue.schoolId;
    this.school.banner = this.genk.bannerImgFile;
    this.school.logo = this.genk.logoImgFile;
    this.school.signature = this.genk.signatureImgFile;
    const formDat: FormData = new FormData();
    for (const key in this.school) {
        if (this.school[key]) {
            switch (key.toString()) {
              case 'logo':
                formDat.append("media", this.genk.logoImgFile, this.passportName);
                this.school.photoType = this.school.photoType + 'logo';
                formDat.append(key.toString(), 'logo');
                break;
              case 'signature':
                formDat.append("media", this.genk.signatureImgFile, this.passportName);
                this.school.photoType = this.school.photoType + 'signature';
                formDat.append(key.toString(), 'signature');
                break;
              default:
                formDat.append(key.toString(), this.school[key]);
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
    this.sch.updateSchool(formDat)
  .pipe(takeUntil(this.destroy))
  .subscribe(res => {
      Swal.close();
      this.loading = false;
  });
    
  }
}).then(x => {
  // f.reset();
  // this.school = new schoolModel();
  // this.genk.imag = '';
  Swal.fire({
    icon: 'success',
    title: 'School data updated successfully!.',
    showConfirmButton: false,
    timer: 2000
  });
})
}


  updateAdminEmail() {
    let pass = this.currentAdminPassword;
    Swal.fire({
      title: 'Processing Data...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
        Swal.showLoading();
        this.sch.updateAdminEmail(this.adminEmail, this.currentAdminPassword)
      .pipe(takeUntil(this.destroy))
      .subscribe(res => {
          Swal.close();
          this.emailChanged = res.value;
      });
        
      }
    }).then(x => {
      // f.reset();
      // this.school = new schoolModel();
      // this.genk.imag = '';
      if (this.emailChanged == true) {
        Swal.fire({
          icon: 'success',
          title: 'Admin Email updated successfully!.',
          showConfirmButton: false,
          timer: 2000
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Password is incorrect.',
          showConfirmButton: false,
          timer: 2000
        });
      }
      this.getAdminUser();
      
    })
  }

  updatePassword() {
    if (this.newAdminPassword != this.newTestAdminPassword) {
      Swal.fire({
        icon: 'error',
        title: 'New password and Confirm New password not the same',
        showConfirmButton: false,
        timer: 2000
      });
      return
    }
    Swal.fire({
      title: 'Processing Data...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
        Swal.showLoading();
        this.sch.updateAdminPassword(this.adminPassword, this.newAdminPassword)
      .pipe(takeUntil(this.destroy))
      .subscribe(res => {
          Swal.close();
          this.emailChanged = res.value;
      });
        
      }
    }).then(x => {
      // f.reset();
      // this.school = new schoolModel();
      // this.genk.imag = '';
      if (this.emailChanged == true) {
        Swal.fire({
          icon: 'success',
          title: 'Admin Password updated successfully!.',
          showConfirmButton: false,
          timer: 2000
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Password is incorrect.',
          showConfirmButton: false,
          timer: 2000
        });
      }
      this.getAdminUser();
      
    })
  }


  
  logout() {
    this.auth.logout();
    this.router.navigate(['/', this.genk.account]);
  }
}

