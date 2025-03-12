import { Component, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx/xlsx.mjs';

@Component({
  templateUrl: './access-pin.component.html',
  styleUrls: []
})
export class AccessPinComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  countdata: any;
  genderStat: any;
  maxCount: number;
  pinAmount: number;
  accessPinList = [];

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
  this.genk.topdata = 'Access Pin';
  this.getAccessPin();
}

get setImg() {
    if (this.userImgPath && this.userImgPath.length > 0) {
      return this.genk.imgurl + this.userImgPath;
    } else {
      return this.genk.defaultImg;
    }
  }

  getAccessPin() {
    this.sch.getAccessPin()
    .subscribe(res => {
      this.accessPinList = res;
    })
  }


  createAccessPin() {
    Swal.fire({
      title: 'Creating Access Pin...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () =>{ 
        Swal.showLoading();
        this.sch.createAccessPin(this.pinAmount.toString(), this.maxCount.toString())
      .subscribe({
        next: (response) => {
          Swal.close();
          this.getAccessPin();
        Swal.fire({
          icon: 'success',
          title: 'Access Pins created successfully!.',
          showConfirmButton: false,
          timer: 2000
        });
        },
        error: (err) => {
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Access Pins creation failed!.',
            showConfirmButton: false,
            timer: 2000
          });
        },
      }
      )
    }
    })
  }


  confirmPinDelete(id: number) {
    Swal.fire({
      title: "Do you want permanently delete this Access Pin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.deleteAccessPin(id);
      }
    });
  }

  deleteAccessPin(id: number) {
    Swal.fire({
      title: 'Processing Delete...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
        Swal.showLoading();
        this.sch.deleteAccessPin(id.toString())
      .subscribe({
        next: (response) => {
          Swal.close();
          this.getAccessPin();
        Swal.fire({
          icon: 'success',
          title: 'Access Pin deleted successfully!.',
          showConfirmButton: false,
          timer: 2000
        });
        },
        error: (err) => {
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Access Pin deletion failed!.',
            showConfirmButton: false,
            timer: 2000
          });
        },
      }
      )
    }
    })
    
  }

 
  exportObj(table: any) {
    //const table = document.getElementById('myTable');
    const worksheet = XLSX.utils.table_to_sheet(table);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "Access-Pin Lists.xlsx", { compression: true });
  }

}
