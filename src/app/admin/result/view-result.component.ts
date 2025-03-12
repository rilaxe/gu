import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, GenericService, NotreDameResultService, ResultMultipleService, StudentResultService, UserData } from '../../services';
import { SchoolService } from '../../services/school.service';
import { ResultService } from '../../services/result.service';
import { TrailblazersResultService } from '../../services/trailblazers_result.service';
import { LouisvilleResultService } from '../../services/louisville-result.service';


@Component({
  templateUrl: './view-result.component.html',
  styleUrls: ['result.component.css']
})
export class ViewResultComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  schoolClasses = [];
  currentClass: string;
  currentClassName: string;
  sessionlist = [];
  currentSessionObj: any;
  currentSession: string;
  currentSessionId: string;
  currentTerm: string;
  resultlist = [];
  schoolId: number;
  classAverage: string;
  averageObj: any;
  student_result: StudentResultService;
  result_multiple: ResultMultipleService;
  notre_dame_result: NotreDameResultService;
  louisville_result: LouisvilleResultService;
  trailblazers_Result: TrailblazersResultService

  constructor( 
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private sch: SchoolService,
    private gen: GenericService,
    private userdata: UserData,
    private resultService: ResultService,
    private studentResult: StudentResultService,
    private resultMultiple: ResultMultipleService,
    private notreDameResult: NotreDameResultService,
    private louisvilleResult: LouisvilleResultService,
    private trailblazersResult: TrailblazersResultService
    ) {
      this.genk = gen;
      this.userName = auth.currentUserValue.name;
      this.schoolId = auth.currentUserValue.schoolId;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = auth.currentUserValue.status;
      this.student_result = studentResult;
      this.result_multiple = resultMultiple;
      this.notre_dame_result = notreDameResult;
      this.louisville_result = louisvilleResult;
      this.trailblazers_Result = trailblazersResult;
}

ngOnInit(): void {
  this.genk.topdata = 'View Result';
  this.getClassNames();
  this.getSession();
  this.getCurrentSession();
}

get getresultUrl() {
  return this.genk.resultTemplate.filter(t => t.id == this.schoolId).length > 0 ? this.genk.resultTemplate.filter(t => t.id == this.schoolId)[0].result : this.genk.resultTemplate[0].result;
  // this.schoolId == 52 ? 'louisville-result' : 'student-result';
} 

get getannualResultUrl() {
  return this.genk.resultTemplate.filter(t => t.id == this.schoolId).length > 0 ? this.genk.resultTemplate.filter(t => t.id == this.schoolId)[0].annual : this.genk.resultTemplate[0].annual;
} 

get getresultMultipleUrl(): string{
  return this.genk.resultTemplate.filter(t => t.id == this.schoolId).length > 0 ? this.genk.resultTemplate.filter(t => t.id == this.schoolId)[0].multiple : this.genk.resultTemplate[0].multiple;
  // this.schoolId == 52 ? 'louisville-result' : 'student-result';
} 

get getAnnualResultMultipleUrl(): string {
  return this.genk.resultTemplate.filter(t => t.id == this.schoolId).length > 0 ? this.genk.resultTemplate.filter(t => t.id == this.schoolId)[0].annualmultiple : this.genk.resultTemplate[0].annualmultiple;
  // this.schoolId == 52 ? 'louisville-result' : 'student-result';
} 

getClassNames() {
    this.sch.getClassNames()
    .subscribe(res => {
      this.schoolClasses = res;
    });
  }
  
  getSession() {
    this.sch.getSession()
      .subscribe(res => {
        this.sessionlist = res;
      })
  }
  
  getCurrentSession() {
    this.sch.getCurrentSession()
      .subscribe(res => {
        this.currentSessionObj = res;
        this.currentSessionId = this.currentSessionObj.sessionId;
        if (this.currentSessionObj.currentTerm) {
          this.currentTerm = this.currentSessionObj.currentTerm;
        }
        
      })
  }

  getResults() {
    this.sch.getSession()
      .subscribe(res => {
        this.sessionlist = res;
      })
  }

  // getResultsAverageByClass() {
  //   if ( this.currentTerm == 'ANNUAL') {
  //     this.sch.getAnnualResultsAverageByClass(this.currentClass, this.currentSessionId.toString())
  //     .subscribe(res => {
  //       this.resultlist = res;
  //       this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
  //       this.currentClassName = this.schoolClasses.filter(d => d.id == Number(this.currentClass))[0].class;
  //     })
  //   } else {
  //     this.sch.getResultsAverageByClass(this.currentClass, this.currentSessionId.toString(), this.currentTerm)
  //     .subscribe(res => {
  //       this.resultlist = res;
  //       this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
  //       this.currentClassName = this.schoolClasses.filter(d => d.id == Number(this.currentClass))[0].class;
  //     })
  //   }
  // }

  getResultsAverageBySession() {
    this.userdata.loadingOnly();
    if ( this.currentTerm == 'ANNUAL') {
      this.sch.getResultsAverageBySessionAnnual(this.currentClass, this.currentSessionId.toString())
      .subscribe(res => {
        this.resultlist = res;
        let averageList = this.resultlist.map(item => item.averageRaw);
        let kool = averageList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        this.classAverage = (kool / this.resultlist.length).toFixed(1);

        this.averageObj = this.resultlist.map(item => ({
          averageRaw: item.averageRaw,
          average: item.average,
          studentId: item.studentId
        }));
        this.averageObj = JSON.stringify(this.averageObj);
        //this.resultService.studentClassAverage = this.classAverage;
        
        console.log(this.classAverage);
        this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
        this.currentClassName = this.schoolClasses.filter(d => d.id == Number(this.currentClass))[0].class;
        this.userdata.togLoadingOnly();
      })
    } else {
      this.sch.getResultsAverageBySession(this.currentClass, this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        this.resultlist = res;
        let averageList = this.resultlist.map(item => item.averageRaw);
        let kool = averageList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        this.classAverage = (kool / this.resultlist.length).toFixed(1);
        
        this.averageObj = this.resultlist.map(item => ({
          averageRaw: item.averageRaw,
          average: item.average,
          studentId: item.studentId
        }));
        this.averageObj = JSON.stringify(this.averageObj);
        //this.resultService.studentClassAverage = this.classAverage;

        this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
        this.currentClassName = this.schoolClasses.filter(d => d.id == Number(this.currentClass))[0].class;
        this.userdata.togLoadingOnly();
      })
    }
  }

  getposition(ave: number) {
    return this.resultlist.findIndex(t => t.average == ave);
  }

  formatPosition(value: number) {
    let position;
    let newValue;
    if (value == 11 || value == 12 || value == 13) {
      newValue = value;
    } else {
      newValue = Number(value.toString()[value.toString().length - 1]);
    }

    switch (newValue) {
      case 1:
        position = value + "st";
        break;
      case 2:
        position = value + "nd";
        break;
      case 3:
        position = value + "rd";
        break;
      default:
        position = value + 'th';
        break;
    }
    return position;
  }

  // switchCat(value: string) {
  //   this.genk.isResultSession = value == 'session'? true : false;
  //   if (this.genk.isResultSession) {
  //     this.getResultsAverageBySession();
  //   }
  //   else {
  //       this.getResultsAverageByClass();
  //   } 
  //   // this.resultlist = value == 'session'? this.passedResult : this.failedResult;
  //   // this.isPassed = value == 'session'? true : false;
  // }

}
