import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs';
import { AuthenticationService, GenericService } from '../services';
import { Staff } from '../_models/school.model';
import { ObjectService } from '../services/object.service';
import { SchoolService } from '../services/school.service';


@Component({
  templateUrl: './staff-profile.component.html',
  styleUrls: []
})
export class StaffProfileComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  studentobj: any;
  studentId: string;
  staff = new Staff();
  destroy = new Subject;
  passportName: string;
  objService: ObjectService;
  lgs = [];
  states = [];
  subjectList = [];
  staffSubjectList = [];
  schoolClasses = [];
  classid: number;
  subjectId: number;

  constructor( 
    private router: Router,
    private sch: SchoolService,
    private auth: AuthenticationService,
    private activeRoute: ActivatedRoute,
    private obj: ObjectService,
    private gen: GenericService
    ) {
      this.genk = gen;
      this.objService = obj;
      this.userName = auth.currentUserValue.name;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = auth.currentUserValue.status;
}

ngOnInit(): void {
  this.genk.topdata = 'Staff';
  this.studentId = this.auth.currentUserValue.id.toString();
  this.states = Object.keys(this.objService.lga);
  this.getStaff();
  this.getSubjects();
  this.getClassNames();
  this.getStaffSubjects();
}

setImg(imgpath) {
    if (imgpath && imgpath.length > 0) {
      return this.genk.imgurl + imgpath;
    } else {
      return this.genk.defaultImg;
    }
}

setLGA(state: string) {
  this.lgs = this.objService.lga[state];
  this.staff.state = state;
}

selectLG(lg: string) {
  this.staff.lga = lg;
}


getStaff() {
    this.sch.getStaffById(this.studentId.toString())
      .subscribe(res => {
        this.studentobj = res;
        this.staff = res;
        if (this.staff.otherNames)
        this.staff.firstName  = this.staff.otherNames.split(' ')[0];
        this.staff.middleName  = this.staff.otherNames.split(' ')[1];
      })
  }

  updateStaff() {
    this.staff.schoolId = this.auth.currentUserValue.schoolId;
    this.staff.passport = this.genk.studentImgFile;
    // if (this.s.classId) {
    //   this.student.Class = this.schoolClasses.filter(t => t.id == this.student.classId)[0].class;
    // }

    const formDat: FormData = new FormData();

    for (const key in this.staff) {
      if (this.staff[key]) {
        switch (key.toString()) {
          case 'passport':
            formDat.append("media", this.genk.studentImgFile, this.passportName);
            break;
          default:
            formDat.append(key.toString(), this.staff[key]);
            break;
        }
      }
    }
    // this.auth.savePersonalInfo(this.student).subscribe();
    let timerInterval;
    Swal.fire({
      title: 'Processing Data...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
        Swal.showLoading();
        this.sch.updateStaff(formDat)
          .pipe(takeUntil(this.destroy))
          .subscribe(res => {
            this.getStaff();
            Swal.close();
          });

      }
    }).then(x => {
      Swal.fire({
        icon: 'success',
        title: 'Staff Information updated!.',
        showConfirmButton: false,
        timer: 2000
      });
    })
  }

  getSubjects() {
    this.sch.getSubjects()
    .subscribe(res => {
      this.subjectList = res;
    });
  }

  getClassNames() {
    this.sch.getClassNames()
    .subscribe(res => {
      this.schoolClasses = res;
    });
  }

  createStaffSubject(subjectId: number, classId: number) {
    let mysubject = this.subjectList.filter(t => t.id == subjectId)[0].subjects;
    let myclass = this.schoolClasses.filter(t => t.id == classId)[0].class;
    let mydata = {classId: classId, Class: myclass, subjectId: subjectId, subjects: mysubject, staffId: Number(this.studentId)};
    Swal.fire({
      title: 'Processing Data...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
        Swal.showLoading();
        this.sch.createStaffSubject(mydata)
          .pipe(takeUntil(this.destroy))
          .subscribe(res => {
            this.getStaffSubjects();
            Swal.close();
          });
      }
    }).then(x => {
      Swal.fire({
        icon: 'success',
        title: 'Staff Information updated!.',
        showConfirmButton: false,
        timer: 2000
      });
    })
  }

  getStaffSubjects() {
    this.sch.getStaffSubjects(this.studentId)
    .subscribe(res => {
      this.staffSubjectList = res;
    });
  }

  deleteStaffSubjects(id: number) {
    Swal.fire({
      title: "Do you want to delete this data?",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.sch.deleteStaffSubjects(id.toString())
          .subscribe(res => {
            this.staffSubjectList = res;
            this.getStaffSubjects();
            Swal.fire("Data deleted", "", "success");
        });
      }
    });
    
  }

  deactivateAccount(id: number) {
    Swal.fire({
      title: "Do you really want to deactivated this staff?",
      text: "You won't be able to assign subjects to this staff",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Deactivate"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.sch.deactivateStaff(id.toString())
            .subscribe(res => {
              Swal.fire({
                icon: 'success',
                title: 'Staff deactivated successfully!.',
                showConfirmButton: false,
                timer: 2000
              });
        })
      }
    });
  }


  activateAccount(id: number) {
    Swal.fire({
      title: "Do you really want to activated this staff?",
      text: "Subjects can assigned to this staff",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Activate"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.sch.activateStaff(id.toString())
            .subscribe(res => {
              Swal.fire({
                icon: 'success',
                title: 'Staff deactivated successfully!.',
                showConfirmButton: false,
                timer: 2000
              });
        })
      }
    });
  }
}
