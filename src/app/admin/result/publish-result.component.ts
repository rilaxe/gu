import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-dashboard',
  templateUrl: './publish-result.component.html',
  styleUrls: []
})
export class PublishResultComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  schoolClassLevel = [];
  currentLevelId: number;
  currentLevel: string;
  sessionlist = [];
  currentSessionObj: any;
  currentSession: string;
  currentSessionId: string;
  currentTerm: string;
  destroy = new Subject;
  publishedResult = [];

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
  this.genk.topdata = 'Publish Result';
  this.getPublishedResult();
  this.getClassLevels();
  this.getSession();
  this.getCurrentSession();
}


getClassLevels() {
    this.sch.getClassLevels()
    .subscribe(res => {
      this.schoolClassLevel = res;
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

  getPublishedResult() {
    this.sch.getPublishedResult()
    .subscribe(res => {
      this.publishedResult = res;
    });
  }

  createPublishByLevel() {
    debugger;
    this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
    let fee = this.schoolClassLevel.filter(t => t.id == this.currentLevelId)[0];
    this.currentLevel = this.schoolClassLevel.filter(t => t.id == this.currentLevelId)[0].name;
    Swal.fire({
        title: 'Processing Data...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        //timer: 2000,
        didOpen: () => {
          Swal.showLoading();
      this.sch.createPublishByLevel(this.currentLevelId.toString(), this.currentLevel, this.currentSessionId.toString(), this.currentSession, this.currentTerm)
        .pipe(takeUntil(this.destroy))
        .subscribe(res => {
            this.getPublishedResult();
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

  deletePublishByLevel(id: number) {
    Swal.fire({
      title: "Do you want to unpublish this result?",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.sch.deletePublishByLevel(id.toString())
          .subscribe(res => {
            this.getPublishedResult();
            Swal.fire("Data deleted", "", "success");
        });
      }
    });
    
  }

}
