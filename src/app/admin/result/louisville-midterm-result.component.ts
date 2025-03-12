import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import jspdf, { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
//import html2canvas from 'html2canvas';

@Component({
  templateUrl: './louisville-midterm-result.component.html',
  styleUrls: ['../../table.css']
})
export class LouisvilleMidtermResultComponent implements OnInit {
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
  midtermMaxValue: number;

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
      }
    )
    this.getSchool();
    this.getMidtermMax();
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
      .subscribe(async res => {
        this.myschool = res;
        this.addLogo();
        this.addSignature();
      })
  }

  getStudent() {
    this.sch.getStudentById(this.studentId.toString())
      .subscribe(res => {
        this.studentobj = res;
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
  getMidtermMax() {
    this.sch.getMidtermMaxValue(this.currentClassId, this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        this.midtermMaxValue = res.max;
      })
  }

  getResultsByStudent() {
    this.sch.getMidtermResultsPageSession(this.currentClassId, this.currentSessionId.toString(), this.currentTerm, this.studentId)
      .subscribe(res => {
        this.resultlist = res;
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

  overMinNum(value: number, overnum: number) {
    //debugger
    let reel = 0;
    let nee = ((value / 100) * overnum).toString();
    let arr = nee.split('.');
    if (arr.length > 1) {
      reel =  Number(arr[0] + '.' + arr[1][0]);
    } else {
      reel =  Number(arr[0]);
    }
    return reel;
  }

  calMinGrade(value: number) {
    let sa;
    this.gradeScalelist.forEach(ele => {
        let begLimit = this.overMinNum(ele.begLimit, this.midtermMaxValue);
        let endLimit = this.overMinNum(ele.endLimit, this.midtermMaxValue);
      if (value >= begLimit && value <= endLimit) {
        sa = {grade: ele.grade, remark: ele.remarks};
      }
    });
    return sa ? sa : {grade: 'i', remark: 'Not Aplicable'};
  }

  toNumber(value: string) {
    return Number(value).toFixed(1);
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
      doc.addImage(this.genk.signatureString, 'PNG', 495, 705, 90, 55);
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
    doc.text('MID TERM RESULT FOR JUNIOR SECONDARY SCHOOL',pageWidth / 2, 190, {align: 'center'});


    autoTable(doc, { html: '#customerslouismidterm', styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 8 }, headStyles: { lineColor: 'white' }, startY: 200, margin: { top: 150, left: 20, bottom: 70 }})
    doc.setFontSize(10);

    autoTable(doc, { html: '#mykey', styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 8 }, headStyles: { lineColor: 'white' }, startY: 620, margin: { top: 150, left: 20, bottom: 30 }})
    
    // doc.setFontSize(8);
    // doc.setFont('', '', '700');
    // let tee = doc.splitTextToSize('Form Teacher\'s Comment:', 100);
    // doc.text(tee, 20, 700);
    // doc.setFont('', '', '500');
    // doc.setTextColor('rgb(36, 91, 143)');
    // let formtea = doc.splitTextToSize(this.resultComment?.formTeacherComment ?? '', 370);
    // doc.text(formtea, 119, 700);
    
    // doc.setTextColor('rgb(0, 0, 0)');
    // doc.setFont('', '', '700');
    // let pea = doc.splitTextToSize('Principal\'s Comment:', 100);
    // doc.text(pea, 20, 730);
    // doc.setFont('', '', '500');
    // doc.setTextColor('rgb(36, 91, 143)');
    // let princom = doc.splitTextToSize(this.resultComment?.principalComment ?? '', 370);
    // doc.text(princom, 103, 730);

    doc.setTextColor('rgb(36, 91, 143)');
    doc.setFontSize(9);
    doc.setFont('', '', '600');
    let prinSig = doc.splitTextToSize('Principal\'s Signature:', 80);
    doc.text(prinSig, 415, 730);

    doc.setFontSize(9);
    doc.setFont('', '', '600');
    doc.setTextColor('rgb(36, 91, 143)');
    let tee = doc.splitTextToSize('Form Teacher\'s Signature:', 100);
    doc.text(tee, 20, 540);
    // doc.setFont('', '', '200');
    // doc.setTextColor('rgb(0, 0, 0)');
    // let formtea = doc.splitTextToSize(this.resultComment?.formTeacherComment ?? '', 370);
    // doc.text(formtea, 176, 670);

    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(1)
    doc.line(170, 543, 580, 543);

    
    doc.setFontSize(9);
    doc.setFont('', '', '600');
    doc.setTextColor('rgb(36, 91, 143)');
    let pea = doc.splitTextToSize('Date & Stamp:', 100);
    doc.text(pea, 20, 575);
    // doc.setFont('', '', '200');
    // doc.setTextColor('rgb(0, 0, 0)');
    // let princom = doc.splitTextToSize(this.resultComment?.principalComment ?? '', 370);
    // doc.text(princom, 176, 690);

    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(1);
    doc.line(170, 578, 580, 578);


    
    
    // autoTable(doc, {
    //     body: body,
    //     styles: {font: '8px', halign : 'center'},
    //     startY: 70,
    //     theme: 'grid',
    //              })
    // save the data to this file
    doc.save('My_Results');
  }


  public convertToPDFLouis() {

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
      doc.addImage(this.genk.signatureString, 'PNG', 495, 705, 90, 55);
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
    doc.text('MID TERM RESULT FOR JUNIOR SECONDARY SCHOOL',pageWidth / 2, 190, {align: 'center'});

    let resu = this.resultlist;
    let bodyArray = [];
    resu.forEach(c => {
      let resArray = [];
      resArray.push(c.subject);
      resArray.push(Number(Number(c.totalScore).toFixed(2)));
      resArray.push(this.calMinGrade(Number(this.toNumber(c.totalScore)))?.grade ?? '');
      bodyArray.push(resArray);
    })



// let casetup = this.caSetupData;
// let bellCap = Object.keys(casetup) as any[];
// let bell = Object.values(casetup) as any[];
// let bellScore = Object.values(this.caSetupScoreData) as any[];
// for (let i = 0; i < bell.length; i++) {
// bell[i] = bell[i] ;
// }

// bell.forEach(a => {
//   a = a + '(' + this.caSetupScoreData.CA1 + '%)'
// })
let bess = ['Subject', 'Score(' + this.midtermMaxValue + '%)', 'Grade'];
let arr = bodyArray;

autoTable(doc, { head: [bess],
body: bodyArray,
alternateRowStyles: {
fillColor: [245, 245, 245] // Light gray for alternate rows
},
styles: { font: '8px', lineColor: [200, 200, 200], lineWidth: 0.1, fontSize: 9, cellPadding: 5}, 
headStyles: { fontSize: 9, lineColor: 'white', halign: 'left', valign: 'middle', textColor: 'white', fillColor: [45, 113, 177], cellPadding: [5, 5, 5, 3]}, 
startY: 205, 
tableWidth: 562,
margin: {left: 20}});


    // autoTable(doc, { html: '#customerslouismidterm', styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 8 }, headStyles: { lineColor: 'white' }, startY: 200, margin: { top: 150, left: 20, bottom: 70 }})
    // doc.setFontSize(10);

    // autoTable(doc, { html: '#mykey', styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 8 }, headStyles: { lineColor: 'white' }, startY: 620, margin: { top: 150, left: 20, bottom: 30 }})
    
    // doc.setFontSize(8);
    // doc.setFont('', '', '700');
    // let tee = doc.splitTextToSize('Form Teacher\'s Comment:', 100);
    // doc.text(tee, 20, 700);
    // doc.setFont('', '', '500');
    // doc.setTextColor('rgb(36, 91, 143)');
    // let formtea = doc.splitTextToSize(this.resultComment?.formTeacherComment ?? '', 370);
    // doc.text(formtea, 119, 700);
    
    // doc.setTextColor('rgb(0, 0, 0)');
    // doc.setFont('', '', '700');
    // let pea = doc.splitTextToSize('Principal\'s Comment:', 100);
    // doc.text(pea, 20, 730);
    // doc.setFont('', '', '500');
    // doc.setTextColor('rgb(36, 91, 143)');
    // let princom = doc.splitTextToSize(this.resultComment?.principalComment ?? '', 370);
    // doc.text(princom, 103, 730);

    doc.setTextColor('rgb(36, 91, 143)');
    doc.setFontSize(9);
    doc.setFont('', '', '600');
    let prinSig = doc.splitTextToSize('Principal\'s Signature:', 80);
    doc.text(prinSig, 415, 730);

    doc.setFontSize(9);
    doc.setFont('', '', '600');
    doc.setTextColor('rgb(36, 91, 143)');
    let tee = doc.splitTextToSize('Form Teacher\'s Signature:', 100);
    doc.text(tee, 20, 540);
    // doc.setFont('', '', '200');
    // doc.setTextColor('rgb(0, 0, 0)');
    // let formtea = doc.splitTextToSize(this.resultComment?.formTeacherComment ?? '', 370);
    // doc.text(formtea, 176, 670);

    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(1)
    doc.line(170, 543, 580, 543);

    
    doc.setFontSize(9);
    doc.setFont('', '', '600');
    doc.setTextColor('rgb(36, 91, 143)');
    let pea = doc.splitTextToSize('Date & Stamp:', 100);
    doc.text(pea, 20, 575);
    // doc.setFont('', '', '200');
    // doc.setTextColor('rgb(0, 0, 0)');
    // let princom = doc.splitTextToSize(this.resultComment?.principalComment ?? '', 370);
    // doc.text(princom, 176, 690);

    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(1);
    doc.line(170, 578, 580, 578);


    
    
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
      debugger;
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
