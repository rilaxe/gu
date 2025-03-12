import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import * as XLSX from 'xlsx-js-style';


@Component({
  templateUrl: './subject-result.component.html',
  styleUrls: []
})
export class SubjectResultComponent implements OnInit {
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

  getResultsAverageByClass() {
    this.sch.getResultsAverageByClass(this.currentClass, this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        this.resultlist = res;
        this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
      })
  }

  getposition(ave: number) {
    return this.resultlist.findIndex(t => t.totalScore == ave);
  }


  getClassSubjects() {
    this.sch.getSubjectByClass(this.currentClass.toString())
    .subscribe(res => {
      this.classSubjects = res;
    });
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
        this.currentSubjectName = this.classSubjects.filter(t => t.id == this.currentSubjectId)[0].subjects;
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
