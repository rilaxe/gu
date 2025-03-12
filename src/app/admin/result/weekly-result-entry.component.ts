import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import { Subject } from 'rxjs/internal/Subject';
import { Result } from '../../_models/school.model';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
//import * as XLSX from 'xlsx/xlsx.mjs';
import * as XLSX from 'xlsx-js-style';
import * as XLSX2 from 'xlsx/xlsx.mjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './weekly-result-entry.component.html',
  styleUrls: ['result.component.css']
})
export class WeeklyResultEntryComponent implements OnInit {
  @Input() header: string;
  resultForm: FormGroup;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  schoolClasses = [];
  currentClass: number;
  sessionlist = [];
  currentSessionObj: any;
  currentSession: string;
  currentSessionId: string;
  currentTerm: string;
  selectedWeek: number;
  psycomotorlist = [];
  studentlist = [];
  bigboss = [];
  smallboss = [];
  psycoObjList = [];
  psylist = [];
  motorlist = [];
  classSubjects = [];
  classSubjectsBackup = [];
  resultlist = [];
  gradeScaleList = [];
  caSetupData: any;
  caScoreData: any;
  currentSubjectId: number;
  bulkClassId: number;
  destroy = new Subject;
  excelObj: any;
  submitted = false;
  schoolId: number;

  constructor( 
    private router: Router,
    private auth: AuthenticationService,
    private sch: SchoolService,
    private gen: GenericService,
    private cd: ChangeDetectorRef
    ) {
      this.genk = gen;
      this.userName = auth.currentUserValue.name;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = auth.currentUserValue.status;
      this.schoolId = auth.currentUserValue.schoolId;
}

ngOnInit(): void {
  this.genk.topdata = 'Weekly Result Entry';
  this.resultForm = new FormGroup({
      'term': new FormControl(this.currentTerm, [Validators.required]),
      'sessionId': new FormControl(this.currentSessionId, [Validators.required]),
      'subjectId': new FormControl(this.currentSubjectId, [Validators.required]),
      'classId': new FormControl(this.currentClass, [Validators.required]),
      'week': new FormControl(this.selectedWeek, [Validators.required]),
  }, {});

  this.getClassNames();
  this.getSession();
  this.getCurrentSession();
  this.cd.markForCheck();
}

get f() {
    return this.resultForm.controls;
}

getClassNames() {
    this.sch.getClassNames()
    .subscribe(res => {
      this.schoolClasses = res;
      this.cd.markForCheck();
    });
  }
  
  getSession() {
    this.sch.getSession()
      .subscribe(res => {
        this.sessionlist = res;
        this.cd.markForCheck();
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
        this.cd.markForCheck();
      })
  }

  getClassSubjects() {
    this.sch.getSubjectByClass(this.currentClass.toString())
    .subscribe(res => {
      console.log(res);
      this.classSubjects = res;
      this.classSubjectsBackup = res;
      this.cd.markForCheck();
    });
  }

  getStudents() {
    this.submitted = true;
    if (this.resultForm.invalid) {
        this.cd.markForCheck();
        return;
    }
    this.sch.getStudents(this.currentClass.toString())
      .subscribe(res => {
        this.studentlist = res;
        this.getResultsByClass();
        this.getCaSetupByClass();
        this.submitted = true;
        this.cd.markForCheck();
      })
  }

  getResultsByClass() {
    this.sch.getWeeklyResultsByClass(this.currentClass.toString(), this.currentSessionId.toString(), this.currentTerm, this.selectedWeek.toString(), this.currentSubjectId.toString())
      .subscribe(res => {
        this.resultlist = res;
        this.bigboss = [];
      })
  }

  getCaSetupByClass() {
    this.sch.getCaSetupByClass(this.currentClass.toString(), this.currentSessionId.toString(), this.currentTerm)
    .subscribe(res => {
      this.caSetupData = res.systemname;
      this.caScoreData = res.score;
    });
  }

  getGradeScale(value: string) {
    this.currentClass = Number(value);
    this.getClassSubjects();
    let currentLevel = this.schoolClasses.filter(t => t.id == this.currentClass)[0];
    let currentLevelId = currentLevel.classLevelId;
    this.sch.getGradeScaleByCategory(currentLevelId)
    .subscribe(res => {
      this.gradeScaleList = res;
      this.cd.markForCheck();
    });
  }

  // setPlacement(classId: string, studentId: number, index: number) {
  //   this.bigboss.push({studentId: studentId, classId: classId});
  // }

  setCa(studentId: number, ca: HTMLInputElement, key: string) {
    debugger;
    let newResult;
    let oldResult;
    if (!(/^\d+\.(0)?$/.test(ca.value))) {
    if (this.bigboss.filter(t => t.studentId == Number(studentId)).length > 0) {
      newResult = this.bigboss.filter(t => t.studentId == Number(studentId))[0];
      oldResult = this.resultlist.filter(t => t.studentId == Number(studentId))[0];
      
      let caValue = this.clearInput(Number(ca.value), this.resultlist[this.resultlist.findIndex(t => t.studentId == Number(studentId))][key.toUpperCase()]);
      ca.value = caValue.toString();
      newResult[key] = caValue;

      newResult['totalScore'] = Number(newResult['Exam'] ?? this.checkCA(oldResult.exam));
      let gradeobj = this.calGrade(newResult['totalScore']);
      newResult['grade'] = gradeobj.grade;
      newResult['remark'] = gradeobj.remark;
      this.resultlist[this.resultlist.findIndex(t => t.studentId == Number(studentId))].totalScore = newResult['totalScore'];
      this.resultlist[this.resultlist.findIndex(t => t.studentId == Number(studentId))].grade = newResult['grade'];
      this.resultlist[this.resultlist.findIndex(t => t.studentId == Number(studentId))].remark = newResult['remark'];
      this.bigboss[this.bigboss.findIndex(t => t.studentId == Number(studentId))] = newResult;
    } else {
      newResult = new Result();
      oldResult = this.resultlist.filter(t => t.studentId == Number(studentId))[0];
      newResult.studentId = studentId;

      let caValue = this.clearInput(Number(ca.value), this.resultlist[this.resultlist.findIndex(t => t.studentId == Number(studentId))][key.toUpperCase()]);
      ca.value = caValue.toString();
      newResult[key] = caValue;
      
      newResult['totalScore'] = Number(newResult['Exam'] ?? this.checkCA(oldResult.exam));
      let gradeobj = this.calGrade(newResult['totalScore']);
      newResult['grade'] = gradeobj.grade;
      newResult['remark'] = gradeobj.remark;
      this.resultlist[this.resultlist.findIndex(t => t.studentId == Number(studentId))].totalScore = newResult['totalScore'];
      this.resultlist[this.resultlist.findIndex(t => t.studentId == Number(studentId))].grade = newResult['grade'];
      this.resultlist[this.resultlist.findIndex(t => t.studentId == Number(studentId))].remark = newResult['remark'];
      this.bigboss.push(newResult);
    }
  }
    console.log(this.bigboss);
  }

  checkCA(ca: number) {
    return ca ? ca : 0
  }

  calGrade(value: number) {
    let sa;
    this.gradeScaleList.forEach(ele => {
      if (value >= ele.begLimit && value <= ele.endLimit) {
        sa = {grade: ele.grade, remark: ele.remarks};
      }
    });
    return sa ? sa : {grade: 'i', remark: 'Not Aplicable'};
  }


  validateSaveEntry() {
    let mysubject = this.classSubjects.filter(a => a.id == this.currentSubjectId)[0]?.subjects;
    let myclass = this.schoolClasses.filter(a => a.id == this.currentClass)[0]?.class;
    Swal.fire({
      title: "Do you want permanently save student exam records for this class?",
      html: `<p style="font-size: 20px"><b>Subject: </b> ${mysubject}</p> <p style="font-size: 20px"><b>Class: </b> ${myclass}</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Save"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.saveResultEntry();
      }
    });
  }


  saveResultEntry() {
    this.submitted = true;
    if (this.resultForm.invalid) {
      this.cd.markForCheck();
      return;
    }
    if (this.resultlist.length < 1) {
      this.cd.markForCheck();
      return;
    }

    let className = this.schoolClasses.filter(t => t.id == this.currentClass)[0].class;
    Swal.fire({
      title: 'Processing Data...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
        Swal.showLoading();
        this.sch.saveWeekResultEntry(this.bigboss, this.currentSessionId.toString(), this.selectedWeek.toString(), this.currentTerm, this.currentSubjectId.toString(), this.currentClass.toString(), className)
          .pipe(takeUntil(this.destroy))
          .subscribe(res => {
            Swal.close();
            if (this.schoolId == 520) {
              this.sch.updateWeeklyTestLouisville(this.bigboss, this.currentSessionId.toString(), this.selectedWeek.toString(), this.currentTerm, this.currentSubjectId.toString(), this.currentClass.toString(), className)
                .pipe(takeUntil(this.destroy))
                .subscribe(res => {
                  Swal.close();
                });
            } else {
              Swal.close();
            }
          });
      }
    }).then(x => {
      //this.getStudentsPsycomotor();
      Swal.fire({
        icon: 'success',
        title: 'Result Entry updated successfully!.',
        showConfirmButton: false,
        timer: 2000
      });
    })
  }

  clearInput(value: number, initvalue: number) {
      if(value > 100) {
        alert('Value entered is greater than CA Maximum Score of ' + 100);
        return initvalue? Number(initvalue) : 0;
      } else {
        return Number(value);
      }
  }

  upInputToMax(max: number, value: number) {

      if (max) {
        if(value > max) {
          return max;
        } else {
          return Number(value);
        }
      } 
      return Number(value);
    }
 


  downloadTemplate() {
    let objlist = [];
    for (let i = 0; i < this.resultlist.length; i++) {
      let obj = new Object() as any;
      obj.sn = i + 1;
      obj.studentId = this.resultlist[i].studentId;
      obj.admissionNo = this.resultlist[i].admissionNo;
      obj.studentName = this.resultlist[i].studentName;
      for (const [key, value] of Object.entries(this.caSetupData)) {
        obj[key + ' [' + value as string + ']'] = '';
      }
      objlist.push(obj);
    }

    console.log(objlist);


    const worksheet = XLSX.utils.json_to_sheet(objlist);
    const colName = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K1', 'L1', 'M1', 'N1', 'O1', 'P1', 'Q1', 'R1', 'S1', 'T1'];
    for (let itm of colName) {
      if (worksheet[itm]) {
        worksheet[itm].s = {
          font: { color: { rgb: "000000" }, bold: true }
        }
      }
    }


    var wscols = [
      { wch: 4 },
      { wch: 10 },
      { wch: 20 },
      { wch: 35 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
    ];

    worksheet['!cols'] = wscols;

    let mysubject = this.classSubjects.filter(a => a.id == this.currentSubjectId)[0]?.subjects;
    let myclass = this.schoolClasses.filter(a => a.id == this.currentClass)[0]?.class;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, mysubject + "__" + myclass + "__" + "Entry");
    XLSX.writeFile(workbook, this.auth.currentUserValue.schoolName + "__" + "Result Entry.xlsx", { compression: true });

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
          let rowObject = XLSX2.utils.sheet_to_row_object_array(
            workbook.Sheets[sheet]
          );
          this.excelObj = rowObject;
          
          console.log(rowObject);
          // this.columnArray =  Object.keys(rowObject[0]);
          // //var daye = this.getJsDateFromExcel(42216).toJSON();
          // this.excelData = this.transformDate(rowObject);
          // //let jsonObject = JSON.stringify(rowObject);
          // //document.getElementById("jsonData").innerHTML = jsonObject;
          // console.log(this.excelData);
        });
      };
      
      fileReader.readAsBinaryString(file);
      let ree = fileReader;
    }
  }

  populateFromFile() {
    //let oblist = [];
    for (let i = 0; i < this.excelObj.length; i++) {
      let totalScore = 0;
      let istotal = 0;
      let newResult = new Result();
      newResult.studentId = this.excelObj[i].studentId;
      //let obj = new Object() as any;
      //obj.sn = i + 1;
      //debugger;
      // this.resultlist[this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId)].studentId = this.excelObj[i].studentId;
      // this.resultlist[this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId)].admissionNo = this.excelObj[i].admissionNo;
      // obj.studentName = this.excelObj[i].studentName;
      for (const [key, value] of Object.entries(this.excelObj[i])) {
        if (key.substring(0, 3) == 'CA1') {
          if (value != "") {
            istotal = 1;
            totalScore = totalScore + this.upInputToMax(this.caScoreData['CA1'], Number(value));
            newResult['ca1'] = this.upInputToMax(this.caScoreData['CA1'], Number(value));
            this.resultlist[this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId)].ca1 = this.upInputToMax(this.caScoreData['CA1'], Number(value));
          }
        }
        if (key.substring(0, 3) == 'CA2') {
          if (value != "") {
            istotal = 1;
            totalScore = totalScore + this.upInputToMax(this.caScoreData['CA2'], Number(value));
            newResult['ca2'] = this.upInputToMax(this.caScoreData['CA2'], Number(value));
            this.resultlist[this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId)].ca2 = this.upInputToMax(this.caScoreData['CA2'], Number(value));
          }
        }
        if (key.substring(0, 3) == 'CA3') {
          if (value != "") {
            istotal = 1;
              totalScore = totalScore + this.upInputToMax(this.caScoreData['CA3'], Number(value));
              newResult['ca3'] = this.upInputToMax(this.caScoreData['CA3'], Number(value));
              this.resultlist[this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId)].ca3 = this.upInputToMax(this.caScoreData['CA3'], Number(value));
          }
        }
        if (key.substring(0, 3) == 'CA4') {
          if (value != "") {
            istotal = 1;
            totalScore = totalScore + this.upInputToMax(this.caScoreData['CA4'], Number(value));
            newResult['ca4'] = this.upInputToMax(this.caScoreData['CA4'], Number(value));
            this.resultlist[this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId)].ca4 = this.upInputToMax(this.caScoreData['CA4'], Number(value));
          }
        }
        if (key.substring(0, 3) == 'CA5') {
          if (value != "") {
            istotal = 1;
          totalScore = totalScore + this.upInputToMax(this.caScoreData['CA5'], Number(value));
          newResult['ca5'] = this.upInputToMax(this.caScoreData['CA5'], Number(value));
          this.resultlist[this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId)].ca5 = this.upInputToMax(this.caScoreData['CA5'], Number(value));
          }
        }

        if (key.substring(0, 3) == 'CA6') {
          if (value != "") {
            istotal = 1;
          totalScore = totalScore + this.upInputToMax(this.caScoreData['CA6'], Number(value));
          newResult['ca6'] = this.upInputToMax(this.caScoreData['CA6'], Number(value));
          this.resultlist[this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId)].ca6 = this.upInputToMax(this.caScoreData['CA6'], Number(value));
          }
        }
        if (key.substring(0, 3) == 'CA7') {
          if (value != "") {
            istotal = 1;
          totalScore = totalScore + this.upInputToMax(this.caScoreData['CA7'], Number(value));
          newResult['ca7'] = this.upInputToMax(this.caScoreData['CA7'], Number(value));
          this.resultlist[this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId)].ca7 = this.upInputToMax(this.caScoreData['CA7'], Number(value));
          }
        }
        if (key.substring(0, 3) == 'CA8') {
          if (value != "") {
            istotal = 1;
          totalScore = totalScore + this.upInputToMax(this.caScoreData['CA8'], Number(value));
          newResult['ca8'] = this.upInputToMax(this.caScoreData['CA8'], Number(value));
          this.resultlist[this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId)].ca8 = this.upInputToMax(this.caScoreData['CA8'], Number(value));
          }
        }
        if (key.substring(0, 3) == 'CA9') {
          if (value != "") {
            istotal = 1;
          totalScore = totalScore + this.upInputToMax(this.caScoreData['CA9'], Number(value));
          newResult['ca9'] = this.upInputToMax(this.caScoreData['CA9'], Number(value));
          this.resultlist[this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId)].ca9 = this.upInputToMax(this.caScoreData['CA9'], Number(value));
          }
        }
        if (key.substring(0, 4) == 'CA10') {
          if (value != "") {
            istotal = 1;
          totalScore = totalScore + this.upInputToMax(this.caScoreData['CA10'], Number(value));
          newResult['ca10'] = this.upInputToMax(this.caScoreData['CA10'], Number(value));
          this.resultlist[this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId)].ca10 = this.upInputToMax(this.caScoreData['CA10'], Number(value));
          }
        }
        if (key.substring(0, 4) == 'CA11') {
          if (value != "") {
            istotal = 1;
          totalScore = totalScore + this.upInputToMax(this.caScoreData['CA11'], Number(value));
          newResult['ca11'] = this.upInputToMax(this.caScoreData['CA11'], Number(value));
          this.resultlist[this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId)].ca11 = this.upInputToMax(this.caScoreData['CA11'], Number(value));
          }
        }
        if (key.substring(0, 4) == 'CA12') {
          if (value != "") {
            istotal = 1;
          totalScore = totalScore + this.upInputToMax(this.caScoreData['CA12'], Number(value));
          newResult['ca12'] = this.upInputToMax(this.caScoreData['CA12'], Number(value));
          this.resultlist[this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId)].ca12 = this.upInputToMax(this.caScoreData['CA12'], Number(value));
          }
        }
        if (key.substring(0, 4) == 'CA13') {
          if (value != "") {
            istotal = 1;
          totalScore = totalScore + this.upInputToMax(this.caScoreData['CA13'], Number(value));
          newResult['ca13'] = this.upInputToMax(this.caScoreData['CA13'], Number(value));
          this.resultlist[this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId)].ca13 = this.upInputToMax(this.caScoreData['CA13'], Number(value));
          }
        }
        if (key.substring(0, 4) == 'CA14') {
          if (value != "") {
            istotal = 1;
          totalScore = totalScore + this.upInputToMax(this.caScoreData['CA14'], Number(value));
          newResult['ca14'] = this.upInputToMax(this.caScoreData['CA14'], Number(value));
          this.resultlist[this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId)].ca14 = this.upInputToMax(this.caScoreData['CA14'], Number(value));
          }
        }
        if (key.substring(0, 4) == 'CA15') {
          if (value != "") {
            istotal = 1;
          totalScore = totalScore + this.upInputToMax(this.caScoreData['CA15'], Number(value));
          newResult['ca15'] = this.upInputToMax(this.caScoreData['CA15'], Number(value));
          this.resultlist[this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId)].ca15 = this.upInputToMax(this.caScoreData['CA15'], Number(value));
          }
        }
        if (key.substring(0, 4) == 'Exam') {
          if (value != "") {
            istotal = 1;
          totalScore = totalScore + this.upInputToMax(this.caScoreData['Exam'], Number(value));
          newResult['exam'] = this.upInputToMax(this.caScoreData['Exam'], Number(value));
          this.resultlist[this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId)].exam = this.upInputToMax(this.caScoreData['Exam'], Number(value));
          }
        }
      }
      
      if (istotal == 1) {
        this.resultlist[this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId)].totalScore = totalScore;
        this.resultlist[this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId)].grade = this.calGrade(totalScore).grade;
        this.resultlist[this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId)].remark = this.calGrade(totalScore).remark;
        newResult['totalScore'] = totalScore;
        newResult['grade'] = this.calGrade(totalScore).grade;
        newResult['remark'] = this.calGrade(totalScore).remark;
        this.bigboss.push(newResult);
      }
      
      
      // oblist.push(obj);
    }
  }

}
