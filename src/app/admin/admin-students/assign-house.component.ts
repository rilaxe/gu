import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';

@Component({
  templateUrl: './assign-house.component.html',
  styleUrls: []
})
export class AssignHouseComponent implements OnInit {
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  countdata: any;
  genderStat: any;
  schoolClasses = [];
  currentClass: number;
  sessionlist = [];
  currentSessionObj: any;
  currentSession: string;
  currentSessionId: string;
  currentTerm: string;
  houseList = [];
  studentHouseList = [];
  bigboss = [];
  selectedHouse: string;


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
  this.genk.topdata = 'Assign Student House';
  this.getClassNames();
  this.getSession();
  this.getCurrentSession();
  this.getHouse();
}


getHouse() {
    this.sch.getHouse()
    .subscribe(res => {
      this.houseList = res;
    })
  }


getClassNames() {
    this.sch.getClassNames()
    .subscribe(res => {
      this.schoolClasses = res;
      
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
        if (this.currentSessionObj.currentTerm) {
          this.currentTerm = this.currentSessionObj.currentTerm;
        }
        
      })
  }

  getStudentHouse() {
    this.sch.getStudentHouse(this.currentClass.toString(), this.currentSessionId, this.currentTerm)
    .subscribe(res => {
      this.studentHouseList = res;
    })
  }

  setPlacement(houseId: string, studentId: number) {
    debugger
    if (this.bigboss.filter(t => t.studentId == studentId).length > 0) {
      this.bigboss = this.bigboss.filter(t => t.studentId != studentId)
    }
    let myhouse = this.houseList.filter(t => t.id == houseId)[0].name;
    this.bigboss.push({studentId: studentId, house: myhouse, houseId: houseId});
    
  }

  updateStudentHouse() {
    this.sch.updateStudentHouse(this.bigboss, this.currentClass.toString(), this.currentSessionId, this.currentTerm)
    .subscribe(res => {
      //this.studentHouseList = res;
    })
  }

}
