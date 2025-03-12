import { Component, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';

@Component({
  templateUrl: './result-upload-statistics.component.html',
  styleUrls: []
})
export class ResultUploadStatisticsComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  countdata: any;
  genderStat: any;
  subjectStat: any[];
  classStat: any[];


  constructor( 
    private router: Router,
    private auth: AuthenticationService,
    private sch: SchoolService,
    private gen: GenericService
    ) {
      this.genk = gen;
      this.userName = auth.currentUserValue.name;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = auth.currentUserValue.status;
}

ngOnInit(): void {
  this.genk.topdata = 'Result Upload Info';
  this.getResultEntryAnalysisByStaff();
}

get setImg() {
    if (this.userImgPath && this.userImgPath.length > 0) {
      return this.genk.imgurl + this.userImgPath;
    } else {
      return this.genk.defaultImg;
    }
  }

  getResultEntryAnalysisByStaff() {
    this.sch.getResultEntryAnalysisByStaff()
    .subscribe(res => {
      this.subjectStat = res;
    });
  }

  getResultEntryAnalysis() {
    this.sch.getResultEntryAnalysis()
    .subscribe(res => {
      this.classStat = res;
    });
  }

 

}
