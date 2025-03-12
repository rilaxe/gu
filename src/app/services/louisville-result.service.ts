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
export class LouisvilleResultService {
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
  mychartdiv: HTMLDivElement
   
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

  getStudent() {
    this.sch.getStudentById(this.studentId.toString())
      .subscribe(async res => {
        this.studentobj = res;
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
          this.psycomotorlist = res.slice(0, Math.round(res.length / 2));
          this.psycomotorlist2 = res.slice(Math.round(res.length / 2), res.length);
        } else {
          this.sch.getSkillList().subscribe(res => {
            this.psycomotorlist = res.slice(0, Math.round(res.length / 2));
            this.psycomotorlist2 = res.slice(Math.round(res.length / 2), res.length);
          })
        }


        // this.psycomotorlist.forEach(a => {
        //   a.color = this.gradeColor(a.grade);
        // });
        //console.log(this.gradeScalelist);
      });
  }


  public convertToPDF() {
    let nio = 0;
    nio.toPrecision(1)
    var doc = new jsPDF('p', 'pt', 'letter');
    var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
 

    doc.setFont('Trebuchet MS', 'normal', '900');
    doc.setTextColor('rgb(36, 91, 143)');
    doc.setFontSize(20);
    doc.text(this.myschool?.schoolName ?? '', pageWidth / 2, 30, {align: 'center'});

    
    
    
    //doc.text(this.myschool.schoolName, 120, 30);
    if (this.genk.logoString) {
      doc.addImage(this.genk.logoString, 'PNG', 270, 40, 55, 55);
    }
    if (this.genk.signatureString) {
      doc.addImage(this.genk.signatureString, 'PNG', 495, 705, 70, 55);
    }

    
    
    doc.setFontSize(10);
    doc.setTextColor('rgb(0, 0, 0)');
    doc.setFont('', '', '700');
    doc.text('Postal Address:', 20, 60);
    doc.setFont('', '', '500');
    let me = doc.splitTextToSize(this.myschool?.address ?? '', 220);
    doc.text(me, 20, 73);

    doc.setFont('', '', '700');
    doc.text('Email:', 380, 60);
    doc.setFont('', '', '500');
    doc.text(this.myschool?.email ?? '', 418, 60);

    doc.setFont('', '', '700');
    doc.text('Phone:', 380, 74);
    doc.setFont('', '', '500');
    doc.text(this.myschool?.phoneOne ?? '', 418, 74);

    doc.setFont('', '', '700');
    doc.text('website:', 380, 88);
    doc.setFont('', '', '500');
    doc.text(this.myschool?.website ?? '', 424, 88);

    doc.setDrawColor(36, 91, 143);
    doc.setLineWidth(2)
    doc.line(20, 100, 580, 100);

    doc.setFontSize(8);

    doc.setFont('', '', '700');
    doc.text('STUDENTS NAME:', 20, 120);
    doc.setFont('', '', '500');
    doc.text(((this.studentobj?.surname ?? '') + ' ' + (this.studentobj?.middleName ?? '') + ' ' + (this.studentobj?.firstName ?? '')).trim(), 113, 120);

    doc.setFont('', '', '700');
    doc.text('CLASS:', 20, 132);
    doc.setFont('', '', '500');
    doc.text(this.className ?? '', 113, 132);

    doc.setFont('', '', '700');
    doc.text('NO. IN CLASS:', 20, 144);
    doc.setFont('', '', '500');
    doc.text(this.noInClass.toString(), 113, 144);

    doc.setFont('', '', '700');
    doc.text('AVERAGE SCORE:', 20, 156);
    doc.setFont('', '', '500');
    doc.text(this.average.toString(), 113, 156);

    doc.setFont('', '', '700');
    doc.text('TOTAL SCORE:', 20, 168);
    doc.setFont('', '', '500');
    doc.text(this.studentTotal.toFixed(1).toString(), 113, 168);

    doc.setFont('', '', '700');
    doc.text('POSITION IN CLASS:', 20, 180);
    doc.setFont('', '', '500');
    doc.text(this.position.toString(), 113, 180);

    doc.setFont('', '', '700');
    doc.text('TERM:', 380, 120);
    doc.setFont('', '', '500');
    doc.text(this.currentTerm, 460, 120);

    doc.setFont('', '', '700');
    doc.text('SESSION:', 380, 132);
    doc.setFont('', '', '500');
    doc.text(this.currentSession, 460, 132);

    doc.setFont('', '', '700');
    doc.text('ADMISSION NO.:', 380, 144);
    doc.setFont('', '', '500');
    doc.text(this.studentobj?.admissionNo ?? '', 460, 144);

    doc.setFont('', '', '700');
    doc.setFontSize(7);
    doc.text('NEXT TERM BEGINS:', 380, 156);
    doc.setFont('', '', '500');
    //let dateString = "2022-09-09";
    if (this.nextResumptionDate) {
      let date = new Date(this.nextResumptionDate);

    let formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);

    doc.setFontSize(8);
    doc.text(formattedDate, 460, 156);
    }

    
    doc.setFont('', '', '700');
    doc.text('HOUSE:', 380, 168);
    doc.setFont('', '', '500');
    doc.text('', 460, 168);

    doc.setFont('', '', '700');
    doc.text('NO OF TIMES PRESENT:', 380, 180);
    doc.setFont('', '', '500');
    doc.text('', 460, 180);

    doc.setFontSize(12);
    doc.setFont('', '', '700');
    doc.text('CONTINUOUS ASSESSMENT DOSSIER FOR JUNIOR SECONDARY SCHOOL', pageWidth / 2, 200, {align: 'center'});



    // autoTable(doc, { html: '#customers', useCss: true, styles: { font: '20px', lineWidth: 0.2, fontSize: 6}, headStyles: { lineColor: 'white' }, startY: 156, margin: { top: 150, left: 20, bottom: 70 }})
    // doc.setFontSize(10);

    let resu = this.resultlist;
          let bodyArray = [];
          resu.forEach(c => {
            let resArray = [];
            resArray.push(c.subject);
            Object.keys(this.caSetupData).forEach(a => {
              resArray.push(c[a.toLowerCase()]);
            });
            resArray.push(c.totalScore?.toFixed(2));
            resArray.push(c.grade);
            resArray.push(c.remark);
            resArray.push(c.position);
            resArray.push(c.lowestScore?.toFixed(2));
            resArray.push(c.highestScore?.toFixed(2));
            resArray.push(c.average);
            bodyArray.push(resArray);
          })



    let casetup = this.caSetupData;
    let bellCap = Object.keys(casetup) as any[];
    let bell = Object.values(casetup) as any[];
    let bellScore = Object.values(this.caSetupScoreData) as any[];
    for (let i = 0; i < bell.length; i++) {
      bell[i] = bell[i] ;
    }

    // bell.forEach(a => {
    //   a = a + '(' + this.caSetupScoreData.CA1 + '%)'
    // })
    let bess = ['Subject', ...bell, 'Total Score', 'Grade', 'Remark', 'Position', 'Lowest Score', 'Highest Score', 'Average'];
    let arr = bodyArray;

    autoTable(doc, { head: [bess],
    body: bodyArray,
    alternateRowStyles: {
      fillColor: [245, 245, 245] // Light gray for alternate rows
    },
    styles: { font: '8px', lineColor: [200, 200, 200], lineWidth: 0.1, fontSize: 8, cellPadding: 3}, 
    headStyles: { fontSize: 7, lineColor: 'white', halign: 'left', valign: 'middle', textColor: 'white', fillColor: [45, 113, 177], cellPadding: [5, 1, 5, 3]}, 
    startY: 205, 
    tableWidth: 562,
    margin: {left: 20}});

    const mykeyTrailTableEndY = (doc as any).previousAutoTable.finalY;


// Define table headers
// const headers = [
//   [
//     { content: "HEIGHT", colSpan: 2, styles: { halign: "center", fontStyle: "bold", fontSize: 10 } },
//     { content: "WEIGHT", colSpan: 2, styles: { halign: "center", fontStyle: "bold", fontSize: 10 } },
//     { content: "Illness Stats", colSpan: 2, styles: { halign: "center", fontStyle: "bold", fontSize: 10 } }
//   ],
//   [
//     { content: "Beginning of Term", styles: { fontStyle: "bold", fontSize: 10 } },
//     { content: "End of Term", styles: { fontStyle: "bold", fontSize: 10 } },
//     { content: "Beginning of Term", styles: { fontStyle: "bold", fontSize: 10 } },
//     { content: "End of Term", styles: { fontStyle: "bold", fontSize: 10 } },
//     { content: "Number of days absent due to Illness", styles: { fontStyle: "bold", fontSize: 10 } },
//     { content: "Nature of Illness", styles: { fontStyle: "bold", fontSize: 10 } }
//   ]
// ];

// const tableHeaders = [
//   { content: "HEIGHT", colSpan: 2, styles: { halign: "center", fontStyle: "bold", fontSize: 10 } },
//   { content: "WEIGHT", colSpan: 2, styles: { halign: "center", fontStyle: "bold", fontSize: 10 } },
//   { content: "Illness Stats", colSpan: 2, styles: { halign: "center", fontStyle: "bold", fontSize: 10 } }
// ];

const tableHeaders = [
  [ // First row with merged columns
    { content: "HEIGHT", colSpan: 2, styles: { halign: "center", fontStyle: "bold", fontSize: 7 } },
    { content: "WEIGHT", colSpan: 2, styles: { halign: "center", fontStyle: "bold", fontSize: 7 } },
    { content: "SOCIETIES/CLUBS", colSpan: 4, styles: { halign: "center", fontStyle: "bold", fontSize: 7 } }
  ],
  [ // Second row with individual column headers
    { content: "Beginning of Term", styles: { fontStyle: "bold", fontSize:  6} },
    { content: "End of Term", styles: { fontStyle: "bold", fontSize: 6 } },
    { content: "Beginning of Term", styles: { fontStyle: "bold", fontSize: 6 } },
    { content: "End of Term", styles: { fontStyle: "bold", fontSize: 6 } },
    { content: "Academic", styles: { fontStyle: "bold", fontSize: 6 } },
    { content: "Social", styles: { fontStyle: "bold", fontSize: 6 } },
    { content: "Pious", styles: { fontStyle: "bold", fontSize: 6 } },
    { content: "Social Acad", styles: { fontStyle: "bold", fontSize: 6 } }
  ]
];

// Define subheaders (for the second row)
// const subHeaders = [
//   { content: "Beginning of Term", styles: { fontStyle: "bold", fontSize: 10 } },
//   { content: "End of Term", styles: { fontStyle: "bold", fontSize: 10 } },
//   { content: "Beginning of Term", styles: { fontStyle: "bold", fontSize: 10 } },
//   { content: "End of Term", styles: { fontStyle: "bold", fontSize: 10 } },
//   { content: "Number of days absent due to Illness", styles: { fontStyle: "bold", fontSize: 10 } },
//   { content: "Nature of Illness", styles: { fontStyle: "bold", fontSize: 10 } }
// ];

// Define table data
const data = [
  [
    { content: `${this.bmi?.heightBOT || ""}cm`, styles: { fontSize: 7 } },
    { content: `${this.bmi?.heightEOT || ""}cm`, styles: { fontSize: 7 } },
    { content: `${this.bmi?.weightBOT || ""}cm`, styles: { fontSize: 7 } },
    { content: `${this.bmi?.weightEOT || ""}cm`, styles: { fontSize: 7 } },
    { content: "0", styles: { fontSize: 7 } },
    { content: "", styles: { fontSize: 7 } }
  ]
];

doc.setFontSize(9);


// Add AutoTable to the PDF
autoTable(doc, {
  head: tableHeaders as RowInput[],
  body: data,
  startY: mykeyTrailTableEndY + 10,
  styles: {
    fontSize: 6, // Match the font size in your table
    cellPadding: 2,
    lineColor: '#808080', 
    lineWidth: 0.1,
  },
  tableWidth: 565,
  margin: { top: 150, left: 20, bottom: 30 },
  headStyles: { // Bold header text
    fillColor: [255, 255, 255], // Light gray header background
    textColor: [0, 0, 0], // Black text color for header
    fontSize: 7
  },
  alternateRowStyles: {
    fillColor: [255, 255, 255] // Light gray for alternate rows
  }
});


const bmiTrailTableEndY = (doc as any).previousAutoTable.finalY;

    

    
    

    // autoTable(doc, { html: '#analy', useCss: true, styles: { font: '6px', lineColor: '#808080', lineWidth: 0.2, fontSize: 7, halign: 'center'}, headStyles: { lineColor: 'white', fontSize: 8, fontStyle: 'bold'}, startY: 420, margin: { top: 150, left: 20, bottom: 30 }})

    
    // autoTable(doc, { html: '#myweight', styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 8 }, headStyles: { lineColor: 'white' }, startY: 507, tableWidth: 170, margin: { top: 150, left: 195, bottom: 30 }})
    // autoTable(doc, { html: '#mysocial', styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 8 }, headStyles: { lineColor: 'white' }, startY: 507, margin: { top: 150, left: 370, bottom: 30 }})

    // autoTable(doc, { html: '#grade', useCss: true, styles: { font: '8px', lineWidth: 0.2, fontSize: 6 }, startY: 473, margin: { top: 150, left: 300, bottom: 30 }})
    // doc.setFontSize(7);
    doc.setFontSize(9);
    doc.setFont('', '', '600');
    doc.text('PSYCOMOTOR DOMAIN', 85, bmiTrailTableEndY + 16);

    
    doc.setFont('', '', '600');    
    doc.text('COGNITIVE DOMAIN RATING', 382, bmiTrailTableEndY + 16);


// AutoTable configuration
autoTable(doc, {
  head: [["Color", "Grade", "Over 100", "Over 60", "Over 40"]],
  body: this.gradeScalelist.map((item) => [
    { content: item.color, styles: { fontStyle: "bold", textColor: item.color.toLowerCase() } },
    item.grade,
    item.begLimit + " " + "-" + " " + this.floorNum(item.endLimit),
    this.over60Num(item.begLimit) + " " + "-" + " " + this.over60Num(item.endLimit),
    this.over40Num(item.begLimit) + " " + "-" + " " + this.over40Num(item.endLimit),
    // `${item.begLimit} - ${Math.floor(item.endLimit)}`,
    //item.remarks,
  ]),
  styles: {
    fontSize: 6,
    cellPadding: 3,
    lineColor: '#808080', 
    lineWidth: 0.1,
  },
  headStyles: {
    fontStyle: "bold",
    fontSize: 6,

    fillColor: [230, 230, 230], // Light gray
    textColor: [0, 0, 0], // Black
  },
  alternateRowStyles: {
    fillColor: [255, 255, 255] // Light gray for alternate rows
  },
  // columnStyles: {
  //   0: { halign: "center" }, // Center align the "Color" column
  //   1: { halign: "center" }, // Center align the "Grade" column
  //   2: { halign: "center" }, // Center align the "Score Range" column
  //   3: { halign: "left" },   // Left align the "Remark" column
  // },
  tableWidth: 280,
  startY: bmiTrailTableEndY + 20, margin: { top: 150, left: 300, bottom: 30 }
});

const gradeTrailTableEndY = (doc as any).previousAutoTable.finalY;



autoTable(doc, {
  //head: [["Skill", "Score"]], // Table header
  body: this.psycomotorlist.map((item) => [item.skill, item.score]), // Dynamic data for rows
  styles: {
    fontSize: 7, // Match the font size in your table
    cellPadding: 3,
    lineColor: '#808080', 
    lineWidth: 0.1,
  },
  headStyles: {
    fontStyle: "bold", // Bold header text
    fillColor: [250, 250, 250], // Light gray header background
    textColor: [0, 0, 0], // Black text color for header
    fontSize: 7
  },
  alternateRowStyles: {
    fillColor: [255, 255, 255] // Light gray for alternate rows
  },
  columnStyles: {
    0: { halign: "left" }, // Left align for "Skill"
    1: { halign: "center" }, // Center align for "Score"
  },
  startY: bmiTrailTableEndY + 20, margin: { top: 150, left: 20, bottom: 30 },
  tableWidth: 130, // Adjust table width to content
});

autoTable(doc, {
 // head: [["Skill", "Score"]], // Table header
  body: this.psycomotorlist2.map((item) => [item.skill, item.score]), // Dynamic data for rows
  styles: {
    fontSize: 7, // Match the font size in your table
    cellPadding: 3,
    lineColor: '#808080', 
    lineWidth: 0.1,
  },
  headStyles: {
    fontStyle: "bold", // Bold header text
    fillColor: [250, 250, 250], // Light gray header background
    textColor: [0, 0, 0], // Black text color for header
    fontSize: 7
  },
  alternateRowStyles: {
    fillColor: [255, 255, 255] // Light gray for alternate rows
  },
  columnStyles: {
    0: { halign: "left" }, // Left align for "Skill"
    1: { halign: "center" }, // Center align for "Score"
  },
  startY: bmiTrailTableEndY + 20, margin: { top: 150, left: 150, bottom: 30 },
  tableWidth: 130, // Adjust table width to content
});

const psycoTrailTableEndY = (doc as any).previousAutoTable.finalY;


// autoTable(doc, {
//   body: [
//     ["No. of Times School Open", this.estAttendance?.noOfOpenDays],
//     ["Time(s) Present", this.estAttendance?.noPresentDays],
//     ["Time(s) Absent", this.estAttendance?.noAbsentDays],
//   ],
//   styles: {
//     fontSize: 7, // Match the font size in your table
//     cellPadding: 3,
//     lineColor: '#808080', 
//     lineWidth: 0.1,
//   },
//   alternateRowStyles: {
//     fillColor: [255, 255, 255] // Light gray for alternate rows
//   },
//   columnStyles: {
//     0: { halign: "left" }, // First column styled bold
//     1: { halign: "center" },                 // Second column centered
//   },
//   startY: psycoTrailTableEndY + 5, 
//   tableWidth: 260, 
//   margin: { top: 150, left: 20, bottom: 30 }
// });
    
    
    
    
const tableContent = "1 = Unsatisfactory 2 = Below Average 3 = Average 4 = Good 5 = Excellent";

// AutoTable configuration
autoTable(doc, {
  body: [
    [{ content: tableContent, styles: { halign: "left", cellPadding: 5 } }],
  ],
  styles: {
    fontSize: 7, // Match the font size in your table
    cellPadding: 2,
    lineColor: '#808080', 
    lineWidth: 0.1,// Padding inside the cell
  },
  startY: psycoTrailTableEndY + 5, tableWidth: 280, margin: { top: 150, left: 20, bottom: 30 },
  theme: "plain", // No borders or gridlines
});

const keyRatingTableEndY = (doc as any).previousAutoTable.finalY;


doc.setTextColor('rgb(36, 91, 143)');
    doc.setFontSize(9);
    doc.setFont('', '', '600');
    let mistee = doc.splitTextToSize('House Mother Comment:', 150);
    doc.text(mistee, 20, keyRatingTableEndY + 40);
    doc.setFont('', '', '200');
    doc.setTextColor('rgb(0, 0, 10)');
    let housetea = doc.splitTextToSize(this.resultComment?.formTeacherComment ?? '', 370);
    doc.text(housetea, 176, keyRatingTableEndY + 40);

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1)
    doc.line(170, keyRatingTableEndY + 43, 580, keyRatingTableEndY + 43);


    doc.setFontSize(9);
    doc.setFont('', '', '600');
    doc.setTextColor('rgb(36, 91, 143)');
    let tee = doc.splitTextToSize('Form Teacher\'s Comment:', 100);
    doc.text(tee, 20, keyRatingTableEndY + 60);
    doc.setFont('', '', '200');
    doc.setTextColor('rgb(0, 0, 0)');
    let formtea = doc.splitTextToSize(this.resultComment?.formTeacherComment ?? '', 370);
    doc.text(formtea, 176, keyRatingTableEndY + 60);

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1)
    doc.line(170, keyRatingTableEndY + 63, 580, keyRatingTableEndY + 63);

    
    doc.setFontSize(9);
    doc.setFont('', '', '600');
    doc.setTextColor('rgb(36, 91, 143)');
    let pea = doc.splitTextToSize('Principal\'s Comment:', 100);
    doc.text(pea, 20, keyRatingTableEndY + 80);
    doc.setFont('', '', '200');
    doc.setTextColor('rgb(0, 0, 0)');
    let princom = doc.splitTextToSize(this.resultComment?.principalComment ?? '', 370);
    doc.text(princom, 176, keyRatingTableEndY + 80);

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.line(170, keyRatingTableEndY + 83, 580, keyRatingTableEndY + 83);


    doc.setTextColor('rgb(36, 91, 143)');
    doc.setFontSize(9);
    doc.setFont('', '', '600');
    let prinSig = doc.splitTextToSize('Principal\'s Signature Date & Stamp:', 80);
    doc.text(prinSig, 415, keyRatingTableEndY + 120);
    







    // autoTable(doc, { html: '#psyco', useCss: true, styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 6 }, headStyles: { lineColor: 'white' }, startY: 473, tableWidth: 130, margin: { top: 150, left: 20, bottom: 30 }})
    // autoTable(doc, { html: '#psyco2', useCss: true, styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 6 }, headStyles: { lineColor: 'white' }, startY: 473, tableWidth: 130, margin: { top: 150, left: 150, bottom: 30 }})

    //autoTable(doc, { html: '#attend',  useCss: true, styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 6 }, headStyles: { lineColor: 'white' }, startY: psycoTrailTableEndY + 5, tableWidth: 260, margin: { top: 150, left: 20, bottom: 30 }})
    //autoTable(doc, { html: '#mykey',  useCss: true, styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 6 }, headStyles: { lineColor: 'white' }, startY: 597, tableWidth: 270, margin: { top: 150, left: 300, bottom: 30 }})
  
    // doc.setFont('', '', '700');
    // doc.setFontSize(9);
    // //doc.text('Physical Development & Health', 65, 490);
    // doc.text('PHYSICAL DEVELOPMENT & HEALTH' ?? '', pageWidth / 2, 629, {align: 'center'});
    // autoTable(doc, { html: '#ireg', useCss: true, styles: { font: '6px', lineColor: '#808080', lineWidth: 0.2, fontSize: 7, halign: 'center'}, headStyles: { lineColor: 'white', fontSize: 8, fontStyle: 'bold'}, startY: 634, margin: { top: 150, left: 20, bottom: 30 }})




    //autoTable(doc, { html: '#club', useCss: true, styles: { font: '8px', lineWidth: 0.2, fontSize: 6 }, startY: 690, tableWidth: 170, margin: { top: 150, left: 400, bottom: 30 }})
   
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
