import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import jspdf, { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import JSZip from 'jszip';
import Swal from 'sweetalert2';
//import html2canvas from 'html2canvas';

@Component({
  templateUrl: './trailblazers-multiple-result.component.html',
  styleUrls: ['../../table.css']
})
export class TrailblazerMultipleResultComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  myschool: any;
  studentId: string;
  studentobj: any;
  noInClass: number;
  resultlist = [];
  resultviewlist = [];
  resu = [];
  gradeScalelist = [];
  resArray = [];
  caSetupData: any;
  currentClassId: string;
  currentClassName: string;
  currentSessionId: string;
  currentSession: string;
  currentTerm: string;
  docimg: any;
  signatureimg: any;
  pdfFolders: JSZip;
  zip: JSZip;
  goo = 0;
//   average: string;
//   position: string;
  resultComment: any;
  gradescaletextlist: string[] = [];
  downloadCount = 0;
  average: string;
  averageObj: any;
  position: string;
  classAverage: string;
  logoLoaded = false;
  subjectOffered = 0;
  markObtainable = 0;
  displayValue = 'hidden';
  bmi: any;
  estAttendance: any;
  house: any
  studentTotal: number;
  caSetupScoreData: any;
  className: string;
  nextResumptionDate: string;
  psycomotorlist = [];
  psycomotorlistBulk = [];

  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private activeRoute: ActivatedRoute,
    private sch: SchoolService,
    private gen: GenericService
  ) {
    this.genk = gen;
    this.userName = auth.currentUserValue.name;
    this.userImgPath = auth.currentUserValue.logo;
    this.adminStatus = auth.currentUserValue.status;
  }

  ngOnInit() {
    this.startProcessingModal();
    this.genk.topdata = 'Trailblazer Result';
    debugger

    const navigation = this.router.getCurrentNavigation();
  const state = navigation?.extras.state as { data: any[] };
  if (state && state.data) {
    this.averageObj = state.data;
  }
    
    //this.studentId = this.activeRoute.snapshot.params['id'];
    this.activeRoute.queryParams.subscribe(
      params => {
        this.currentTerm = params['term'];
        this.currentSessionId = params['currentSessionId'];
        this.currentSession = params['currentSession'];
        this.currentClassId = params['classId'];
        this.currentClassName = params['className'];
        this.averageObj = JSON.parse(params['averageObj']);
        this.average = params['average'];
        this.position = params['position'];
        this.classAverage = params['classAverage'];

        this.zip = new JSZip();
        this.pdfFolders = this.zip.folder(this.currentClassName + '_' + 'Results');
        // this.average = params['average'];
        // this.position = params['position'];
      }
    )

    
    this.getSchool();
    // this.getStudent();
    this.getNoInClass();
    
    this.getCaSetupByClass();
    this.getGradeScaleByClass();
    this.getStudentResultComment();
    //this.getResultsByStudent();

    // this.getStudent();
    // this.getStudentTotal();
    // //this.getNoInClass();
    // this.getClassNames();
    // this.getResultsByStudent();
    this.getPsycomotorByStudent();
    // this.getStudentBMI();
    // this.getStudentEstimatedAttendance();
    // this.getStudentHouse();
    // this.getNextTerm();
   
    
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
      .subscribe(async res => {
        this.myschool = res;
      })
  }

  // getStudent() {
  //   this.sch.getStudentById(this.studentId.toString())
  //     .subscribe(res => {
  //       this.studentobj = res;
  //       this.addLogo();
  //       this.addSignature();
  //     })
  // }

  getNoInClass() {
    this.sch.getNoInClassId(this.currentClassId.toString())
      .subscribe(res => {
        this.noInClass = res.count;
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
    this.sch.getResultsByStudentAll(this.currentClassId, this.currentSessionId.toString(), this.currentTerm, this.studentId)
      .subscribe(async res => {
        this.resultlist = res;
        await this.addLogo();
        this.addSignature();

        const interval = setInterval(() => {
          if (this.genk.logoString) {
            clearInterval(interval); // Stop checking once the condition is met
            this.getResultsAverageByClass(); // Call the desired function
          }
        }, 500);
       
        
      })
  }

  getStudentResultComment() {
    this.sch.getStudentResultCommentByClass(this.currentClassId, this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        this.resultComment = res;
      })
  }

  getCaSetupByClass() {
    this.sch.getCaSetupByClass(this.currentClassId, this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        this.caSetupData = res.systemname;
        this.caSetupScoreData = res.score;
        this.getResultsByStudent();
      });
  }

  getGradeScaleByClass() {
    this.sch.getGradeScaleByClass(this.currentClassId)
      .subscribe(res => {

        this.gradeScalelist = res;
      });
  }

  getPsycomotorByStudent() {
    this.sch.getPsycomotorByClass(this.currentSessionId.toString(), this.currentTerm, this.currentClassId)
      .subscribe(res => {
        this.psycomotorlistBulk = res;
        //this.psycomotorlist2 = res.slice(Math.round(res.length / 2), res.length);
        if (res.length < 1) {
          this.sch.getSkillList().subscribe(res => {
            this.psycomotorlist = res;
          })
        }
      });
  }


convertToPDF(average: number, position: any, bodyArray: any[], studentName: string, studentClass: string, admissionNo: string, formTeacherComment: string, principalComment: string, avebox: any) {
    
  var doc = new jsPDF('p', 'pt', 'letter');
    var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
 

    doc.setFont('Trebuchet MS', 'normal', '900');
    doc.setTextColor('rgb(36, 91, 143)');
    doc.setFontSize(20);
    doc.text(this.myschool?.schoolName ?? '', pageWidth / 2, 30, {align: 'center'});
    
    
    //doc.text(this.myschool.schoolName, 120, 30);
    
    // doc.addImage(this.docimg, 'PNG', 270, 40, 55, 55);
    // doc.addImage(this.signatureimg, 'PNG', 500, 695, 70, 55);
    if (this.genk.logoString) {
      doc.addImage(this.genk.logoString, 'PNG', 80, 15, 50, 50);
    }
    //let bee = await this.signatureimg;
    if (this.genk.signatureString) {
      doc.addImage(this.genk.signatureString, 'PNG', 495, 730, 70, 55);
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


    // doc.setDrawColor(36, 91, 143);
    // doc.setLineWidth(1);
    // doc.line(350, 50, 350, 80);


    

    doc.setFont('', '', '600');
    doc.text('Tel: ' + this.myschool?.phoneOne, pageWidth / 2, 75, {align: 'center'});

    // doc.setDrawColor(36, 91, 143);
    // doc.setLineWidth(2)
    // doc.line(20, 87, 580, 87);
    doc.setFontSize(13);
    doc.setFont('', '', '800');
    doc.text( 'REPORT SHEET', pageWidth / 2, 94, {align: 'center'});

    doc.setFontSize(8);
    autoTable(doc, { html: '#toper', useCss: true, styles: { font: '6px', lineColor: '#808080', lineWidth: 0.2, fontSize: 7, halign: 'center'}, headStyles: { lineColor: 'white', fontSize: 8, fontStyle: 'bold'}, startY: 97, margin: { top: 97, left: 20, bottom: 30 }})


    doc.setFont('', '', '600');
    doc.setFontSize(9);
    doc.text('ACADEMIC RECORD', 20, 172);


    // autoTable(doc, { html: '#customerstrail', useCss: true, headStyles: { lineColor: 'white' }, startY: 175, margin: { left: 20}})
    // doc.setFontSize(10);

    //get customertrail height
    
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
    let bess = ['Subject', ...bell, 'Total Score', 'Grade', 'Remark', 'Position', 'Lowest Score', 'Highest Score', 'Average'];
    let arr = bodyArray;

    autoTable(doc, { head: [bess], useCss: true,
      body: bodyArray,
    styles: { font: '8px', lineColor: '#808080', lineWidth: 0.1, fontSize: 8, cellPadding: 3}, headStyles: { fontSize: 6, lineColor: 'white', textColor: 'white', fillColor: [45, 113, 177]}, startY: 175, margin: {left: 20}});
    
    const customersTrailTableEndY = (doc as any).previousAutoTable.finalY;




    autoTable(doc, {
      body: [
        [
          { content: `Total Mark Obtainable: ${avebox.markObtainable}`, colSpan: 2, styles: { font: '600' } },
          { content: `Total Mark Obtained: ${avebox.stutotal}`, colSpan: 2, styles: { font: '600' } }
        ],
        [
          { content: `Pupil Average: ${avebox.average}`, styles: { font: '600' } },
          { content: `Subjects: ${avebox.subjectOffered}`, colSpan: 2, styles: { font: '600' } },
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

    

    // autoTable(doc, { html: '#analy', useCss: true, styles: {halign: 'center'}, headStyles: { fontStyle: 'bold'}, startY: customersTrailTableEndY, margin: {left: 20 }})

    const analyTableEndY = (doc as any).previousAutoTable.finalY;


    //debugger;
   

  



    //autoTable(doc, { html: '#customers', styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 8 }, headStyles: { lineColor: 'white' }, startY: 200, margin: { top: 150, left: 20, bottom: 70 }})
    // doc.setFontSize(10);

    // autoTable(doc, { html: '#mykey', styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 8 }, headStyles: { lineColor: 'white' }, startY: 620, margin: { top: 150, left: 20, bottom: 30 }})
    
    // doc.setFontSize(8);
    // doc.setFont('', '', '700');
    // let tee = doc.splitTextToSize('Form Teacher\'s Comment:', 100);
    // doc.text(tee, 20, 700);
    // doc.setFont('', '', '500');
    // doc.setTextColor('rgb(36, 91, 143)');
    // let formtea = doc.splitTextToSize(formTeacherComment ?? '', 370);
    // doc.text(formtea, 119, 700);
    
    // doc.setTextColor('rgb(0, 0, 0)');
    // doc.setFont('', '', '700');
    // let pea = doc.splitTextToSize('Principal\'s Comment:', 100);
    // doc.text(pea, 20, 730);
    // doc.setFont('', '', '500');
    // doc.setTextColor('rgb(36, 91, 143)');
    // let princom = doc.splitTextToSize(principalComment ?? '', 370);
    // doc.text(princom, 103, 730);

    autoTable(doc, { html: '#psyco', useCss: true, styles: { font: '8px', lineWidth: 0.2, fontSize: 6 }, startY: analyTableEndY + 20, tableWidth: 150, margin: {left: 20}})

    // autoTable(doc, { html: '#attend',  useCss: true, styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 6 }, headStyles: { lineColor: 'white' }, startY: 550, tableWidth: 260, margin: { top: 150, left: 20, bottom: 30 }})
    autoTable(doc, { html: '#mykey',  useCss: true, styles: { font: '8px', lineWidth: 0.2, fontSize: 6 }, startY: analyTableEndY + 20, tableWidth: 126, margin: { left: 172 }})
    autoTable(doc, { html: '#grade', useCss: true, styles: { font: '8px', lineWidth: 0.2, fontSize: 6 }, startY: analyTableEndY + 20, margin: {left: 300}})

    doc.setFont('', '', '700');
    doc.setFontSize(9);
    const gradeTableEndY = (doc as any).previousAutoTable.finalY;

    autoTable(doc, { html: '#mycomment',  useCss: true, startY: gradeTableEndY + 20, margin: { left: 20 }});

    this.goo = this.goo + 1;
    this.downloadCount = this.downloadCount + 1;
    const pdfBlob = doc.output('blob');
    this.pdfFolders.file(studentName.split(' ').join('_') + '_' + this.goo + '.pdf' , pdfBlob);

    //doc.save('My_Results');
  }

  addLogo(): Promise<void> {
    return new Promise((resolve) => {
      this.sch.getSchoolLogo(this.myschool.id)
        .subscribe(event => {
          const nee = this.genk.getLogoMediaBase64(event, event.type);
          resolve();
          //console.log(this.docimg);
        });
    });
  }

  addSignature() {
    this.sch.obtainSignature(this.currentSessionId, this.currentTerm)
    .subscribe(event => {
      const nee = this.genk.getMediaBase64(event, event.type);
      //console.log(this.signatureimg);
    });
  }



  async getResultsAverageByClass() {
    
    this.sch.getResultsAverageByClass(this.currentClassId, this.currentSessionId.toString(), this.currentTerm)
      .subscribe(async res => {
        this.resultviewlist = res;
        this.startDownloadModal();
        for (let i = 0; i < this.resultviewlist.length; i++) {
          //this.getStudentResultComment(this.resultviewlist[i].studentId)
          let comObj = this.resultComment.filter(t => t.studentId == this.resultviewlist[i].studentId)[0];
          this.psycomotorlist = this.psycomotorlistBulk.filter(t => t.studentId == this.resultviewlist[i].studentId);

          this.resu = this.resultlist.filter(t => t.studentId == this.resultviewlist[i].studentId)[0].result;
          this.subjectOffered = this.resu.length;
          this.markObtainable = this.resu.length * 100;
          let totscore = this.resu.map(item => item.totalScore);
          let totsum = totscore.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
          let average = this.averageObj.filter(t => t.studentId == this.resultviewlist[i].studentId)[0]?.average;
          let avebox = {subjectOffered: this.subjectOffered, markObtainable: this.markObtainable, average: average, stutotal: totsum};
          let averageList = this.resultlist.map(item => item.average);

          let bodyArray = [];
          this.resu.forEach(c => {
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
          this.convertToPDF(this.resultviewlist[i].average, this.genk.formatPosition(i + 1), bodyArray, this.resultviewlist[i].studentName, this.resultviewlist[i].classes, this.resultviewlist[i].admissionNo, comObj?.formTeacherComment, comObj?.principalComment, avebox);
          
        }
        //let bess = ['Subject', ...bell, 'Total Score', 'Grade', 'Remark', 'Position', 'Lowest Score', 'Highest Score', 'Average'];
        const zipBlob = await this.zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(zipBlob);
        link.download = this.myschool.schoolName + "_Results" + ".zip";
        link.click();
      });
  }

  startDownloadModal() {
    let timerInterval;
    Swal.fire({
      title: "Student Results Downloading!",
      html: "<b></b> Results downloaded....",
      //timer: 2000,
      //timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        //timerInterval = setInterval(() => {
          timer.textContent = `${this.downloadCount}`;
          if (this.downloadCount == this.resultviewlist.length) {
            Swal.close();
            window.history.back();
          }
        //}, 100);
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
    });
  }

  startProcessingModal() {
    let timerInterval;
    Swal.fire({
      title: "Processing Result Data...",
      //timer: 2000,
      //timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        timerInterval = setInterval(() => {
          if (this.resultviewlist.length > 0) {
            Swal.close();
          }
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
    });
  }

}
