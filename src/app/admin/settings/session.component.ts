import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { Session } from '../../_models/settings';
import { SchoolService } from '../../services/school.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './session.component.html',
  styleUrls: []
})
export class SessionComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  mysession = new Session();
  sessionlist = [];
  currentSessionId: number;
  currentSessionObj: any;
  currentTerm: string;
  nextSession: string;
  nextSessionId: number;
  nextResumptionDate: string;
  selectedSession: any;
  selectedTerm: string;
  startDate: string;
  endDate: string;


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
    this.getSession();
    this.getCurrentSession();
    this.genk.topdata = 'Session';
    //this.getNextTerm();
  }

  getSession() {
    this.sch.getSession()
      .subscribe(res => {
        this.sessionlist = res;
      })
  }

  createSessions() {
    let nowdate = new Date();
    let newdate = nowdate.getFullYear();
    let dateArray = [((newdate - 2) + '/' + (newdate - 1).toString().substring(2, 4)), ((newdate - 1) + '/' + (newdate - 0).toString().substring(2, 4)), ((newdate - 0) + '/' + (newdate + 1).toString().substring(2, 4)), ((newdate + 1) + '/' + (newdate + 2).toString().substring(2, 4)), ((newdate + 2) + '/' + (newdate + 3).toString().substring(2, 4))]
    return dateArray;
  }

  saveSession() {
    this.sch.createSession(this.mysession)
      .subscribe(res => {
        this.getSession();
      })
  }

  setSession() {
    let obj = this.sessionlist.filter(t => t.id == this.currentSessionId)[0];
    this.sch.setCurrentSession(obj.id, obj.sessionName)
    .subscribe(res => {
        this.setTerm();
    });
  }

  setTerm() {
    //let obj = this.sessionlist.filter(t => t.id == this.currentSessionId)[0];
    this.sch.setTerm(this.currentTerm)
    .subscribe(res => {
      Swal.fire({
        icon: 'success',
        title: 'Current Session & Term updated successfully!.',
        showConfirmButton: false,
        timer: 2000
      });
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

        this.getNextTerm();
        
      })
  }

  saveResumptiondate() {
    this.nextSession = this.sessionlist.filter(t => t.id == this.nextSessionId)[0].sessionName;
    //let term = this.currentTerm
    this.sch.saveResumptiondate(this.nextSession, this.nextSessionId.toString(), this.currentTerm, this.nextResumptionDate)
      .subscribe(res => {
        Swal.fire({
          icon: 'success',
          title: 'Resumption Date updated successfully!.',
          showConfirmButton: false,
          timer: 2000
        });
      })
  }

  getNextTerm() {
    this.sch.getNextTerm(this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        if (res) {
          this.nextResumptionDate = res.date;
          this.nextSessionId = res.sessionId;
          this.nextSession = res.session ? res.session : this.currentSessionObj.sessionName;
        } else {
          this.nextSession = this.currentSessionObj.sessionName
        }
      })
  }

  deleteSession(id: number) {
    Swal.fire({
      title: "Do you really want to delete this session. Results uploaded for this session might be deleted?",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.sch.deleteSession(id.toString())
            .subscribe(res => {
              this.getSession();
              Swal.fire({
                icon: 'success',
                title: 'Session deleted successfully!.',
                showConfirmButton: false,
                timer: 2000
              });
        })
      }
    });
    
  }

  addtwenty(value: string) {
   return value.substring(0, 5) + '20' + value.substring(5, 8);
  }

  getWeeks(value1: string, value2: string) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24 * 7;
    const a = new Date(value1);
    const b = new Date(value2);
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    
    // const diffTime = date2 - date1;
    // const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
  }

  addTerm() {
    let dell = {id: this.selectedSession.id, sessionName: this.selectedSession.sessionName, term: this.selectedTerm, startDate: this.startDate, endDate: this.endDate};
    this.sch.createTerm(dell)
    .subscribe(res => {
      this.getSession();
      Swal.fire({
        icon: 'success',
        title: 'Session Term added successfully!.',
        showConfirmButton: false,
        timer: 2000
      });
    });
  }

  
  editTerm() {
    let dell = {id: this.selectedSession.id, sessionName: this.selectedSession.sessionName, term: this.selectedTerm, startDate: this.startDate, endDate: this.endDate};
    this.sch.editTerm(dell)
    .subscribe(res => {});
  }

  deleteTerm(newsession: any, term: string) {
    let dell = {id: newsession.id, sessionName: newsession.sessionName, term: term};
    this.sch.deleteTerm(dell)
    .subscribe(res => {
      this.getSession();
      Swal.fire({
        icon: 'success',
        title: 'Session Term added successfully!.',
        showConfirmButton: false,
        timer: 2000
      });
    });
  }

  calcNextTerm(term: string) {
    if (term == 'FIRST') {
      return 'SECOND';
    } else if (term == 'SECOND') {
      return 'THIRD';
    } else if (term == 'THIRD') {
      return 'FIRST';
    } else {
      return term;
    }
  }
}
