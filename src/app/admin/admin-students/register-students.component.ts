import { Component, Inject, Input, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { studentDetails } from '../../_models/school.model';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-personalInfo',
  templateUrl: './register-students.component.html',
  styleUrls: ['./admin-students.component.css']
})
export class RegisterStudentComponent {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  tabActive = 'Person';
  student = new studentDetails();
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

//   savePersonalInfo() {
//     this.loading = true;
//     this.auth.savePersonalInfo(this.student).subscribe();
//   }

  
  logout() {
    this.auth.logout();
    this.router.navigate(['/', this.genk.account]);
  }

  showPreview(DeFile: any) {
    //debugger;
      this.imgFile = <File>DeFile.target.files[0];
      this.student.passport = this.imgFile;
      if (this.imgFile.size < 1 || this.imgFile.size > 1024 * 1024 * 10) {
          this.imgError = 'File size is too large. try 500kb or less';
          this.imgFile = null;
        return;
      }
      this.passportName = this.gen.getExpImg(this.imgFile.name, this.imgFile.type);
      this.student.passportUrl = this.passportName;
      //this.cd.markForCheck();
  }

  savePersonalInfo() {
        this.loading = true;
        this.student.schoolId = this.auth.currentUserValue.schoolId;
        const formDat: FormData = new FormData();
        
        for (const key in this.student) {
            if (this.student[key]) {
                switch (key.toString()) {
                    case 'passport':
                        formDat.append("media", this.imgFile, this.passportName);
                        break;
                    default:
                        formDat.append(key.toString(), this.student[key]);
                        break;
                }
            }
        }
        // this.auth.savePersonalInfo(this.student).subscribe();
        let timerInterval;
    Swal.fire({
      title: 'Processing Data...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
        Swal.showLoading();
        this.auth.savePersonalInfo(formDat)
      .pipe(takeUntil(this.destroy))
      .subscribe(res => {
          Swal.close();
          this.loading = false;
      });
        
      }
    }).then(x => {
      Swal.fire({
        icon: 'success',
        title: 'Personal Information Saved!.',
        showConfirmButton: false,
        timer: 2000
      });
    })
    }
}
