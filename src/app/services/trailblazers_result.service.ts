import { Component, Inject, Injectable, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jspdf, { jsPDF } from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import { Chart } from 'chart.js/auto';
import { GenericService } from './generic.service';
import { ResultService } from './result.service';
import { AuthenticationService } from './authentication.service';
import { SchoolService } from './school.service';
import Swal from 'sweetalert2';
//import html2canvas from 'html2canvas';

@Injectable({ providedIn: 'root' })
export class TrailblazersResultService {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  myschool: any;
  studentId: string;
  studentobj: any;
  studentTotal: number;
  noInClass: number;
  resultlist = [];
  gradeScalelist = [];
  psycomotorlist = [];
  psycomotorlist2 = [];
  grademinimumlist = [];
  grademinimumlistOver60 = [];
  grademinimumlistOver40 = [];
  mySchoolClasses = [];
  caSetupData: any;
  caSetupScoreData: any;
  currentClassId: string;
  currentSessionId: string;
  currentSession: string;
  currentTerm: string;
  // docimg: any;
  // signatureimg: any;
  average: string;
  position: string;
  resultComment: any;
  gradescaletextlist: string[] = [];
  nextResumptionDate: string;
  className: string;
  result_service: ResultService
  logoLoaded = false;
  subjectOffered = 0;
  markObtainable = 0;
  classAverage: string;
  displayValue = 'hidden';
  chartAverageScore = [];
  chartLowestScore = [];
  chartHighestScore = [];
  chartTotalScore = [];
  chartSubjects = [];
  bmi: any;
  estAttendance: any;
  house: any;
  mychart: HTMLCanvasElement;
  mychartdiv: HTMLDivElement;
  formTeach: any;
  studentCat: string;
   
  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private activeRoute: ActivatedRoute,
    private sch: SchoolService,
    private gen: GenericService,
    private resultService: ResultService
  ) {
    this.genk = gen;
    this.userName = auth.currentUserValue.name;
    this.userImgPath = auth.currentUserValue.logo;
    this.adminStatus = auth.currentUserValue.status;
  }

  createResult(id, term, currentSessionId, currentSession, classId, average, classAverage, position) {
    this.genk.topdata = 'Dashboard';
    this.studentId = id;
    this.currentTerm = term;
    this.currentSessionId = currentSessionId;
    this.currentSession = currentSession;
    this.currentClassId = classId;
    this.average = average;
    this.position = position;
    this.classAverage = classAverage;


    
    this.getStudent();
    this.getStudentTotal();
    //this.getNoInClass();
    this.getClassNames();
    this.getFormTeacher();
    this.getResultsByStudent();
    this.getCaSetupByClass();
    this.getGradeScaleByClass();
    this.getPsycomotorByStudent();
    this.getStudentResultComment();
    this.getStudentBMI();
    this.getStudentEstimatedAttendance();
    this.getStudentHouse();
    this.getNextTerm();
  }

  loadPdfChart(id, term, currentSessionId, currentSession, classId, average, classAverage, mychart: HTMLCanvasElement, mychartdiv: HTMLDivElement) {
    this.genk.topdata = 'Dashboard';
    this.studentId = id;
    this.currentTerm = term;
    this.currentSessionId = currentSessionId;
    this.currentSession = currentSession;
    this.currentClassId = classId;
    this.average = average;
    //this.position = position;
    this.classAverage = classAverage;
    this.mychart = mychart;
    this.mychartdiv = mychartdiv;


    
    this.getStudent();
    this.getStudentTotal();
    //this.getNoInClass();
    this.getClassNames();
    //this.getResultsByStudentPerformanceAnalysis();
    this.getCaSetupByClass();
    this.getGradeScaleByClass();
    this.getStudentResultComment();

  }

  setImg(imgpath) {
    if (imgpath && imgpath.length > 0) {
      return this.genk.imgurl + imgpath;
    } else {
      return this.genk.defaultImg;
    }
  }

//   getSchool() {
//     this.sch.getSchoolData()
//       .subscribe(res => {
//         this.myschool = res;
//       })
//   }

getSchool() {
    this.sch.getSchoolData()
        .subscribe(res => {
            this.myschool = res;
            Swal.fire({
                title: 'Downloading Result...',
                allowEscapeKey: false,
                allowOutsideClick: false,
                //timer: 2000,
                didOpen: async () => {
                    Swal.showLoading();

                    debugger
                    await this.addLogo();
                    await this.addSignature();
                    

                    const interval = setInterval(() => {
                        //if (this.genk.logoString && this.resultlist.length > 0 && this.genk.signatureString && this.genk.photoString) {
                            clearInterval(interval);
                            clearTimeout(timeout); // Stop checking once the condition is met
                            this.convertToPDF(); // Call the desired function
                            Swal.close();
                        //}
                    }, 500);

                    const timeout = setTimeout(() => {
                        clearInterval(interval); // Stop the interval
                        Swal.close();
                        Swal.fire({
                            icon: 'error',
                            title: 'Failed to download result!',
                            showConfirmButton: false,
                            timer: 2000
                        });
                    }, 240000);
                }
            })
        })
}



  getClassNames() {
    this.sch.getClassNames()
    .subscribe(res => {
      this.mySchoolClasses = res;
      this.getNoInClass()
    });
  }

//   getStudent() {
//     this.sch.getStudentById(this.studentId.toString())
//       .subscribe(async res => {
//         this.studentobj = res;
//       })
//   }

  getStudent() {
    this.sch.getStudentAndCatById(this.studentId.toString())
      .subscribe(async res => {
        this.studentobj = res.student;
        let level = res.category;
        if (level == 'SENIOR' || level == 'JUNIOR') {
          this.studentCat = 'STUDENT';
        } else {
          this.studentCat = 'PUPIL';
        }
      })
  }

  getFormTeacher() {
    this.sch.getFormTeacher(this.currentClassId)
      .subscribe(res => {
        if (res?.name) {
          this.formTeach = res?.name;
        } else {
          this.formTeach = '';
        }
      })
  }

  getStudentTotal() {
    this.sch.getStudentTermTotal(this.currentSessionId.toString(), this.currentTerm, this.studentId)
      .subscribe(res => {
        this.studentTotal = res.total;
      })
  }

  getNoInClass() {
    this.sch.getNoInClassBySession(this.currentClassId.toString(), this.currentSessionId, this.currentTerm)
      .subscribe(res => {
        this.noInClass = res.count;
        this.className = this.mySchoolClasses.filter(t => t.id == Number(this.currentClassId))[0].class;
      })
  }

  getNextTerm() {
    this.sch.getNextTerm(this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        if (res) {
          this.nextResumptionDate = res.date;
        }
      })
  }

  // getStudents() {
  //   this.sch.getStudents(this.currentClass)
  //     .subscribe(res => {
  //       this.studentlist = res;
  //       this.getResultsByClass();
  //       this.getCaSetupByClass();
  //       this.cd.markForCheck();
  //     })
  // }

    getResultsByStudent() {
        Swal.fire({
            title: 'Loading Result....',
            allowEscapeKey: false,
            allowOutsideClick: false,
            //timer: 2000,
            didOpen: () => {
                Swal.showLoading();
                this.sch.getResultsByStudent(this.currentClassId, this.currentSessionId.toString(), this.currentTerm, this.studentId)
                    .subscribe(res => {
                        this.resultlist = res;
                        this.subjectOffered = this.resultlist.length;
                        this.markObtainable = this.resultlist.length * 100;
                        let averageList = this.resultlist.map(item => item.average);
                        let kool = averageList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                        Swal.close();
                        this.getSchool();
                    })
            }
        });
    }

    

  getStudentResultComment() {
    this.sch.getStudentResultComment(this.currentClassId, this.currentSessionId.toString(), this.currentTerm, this.studentId)
      .subscribe(res => {
        this.resultComment = res;
      })
  }





  getCaSetupByClass() {
    this.sch.getCaSetupByClass(this.currentClassId, this.currentSessionId, this.currentTerm)
      .subscribe(res => {
        this.caSetupData = res.systemname;
        this.caSetupScoreData = res.score;
      });
  }

  getStudentBMI() {
    this.sch.getStudentBMI(this.currentSessionId.toString(), this.currentTerm, this.studentId)
      .subscribe(res => {
        this.bmi = res;
        console.log(this.bmi);
      })
  }

  getStudentEstimatedAttendance() {
    this.sch.getStudentEstimatedAttendance(this.currentSessionId.toString(), this.currentTerm, this.studentId)
      .subscribe(res => {
        this.estAttendance = res;
        console.log(this.bmi);
      })
  }

  getStudentHouse() {
    this.sch.getUnitStudentHouse(this.studentId, this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        debugger
        this.house = res.house;
        console.log(this.house);
      })
  }

  getGradeScaleByClass() {
    this.sch.getGradeScaleByClass(this.currentClassId)
      .subscribe(res => {

        this.gradeScalelist = res;
        // this.gradescaletextlist.push(this.gradeScalelist[0].classLevel + ':');
        // let mytext;
        this.gradeScalelist.forEach(a => {
          a.color = this.gradeColor(a.grade);
        });
        
        //let mic = this.gradeScalelist.filter(t => t.color == 'Green')[this.gradeScalelist.filter(t => t.color == 'Green').length - 1].begLimit;
        this.grademinimumlist.push({color : 'Black', remark: this.gradeScalelist.filter(t => t.color == 'Black')[this.gradeScalelist.filter(t => t.color == 'Black').length - 1].remarks,  minscore:  this.gradeScalelist.filter(t => t.color == 'Black')[this.gradeScalelist.filter(t => t.color == 'Black').length - 1].begLimit});
        this.grademinimumlist.push({color : 'Green', remark: this.gradeScalelist.filter(t => t.color == 'Green')[this.gradeScalelist.filter(t => t.color == 'Green').length - 1].remarks, minscore:  this.gradeScalelist.filter(t => t.color == 'Green')[this.gradeScalelist.filter(t => t.color == 'Green').length - 1].begLimit});

        this.grademinimumlist.push({color : 'Blue', remark: this.gradeScalelist.filter(t => t.color == 'Blue')[this.gradeScalelist.filter(t => t.color == 'Blue').length - 1].remarks,  minscore:  this.gradeScalelist.filter(t => t.color == 'Blue')[this.gradeScalelist.filter(t => t.color == 'Blue').length - 1].begLimit});
        this.grademinimumlist.push({color : 'Red', remark: this.gradeScalelist.filter(t => t.color == 'Red')[this.gradeScalelist.filter(t => t.color == 'Red').length - 1].remarks,  minscore:  this.gradeScalelist.filter(t => t.color == 'Red')[this.gradeScalelist.filter(t => t.color == 'Red').length - 1].begLimit});
        

        this.grademinimumlistOver60.push({color : 'Green', minscore:  this.over60Num(this.gradeScalelist.filter(t => t.color == 'Green')[this.gradeScalelist.filter(t => t.color == 'Green').length - 1].begLimit)});
        this.grademinimumlistOver60.push({color : 'Black', minscore:  this.over60Num(this.gradeScalelist.filter(t => t.color == 'Black')[this.gradeScalelist.filter(t => t.color == 'Black').length - 1].begLimit)});
        this.grademinimumlistOver60.push({color : 'Blue', minscore:  this.over60Num(this.gradeScalelist.filter(t => t.color == 'Blue')[this.gradeScalelist.filter(t => t.color == 'Blue').length - 1].begLimit)});
        this.grademinimumlistOver60.push({color : 'Red', minscore:  this.over60Num(this.gradeScalelist.filter(t => t.color == 'Red')[this.gradeScalelist.filter(t => t.color == 'Red').length - 1].begLimit)});
        console.log(this.grademinimumlist);
      });
  }

  gradeColor(grade: string) {
    if (grade.includes('A')) {
      return "Black";
    } else if (grade.includes('B2')) {
      return "Black";
    } else if (grade.includes('B3')) {
      return "Green";
    } else if (grade.includes('C4')) {
      return "Green";
    } else if (grade.includes('C5')) {
      return "Blue";
    } else if (grade.includes('C6')) {
      return "Blue";
    } else if (grade.includes('D')) {
      return "Red";
    } else if (grade.includes('E')) {
      return "Red";
    } else if (grade.includes('F')) {
      return "Red";
    } else {
      return "Black";
    }
  }

  getPsycomotorByStudent() {
    this.sch.getPsycomotorByStudent(this.currentSessionId.toString(), this.currentTerm, this.studentId)
      .subscribe(res => {
        if (res.length > 0) {
          this.psycomotorlist = res;
        } else {
          this.sch.getSkillList().subscribe(res => {
            this.psycomotorlist = res;
          })
        }


        // this.psycomotorlist.forEach(a => {
        //   a.color = this.gradeColor(a.grade);
        // });
        //console.log(this.gradeScalelist);
      });
  }


  public convertToPDF() {
    var doc = new jsPDF('p', 'pt', 'letter');
    var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
 

    doc.setFont('Ariel', 'normal', '900');
    doc.setTextColor('rgb(36, 91, 143)');
    doc.setFontSize(28);
    //doc.text('Notre Dame Girls\' Academy' ?? '', pageWidth / 2, 30, {align: 'center'});
    doc.text(this.myschool?.schoolName ?? '', pageWidth / 2, 40, {align: 'center'});
    

    //doc.text(this.myschool.schoolName, 120, 30);
    if (this.genk.logoString) {
      doc.addImage(this.genk.logoString, 'PNG', 80, 15, 50, 50);
    }
    //let bee = await this.signatureimg;
    if (this.genk.signatureString) {
      doc.addImage(this.genk.signatureString, 'PNG', 495, 708, 70, 55);
    }
    
    doc.setFontSize(8);
    doc.setTextColor('rgb(0, 0, 0)');
    doc.setFont('Ariel', 'italic');

    //doc.text('Postal Address:', 20, 60);
    doc.text('Motto: Home of the Leadership Titans', pageWidth / 2, 55, {align: 'center'});
    
    doc.setFontSize(8);
    doc.setTextColor('rgb(0, 0, 0)');
    doc.setFont('', '', '500');
    //let me = doc.splitTextToSize(this.myschool?.address ?? '', 220);
    doc.text(this.myschool?.address, pageWidth / 2, 65, {align: 'center'});
    

    doc.setFont('', '', '600');
    doc.text('Tel: ' + this.myschool?.phoneOne, pageWidth / 2, 75, {align: 'center'});

    doc.setFontSize(13);
    doc.setFont('', '', '800');
    doc.text( 'REPORT SHEET', pageWidth / 2, 94, {align: 'center'});

    doc.setFontSize(8);

    

    doc.setFont('', '', '600');
    doc.setFontSize(9);
    doc.text('ACADEMIC RECORD', 20, 172);
    debugger

    autoTable(doc, {
      body: [
          [
              `TERM: ${this.currentTerm}`, 
              `SESSION: ${this.currentSession}`, 
              `ADMISSION NO: ${this.studentobj?.admissionNo || ""}`
          ],
          [
              `NAME OF ${this.studentCat}: ${[
                this.studentobj?.surname || "",
                this.studentobj?.middleName || "",
                this.studentobj?.firstName || "",
              ].join(" ").trim()}`,
              `CLASS: ${this.className}`, 
              `NO. ON ROLL: ${this.noInClass}`
          ],
          [
              `TEACHER'S NAME: ${this.formTeach}`, 
              `HOUSE: ${this.house}`, 
              `SEX: ${this.studentobj?.sex || ""}`
          ],
          [
              `NO. OF TIMES SCHOOL OPENED: ${this.estAttendance?.noOfOpenDays || ""}`, 
              `NO. OF TIMES PRESENT: ${this.estAttendance?.noPresentDays || ""}`, 
              `NEXT TERM BEGINS: ${this.nextResumptionDate}`
          ],
      ],
      styles: { font: '6px', cellPadding: 3, lineColor: '#808080', lineWidth: 0.2, fontSize: 7}, 
      headStyles: { lineColor: 'white', fontSize: 8, fontStyle: 'bold'}, 
      startY: 97, 
      margin: { top: 97, left: 20, bottom: 30 },
      theme: "plain",
      tableWidth: 565,
  });

    doc.setFontSize(10);

    let resu = this.resultlist;
          let bodyArray = [];
          resu.forEach(c => {
            let resArray = [];
            resArray.push(c.subject);
            Object.keys(this.caSetupData).forEach(a => {
              resArray.push(c[a.toLowerCase()]);
            });
            resArray.push(c.totalScore);
            resArray.push(c.grade);
            resArray.push(c.remark);
            //resArray.push(c.position);
            resArray.push(c.lowestScore);
            resArray.push(c.highestScore);
            resArray.push(c.average);
            bodyArray.push(resArray);
          })

    let casetup = this.caSetupData;
    let bellCap = Object.keys(casetup) as any[];
    let bell = Object.values(casetup) as any[];
    let bellScore = Object.values(this.caSetupScoreData) as any[];
    for (let i = 0; i < bell.length; i++) {
      bell[i] = bell[i] + '(' + bellScore[i] + '%)';
    }

    bell.forEach(a => {
      a = a + '(' + this.caSetupScoreData.CA1 + '%)'
    })
    let bess = ['Subject', ...bell, 'Total Score', 'Grade', 'Remark', 'Lowest Score', 'Highest Score', 'Average'];
    let arr = bodyArray;

    autoTable(doc, { head: [bess], useCss: true,
      body: bodyArray,
    styles: { font: '8px', lineColor: '#808080', lineWidth: 0.1, fontSize: 8, cellPadding: 3}, 
    headStyles: { fontSize: 6, lineColor: 'white', textColor: 'white', fillColor: [45, 113, 177]}, 
    startY: 175, 
    tableWidth: 565,
    margin: {left: 20}});
    
    const customersTrailTableEndY = (doc as any).previousAutoTable.finalY;


    autoTable(doc, {
      body: [
        [
          { content: `Total Mark Obtainable: ${this.markObtainable}`, colSpan: 2, styles: { font: '600' } },
          { content: `Total Mark Obtained: ${this.studentTotal?.toFixed(1).toString()}`, colSpan: 2, styles: { font: '600' } }
        ],
        [
          { content: `Pupil Average: ${this.average.toString()}`, styles: { font: '600' } },
          { content: `Subjects: ${this.subjectOffered}`, colSpan: 2, styles: { font: '600' } },
          { content: `Class Average: ${this.classAverage}`, styles: { font: '600' } }
        ]
      ],
      theme: "grid",
      styles: {
        font: '6px',
        fontSize: 8,
        cellPadding: 3,
        textColor: '#000000',
        halign: 'center',
        lineColor: '#808080', 
        lineWidth: 0.1,
      },
      startY: customersTrailTableEndY,
      margin: {left: 20},
      tableWidth: 565
    });

    const analyTableEndY = (doc as any).previousAutoTable.finalY;
    
    autoTable(doc, {
      head: [
          [
              { content: "SKILL KEY", colSpan: 2, styles: { halign: "center", fillColor: "whitesmoke", fontSize: 8, textColor: [0, 0, 0] } },
          ],
          ["SPECIFIC SKILLS", "RATING"],
      ],
      body: this.psycomotorlist.map((psycom) => [psycom.skill, psycom.score]),
      styles: {font: '9px', fontSize: 8, cellPadding: 2, lineWidth: 0.3 },
      startY: analyTableEndY + 20, 
      tableWidth: 188, 
      margin: {left: 20},
      headStyles: {
        fillColor: [255, 255, 255],
        fontSize: 8,
        textColor: [0, 0, 0]
      },
      theme: "grid",
      tableLineWidth: 0.5
  });

    const psycoTableEndY = (doc as any).previousAutoTable.finalY;

   
    const ratingKey = [
      { keyName: "POOR", keyValue: "1" },
      { keyName: "FAIR", keyValue: "2" },
      { keyName: "GOOD", keyValue: "3" },
      { keyName: "VERY GOOD", keyValue: "4" },
      { keyName: "EXCELLENT", keyValue: "5" },
      { keyName: "", keyValue: "" },
      { keyName: "", keyValue: "" }
  ];
    
    autoTable(doc, {
      head: [
          [
              { content: "RATING KEY", colSpan: 2, styles: { halign: "center", fillColor: "whitesmoke", fontSize: 7 } },
          ],
          ["KEY NAME", "KEY VALUE"],
      ],
      body: ratingKey.map((entry) => [entry.keyName, entry.keyValue]),
      styles: {font: '8px', fontSize: 7, cellPadding: 3, lineWidth: 0.3 },
      startY: analyTableEndY + 20, 
      tableWidth: 122, 
      margin: { left: 213 },
      headStyles: {
        fillColor: [255, 255, 255],
        fontSize: 7,
        textColor: [0, 0, 0]
      },
      theme: "grid",
      tableLineWidth: 0.5
      //tableLineColor: [222, 222, 222],
  });

    autoTable(doc, {
      head: [
          [
              { content: "GRADING KEY", colSpan: 4, styles: { halign: "center", fillColor: "whitesmoke", fontSize: 7 } },
          ],
          ["REMARK", "GRADE", "MARK FROM", "MARK UPTO"],
      ],
      body: this.gradeScalelist.map((grade) => [
          grade.remarks.toUpperCase(),
          grade.grade,
          grade.begLimit,
          grade.endLimit,
      ]),
      styles: {font: '8px', fontSize: 7, cellPadding: 3, lineWidth: 0.2 },
      headStyles: {
        fillColor: [255, 255, 255],
        fontSize: 7,
        textColor: [0, 0, 0]
      },
      startY: analyTableEndY + 20, margin: {left: 339},
      tableWidth: 245,
      theme: "grid",
      tableLineWidth: 0.1
  });



    doc.setFont('', '', '700');
    doc.setFontSize(9);
    const gradeTableEndY = (doc as any).previousAutoTable.finalY;

    const comlineY = psycoTableEndY > gradeTableEndY ? psycoTableEndY : gradeTableEndY;

    const rows = [
      ["CLASS TEACHER'S REMARK:", this.resultComment.formTeacherComment],
      ["SECTION'S HEAD REMARK:", this.resultComment.principalComment]
    ];
    
    // Add the table using autoTable
    autoTable(doc, {
      //head: [["Description", "Comment"]], // Table header
      body: rows, // Table rows
      styles: {
        fontSize: 7,
        cellPadding: 5,
        lineColor: '#808080',
        lineWidth: 0.1,
      },
      theme: "grid",
      tableWidth: 565,
      margin: { left: 20},
      startY: comlineY + 10, // Starting Y position
    });

    doc.setTextColor('rgb(36, 91, 143)');
    doc.setFontSize(9);
    doc.setFont('', '', '600');
    let prinSig = doc.splitTextToSize('Principal\'s Signature Date & Stamp:', 80);
    doc.text(prinSig, 415, 730);
    
    if (this.genk.isView) {
      this.genk.pdfSource = doc.output('datauristring');
    } else {
      doc.save('My_Results');
    }

  }

  

  

  addLogo(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sch.getSchoolLogoArray(this.myschool.id).subscribe(
        (res) => {
          if (res?.photo) {
            this.genk.logoString = `data:image/jpeg;base64,${res.photo}`;
          } else {
            this.genk.logoString = '';
          }
          resolve();
        },
        (err) => reject(err)
      );
    });
  }

  addSignature(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Example implementation for `addSignature`
      this.sch.obtainSignatureArray(this.currentSessionId, this.currentTerm).subscribe(
        (res) => {
          debugger
          if (res?.photo) {
            this.genk.signatureString = `data:image/jpeg;base64,${res.photo}`;
          } else {
            this.genk.signatureString = '';
          }
          resolve();
        },
        (err) => reject(err)
      );
    });
  }


floorNum(value: number) {
  return Math.floor(value);
}

over60Num(value: number) {
  //debugger
  let reel = 0;
  let nee = ((value / 100) * 60).toString();
  let arr = nee.split('.');
  if (arr.length > 1) {
    reel =  Number(arr[0] + '.' + arr[1][0]);
  } else {
    reel =  Number(arr[0]);
  }
  return reel;
  //return Math.floor(value);
}

over40Num(value: number) {
  //debugger
  let reel = 0;
  let nee = ((value / 100) * 40).toString();
  let arr = nee.split('.');
  if (arr.length > 1) {
    reel =  Number(arr[0] + '.' + arr[1][0]);
  } else {
    reel =  Number(arr[0]);
  }
  return reel;
  //return Math.floor(value);
}

getScoreColor(score: number, max: number) {
  if (max == 100) {
    if (score >= this.grademinimumlist[0].minscore) {
      return this.grademinimumlist[0].color;
    }
    else if (score >= this.grademinimumlist[1].minscore && score < this.grademinimumlist[0].minscore) {
      return this.grademinimumlist[1].color;
    }
    if (score >= this.grademinimumlist[2].minscore && score < this.grademinimumlist[1].minscore) {
      return this.grademinimumlist[2].color;
    }
    if (score >= this.grademinimumlist[3].minscore && score < this.grademinimumlist[2].minscore) {
      return this.grademinimumlist[3].color;
    }
  }

  else if (max == 60) {
    if (score >= this.grademinimumlistOver60[0].minscore) {
      return this.grademinimumlistOver60[0].color;
    }
    else if (score >= this.grademinimumlistOver60[1].minscore && score < this.grademinimumlistOver60[0].minscore) {
      return this.grademinimumlistOver60[1].color;
    }
    if (score >= this.grademinimumlistOver60[2].minscore && score < this.grademinimumlistOver60[1].minscore) {
      return this.grademinimumlistOver60[2].color;
    }
    if (score >= this.grademinimumlistOver60[3].minscore && score < this.grademinimumlistOver60[2].minscore) {
      return this.grademinimumlistOver60[3].color;
    }
  }
}

getRemarkColor(value: string) {
  return this.grademinimumlist.filter(t => t.remark?.toLowerCase() == value?.toLowerCase())[0]?.color;
}

}
