import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  templateUrl: './process-midterm.component.html',
  styleUrls: []
})
export class ProcessMidtermComponent implements OnInit {
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
  caSetupData: any;
  caScoreData: any;
  dispalyCaSetupData: any;
  isCheckAll = true;
  calist = [];
  category = [];




  subjectList = [];
  newSubject: string;
  subjectType: string;
  subjectId: string;
  loading = false;
 
  lowerlimt: string;
  upperlimit: string;
  grade: string;
  remarks: string;
  classlevel: string;
  gradeScaleId: number;
  scaleList = [];
  selectedCategory: string;

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
  this.genk.topdata = 'Process Midterm';
  this.getPublishedResult();
  this.getClassLevels();
  this.getSession();
  this.getCurrentSession();
  
  this.getSchoolCategory();
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

  getCaSetupByClass() {
    this.sch.testGetCaSetupByClass(this.selectedCategory)
    .subscribe(res => {
      this.caSetupData = res.systemname;
      this.dispalyCaSetupData = this.caSetupData;
      delete this.dispalyCaSetupData.Exam;
      this.caScoreData = res.score;

      for (let key in this.dispalyCaSetupData) {
        if (this.dispalyCaSetupData.hasOwnProperty(key)) {
          this.calist.push({type: key, name: this.dispalyCaSetupData[key], max: this.caScoreData[key]});
        }
      }
    });
  }

  setField(value: boolean, catype: string) {
    if (value) {
      this.calist.push({type: catype, name: this.dispalyCaSetupData[catype], max: this.caScoreData[catype]});
    } else {
      this.calist = this.calist.filter(t => t.type != catype);
    }
    console.log(this.calist);
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


  getGradeScale() {
    this.sch.getGradeScale()
    .subscribe(res => {
      this.subjectList = res;
      //this.scaleList = this.subjectList.filter(t => t.classLevel == 'JUNIOR');
      //this.seniorScaleList = this.subjectList.filter(t => t.classLevel == 'SENIOR');
    });
  }

  saveEdit(id: number) {
    let gradeObj = this.subjectList.filter(t => t.id == id)[0];
    this.lowerlimt = gradeObj.begLimit;
    this.upperlimit = gradeObj.endLimit;
    this.grade = gradeObj.grade;
    this.remarks = gradeObj.remarks;
    this.gradeScaleId = gradeObj.id;
  }

  changeGradeScale(value: string) {
    debugger;
    this.classlevel = value;
    this.scaleList = this.subjectList.filter(t => t.classLevel == value);
  }

  editGradeScale() {
    this.loading = true;
    const obj = {id: this.gradeScaleId, begLimit: this.lowerlimt, endLimit: this.upperlimit, grade: this.grade, remarks: this.remarks, classLevel: this.classlevel};

    Swal.fire({
      title: 'Saving Data...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
        Swal.showLoading();
        this.sch.updateGradeScale(obj)
          .pipe(takeUntil(this.destroy))
          .subscribe(res => {
            Swal.close();
            this.loading = false;
            this.getGradeScale();
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

  saveGradeScale() {
    this.loading = true;
    const obj = { begLimit: this.lowerlimt, endLimit: this.upperlimit, grade: this.grade, remarks: this.remarks, classLevel: this.classlevel};

    Swal.fire({
      title: 'Saving Data...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
        Swal.showLoading();
        this.sch.saveGradeScale(obj)
          .pipe(takeUntil(this.destroy))
          .subscribe(res => {
            Swal.close();
            this.loading = false;
            this.getGradeScale();
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

  deleteGradeScale(id: number) {
    this.sch.deleteGradeScale(id.toString())
    .subscribe(res => {
      this.getGradeScale();
      Swal.fire({
        icon: 'success',
        title: 'Grade Scale deleted successfully!.',
        showConfirmButton: false,
        timer: 2000
      });
    });
  }

  Submit() {
    this.loading = true;
    this.sch.saveMidtermSettings(this.calist, this.currentSessionId, this.currentTerm, this.selectedCategory)
        .pipe(takeUntil(this.destroy))
        .subscribe(res => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Midterm Results Published successfully!.',
            showConfirmButton: false,
            timer: 2000
          });
        });
  }

  getSchoolCategory() {
    this.sch.getSchoolCategory()
    .subscribe(res => {
      this.category = res;
      //this.scaleList = this.subjectList.filter(t => t.classLevel == 'JUNIOR');
      //this.seniorScaleList = this.subjectList.filter(t => t.classLevel == 'SENIOR');
    });
  }

  loadCA() {
    this.getCaSetupByClass();
  }


}
