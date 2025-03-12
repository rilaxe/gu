import { Component, Inject, Input, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './bodymass.component.html'
})
export class BodyMassComponent {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  tabActive = 'Person';
  studentList = [];
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
  bigboss = [];

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
}

ngOnInit(): void {
    this.genk.topdata = 'Student Body Mass Index';
    //this.getAllStudents();
    this.getClassNames();
    this.getSession();
    this.getCurrentSession();
    
}

// getAllStudents() {
//     this.sch.getDeactivatedStudents()
//       .subscribe(res => {
//         this.studentList = res;
//       })
//   }

  setImg(imgpath) {
    if (imgpath && imgpath.length > 0) {
      return this.genk.imgurl + imgpath;
    } else {
      return this.genk.defaultImg;
    }
  }

  toggle(value: string) {
    this.tabActive = value;
  }

  getBMI() {
    
  }

  getBMIByClass() {
    this.sch.getBMIByClass(this.currentClass.toString(), this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        this.resultlist = res;
        this.bigboss = [];
      })
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
        //this.getBMIByClass();
      })
  }


  setBMI(studentId: number, ca: HTMLInputElement, key: string) {
    debugger;
    let newResult;
    let oldResult;
    if (this.bigboss.filter(t => t.studentId == Number(studentId)).length > 0) {
      newResult = this.bigboss.filter(t => t.studentId == Number(studentId))[0];
      oldResult = this.resultlist.filter(t => t.studentId == Number(studentId))[0];
      
      //ca.value = caValue.toString();
      newResult[key] = Number(ca.value);
      //let gradeobj = this.calGrade(newResult['totalScore']);
      // newResult['grade'] = gradeobj.grade;
      // newResult['remark'] = gradeobj.remark;
      // this.resultlist[this.resultlist.findIndex(t => t.studentId == Number(studentId))].totalScore = newResult['totalScore'];
      // this.resultlist[this.resultlist.findIndex(t => t.studentId == Number(studentId))].grade = newResult['grade'];
      // this.resultlist[this.resultlist.findIndex(t => t.studentId == Number(studentId))].remark = newResult['remark'];
      this.bigboss[this.bigboss.findIndex(t => t.studentId == Number(studentId))] = newResult;
    } else {
      newResult = new Object();
      oldResult = this.resultlist.filter(t => t.studentId == Number(studentId))[0];
      newResult.studentId = studentId;
      //let one = this.caScoreData[key.toUpperCase()];
      //let tu = this.resultlist[this.resultlist.findIndex(t => t.studentId == Number(studentId))];
      //let val = tu[key] ? tu[key] : 0;
      //let ti = this.clearInput(this.caScoreData[key.toUpperCase()], Number(ca.value), tu);
      // let caValue = this.clearInput(this.caScoreData[key.toUpperCase()], Number(ca.value), this.resultlist[this.resultlist.findIndex(t => t.studentId == Number(studentId))][key.toUpperCase()]);
      // ca.value = caValue.toString();
      newResult[key] = Number(ca.value);

      // let gradeobj = this.calGrade(newResult['totalScore']);
      // newResult['grade'] = gradeobj.grade;
      // newResult['remark'] = gradeobj.remark;
      // this.resultlist[this.resultlist.findIndex(t => t.studentId == Number(studentId))].totalScore = newResult['totalScore'];
      // this.resultlist[this.resultlist.findIndex(t => t.studentId == Number(studentId))].grade = newResult['grade'];
      // this.resultlist[this.resultlist.findIndex(t => t.studentId == Number(studentId))].remark = newResult['remark'];
      this.bigboss.push(newResult);
    }
    console.log(this.bigboss);
  }


  saveBMI() {
    // this.submitted = true;
    // if (this.resultForm.invalid) {
    //     this.cd.markForCheck();
    //     return;
    // }
    // if (this.resultlist.length < 1) {
    //   this.cd.markForCheck();
    //   return;
    // }

    //let className = this.schoolClasses.filter(t => t.id == this.currentClass)[0].class;
    Swal.fire({
      title: 'Saving Data...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
        Swal.showLoading();
    this.sch.saveBMIEntry(this.bigboss, this.currentSessionId.toString(), this.currentTerm, this.currentClass.toString())
      .subscribe(res => {
          Swal.close();
      });}
    }).then(x => {
      //this.getStudentsPsycomotor();
      Swal.fire({
        icon: 'success',
        title: 'BMI Entry updated successfully!.',
        showConfirmButton: false,
        timer: 2000
      });
    })
  }
}
