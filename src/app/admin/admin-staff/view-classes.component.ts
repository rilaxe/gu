import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { Staff } from '../../_models/school.model';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { SchoolService } from '../../services/school.service';

@Component({
  selector: 'app-admin-register',
  templateUrl: './view-classes.component.html',
  styleUrls: ['../../admin/admin-students/admin-students.component.css', '../../stage.css', '../settings/settings.component.css']
})
export class ViewClassesComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  destroy = new Subject;
  classlevels = [];
  staffs = [];
  schoolClassNames = [];
  classLevel: string;
  classLevelId: number;
  className: string;
  loading = false;
  formTeacher: string;
  formTeacherId: string;
  isEdit = false;
  classId: number;


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
  this.genk.topdata = 'Classes';
  this.getClassNames();
  this.getClassLevel();
  this.getStaffs();
}

getClassLevel() {
  this.sch.getSchoolLevel()
  .subscribe(res => {
    this.classlevels = res;
  })
}

getStaffs() {
  this.sch.getStaffList()
  .subscribe(res => {
    this.staffs = res;
  })
}


getClassNames() {
  this.sch.getSchoolClasses()
  .subscribe(res => {
    this.schoolClassNames = res;
  })
}

editClass(id: number) {
  this.classId = id;
  this.isEdit = true;
  let classObj = this.schoolClassNames.filter(t => t.id == id)[0];
  this.classLevel = classObj.classLevel;
  this.formTeacherId = classObj.formTeacherId;
  this.className = classObj.class;
}

addClass() {
  this.isEdit = false;
}

saveClassName() {
  debugger;
  if (!this.isEdit) {
    this.classLevel = this.classlevels.filter(t => t.id == this.classLevelId)[0].name;
  }
  
  //debugger;
  //let formTeacherObj = this.staffs.filter(t => t.id == this.formTeacherId)[0];
  //this.formTeacher = ((formTeacherObj.surname ?? '') + ' ' + (formTeacherObj.otherNames ?? '')).trim();
  this.loading = true;
  const obj = {id: this.classId, schoolId: this.auth.currentUserValue.schoolId, classLevel: this.classLevel, classLevelId: this.classLevelId, className: this.className, 
    formTeacherId:  this.formTeacherId, formTeacher: this.formTeacher};
    
Swal.fire({
  title: 'Processing Data...',
  allowEscapeKey: false,
  allowOutsideClick: false,
  //timer: 2000,
  didOpen: () => {
    Swal.showLoading();
    if (!this.isEdit) {
      this.sch.saveClassName(obj)
        .pipe(takeUntil(this.destroy))
        .subscribe(res => {
          this.getClassNames();
          Swal.close();
          this.loading = false;
        });
    } else {
      this.sch.updateClassName(obj)
        .pipe(takeUntil(this.destroy))
        .subscribe(res => {
          this.getClassNames();
          Swal.close();
          this.loading = false;
        });
    }
  }
}).then(x => {
  Swal.fire({
    icon: 'success',
    title: this.isEdit ? 'Class updated successfully!.' : 'Class registered successfully!.',
    showConfirmButton: false,
    timer: 2000
  });
})
}

togme(me: HTMLAnchorElement) {
  if (me.style.display == 'contents') {
    me.style.display = 'none';

  } else {
    me.style.display = 'contents';
  }
}

deleteClass(id: number) {
  this.sch.deleteClassName(id.toString())
  .subscribe(res => {
    this.getClassNames();
    Swal.fire({
      icon: 'success',
      title: 'Class-Level deleted successfully!.',
      showConfirmButton: false,
      timer: 2000
    });
  });
}
}
