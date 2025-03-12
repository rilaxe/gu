import { Component, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './result-settings.component.html',
  styleUrls: []
})
export class ResultSettingsComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  countdata: any;
  genderStat: any;
  classArm: number;
  mastersheetClassArm: number;
  isPhoto: boolean;
  isOverride: boolean;
  resPhoto: number;
  comOverride: number;


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
  this.genk.topdata = 'Result Settings';
  this.getResultSettingClassArm();
}

getResultSettingClassArm() {
  this.sch.getResultSettingClassArm().subscribe(res => {
    this.classArm = res.classArm;
    this.mastersheetClassArm = res.mastersheetClassArm;
    this.isPhoto = res.resultPhoto ? true : false;
    this.isOverride = res.autoCommentOverride ? true : false;
  })
}

  setResultField(value: boolean, fieldId: number, fieldname: string) {
    if (value) {
      this.sch.addResultSettingClassArm(fieldId.toString(), fieldname)
      .subscribe(res => {
        Swal.fire({
          icon: 'success',
          title: 'ClassArm Settings updated successfully!.',
          showConfirmButton: false,
          timer: 2000
        });
      });
    } 
  }

  setPhotoField(value: boolean) {
    if (value) {
        this.resPhoto = 1;
    }
    else {
          this.resPhoto = 0;
    }
      this.sch.updateAddResultPhoto(this.resPhoto.toString())
      .subscribe(res => {
        Swal.fire({
          icon: 'success',
          title: 'Result Photo Settings updated successfully!.',
          showConfirmButton: false,
          timer: 2000
        });
      });
    
  }

  setAutoCommentField(value: boolean) {
    if (value) {
        this.comOverride = 1;
    }
    else {
          this.comOverride = 0;
    }
      this.sch.updateAutoCommentOverride(this.comOverride.toString())
      .subscribe(res => {
        Swal.fire({
          icon: 'success',
          title: 'Auto-Comment Settings updated successfully!.',
          showConfirmButton: false,
          timer: 2000
        });
      });
    
  }


  setMasterSheetField(value: boolean, fieldId: number, fieldname: string) {
    if (value) {
      this.sch.addMastersheetSettingClassArm(fieldId.toString(), fieldname)
      .subscribe(res => {
        Swal.fire({
          icon: 'success',
          title: 'ClassArm Settings updated successfully!.',
          showConfirmButton: false,
          timer: 2000
        });
      });
    } 
  }
}
