import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';


@Component({
  templateUrl: './special-comment.component.html',
  styleUrls: ['comment.component.css']
})
export class SpecialCommentComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  schoolClasses = [];
  currentClass: string;
  sessionlist = [];
  currentSessionObj: any;
  currentSession: string;
  currentSessionId: string;
  currentTerm: string;
  resultlist = [];
  principalresultlist = [];
  hostelresultlist = [];
  commentlist = [];
  principlecommentlist = [];
  hostelcommentlist = [];
  studentresultlist = [];
  destroy = new Subject;
  myStudentName: string;
  myStudentPhoto: string;
  myStudentId: number;
  principleComment: string;
  gradeScaleList = [];
  examType: string;

  constructor( 
    private router: Router,
    private route: ActivatedRoute,
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
  this.genk.topdata = 'Special Comment Entry';
  this.activeRoute.queryParams.subscribe(
    params => {
      this.examType = params['examType'];
      this.genk.topdata = 'view ' + this.examType.toLowerCase() + ' comment';
    }
  )
  this.getClassNames();
  this.getSession();
  this.getCurrentSession();
}

getClassNames() {
  
    this.sch.getClassNames()
    .subscribe(res => {
      debugger
      this.schoolClasses = res;
      
    });
  }
  
  getSession() {
    this.sch.getSession()
      .subscribe(res => {
        this.sessionlist = res;
      })
  }

  setImg(imgpath) {
    if (imgpath && imgpath.length > 0) {
      return this.genk.imgurl + imgpath;
    } else {
      return this.genk.defaultImg;
    }
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

  getResultsAverageByClass() {
    if (this.currentTerm == 'ANNUAL') {
      this.sch.getAnnualResultsAverageByClassComment(this.currentClass, this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        this.resultlist = res;
        this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
      })
    } else {
      this.sch.getResultsAverageByClassComment(this.currentClass, this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        this.resultlist = res;
        this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
      })
    }
    
  }

  getResultsAverageHostelPortal() {
    if (this.currentTerm == 'ANNUAL') {
      this.sch.getAnnualResultsAverageHostelSupervisorComment(this.currentClass, this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        this.hostelresultlist = res;
        this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
      })
    } else {
      this.sch.getResultsAverageHostelSupervisorComment(this.currentClass, this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        this.hostelresultlist = res;
        this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
      })
    }
    
  }

  getResultsAverageByClassPrincipalComment() {
    if (this.currentTerm == 'ANNUAL') {
      this.sch.getAnnualResultsAverageByClassComment(this.currentClass, this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        this.principalresultlist = res;
        this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
      })
    } else {
      this.sch.getResultsAverageByClassPrincipalComment(this.currentClass, this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        this.principalresultlist = res;
        this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
      })
    }
  
    let currentLevel = this.schoolClasses.filter(t => t.id == this.currentClass)[0];
          let currentLevelId = currentLevel.classLevelId;
          debugger
          this.sch.getGradeScaleByCategory(currentLevelId)
            .subscribe(res => {
              this.gradeScaleList = res;
            });
  }

  editComment(studentId: number, value: string) {
    if (this.commentlist.length > 0) {
        if (this.commentlist.filter(t => t.studentId == Number(studentId)).length > 0) {
            this.commentlist[this.commentlist.findIndex(t => t.studentId == Number(studentId))].comment = value;
        } else {
            let res = {studentId: studentId, comment: value};
            this.commentlist.push(res);
        }
    } else {
        let res = {studentId: studentId, comment: value};
        this.commentlist.push(res);
    }
  }

  editPrincipleComment(studentId: number, value: string) {
    if (this.principlecommentlist.length > 0) {
        if (this.principlecommentlist.filter(t => t.studentId == Number(studentId)).length > 0) {
            this.principlecommentlist[this.principlecommentlist.findIndex(t => t.studentId == Number(studentId))].comment = value;
        } else {
            let res = {studentId: studentId, comment: value};
            this.principlecommentlist.push(res);
        }
    } else {
        let res = {studentId: studentId, comment: value};
        this.principlecommentlist.push(res);
    }
  }

  editHostelComment(studentId: number, value: string) {
    if (this.hostelcommentlist.length > 0) {
        if (this.hostelcommentlist.filter(t => t.studentId == Number(studentId)).length > 0) {
            this.hostelcommentlist[this.hostelcommentlist.findIndex(t => t.studentId == Number(studentId))].comment = value;
        } else {
            let res = {studentId: studentId, comment: value};
            this.hostelcommentlist.push(res);
        }
    } else {
        let res = {studentId: studentId, comment: value};
        this.hostelcommentlist.push(res);
    }
  }

  formatPosition(value: number) {
    let position; 
    switch (value) {
      case 1:
        position = "1st";
        break;
      case 2:
        position = "2nd";
        break;
      case 3:
        position = "3rd";
        break;
      default:
        position = value + 'th';
        break;
    }
    return position;
  }

  saveComments() {
    Swal.fire({
        title: 'Processing Data...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        //timer: 2000,
        didOpen: () => {
          Swal.showLoading();
      this.sch.saveFormTeacherComment(this.commentlist, this.currentClass, this.currentSessionId.toString(), this.currentTerm)
        .pipe(takeUntil(this.destroy))
        .subscribe(res => {
            Swal.close();
        });}
      }).then(x => {
        //this.getStudentsPsycomotor();
        Swal.fire({
          icon: 'success',
          title: 'Result Entry updated successfully!.',
          showConfirmButton: false,
          timer: 2000
        });
      })
  }

  getResultsByStudent(studentId: number, studentName: string, studentPhoto: string, comment: string) {
    this.myStudentId = studentId;
    this.myStudentName = studentName;
    this.myStudentPhoto = studentPhoto;
    this.principleComment = comment;
    if (this.currentTerm == 'ANNUAL') {
      this.sch.getAnnualResultsPagePrincipal(this.currentClass, this.currentSessionId.toString(), studentId.toString())
        .subscribe(res => {
          this.studentresultlist = res;
          for (let i = 0; i < this.studentresultlist.length; i++) {
            //const element = this.studentresultlist[i];
            var fol = this.gradeScaleList.filter(t => t.endLimit >= this.studentresultlist[i].totalScore)[0];
            this.studentresultlist[i].grade = fol.grade;
            this.studentresultlist[i].remark = fol.remarks;
          }

       

      })
    } else {
      this.sch.getResultsByStudent(this.currentClass, this.currentSessionId.toString(), this.currentTerm, studentId.toString())
      .subscribe(res => {
        debugger;
        this.studentresultlist = res;
      })
      
    }
  }

  savePrincipleComments() {
    Swal.fire({
        title: 'Processing Data...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        //timer: 2000,
        didOpen: () => {
          Swal.showLoading();
      this.sch.saveFormPrincipalComment(this.principlecommentlist, this.currentClass, this.currentSessionId.toString(), this.currentTerm)
        .pipe(takeUntil(this.destroy))
        .subscribe(res => {
            Swal.close();
        });}
      }).then(x => {
        //this.getStudentsPsycomotor();
        Swal.fire({
          icon: 'success',
          title: 'Result Entry updated successfully!.',
          showConfirmButton: false,
          timer: 2000
        });
      })
  }

  saveHostelComments() {
    Swal.fire({
        title: 'Processing Data...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        //timer: 2000,
        didOpen: () => {
          Swal.showLoading();
      this.sch.saveHostelSupervisorComment(this.hostelcommentlist, this.currentClass, this.currentSessionId.toString(), this.currentTerm)
        .pipe(takeUntil(this.destroy))
        .subscribe(res => {
            Swal.close();
        });}
      }).then(x => {
        //this.getStudentsPsycomotor();
        Swal.fire({
          icon: 'success',
          title: 'Result Entry updated successfully!.',
          showConfirmButton: false,
          timer: 2000
        });
      })
  }


 
}
