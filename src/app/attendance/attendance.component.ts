import { Component, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../services';
import { SchoolService } from '../services/school.service';
import { Calendar, CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';



@Component({
  templateUrl: './attendance.component.html',
  styleUrls: ['attendance.component.css']
})
export class AttendanceComponent implements OnInit {
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
  currentTerm: string;
  currentClassLevelId: number;
  currentClassId: number;

  isCalendar = true;
  isTimeline = false;
  isClassModal = false;
  schoolClasses = [];
  schoolLevels = [];
  students = [];
  isCheckAll = false;
  calendarOptions: CalendarOptions;
  selectedDateEvent: any;
  todayDate: string;



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
  this.genk.topdata = 'Attendance';
  const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.todayDate = `${year}-${month}-${day}`+ 'T00:00';


  this.calendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: this.calendarEventList,
    eventClick: (arg) => {
      this.viewEvent(arg.event.id);
    },
    
  };
  this.getLevels()
  
  //this.getTimelineCalendarEvent();
}

setImg(imgpath) {
  if (imgpath && imgpath.length > 0) {
    return this.genk.imgurl + imgpath;
  } else {
    return this.genk.defaultImg;
  }
}

getLevels() {
  this.sch.getClassLevels()
  .subscribe(res => {
    this.getCurrentSession();
    this.schoolLevels = res;
  });
}

getClassByLevel(classId: number) {
  this.currentClassLevelId = classId;
  this.sch.getClassByLevel(this.currentClassLevelId.toString())
  .subscribe(res => {
    this.schoolClasses = res;
  });
}

changeClass(classId: number) {
  this.currentClassId = classId;
  this.getStudents(classId);
  this.isClassModal = false
}

getStudents(classId: number) {
  this.sch.getAttendance(classId.toString(), this.currentSessionId.toString(), this.currentTerm, this.todayDate)
  .subscribe(res => {
    this.students = res;
    this.students.forEach(a => {
      //a.isChecked = false;
      a.reason = null;
      if (a.isChecked) {
        a.attend = 'PRESENT';
      } else {
        a.attend = 'ABSENT';
      }
    })
  });
}

getCurrentSession() {
  this.sch.getCurrentSession()
    .subscribe(res => {
      this.currentSessionObj = res;
      this.currentSessionId = this.currentSessionObj.sessionId;
      if (this.currentSessionObj.currentTerm) {
        this.currentTerm = this.currentSessionObj.currentTerm;
      }
    })
}




  // handleDateClick(arg) {
  //   debugger
  //   // Remove the background color from all dates
  //   document.querySelectorAll('.fc-day').forEach(day => {
  //     day.classList.remove('clicked-date');
  //   });

  //   // Add the background color to the clicked date
  //   arg.dayEl.classList.add('clicked-date');
  // }


  handleDateClick(arg) {
    debugger
    this.todayDate = arg.dateStr + 'T00:00';
    //alert('date click! ' + arg.dateStr)
    this.isEnterModal = true;
    document.querySelectorAll('.fc-day').forEach(day => {
          day.classList.remove('clicked-date');
        });
    
        // Add the background color to the clicked date
    arg.dayEl.classList.add('clicked-date');

    if (this.selectedDateEvent) {
      this.selectedDateEvent.remove();
    }

    // Add a new event to the calendar for the clicked date
    const calendarApi = arg.view.calendar;
    this.selectedDateEvent = calendarApi.addEvent({
      start: arg.date,
      allDay: true,
      display: 'background',
      backgroundColor: '#0ce036'
    });

    this.getStudents(this.currentClassId);
  }

  submitEvent() {
    this.isEnterModal = false;
    let evdata = {title: this.eventTitle, description: this.eventDesc, location: this.eventLocation, startDateTime: this.startDateTime, 
      endDateTime: this.endDateTime, sessionId: this.currentSessionId, term: this.currentTerm};
    this.sch.createCalendarEvent(evdata)
    .subscribe(res => {
      this.isEnterModal = false;
      //this.getCalendarEvent();
      Swal.fire("Event Added Successfully", "", "success");
    })
  }

  closeModal() {
    this.isEnterModal = false;
    this.isViewModal = false;
  }

  // getCalendarEvent() {
  //   this.sch.getCalendarEvents()
  //   .subscribe(res => {
  //     debugger
  //     this.calendarEventList = res;
  //     let ev;
  //     this.calendarEventList.forEach(a => {
  //         ev = { id: a.id, title: a.title, date: a.startDateTime.split('T')[0]};
  //         this.calendarEventList.push(ev);
  //         this.calendarOptions.events = this.calendarEventList;
  //     });
  //   })
  // }

  viewEvent(id: string) {
    this.eventDisplayObj = this.calendarEventList.filter(a => a.id == Number(id))[0];
    this.isViewModal = true;
  }


  // deleteCalendarEvent(id: number) {
  //   Swal.fire({
  //     title: "Do you really want to delete this event?",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, Delete"
  //   }).then((result) => {
  //     /* Read more about isConfirmed, isDenied below */
  //     if (result.isConfirmed) {
  //       this.sch.deleteCalendarEvent(id.toString())
  //       .subscribe(res => {
  //         this.getCalendarEvent();
  //         this.isViewModal = false;
  //         Swal.fire("Data deleted", "", "success");
  //       });
  //     }
  //   });
  // }

  getSession() {
    this.sch.getSession()
      .subscribe(res => {
        this.sessionlist = res;
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

  setField(value: boolean) {
    if (value) {
      this.students.forEach(a => {
        a.isChecked = true;
        if (a.isChecked) {
          a.attend = 'PRESENT';
        } else {
          a.attend = 'ABSENT';
        }
      });
    } else {
      this.students.forEach(a => {
        a.isChecked = false;
        if (a.isChecked) {
          a.attend = 'PRESENT';
        } else {
          a.attend = 'ABSENT';
        }
      })
    }
  }

  saveAttendance() {
    this.sch.saveAttendance(this.students, this.currentClassId.toString(), this.currentSessionId.toString(), this.currentTerm, this.todayDate)
    .subscribe(res => {
      Swal.fire({
        icon: 'success',
        title: 'Attendace saved successfully!.',
        showConfirmButton: false,
        timer: 2000
      });
    });
  }

  setAttend(item: any, inputChecked: boolean) {
    item.isChecked = inputChecked;
    if (inputChecked) {
      item.attend = 'PRESENT';
    } else {
      item.attend = 'ABSENT';
    }
  }

  setReason(item: any, reason: string) {
    item.reason = reason;
  }
}
