import { Component, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './house.component.html',
  styleUrls: []
})
export class HouseComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  countdata: any;
  genderStat: any;
  houseName: string;
  houseList = [];


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
  this.genk.topdata = 'View House';
  this.getHouse();
}

get setImg() {
    if (this.userImgPath && this.userImgPath.length > 0) {
      return this.genk.imgurl + this.userImgPath;
    } else {
      return this.genk.defaultImg;
    }
  }

  getHouse() {
    this.sch.getHouse()
    .subscribe(res => {
      this.houseList = res;
    })
  }

  createHouse(name: string) {
    Swal.fire({
      title: 'Creating House...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () =>{ 
        Swal.showLoading();
        this.sch.createHouse(name)
      .subscribe({
        next: (response) => {
          Swal.close();
          this.getHouse();
        Swal.fire({
          icon: 'success',
          title: 'House created successfully!.',
          showConfirmButton: false,
          timer: 2000
        });
        },
        error: (err) => {
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'House creation failed!.',
            showConfirmButton: false,
            timer: 2000
          });
        },
      }
      )
    }
    })


    // this.sch.createHouse(name)
    //   .subscribe(res => {
    //     this.getHouse();
    //     Swal.fire({
    //       icon: 'success',
    //       title: 'House created successfully!.',
    //       showConfirmButton: false,
    //       timer: 2000
    //     });
    //   })
  }

  confirmHouseDelete(id: number) {
    Swal.fire({
      title: "Do you want permanently delete this house?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.deleteHouse(id);
      }
    });
  }

  deleteHouse(id: number) {
    Swal.fire({
      title: 'Processing Delete...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
        Swal.showLoading();
        this.sch.deleteHouse(id.toString())
      .subscribe({
        next: (response) => {
          Swal.close();
          this.getHouse();
        Swal.fire({
          icon: 'success',
          title: 'House deleted successfully!.',
          showConfirmButton: false,
          timer: 2000
        });
        },
        error: (err) => {
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'House deletion failed!.',
            showConfirmButton: false,
            timer: 2000
          });
        },
      }
      )
    }
    })
    
  }

  
}
