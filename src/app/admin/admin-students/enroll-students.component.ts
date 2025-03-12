import { Component, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';

@Component({
  templateUrl: './enroll-students.component.html',
  styleUrls: []
})
export class EnrollStudentsComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  countdata: any;
  genderStat: any;
  currentClassLevelId: number;
  subjectId: number;
  schoolLevels = [];
  students = [];
  outStudent = [];


  constructor( 
    private router: Router,
    private auth: AuthenticationService,
    private activeRoute: ActivatedRoute,
    private sch: SchoolService,
    private gen: GenericService
    ) {
      this.genk = gen;
      this.userName = auth.currentUserValue.name;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = auth.currentUserValue.status;
}

ngOnInit(): void {
  this.genk.topdata = 'Enroll Students';
  this.subjectId = this.activeRoute.snapshot.params['id'];
  this.getLevels();
}

setImg(imgpath) {
  if (imgpath && imgpath.length > 0) {
    return this.genk.imgurl + imgpath;
  } else {
    return this.genk.defaultImg;
  }
}

  getPopulationData() {
    this.sch.getPopulationData()
      .subscribe(res => {
        
      })
  }

  getLevels() {
    this.sch.getClassLevels()
    .subscribe(res => {
      this.schoolLevels = res;
    });
  }

  getClassByLevel(classId: number) {
    this.currentClassLevelId = classId;
    this.sch.getStudentsByLevel(this.currentClassLevelId.toString())
    .subscribe(res => {
      this.students = res;
    });
  }

  setStudents(value: boolean, studentId: number) {
    debugger;
    if (value) {
      if (this.outStudent.filter(t => t == studentId).length < 1)
      this.outStudent.push(studentId);
    } else {
      this.outStudent = this.outStudent.filter(t => t != studentId);
    }
    console.log(this.outStudent);
  }

  enrollStudents() {
    this.sch.enrollStudents(this.outStudent, this.subjectId.toString())
    .subscribe(res => {
      this.students = res;
    });
  }
}
