import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { AuthenticationService, GenericService } from '../services';
import { SchoolService } from '../services/school.service';


@Component({
  templateUrl: './hostel-comment.component.html',
  styleUrls: []
})
export class HostelCommentComponent implements OnInit {
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
  commentlist = [];
  principlecommentlist = [];
  studentresultlist = [];
  destroy = new Subject;
  myStudentName: string;
  myStudentPhoto: string;
  myStudentId: number;
  principleComment: string;
  schoolId: number;
  //formTeacherClasses = [];

  constructor( 
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private sch: SchoolService,
    private gen: GenericService
    ) {
      this.genk = gen;
      this.userName = auth.currentUserValue.name;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = auth.currentUserValue.status;
      this.schoolId = auth.currentUserValue?.schoolId;
}

ngOnInit(): void {
  this.genk.topdata = 'Hostel Supervisor Comment';
  //this.getFormTeacherClass();
  this.getClassNames();
  this.getSession();
  this.getCurrentSession();
}

// getFormTeacherClass() {
//   this.sch.getFormTeacherClass()
//     .subscribe(res => {
//       this.formTeacherClasses = res;
//     });
// }

get HouseCommentHeader() {
  return this.schoolId == 520 ? 'House Mother Comment' : 'Hostel Supervisor Comment';
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
    this.sch.getResultsAverageHostelSupervisorComment(this.currentClass, this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        this.resultlist = res;
        this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
      })
  }

//   getResultsAverageByClassPrincipalComment() {
//     this.sch.getResultsAverageByClassPrincipalComment(this.currentClass, this.currentSessionId.toString(), this.currentTerm)
//       .subscribe(res => {
//         this.principalresultlist = res;
//         this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
//       })
//   }

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
      this.sch.saveHostelSupervisorComment(this.commentlist, this.currentClass, this.currentSessionId.toString(), this.currentTerm)
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
    this.sch.getResultsByStudent(this.currentClass, this.currentSessionId.toString(), this.currentTerm, studentId.toString())
      .subscribe(res => {
        this.studentresultlist = res;
      })
  }

//   savePrincipleComments() {
//     Swal.fire({
//         title: 'Processing Data...',
//         allowEscapeKey: false,
//         allowOutsideClick: false,
//         //timer: 2000,
//         didOpen: () => {
//           Swal.showLoading();
//       this.sch.saveFormPrincipalComment(this.principlecommentlist, this.currentClass, this.currentSessionId.toString(), this.currentTerm)
//         .pipe(takeUntil(this.destroy))
//         .subscribe(res => {
//             Swal.close();
//         });}
//       }).then(x => {
//         //this.getStudentsPsycomotor();
//         Swal.fire({
//           icon: 'success',
//           title: 'Result Entry updated successfully!.',
//           showConfirmButton: false,
//           timer: 2000
//         });
//       })
//   }


 
}
