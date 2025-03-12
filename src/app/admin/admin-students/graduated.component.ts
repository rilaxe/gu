import { Component, Inject, Input, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService, UserData } from '../../services';
import { SchoolService } from '../../services/school.service';

@Component({
  templateUrl: './graduated.component.html'
})
export class GraduatedComponent {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  tabActive = 'Person';
  studentList = [];

  constructor( 
    private router: Router,
    private sch: SchoolService,
    private auth: AuthenticationService,
    private userdata: UserData,
    private gen: GenericService
    ) {
      this.genk = gen;
      this.userName = auth.currentUserValue.name;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = auth.currentUserValue.status;
}

ngOnInit(): void {
    this.genk.topdata = 'Graduate List 👨🏾‍🎓';
    this.getAllStudents();
  }

  getAllStudents() {
    this.userdata.loadingOnly();
    this.sch.getAllGraduatedStudents()
      .subscribe(res => {
        this.studentList = res;
        this.userdata.togLoadingOnly();
      })
  }

  setImg(imgpath) {
    if (imgpath && imgpath.length > 0) {
      return this.genk.imgurl + imgpath;
    } else {
      return this.genk.defaultImg;
    }
  }

  toggle(value: string) {
    this.tabActive = value;
  }

  plusyear(value: string) {
    if (value.length == 2) {
      return '20' + value;
    }  else {
      return value;
    }
  }

  
  logout() {
    this.auth.logout();
    this.router.navigate(['/', this.genk.account]);
  }
}
