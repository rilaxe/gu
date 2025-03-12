import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import { studentDetails } from '../../_models/school.model';
import { ObjectService } from '../../services/object.service';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexPlotOptions, ApexStroke, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts';


export type ChartDoubleOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  templateUrl: './student-profile.component.html',
  styleUrls: []
})
export class StudentProfileComponent implements OnInit {
  @Input() header: string;
  @ViewChild("chart") chart: ChartComponent;
  public chartDoubleOptions: Partial<ChartDoubleOptions>;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  studentId: string;
  studentobj: any;
  student = new studentDetails();
  schoolClasses = [];
  objService: ObjectService;
  lgs = [];
  states = [];
  destroy = new Subject;
  passportName: string;
  genderStat: any;
  countdata: any;
  sessionlist = [];
  currentSessionObj: any;
  currentSession: string;
  currentSessionId: string;
  currentTerm: string;
  academicSessionId: string;
  academicTerm: string;
  subjectlist = [];
  scorelist = [];
  highlist = [];
  myave: number;
  highestave: number;
  lowestave: number;
  topreason: string = '';
  reason: string = '';
  isOther = false;
  isViewChart = false;

  constructor( 
    private router: Router,
    private auth: AuthenticationService,
    private cd: ChangeDetectorRef,
    private activeRoute: ActivatedRoute,
    private gen: GenericService,
    private obj: ObjectService,
    private sch: SchoolService
    ) {
      this.genk = gen;
      this.objService = obj;
      this.userName = auth.currentUserValue.name;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = auth.currentUserValue.status;
      this.studentId = this.activeRoute.snapshot.params['id'];
}

ngOnInit(): void {
  this.genk.topdata = 'Student Profile';
  
  this.states = Object.keys(this.objService.lga);
  this.getStudent();
  this.getClassNames();
  this.getPopulationData();
  this.getSession();
  this.getCurrentSession();
}

loadChart() {
  this.isViewChart = true;
}

getPopulationData() {
  this.sch.getPopulationData()
    .subscribe(res => {
      this.countdata = res[0];
    })
}

getStudent() {
  this.sch.getStudentById(this.studentId.toString())
    .subscribe(res => {
      this.studentobj = res;
      this.student = res;
      this.student.birthDate = this.formatDateOnly(this.student.birthDate);
    })
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
      this.academicSessionId = this.currentSessionObj.sessionId;
      if (this.currentSessionObj.currentTerm) {
        this.currentTerm = this.currentSessionObj.currentTerm;
        this.academicTerm = this.currentSessionObj.currentTerm;
      }
      
    })
}

setImg(imgpath) {
  if (imgpath && imgpath.length > 0) {
    return this.genk.imgurl + imgpath;
  } else {
    return this.genk.defaultImg;
  }
}

setImgRemote(imgpath) {
  if (imgpath && imgpath.length > 0) {
    return imgpath;
  } else {
    return this.genk.defaultImg;
  }
}


getClassNames() {
  this.sch.getClassNames()
  .subscribe(res => {
    this.schoolClasses = res;
  });
}

setLGA(state: string) {
  this.lgs = this.objService.lga[state];
  this.student.stateofOrigin = state;
}

selectLG(lg: string) {
  this.student.lga = lg;
}


  updateStudent() {
    this.student.schoolId = this.auth.currentUserValue.schoolId;
    this.student.passport = this.genk.studentImgFile;
    if (this.student.classId) {
      this.student.Class = this.schoolClasses.filter(t => t.id == this.student.classId)[0].class;
    }

    const formDat: FormData = new FormData();

    for (const key in this.student) {
      if (this.student[key]) {
        switch (key.toString()) {
          case 'passport':
            formDat.append("media", this.genk.studentImgFile, this.passportName);
            break;
          default:
            formDat.append(key.toString(), this.student[key]);
            break;
        }
      }
    }
    // this.auth.savePersonalInfo(this.student).subscribe();
    let timerInterval;
    Swal.fire({
      title: 'Processing Data...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
        Swal.showLoading();
        this.sch.updateStudent(formDat)
          .pipe(takeUntil(this.destroy))
          .subscribe(res => {
            Swal.close();
          });

      }
    }).then(x => {
      Swal.fire({
        icon: 'success',
        title: 'Student Information Saved!.',
        showConfirmButton: false,
        timer: 2000
      });
    })
  }

  // changeSession(value: string) {
  //   this.academicSessionId = value;
  //   this.subjectlist = [];
  //   this.scorelist = [];
  //   this.highlist = [];
  //   this.chartDoubleOptions = null;
  //   this.getGenderStat();
  // }

  // changeTerm(value: string) {
  //   this.academicTerm = value;
  //   this.subjectlist = [];
  //   this.scorelist = [];
  //   this.highlist = [];
  //   this.chartDoubleOptions = null;
  //   this.getGenderStat();
  // }

  // getAverageData() {
  //   this.sch.getAcademicAverage(this.student.classId, this.academicSessionId, this.academicTerm, this.student.id.toString())
  //   .subscribe(res => {
  //     this.myave = res.myaverage ? res.myaverage : 0;
  //     this.highestave = res.highest ? res.highest: 0;
  //     this.lowestave = res.lowest ? res.lowest : 0;
  //     this.cd.markForCheck();
  //   })
  // }

  // getGenderStat() {
  //   this.getAverageData();
  //   this.sch.getAcademicRecordData(this.student.classId, this.academicSessionId, this.academicTerm, this.student.id.toString())
  //     .subscribe((res: any[]) => {
  //       this.genderStat = res;
  //       let keydata = Object.keys(res);
        
  //       for(var item of res) {
  //         this.subjectlist.push(item.subject);
  //         this.scorelist.push(item.score);
  //         this.highlist.push(item.highestScore);
  //       }
  //       //let valuedata = Object.values(res);
  //       this.chartDoubleOptions = {
  //         series: [
  //           {
  //             name: "Student Score",
  //             data: this.scorelist.length > 0 ? this.scorelist : []
  //           },
  //           {
  //             name: "Highest Score",
  //             data: this.highlist.length > 0 ? this.highlist : []
  //           }
  //         ],
  //         chart: {
  //           type: "bar",
  //           height: 350
  //         },
  //         plotOptions: {
  //           bar: {
  //             horizontal: false,
  //             columnWidth: "55%"
  //           }
  //         },
  //         dataLabels: {
  //           enabled: false
  //         },
  //         stroke: {
  //           show: true,
  //           width: 2,
  //           colors: ["transparent"]
  //         },
  //         xaxis: {
  //           categories: this.subjectlist.length > 0 ? this.subjectlist : []
  //         },
  //         yaxis: {
  //           title: {
  //             text: "Student score"
  //           },
  //           labels: {
  //             formatter: function (val) {
  //               return val.toFixed(1);  // Reduce to 1 decimal place
  //             }
  //           }
  //         },
  //         fill: {
  //           opacity: 1
  //         },
  //         tooltip: {
  //           y: {
  //             formatter: function(val) {
  //               return val + " points";
  //             }
  //           }
  //         }
  //       };
  //     })
  // }

  deactivateAccount(id: number) {
    Swal.fire({
      title: "Do you really want to deactivated this student?",
      text: "You won't be able to upload result for this student",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Deactivate"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.sch.deactivateAccount(id.toString(), this.reason)
            .subscribe(res => {
              Swal.fire({
                icon: 'success',
                title: 'Student deactivated successfully!.',
                showConfirmButton: false,
                timer: 2000
              });
        })
      }
    });
  }

  changeReason(value: string) {
    debugger;
    if (value == 'Others') {
      this.isOther = true;
      this.topreason = value;
    } else {
      this.reason = value;
      this.topreason = value;
    }
    this.cd.markForCheck();
  }

  activateAccount(id: number) {
    Swal.fire({
      title: "Do you really want to activated this student?",
      text: "Result can be uploaded for this student",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Activate"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.sch.activateAccount(id.toString())
            .subscribe(res => {
              Swal.fire({
                icon: 'success',
                title: 'Student deactivated successfully!.',
                showConfirmButton: false,
                timer: 2000
              });
        })
      }
    });
  }

  formatDateOnly(value: string) {
    if (value.length > 10) {
      return value.split('T')[0];
    } else {
      return value;
    }
  }
}
