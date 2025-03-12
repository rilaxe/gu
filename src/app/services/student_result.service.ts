import { Injectable } from '@angular/core';
import jspdf, { jsPDF } from 'jspdf';
import autoTable, { Color, RowInput } from 'jspdf-autotable'
import Swal from 'sweetalert2';
import { GenericService } from './generic.service';
import { AuthenticationService } from './authentication.service';
import { SchoolService } from './school.service';
import { Psycomotor } from '../_models/school.model';
import calibriFont from '../../assets/fonts/calibri-regular-normal.js';
// import centuryFont from '../../assets/fonts/centurygothic_bold-bold.js';

declare const centuryFont: string;
declare const centuryNormalfont: string;
declare const calibriFont: string;
declare const calibriBoldFont: string;


@Injectable({ providedIn: 'root' })
export class StudentResultService {
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
  isResPhoto: number;
  psycomotorlist = [];
  psycomotorlistTableList = [];
  nextResumptionDate: string;
  schoolId: number;


  constructor(
    private auth: AuthenticationService,
    private sch: SchoolService,
    private gen: GenericService
  ) {
    this.genk = gen;
    this.userName = auth.currentUserValue.name;
    this.userImgPath = auth.currentUserValue.logo;
    this.adminStatus = auth.currentUserValue.status;
    this.schoolId = auth.currentUserValue.schoolId;
  }

  createResult(id, term, currentSessionId, currentSession, classId, average, position) {
    this.studentId = id;
    this.currentTerm = term;
    this.currentSessionId = currentSessionId;
    this.currentSession = currentSession;
    this.currentClassId = classId;
    this.average = average;
    this.position = position;

    this.getStudent();
    this.getNoInClass();
    this.getCaSetupByClass();
    this.getNextTerm();
    this.getGradeScaleByClass();
    this.getStudentResultComment();
    this.getPsycomotorByStudent();
    this.getResultsByStudent();

    this.psycomotorlistTableList = [];
    this.genk.photoString = '';
  }


  setImg(imgpath) {
    if (imgpath && imgpath.length > 0) {
      return this.genk.imgurl + imgpath;
    } else {
      return this.genk.defaultImg;
    }
  }

  getNextTerm() {
    this.sch.getNextTerm(this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        if (res) {
          this.nextResumptionDate = res.date;
        }
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
                        
                        if (this.isResPhoto && this.studentobj?.passport) {
                          await this.getStudentPhotoBlob(this.studentobj?.passport)
                        } else if(this.isResPhoto && !this.studentobj?.passport) {
                          this.genk.photoString = await this.fetchBase64Image(this.genk.defaultImg) as string;
                        } else {
                          this.genk.photoString = await this.fetchBase64Image(this.genk.defaultImg) as string;
                        }
                        

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

  getStudent() {
    this.sch.getStudentById(this.studentId.toString())
      .subscribe(res => {
        this.studentobj = res;
        this.isResultPhoto();
      })
  }

  getNoInClass() {
    this.sch.getNoInClass(this.studentId.toString())
      .subscribe(res => {
        this.noInClass = res.count;
      })
  }

  isResultPhoto() {
    this.sch.isResultPhoto()
      .subscribe(async res => {
        this.isResPhoto = res.isPhoto;
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
        this.loadingResult = true;
        this.sch.getResultsByStudent(this.currentClassId, this.currentSessionId.toString(), this.currentTerm, this.studentId)
          .subscribe(res => {
            this.resultlist = res;
            Swal.close();
            this.getSchool();
            this.loadingResult = false;
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




  getPsycomotorByStudent() {
    this.sch.getPsycomotorByStudent(this.currentSessionId.toString(), this.currentTerm, this.studentId)
      .subscribe(res => {
        if (res.length < 1) {
          this.sch.getSkillList()
          .subscribe(res => {
              var mylist = res;
              let newlist = [];
              if (res.length > 0) {
                for (let i = 0; i < mylist.length; i++) {
                  newlist[i] = {skill: mylist[i].skill, score: ''}
              }
              }
              

              this.psycomotorlist = newlist;
          const maxRows = 3; // Maximum rows per group

          for (let i = 0; i < this.psycomotorlist.length; i += maxRows) {
            const row = [];

            for (let j = 0; j < maxRows; j++) {
              if (i + j < this.psycomotorlist.length) {
                const student = this.psycomotorlist[i + j];
                row.push({ content: student.skill, styles: { fontStyle: "bold" } });
                row.push({ content: student.score });
              } else {
                // Add blank content for missing rows
                row.push({ content: '' });
                row.push({ content: '' });
              }
            }

            this.psycomotorlistTableList.push(row);
            console.log(this.psycomotorlistTableList);
          }
              
          })
        }
        else if (res.length > 0) {
          this.psycomotorlist = res;
          const maxRows = 3; // Maximum rows per group

          for (let i = 0; i < this.psycomotorlist.length; i += maxRows) {
            const row = [];

            for (let j = 0; j < maxRows; j++) {
              if (i + j < this.psycomotorlist.length) {
                const student = this.psycomotorlist[i + j];
                row.push({ content: student.skill, styles: { fontStyle: "bold" } });
                row.push({ content: student.score });
              } else {
                // Add blank content for missing rows
                row.push({ content: '' });
                row.push({ content: '' });
              }
            }

            this.psycomotorlistTableList.push(row);
            console.log(this.psycomotorlistTableList);
          }
        }
      });
  }


  public async convertToPDF() {
    debugger
    var doc = new jsPDF('p', 'pt', 'letter');
    doc.addFileToVFS('calibri.ttf', calibriFont);
    doc.addFont('calibri.ttf', 'calibri', 'normal');

    doc.addFileToVFS('calibri_bold.ttf', calibriBoldFont);
    doc.addFont('calibri_bold.ttf', 'calibri_bold', 'normal');

    doc.addFileToVFS('centurygothic.ttf', centuryFont);
    doc.addFont('centurygothic.ttf', 'centurygothic', 'normal');

    doc.addFileToVFS('centurygothic_normal.ttf', centuryNormalfont);
    doc.addFont('centurygothic_normal.ttf', 'centurygothicNormal', 'normal');

    var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
 

      if (this.isResPhoto) {
        doc.setFont('centurygothic');
          //doc.setFont('Trebuchet MS', 'normal', '900');
          doc.setTextColor(this.rgbfillercolor);
          doc.setFontSize(20);
          doc.text(this.myschool?.schoolName ?? '', pageWidth / 2, 30, { align: 'center' });


          //doc.text(this.myschool.schoolName, 120, 30);

          if (this.genk.logoString) {
              doc.addImage(this.genk.logoString, 'PNG', 20, 40, 55, 55);
          }

          if (this.genk.signatureString) {
              doc.addImage(this.genk.signatureString, 'PNG', 500, 695, 70, 55);
          }

          if (this.genk.photoString) {
              doc.addImage(this.genk.photoString, 'PNG', 522, 40, 55, 55);
          } else {
            const imageBase64 = await this.fetchBase64Image(this.genk.defaultImg) as string;
            doc.addImage(imageBase64, 'PNG', 522, 40, 55, 55);
          }


          doc.setFontSize(10);
          doc.setTextColor('rgb(0, 0, 0)');
          doc.setFont('calibri_bold');
          let me = doc.splitTextToSize(this.myschool?.address ?? '', 400);
          doc.text(me, pageWidth / 2, 48, { align: 'center' });


          doc.setFont('calibri');
          doc.text('Email: ' + this.myschool?.email ?? '', pageWidth / 2, 60, { align: 'center' });

          doc.setFont('calibri');
          doc.text('Phone: ' + this.myschool?.phoneOne ?? '', pageWidth / 2, 74, { align: 'center' });

          doc.setFont('calibri');
          doc.text('website: ' + this.myschool?.website ?? '', pageWidth / 2, 88, { align: 'center' });

          doc.setDrawColor(36, 91, 143);
          doc.setLineWidth(2)
          doc.line(20, 100, 580, 100);
      }
      else {
          //doc.setFont('Trebuchet MS', 'normal', '900');
          doc.setFont('centurygothic');
          doc.setTextColor(this.rgbfillercolor);
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
          //doc.setFont('', '', '700');
          doc.setFont('calibri_bold');
          doc.text('Postal Address:', 20, 60);
          //doc.setFont('', '', '500');
          doc.setFont('calibri');
          let me = doc.splitTextToSize(this.myschool?.address ?? '', 220);
          doc.text(me, 20, 73);

          //doc.setFont('', '', '700');
          doc.setFont('calibri_bold');
          doc.text('Email:', 380, 60);
          //doc.setFont('', '', '500');
          doc.setFont('calibri');
          doc.text(this.myschool?.email ?? '', 418, 60);

          //doc.setFont('', '', '700');
          doc.setFont('calibri_bold');
          doc.text('Phone:', 380, 74);
          //doc.setFont('', '', '500');
          doc.setFont('calibri');
          doc.text(this.myschool?.phoneOne ?? '', 418, 74);

          //doc.setFont('', '', '700');
          doc.setFont('calibri_bold');
          doc.text('website:', 380, 88);
          //doc.setFont('', '', '500');
          doc.setFont('calibri');
          doc.text(this.myschool?.website ?? '', 424, 88);

          doc.setDrawColor(this.rgbdrawer.r, this.rgbdrawer.g, this.rgbdrawer.b);
          doc.setLineWidth(2)
          doc.line(20, 100, 580, 100);
      }

    doc.setFontSize(8);

    doc.setFont('calibri_bold');
    doc.text('STUDENTS NAME:', 20, 120);
    doc.setFont('calibri');
    doc.text(((this.studentobj?.surname ?? '') + ' ' + (this.studentobj?.middleName ?? '') + ' ' + (this.studentobj?.firstName ?? '')).trim(), 113, 120);

    doc.setFont('calibri_bold');
    doc.text('CLASS:', 20, 132);
    doc.setFont('calibri');
    
    let myClassName = '';
    if (this.resultlist.length > 0) {
      myClassName = this.resultlist[0].class;
    } else {
      myClassName = this.studentobj?.class;
    }
    doc.text(myClassName ?? '', 113, 132);

    doc.setFont('calibri_bold');
    doc.text('NO. IN CLASS:', 20, 144);
    doc.setFont('calibri');
    doc.text(this.noInClass.toString(), 113, 144);

    doc.setFont('calibri_bold');
    doc.text('AVERAGE SCORE:', 20, 156);
    doc.setFont('calibri');
    doc.text(this.average.toString(), 113, 156);

    doc.setFont('calibri_bold');
    doc.text('POSITION IN CLASS:', 20, 168);
    doc.setFont('calibri');
    doc.text(this.position.toString(), 113, 168);

    doc.setFont('calibri_bold');
    doc.text('TERM:', 380, 120);
    doc.setFont('calibri');
    doc.text(this.currentTerm, 460, 120);

    doc.setFont('calibri_bold');
    doc.text('SESSION:', 380, 132);
    doc.setFont('calibri');
    doc.text(this.currentSession, 460, 132);

    doc.setFont('calibri_bold');
    doc.text('ADMISSION NO.:', 380, 144);
    doc.setFont('calibri');
    doc.text(this.studentobj?.admissionNo ?? '', 460, 144);

    doc.setFont('calibri_bold');
    doc.text('NEXT TERM BEGINS:', 380, 156);
    doc.setFont('calibri');
    doc.text('', 460, 156);

    if (this.nextResumptionDate) {
      let date = new Date(this.nextResumptionDate);

    let formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);

    doc.setFontSize(8);
    doc.text(formattedDate, 470, 156);
  }


    

    doc.setFontSize(12);
    doc.setFont('calibri_bold');
    doc.text('REPORT SHEET FOR JUNIOR AND SENIOR SECONDARY',pageWidth / 2, 190, {align: 'center'});

    let resu = this.resultlist;
          let bodyArray = [];
          resu.forEach(c => {
            let resArray = [];
            resArray.push(c.subject.toLowerCase().replace(/\b\w/g, char => char.toUpperCase()));
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

    let fontdeal = this.genk.getResultFont(bodyArray, this.psycomotorlistTableList)

    autoTable(doc, { head: [bess], useCss: true,
    body: bodyArray,
    alternateRowStyles: {
      fillColor: [250, 250, 250] // Light gray for alternate rows
    },
    styles: { font: 'calibri', lineColor: '#808080', lineWidth: 0.1, fontSize: fontdeal.font, cellPadding: fontdeal.cellpadding}, 
    headStyles: { fontStyle: "bold", font: 'calibri_bold', fontSize: 7, lineColor: 'white', textColor: 'white', fillColor: this.fillercolor as Color}, 
    startY: 200, 
    margin: {left: 20}});
    
    const customersTrailTableEndY = (doc as any).previousAutoTable.finalY;


   if (this.psycomotorlistTableList.length > 0) {
    doc.setFontSize(11);
    doc.setFont('centurygothic');
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
    font: 'centurygothic'
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



    doc.setFontSize(10);

    const gradescaletextlist = ["A = Excellent", "B = Good", "C = Fair", "D = Poor", "F = Fail"];
  autoTable(doc, {
      body: [
        [
            { content: "KEY TO GRADE:", styles: { halign: "left", fontStyle: "bold", font: "centurygothic" } },
            { content: gradescaletextlist.join("  "), styles: { halign: "left", font: 'centurygothicNormal' } }
        ],
        [
            { content: "KEY TO RATINGS:", styles: { halign: "left", fontStyle: "bold", font: "centurygothic" } },
            {
                content: "1 = Very Poor  2 = Poor  3 = Fair  4 = Good  5 = Excellent",
                styles: { halign: "left", font: 'centurygothicNormal' }
            }
        ]
    ],
      //styles: { border: 1 },
      styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 8},
      startY: psyTrailTableEndY + 10, 
      tableWidth: 552,
      margin: {left: 20},
      theme: "grid"
  });


  autoTable(doc, {
    body: [
      [
          { content: "Form Teacher\'s Comment:", styles: { halign: "left", fontStyle: "bold", font: "centurygothic" } },
          { content: this.resultComment?.formTeacherComment ?? '', styles: { halign: "left", font: 'centurygothicNormal' } }
      ],
      [
          { content: "Principal\'s Comment:", styles: { halign: "left", fontStyle: "bold", font: "centurygothic" } },
          {
              content: this.resultComment?.principalComment ?? '',
              styles: { halign: "left", font: 'centurygothicNormal' }
          }
      ]
  ],
    //styles: { border: 1 },
    styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 8},
    startY: 700 + 10, 
    tableWidth: 552,
    margin: {left: 20},
    theme: "grid"
});

    // autoTable(doc, { html: '#mykey', styles: { font: '8px', lineColor: '#808080', lineWidth: 0.2, fontSize: 8 }, headStyles: { lineColor: 'white' }, startY: 620, margin: { top: 150, left: 20, bottom: 30 }})
    
    // doc.setFontSize(8);
    // doc.setFont('centurygothic');
    // let tee = doc.splitTextToSize('Form Teacher\'s Comment:', 100);
    // doc.text(tee, 20, 700);
    // doc.setFont('', '', '500');
    // doc.setTextColor('rgb(36, 91, 143)');
    // let formtea = doc.splitTextToSize(this.resultComment?.formTeacherComment ?? '', 370);
    // doc.text(formtea, 119, 700);
    
    // doc.setTextColor('rgb(0, 0, 0)');
    // doc.setFont('centurygothic');
    // let pea = doc.splitTextToSize('Principal\'s Comment:', 100);
    // doc.text(pea, 20, 730);
    // doc.setFont('', '', '500');
    // doc.setTextColor('rgb(36, 91, 143)');
    // let princom = doc.splitTextToSize(this.resultComment?.principalComment ?? '', 370);
    // doc.text(princom, 103, 730);

    if (this.genk.isView) {
      this.genk.pdfSource = doc.output('datauristring');
      // const pdfBlob = await doc.output("blob");
      // //const pdfBlob = new Blob([doc.output("blob")], { type: "application/pdf" });
      // this.genk.pdfUrl = URL.createObjectURL(pdfBlob);
      //this.genk.loadPDF(pdfArrayBuffer)
    } else {
      doc.save('My_Results');
    }

    
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
  //     //console.log(this.signatureimg);
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

  getStudentPhotoBlob(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Example implementation for `addSignature`
      this.sch.getStudentPhotoArray(url).subscribe(
        (res) => {
          if (res.photo) {
            this.genk.photoString = `data:image/jpeg;base64,${res.photo}`;
          } else {
            this.genk.photoString = '';
          }
          resolve();
        },
        (err) => reject(err)
      );
    });
  }

  // getStudentPhotoBlob(url: string) {
  //   this.sch.getStudentPhoto(url)
  //   .subscribe(event => {
  //       const nee = this.genk.getPhotoMediaBase64(event, event.type);
      
  //     //console.log(this.docimg);
  //   });
  // }

  async fetchBase64Image(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  };


  get fillercolor() {
    if (this.schoolId == 540) {
      return [6, 115, 6];
    } else {
      return [45, 113, 177];
    }
  }

  get rgbfillercolor() {
    if (this.schoolId == 540) {
      return 'rgb(6, 115, 6)';
    } else {
      return 'rgb(36, 91, 143)';
    }
  }

  get rgbdrawer() {
    if (this.schoolId == 540) {
      return {r: 6, g: 115, b: 6};
    } else {
      return {r:36, g:91, b:143};;
    }
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


  


}