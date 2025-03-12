import { Component, Inject, Input, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../services';
import { SchoolService } from '../services/school.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './settings.component.html',
  styleUrls: ['../stage.css']
})
export class SettingsComponent {
  @Input() header: string;
  genk: GenericService;
  schoolName: string = '';
  schoolEmail: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  countdata: any;
  school: any;

  constructor( 
    private router: Router,
    private auth: AuthenticationService,
    private sch: SchoolService,
    private gen: GenericService
    ) {
      this.genk = gen;
      this.schoolName = auth.currentUserValue.schoolName;
      this.userImgPath = auth.currentUserValue.logo;

      this.adminStatus = auth.currentUserValue.status;
}

ngOnInit() {
  this.getPopulationData();
  this.getSchool();
  
}

get setImg() {
    if (this.userImgPath && this.userImgPath.length > 0) {
      return this.userImgPath;
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
  
  logout() {
    this.auth.logout();
    this.router.navigate(['/', this.genk.account]);
  }

  getSchool() {
    this.sch.getSchoolById(this.auth.currentUserValue.schoolId.toString()).subscribe(res => {
      this.school = res;
    })
  }
}
