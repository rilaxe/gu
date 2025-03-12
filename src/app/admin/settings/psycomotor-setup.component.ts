import { Component, ElementRef, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import Swal from 'sweetalert2';
import { SchoolService } from '../../services/school.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-dashboard',
  templateUrl: './psycomotor-setup.component.html',
  styleUrls: ['./settings.component.css']
})
export class PsycomotorSetupComponent implements OnInit {

  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  name: string;
  maxScore: number;
  destroy = new Subject;
  motorlist = [];



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
        this.getPsycomotor();
        this.genk.topdata = 'Psycomotor Setup';
    }

    getPsycomotor() {
      this.sch.getPsycomotor()
      .subscribe(res => {
        this.motorlist = res;
      });
    }

    saveMotor() {

      Swal.fire({
        title: 'Saving Data...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        //timer: 2000,
        didOpen: () => {
          Swal.showLoading();
          this.sch.saveMotor(this.name, this.maxScore.toString())
            .pipe(takeUntil(this.destroy))
            .subscribe(res => {
              Swal.close();
              this.getPsycomotor();
            });
  
        }
      }).then(x => {
        // f.reset();
        // this.school = new schoolModel();
        // this.genk.imag = '';
        Swal.fire({
          icon: 'success',
          title: 'Psycomotor saved successfully!.',
          showConfirmButton: false,
          timer: 2000
        });
      })
    }

    deleteMotor(id: number) {
      this.sch.deletePsycomotor(id.toString())
      .subscribe(res => {
        this.getPsycomotor();
        Swal.fire({
          icon: 'success',
          title: 'Psycomotor deleted successfully!.',
          showConfirmButton: false,
          timer: 2000
        });
      });
    }

    // createInput() {
    //     let cloneNode = this.someTr.nativeElement.cloneNode(true);
    //     this.someTbody.nativeElement.appendChild(cloneNode);
    //     this.psycoList.push({name: 'maxme', maxlimit: 20});
    //     let firstChild = cloneNode.firstChild;
    //     let secondChild = firstChild.firstChild;
    //     secondChild.value = this.psycoList[this.psycoList.length - 1].name;
    //     secondChild.onchange = "onc(1)";
    // }

    
}
