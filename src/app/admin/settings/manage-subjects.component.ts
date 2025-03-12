import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import Swal from 'sweetalert2';
import { SchoolService } from '../../services/school.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './manage-subjects.component.html',
  styleUrls: ['./settings.component.css', '../../stage.css']
})
export class ManageSubjectsComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  subjectList = [];
  readlist = [];
  newSubject: string;
  subjectType: string;
  subjectId: string;
  loading = false;
  destroy = new Subject;
  category: string;

  constructor( 
    private router: Router,
    private auth: AuthenticationService,
    private gen: GenericService,
    private sch: SchoolService
    ) {
      this.genk = gen;
      this.userName = auth.currentUserValue.name;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = auth.currentUserValue.status;
}

ngOnInit(): void {
  this.getSubjects();
  this.genk.topdata = 'Manage Subject';
}

get setImg() {
    if (this.userImgPath && this.userImgPath.length > 0) {
      return this.genk.imgurl + this.userImgPath;
    } else {
      return this.genk.defaultImg;
    }
  }

  getSubjects() {
    this.sch.getSubjects()
    .subscribe((res: any) => {
      this.readlist = res;
      this.subjectList = res.filter(t => t.subjectType == this.category);
      //this.subjectList = res;
    });
  }

  saveEdit(id: number) {
    debugger;
    let subjectObj = this.subjectList.filter(t => t.id == id)[0];
    this.subjectType = subjectObj.subjectType;
    this.newSubject = subjectObj.subjects;
    this.subjectId = subjectObj.id;
  }

  editSubject() {
    const obj = {id: this.subjectId, subjects: this.newSubject, subjectType: this.subjectType};
    Swal.fire({
      title: 'Saving Data...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
        Swal.showLoading();
        this.sch.updateSubject(obj)
          .pipe(takeUntil(this.destroy))
          .subscribe(res => {
            Swal.close();
            this.loading = false;
            this.getSubjects();
          });

      }
    }).then(x => {
      // f.reset();
      // this.school = new schoolModel();
      // this.genk.imag = '';
      Swal.fire({
        icon: 'success',
        title: 'Class-Level saved successfully!.',
        showConfirmButton: false,
        timer: 2000
      });
    })
  }

  saveSubjects() {
    this.loading = true;
    debugger;
    const obj = { subjects: this.newSubject, subjectType: this.subjectType};

    Swal.fire({
      title: 'Saving Data...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
        Swal.showLoading();
        this.sch.saveSubjects(obj)
          .pipe(takeUntil(this.destroy))
          .subscribe(res => {
            Swal.close();
            this.loading = false;
            this.getSubjects();
          });

      }
    }).then(x => {
      // f.reset();
      // this.school = new schoolModel();
      // this.genk.imag = '';
      Swal.fire({
        icon: 'success',
        title: 'Class-Level saved successfully!.',
        showConfirmButton: false,
        timer: 2000
      });
    })
  }

  deleteSubject(id: number) {
    this.sch.deleteSubject(id.toString())
    .subscribe(res => {
      this.getSubjects();
      Swal.fire({
        icon: 'success',
        title: 'Class-Level deleted successfully!.',
        showConfirmButton: false,
        timer: 2000
      });
    });
  }

  changeCategory(value: string) {
    this.readlist = this.readlist.sort(function(a, b) { 
      return a.order - b.order;
    })
    if (value == 'ALLSUB') {
      this.subjectList = this.readlist;
    } else {
      this.subjectList = this.readlist.filter(t => t.subjectType == value);
    }
    
  }

  reOrderUp(value: number, roe: HTMLTableRowElement) {
    roe.style.backgroundColor = 'rgb(220, 220, 220)';
    //this.leaveModal(roe);
    setTimeout(() => {
      this.readlist = this.readlist.sort(function(a, b) { 
        return a.order - b.order;
      })
      let valueIndex = this.readlist.findIndex(t => t.order == value);
      let valueIndexTwo = valueIndex - 1;
      let valueIdOne = this.readlist[valueIndex].id;
      if (!this.readlist[valueIndexTwo]) {
        roe.style.backgroundColor = '';
        return
      }
      let valueIdTwo = this.readlist[valueIndexTwo].id;
      this.readlist[valueIndex].order = this.readlist[valueIndexTwo].order;
      this.readlist[valueIndexTwo].order = value;
      this.readlist = this.readlist.sort(function(a, b) { 
        return a.order - b.order;
      })
      this.sch.updateSubjectOrder(valueIdOne, valueIdTwo)
      .subscribe(res => {
        setTimeout(() => {
          roe.style.backgroundColor = '';
        }, 1000);
      })
    }, 100);
    
  }

  reOrderDown(value: number, roe: HTMLTableRowElement) {
    roe.style.backgroundColor = 'rgb(220, 220, 220)';
    //this.leaveModal(roe);
    setTimeout(() => {
      debugger;
      this.readlist = this.readlist.sort(function(a, b) { 
        return a.order - b.order;
      })
      let valueIndex = this.readlist.findIndex(t => t.order == value);
      let valueIndexTwo = valueIndex + 1;
      let valueIdOne = this.readlist[valueIndex].id;
      if (!this.readlist[valueIndexTwo]) {
        roe.style.backgroundColor = '';
        return
      }
      let valueIdTwo = this.readlist[valueIndexTwo].id;
      this.readlist[valueIndex].order = this.readlist[valueIndexTwo].order;
      this.readlist[valueIndexTwo].order = value;
      this.readlist = this.readlist.sort(function(a, b) { 
        return a.order - b.order;
      })
      this.sch.updateSubjectOrder(valueIdOne, valueIdTwo)
      .subscribe(res => {
        setTimeout(() => {
          roe.style.backgroundColor = '';
        }, 1000);
      })
    }, 100);
    
  }

  
  logout() {
    this.auth.logout();
    this.router.navigate(['/', this.genk.account]);
  }

  leaveModal(div: HTMLTableRowElement) {
    div.style.marginTop = '800px';
    div.style.color = 'grey';
  }
}
