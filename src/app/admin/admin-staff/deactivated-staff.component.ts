import { Component, Inject, Input, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './deactivated-staff.component.html'
})
export class DeactivatedStaffComponent {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  tabActive = 'Person';
  staffList = [];

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
        this.genk.topdata = 'Deactivated Staff 👨🏾‍🎓';
        this.getAllStaff();
    }


  getAllStaff() {
    this.sch.getAllDeactivatedStaff()
      .subscribe(res => {
        this.staffList = res;
      })
  }

  setImg(imgpath) {
    if (imgpath && imgpath.length > 0) {
      return this.genk.imgurl + imgpath;
    } else {
      return this.genk.defaultImg;
    }
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
              this.getAllStaff();
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
