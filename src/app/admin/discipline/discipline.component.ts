import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs';

@Component({
  templateUrl: './discipline.component.html',
  styleUrls: []
})
export class DisciplineComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  countdata: any;
  schoolClasses = [];
  students = [];
  disciplines = [];
  currentClassId: number;
  currentStudentId: number;
  infraction: string;
  infractionDate: string;
  punishment: string;
  punishmentDuration: string;
  destroy = new Subject;

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
  this.genk.topdata = 'Discipline';
  this.getDiscipline();
  this.getClassNames();
  this.getStudentsByClass();
}

setImg(imgpath) {
    if (imgpath && imgpath.length > 0) {
      return this.genk.imgurl + imgpath;
    } else {
      return this.genk.defaultImg;
    }
  }

  getPopulationData() {
    this.sch.getPopulationData()
      .subscribe(res => {
        this.countdata = res[0];
      })
  }

  
  logout() {
    this.auth.logout();
    this.router.navigate(['/', this.genk.account]);
  }

  getClassNames() {
    this.sch.getClassNames()
    .subscribe(res => {
      this.schoolClasses = res;
      this.getStudentsByClass();
    });
  }

  getStudentsByClass() {
    this.sch.getStudentByClass(this.currentClassId.toString())
    .subscribe(res => {
      this.students = res;
    });
  }

  getDiscipline() {
    this.sch.getDiscipline()
    .subscribe(res => {
      this.disciplines = res;
    });
  }

  setClass(id: number) {
    this.currentClassId = id;
    this.getStudentsByClass();
  }

  createDiscipline() {
    const mydata = {studentId: this.currentStudentId, infraction: this.infraction, dateOfInfraction: this.infractionDate, 
        action: this.punishment, duration: this.punishmentDuration};
    Swal.fire({
        title: 'Processing Data...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        //timer: 2000,
        didOpen: () => {
          Swal.showLoading();
      this.sch.createDiscipline(mydata)
        .pipe(takeUntil(this.destroy))
        .subscribe(res => {
            this.getDiscipline();
            Swal.close();
        });}
      }).then(x => {
        //this.getStudentsPsycomotor();
        Swal.fire({
          icon: 'success',
          title: 'Disciplined Student added successfully!.',
          showConfirmButton: false,
          timer: 2000
        });
      })
  }

  deleteDiscipline(id: number) {
    Swal.fire({
      title: "Do you want to delete this discipline data?",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.sch.deleteDiscipline(id.toString())
          .subscribe(res => {
            this.getDiscipline();
            Swal.fire("Data deleted", "", "success");
        });
      }
    });
    
  }
}
