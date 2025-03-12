import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import jspdf, { jsPDF } from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import { Chart } from 'chart.js/auto';
import { ResultService } from '../../services/result.service';
//import html2canvas from 'html2canvas';

@Component({
  templateUrl: './notre-dame-result.component.html',
  styleUrls: ['../../table.css']
})
export class NotreDameResultComponent implements OnInit {
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
  house: any
   
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

  ngOnInit(): void {
    this.genk.topdata = 'Dashboard';
    this.studentId = this.activeRoute.snapshot.params['id'];
    this.activeRoute.queryParams.subscribe(
      params => {
        this.currentTerm = params['term'];
        this.currentSessionId = params['currentSessionId'];
        this.currentSession = params['currentSession'];
        this.currentClassId = params['classId'];
        this.average = params['average'];
        this.position = params['position'];
        this.classAverage = params['classAverage'];
      }
    )
    this.getSchool();
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

  getSchool() {
    this.sch.getSchoolData()
      .subscribe(res => {
        this.myschool = res;
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
        //await Promise.all([this.addLogo(), this.addSignature()]);
        this.addLogo();
        this.addSignature();
        this.logoLoaded = true;
        // this.addLogo();
        // this.addSignature();
        
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
    this.sch.getResultsByStudent(this.currentClassId, this.currentSessionId.toString(), this.currentTerm, this.studentId)
      .subscribe(res => {
        this.resultlist = res;
        this.subjectOffered = this.resultlist.length;
        this.markObtainable = this.resultlist.length * 100;
        let averageList = this.resultlist.map(item => item.average);
        let kool = averageList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      })
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


  public convertToPDF(table: HTMLTableElement) {
    let nio = 0;
    nio.toPrecision(1)
    var doc = new jsPDF('p', 'pt', 'letter');
    var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
 

    doc.setFont('Ariel', 'normal', '900');
    doc.setTextColor('rgb(36, 91, 143)');
    doc.setFontSize(34);
    //doc.text('Notre Dame Girls\' Academy' ?? '', pageWidth / 2, 30, {align: 'center'});
    doc.text('Notre Dame Girls\' Academy' ?? '', 20, 30);
    
    
    //doc.text(this.myschool.schoolName, 120, 30);
    if (this.genk.logoString) {
      doc.addImage(this.genk.logoString, 'PNG', 500, 8, 50, 40);
    }
    //let bee = await this.signatureimg;
    // if (this.genk.signatureString) {
    //   doc.addImage(this.genk.signatureString, 'PNG', 495, 730, 70, 55);
    // }
    
    doc.setFontSize(18);
    doc.setTextColor('rgb(255, 0, 0)');
    doc.setFont('', '', '600');
    //doc.text('Postal Address:', 20, 60);
    doc.text(' P.O.Box 46 Kuje-Abuja', 60, 60);
    
    doc.setFontSize(10);
    doc.setTextColor('rgb(0, 0, 0)');
    doc.setFont('', '', '500');
    //let me = doc.splitTextToSize(this.myschool?.address ?? '', 220);
    doc.text('(After SS Simon and Jude Minor Seminary, Kuchiyako, Kuje-Abuja)', 40, 75);


    doc.setDrawColor(36, 91, 143);
    doc.setLineWidth(1);
    doc.line(350, 50, 350, 80);


    doc.setFontSize(8);
    doc.setFont('', '', '700');
    doc.text('Email:', 380, 60);
    doc.setFont('', '', '500');
    doc.text(this.myschool?.email ?? '', 418, 60);

    doc.setFont('', '', '700');
    doc.text('Phone:', 380, 70);
    doc.setFont('', '', '500');
    doc.text(this.myschool?.phoneOne ?? '', 418, 70);

    doc.setFont('', '', '700');
    doc.text('website:', 380, 80);
    doc.setFont('', '', '500');
    doc.text(this.myschool?.website ?? '', 418, 80);

    doc.setDrawColor(36, 91, 143);
    doc.setLineWidth(2)
    doc.line(20, 87, 580, 87);

    doc.setFontSize(8);

    doc.setFont('', '', '700');
    doc.text('STUDENTS NAME:', 20, 100);
    doc.setFont('', '', '500');
    doc.text(((this.studentobj?.surname ?? '') + ' ' + (this.studentobj?.middleName ?? '') + ' ' + (this.studentobj?.firstName ?? '')).trim(), 113, 100);

    doc.setFont('', '', '700');
    doc.text('CLASS:', 20, 112);
    doc.setFont('', '', '500');
    doc.text(this.className ?? '', 113, 112);

    doc.setFont('', '', '700');
    doc.text('NO. IN CLASS:', 20, 124);
    doc.setFont('', '', '500');
    doc.text(this.noInClass.toString(), 113, 124);

    // doc.setFont('', '', '700');
    // doc.text('AVERAGE SCORE:', 20, 156);
    // doc.setFont('', '', '500');
    // doc.text(this.average.toString(), 113, 156);

    // doc.setFont('', '', '700');
    // doc.text('TOTAL SCORE:', 20, 168);
    // doc.setFont('', '', '500');
    // doc.text(this.studentTotal.toFixed(1).toString(), 113, 168);

    // doc.setFont('', '', '700');
    // doc.text('POSITION IN CLASS:', 20, 180);
    // doc.setFont('', '', '500');
    // doc.text(this.position.toString(), 113, 180);

    doc.setFont('', '', '700');
    doc.text('TERM:', 380, 100);
    doc.setFont('', '', '500');
    doc.text(this.currentTerm, 460, 100);

    doc.setFont('', '', '700');
    doc.text('SESSION:', 380, 112);
    doc.setFont('', '', '500');
    doc.text(this.currentSession, 460, 112);

    doc.setFont('', '', '700');
    doc.text('ADMISSION NO.:', 380, 124);
    doc.setFont('', '', '500');
    doc.text(this.studentobj?.admissionNo ?? '', 460, 124);

    

    doc.setFontSize(12);
    doc.setFont('', '', '700');
    doc.text('TERMLY EVALUATION REPORT', pageWidth / 2, 150, {align: 'center'});


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
            resArray.push(c.totalScore);
            resArray.push(c.grade);
            resArray.push(c.remark);
            resArray.push(c.position);
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
      fillColor: [250, 250, 250] // Light gray for alternate rows
    },
    styles: { font: '8px', lineColor: '#808080', lineWidth: 0.1, fontSize: 8, cellPadding: 3}, 
    headStyles: { fontSize: 7, lineColor: 'white', halign: 'left', valign: 'middle', textColor: 'white', fillColor: [45, 113, 177], cellPadding: [5, 1, 5, 3]}, 
    startY: 155, 
    tableWidth: 562,
    margin: {left: 20}});
    
    
    const customersTrailTableEndY = (doc as any).previousAutoTable.finalY;
    doc.setFontSize(10);

    autoTable(doc, {
      body: [
        [
          { content: "Analysis", rowSpan: 2, styles: { valign: 'middle', halign: 'center', fontSize: 10, fontStyle: 'bold' } },
          { content: `Subject Offered: ${this.subjectOffered}`, styles: { font: '600' } },
          { content: `Total Mark Obtainable: ${this.markObtainable}`, styles: { font: '600' } },
          { content: `Total Mark Obtained: ${this.studentTotal}`, styles: { font: '600' } }
        ],
        [
          { content: `Student Average: ${this.average}`, styles: { font: '600' } },
          { content: `Position: ${this.position}`, styles: { font: '600' } },
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
      tableWidth: 552
    });

    const analyTrailTableEndY = (doc as any).previousAutoTable.finalY;

    
    

    // autoTable(doc, { html: '#analy', useCss: true, styles: { font: '6px', lineColor: '#808080', lineWidth: 0.2, fontSize: 7, halign: 'center'}, headStyles: { lineColor: 'white', fontSize: 8, fontStyle: 'bold'}, startY: 420, margin: { top: 150, left: 20, bottom: 30 }})

    
    // autoTable(doc, { html: '#myweight', styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 8 }, headStyles: { lineColor: 'white' }, startY: 507, tableWidth: 170, margin: { top: 150, left: 195, bottom: 30 }})
    // autoTable(doc, { html: '#mysocial', styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 8 }, headStyles: { lineColor: 'white' }, startY: 507, margin: { top: 150, left: 370, bottom: 30 }})

    // autoTable(doc, { html: '#grade', useCss: true, styles: { font: '8px', lineWidth: 0.2, fontSize: 6 }, startY: 473, margin: { top: 150, left: 300, bottom: 30 }})
    // doc.setFontSize(7);
    doc.setFontSize(9);
    doc.setFont('', '', '600');
    doc.text('PSYCOMOTOR DOMAIN', 85, analyTrailTableEndY + 16);

    
    doc.setFont('', '', '600');    
    doc.text('COGNITIVE DOMAIN RATING', 382, analyTrailTableEndY + 16);


// AutoTable configuration
autoTable(doc, {
  head: [["Color", "Grade", "Score Range", "Remark"]],
  body: this.gradeScalelist.map((item) => [
    { content: item.color, styles: { fontStyle: "bold", textColor: item.color.toLowerCase() } },
    item.grade,
    `${item.begLimit} - ${Math.floor(item.endLimit)}`,
    item.remarks,
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
  startY: analyTrailTableEndY + 20, margin: { top: 150, left: 300, bottom: 30 }
});

const gradeTrailTableEndY = (doc as any).previousAutoTable.finalY;



autoTable(doc, {
  head: [["Skill", "Score"]], // Table header
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
  startY: analyTrailTableEndY + 20, margin: { top: 150, left: 20, bottom: 30 },
  tableWidth: 130, // Adjust table width to content
});

autoTable(doc, {
  head: [["Skill", "Score"]], // Table header
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
  startY: analyTrailTableEndY + 20, margin: { top: 150, left: 150, bottom: 30 },
  tableWidth: 130, // Adjust table width to content
});

const psycoTrailTableEndY = (doc as any).previousAutoTable.finalY;


autoTable(doc, {
  body: [
    ["No. of Times School Open", this.estAttendance?.noOfOpenDays],
    ["Time(s) Present", this.estAttendance?.noPresentDays],
    ["Time(s) Absent", this.estAttendance?.noAbsentDays],
  ],
  styles: {
    fontSize: 7, // Match the font size in your table
    cellPadding: 3,
    lineColor: '#808080', 
    lineWidth: 0.1,
  },
  alternateRowStyles: {
    fillColor: [255, 255, 255] // Light gray for alternate rows
  },
  columnStyles: {
    0: { halign: "left" }, // First column styled bold
    1: { halign: "center" },                 // Second column centered
  },
  startY: psycoTrailTableEndY + 5, 
  tableWidth: 260, 
  margin: { top: 150, left: 20, bottom: 30 }
});
    
    
    
    
const tableContent = "5 = Distinction  4 = Very Good  3 = Good  2 = Poor  1 = Needs Attention";

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
  startY: gradeTrailTableEndY + 5, tableWidth: 280, margin: { top: 150, left: 300, bottom: 30 },
  theme: "plain", // No borders or gridlines
});

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
    { content: "Illness Stats", colSpan: 2, styles: { halign: "center", fontStyle: "bold", fontSize: 7 } }
  ],
  [ // Second row with individual column headers
    { content: "Beginning of Term", styles: { fontStyle: "bold", fontSize:  6} },
    { content: "End of Term", styles: { fontStyle: "bold", fontSize: 6 } },
    { content: "Beginning of Term", styles: { fontStyle: "bold", fontSize: 6 } },
    { content: "End of Term", styles: { fontStyle: "bold", fontSize: 6 } },
    { content: "Number of days absent due to Illness", styles: { fontStyle: "bold", fontSize: 6 } },
    { content: "Nature of Illness", styles: { fontStyle: "bold", fontSize: 6 } }
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
doc.setFont('', '', '700');
    //doc.text('Physical Development & Health', 65, 490);
    doc.text('PHYSICAL DEVELOPMENT & HEALTH' ?? '', pageWidth / 2, mykeyTrailTableEndY + 30, {align: 'center'});

// Add AutoTable to the PDF
autoTable(doc, {
  head: tableHeaders as RowInput[],
  body: data,
  startY: mykeyTrailTableEndY + 35,
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




const tableClubHeaders = [
  { content: "CLUB", styles: { halign: "center", fontSize: 5 } },
  { content: "OFFICE HELD", styles: { halign: "center", fontSize: 5 } },
  { content: "SIGNIFICANT CONTRIBUTION", styles: { halign: "center", fontSize: 5 } }
];

// Define data rows (the content can be dynamically inserted)
const tableClubData = [
  ["", "", ""], // Empty row 1
  ["", "", ""], // Empty row 2
];

// Add the table using AutoTable
autoTable(doc, {
  head: [tableClubHeaders] as RowInput[], // Pass headers as an array of headers
  body: tableClubData,         // Position the table a bit lower from the top
  theme: "grid",        // Grid theme for the table
  styles: {
    fontSize: 6,
    cellPadding: 2,
    lineColor: '#808080', 
    lineWidth: 0.1,
  },
  startY: bmiTrailTableEndY + 20, tableWidth: 170, margin: { top: 150, left: 400, bottom: 30 },
  headStyles: {
    fillColor: [255, 255, 255],
    fontSize: 6,
    textColor: [0, 0, 0]
  },
  bodyStyles: {
    textColor: [0, 0, 0],  // Black text for the body
  },
  columnStyles: {
    0: { halign: "center" }, // Center-align the first column
    1: { halign: "center" }, // Center-align the second column
    2: { halign: "center" }, // Center-align the third column
  }
});

    // autoTable(doc, { html: '#psyco', useCss: true, styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 6 }, headStyles: { lineColor: 'white' }, startY: 473, tableWidth: 130, margin: { top: 150, left: 20, bottom: 30 }})
    // autoTable(doc, { html: '#psyco2', useCss: true, styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 6 }, headStyles: { lineColor: 'white' }, startY: 473, tableWidth: 130, margin: { top: 150, left: 150, bottom: 30 }})

    //autoTable(doc, { html: '#attend',  useCss: true, styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 6 }, headStyles: { lineColor: 'white' }, startY: psycoTrailTableEndY + 5, tableWidth: 260, margin: { top: 150, left: 20, bottom: 30 }})
    //autoTable(doc, { html: '#mykey',  useCss: true, styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 6 }, headStyles: { lineColor: 'white' }, startY: 597, tableWidth: 270, margin: { top: 150, left: 300, bottom: 30 }})
  
    // doc.setFont('', '', '700');
    // doc.setFontSize(9);
    // //doc.text('Physical Development & Health', 65, 490);
    // doc.text('PHYSICAL DEVELOPMENT & HEALTH' ?? '', pageWidth / 2, 629, {align: 'center'});
    // autoTable(doc, { html: '#ireg', useCss: true, styles: { font: '6px', lineColor: '#808080', lineWidth: 0.2, fontSize: 7, halign: 'center'}, headStyles: { lineColor: 'white', fontSize: 8, fontStyle: 'bold'}, startY: 634, margin: { top: 150, left: 20, bottom: 30 }})


    doc.setTextColor('rgb(0, 0, 0)');
    doc.setFontSize(8);
    doc.setFont('', '', '600');
    let prinSig = doc.splitTextToSize('Doctor\'s Remark', 80);
    doc.text(prinSig, 20, bmiTrailTableEndY + 20 + 15);

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(1);
    doc.line(80, bmiTrailTableEndY + 20, 390, bmiTrailTableEndY + 20);
    doc.line(80, bmiTrailTableEndY + 20, 80, bmiTrailTableEndY + 20 + 30);
    doc.line(80, bmiTrailTableEndY + 20 + 30, 390, bmiTrailTableEndY + 20 + 30);
    doc.line(390, bmiTrailTableEndY + 20 + 30, 390, bmiTrailTableEndY + 20);

    //autoTable(doc, { html: '#club', useCss: true, styles: { font: '8px', lineWidth: 0.2, fontSize: 6 }, startY: 690, tableWidth: 170, margin: { top: 150, left: 400, bottom: 30 }})
   
    doc.save('My_Results');
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

renderPdfChart() {
  // Create the chart in memory (without displaying it in the browser)
  const canvas = document.getElementById('myChart') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');

  this.chartAverageScore = this.resultlist.map(item => item.average);
  this.chartLowestScore = this.resultlist.map(item => item.lowestScore);
  this.chartHighestScore = this.resultlist.map(item => item.highestScore);
  this.chartTotalScore = this.resultlist.map(item => item.totalScore);
  this.chartSubjects = this.resultlist.map(item => item.subject);


  console.log(this.chartSubjects);
  // Create chart
  const myPieChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: this.chartSubjects,
      datasets: [
        {
          label: 'My Score',
          backgroundColor: 'rgb(19, 78, 227)',
          borderColor: 'rgb(19, 78, 227)',
          pointBackgroundColor: 'rgb(19, 78, 227)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(255,99,132,0.8)',
          pointStyle: 'circle',
          pointRadius: 8,
          pointHoverRadius: 15,
          data: this.chartTotalScore
        },
        {
          label: 'Highest Score',
          backgroundColor: 'rgba(255,99,132,1)',
          borderColor: 'rgba(255,99,132,1)',
          pointBackgroundColor: 'rgba(255,99,132,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(255,99,132,0.8)',
          pointStyle: 'circle',
          pointRadius: 8,
          pointHoverRadius: 15,
          data: this.chartHighestScore
        },
        {
          label: 'Lowest Score',
          backgroundColor: 'rgb(67, 193, 25)',
          borderColor: 'rgb(67, 193, 25)',
          pointBackgroundColor: 'rgb(67, 193, 25)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(255,99,132,0.8)',
          pointStyle: 'circle',
          pointRadius: 8,
          pointHoverRadius: 15,
          data: this.chartLowestScore
        },
        {
          label: 'Average Score',
          backgroundColor: 'rgb(227, 168, 19)',
          borderColor: 'rgb(227, 168, 19)',
          pointBackgroundColor: 'rgb(227, 168, 19)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(255,99,132,0.8)',
          pointStyle: 'circle',
          pointRadius: 8,
          pointHoverRadius: 15,
          data: this.chartAverageScore
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          ticks: {
            maxRotation: 45,  // Rotate labels to 90 degrees (vertical)
            minRotation: 45,
          }
        },
        y: {
          beginAtZero: false
        }
      },
      plugins: {
        legend: {
          position: 'top',
        },
      },
      animation: {
        onComplete: (animation) => {
            // Code to run after animation completes
            console.log("Animation completed");
            var doc = new jsPDF('p', 'pt', 'letter');
            //const doc = new jsPDF();
            var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
 

    doc.setFont('Ariel', 'normal', '900');
    doc.setTextColor('rgb(36, 91, 143)');
    doc.setFontSize(34);
    //doc.text('Notre Dame Girls\' Academy' ?? '', pageWidth / 2, 30, {align: 'center'});
    doc.text('Notre Dame Girls\' Academy' ?? '', pageWidth / 2, 40, {align: 'center'});
    
    
    //doc.text(this.myschool.schoolName, 120, 30);
    
    // doc.addImage(this.docimg, 'PNG', 20, 8, 70, 60);
    // doc.addImage(this.signatureimg, 'PNG', 495, 705, 70, 55);

    if (this.genk.logoString) {
      doc.addImage(this.genk.logoString, 'PNG', 20, 8, 70, 60);
    }

    if (this.genk.signatureString) {
      doc.addImage(this.genk.signatureString, 'PNG', 495, 705, 70, 55);
    }
    doc.setFontSize(18);
    doc.setTextColor('rgb(255, 0, 0)');
    doc.setFont('', '', '600');
    //doc.text('Postal Address:', 20, 60);
    doc.text(' P.O.Box 46 Kuje-Abuja', pageWidth / 2, 62, {align: 'center'});
    
    doc.setFontSize(13);
    doc.setTextColor('rgb(0, 0, 0)');
    doc.setFont('', '', '700');
    //let me = doc.splitTextToSize(this.myschool?.address ?? '', 220);
    doc.text('TERMLY EVALUATION ANALYSIS FOR AJALA , ANUOLUWAPO ASHLEY ', pageWidth / 2, 85, {align: 'center'});

    doc.setFontSize(12);
    doc.setFont('', '', '600');
    let tee = doc.splitTextToSize('Form Teacher\'s Comment:', 200);
    doc.text(tee, 30, 500);
    doc.setFont('', '', '500');
    doc.setTextColor('rgb(36, 91, 143)');
    doc.setFontSize(10);
    let formtea = doc.splitTextToSize(this.resultComment?.formTeacherComment ?? '', 500);
    doc.text(formtea, 30, 515);
    
    doc.setTextColor('rgb(0, 0, 0)');
    doc.setFont('', '', '600');
    doc.setFontSize(12);
    let pea = doc.splitTextToSize('Principal\'s Comment:', 200);
    doc.text(pea, 30, 560);
    doc.setFont('', '', '500');
    doc.setTextColor('rgb(36, 91, 143)');
    doc.setFontSize(10);
    let princom = doc.splitTextToSize(this.resultComment?.principalComment ?? '', 500);
    doc.text(princom, 30, 575);

    doc.setTextColor('rgb(36, 91, 143)');
    doc.setFontSize(9);
    doc.setFont('', '', '600');
    let prinSig = doc.splitTextToSize('Principal\'s Signature Date & Stamp:', 80);
    doc.text(prinSig, 415, 730);

            const chartImage = canvas.toDataURL('image/png');
            console.log(chartImage);
      //const pdf = new jsPDF();

      // Add image to PDF
      doc.addImage(chartImage, 'PNG', 20, 150, 560, 280, undefined, 'SLOW');

      // Save the PDF to file
      doc.save('chart.pdf');
      const oldCanvas = document.getElementById('myChart');
const parentDiv = document.getElementById('chartdiv');
parentDiv.removeChild(oldCanvas);

// Recreate the canvas
const newCanvas = document.createElement('canvas');
newCanvas.id = 'myChart';
newCanvas.width = 3600;
newCanvas.height = 1800;
newCanvas.style.display = 'none';

// Append the new canvas to the parent div
parentDiv.appendChild(newCanvas);

        },
        // You can also add other properties such as duration, easing, etc.
        duration: 1000,
    }
    }
  });
}

}
