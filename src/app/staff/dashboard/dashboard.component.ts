import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})
export class StaffDashboardComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  staff: any;
  student: any;
  calendarEventList = [];
  isViewModal = false;
  eventDisplayObj: any;
  //student: any;

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
  this.genk.topdata = 'Dashboard';
  this.getResults();
  this.getCalendarEvent();
}


setImg(imgpath) {
  if (imgpath && imgpath.length > 0) {
    return this.genk.imgurl + imgpath;
  } else {
    return this.genk.defaultImg;
  }
}

  
  logout() {
    this.auth.logout();
    this.router.navigate(['/', this.genk.account]);
  }

  getResults() {
    this.sch.getStaffByIdOnly()
      .subscribe(res => {
        this.staff = res;
      })
  }

  profile() {
    debugger;
    this.router.navigate(['/' + 'student', 'profile']);
  }

  getCalendarEvent() {
    this.sch.getUpcomingCalendarEvents()
    .subscribe(res => {
      this.calendarEventList = res;
    })
  }

  viewEvent(id: string) {
    debugger;
    this.eventDisplayObj = this.calendarEventList.filter(a => a.id == Number(id))[0];
    this.isViewModal = true;
  }

  closeModal() {
    this.isViewModal = false;
  }
}
