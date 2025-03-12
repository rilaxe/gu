import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';


@Component({
  templateUrl: './view-midterm-result.component.html',
  styleUrls: ['result.component.css']
})
export class ViewMidtermResultComponent implements OnInit {
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

  constructor( 
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private sch: SchoolService,
    private gen: GenericService
    ) {
      this.genk = gen;
      this.userName = auth.currentUserValue.name;
      this.schoolId = auth.currentUserValue.schoolId;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = auth.currentUserValue.status;
}

ngOnInit(): void {
  this.genk.topdata = 'View Midterm Result';
  this.getClassNames();
  this.getSession();
  this.getCurrentSession();
}

// get getresultUrl() {
//   return this.schoolId == 52 ? 'midterm-result' : 'midterm-result';
// } 

get getresultUrl() {
  return this.genk.resultTemplate.filter(t => t.id == this.schoolId)[0].midterm;
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
      this.sch.getMidtermResultsAverageBySession(this.currentClass, this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        this.resultlist = res;
        this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
        this.currentClassName = this.schoolClasses.filter(d => d.id == Number(this.currentClass))[0].class;
      })
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
