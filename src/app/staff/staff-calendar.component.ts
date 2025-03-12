import { Component, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../services';
import { SchoolService } from '../services/school.service';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';



@Component({
  templateUrl: './staff-calendar.component.html',
  styleUrls: ['staff-calendar.component.css']
})
export class StaffCalendarComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  countdata: any;
  genderStat: any;
  isEnterModal = false;
  isViewModal = false;

  calendarEventList = [];
  calendarTimelineList = [];
  eventTitle: string;
  eventDesc: string;
  eventLocation: string;
  startDateTime: string;
  endDateTime: string;

  eventDisplayObj: any;
  sessionlist = [];
  currentSessionObj: any;
  currentSession: string;
  currentSessionId: string;
  currentTerm: string = 'UPCOMING';

  isCalendar = true;
  isTimeline = false;


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
  this.genk.topdata = 'Award Listings';
  this.getCalendarEvent();
  this.getSession();
  this.getCurrentSession();
  this.getTimelineCalendarEvent();
}

calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: this.calendarEventList,
    eventClick: (arg) => {
      this.viewEvent(arg.event.id);
    },
  };

get setImg() {
    if (this.userImgPath && this.userImgPath.length > 0) {
      return this.genk.imgurl + this.userImgPath;
    } else {
      return this.genk.defaultImg;
    }
  }

  handleDateClick(arg) {
    this.startDateTime = arg.dateStr + 'T00:00';
    //alert('date click! ' + arg.dateStr)
    this.isEnterModal = true;
  }

  submitEvent() {
    this.isEnterModal = false;
    let evdata = {title: this.eventTitle, description: this.eventDesc, location: this.eventLocation, startDateTime: this.startDateTime, 
      endDateTime: this.endDateTime, sessionId: this.currentSessionId, term: this.currentTerm};
    this.sch.createCalendarEvent(evdata)
    .subscribe(res => {
      this.isEnterModal = false;
      this.getCalendarEvent();
      Swal.fire("Event Added Successfully", "", "success");
    })
  }

  closeModal() {
    this.isEnterModal = false;
    this.isViewModal = false;
  }

  getCalendarEvent() {
    this.sch.getCalendarEvents()
    .subscribe(res => {
      debugger
      this.calendarEventList = res;
      let ev;
      this.calendarEventList.forEach(a => {
          ev = { id: a.id, title: a.title, date: a.startDateTime.split('T')[0]};
          this.calendarEventList.push(ev);
          this.calendarOptions.events = this.calendarEventList;
      });
    })
  }

  viewEvent(id: string) {
    this.eventDisplayObj = this.calendarEventList.filter(a => a.id == Number(id))[0];
    this.isViewModal = true;
  }


  deleteCalendarEvent(id: number) {
    Swal.fire({
      title: "Do you really want to delete this event?",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.sch.deleteCalendarEvent(id.toString())
        .subscribe(res => {
          this.getCalendarEvent();
          this.isViewModal = false;
          Swal.fire("Data deleted", "", "success");
        });
      }
    });
  }

  getSession() {
    this.sch.getSession()
      .subscribe(res => {
        this.sessionlist = res;
      })
  }

  getCurrentSession() {
    this.sch.getCurrentSession()
      .subscribe(res => {
        this.currentSessionObj = res;
        this.currentSessionId = this.currentSessionObj.sessionId;
        // if (this.currentSessionObj.currentTerm) {
        //   this.currentTerm = this.currentSessionObj.currentTerm;
        // }
        this.getTimelineCalendarEvent();
        
      })
  }

  switchTimeline(value: string) {
    if (value == 'TIMELINE') {
      this.isCalendar = false;
      this.isTimeline = true;
    } else {
      this.isCalendar = true;
      this.isTimeline = false;
    }
  }


  getTimelineCalendarEvent() {
    this.sch.getCalendarEventsByTerm(this.currentTerm, this.currentSessionId.toString())
    .subscribe(res => {
      this.calendarTimelineList = res;
    })
  }

  cutText(text: string) {
    if (text.length > 200) {
      return text.substring(0, 200) + '...';
    }
    return text;
  }

  switchTerm(term) {
    this.currentTerm = term;
    this.getTimelineCalendarEvent();
  }

  switchSession(sessionId) {
    this.currentSessionId = sessionId;
    this.getTimelineCalendarEvent();
  }
}
