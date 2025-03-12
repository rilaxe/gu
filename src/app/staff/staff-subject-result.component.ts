import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx-js-style';
import { AuthenticationService, GenericService } from '../services';
import { SchoolService } from '../services/school.service';


@Component({
  templateUrl: './staff-subject-result.component.html',
  styleUrls: []
})
export class StaffSubjectResultComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  schoolClasses = [];
  currentClass: string;
  currentClassName: string;
  sessionlist = [];
  currentSessionObj: any;
  currentSession: string;
  currentSessionId: string;
  currentTerm: string;
  resultlist = [];
  currentSubjectId: number;
  currentSubjectName: number;
  classSubjects = [];
  staffSubjectList = [];
  staffClasses = [];

  constructor( 
    private router: Router,
    private route: ActivatedRoute,
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
  this.genk.topdata = 'Subject Result';
  this.getClassNames();
  //this.getClassSubjects();
  this.getSession();
  this.getCurrentSession();
  this.getStaffSubjects();
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

  getResults() {
    this.sch.getSession()
      .subscribe(res => {
        this.sessionlist = res;
      })
  }

  getStaffSubjects() {
    this.sch.getStaffSubjects(this.auth.currentUserValue.id.toString())
    .subscribe(res => {
      this.staffSubjectList = res;
      let classname = [];
      //let newClasses = [];
      this.staffSubjectList.forEach(a => {
        if (classname.filter(c => c == a.classId).length < 1) {
          classname.push(a.classId);
          this.staffClasses.push({class: a.class, id: a.classId});
        }
      })
      //this.staffClasses = [...new Set(newClasses)];
      //this.cd.markForCheck();
    });
  }

  getResultsAverageByClass() {
    this.sch.getResultsAverageByClass(this.currentClass, this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        this.resultlist = res;
        this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
      })
  }

  formatPosition(value: number) {
    let position; 
    switch (value) {
      case 1:
        position = "1st";
        break;
      case 2:
        position = "2nd";
        break;
      case 3:
        position = "3rd";
        break;
      default:
        position = value + 'th';
        break;
    }
    return position;
  }


  getClassSubjects() {
    this.classSubjects = this.staffSubjectList.filter(a => a.classId == this.currentClass);
    // this.sch.getSubjectByClass(this.currentClass.toString())
    // .subscribe(res => {
    //   this.classSubjects = res;
    // });
  }

  setClass(id: number) {
    this.currentClass = id.toString();
    this.getClassSubjects();
  }

  getSubjectResultsByClass() {
    this.sch.getStudentResultsByClass(this.currentClass, this.currentSessionId.toString(), this.currentTerm, this.currentSubjectId.toString())
      .subscribe(res => {
        this.resultlist = res;
        this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
        this.currentSubjectName = this.classSubjects.filter(t => t.subjectId == this.currentSubjectId)[0].subjects;
        this.currentClassName = this.schoolClasses.filter(t => t.id == this.currentClass)[0].class;
      })
  }

 exportTable() {
    // let worksheet = XLSX.utils.aoa_to_sheet([[this.auth.currentUserValue.schoolName]]);
    // worksheet['A1'].s = { font: { color: { rgb: "000000" }, bold: true, sz: 25}};
    // let aa = this.currentClassName + ' ' + 'MASTER SHEET' + '[ ' + this.currentTerm + ' ' + 'TERM' +  ' ' + 'of' + ' ' + this.currentSession + ' ]'; 
    // XLSX.utils.sheet_add_aoa(worksheet, [[aa]], { origin: "A2" });
    // worksheet['A2'].s = { font: { color: { rgb: "000000" }, bold: true, sz: 18}};
    var elt = document.getElementById('subjecttable');
    let worksheet = XLSX.utils.table_to_sheet(elt);
    //worksheet['A1'].s = { font: { color: { rgb: "000000" }, bold: true, sz: 18}};

    var wscols = [
        {wch:5},
        {wch:20},
        {wch:20},
        {wch:20},
        {wch:20},
        {wch:20},
        {wch:20},
        {wch:20},
    ];
    
    worksheet['!cols'] = wscols;
    //XLSX.utils.sheet_add_json(worksheet, arr, { origin: "A3" });

    const workbook = XLSX.utils.book_new();

    //XLSX.utils.sheet_add_aoa(worksheet, [["Name", "Birthday"]], { origin: "A1" });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Subject-Result");
    XLSX.writeFile(workbook, "Subject-Result.xlsx", { compression: true });
 }
}
