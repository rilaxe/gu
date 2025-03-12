import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import Swal from 'sweetalert2';
import { SchoolService } from '../../services/school.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';


@Component({
  selector: 'app-dashboard',
  templateUrl: './class-level.component.html',
  styleUrls: ['./settings.component.css', '../../stage.css']
})
export class ClassLevelComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  levelName: string;
  levelCategory: string;
  loading = false;
  destroy = new Subject;
  levelData: any[];
  bloke = false;
  
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

get setImg() {
    if (this.userImgPath && this.userImgPath.length > 0) {
      return this.genk.imgurl + this.userImgPath;
    } else {
      return this.genk.defaultImg;
    }
  }

  ngOnInit(): void {
    this.getClassLevel();
    this.genk.topdata = 'Class Level';
  }

  getClassLevel() {
    this.sch.getSchoolLevel()
    .subscribe(res => {
      this.levelData = res;
    });
  }

  togme(me: HTMLAnchorElement) {
    if (me.style.display == 'contents') {
      me.style.display = 'none';

    } else {
      me.style.display = 'contents';
      this.bloke = true;
    }
  }


  saveClassLevel() {
    this.loading = true;
    const obj = { schoolId: this.auth.currentUserValue.schoolId, levelName: this.levelName, levelCategory: this.levelCategory };

    Swal.fire({
      title: 'Saving Data...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
        Swal.showLoading();
        this.sch.saveClassLevel(obj)
          .pipe(takeUntil(this.destroy))
          .subscribe(res => {
            Swal.close();
            this.loading = false;
            this.getClassLevel();
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

  deleteLevel(id: number) {
    this.sch.deleteClassLevel(id.toString())
    .subscribe(res => {
      Swal.fire({
        icon: 'success',
        title: 'Class-Level deleted successfully!.',
        showConfirmButton: false,
        timer: 2000
      });
    });
  }

  
  logout() {
    this.auth.logout();
    this.router.navigate(['/', this.genk.account]);
  }
}
