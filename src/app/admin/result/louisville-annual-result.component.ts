import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import jspdf, { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
//import html2canvas from 'html2canvas';

@Component({
  templateUrl: './louisville-annual-result.component.html',
  styleUrls: ['../../table.css']
})
export class LouisvilleAnnualResultComponent implements OnInit {
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
  psycomotorlist = [];
  psycomotorlist2 = [];
  grademinimumlist = [];
  grademinimumlistOver60 = [];
  grademinimumlistOver40 = [];
  mySchoolClasses = [];
  caSetupData: any;
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
  className: string;
  nextResumptionDate: string;
  studentTotal: number;

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
    this.getStudent();
    this.getStudentTotal();
    //this.getNoInClass();
    this.getClassNames();
    this.getResultsByStudent();
    this.getCaSetupByClass();
    this.getGradeScaleByClass();
    this.getPsycomotorByStudent();
    this.getStudentResultComment();

    this.getNextTerm();
  }

  setImg(imgpath) {
    if (imgpath && imgpath.length > 0) {
      return this.genk.imgurl + imgpath;
    } else {
      
      return this.genk.defaultImg;
    }
  }

  calTotal(firstTermTotalScore, secondTermTotalScore, thirdTermTotalScore) {
    let total = (firstTermTotalScore ?? 0) + (secondTermTotalScore ?? 0) + (thirdTermTotalScore ?? 0);
    return total;
  }

  calTotalAverage(firstTermTotalScore, secondTermTotalScore, thirdTermTotalScore) {
    let total = (firstTermTotalScore ?? 0) + (secondTermTotalScore ?? 0) + (thirdTermTotalScore ?? 0);
    let varcount = (firstTermTotalScore ? 1 : 0) + (secondTermTotalScore ? 1 : 0) + (thirdTermTotalScore ? 1 : 0);
    return Number(total / varcount).toFixed(1);
  }

  calHighestAverage(firstTermTotalScore, secondTermTotalScore, thirdTermTotalScore, value) {
    let varcount = (firstTermTotalScore ? 1 : 0) + (secondTermTotalScore ? 1 : 0) + (thirdTermTotalScore ? 1 : 0);
    return Number(value / varcount).toFixed(1);
  }

  calGrade(value: number) {
    let sa;
    this.gradeScalelist.forEach(ele => {
      if (value >= ele.begLimit && value <= ele.endLimit) {
        sa = {grade: ele.grade, remark: ele.remarks};
      }
    });
    return sa ? sa : {grade: 'i', remark: 'Not Aplicable'};
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
      this.getNoInClass();
    });
  }

  getStudent() {
    this.sch.getStudentById(this.studentId.toString())
      .subscribe(res => {
        this.studentobj = res;
        this.addLogo();
        this.addSignature();
      })
  }

  getNoInClass() {
    this.sch.getNoInClassByAnnualSession(this.currentClassId.toString(), this.currentSessionId, this.currentTerm)
      .subscribe(res => {
        this.noInClass = res.count;
        this.className = this.mySchoolClasses.filter(t => t.id == Number(this.currentClassId))[0].class;
      })
  }

  getStudentTotal() {
    this.sch.getStudentAnnualTotal(this.currentSessionId.toString(), this.currentTerm, this.studentId)
      .subscribe(res => {
        this.studentTotal = res.total;
      })
  }

  getNextTerm() {
    this.sch.getNextTerm(this.currentSessionId.toString(), 'FIRST')
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
    this.sch.getAnnualResultsPageSession(this.currentClassId, this.currentSessionId.toString(), this.studentId)
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
        // this.gradescaletextlist.push(this.gradeScalelist[0].classLevel + ':');
        // let mytext;
        this.gradeScalelist.forEach(a => {
          a.color = this.gradeColor(a.grade);
        });
        debugger
        //let mic = this.gradeScalelist.filter(t => t.color == 'Green')[this.gradeScalelist.filter(t => t.color == 'Green').length - 1].begLimit;
        this.grademinimumlist.push({color : 'Green', remark: this.gradeScalelist.filter(t => t.color == 'Green')[this.gradeScalelist.filter(t => t.color == 'Green').length - 1].remarks, minscore:  this.gradeScalelist.filter(t => t.color == 'Green')[this.gradeScalelist.filter(t => t.color == 'Green').length - 1].begLimit});
        this.grademinimumlist.push({color : 'Black', remark: this.gradeScalelist.filter(t => t.color == 'Black')[this.gradeScalelist.filter(t => t.color == 'Black').length - 1].remarks,  minscore:  this.gradeScalelist.filter(t => t.color == 'Black')[this.gradeScalelist.filter(t => t.color == 'Black').length - 1].begLimit});
        this.grademinimumlist.push({color : 'Blue', remark: this.gradeScalelist.filter(t => t.color == 'Blue')[this.gradeScalelist.filter(t => t.color == 'Blue').length - 1].remarks,  minscore:  this.gradeScalelist.filter(t => t.color == 'Blue')[this.gradeScalelist.filter(t => t.color == 'Blue').length - 1].begLimit});
        this.grademinimumlist.push({color : 'Red', remark: this.gradeScalelist.filter(t => t.color == 'Red')[this.gradeScalelist.filter(t => t.color == 'Red').length - 1].remarks,  minscore:  this.gradeScalelist.filter(t => t.color == 'Red')[this.gradeScalelist.filter(t => t.color == 'Red').length - 1].begLimit});
        

        this.grademinimumlistOver60.push({color : 'Green', minscore:  this.over60Num(this.gradeScalelist.filter(t => t.color == 'Green')[this.gradeScalelist.filter(t => t.color == 'Green').length - 1].begLimit)});
        this.grademinimumlistOver60.push({color : 'Black', minscore:  this.over60Num(this.gradeScalelist.filter(t => t.color == 'Black')[this.gradeScalelist.filter(t => t.color == 'Black').length - 1].begLimit)});
        this.grademinimumlistOver60.push({color : 'Blue', minscore:  this.over60Num(this.gradeScalelist.filter(t => t.color == 'Blue')[this.gradeScalelist.filter(t => t.color == 'Blue').length - 1].begLimit)});
        this.grademinimumlistOver60.push({color : 'Red', minscore:  this.over60Num(this.gradeScalelist.filter(t => t.color == 'Red')[this.gradeScalelist.filter(t => t.color == 'Red').length - 1].begLimit)});
        console.log(this.grademinimumlist);
      });
  }

  getPsycomotorByStudent() {
    this.sch.getPsycomotorByStudent(this.currentSessionId.toString(), this.currentTerm, this.studentId)
      .subscribe(res => {
        this.psycomotorlist = res.slice(0, Math.round(res.length / 2));
        this.psycomotorlist2 = res.slice(Math.round(res.length / 2), res.length);

        if (res.length < 1) {
            this.sch.getPsycomotorByList(this.currentSessionId.toString(), this.currentTerm, this.studentId)
            .subscribe(res => {
                var mylist = res;
                let newlist = [];
                for (let i = 0; i < mylist.length; i++) {
                    newlist[i] = {skill: mylist[i], score: ''}
                }
                debugger
                this.psycomotorlist = newlist.slice(0, Math.round(newlist.length / 2));
                this.psycomotorlist2 = newlist.slice(Math.round(newlist.length / 2), newlist.length);
            })
          }
      });
  }

  gradeColor(grade: string) {
    if (grade.includes('A')) {
      return "Black";
    } else if (grade.includes('B')) {
      return "Black";
    } else if (grade.includes('C')) {
      return "Green";
    } else if (grade.includes('D')) {
      return "Blue";
    } else if (grade.includes('E')) {
      return "Blue";
    } else if (grade.includes('F')) {
      return "Red";
    } else {
      return "Black";
    }
  }

  public convertToPDF(table: HTMLTableElement) {

    //  var data = table;
    //     html2canvas(data).then(canvas => {
    //       // Few necessary setting options
    //       var imgWidth = 450;
    //       var pageHeight = 295;
    //       var imgHeight = canvas.height * imgWidth / canvas.width;
    //       var heightLeft = imgHeight;
    //       const contentDataURL = canvas.toDataURL('image/png')
    //       let pdf = new jspdf('p', 'px', 'a4'); // A4 size page of PDF
    //       var position = 0;
    //       pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
    //       // pdf.addImage(
    //       //   base64image,
    //       //   'PNG',
    //       //   5,
    //       //   position,
    //       //   200,
    //       //   130
    //       // );
    //       pdf.save('new-file.pdf'); // Generated PDF
    //     });

    var doc = new jsPDF('p', 'pt', 'letter');
    var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    // Supply data via script
    // var body = [
    //            ['SL.No', 'Product Name', 'Price', 'Model'],
    //            [1, 'I-phone', 75000, '2021'],
    //            [2, 'Realme', 25000, '2022'],
    //            [3, 'Oneplus', 30000, '2021'],
    //            ]
    // // generate auto table with body
    // var y = 10;
    //doc.setLineWidth(2);

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

    autoTable(doc, { html: '#customers', useCss: true, styles: { font: '20px', lineWidth: 0.2, fontSize: 6}, headStyles: { lineColor: 'white' }, startY: 206, margin: { top: 150, left: 20, bottom: 70 }})
    doc.setFontSize(10);


    autoTable(doc, { html: '#ireg', useCss: true, styles: { font: '6px', lineColor: '#808080', lineWidth: 0.2, fontSize: 7, halign: 'center'}, headStyles: { lineColor: 'white', fontSize: 8, fontStyle: 'bold'}, startY: 403, margin: { top: 150, left: 20, bottom: 30 }})
    // autoTable(doc, { html: '#myweight', styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 8 }, headStyles: { lineColor: 'white' }, startY: 507, tableWidth: 170, margin: { top: 150, left: 195, bottom: 30 }})
    // autoTable(doc, { html: '#mysocial', styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 8 }, headStyles: { lineColor: 'white' }, startY: 507, margin: { top: 150, left: 370, bottom: 30 }})

    autoTable(doc, { html: '#grade', useCss: true, styles: { font: '8px', lineWidth: 0.2, fontSize: 6 }, startY: 472, margin: { top: 150, left: 300, bottom: 30 }})

    doc.setFont('', '', '700');
    doc.setFontSize(9);
    doc.text('PSYCOMOTOR DOMAIN', 65, 464);

    doc.setFont('', '', '700');
    doc.setFontSize(9);
    doc.text('COGNITIVE DOMAIN RATING', 355, 464);

    autoTable(doc, { html: '#psyco', useCss: true, styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 6 }, headStyles: { lineColor: 'white' }, startY: 472, tableWidth: 130, margin: { top: 150, left: 20, bottom: 30 }})
    autoTable(doc, { html: '#psyco2', useCss: true, styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 6 }, headStyles: { lineColor: 'white' }, startY: 472, tableWidth: 130, margin: { top: 150, left: 150, bottom: 30 }})

    autoTable(doc, { html: '#mykey',  useCss: true, styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 6 }, headStyles: { lineColor: 'white' }, startY: 606, tableWidth: 260, margin: { top: 150, left: 20, bottom: 30 }})
    
    
    doc.setTextColor('rgb(36, 91, 143)');
    doc.setFontSize(9);
    doc.setFont('', '', '600');
    let mistee = doc.splitTextToSize('House Mistress\'s Comment:', 150);
    doc.text(mistee, 20, 650);
    doc.setFont('', '', '200');
    doc.setTextColor('rgb(0, 0, 10)');
    let housetea = doc.splitTextToSize(this.resultComment?.formTeacherComment ?? '', 370);
    doc.text(housetea, 176, 650);

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1)
    doc.line(170, 653, 580, 653);


    doc.setFontSize(9);
    doc.setFont('', '', '600');
    doc.setTextColor('rgb(36, 91, 143)');
    let tee = doc.splitTextToSize('Form Teacher\'s Comment:', 100);
    doc.text(tee, 20, 670);
    doc.setFont('', '', '200');
    doc.setTextColor('rgb(0, 0, 0)');
    let formtea = doc.splitTextToSize(this.resultComment?.formTeacherComment ?? '', 370);
    doc.text(formtea, 176, 670);

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1)
    doc.line(170, 673, 580, 673);

    
    doc.setFontSize(9);
    doc.setFont('', '', '600');
    doc.setTextColor('rgb(36, 91, 143)');
    let pea = doc.splitTextToSize('Principal\'s Comment:', 100);
    doc.text(pea, 20, 690);
    doc.setFont('', '', '200');
    doc.setTextColor('rgb(0, 0, 0)');
    let princom = doc.splitTextToSize(this.resultComment?.principalComment ?? '', 370);
    doc.text(princom, 176, 690);

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.line(170, 693, 580, 693);


    doc.setTextColor('rgb(36, 91, 143)');
    doc.setFontSize(9);
    doc.setFont('', '', '600');
    let prinSig = doc.splitTextToSize('Principal\'s Signature Date & Stamp:', 80);
    doc.text(prinSig, 415, 730);
    
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
      console.log(this.docimg);
    });
  }

  // addLogo() {
  //   this.getBase64ImageFromUrl(this.genk.imgurl + 'api/school/getSchoolLogo?'  + new URLSearchParams({id: this.myschool.id}))
  //   .then(result => this.docimg = result)
  //   .catch(err => console.error(err));
  // }
  addSignature() {
    this.sch.obtainSignature(this.currentSessionId, this.currentTerm)
    .subscribe(event => {
      const nee = this.genk.getMediaBase64(event, event.type);
      console.log(this.signatureimg);
    });
  }

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
