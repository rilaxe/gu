import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';

@Component({
  templateUrl: './view.component.html'
})
export class ViewComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  student: any;
  calendarEventList = [];
  isViewModal = false;
  eventDisplayObj: any;

  constructor( 
    private router: Router,
    private auth: AuthenticationService,
    private sch: SchoolService,
    private activeRoute: ActivatedRoute,
    private gen: GenericService
    ) {
      this.genk = gen;
      this.userName = auth.currentUserValue.name;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = auth.currentUserValue.status;
}

ngOnInit(): void {
  this.genk.topdata = 'Results';
}


setImg(imgpath) {
  if (imgpath && imgpath.length > 0) {
    return this.genk.imgurl + imgpath;
  } else {
    return this.genk.defaultImg;
  }
}

}
