import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  templateUrl: './core-subject.component.html',
  styleUrls: []
})
export class CoreSubjectComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  countdata: any;
  schoolClasses = [];
  schoolLevels = [];
  currentClassLevelId: number;
  bigboss = [];
  destroy = new Subject;
  mydata = [];
  classSubjects = [];
  coreSubjects = [];
  sendData = [];

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
  this.genk.topdata = 'Core Subject';
  this.getLevels();
  //this.getClassByLevel();
  this.getPopulationData();
}

cars = [ 
    { id: 1, name: "BMW Hyundai" }, 
    { id: 2, name: "Kia Tata" }, 
    { id: 3, name: "Volkswagen Ford" }, 
    { id: 4, name: "Renault Audi" }, 
    { id: 5, name: "Mercedes Benz Skoda" }, 
  ]; 
  
  selected = [{ id: 3, name: "Volkswagen Ford" }]; 
  
  getLevels() {
    this.sch.getClassLevels()
    .subscribe(res => {
      this.schoolLevels = res;
      //this.getClassByLevel();
    });
  }

  getClassByLevel(classId: number) {
    this.currentClassLevelId = classId;
    this.sch.getClassByLevel(this.currentClassLevelId.toString())
    .subscribe(res => {
      this.schoolClasses = res;
      this.mydata = [];
      this.getClassSubjects();
      this.getCoreSubjects();
      // this.schoolClasses.forEach(a => {
      //   let ger = this.coreSubjects.filter(t => t.id == a.id);
      //   if (ger.length > 0) {
      //     let fol = [];
      //     ger.forEach(u => {
      //       let se = {id: u.id, name: u.subjects};
      //       fol.push(se);
      //     });
      //     let me = {myclass: a.id, subjects: fol};
      //     this.mydata.push(me);
      //   } else {
      //     let me = {myclass: a.id, subjects: []};
      //     this.mydata.push(me);
      //   }
      //   console.log(this.mydata);
      // });
      
    });
  }

  getPopulationData() {
    this.sch.getPopulationData()
      .subscribe(res => {
        this.countdata = res[0];
      })
  }

  // getClasses() {
  //   debugger;
  //   let fr = 'we';
  //   let ge = 're';
  // }

  // setPlacement(classId: string, studentId: number, index: number) {
  //   this.bigboss.push({studentId: studentId, classId: classId});
  // }

  getClassSubjects() {
    this.sch.getSubjectByLevel(this.currentClassLevelId.toString())
    .subscribe(res => {
      this.classSubjects = res;
    });
  }

  getCoreSubjects() {
    this.sch.getCoreSubjects(this.currentClassLevelId.toString())
    .subscribe(res => {
      this.coreSubjects = res;
      this.schoolClasses.forEach(a => {
        let ger = this.coreSubjects.filter(t => t.classId == a.id);
        //debugger;
        if (ger.length > 0) {
          let fol = [];
          ger.forEach(u => {
            let se = {id: u.id, name: u.subjects};
            fol.push(se);
          });
          let me = {myclass: a.id, subjects: fol};
          this.mydata.push(me);
        } else {
          let me = {myclass: a.id, subjects: []};
          this.mydata.push(me);
        }
        console.log(this.mydata);
      });
    });
  }

  savePlacement() {
    let rea = this.mydata;
    this.mydata.forEach(cl => {
      let boss = [];
        cl.subjects.forEach(su => {
          
          let name = this.schoolClasses.filter(t => t.id == cl.myclass)[0].class;
          let levelName = this.schoolLevels.filter(t => t.id == this.currentClassLevelId)[0].name;
          boss.push({ClassId: cl.myclass, Class: name, ClassLevelId: this.currentClassLevelId, ClassLevel: levelName, Subjects: su.name, SubjectId: su.id, SchoolId: this.auth.currentUserValue.schoolId, MinimumScore: 0});
        });
        this.sendData.push({classId: cl.myclass, subjects: boss});
    })
    let bos = this.bigboss;
Swal.fire({
  title: 'Processing Data...',
  allowEscapeKey: false,
  allowOutsideClick: false,
  //timer: 2000,
  didOpen: () => {
    Swal.showLoading();
    this.sch.saveCoreSubject(this.sendData)
  .pipe(takeUntil(this.destroy))
  .subscribe(res => {
      Swal.close();
  });
    
  }
}).then(x => {
    //this.getStudents();
  Swal.fire({
    icon: 'success',
    title: 'Core Subjects updated successfully!.',
    showConfirmButton: false,
    timer: 2000
  });
})
}
  
}
