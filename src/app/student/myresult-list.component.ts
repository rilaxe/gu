import { Component, ElementRef, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jspdf, { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import { AuthenticationService, GenericService, NotreDameResultService, StudentResultService } from '../services';
import { SchoolService } from '../services/school.service';
import { studentDetails } from '../_models/school.model';
import Swal from 'sweetalert2';
import { TrailblazersResultService } from '../services/trailblazers_result.service';
import { LouisvilleResultService } from '../services/louisville-result.service';
import { LouisvilleMidtermService } from '../services/louisville-midterm.service';
//import html2canvas from 'html2canvas';

@Component({
  templateUrl: './myresult-list.component.html',
  styleUrls: ['../table.css']
})
export class MyResultListComponent implements OnInit {
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
  schoolClasses = [];
  gradeScalelist = [];
  caSetupData: any;
  currentClassIdOld: string;
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
  isResult = false;
  sessionlist = [];
  currentSessionObj: any;
  isResultPublished = false;
  reasonForNoResult: string;
  resulttype: string;
  classAverage: string;
  schoolId: number;
  student_result: StudentResultService;
  notre_dame_result: NotreDameResultService;
  trailblazers_Result: TrailblazersResultService;
  louisville_Result: LouisvilleResultService;
  louisville_Midterms: LouisvilleMidtermService;
  @ViewChild('pdfCanvas', { static: false }) pdfCanvas!: ElementRef<HTMLCanvasElement>;
  resAvailable: any;
  zoom = 1;

  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private activeRoute: ActivatedRoute,
    private sch: SchoolService,
    private gen: GenericService,
    private studentResult: StudentResultService,
    private notreDameResult: NotreDameResultService,
    private trailblazersResult: TrailblazersResultService,
    private louisvilleResult: LouisvilleResultService,
    private louisvilleMidterms: LouisvilleMidtermService,
  ) {
    this.genk = gen;
    this.userName = auth.currentUserValue.name;
    this.userImgPath = auth.currentUserValue.logo;
    this.adminStatus = auth.currentUserValue.status;
    this.student_result = studentResult;
    this.notre_dame_result = notreDameResult;
    this.trailblazers_Result = trailblazersResult;
    this.louisville_Result = louisvilleResult;
    this.louisville_Midterms = louisvilleMidterms;
  }

  ngOnInit(): void {
    this.genk.topdata = 'Result';
    this.activeRoute.queryParams.subscribe(
      params => {
        this.resulttype = params['resulttype'];
      }
    )
   
    this.studentId = this.auth.currentUserValue.id.toString();
    this.schoolId = this.auth.currentUserValue.schoolId;

    this.getStudent();
    this.getClassNames();
    this.getSession();
    this.getCurrentSession();
  }

  get getresultUrl() {
    return this.genk.resultTemplate.filter(t => t.id == this.schoolId).length > 0 ? this.genk.resultTemplate.filter(t => t.id == this.schoolId)[0].result : this.genk.resultTemplate[0].result;
    // this.schoolId == 52 ? 'louisville-result' : 'student-result';
  } 
  
  get getannualResultUrl() {
    return this.genk.resultTemplate.filter(t => t.id == this.schoolId).length > 0 ? this.genk.resultTemplate.filter(t => t.id == this.schoolId)[0].annual : this.genk.resultTemplate[0].annual;
  } 

  setImg(imgpath) {
    if (imgpath && imgpath.length > 0) {
      return this.genk.imgurl + imgpath;
    } else {
      return this.genk.defaultImg;
    }
  }

  getAvailableResult() {
    this.sch.getAvailableResult(this.currentSessionId, this.currentTerm)
      .subscribe(res => {
        this.resAvailable = res;
        //this.getResultsAverageByClassForParent();
        // this.addLogo();
        // this.addSignature();
      })
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
        this.studentobj = res;
        this.currentClassId = this.studentobj.classId;
        //this.getResultsAverageByClassForParent();
        // this.addLogo();
        // this.addSignature();
      })
  }

  getMyClassIdBySession() {
    return new Promise<void>((resolve, reject) => {
      this.sch.getMyClassIdBySession(this.currentSessionId, this.currentTerm)
        .subscribe({
          next: (res) => {
            this.currentClassId = res.classId;
            resolve();
          },
          error: (err) => {
            reject(err); // Reject the promise if an error occurs
          }
        })
    })
  }

  getNoInClass() {
    this.sch.getNoInClass(this.studentId.toString())
      .subscribe(res => {
        this.noInClass = res.count;
      })
  }

  getClassNames() {
    this.sch.getClassNames()
    .subscribe(res => {
      this.schoolClasses = res;
    });
  }
  
  getSession() {
    this.sch.getSession()
      .subscribe(res => {
        this.sessionlist = res;
      })
  }
  
  getCurrentSession() {
    this.sch.getCurrentSession()
      .subscribe(res => {
        this.currentSessionObj = res;
        this.currentSessionId = this.currentSessionObj.sessionId;
        this.currentSession = this.currentSessionObj.sessionName;
        if (this.currentSessionObj.currentTerm) {
          this.currentTerm = this.currentSessionObj.currentTerm;
        }
        
        
      })
  }

  viewResult() {
    debugger
    if (this.resulttype == 'MIDTERM') {
      Swal.fire({
        title: 'Checking Result Data....',
        allowEscapeKey: false,
        allowOutsideClick: false,
        //timer: 2000,
        didOpen: async () => {
          Swal.showLoading();
          await this.getMyClassIdBySession();
          this.getSchool();
  
          if (this.getresultUrl != 'student-result') {
            await this.getResultsByStudent();
          }
  
          this.getResultsMidterms();
          this.isResult = true;
                
          this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
        }
      });
    } else {
    Swal.fire({
      title: 'Checking Result Data....',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
        Swal.showLoading();
        this.sch.checkResultPublication(this.currentClassId, this.currentSessionId.toString(), this.currentTerm)
          .subscribe(res => {
            this.isResultPublished = res.val;
            if (res.val) {
            this.sch.getStudentById(this.studentId).subscribe(async restu => {
              let details = restu as studentDetails;
              if (!details.isResultBlocked) {
                await this.getMyClassIdBySession();
                this.getSchool();

                if (this.getresultUrl != 'student-result') {
                  await this.getResultsByStudent();
                }

                this.getResultsAverageByClassForParent();
                this.isResult = true;
              } else {
                this.reasonForNoResult = 'You are unable to view your result at the moment. Please clarify with the school admin!';
              }

            });

            } else {
              this.reasonForNoResult = 'This result has not been published!';
              Swal.close();
            }
            this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
          })
      }
    });
  }
  }



  viewPerformanceAnalysis() {
    if (this.resulttype = 'MIDTERM') {
      Swal.fire({
        title: 'Checking Result Data....',
        allowEscapeKey: false,
        allowOutsideClick: false,
        //timer: 2000,
        didOpen: async () => {
          Swal.showLoading();
          await this.getMyClassIdBySession();
          this.getSchool();
  
          if (this.getresultUrl != 'student-result') {
            await this.getResultsByStudent();
          }
  
          this.getResultsMidterms();
          this.isResult = true;
                
          this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
        }
      });
    } else {
      Swal.fire({
        title: 'Checking Result Data....',
        allowEscapeKey: false,
        allowOutsideClick: false,
        //timer: 2000,
        didOpen: () => {
          Swal.showLoading();
          this.sch.checkResultPublication(this.currentClassId, this.currentSessionId.toString(), this.currentTerm)
            .subscribe(res => {
              this.isResultPublished = res.val;
              if (res.val) {
              this.sch.getStudentById(this.studentId).subscribe(async restu => {
                let details = restu as studentDetails;
                if (!details.isResultBlocked) {
                  await this.getMyClassIdBySession();
                  this.getSchool();
  
                  if (this.getresultUrl != 'student-result') {
                    await this.getResultsByStudent();
                  }
  
                  
                  this.getResultsAverageByClassForParent();
                  this.isResult = true;
                } else {
                  this.reasonForNoResult = 'You are unable to view your result at the moment. Please clarify with the school admin!';
                }
  
              });
  
              } else {
                this.reasonForNoResult = 'This result has not been published!';
                Swal.close();
              }
              this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
            })
        }
      });
    }
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

  getResultsAverageByClassForParent() {
    this.sch.getResultsAverageByClassForParent(this.currentClassId, this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        Swal.close();
        //this.genk.isView = true;
        this.genk.pdfCanvas = this.pdfCanvas;

        if (res?.average) {
          this.average = res.average;
          this.position = this.genk.formatPosition(res.position);
          if (this.getresultUrl == 'notre-dame-result') {
            this.notre_dame_result.createResult(this.studentId, this.currentTerm, this.currentSessionId, this.currentSession, this.currentClassId, this.average, this.classAverage, this.position);
          }
          else if(this.getresultUrl == 'trailblazer-result') {
            this.trailblazers_Result.createResult(this.studentId, this.currentTerm, this.currentSessionId, this.currentSession, this.currentClassId, this.average, this.classAverage, this.position);
          }
          else if(this.getresultUrl == 'louisville-result') {
            this.louisville_Result.createResult(this.studentId, this.currentTerm, this.currentSessionId, this.currentSession, this.currentClassId, this.average, this.classAverage, this.position);
          }
          else {
            this.student_result.createResult(this.studentId, this.currentTerm, this.currentSessionId, this.currentSession, this.currentClassId, this.average, this.position);
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'No result was found!',
            showConfirmButton: false,
            timer: 2000
          });
        }
      })
  }


  getResultsMidterms() {
    this.sch.getMidtermResultsAverageBySessionForParent(this.currentClassId, this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        Swal.close();

        if (res?.average) {
          this.average = res.average;
          this.position = this.genk.formatPosition(res.position);
          // if (this.getresultUrl == 'notre-dame-result') {
          //   this.notre_dame_result.createResult(this.studentId, this.currentTerm, this.currentSessionId, this.currentSession, this.currentClassId, this.average, this.classAverage, this.position);
          // }
          // else if(this.getresultUrl == 'trailblazer-result') {
          //   this.trailblazers_Result.createResult(this.studentId, this.currentTerm, this.currentSessionId, this.currentSession, this.currentClassId, this.average, this.classAverage, this.position);
          // }
          if(this.getresultUrl == 'louisville-result') {
            this.louisville_Midterms.createResult(this.studentId, this.currentTerm, this.currentSessionId, this.currentSession, this.currentClassId, this.average, this.position);
          }
          else {
            this.student_result.createResult(this.studentId, this.currentTerm, this.currentSessionId, this.currentSession, this.currentClassId, this.average, this.position);
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'No result was found!',
            showConfirmButton: false,
            timer: 2000
          });
        }
      })
  }

  // getResultsByStudent() {
  //   this.sch.getResultsByStudent(this.currentClassId, this.currentSessionId.toString(), this.currentTerm, this.studentId)
  //     .subscribe(res => {
  //       this.resultlist = res;
  //       let averageList = this.resultlist.map(item => item.averageRaw);
  //       let kool = averageList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  //       this.classAverage = (kool / this.resultlist.length).toFixed(1);
  //     })
  // }

  // getResultsByStudent(): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     this.sch.getResultsByStudent(this.currentClassId, this.currentSessionId.toString(), this.currentTerm, this.studentId)
  //     .subscribe({
  //       next: (res) => {
  //         this.resultlist = res;
  //         const averageList = this.resultlist.map(item => item.averageRaw);
  //         const kool = averageList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  //         this.classAverage = (kool / this.resultlist.length).toFixed(1);
  //         resolve(); // Resolve the promise after processing
  //       },
  //       error: (err) => {
  //         reject(err); // Reject the promise if an error occurs
  //       }
  //     });
  //   });
  // }

  getResultsByStudent(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sch.getResultsAverageBySession(this.currentClassId, this.currentSessionId.toString(), this.currentTerm)
      .subscribe({
        next: (res) => {
        this.resultlist = res;
        let averageList = this.resultlist.map(item => item.averageRaw);
        let kool = averageList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        this.classAverage = (kool / this.resultlist.length).toFixed(1);
        resolve();
      },
      error: (err) => {
        reject(err); // Reject the promise if an error occurs
      }
      })
    });
  }


  zoomIn() {
    this.zoom += 0.2;
  }

  zoomOut() {
    if (this.zoom > 0.4) {
      this.zoom -= 0.2;
    }
  }

  previewResult() {
    this.genk.isView = true;
    this.viewResult();
  }

  downloadResult() {
    this.genk.isView = false;
    this.viewResult();
  }

  previewMidtermResult() {
    this.genk.isView = true;
    this.resulttype = 'MIDTERM';
    this.viewResult();
  }

  downloadMidtermResult() {
    this.genk.isView = false;
    this.resulttype = 'MIDTERM';
    this.viewResult();
  }

  

//   getStudentResultComment() {
//     this.sch.getStudentResultComment(this.currentClassId, this.currentSessionId.toString(), this.currentTerm, this.studentId)
//       .subscribe(res => {
//         this.resultComment = res;
//       })
//   }

//   getCaSetupByClass() {
//     this.sch.getCaSetupByClass(this.currentClassId, this.currentSessionId.toString(), this.currentTerm)
//       .subscribe(res => {
//         this.caSetupData = res;
//       });
//   }

//   getGradeScaleByClass() {
//     this.sch.getGradeScaleByClass(this.currentClassId)
//       .subscribe(res => {
//         this.gradeScalelist = res;
//         this.gradescaletextlist.push(this.gradeScalelist[0].classLevel + ':');
//         let mytext;
//         this.gradeScalelist.forEach(a => {
//           mytext = a.grade + " " + '=' + ' ' + a.remarks + ' ' + '(' + a.begLimit + ' ' + '-' + ' ' + a.endLimit + ')' ;
//           this.gradescaletextlist.push(mytext);
//         });
//       });
//   }


//   public convertToPDF() {

//     var doc = new jsPDF('p', 'pt', 'letter');
//     var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
//     var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();


//     doc.setFont('Trebuchet MS', 'normal', '900');
//     doc.setTextColor('rgb(36, 91, 143)');
//     doc.setFontSize(20);
//     doc.text(this.myschool.schoolName, pageWidth / 2, 30, {align: 'center'});
    
    
//     doc.addImage(this.docimg, 'PNG', 270, 40, 70, 55);
//     doc.addImage(this.signatureimg, 'PNG', 500, 695, 70, 55);
//     doc.setFontSize(10);
//     doc.setTextColor('rgb(0, 0, 0)');
//     doc.setFont('', '', '700');
//     doc.text('Postal Address:', 20, 60);
//     doc.setFont('', '', '500');
//     let me = doc.splitTextToSize(this.myschool?.address, 220);
//     doc.text(me, 20, 73);

//     doc.setFont('', '', '700');
//     doc.text('Email:', 380, 60);
//     doc.setFont('', '', '500');
//     doc.text(this.myschool?.email, 418, 60);

//     doc.setFont('', '', '700');
//     doc.text('Phone:', 380, 74);
//     doc.setFont('', '', '500');
//     doc.text(this.myschool.phoneOne ?? '', 418, 74);

//     doc.setFont('', '', '700');
//     doc.text('website:', 380, 88);
//     doc.setFont('', '', '500');
//     doc.text(this.myschool?.website, 424, 88);

//     doc.setDrawColor(36, 91, 143);
//     doc.setLineWidth(2)
//     doc.line(20, 100, 580, 100);

//     doc.setFontSize(8);

//     doc.setFont('', '', '700');
//     doc.text('STUDENTS NAME:', 20, 120);
//     doc.setFont('', '', '500');
//     doc.text(((this.studentobj.surname ?? '') + ' ' + (this.studentobj.middleName ?? '') + ' ' + (this.studentobj.firstName ?? '')).trim(), 113, 120);

//     doc.setFont('', '', '700');
//     doc.text('CLASS:', 20, 132);
//     doc.setFont('', '', '500');
//     doc.text(this.studentobj?.class, 113, 132);

//     doc.setFont('', '', '700');
//     doc.text('NO. IN CLASS:', 20, 144);
//     doc.setFont('', '', '500');
//     doc.text(this.noInClass.toString(), 113, 144);

//     doc.setFont('', '', '700');
//     doc.text('AVERAGE SCORE:', 20, 156);
//     doc.setFont('', '', '500');
//     doc.text(this.average.toString(), 113, 156);

//     doc.setFont('', '', '700');
//     doc.text('POSITION IN CLASS:', 20, 168);
//     doc.setFont('', '', '500');
//     doc.text(this.position.toString(), 113, 168);

//     doc.setFont('', '', '700');
//     doc.text('TERM:', 380, 120);
//     doc.setFont('', '', '500');
//     doc.text(this.currentTerm, 460, 120);

//     doc.setFont('', '', '700');
//     doc.text('SESSION:', 380, 132);
//     doc.setFont('', '', '500');
//     doc.text(this.currentSession, 460, 132);

//     doc.setFont('', '', '700');
//     doc.text('ADMISSION NO.:', 380, 144);
//     doc.setFont('', '', '500');
//     doc.text(this.studentobj?.admissionNo, 460, 144);

//     doc.setFont('', '', '700');
//     doc.text('NEXT TERM BEGINS:', 380, 156);
//     doc.setFont('', '', '500');
//     doc.text('', 460, 156);

//     doc.setFontSize(12);
//     doc.setFont('', '', '700');
//     doc.text('REPORT SHEET FOR JUNIOR AND SENIOR SECONDARY',pageWidth / 2, 190, {align: 'center'});


//     autoTable(doc, { html: '#customers', styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 8 }, headStyles: { lineColor: 'white' }, startY: 200, margin: { top: 150, left: 20, bottom: 70 }})
//     doc.setFontSize(10);

//     autoTable(doc, { html: '#mykey', styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 8 }, headStyles: { lineColor: 'white' }, startY: 620, margin: { top: 150, left: 20, bottom: 30 }})
    
//     doc.setFontSize(8);
//     doc.setFont('', '', '700');
//     let tee = doc.splitTextToSize('Form Teacher\'s Comment:', 100);
//     doc.text(tee, 20, 700);
//     doc.setFont('', '', '500');
//     doc.setTextColor('rgb(36, 91, 143)');
//     let formtea = doc.splitTextToSize(this.resultComment?.formTeacherComment ? this.resultComment?.formTeacherComment : '', 370);
//     doc.text(formtea, 119, 700);
    
//     doc.setTextColor('rgb(0, 0, 0)');
//     doc.setFont('', '', '700');
//     let pea = doc.splitTextToSize('Principal\'s Comment:', 100);
//     doc.text(pea, 20, 730);
//     doc.setFont('', '', '500');
//     doc.setTextColor('rgb(36, 91, 143)');
//     let princom = doc.splitTextToSize(this.resultComment?.principalComment ? this.resultComment?.principalComment : '', 370);
//     doc.text(princom, 103, 730);
    
  
//     doc.save('My_Results');
//   }

//   addLogo() {
//     this.getBase64ImageFromUrl('https://png.pngtree.com/png-vector/20230303/ourmid/pngtree-education-and-college-logo-design-template-vector-png-image_6627789.png')
//     .then(result => this.docimg = result)
//     .catch(err => console.error(err));
//   }

//   addSignature() {
//     this.getBase64ImageFromUrl('https://d1csarkz8obe9u.cloudfront.net/posterpreviews/approved-stamp-design-template-07f9d63b6cd386f4c243b4d7625b3d20.jpg')
//     .then(result => this.signatureimg = result)
//     .catch(err => console.error(err));
//   }

// async getBase64ImageFromUrl(imageUrl) {
//   var res = await fetch(imageUrl);
//   var blob = await res.blob();

//   return new Promise((resolve, reject) => {
//     var reader = new FileReader();
//     reader.addEventListener("load", function () {
//       resolve(reader.result);
//     }, false);

//     reader.onerror = () => {
//       return reject(this);
//     };
//     reader.readAsDataURL(blob);
//   })
// };

}
