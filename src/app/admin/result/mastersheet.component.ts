import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
//import * as XLSX from 'xlsx/xlsx.mjs';
import * as XLSX from 'xlsx-js-style';


@Component({
  templateUrl: './mastersheet.component.html',
  styleUrls: []
})
export class MasterSheetComponent implements OnInit {
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
  subjectlist = [];
  mySchoolName: string;
  sheetType = 'class';
  mastersheetClassArm: number;

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
      this.mySchoolName = auth.currentUserValue.schoolName;
}

ngOnInit(): void {
  this.genk.topdata = 'Mastersheet';
  this.getSession();
  this.getCurrentSession();
  this.getResultSettingClassArm();
}

get classwidth() {
  return this.sheetType == 'classlevel' ? 8 : 5
}

getClassNames() {
    this.sch.getClassNames()
    .subscribe(res => {
      this.schoolClasses = res;
    });
  }

  getSchoolLevel() {
    this.sch.getSchoolLevel()
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

  getResultSettingClassArm() {
    this.sch.getResultSettingClassArm().subscribe(res => {
      debugger
      this.mastersheetClassArm = res.mastersheetClassArm;
      this.sheetType = this.mastersheetClassArm == 2 ? 'classlevel' : 'class';
      if (this.sheetType == 'classlevel') {
        this.getSchoolLevel();
      } else {
        this.getClassNames();
      }
    })
  }

  getResults() {
    this.sch.getSession()
      .subscribe(res => {
        this.sessionlist = res;
      })
  }

  getMastersheetByClass() {
    if (this.currentTerm == 'ANNUAL') {
      this.sch.getAnnualMastersheetByClassFlex(this.currentClass, this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        this.resultlist = res;
        let list = this.resultlist.sort((a, b) => b.count - a.count);
        this.subjectlist = list[0].subjects;
        this.resultlist = this.resultlist.sort((a, b) => b.average - a.average);
        this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
        this.currentClassName = this.schoolClasses.filter(t => t.id == this.currentClass)[0].class;
      });
    } else {
      this.sch.getMastersheetByClassFlex(this.currentClass, this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        this.resultlist = res;
        let list = this.resultlist.sort((a, b) => b.count - a.count);
        this.subjectlist = list[0].subjects;
        this.resultlist = this.resultlist.sort((a, b) => b.average - a.average);
        this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
        this.currentClassName = this.schoolClasses.filter(t => t.id == this.currentClass)[0].class;
      });
    }
  }

  

  showSubjectTotal(subjects: any[], subj) {
    //debugger;
    let bene = subjects[subjects.findIndex(t => t.subject == subj)];
    if (bene) {
        let mine = subjects[subjects.findIndex(t => t.subject == subj)].totalScore
        return Number(mine.toFixed(2));
    } else {
        return 'i';
    }
  }

  toNumber(value: number) {
    return Number(value.toFixed(2));
  }


  toExcel() {
    //debugger;
    let arr = [];
    this.resultlist = this.resultlist.sort((a, b) => b.average - a.average);
    for (let i = 0; i < this.resultlist.length; i++) {
      let tabl = (new Object()) as any;
      //tabl.studentId = this.resultlist[i].studentId;
      tabl.SN = i + 1;
      tabl.StudentName = this.resultlist[i].studentName.toUpperCase();
      tabl.AdmissionNo = this.resultlist[i].admissionNo;
      if (this.sheetType == 'classlevel') {
        tabl.Class = this.resultlist[i].studentClass;
      }
      if (this.resultlist[i]?.subjects.length > 0) {
        for (let u = 0; u < this.resultlist[i].subjects.length; u++) {
          tabl[this.resultlist[i].subjects[u].subject] = this.resultlist[i].subjects[u].totalScore;
        }
      }
      tabl.Total = this.resultlist[i].total;
      tabl.Average = this.resultlist[i].average;
      tabl.Position = this.genk.formatPosition(this.getposition(this.resultlist[i].average) + 1);
      
      arr.push(tabl);
    }
    const worksheet = XLSX.utils.aoa_to_sheet([[this.mySchoolName]]);
    worksheet['A1'].s = { font: { color: { rgb: "000000" }, bold: true, sz: 25}};
    let aa = this.currentClassName + ' ' + 'MASTER SHEET' + '[ ' + this.currentTerm + ' ' + 'TERM' +  ' ' + 'of' + ' ' + this.currentSession + ' ]'; 
    XLSX.utils.sheet_add_aoa(worksheet, [[aa]], { origin: "A2" });
    worksheet['A2'].s = { font: { color: { rgb: "000000" }, bold: true, sz: 18}};
    XLSX.utils.sheet_add_json(worksheet, arr, { origin: "A3" });

    //const worksheet = XLSX.utils.json_to_sheet(arr);
    worksheet['A3'].s = { font: { color: { rgb: "000000" }, bold: true }};
    worksheet['B3'].s = { font: { color: { rgb: "000000" }, bold: true }};
    worksheet['C3'].s = { font: { color: { rgb: "000000" }, bold: true }};

    let colName = [];

    if (this.sheetType == 'classlevel') {
      worksheet['D3'].s = { font: { color: { rgb: "000000" }, bold: true }};
      colName = ['E3', 'F3', 'G3', 'H3', 'I3', 'J3', 'K3', 'L3', 'M3', 'N3', 'O3', 'P3', 'Q3', 'R3', 'S3', 'T3', 'U3', 'V3'];  
    } else {
      colName = ['D3', 'E3', 'F3', 'G3', 'H3', 'I3', 'J3', 'K3', 'L3', 'M3', 'N3', 'O3', 'P3', 'Q3', 'R3', 'S3', 'T3', 'U3', 'V3'];  
    }

   
    for (let itm of colName) {
      if (worksheet[itm]) {
        worksheet[itm].s = {
          font: { color: { rgb: "000000" }, bold: true },
          alignment: {textRotation: 90}
        }
      }
    }

  

    var wscols = [
      {wch:4},
      {wch:35},
      {wch:13},
      {wch:this.classwidth},
      {wch:5},
      {wch:5},
      {wch:5},
      {wch:5},
      {wch:5},
      {wch:5},
      {wch:5},
      {wch:5},
      {wch:5},
      {wch:5},
      {wch:5},
      {wch:5},
      {wch:5},
      {wch:5},
      {wch:5},
      {wch:5},
      {wch:5},
      {wch:5},
  ];
  
  worksheet['!cols'] = wscols;

 
    const workbook = XLSX.utils.book_new();

    //XLSX.utils.sheet_add_aoa(worksheet, [["Name", "Birthday"]], { origin: "A1" });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "Mastersheet.xlsx", { compression: true });
    //console.log(arr);
  }

  fitToColumn(arrayOfArray) {
    debugger;
    // get maximum character of each column
    return arrayOfArray[0].map((a, i) => ({ wch: Math.max(...arrayOfArray.map(a2 => a2[i] ? a2[i].toString().length : 0)) }));
}

  customizeExcel(ws: any) {
    debugger;
    for (let i in ws) {
      if (typeof(ws[i]) != "object") continue;
      let cell = XLSX.utils.decode_cell(i);
  
      ws[i].s = { // styling for all cells
          font: {
              name: "arial"
          },
          alignment: {
              vertical: "center",
              horizontal: "center",
              wrapText: '1', // any truthy value here
          },
          border: {
              right: {
                  style: "thin",
                  color: "000000"
              },
              left: {
                  style: "thin",
                  color: "000000"
              },
          }
      };
  
      // if (cell.c == 0) { // first column
      //     ws[i].s.numFmt = "DD/MM/YYYY HH:MM"; // for dates
      //     ws[i].z = "DD/MM/YYYY HH:MM";
      // } else { 
      //     ws[i].s.numFmt = "00.00"; // other numbers
      // }
  
      if (cell.r == 0 ) { // first row
          ws[i].s.border.bottom = { // bottom border
              style: "thin",
              color: "000000"
          };
      }
  
      if (cell.r % 2) { // every other row
          ws[i].s.fill = { // background color
              patternType: "solid",
              fgColor: { rgb: "b2b2b2" },
              bgColor: { rgb: "b2b2b2" } 
          };
      }
  }
  }

  getposition(ave: number) {
    return this.resultlist.findIndex(t => t.average == ave);
  }
 
}
