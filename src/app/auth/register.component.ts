import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../services';
import { ObjectService } from '../services/object.service';
import { schoolModel } from '../_models/school.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  objService: ObjectService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  states = [];
  lgs = [];
  school = new schoolModel();
  loading = false;
  pagetype = 'school';

  constructor( 
    private router: Router,
    private renderer: Renderer2,
    private auth: AuthenticationService,
    private obj: ObjectService,
    private gen: GenericService
    ) {
      this.genk = gen;
      this.objService = obj;
      // this.userName = auth.currentUserValue.name;
      // this.userImgPath = auth.currentUserValue.imgPath;
      // this.adminStatus = auth.currentUserValue.status;
    }


    ngOnInit(): void {
      this.states = Object.keys(this.objService.lga);
      this.createSessions();
    }

    setLGA(state: string) {
      this.lgs = this.objService.lga[state];
      this.school.schoolState = state;
    }

    selectLG(lg: string) {
      this.school.schoolLga = lg;
    }

    createSchool() {
      this.loading = true;
      this.school.roleId = 1;
      this.school.currentSession = this.createSessions();
      this.auth.createSchool(this.school).subscribe(res => {
        Swal.fire({
          icon: 'success',
          title: 'School registered successfully!',
          showConfirmButton: false,
          timer: 2000
        });
      })
    }

    createSessions() {
      let nowdate = new Date();
      let newyear = nowdate.getFullYear();
      let month = nowdate.getMonth() + 1;
      let mysession;
      if (month > 8) {
        mysession = (newyear) + '/' + (newyear + 1).toString().substring(2, 4);
      } else {
        mysession = (newyear - 1) + '/' + (newyear).toString().substring(2, 4);
      }
      return mysession;
    }

    

}
