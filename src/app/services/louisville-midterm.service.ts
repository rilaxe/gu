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
export class LouisvilleMidtermService {
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
    private gen: GenericService,
    private resultService: ResultService
  ) {
    this.genk = gen;
    this.userName = auth.currentUserValue.name;
    this.userImgPath = auth.currentUserValue.logo;
    this.adminStatus = auth.currentUserValue.status;
  }

  createResult(id, term, currentSessionId, currentSession, classId, average, position) {
    this.genk.topdata = 'Dashboard';
    this.studentId = id;
    this.currentTerm = term;
    this.currentSessionId = currentSessionId;
    this.currentSession = currentSession;
    this.currentClassId = classId;
    this.average = average;
    this.position = position;

    this.getResultsByStudent();
    //this.getSchool();
    this.getGradeScaleByClass();
    this.getMidtermMax();
    this.getStudent();
    this.getNoInClass();
    
  }

  setImg(imgpath) {
    if (imgpath && imgpath.length > 0) {
      return this.genk.imgurl + imgpath;
    } else {
      return this.genk.defaultImg;
    }
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

getSchool() {
    this.sch.getSchoolData()
        .subscribe(res => {
            this.myschool = res;
            Swal.fire({
                title: this.genk.isView? 'Previewing Result...': 'Downloading Result...',
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
        this.getSchool();
      })
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


  

  


  public convertToPDF() {

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
    doc.text('MID TERM RESULT FOR ' + this.gradeScalelist[0].classLevel + ' SECONDARY SCHOOL',pageWidth / 2, 190, {align: 'center'});

    let resu = this.resultlist;
    let bodyArray = [];
    resu.forEach(c => {
      let resArray = [];
      resArray.push(c.subject);
      // resArray.push(Number(Number(c.totalScore).toFixed(2)));
      // resArray.push(this.calMinGrade(Number(c.totalScore))?.grade);
      resArray.push(Number(Number(c.totalScore).toFixed(2)));
      resArray.push(this.calMinGrade(Number(Number(c.totalScore).toFixed(1)))?.grade);
      bodyArray.push(resArray);
    })


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


    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(1)
    doc.line(170, 543, 580, 543);

    
    doc.setFontSize(9);
    doc.setFont('', '', '600');
    doc.setTextColor('rgb(36, 91, 143)');
    let pea = doc.splitTextToSize('Date & Stamp:', 100);
    doc.text(pea, 20, 575);

    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(1);
    doc.line(170, 578, 580, 578);

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

}
