import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService, UserData } from '../../services';
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
  templateUrl: './result-entry.component.html',
  styleUrls: ['result.component.css']
})
export class ResultEntryComponent implements OnInit {
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
  shouldOverride = 'FALSE';

  constructor( 
    private router: Router,
    private auth: AuthenticationService,
    private sch: SchoolService,
    private userdata: UserData,
    private gen: GenericService,
    private cd: ChangeDetectorRef
    ) {
      this.genk = gen;
      this.userName = auth.currentUserValue.name;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = auth.currentUserValue.status;
}

ngOnInit(): void {
  this.genk.topdata = 'Result Entry';
  this.resultForm = new FormGroup({
      'term': new FormControl(this.currentTerm, [Validators.required]),
      'sessionId': new FormControl(this.currentSessionId, [Validators.required]),
      'subjectId': new FormControl(this.currentSubjectId, [Validators.required]),
      'classId': new FormControl(this.currentClass, [Validators.required]),
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
    if (this.resultForm.invalid) {
        this.cd.markForCheck();
        return;
    }
    this.userdata.loadingOnly();
    this.sch.getStudents(this.currentClass.toString())
      .subscribe(res => {
        this.studentlist = res;
        this.getResultsByClass();
        this.getCaSetupByClass();
        this.cd.markForCheck();
      })
  }

  getResultsByClass() {
    this.sch.getResultEntryData(this.currentClass.toString(), this.currentSessionId.toString(), this.currentTerm, this.currentSubjectId.toString())
      .subscribe(res => {
        
        this.resultlist = res;
        this.userdata.togLoadingOnly();
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

  setCa(studentId: number, ca: HTMLInputElement, key: string, event?: KeyboardEvent) {
    debugger;
    if (event.key === 'ArrowRight') {
      const currentInput = event.target as HTMLInputElement;
      if (currentInput.selectionStart === currentInput.value.length) {
        const match = currentInput.id.toString().match(/(\d+)(inp)(\d+)/);
        let before = match[1];  // Number before 'inp'
        let middle = match[2];  // 'inp'
        let aft = match[3];
        let after = parseInt(match[3], 10) + 1; // Increment thee number after 'inp'
    
        let nextInp = before + middle + after; // Reconstruct the string

        if (Number(aft) < 15) {
          const nextInput = document.getElementById(nextInp) as HTMLInputElement;
          if (nextInput && nextInput.tagName === 'INPUT') {
            nextInput.focus();
          }
        }
        
        
      }
    }
    let newResult;
    let oldResult;
    if (!(/^\d+\.(0)?$/.test(ca.value))) {
      if (this.bigboss.filter(t => t.studentId == Number(studentId)).length > 0) {
        newResult = this.bigboss.filter(t => t.studentId == Number(studentId))[0];
        oldResult = this.resultlist.filter(t => t.studentId == Number(studentId))[0];
        //let one = this.caScoreData[key.toUpperCase()];
        //let tu = this.resultlist[this.resultlist.findIndex(t => t.studentId == Number(studentId))];
        //let ti = this.clearInput(this.caScoreData[key.toUpperCase()], Number(ca.value), this.resultlist[this.resultlist.findIndex(t => t.studentId == Number(studentId))][key.toUpperCase()]);
        let caValue = this.clearInput(this.caScoreData[key.toUpperCase()], Number(ca.value), this.resultlist[this.resultlist.findIndex(t => t.studentId == Number(studentId))][key.toUpperCase()]);
        ca.value = caValue.toString();
        newResult[key] = caValue;
        newResult['totalScore'] = Number(newResult['ca1'] ?? this.checkCA(oldResult.ca1)) +  Number(newResult['ca2'] ?? this.checkCA(oldResult.ca2)) + 
        Number(newResult['ca3'] ?? this.checkCA(oldResult.ca3)) + Number(newResult['ca4'] ?? this.checkCA(oldResult.ca4)) + Number(newResult['ca5'] ?? this.checkCA(oldResult.ca5)) +
        Number(newResult['ca6'] ?? this.checkCA(oldResult.ca6)) + Number(newResult['ca7'] ?? this.checkCA(oldResult.ca7)) + 
        Number(newResult['ca8'] ?? this.checkCA(oldResult.ca8)) + Number(newResult['ca9'] ?? this.checkCA(oldResult.ca9)) + 
        Number(newResult['ca10'] ?? this.checkCA(oldResult.ca10)) + Number(newResult['ca11'] ?? this.checkCA(oldResult.ca11)) + 
        Number(newResult['ca12'] ?? this.checkCA(oldResult.ca12)) + Number(newResult['ca13'] ?? this.checkCA(oldResult.ca13)) + 
        Number(newResult['ca14'] ?? this.checkCA(oldResult.ca14)) + Number(newResult['ca15'] ?? this.checkCA(oldResult.ca15)) + 
        Number(newResult['exam'] ?? this.checkCA(oldResult.exam));
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
        //let one = this.caScoreData[key.toUpperCase()];
        //let tu = this.resultlist[this.resultlist.findIndex(t => t.studentId == Number(studentId))];
        //let val = tu[key] ? tu[key] : 0;
        //let ti = this.clearInput(this.caScoreData[key.toUpperCase()], Number(ca.value), tu);
        let caValue = this.clearInput(this.caScoreData[key.toUpperCase()], Number(ca.value), this.resultlist[this.resultlist.findIndex(t => t.studentId == Number(studentId))][key.toUpperCase()]);
        ca.value = caValue.toString();
        newResult[key] = caValue;
        
        newResult['totalScore'] = Number(newResult['ca1'] ?? this.checkCA(oldResult.ca1)) +  Number(newResult['ca2'] ?? this.checkCA(oldResult.ca2)) + 
        Number(newResult['ca3'] ?? this.checkCA(oldResult.ca3)) + Number(newResult['ca4'] ?? this.checkCA(oldResult.ca4)) + Number(newResult['ca5'] ?? this.checkCA(oldResult.ca5)) +
        Number(newResult['ca6'] ?? this.checkCA(oldResult.ca6)) + Number(newResult['ca7'] ?? this.checkCA(oldResult.ca7)) + Number(newResult['ca8'] ?? this.checkCA(oldResult.ca8)) + 
        Number(newResult['ca9'] ?? this.checkCA(oldResult.ca9)) + Number(newResult['ca10'] ?? this.checkCA(oldResult.ca10)) + Number(newResult['ca11'] ?? this.checkCA(oldResult.ca11)) + 
        Number(newResult['ca12'] ?? this.checkCA(oldResult.ca12)) + Number(newResult['ca13'] ?? this.checkCA(oldResult.ca13)) + Number(newResult['ca14'] ?? this.checkCA(oldResult.ca14)) + 
        Number(newResult['ca15'] ?? this.checkCA(oldResult.ca15)) + Number(newResult['exam'] ?? this.checkCA(oldResult.exam));
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
      if (result.isConfirmed && this.submitted == false) {
        this.submitted = true;
        this.saveResultEntry();
      }
    });
  }


  saveResultEntry() {
    debugger
    if (this.resultForm.invalid) {
        this.cd.markForCheck();
        return;
    }
    if (this.resultlist.length < 1) {
      this.cd.markForCheck();
      return;
    }
    if (this.verifyExceedingTotalScores(this.bigboss)) {
      Swal.fire({
        icon: 'error',
        title: "A Score exceeded 100!",
        text: 'One of the field has a total score above 100 !.',
      });
      this.submitted = false;
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
    this.sch.saveResultEntry(this.bigboss, this.currentSessionId.toString(), this.currentTerm, this.currentSubjectId.toString(), this.currentClass.toString(), className, this.shouldOverride)
      .pipe(takeUntil(this.destroy))
      .subscribe(res => {
        this.submitted = false;
        this.shouldOverride = 'FALSE';
          Swal.close();
      });}
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

  clearInput(max: number, value: number, initvalue: number) {
    if (max) {
      if(value > max) {
        alert('Value entered is greater than CA Maximum Score of ' + max);
        return initvalue? Number(initvalue) : 0;
      } else {
        return Number(value);
      }
    } 
    return Number(value);
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
    let sheetText = mysubject + "__" + myclass + "__" + "Entry";
    if (sheetText.length > 30) {
      let subt = mysubject?.length - (sheetText.length - 30);
      sheetText = mysubject?.substring(0, subt) + "__" + myclass + "__" + "Entry";
    }
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetText);
    XLSX.writeFile(workbook, this.auth.currentUserValue.schoolName + "__" + myclass + "__" + mysubject + "__" + "Result Entry.xlsx", { compression: true });
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
          //this.populateFromFile();
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
    // const bottomHalf = (this.excelObj as any[]).slice(-6); // Get the bottom half
    // this.excelObj = bottomHalf.slice(0, 10);
    this.resultlist = this.resultlist.map(({ studentName, admissionNo, studentId, schoolId, id }) => ({
      studentName,
      admissionNo,
      studentId,
      schoolId,
      id
  }));

    
    for (let i = 0; i < this.excelObj.length; i++) {
      let totalScore = 0;
      let istotal = 0;
      let newResult = new Result();
      newResult.studentId = this.excelObj[i]?.studentId;
      //let obj = new Object() as any;
      //obj.sn = i + 1;
      //debugger;
      // this.resultlist[this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId)].studentId = this.excelObj[i].studentId;
      // this.resultlist[this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId)].admissionNo = this.excelObj[i].admissionNo;
      // obj.studentName = this.excelObj[i].studentName;
      for (const [key, value] of Object.entries(this.excelObj[i])) {
        if (value) {
          let myindex = this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId);
          if (key.substring(0, 3) == 'CA1') {
            if (value != "") {
              istotal = 1;
              totalScore = totalScore + this.upInputToMax(this.caScoreData['CA1'], Number(value));
              newResult['ca1'] = this.upInputToMax(this.caScoreData['CA1'], Number(value));
              
              if (myindex != -1) {
                this.resultlist[myindex].ca1 = this.upInputToMax(this.caScoreData['CA1'], Number(value));
              }
            }
          }
          if (key.substring(0, 3) == 'CA2') {
            if (value != "") {
              istotal = 1;
              totalScore = totalScore + this.upInputToMax(this.caScoreData['CA2'], Number(value));
              newResult['ca2'] = this.upInputToMax(this.caScoreData['CA2'], Number(value));
              if (myindex != -1) {
                this.resultlist[myindex].ca2 = this.upInputToMax(this.caScoreData['CA2'], Number(value));
              }
            }
          }
          if (key.substring(0, 3) == 'CA3') {
            if (value != "") {
              istotal = 1;
                totalScore = totalScore + this.upInputToMax(this.caScoreData['CA3'], Number(value));
                newResult['ca3'] = this.upInputToMax(this.caScoreData['CA3'], Number(value));
                if (myindex != -1) {
                  this.resultlist[myindex].ca3 = this.upInputToMax(this.caScoreData['CA3'], Number(value));
                }
                
            }
          }
          if (key.substring(0, 3) == 'CA4') {
            if (value != "") {
              istotal = 1;
              totalScore = totalScore + this.upInputToMax(this.caScoreData['CA4'], Number(value));
              newResult['ca4'] = this.upInputToMax(this.caScoreData['CA4'], Number(value));
              if (myindex != -1) {
                this.resultlist[myindex].ca4 = this.upInputToMax(this.caScoreData['CA4'], Number(value));
              }
              
            }
          }
          if (key.substring(0, 3) == 'CA5') {
            if (value != "") {
              istotal = 1;
            totalScore = totalScore + this.upInputToMax(this.caScoreData['CA5'], Number(value));
            newResult['ca5'] = this.upInputToMax(this.caScoreData['CA5'], Number(value));
            if (myindex != -1) {
              this.resultlist[myindex].ca5 = this.upInputToMax(this.caScoreData['CA5'], Number(value));
            }
            
            }
          }
  
          if (key.substring(0, 3) == 'CA6') {
            if (value != "") {
              istotal = 1;
            totalScore = totalScore + this.upInputToMax(this.caScoreData['CA6'], Number(value));
            newResult['ca6'] = this.upInputToMax(this.caScoreData['CA6'], Number(value));
            if (myindex != -1) {
              this.resultlist[myindex].ca6 = this.upInputToMax(this.caScoreData['CA6'], Number(value));
            }
            
            }
          }
          if (key.substring(0, 3) == 'CA7') {
            if (value != "") {
              istotal = 1;
            totalScore = totalScore + this.upInputToMax(this.caScoreData['CA7'], Number(value));
            newResult['ca7'] = this.upInputToMax(this.caScoreData['CA7'], Number(value));
            if (myindex != -1) {
              this.resultlist[myindex].ca7 = this.upInputToMax(this.caScoreData['CA7'], Number(value));
            }
            
            }
          }
          if (key.substring(0, 3) == 'CA8') {
            if (value != "") {
              istotal = 1;
            totalScore = totalScore + this.upInputToMax(this.caScoreData['CA8'], Number(value));
            newResult['ca8'] = this.upInputToMax(this.caScoreData['CA8'], Number(value));
            if (myindex != -1) {
              this.resultlist[myindex].ca8 = this.upInputToMax(this.caScoreData['CA8'], Number(value));
            }
            
            }
          }
          if (key.substring(0, 3) == 'CA9') {
            if (value != "") {
              istotal = 1;
            totalScore = totalScore + this.upInputToMax(this.caScoreData['CA9'], Number(value));
            newResult['ca9'] = this.upInputToMax(this.caScoreData['CA9'], Number(value));
            if (myindex != -1) {
              this.resultlist[myindex].ca9 = this.upInputToMax(this.caScoreData['CA9'], Number(value));
            }
            
            }
          }
          if (key.substring(0, 4) == 'CA10') {
            if (value != "") {
              istotal = 1;
            totalScore = totalScore + this.upInputToMax(this.caScoreData['CA10'], Number(value));
            newResult['ca10'] = this.upInputToMax(this.caScoreData['CA10'], Number(value));
            if (myindex != -1) {
              this.resultlist[myindex].ca10 = this.upInputToMax(this.caScoreData['CA10'], Number(value));
            }
            
            }
          }
          if (key.substring(0, 4) == 'CA11') {
            if (value != "") {
              istotal = 1;
            totalScore = totalScore + this.upInputToMax(this.caScoreData['CA11'], Number(value));
            newResult['ca11'] = this.upInputToMax(this.caScoreData['CA11'], Number(value));
            if (myindex != -1) {
              this.resultlist[myindex].ca11 = this.upInputToMax(this.caScoreData['CA11'], Number(value));
            }
            
            }
          }
          if (key.substring(0, 4) == 'CA12') {
            if (value != "") {
              istotal = 1;
            totalScore = totalScore + this.upInputToMax(this.caScoreData['CA12'], Number(value));
            newResult['ca12'] = this.upInputToMax(this.caScoreData['CA12'], Number(value));
            if (myindex != -1) {
              this.resultlist[myindex].ca12 = this.upInputToMax(this.caScoreData['CA12'], Number(value));
            }
            
            }
          }
          if (key.substring(0, 4) == 'CA13') {
            if (value != "") {
              istotal = 1;
            totalScore = totalScore + this.upInputToMax(this.caScoreData['CA13'], Number(value));
            newResult['ca13'] = this.upInputToMax(this.caScoreData['CA13'], Number(value));
            if (myindex != -1) {
              this.resultlist[myindex].ca13 = this.upInputToMax(this.caScoreData['CA13'], Number(value));
            }
            
            }
          }
          if (key.substring(0, 4) == 'CA14') {
            if (value != "") {
              istotal = 1;
            totalScore = totalScore + this.upInputToMax(this.caScoreData['CA14'], Number(value));
            newResult['ca14'] = this.upInputToMax(this.caScoreData['CA14'], Number(value));
            if (myindex != -1) {
              this.resultlist[myindex].ca14 = this.upInputToMax(this.caScoreData['CA14'], Number(value));
            }
            
            }
          }
          if (key.substring(0, 4) == 'CA15') {
            if (value != "") {
              istotal = 1;
            totalScore = totalScore + this.upInputToMax(this.caScoreData['CA15'], Number(value));
            newResult['ca15'] = this.upInputToMax(this.caScoreData['CA15'], Number(value));
            if (myindex != -1) {
              this.resultlist[myindex].ca15 = this.upInputToMax(this.caScoreData['CA15'], Number(value));
            }
            
            }
          }
          if (key.substring(0, 4) == 'Exam') {
            if (value != "") {
              istotal = 1;
            // totalScore = totalScore + this.upInputToMax(this.caScoreData['Exam'], Number(value));
            // newResult['exam'] = this.upInputToMax(this.caScoreData['Exam'], Number(value));
            // if (myindex != -1) {
            //   this.resultlist[myindex].exam = this.upInputToMax(this.caScoreData['Exam'], Number(value));
            // }
            totalScore = totalScore + Number(value);
            newResult['exam'] = Number(value);
            if (myindex != -1) {
              this.resultlist[myindex].exam = Number(value);
            }
            
            }
          }
        }


        if (istotal == 1) {
          let mylastindex = this.resultlist.findIndex(t => t.studentId == this.excelObj[i].studentId);
         

          if (mylastindex != -1) {
            newResult['totalScore'] = Number(newResult['ca1'] ?? this.checkCA(this.resultlist[mylastindex].ca1)) +  Number(newResult['ca2'] ?? this.checkCA(this.resultlist[mylastindex].ca2)) + 
            Number(newResult['ca3'] ?? this.checkCA(this.resultlist[mylastindex].ca3)) + Number(newResult['ca4'] ?? this.checkCA(this.resultlist[mylastindex].ca4)) + Number(newResult['ca5'] ?? this.checkCA(this.resultlist[mylastindex].ca5)) +
            Number(newResult['ca6'] ?? this.checkCA(this.resultlist[mylastindex].ca6)) + Number(newResult['ca7'] ?? this.checkCA(this.resultlist[mylastindex].ca7)) + Number(newResult['ca8'] ?? this.checkCA(this.resultlist[mylastindex].ca8)) + 
            Number(newResult['ca9'] ?? this.checkCA(this.resultlist[mylastindex].ca9)) + Number(newResult['ca10'] ?? this.checkCA(this.resultlist[mylastindex].ca10)) + Number(newResult['ca11'] ?? this.checkCA(this.resultlist[mylastindex].ca11)) + 
            Number(newResult['ca12'] ?? this.checkCA(this.resultlist[mylastindex].ca12)) + Number(newResult['ca13'] ?? this.checkCA(this.resultlist[mylastindex].ca13)) + Number(newResult['ca14'] ?? this.checkCA(this.resultlist[mylastindex].ca14)) + 
            Number(newResult['ca15'] ?? this.checkCA(this.resultlist[mylastindex].ca15)) + Number(newResult['exam'] ?? this.checkCA(this.resultlist[mylastindex].exam));
            
            this.resultlist[mylastindex].totalScore = Number(newResult['totalScore']);
            this.resultlist[mylastindex].grade = this.calGrade(Number(newResult['totalScore'])).grade;
            this.resultlist[mylastindex].remark = this.calGrade(Number(newResult['totalScore'])).remark;
            //newResult['totalScore'] = totalScore;
            newResult['grade'] = this.calGrade(Number(newResult['totalScore'])).grade;
            newResult['remark'] = this.calGrade(Number(newResult['totalScore'])).remark;
            
          }
        }
      }
      this.bigboss.push(newResult);
      this.shouldOverride = 'TRUE';
    }
  }


  verifyExceedingTotalScores(students: any[]) {
    students.forEach(student => {
        // Sum up all CA values and exam, defaulting to 0, if any value is missing
        let studentindex = this.resultlist.findIndex(t => t.studentId == student.studentId);
        const ca1 = student?.ca1 ?? this.checkCA(this.resultlist[studentindex]?.ca1);
        const ca2 = student?.ca2 ?? this.checkCA(this.resultlist[studentindex]?.ca2);
        const ca3 = student?.ca3 ?? this.checkCA(this.resultlist[studentindex]?.ca3);
        const ca4 = student?.ca4 ?? this.checkCA(this.resultlist[studentindex]?.ca4);
        const ca5 = student?.ca5 ?? this.checkCA(this.resultlist[studentindex]?.ca5);
        const ca6 = student?.ca6 ?? this.checkCA(this.resultlist[studentindex]?.ca6);
        const ca7 = student?.ca7 ?? this.checkCA(this.resultlist[studentindex]?.ca7);
        const ca8 = student?.ca8 ?? this.checkCA(this.resultlist[studentindex]?.ca8);
        const ca9 = student?.ca9 ?? this.checkCA(this.resultlist[studentindex]?.ca9);
        const ca10 = student?.ca10 ?? this.checkCA(this.resultlist[studentindex]?.ca10);
        const ca11 = student?.ca11 ?? this.checkCA(this.resultlist[studentindex]?.ca11);
        const ca12 = student?.ca12 ?? this.checkCA(this.resultlist[studentindex]?.ca12);
        const ca13 = student?.ca13 ?? this.checkCA(this.resultlist[studentindex]?.ca13);
        const ca14 = student?.ca14 ?? this.checkCA(this.resultlist[studentindex]?.ca14);
        const ca15 = student?.ca15 ?? this.checkCA(this.resultlist[studentindex]?.ca15);
        const exam = student?.exam ?? this.checkCA(this.resultlist[studentindex]?.exam);

        // Calculate totalScore
        student.totalScore = ca1 + ca2 + ca3 + ca4 + ca5 + ca6 + ca7 + ca8 + ca9 + ca10 + ca11 + ca12 + ca13 + ca14 + ca15 + exam;
    });

    if (students.filter(t => t.totalScore > 100).length > 0) {
      return true;
    } else {
      return false;
    }
}

}
