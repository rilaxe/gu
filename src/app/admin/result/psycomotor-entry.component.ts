import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import { Psycomotor } from '../../_models/school.model';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs';
import * as XLSX from 'xlsx/xlsx.mjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './psycomotor-entry.component.html',
  styleUrls: []
})
export class PsycomotorEntryComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  schoolClasses = [];
  currentClass: string;
  sessionlist = [];
  currentSessionObj: any;
  currentSession: string;
  currentSessionId: string;
  currentTerm: string;
  psycomotorlist = [];
  studentlist = [];
  bigboss = [];
  smallboss = [];
  psycoObjList = [];
  psylist = [];
  motorlist = [];
  destroy = new Subject;
  excelData = [];
  columnArray = [];
  isSumbitError = false;
  rejectedData = [];

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
  this.genk.topdata = 'Psychomotor Entry';
  this.getClassNames();
  this.getSession();
  this.getCurrentSession();
  this.getPsycomotor();
 
  //this.getStudents();
}

getobj(studentId, skill) {
  let fre = this.motorlist.filter(t => t.studentId == studentId).length > 0 ? this.motorlist.filter(t => t.studentId == studentId)[0].psy[skill] : '';
  
  return fre;
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

getPsycomotor() {
  this.sch.getPsycomotor()
    .subscribe(res => {
      this.psycomotorlist = res;
    })
}

getStudents() {
  this.sch.getStudentsBySession(this.currentClass, this.currentSessionId, this.currentTerm)
    .subscribe(res => {
      this.studentlist = res;
      this.getStudentsPsycomotor();
    })
}

stringData(value: number, bigIndex: number, index: number) {
  //debugger;
  if (this.bigboss[bigIndex]) {
    this.bigboss[bigIndex][index] = value;
  } else {
    this.bigboss[bigIndex] = [];
    this.bigboss[bigIndex][index] = value;
  }
  
  //this.smallboss[index] = value;
  
  console.log(this.bigboss);
}

  savePsycomotor() {
    debugger;
    let settedSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName
    let arr = [];
    //const formDat: FormData = new FormData();
    for (let b = 0; b < this.bigboss.length; b++) {
      let studente = {};
      if (this.bigboss[b]) {
        var studentId = this.studentlist[b].id;
        for (let i = 0; i < this.bigboss[b].length; i++) {
          studente[this.psycomotorlist[i].skills] = this.bigboss[b][i];
          //studente['studentId'] = studentId;
        }
        this.psylist.concat(this.slappsyco(studente, this.studentlist[b], settedSession));
        arr.push(studente);
      }
    };
    this.psycoObjList = arr;
    console.log(arr);
    console.log(this.psylist);
    // this.sch.savePsycomotorEntry(this.psylist, this.currentTerm)
    //   .pipe(takeUntil(this.destroy))
    //   .subscribe(res => {
    //     Swal.close();
    //   });

      Swal.fire({
        title: 'Processing Data...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        //timer: 2000,
        didOpen: () => {
          Swal.showLoading();
      this.sch.savePsycomotorEntry(this.psylist, this.currentClass, this.currentSessionId, this.currentTerm)
        .pipe(takeUntil(this.destroy))
        .subscribe(res => {
            Swal.close();
        });}
      }).then(x => {
        //this.getStudentsPsycomotor();
        Swal.fire({
          icon: 'success',
          title: 'Psycomotor updated successfully!.',
          showConfirmButton: false,
          timer: 2000
        });
      })
  }

  slappsyco(data: any, stud: any, sessionname: string) {

    for (const bee in data) {
      if (data[bee]) {
        let psyco = new Psycomotor();
        psyco.studentId = stud.id;
        psyco.schoolId = stud.schoolId;
        psyco.classId = stud.classId;
        psyco.classLevel = stud.class;
        psyco.skill = bee;
        psyco.skillId = this.psycomotorlist.filter(t => t.skills == bee)[0].id;
        psyco.score = Number(data[bee]);
        psyco.term = this.currentTerm;
        psyco.sessions = this.currentSession;
        this.psylist.push(psyco);
      }
    }
    return this.psylist;
  }

  excelPsyco(data: any) {
    for (const bee in data) {
      if (data[bee]) {
        let psyco = new Psycomotor();
        psyco.skill = bee;
        //psyco.skillId = this.psycomotorlist.filter(t => t.skills == bee)[0].id;
        psyco.score = Number(data[bee]);
        this.psylist.push(psyco);
      }
    }
    return this.psylist;
  }

  getStudentsPsycomotor() {
    this.sch.getStudentsPsycomotor(this.currentClass, this.currentSessionId, this.currentTerm)
    .subscribe(res => {
      this.motorlist = res;
    })
  }


  downloadTemplate() {
    const tem = [
      {
          "Student Name": "Wesley Snipe",
          "Admission No.": "SN3440",
          "Coordination": "8",
          "Attentiveness": "9",
          "Punctuality": "6",
          "Neatness": '5'
          
      },
      {
          "Student Name": "Anita Snipe",
          "Admission No.": "SN3449",
          "Coordination": "8",
          "Attentiveness": "9",
          "Punctuality": "6",
          "Neatness": '5'
      }];
  
      const worksheet = XLSX.utils.json_to_sheet(tem);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Psycomotor");
      XLSX.writeFile(workbook, "Student Psycomotor Lists.xlsx", { compression: true });
  
  }


  async loadExcel(DeFile: any) {
    var file = <File>DeFile.target.files[0];

    if (file) {
      console.log("hi");
      var fileReader = new FileReader();
      fileReader.onload = (event: any) => {
        let mee = fileReader.result;
        var data = event.target.result;

        var workbook = XLSX.read(mee, {
          type: "binary"
        });
        workbook.SheetNames.forEach(sheet => {
          let rowObject = XLSX.utils.sheet_to_row_object_array(
            workbook.Sheets[sheet]
          );
          console.log(rowObject);
          //this.columnArray =  Object.keys(rowObject[0]);
          //var daye = this.getJsDateFromExcel(42216).toJSON();
          this.excelData = rowObject;
          //let jsonObject = JSON.stringify(rowObject);
          //document.getElementById("jsonData").innerHTML = jsonObject;
          console.log(this.excelData);
          this.excelData.forEach(a => {
            this.excelPsyco(a);
          });
          console.log(this.psylist);
        });
      };
    
      
      fileReader.readAsBinaryString(file);
      let ree = fileReader;
    }
  }

}
