import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import jspdf, { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
//import html2canvas from 'html2canvas';

@Component({
  templateUrl: './student-result.component.html',
  styleUrls: ['../../table.css', 'result.component.css']
})
export class StudentResultComponent implements OnInit {
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
  gradeScalelist = [];
  caSetupData: any;
  caSetupScoreData: any;
  currentClassId: string;
  currentSessionId: string;
  currentSession: string;
  currentTerm: string;
  docimg: any;
  signatureimg: any;
  average: string;
  position: string;
  resultComment: any;
  gradescaletextlist: string[] = [];
  loadingResult = false;

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

  ngOnInit(): void {
    this.genk.topdata = 'Result';
    this.studentId = this.activeRoute.snapshot.params['id'];
    this.activeRoute.queryParams.subscribe(
      params => {
        this.currentTerm = params['term'];
        this.currentSessionId = params['currentSessionId'];
        this.currentSession = params['currentSession'];
        this.currentClassId = params['classId'];
        this.average = params['average'];
        this.position = params['position'];
      }
    )
    this.getSchool();
    this.getStudent();
    this.getNoInClass();
    this.getResultsByStudent();
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

  getSchool() {
    this.sch.getSchoolData()
      .subscribe(res => {
        this.myschool = res;
      })
  }

  getStudent() {
    this.sch.getStudentById(this.studentId.toString())
      .subscribe(res => {
        debugger
        this.studentobj = res;
        this.addLogo();
        this.addSignature();
      })
  }

  getNoInClass() {
    this.sch.getNoInClass(this.studentId.toString())
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
    this.loadingResult = true;
    this.sch.getResultsByStudent(this.currentClassId, this.currentSessionId.toString(), this.currentTerm, this.studentId)
      .subscribe(res => {
        this.resultlist = res;
        this.loadingResult = false;
      })
  }

  getStudentResultComment() {
    this.sch.getStudentResultComment(this.currentClassId, this.currentSessionId.toString(), this.currentTerm, this.studentId)
      .subscribe(res => {
        this.resultComment = res;
      })
  }

  getCaSetupByClass() {
    this.sch.getCaSetupByClass(this.currentClassId, this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        this.caSetupData = res.systemname;
        this.caSetupScoreData = res.score;
      });
  }

  getGradeScaleByClass() {
    this.sch.getGradeScaleByClass(this.currentClassId)
      .subscribe(res => {
        this.gradeScalelist = res;
        this.gradescaletextlist.push(this.gradeScalelist[0].classLevel + ':');
        let mytext;
        this.gradeScalelist.forEach(a => {
          mytext = a.grade + " " + '=' + ' ' + a.remarks + ' ' + '(' + a.begLimit + ' ' + '-' + ' ' + a.endLimit + ')' ;
          this.gradescaletextlist.push(mytext);
        });
      });
  }


  public convertToPDF(table: HTMLTableElement) {

    debugger;
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
      doc.addImage(this.genk.signatureString, 'PNG', 500, 695, 70, 55);
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
    doc.text(this.studentobj?.class ?? '', 113, 132);

    doc.setFont('', '', '700');
    doc.text('NO. IN CLASS:', 20, 144);
    doc.setFont('', '', '500');
    doc.text(this.noInClass.toString(), 113, 144);

    doc.setFont('', '', '700');
    doc.text('AVERAGE SCORE:', 20, 156);
    doc.setFont('', '', '500');
    doc.text(this.average.toString(), 113, 156);

    doc.setFont('', '', '700');
    doc.text('POSITION IN CLASS:', 20, 168);
    doc.setFont('', '', '500');
    doc.text(this.position.toString(), 113, 168);

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
    doc.text('NEXT TERM BEGINS:', 380, 156);
    doc.setFont('', '', '500');
    doc.text('', 460, 156);

    doc.setFontSize(12);
    doc.setFont('', '', '700');
    doc.text('REPORT SHEET FOR JUNIOR AND SENIOR SECONDARY',pageWidth / 2, 190, {align: 'center'});

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
      bell[i] = bell[i] + '(' + bellScore[i] + '%)';
    }

    bell.forEach(a => {
      a = a + '(' + this.caSetupScoreData.CA1 + '%)'
    })
    let bess = ['Subject', ...bell, 'Total Score', 'Grade', 'Remark', 'Position', 'Lowest Score', 'Highest Score', 'Average'];
    let arr = bodyArray;

    autoTable(doc, { head: [bess], useCss: true, body: bodyArray,
    styles: { font: '8px', lineColor: '#808080', lineWidth: 0.1, fontSize: 8, cellPadding: 3}, headStyles: { fontSize: 6, lineColor: 'white', textColor: 'white', fillColor: [45, 113, 177]}, startY: 200, margin: {left: 20}});
    
    const customersTrailTableEndY = (doc as any).previousAutoTable.finalY;




    // autoTable(doc, { html: '#customers', styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 8 }, headStyles: { lineColor: 'white' }, startY: 200, margin: { top: 150, left: 20, bottom: 70 }})
    doc.setFontSize(10);

    const gradescaletextlist = ["A = Excellent", "B = Good", "C = Fair", "D = Poor", "F = Fail"];

  //   const tableData = [
  //     [
  //         { content: "KEY TO GRADE:", styles: { halign: "center", fontStyle: "bold" } },
  //         { content: gradescaletextlist.join("  "), styles: { halign: "left" } }
  //     ],
  //     [
  //         { content: "KEY TO RATINGS:", styles: { halign: "center", fontStyle: "bold" } },
  //         {
  //             content: "1 = Very Poor  2 = Poor  3 = Fair  4 = Good  5 = Excellent",
  //             styles: { halign: "left" }
  //         }
  //     ]
  // ];

  // Add table to the PDF
  autoTable(doc, {
      body: [
        [
            { content: "KEY TO GRADE:", styles: { halign: "center", fontStyle: "bold" } },
            { content: gradescaletextlist.join("  "), styles: { halign: "left" } }
        ],
        [
            { content: "KEY TO RATINGS:", styles: { halign: "center", fontStyle: "bold" } },
            {
                content: "1 = Very Poor  2 = Poor  3 = Fair  4 = Good  5 = Excellent",
                styles: { halign: "left" }
            }
        ]
    ],
      //styles: { border: 1 },
      styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 8 },
      startY: 620, 
      tableWidth: 552,
      margin: {left: 20},
      theme: "grid",
      // columnStyles: {
      //     0: { cellWidth: 60 }, // Adjust column width for the first column
      //     1: { cellWidth: 120 } // Adjust column width for the second column
      // },
      // didDrawCell: (data) => {
      //     // Optional customization for cell rendering
      // }
  });

    // autoTable(doc, { html: '#mykey', styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 8 }, headStyles: { lineColor: 'white' }, startY: 620, margin: { top: 150, left: 20, bottom: 30 }})
    
    doc.setFontSize(8);
    doc.setFont('', '', '700');
    let tee = doc.splitTextToSize('Form Teacher\'s Comment:', 100);
    doc.text(tee, 20, 700);
    doc.setFont('', '', '500');
    doc.setTextColor('rgb(36, 91, 143)');
    let formtea = doc.splitTextToSize(this.resultComment?.formTeacherComment ?? '', 370);
    doc.text(formtea, 119, 700);
    
    doc.setTextColor('rgb(0, 0, 0)');
    doc.setFont('', '', '700');
    let pea = doc.splitTextToSize('Principal\'s Comment:', 100);
    doc.text(pea, 20, 730);
    doc.setFont('', '', '500');
    doc.setTextColor('rgb(36, 91, 143)');
    let princom = doc.splitTextToSize(this.resultComment?.principalComment ?? '', 370);
    doc.text(princom, 103, 730);
    
    // autoTable(doc, {
    //     body: body,
    //     styles: {font: '8px', halign : 'center'},
    //     startY: 70,
    //     theme: 'grid',
    //              })
    // save the data to this file
    doc.save('My_Results');
  }

  addLogo() {
    this.sch.getSchoolLogo(this.myschool.id)
    .subscribe(event => {
      debugger
        const nee = this.genk.getLogoMediaBase64(event, event.type);
      
      //console.log(this.docimg);
    });
  }

  addSignature() {
    this.sch.obtainSignature(this.currentSessionId, this.currentTerm)
    .subscribe(event => {
          const nee = this.genk.getMediaBase64(event, event.type);
      //console.log(this.signatureimg);
    });
  }

  // addLogo() {
  //   this.getBase64ImageFromUrl(this.genk.imgurl + 'api/school/getSchoolLogo?'  + new URLSearchParams({id: this.myschool.id}))
  //   .then(result => this.docimg = result)
  //   .catch(err => console.error(err));
  // }

  // addSignature() {
  //   this.getBase64ImageFromUrl(this.genk.imgurl + 'api/school/getSchoolSig?'  + new URLSearchParams({id: this.myschool.id}))
  //   .then(result => this.signatureimg = result)
  //   .catch(err => console.error(err));
  // }

async getBase64ImageFromUrl(imageUrl) {
  var res = await fetch(imageUrl);
  //var blob = await res.blob();

  const base64Image = await res.text();
  const contentType = 'image/png'; // Adjust according to your image type
  var blob = this.base64ToBlob(base64Image, contentType);

  return new Promise((resolve, reject) => {
    
    var reader = new FileReader();
    reader.addEventListener("load", function () {
      resolve(reader.result);
    }, false);

    reader.onerror = () => {
      return reject(this);
    };
    reader.readAsDataURL(blob);
  })
};


base64ToBlob(base64, contentType = '') {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

}
