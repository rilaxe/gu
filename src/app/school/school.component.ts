import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AuthenticationService, GenericService } from '../services';
import { SchoolService } from '../services/school.service';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['school.component.css'],
})
export class SchoolComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  schoolId: string;
  schoolObj: any;
  tabActive = 'Person';

  constructor( 
    private router: Router,
    private activeRoute: ActivatedRoute,
    private school: SchoolService,
    private auth: AuthenticationService,
    private gen: GenericService
    ) {
      this.genk = gen;
      // this.userName = auth.currentUserValue.name;
      // this.userImgPath = auth.currentUserValue.imgPath;
      // this.adminStatus = auth.currentUserValue.status;
}

ngOnInit(): void {
  this.schoolId = this.activeRoute.snapshot.params['id'];
  this.getSchool();
}

get setImg() {
    if (this.userImgPath && this.userImgPath.length > 0) {
      return this.genk.imgurl + this.userImgPath;
    } else {
      return this.genk.defaultImg;
    }
  }

  getSchool() {
    this.school.getSchoolById(this.schoolId).subscribe(res => {
      this.schoolObj = res;
    })
  }

  toggle(value: string) {
    this.tabActive = value;
  }

  toggleStaff(value: string) {
    this.tabActive = value;
    this.genk.isAdminLogin = true;
  }

  toggleUser(value: string) {
    debugger;
    this.tabActive = value;
    this.genk.isLogin = true;
  }

  
  logout() {
    this.auth.logout();
    this.router.navigate(['/', this.genk.account]);
  }
}
