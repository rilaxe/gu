import { Component, Inject, Injectable, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import jspdf, { jsPDF } from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable'
import JSZip from 'jszip';
import Swal from 'sweetalert2';
import { GenericService } from './generic.service';
import { AuthenticationService } from './authentication.service';
import { SchoolService } from './school.service';
//import html2canvas from 'html2canvas';

@Injectable({ providedIn: 'root' })
export class ResultMultipleService {
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
  gradeScalelist = [];
  resArray = [];
  caSetupData: any;
  caSetupScoreData: any;
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
  resultComment = [];
  gradescaletextlist: string[] = [];
  downloadCount = 0;
  photoByteslist = [];
  photobyte: string;
  isResPhoto: number;
  psycomotorlist = [];
  myskilllist = [];
  psycomotorlistTableList = [];
  fontdeal: any;

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

//   ngOnInit(): void {
//     //this.startProcessingModal();
//     this.genk.topdata = 'Dashboard';
    
//     //this.studentId = this.activeRoute.snapshot.params['id'];
//     this.activeRoute.queryParams.subscribe(
//       params => {
//         this.currentTerm = params['term'];
//         this.currentSessionId = params['currentSessionId'];
//         this.currentSession = params['currentSession'];
//         this.currentClassId = params['classId'];
//         this.currentClassName = params['className'];

//         this.zip = new JSZip();
//         this.pdfFolders = this.zip.folder(this.currentClassName + '_' + 'Results');
//         // this.average = params['average'];
//         // this.position = params['position'];
//       }
//     )
    
//     this.isResultPhoto();
//     // this.getStudent();
//     this.getNoInClass();
    
//     this.getCaSetupByClass();
//     this.getGradeScaleByClass();
//     this.getStudentResultComment();
//     //this.getResultsByStudent();
   
    
//   }


  createResult(term, currentSessionId, currentSession, classId, className) {
    this.currentTerm = term;
    this.currentSessionId = currentSessionId;
    this.currentSession = currentSession;
    this.currentClassId = classId;
    this.currentClassName = className;

    this.zip = new JSZip();
    this.pdfFolders = this.zip.folder(this.currentClassName + '_' + 'Results');

    this.isResultPhoto();
    // this.getStudent();
    this.getNoInClass();
    
    this.getCaSetupByClass();
    this.getGradeScaleByClass();
    this.getPsycomotorByStudent();
    this.getStudentResultComment();
    //this.getResultsByStudent();
  }


  setImg(imgpath) {
    if (imgpath && imgpath.length > 0) {
      return this.genk.imgurl + imgpath;
    } else {
      return this.genk.defaultImg;
    }
  }

  // getSchool() {
  //   this.sch.getSchoolData()
  //     .subscribe(res => {
  //       this.myschool = res;
  //       this.addLogo();
  //       this.addSignature();
  //     })
  // }

  // getStudent() {
  //   this.sch.getStudentById(this.studentId.toString())
  //     .subscribe(res => {
  //       this.studentobj = res;
  //       this.addLogo();
  //       this.addSignature();
  //     })
  // }

  getNoInClass() {
    this.sch.getNoInClassBySessionClassId(this.currentClassId, this.currentSessionId, this.currentTerm)
      .subscribe(res => {
        this.noInClass = res.count;
      })
  }

  isResultPhoto() {
    this.sch.isResultPhoto()
      .subscribe(async res => {
        this.isResPhoto = res.isPhoto;
        if (this.isResPhoto) {
          this.getStudentPhotosBytes();
        } else {
          this.getSchool();
        }
        // if (this.isResPhoto && this.studentobj?.passport) {
        //   this.getStudentPhotoBlob(this.studentobj?.passport)
        // } else if(this.isResPhoto && !this.studentobj?.passport) {
        //   this.genk.photoString = await this.fetchBase64Image(this.genk.defaultImg) as string;
        // }
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
    this.sch.getResultsPageAllSession(this.currentClassId, this.currentSessionId.toString(), this.currentTerm, this.studentId)
      .subscribe(res => {
        this.resultlist = res;
        this.getResultsAverageByClass();
      })
  }

  getStudentPhotosBytes() {
    Swal.fire({
      title: 'Downloading Student Photos...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
          Swal.showLoading();
          this.sch.getStudentPhotosBytes(this.currentClassId, this.currentSessionId.toString(), this.currentTerm)
          .subscribe(res => {
            this.photoByteslist = res;
            Swal.close();
            this.getSchool();
          })
      }
    });
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
        //this.getResultsByStudent();
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
                    
                    await this.addLogo();
                    await this.addSignature();
                    
                    

                    const interval = setInterval(() => {
                      
                        if (this.genk.logoString && this.genk.signatureString) {
                            clearInterval(interval);
                            clearTimeout(timeout); // Stop checking once the condition is met
                            this.getResultsByStudent() // Call the desired function
                            
                        }
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

getPsycomotorByStudent() {
  this.sch.getPsycomotorByStudentBulk(this.currentSessionId.toString(), this.currentTerm, this.currentClassId)
    .subscribe(res => {
      debugger
      if (res.length > 0) {
        this.psycomotorlist = res;
      }

      this.sch.getSkillList().subscribe(
        res => {
          var mylist = res;
          let newlist = [];
          if (res.length > 0) {
            for (let i = 0; i < mylist.length; i++) {
              newlist[i] = { skill: mylist[i].skill, score: '' }
            }
          }
          this.myskilllist = newlist;
        }
      );
    });
}

setPsycoTable(studentId: number) {
    let woglist = this.psycomotorlist.filter(t => t.studentId == studentId);
    if (woglist.length < 1) {
      woglist = this.myskilllist
    }
    const maxRows = 3;

    for (let i = 0; i < woglist.length; i += maxRows) {
      const row = [];
  
      for (let j = 0; j < maxRows; j++) {
          if (i + j < woglist.length) {
              const student = woglist[i + j];
              row.push({ content: student.skill, styles: { fontStyle: "bold" } });
              row.push({ content: student.score });
          } else {
              // Add blank content for missing rows
              row.push({ content: ''});
              row.push({ content: ''});
          }
      }
  
      this.psycomotorlistTableList.push(row);
      console.log(this.psycomotorlistTableList);
    }
}


async convertToPDF(average: number, position: any, bodyArray: any[], studentName: string, studentClass: string, admissionNo: string, formTeacherComment: string, principalComment: string) {
  var doc = new jsPDF('p', 'pt', 'letter');
    var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    if (this.isResPhoto) {
      doc.setFont('Trebuchet MS', 'normal', '900');
      doc.setTextColor('rgb(36, 91, 143)');
      doc.setFontSize(20);
      doc.text(this.myschool?.schoolName ?? '', pageWidth / 2, 30, { align: 'center' });


      //doc.text(this.myschool.schoolName, 120, 30);

      if (this.genk.logoString) {
          doc.addImage(this.genk.logoString, 'PNG', 20, 40, 55, 55);
      }

      if (this.genk.signatureString) {
          doc.addImage(this.genk.signatureString, 'PNG', 500, 695, 70, 55);
      }

      if (this.photobyte) {
        doc.addImage(`data:image/jpeg;base64,${this.photobyte}`, 'PNG', 522, 40, 55, 55);
      } else {
        const imageBase64 = await this.genk.fetchBase64Image(this.genk.defaultImg) as string;
        if (imageBase64) {
          doc.addImage(imageBase64, 'PNG', 522, 40, 55, 55);
        }
      }


      doc.setFontSize(10);
      doc.setTextColor('rgb(0, 0, 0)');
      doc.setFont('', '', '600');
      let me = doc.splitTextToSize(this.myschool?.address ?? '', 400);
      doc.text(me, pageWidth / 2, 48, { align: 'center' });


      doc.setFont('', '', '500');
      doc.text('Email: ' + this.myschool?.email ?? '', pageWidth / 2, 60, { align: 'center' });

      doc.setFont('', '', '500');
      doc.text('Phone: ' + this.myschool?.phoneOne ?? '', pageWidth / 2, 74, { align: 'center' });

      doc.setFont('', '', '500');
      doc.text('website: ' + this.myschool?.website ?? '', pageWidth / 2, 88, { align: 'center' });

      doc.setDrawColor(36, 91, 143);
      doc.setLineWidth(2)
      doc.line(20, 100, 580, 100);
  }
  else {
      doc.setFont('Trebuchet MS', 'normal', '900');
      doc.setTextColor('rgb(36, 91, 143)');
      doc.setFontSize(20);
      doc.text(this.myschool?.schoolName ?? '', pageWidth / 2, 30, { align: 'center' });


      //doc.text(this.myschool.schoolName, 120, 30);

      if (this.genk.logoString) {
          doc.addImage(this.genk.logoString, 'PNG', 270, 40, 55, 55);
      }

      if (this.genk.signatureString) {
          doc.addImage(this.genk.signatureString, 'PNG', 500, 695, 70, 55);
      }

      // if (this.genk.photoString) {
      //     doc.addImage(this.genk.photoString, 'PNG', 20, 40, 55, 55);
      // }


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
  }
 

  

   doc.setFontSize(8);

    doc.setFont('', '', '700');
    doc.text('STUDENTS NAME:', 20, 120);
    doc.setFont('', '', '500');
    //doc.text(((this.studentobj?.surname ?? '') + ' ' + (this.studentobj?.middleName ?? '') + ' ' + (this.studentobj?.firstName ?? '')).trim(), 113, 120);
    doc.text(studentName.trim(), 113, 120);

    doc.setFont('', '', '700');
    doc.text('CLASS:', 20, 132);
    doc.setFont('', '', '500');
    doc.text(this.currentClassName ?? '', 113, 132);

    

    doc.setFont('', '', '700');
    doc.text('NO. IN CLASS:', 20, 144);
    doc.setFont('', '', '500');
    doc.text(this.noInClass.toString(), 113, 144);

    doc.setFont('', '', '700');
    doc.text('AVERAGE SCORE:', 20, 156);
    doc.setFont('', '', '500');
    doc.text(average.toString(), 113, 156);

    doc.setFont('', '', '700');
    doc.text('POSITION IN CLASS:', 20, 168);
    doc.setFont('', '', '500');
    doc.text(position.toString(), 113, 168);

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
    doc.text(admissionNo ?? '', 460, 144);

    doc.setFont('', '', '700');
    doc.text('NEXT TERM BEGINS:', 380, 156);
    doc.setFont('', '', '500');
    doc.text('', 460, 156);

    doc.setFontSize(12);
    doc.setFont('', '', '700');
    doc.text('REPORT SHEET FOR JUNIOR AND SENIOR SECONDARY', pageWidth / 2, 190, {align: 'center'});






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
    alternateRowStyles: {
      fillColor: [250, 250, 250] // Light gray for alternate rows
    },
    styles: { font: this.fontdeal.font + 'px', lineColor: '#808080', lineWidth: 0.1, fontSize: this.fontdeal.font, cellPadding: this.fontdeal.cellpadding}, 
    headStyles: { fontSize: 7, lineColor: 'white', textColor: 'white', fillColor: [45, 113, 177]}, 
    startY: 200, 
    margin: {left: 20}});
    
    const customersTrailTableEndY = (doc as any).previousAutoTable.finalY;

    if (this.psycomotorlistTableList.length > 0) {
      doc.setFontSize(11);
      doc.setFont('', '', '600');
      doc.text('Psychomotor Evaluation', 20, customersTrailTableEndY + 25);
      doc.setFontSize(8);
     }



    autoTable(doc, {
      //head: [["Skill", "Score"]], // Table header
      body: this.psycomotorlistTableList as RowInput[], // Dynamic data for rows
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
      startY: customersTrailTableEndY + 30, margin: { top: 150, left: 20, bottom: 30 },
      tableWidth: 552, // Adjust table width to content
    });
    
    const psyTrailTableEndY = (doc as any).previousAutoTable.finalY;

    this.psycomotorlistTableList = [];


    doc.setFontSize(10);

    const gradescaletextlist = ["A = Excellent", "B = Good", "C = Fair", "D = Poor", "F = Fail"];
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
      startY: psyTrailTableEndY + 10,
      tableWidth: 552,
      margin: {left: 20},
      theme: "grid"
  });

    
    doc.setFontSize(10);

    //autoTable(doc, { html: '#mykey', styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 8 }, headStyles: { lineColor: 'white' }, startY: 620, margin: { top: 150, left: 20, bottom: 30 }})
    
    doc.setFontSize(8);
    doc.setFont('', '', '700');
    let tee = doc.splitTextToSize('Form Teacher\'s Comment:', 100);
    doc.text(tee, 20, 700);
    doc.setFont('', '', '500');
    doc.setTextColor('rgb(36, 91, 143)');
    let formtea = doc.splitTextToSize(formTeacherComment ?? '', 370);
    doc.text(formtea, 119, 700);
    
    doc.setTextColor('rgb(0, 0, 0)');
    doc.setFont('', '', '700');
    let pea = doc.splitTextToSize('Principal\'s Comment:', 100);
    doc.text(pea, 20, 730);
    doc.setFont('', '', '500');
    doc.setTextColor('rgb(36, 91, 143)');
    let princom = doc.splitTextToSize(principalComment ?? '', 370);
    doc.text(princom, 103, 730);

    this.goo = this.goo + 1;
    this.downloadCount = this.downloadCount + 1;
    const pdfBlob = doc.output('blob');
    this.pdfFolders.file(studentName.split(' ').join('_') + '_' + this.goo + '.pdf' , pdfBlob);

    //doc.save('My_Results');
  }

  // addLogo() {
  //   this.sch.getSchoolLogo(this.myschool.id)
  //   .subscribe(event => {
  //       const nee = this.genk.getLogoMediaBase64(event, event.type);
  //   });
  // }

  // addSignature() {
  //   this.sch.obtainSignature(this.currentSessionId, this.currentTerm)
  //   .subscribe(event => {
  //         const nee = this.genk.getMediaBase64(event, event.type);
  //   });
  // }

  // addLogo() {
  //   this.sch.getSchoolLogoArray(this.myschool.id)
  //   .subscribe(res => {
  //       if (res.photo) {
  //         this.genk.logoString = `data:image/jpeg;base64,${res.photo}`;
  //       } else {
  //         this.genk.logoString = '';
  //       }
  //   });
  // }

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






  async getResultsAverageByClass() {
    this.sch.getResultsAverageBySessionClassOnly(this.currentClassId, this.currentSessionId.toString(), this.currentTerm)
      .subscribe(async res => {
        this.resultviewlist = res;
        //let rescount = this.resultlist.filter(t => t.studentId == this.resultviewlist[i].studentId).length
        //this.startDownloadModal();
        for (let i = 0; i < this.resultviewlist.length; i++) {
          
          this.setPsycoTable(this.resultviewlist[i].studentId);
          //if (this.resultlist.filter(t => t.studentId == this.resultviewlist[i].studentId).length > 0) {
            let comObj = this.resultComment.filter(t => t.studentId == this.resultviewlist[i].studentId)[0];
          if (this.photoByteslist.filter(t => t.studentId == this.resultviewlist[i].studentId).length > 0) {
            this.photobyte = this.photoByteslist.filter(t => t.studentId == this.resultviewlist[i].studentId)[0].passport;
          } else {
            this.photobyte = null;
          }
          
          let resu = this.resultlist.filter(t => t.studentId == this.resultviewlist[i].studentId)[0].result;
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
          this.fontdeal = this.genk.getResultFont(bodyArray, this.psycomotorlistTableList)
          this.convertToPDF(this.resultviewlist[i].average, this.genk.formatPosition(i + 1), bodyArray, this.resultviewlist[i].studentName, this.resultviewlist[i].classes, this.resultviewlist[i].admissionNo, comObj?.formTeacherComment, comObj?.principalComment);
          //}
          //this.getStudentResultComment(this.resultviewlist[i].studentId)
          
        }
        Swal.close();
        //let bess = ['Subject', ...bell, 'Total Score', 'Grade', 'Remark', 'Position', 'Lowest Score', 'Highest Score', 'Average'];
        const zipBlob = await this.zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(zipBlob);
        link.download = this.myschool.schoolName + "_Results" + ".zip";
        link.click();
      });
  }

 

}
