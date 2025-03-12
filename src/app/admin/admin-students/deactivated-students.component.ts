import { Component, Inject, Input, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './deactivated-students.component.html'
})
export class DeactivatedStudentsComponent {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  tabActive = 'Person';
  studentList = [];

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
    this.genk.topdata = 'Deactivated List 👨🏾‍🎓';
    this.getAllStudents();
}

getAllStudents() {
    this.sch.getDeactivatedStudents()
      .subscribe(res => {
        this.studentList = res;
      })
  }

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

  activateAccount(id: number) {
    Swal.fire({
      title: "Do you really want to activated this student?",
      text: "Result can be uploaded for this student",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Activate"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.sch.activateAccount(id.toString())
            .subscribe(res => {
              this.getAllStudents();
              Swal.fire({
                icon: 'success',
                title: 'Student deactivated successfully!.',
                showConfirmButton: false,
                timer: 2000
              });
        })
      }
    });
  }
}
