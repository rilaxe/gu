import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { SchoolService } from '../../services/school.service';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  templateUrl: './autocomment.component.html',
  styleUrls: ['./settings.component.css']
})
export class AutoCommentComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  subjectList = [];
  newSubject: string;
  subjectType: string;
  subjectId: string;
  loading = false;
  destroy = new Subject;
  lowerlimt: string;
  upperlimit: string;
  grade: string;
  remarks: string;
  classlevel: string;
  publishClassType: string;
  autoCommentId: number;
  scaleList = [];
  formTeacherComment: string;
  principalComment: string;
  hostelPortalComment: string;
  commentType: string;
  sessionlist = [];
  currentSessionObj: any;
  currentSession: string;
  currentSessionId: string;
  currentTerm: string;

  constructor( 
    private router: Router,
    private sch: SchoolService,
    private auth: AuthenticationService,
    private gen: GenericService
    ) {
      this.genk = gen;
      this.userName = auth.currentUserValue.name;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = auth.currentUserValue.status;
      this.classlevel = 'JUNIOR';
      this.publishClassType = 'JUNIOR';
      this.commentType = 'formTeacherComment';
}

ngOnInit(): void {
    this.getAutoComment();
    this.getSession();
    this.getCurrentSession();
    this.genk.topdata = 'Auto-Comment';
}

getAutoComment() {
    this.sch.getAutoComment()
    .subscribe(res => {
      
      this.subjectList = res;
      this.scaleList = this.subjectList.filter(t => t.classType == this.classlevel);
      //this.scaleList = this.subjectList.filter(t => t.classLevel == 'JUNIOR');
      //this.seniorScaleList = this.subjectList.filter(t => t.classLevel == 'SENIOR');
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

  saveEdit(id: number) {
    let gradeObj = this.subjectList.filter(t => t.id == id)[0];
    this.lowerlimt = gradeObj.begLimit;
    this.upperlimit = gradeObj.endLimit;
    this.formTeacherComment = gradeObj.formTeacherComment ? gradeObj.formTeacherComment : null;
    this.principalComment = gradeObj.principalComment ? gradeObj.principalComment : null;
    this.hostelPortalComment = gradeObj.hostelPortalComment ? gradeObj.hostelPortalComment : null;
    this.autoCommentId = gradeObj.id;
  }

  changeGradeScale(value: string) {
    debugger
    this.classlevel = value;
    this.scaleList = this.subjectList.filter(t => t.classType == value);
  }

  editGradeScale() {
    this.loading = true;
    const obj = {id: this.autoCommentId, begLimit: this.lowerlimt, endLimit: this.upperlimit, formTeacherComment: this.formTeacherComment, hostelPortalComment: this.hostelPortalComment, principalComment: this.principalComment, classType: this.classlevel};

    Swal.fire({
      title: 'Saving Data...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
        Swal.showLoading();
        this.sch.updateAutoComment(obj)
          .pipe(takeUntil(this.destroy))
          .subscribe(res => {
            Swal.close();
            this.loading = false;
            this.getAutoComment();
          });

      }
    }).then(x => {
      // f.reset();
      // this.school = new schoolModel();
      // this.genk.imag = '';
      Swal.fire({
        icon: 'success',
        title: 'Auto-Comment saved successfully!.',
        showConfirmButton: false,
        timer: 2000
      });
    })
  }

  createAutoComment() {
    this.loading = true;
    const obj = { begLimit: this.lowerlimt, endLimit: this.upperlimit, formTeacherComment: this.formTeacherComment, hostelPortalComment: this.hostelPortalComment, principalComment: this.principalComment, classType: this.classlevel};
    

    Swal.fire({
      title: 'Saving Data...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
        Swal.showLoading();
        this.sch.createAutoComment(obj)
          .pipe(takeUntil(this.destroy))
          .subscribe(res => {
            this.getAutoComment();
            Swal.close();
            this.loading = false;
           
          });

      }
    }).then(x => {
      // f.reset();
      // this.school = new schoolModel();
      // this.genk.imag = '';
      Swal.fire({
        icon: 'success',
        title: 'Grade Scale saved successfully!.',
        showConfirmButton: false,
        timer: 2000
      });
    })
  }

  confirmCommentDelete(id: number) {
    Swal.fire({
      title: "Do you want permanently delete this Comment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.deleteAutoComment(id);
      }
    });
  }

  deleteAutoComment(id: number) {
    this.sch.deleteAutoComment(id.toString())
    .subscribe(res => {
      this.getAutoComment();
      Swal.fire({
        icon: 'success',
        title: 'Auto-Comment deleted successfully!.',
        showConfirmButton: false,
        timer: 2000
      });
    });
  }

  confirmPublishAutoComment() {
    Swal.fire({
      title: "Do you want permanently Publish this Comments to students records?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Publish"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.publishAutoComment();
      }
    });
  }


  publishAutoComment() {
    this.loading = true;
    const obj = { begLimit: this.lowerlimt, endLimit: this.upperlimit, formTeacherComment: this.formTeacherComment, hostelPortalComment: this.hostelPortalComment, principalComment: this.principalComment, classType: this.classlevel};
    

    Swal.fire({
      title: 'Saving Data...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
        Swal.showLoading();
        this.sch.publishAutoComment(this.publishClassType, this.currentSessionId, this.currentTerm)
          .pipe(takeUntil(this.destroy))
          .subscribe(res => {
            this.getAutoComment();
            Swal.close();
            this.loading = false;
           
          });

      }
    }).then(x => {
      // f.reset();
      // this.school = new schoolModel();
      // this.genk.imag = '';
      Swal.fire({
        icon: 'success',
        title: 'Published successfully!.',
        showConfirmButton: false,
        timer: 2000
      });
    })
  }


}
