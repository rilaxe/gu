import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { SchoolService } from '../../services/school.service';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  templateUrl: './grade-scale.component.html',
  styleUrls: ['./settings.component.css']
})
export class GradeScaleComponent implements OnInit {
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
  gradeScaleId: number;
  scaleList = [];

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
}

ngOnInit(): void {
    this.getGradeScale();
    this.genk.topdata = 'Grade-Scale';
}

getGradeScale() {
    this.sch.getGradeScale()
    .subscribe(res => {
      
      this.subjectList = res;
      this.scaleList = this.subjectList.filter(t => t.classLevel == this.classlevel);
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
    debugger
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
            this.getGradeScale();
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


}
