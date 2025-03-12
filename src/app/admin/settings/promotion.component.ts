import { Component, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import { Subject } from 'rxjs/internal/Subject';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexPlotOptions,
  ApexNonAxisChartSeries,
  ApexFill,
  ApexStroke,
  ApexYAxis,
  ApexDataLabels,
  ApexLegend,
  ApexGrid
} from "ng-apexcharts";

type ApexXAxis = {
  type?: "category" | "datetime" | "numeric";
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
};

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
  fill: ApexFill;
};

// export type ChartOptions = {
//   series: ApexAxisChartSeries;
//   chart: ApexChart;
//   xaxis: ApexXAxis;
//   title: ApexTitleSubtitle;
//   fill: ApexFill;
// };

export type RadialChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
};

@Component({
  templateUrl: './promotion.component.html',
  styleUrls: ['promotion.component.css']
})
export class PromotionComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  chartOptions: Partial<ChartOptions>;
  radialChartOptions: Partial<RadialChartOptions>;
    genk: GenericService;
    schoolClasses = [];
    schoolLevels = [];
    bigboss = [];
    destroy = new Subject;
    mydata = [];
    classSubjects = [];
    coreSubjects = [];
    sendData = [];
    failLimit = 0;
    isPromoAverage = false;
    isCoreSubject = false;
    isPromotionByCount = false;
    isBoth = '';
    isBothAnd = false;
    isBothOr = false;
    settingsType: string;
    settingsValue: string;
    promotionSetting: any;
    sessionlist = [];
  currentSessionObj: any;
  currentSession: string;
  currentSessionId: string;
  currentTerm: string;
  corePassedResult = [];
  coreFailedResult = [];
  averagePassedResult = [];
  averageFailedResult = [];
  resultlist = [];
  passedResult = [];
  failedResult = [];
  isPassed = false;
  passCount: number;
  failCount: number;
  isChartReady = false;
  passPercentage: number;
  coreSubjectCount: number;
  averageCoreSubjectType: string;
  coreSubjectMustPassCount: number;
  promotionByCountTotalPass: number;

  promotionByCountResults = [];
  promotionByAverageResults = [];
  promotionByCoreSubjectsResults = [];

  constructor( 
    private router: Router,
    private auth: AuthenticationService,
    private sch: SchoolService,
    private gen: GenericService
    ) {
      this.genk = gen;
       
}

ngOnInit(): void {
  this.genk.topdata = 'Promotion Criteria';
  this.getLevels();
}

setImg(imgpath) {
  if (imgpath && imgpath.length > 0) {
    return this.genk.imgurl + imgpath;
  } else {
    return this.genk.defaultImg;
  }
}

showChart() {
  // this.chartOptions = {
  //   series: [
  //     {
  //       name: "My-series",
  //       data: [this.passedResult.length, this.failedResult.length]
  //     }
  //   ],
  //   chart: {
  //     height: 500,
  //     type: "bar"
  //   },
  //   fill: {
  //     colors: [
  //       "#FF0000"
  //     ],
  //   },
  //   xaxis: {
  //     categories: ["Passed", "Failed"]
  //   }
  // };

  this.chartOptions = {
    series: [
      {
        name: "distibuted",
        data: [this.passedResult.length, this.failedResult.length]
      }
    ],
    chart: {
      height: 350,
      type: "bar",
      events: {
        click: function(chart, w, e) {
          // console.log(chart, w, e)
        }
      }
    },
    colors: [
      "#00E396",
      "#FF4560"
    ],
    plotOptions: {
      bar: {
        columnWidth: "45%",
        distributed: true
      }
    },
    fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            type: "horizontal",
            shadeIntensity: 0.5,
            gradientToColors: ["#ABE5A1", "#a41313"],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100]
          }
        },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    grid: {
      show: false
    },
    xaxis: {
      categories: [
        ["Passed"],
        ["Failed"]
      ],
      labels: {
        style: {
          colors: [
            "#000000",
            "#000000"
          ],
          fontSize: "12px"
        }
      }
    }
  };

  this.radialChartOptions = {
    series: [this.passPercentage],
    chart: {
      height: 350,
      type: "radialBar",
      toolbar: {
        show: true
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: "70%",
          background: "#fff",
          image: undefined,
          position: "front",
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24
          }
        },
        track: {
          background: "#fff",
          strokeWidth: "67%",
          margin: 0, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35
          }
        },

        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: "#888",
            fontSize: "17px"
          },
          value: {
            formatter: function(val) {
              return parseInt(val.toString(), 10).toString();
            },
            color: "#111",
            fontSize: "36px",
            show: true
          }
        }
      }
    },
    // fill: {
    //   colors: [
    //     "#FF0000",
    //     "#008000"
    //   ],
    // },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#ABE5A1"],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: "round"
    },
    labels: ["% Passed"]
  };
}



switchCat(value: string) {
  this.genk.isCategoryActive = value == 'pass'? true : false;
  this.resultlist = value == 'pass'? this.passedResult : this.failedResult;
  this.isPassed = value == 'pass'? true : false;
}


  getLevels() {
    this.sch.getClassLevels()
    .subscribe(res => {
      this.schoolLevels = res;
    });
  }

  getClassByLevel(classId: number) {
    this.genk.criCurrentClassLevelId = classId;
    this.sch.getClassByLevel(this.genk.criCurrentClassLevelId.toString())
    .subscribe(res => {
      this.schoolClasses = res;
      this.mydata = [];
    });
  }

  changeClass(classId: number) {
    this.genk.criCurrentClassId = classId;
    this.getPromotionAverage();
    this.getCoreSubjects();
    this.getPromotionSetting();
    this.getSession();
    this.getCurrentSession();
  }

  loadCriteria() {
    // this.getPromotionAverage();
    // this.getCoreSubjects();
    // this.getPromotionByCount();
    this.getPromotionSetting();
  }

  getPromotionAverage() {
    this.sch.getPromotionAverage(this.genk.criCurrentClassId.toString())
    .subscribe(res => {
      this.failLimit = res.failLimit;
    });
  }

  savePromotionAverage() {
      this.sch.savePromotionAverage(this.failLimit.toString(), this.genk.criCurrentClassId.toString())
        .subscribe(res => {
          this.loadCriteria();
          Swal.fire({
            icon: 'success',
            title: 'Promotion Average updated successfully!.',
            showConfirmButton: false,
            timer: 2000
          });
        });
  }

  getCoreSubjects() {
    this.sch.getCoreSubjectsByClass(this.genk.criCurrentClassId.toString())
    .subscribe(res => {
      this.coreSubjects = res;
      //this.coreSubjectCount = this.coreSubjects.length;
    });
  }

  setCore(value: number, subjectId: number) {
    if (this.bigboss.filter(t => t.subjectId == subjectId).length > 0) {
      this.bigboss[this.bigboss.findIndex(t => t.subjectId == Number(subjectId))].value = Number(value);
    } else {
      this.bigboss.push({subjectId: subjectId, value: Number(value)});
    }
  }

  saveCoreScore() {
    Swal.fire({
      title: 'Processing Data...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
        debugger;
        Swal.showLoading();
        this.sch.updateCoreSubject(this.bigboss, this.genk.criCurrentClassId.toString(), this.coreSubjectMustPassCount.toString())
          .pipe(takeUntil(this.destroy))
          .subscribe(res => {
            Swal.close();
        });
      }
    }).then(x => {
      this.loadCriteria();
      //this.getStudents();
      Swal.fire({
        icon: 'success',
        title: 'Core Subjects updated successfully!.',
        showConfirmButton: false,
        timer: 2000
      });
    })
  }

  savePromotionByCount() {
    debugger
    let goo = this.promotionByCountTotalPass;
    this.sch.savePromotionByCount(this.promotionByCountTotalPass.toString(), this.genk.criCurrentClassId.toString())
      .subscribe(res => {
        this.loadCriteria();
        Swal.fire({
          icon: 'success',
          title: 'Promotion By Count Total updated successfully!.',
          showConfirmButton: false,
          timer: 2000
        });
      });
}

  setPromotionAverage(value: boolean) {
    this.isPromoAverage = value;
    this.settingsType = 'AVERAGE';
    this.settingsValue = value.toString();
    this.createPromotionSetting();
  }

  setCoreSubject(value: boolean) {
    this.isCoreSubject = value;
    this.settingsType = 'CORESUBJECT';
    this.settingsValue = value.toString();
    this.createPromotionSetting();
  }

  setPromotionByCount(value: boolean) {
    this.isPromotionByCount = value;
    this.settingsType = 'PROMOTIONBYCOUNT';
    this.settingsValue = value.toString();
    this.createPromotionSetting();
  }

  setBothOr(value: boolean) {
    this.isBothOr = value;
    this.settingsType = 'BOTH';
    this.settingsValue = value ? 'OR' : '';
    this.createPromotionSetting();
  }

  setBothAnd(value: boolean) {
    this.isBothAnd = value;
    this.settingsType = 'BOTH';
    this.settingsValue = value ? 'AND' : '';
    this.createPromotionSetting();
  }

  createPromotionSetting() {
    Swal.fire({
      title: 'Processing Data...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
        Swal.showLoading();
        this.sch.createPromotionSetting(this.settingsType, this.settingsValue, this.genk.criCurrentClassId.toString())
          .pipe(takeUntil(this.destroy))
          .subscribe(res => {
            Swal.close();
        });
      }
    }).then(x => {
      //this.getStudents();
      this.loadCriteria();
      Swal.fire({
        icon: 'success',
        title: 'Criteria updated successfully!.',
        showConfirmButton: false,
        timer: 2000
      });
    })
  }

  getPromotionSetting() {
    this.sch.getPromotionSetting(this.genk.criCurrentClassId.toString())
    .subscribe(res => {
      this.promotionSetting = res;
      this.isPromoAverage = res.average;
      this.isCoreSubject = res.coreSubject;
      this.isPromotionByCount = res.promotionByCount;
      this.promotionByCountTotalPass = res.promotionMustPassCount;
      this.coreSubjectMustPassCount = res.coreSubjectMustPassCount ? res.coreSubjectMustPassCount : this.coreSubjects.length;
      this.coreSubjectCount =  res.coreSubjectMustPassCount ? res.coreSubjectMustPassCount : this.coreSubjects.length;
      this.averageCoreSubjectType = res.averageCoreSubject;
      if (res.averageCoreSubject == 'OR') {
        this.isBothOr = true;
      } 
      if (res.averageCoreSubject == 'AND') {
        this.isBothAnd = true;
      }
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
        if (this.currentSessionObj.currentTerm) {
          this.currentTerm = this.currentSessionObj.currentTerm;
        }
      })
  }

  // applyRule() {
  //   this.getPromotionPositionAverageStudents();
  // }

  getPromotionPositionAverageStudents() {
    if (this.currentTerm == 'ANNUAL') {
      this.sch.getPromotionPositionAnnualAverageStudents(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString())
      .subscribe(res => {
        this.resultlist = res;
        this.promotionByAverageResults = res;
        this.passedResult = this.resultlist.filter(t => t.average >= this.failLimit);
        this.failedResult = this.resultlist.filter(t => t.average < this.failLimit);
        this.averagePassedResult = this.resultlist.filter(t => t.average >= this.failLimit);
        this.averageFailedResult = this.resultlist.filter(t => t.average < this.failLimit);
        this.passCount = this.passedResult.length;
        this.failCount = this.failedResult.length;
        this.passPercentage = (this.passCount / this.resultlist.length) * 100;
        this.isChartReady = true;
        this.showChart();
        if (this.genk.isCategoryActive) {
          this.resultlist = this.passedResult;
        } else {
          this.resultlist = this.failedResult;
        }
        
        //this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
      })
    } else {
      this.sch.getPromotionPositionAverageStudents(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        this.resultlist = res;
        this.promotionByAverageResults = res;
        this.passedResult = this.resultlist.filter(t => t.average >= this.failLimit);
        this.failedResult = this.resultlist.filter(t => t.average < this.failLimit);
        this.averagePassedResult = this.resultlist.filter(t => t.average >= this.failLimit);
        this.averageFailedResult = this.resultlist.filter(t => t.average < this.failLimit);
        this.passCount = this.passedResult.length;
        this.failCount = this.failedResult.length;
        this.passPercentage = (this.passCount / this.resultlist.length) * 100;
        this.isChartReady = true;
        this.showChart();

        if (this.genk.isCategoryActive) {
          this.resultlist = this.passedResult;
        } else {
          this.resultlist = this.failedResult;
        }
        //this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
      })
    }
  }

  getPromotionCoreSubject() {
    if (this.currentTerm == 'ANNUAL') {
        this.sch.getPromotionAnnualCoreSubject(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString())
      .subscribe(res => {
        this.resultlist = res;
        this.promotionByCoreSubjectsResults = res;
        this.passedResult = this.resultlist.filter(t => t.passCount >= this.coreSubjectCount);
        this.failedResult = this.resultlist.filter(t => t.passCount < this.coreSubjectCount);
        this.corePassedResult = this.resultlist.filter(t => t.passCount >= this.coreSubjectCount);
        this.coreFailedResult = this.resultlist.filter(t => t.passCount < this.coreSubjectCount);
        this.passCount = this.passedResult.length;
        this.failCount = this.failedResult.length;
        this.passPercentage = (this.passCount / this.resultlist.length) * 100;
        this.isChartReady = true;
        this.showChart();

        if (this.genk.isCategoryActive) {
          this.resultlist = this.passedResult;
        } else {
          this.resultlist = this.failedResult;
        }
        //this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
      })
    } else {
      this.sch.getPromotionCoreSubject(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        this.resultlist = res;
        this.promotionByCoreSubjectsResults = res;
        this.passedResult = this.resultlist.filter(t => t.passCount >= this.coreSubjectCount);
        this.failedResult = this.resultlist.filter(t => t.passCount < this.coreSubjectCount);
        this.corePassedResult = this.resultlist.filter(t => t.passCount >= this.coreSubjectCount);
        this.coreFailedResult = this.resultlist.filter(t => t.passCount < this.coreSubjectCount);
        this.passCount = this.passedResult.length;
        this.failCount = this.failedResult.length;
        this.passPercentage = (this.passCount / this.resultlist.length) * 100;
        this.isChartReady = true;
        this.showChart();
        
        if (this.genk.isCategoryActive) {
          this.resultlist = this.passedResult;
        } else {
          this.resultlist = this.failedResult;
        }
        //this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
      })
    }
  }

  getPromotionByCount() {
    if (this.currentTerm == 'ANNUAL') {
        this.sch.getPromotionByCountAnnual(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString())
      .subscribe(res => {
        this.resultlist = res;
        this.promotionByCountResults = res;
        this.passedResult = this.resultlist.filter(t => t.passCount >= this.promotionByCountTotalPass);
        this.failedResult = this.resultlist.filter(t => t.passCount < this.promotionByCountTotalPass);
        this.passCount = this.passedResult.length;
        this.failCount = this.failedResult.length;
        this.passPercentage = (this.passCount / this.resultlist.length) * 100;
        this.isChartReady = true;
        this.showChart();

        if (this.genk.isCategoryActive) {
          this.resultlist = this.passedResult;
        } else {
          this.resultlist = this.failedResult;
        }
        //this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
      })
    } else {
      this.sch.getPromotionByCount(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        this.resultlist = res;
        this.promotionByCountResults = res;
        this.passedResult = this.resultlist.filter(t => t.passCount >= this.promotionByCountTotalPass);
        this.failedResult = this.resultlist.filter(t => t.passCount < this.promotionByCountTotalPass);
        this.passCount = this.passedResult.length;
        this.failCount = this.failedResult.length;
        this.passPercentage = (this.passCount / this.resultlist.length) * 100;
        this.isChartReady = true;
        this.showChart();
        
        if (this.genk.isCategoryActive) {
          this.resultlist = this.passedResult;
        } else {
          this.resultlist = this.failedResult;
        }
        //this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
      })
    }
  }

  getPromotionTotalORStudents() {
    if (this.currentTerm == 'ANNUAL') {
      this.sch.getPromotionPositionAnnualAverageStudents(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString())
      .subscribe(res => {
        this.resultlist = res;
        this.passedResult = this.resultlist.filter(t => t.average >= this.failLimit);
        this.failedResult = this.resultlist.filter(t => t.average < this.failLimit);
        this.averagePassedResult = this.resultlist.filter(t => t.average >= this.failLimit);
        this.averageFailedResult = this.resultlist.filter(t => t.average < this.failLimit);
        this.passCount = this.passedResult.length;
        this.failCount = this.failedResult.length;
        this.sch.getPromotionAnnualCoreSubject(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString())
          .subscribe(res => {
            this.resultlist = res;
            this.passedResult = this.resultlist.filter(t => t.passCount >= this.coreSubjectCount);
            this.failedResult = this.resultlist.filter(t => t.passCount < this.coreSubjectCount);
            this.corePassedResult = this.resultlist.filter(t => t.passCount >= this.coreSubjectCount);
            this.coreFailedResult = this.resultlist.filter(t => t.passCount < this.coreSubjectCount);
            this.passCount = this.passedResult.length;
            this.failCount = this.failedResult.length;
            
            let toarr = this.averagePassedResult.concat(this.corePassedResult);

            const key = 'studentId';
            let joinArray = [...new Map(toarr.map(item => [item[key], item])).values()];

            this.passedResult = joinArray;

            let restu = res;
            joinArray.forEach(d => {
              if (restu.filter(f => f.studentId == d.studentId).length > 0) {
                restu = restu.filter(f => f.studentId !== d.studentId);
              }
            })
            this.failedResult = restu;
            this.passPercentage = (this.passedResult.length / res.length) * 100;

            this.isChartReady = true;
            this.showChart();
            if (this.genk.isCategoryActive) {
              this.resultlist = this.passedResult;
            } else {
              this.resultlist = this.failedResult;
            }
            //this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
          })
      })
    } else {
      this.sch.getPromotionPositionAverageStudents(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        this.resultlist = res;
        this.passedResult = this.resultlist.filter(t => t.average >= this.failLimit);
        this.failedResult = this.resultlist.filter(t => t.average < this.failLimit);
        this.averagePassedResult = this.resultlist.filter(t => t.average >= this.failLimit);
        this.averageFailedResult = this.resultlist.filter(t => t.average < this.failLimit);
        this.passCount = this.passedResult.length;
        this.failCount = this.failedResult.length;
        this.sch.getPromotionCoreSubject(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm)
          .subscribe(res => {
            this.resultlist = res;
            this.passedResult = this.resultlist.filter(t => t.passCount >= this.coreSubjectCount);
            this.failedResult = this.resultlist.filter(t => t.passCount < this.coreSubjectCount);
            this.corePassedResult = this.resultlist.filter(t => t.passCount >= this.coreSubjectCount);
            this.coreFailedResult = this.resultlist.filter(t => t.passCount < this.coreSubjectCount);
            this.passCount = this.passedResult.length;
            this.failCount = this.failedResult.length;
            
            let toarr = this.averagePassedResult.concat(this.corePassedResult);

            const key = 'studentId';
            let joinArray = [...new Map(toarr.map(item => [item[key], item])).values()];

            this.passedResult = joinArray;

            let restu = res;
            joinArray.forEach(d => {
              if (restu.filter(f => f.studentId == d.studentId).length > 0) {
                restu = restu.filter(f => f.studentId !== d.studentId);
              }
            })
            this.failedResult = restu;
            this.passPercentage = (this.passedResult.length / res.length) * 100;

            this.isChartReady = true;
            this.showChart();
            if (this.genk.isCategoryActive) {
              this.resultlist = this.passedResult;
            } else {
              this.resultlist = this.failedResult;
            }
            //this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
          })
      })
    }
    
  }


  getPromotionTotalAndStudents() {
    if (this.currentTerm == 'ANNUAL') {
      this.sch.getPromotionPositionAnnualAverageStudents(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString())
      .subscribe(res => {
        this.resultlist = res;
        this.passedResult = this.resultlist.filter(t => t.average >= this.failLimit);
        this.failedResult = this.resultlist.filter(t => t.average < this.failLimit);
        this.averagePassedResult = this.resultlist.filter(t => t.average >= this.failLimit);
        this.averageFailedResult = this.resultlist.filter(t => t.average < this.failLimit);
        this.passCount = this.passedResult.length;
        this.failCount = this.failedResult.length;
        this.sch.getPromotionAnnualCoreSubject(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString())
          .subscribe(res => {
            this.resultlist = res;
            this.passedResult = this.resultlist.filter(t => t.passCount >= this.coreSubjectCount);
            this.failedResult = this.resultlist.filter(t => t.passCount < this.coreSubjectCount);
            this.corePassedResult = this.resultlist.filter(t => t.passCount >= this.coreSubjectCount);
            this.coreFailedResult = this.resultlist.filter(t => t.passCount < this.coreSubjectCount);
            this.passCount = this.passedResult.length;
            this.failCount = this.failedResult.length;
            this.passPercentage = (this.passCount / this.resultlist.length) * 100;
            debugger;
            let toarr = this.averagePassedResult.concat(this.corePassedResult);
            const key = 'studentId';
            let joinArray = [];
            toarr.forEach(a => {
              if (toarr.filter(b => b.studentId == a.studentId).length > 1) {
                joinArray.push(this.corePassedResult.filter(c => c.studentId == a.studentId)[0]);
                toarr = toarr.filter(b => b.studentId !== a.studentId);
              }
            });
            this.passedResult = joinArray;

            let restu = res;
            joinArray.forEach(d => {
              if (restu.filter(f => f.studentId == d.studentId).length > 0) {
                restu = restu.filter(f => f.studentId !== d.studentId);
              }
            })
            this.passPercentage = (this.passedResult.length / res.length) * 100;
            this.failedResult = restu;
            this.isChartReady = true;
            this.showChart();
            
            if (this.genk.isCategoryActive) {
              this.resultlist = this.passedResult;
            } else {
              this.resultlist = this.failedResult;
            }
            //this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
          })
      })
    } else {
      this.sch.getPromotionPositionAverageStudents(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm)
      .subscribe(res => {
        this.resultlist = res;
        this.passedResult = this.resultlist.filter(t => t.average >= this.failLimit);
        this.failedResult = this.resultlist.filter(t => t.average < this.failLimit);
        this.averagePassedResult = this.resultlist.filter(t => t.average >= this.failLimit);
        this.averageFailedResult = this.resultlist.filter(t => t.average < this.failLimit);
        this.passCount = this.passedResult.length;
        this.failCount = this.failedResult.length;
        this.sch.getPromotionCoreSubject(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm)
          .subscribe(res => {
            this.resultlist = res;
            this.passedResult = this.resultlist.filter(t => t.passCount >= this.coreSubjectCount);
            this.failedResult = this.resultlist.filter(t => t.passCount < this.coreSubjectCount);
            this.corePassedResult = this.resultlist.filter(t => t.passCount >= this.coreSubjectCount);
            this.coreFailedResult = this.resultlist.filter(t => t.passCount < this.coreSubjectCount);
            this.passCount = this.passedResult.length;
            this.failCount = this.failedResult.length;
            this.passPercentage = (this.passCount / this.resultlist.length) * 100;
            debugger;
            let toarr = this.averagePassedResult.concat(this.corePassedResult);
            const key = 'studentId';
            let joinArray = [];
            toarr.forEach(a => {
              if (toarr.filter(b => b.studentId == a.studentId).length > 1) {
                joinArray.push(this.corePassedResult.filter(c => c.studentId == a.studentId)[0]);
                toarr = toarr.filter(b => b.studentId !== a.studentId);
              }
            });
            this.passedResult = joinArray;

            let restu = res;
            joinArray.forEach(d => {
              if (restu.filter(f => f.studentId == d.studentId).length > 0) {
                restu = restu.filter(f => f.studentId !== d.studentId);
              }
            })
            this.passPercentage = (this.passedResult.length / res.length) * 100;
            this.failedResult = restu;
            this.isChartReady = true;
            this.showChart();
            
            if (this.genk.isCategoryActive) {
              this.resultlist = this.passedResult;
            } else {
              this.resultlist = this.failedResult;
            }
            //this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
          })
      })
    }
  }


  findPosition() {
    debugger;
    let m = this.isPromoAverage;
    let n = this.isPromotionByCount;
    let o  = this.isCoreSubject;
    //this.getCountAndCore();

    if (this.isPromoAverage && !this.isCoreSubject && !this.isPromotionByCount) {
      this.getPromotionPositionAverageStudents();
    }
    if (!this.isPromoAverage && !this.isPromotionByCount && this.isCoreSubject) {
      this.getPromotionCoreSubject();
    }
    if (this.isPromotionByCount && !this.isPromoAverage && !this.isCoreSubject) {
      this.getPromotionByCount();
    }
    if (this.isPromoAverage && this.isCoreSubject && !this.isPromotionByCount) {
      if (this.averageCoreSubjectType == 'OR') this.getPromotionTotalORStudents();
      if (this.averageCoreSubjectType == 'AND')this.getPromotionTotalAndStudents();
    }
    if (this.isPromotionByCount && this.isCoreSubject && !this.isPromoAverage) {
      if (this.averageCoreSubjectType == 'OR') this.getCountOrCore();
      if (this.averageCoreSubjectType == 'AND')this.getCountAndCore();
    }
    if (this.isPromotionByCount && !this.isCoreSubject && this.isPromoAverage) {
      if (this.averageCoreSubjectType == 'OR') this.getCountOrAverage();
      if (this.averageCoreSubjectType == 'AND')this.getCountAndAverage();
    }

    if (this.isPromotionByCount && this.isCoreSubject && this.isPromoAverage) {
      if (this.averageCoreSubjectType == 'OR') this.getCountOrCoreOrAverage();
      if (this.averageCoreSubjectType == 'AND')this.getCountAndCoreAndAverage();
    }
  }

  changeSession(sessionId: number) {
    this.currentSessionId = sessionId.toString();
    this.findPosition();
  }
  
  changeTerm(term: string) {
    this.currentTerm = term;
    this.findPosition();
  }

  async getCountAndCore() {
    if (this.currentTerm == 'ANNUAL') {
      let countPromise = new Promise((resolve, reject) => {
        this.sch.getPromotionByCountAnnual(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString())
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByCountResults = res;
          resolve(1);
        });
      });
      const countResult = await countPromise;
  
      let corePromise = new Promise((resolve, reject) => {
        this.sch.getPromotionAnnualCoreSubject(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString())
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByCoreSubjectsResults = res;
          resolve(1);
        });
      });
      const coreResult = await corePromise;
    } else {
      let countPromise = new Promise((resolve, reject) => {
        this.sch.getPromotionByCount(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm)
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByCountResults = res;
          resolve(1);
        });
      });
      const countResult = await countPromise;
  
      let corePromise = new Promise((resolve, reject) => {
        this.sch.getPromotionCoreSubject(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm)
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByCoreSubjectsResults = res;
          resolve(1);
        });
      });
      const coreResult = await corePromise;
    }

    

    for (let i = 0; i < this.promotionByCoreSubjectsResults.length; i++) {
      this.promotionByCoreSubjectsResults[i].count =  this.promotionByCountResults[this.promotionByCountResults.findIndex(t => t.studentId == this.promotionByCoreSubjectsResults[i].studentId)].passCount;
    }
    this.passedResult = this.promotionByCoreSubjectsResults.filter(t => t.passCount >= this.coreSubjectCount && t.count >= this.promotionByCountTotalPass)
    let mypasslist = this.passedResult;
    let restu = this.promotionByCoreSubjectsResults;
    mypasslist.forEach(d => {
      if (restu.filter(f => f.studentId == d.studentId).length > 0) {
          restu = restu.filter(f => f.studentId !== d.studentId);
      }
    });
    this.failedResult = restu;

    this.passPercentage = (this.passedResult.length / this.promotionByCoreSubjectsResults.length) * 100;
    this.isChartReady = true;
    this.showChart();

    if (this.genk.isCategoryActive) {
      this.resultlist = this.passedResult;
    } else {
      this.resultlist = this.failedResult;
    }
  }

  async getCountOrCore() {
    if (this.currentTerm == 'ANNUAL') {
      let countPromise = new Promise((resolve, reject) => {
        this.sch.getPromotionByCountAnnual(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString())
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByCountResults = res;
          resolve(1);
        });
      });
      const countResult = await countPromise;
  
      let corePromise = new Promise((resolve, reject) => {
        this.sch.getPromotionAnnualCoreSubject(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString())
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByCoreSubjectsResults = res;
          resolve(1);
        });
      });
      const coreResult = await corePromise;
    } else {
      let countPromise = new Promise((resolve, reject) => {
        this.sch.getPromotionByCount(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm)
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByCountResults = res;
          resolve(1);
        });
      });
      const countResult = await countPromise;
  
      let corePromise = new Promise((resolve, reject) => {
        this.sch.getPromotionCoreSubject(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm)
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByCoreSubjectsResults = res;
          resolve(1);
        });
      });
      const coreResult = await corePromise;
    }

    

    for (let i = 0; i < this.promotionByCoreSubjectsResults.length; i++) {
      this.promotionByCoreSubjectsResults[i].count =  this.promotionByCountResults[this.promotionByCountResults.findIndex(t => t.studentId == this.promotionByCoreSubjectsResults[i].studentId)].passCount;
    }
    this.passedResult = this.promotionByCoreSubjectsResults.filter(t => t.passCount >= this.coreSubjectCount || t.count >= this.promotionByCountTotalPass)
    let mypasslist = this.passedResult;
    let restu = this.promotionByCoreSubjectsResults;
    mypasslist.forEach(d => {
      if (restu.filter(f => f.studentId == d.studentId).length > 0) {
          restu = restu.filter(f => f.studentId !== d.studentId);
      }
    });
    this.failedResult = restu;

    this.passPercentage = (this.passedResult.length / this.promotionByCoreSubjectsResults.length) * 100;
    this.isChartReady = true;
    this.showChart();

    if (this.genk.isCategoryActive) {
      this.resultlist = this.passedResult;
    } else {
      this.resultlist = this.failedResult;
    }
  }

  async getCountOrAverage() {
    if (this.currentTerm == 'ANNUAL') {
      let countPromise = new Promise((resolve, reject) => {
        this.sch.getPromotionByCountAnnual(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString())
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByCountResults = res;
          resolve(1);
        });
      });
      const countResult = await countPromise;
  
      let averagePromise = new Promise((resolve, reject) => {
        this.sch.getPromotionPositionAnnualAverageStudents(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString())
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByAverageResults = res;
          resolve(1);
        });
      });
      const coreResult = await averagePromise;
    } else {
      let countPromise = new Promise((resolve, reject) => {
        this.sch.getPromotionByCount(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm)
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByCountResults = res;
          resolve(1);
        });
      });
      const countResult = await countPromise;
  
      let corePromise = new Promise((resolve, reject) => {
        this.sch.getPromotionPositionAverageStudents(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm)
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByAverageResults = res;
          resolve(1);
        });
      });
      const coreResult = await corePromise;
    }

    

    for (let i = 0; i < this.promotionByAverageResults.length; i++) {
      this.promotionByAverageResults[i].count =  this.promotionByCountResults[this.promotionByCountResults.findIndex(t => t.studentId == this.promotionByAverageResults[i].studentId)].passCount;
    }
    this.passedResult = this.promotionByAverageResults.filter(t => t.average >= this.failLimit || t.count >= this.promotionByCountTotalPass)
    let mypasslist = this.passedResult;
    let restu = this.promotionByAverageResults;
    mypasslist.forEach(d => {
      if (restu.filter(f => f.studentId == d.studentId).length > 0) {
          restu = restu.filter(f => f.studentId !== d.studentId);
      }
    });
    this.failedResult = restu;

    this.passPercentage = (this.passedResult.length / this.promotionByAverageResults.length) * 100;
    this.isChartReady = true;
    this.showChart();

    if (this.genk.isCategoryActive) {
      this.resultlist = this.passedResult;
    } else {
      this.resultlist = this.failedResult;
    }
  }

  
  async getCountAndAverage() {
    if (this.currentTerm == 'ANNUAL') {
      let countPromise = new Promise((resolve, reject) => {
        this.sch.getPromotionByCountAnnual(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString())
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByCountResults = res;
          resolve(1);
        });
      });
      const countResult = await countPromise;
  
      let averagePromise = new Promise((resolve, reject) => {
        this.sch.getPromotionPositionAnnualAverageStudents(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString())
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByAverageResults = res;
          resolve(1);
        });
      });
      const coreResult = await averagePromise;
    } else {
      let countPromise = new Promise((resolve, reject) => {
        this.sch.getPromotionByCount(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm)
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByCountResults = res;
          resolve(1);
        });
      });
      const countResult = await countPromise;
  
      let corePromise = new Promise((resolve, reject) => {
        this.sch.getPromotionPositionAverageStudents(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm)
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByAverageResults = res;
          resolve(1);
        });
      });
      const coreResult = await corePromise;
    }

    

    for (let i = 0; i < this.promotionByAverageResults.length; i++) {
      this.promotionByAverageResults[i].count =  this.promotionByCountResults[this.promotionByCountResults.findIndex(t => t.studentId == this.promotionByAverageResults[i].studentId)].passCount;
    }
    this.passedResult = this.promotionByAverageResults.filter(t => t.average >= this.failLimit && t.count >= this.promotionByCountTotalPass)
    let mypasslist = this.passedResult;
    let restu = this.promotionByAverageResults;
    mypasslist.forEach(d => {
      if (restu.filter(f => f.studentId == d.studentId).length > 0) {
          restu = restu.filter(f => f.studentId !== d.studentId);
      }
    });
    this.failedResult = restu;

    this.passPercentage = (this.passedResult.length / this.promotionByAverageResults.length) * 100;
    this.isChartReady = true;
    this.showChart();

    if (this.genk.isCategoryActive) {
      this.resultlist = this.passedResult;
    } else {
      this.resultlist = this.failedResult;
    }
  }

  // async getCountOrCore() {
  //   if (this.currentTerm == 'ANNUAL') {
  //     let countPromise = new Promise((resolve, reject) => {
  //       this.sch.getPromotionByCountAnnual(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString())
  //       .subscribe(res => {
  //         this.resultlist = res;
  //         this.promotionByCountResults = res;
  //         resolve(1);
  //       });
  //     });
  //     const countResult = await countPromise;
  
  //     let corePromise = new Promise((resolve, reject) => {
  //       this.sch.getPromotionAnnualCoreSubject(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString())
  //       .subscribe(res => {
  //         this.resultlist = res;
  //         this.promotionByCoreSubjectsResults = res;
  //         resolve(1);
  //       });
  //     });
  //     const coreResult = await corePromise;
  //   } else {
  //     let countPromise = new Promise((resolve, reject) => {
  //       this.sch.getPromotionByCount(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm)
  //       .subscribe(res => {
  //         this.resultlist = res;
  //         this.promotionByCountResults = res;
  //         resolve(1);
  //       });
  //     });
  //     const countResult = await countPromise;
  
  //     let corePromise = new Promise((resolve, reject) => {
  //       this.sch.getPromotionCoreSubject(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm)
  //       .subscribe(res => {
  //         this.resultlist = res;
  //         this.promotionByCoreSubjectsResults = res;
  //         resolve(1);
  //       });
  //     });
  //     const coreResult = await corePromise;
  //   }

    

  //   for (let i = 0; i < this.promotionByCoreSubjectsResults.length; i++) {
  //     this.promotionByCoreSubjectsResults[i].count =  this.promotionByCountResults[this.promotionByCountResults.findIndex(t => t.studentId == this.promotionByCoreSubjectsResults[i].studentId)].passCount;
  //   }
  //   this.passedResult = this.promotionByCoreSubjectsResults.filter(t => t.passCount >= this.coreSubjectCount || t.count >= this.promotionByCountTotalPass)
  //   let mypasslist = this.passedResult;
  //   let restu = this.promotionByCoreSubjectsResults;
  //   mypasslist.forEach(d => {
  //     if (restu.filter(f => f.studentId == d.studentId).length > 0) {
  //         restu = restu.filter(f => f.studentId !== d.studentId);
  //     }
  //   });
  //   this.failedResult = restu;

  //   this.passPercentage = (this.passedResult.length / this.promotionByCoreSubjectsResults.length) * 100;
  //   this.isChartReady = true;
  //   this.showChart();

  //   if (this.genk.isCategoryActive) {
  //     this.resultlist = this.passedResult;
  //   } else {
  //     this.resultlist = this.failedResult;
  //   }
  // }

  async getCountAndCoreAndAverage() {
    if (this.currentTerm == 'ANNUAL') {
      let countPromise = new Promise((resolve, reject) => {
        this.sch.getPromotionByCountAnnual(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString())
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByCountResults = res;
          resolve(1);
        });
      });
      const countResult = await countPromise;
  
      let averagePromise = new Promise((resolve, reject) => {
        this.sch.getPromotionPositionAnnualAverageStudents(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString())
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByAverageResults = res;
          resolve(1);
        });
      });
      const averageResult = await averagePromise;

      let corePromise = new Promise((resolve, reject) => {
        this.sch.getPromotionAnnualCoreSubject(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString())
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByCoreSubjectsResults = res;
          resolve(1);
        });
      });
      const coreResult = await corePromise;
    } else {
      let countPromise = new Promise((resolve, reject) => {
        this.sch.getPromotionByCount(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm)
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByCountResults = res;
          resolve(1);
        });
      });
      const countResult = await countPromise;
  
      let averagePromise = new Promise((resolve, reject) => {
        this.sch.getPromotionPositionAverageStudents(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm)
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByAverageResults = res;
          resolve(1);
        });
      });
      const averageResult = await averagePromise;

      let corePromise = new Promise((resolve, reject) => {
        this.sch.getPromotionCoreSubject(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm)
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByCoreSubjectsResults = res;
          resolve(1);
        });
      });
      const coreResult = await corePromise;
    }

    

    for (let i = 0; i < this.promotionByCoreSubjectsResults.length; i++) {
      this.promotionByCoreSubjectsResults[i].count =  this.promotionByCountResults[this.promotionByCountResults.findIndex(t => t.studentId == this.promotionByCoreSubjectsResults[i].studentId)].passCount;
    }
    this.passedResult = this.promotionByCoreSubjectsResults.filter(t => t.average >= this.failLimit && t.count >= this.promotionByCountTotalPass && t.passCount >= this.coreSubjectCount)
    let mypasslist = this.passedResult;
    let restu = this.promotionByCoreSubjectsResults;
    mypasslist.forEach(d => {
      if (restu.filter(f => f.studentId == d.studentId).length > 0) {
          restu = restu.filter(f => f.studentId !== d.studentId);
      }
    });
    this.failedResult = restu;

    this.passPercentage = (this.passedResult.length / this.promotionByCoreSubjectsResults.length) * 100;
    this.isChartReady = true;
    this.showChart();

    if (this.genk.isCategoryActive) {
      this.resultlist = this.passedResult;
    } else {
      this.resultlist = this.failedResult;
    }
  }


  async getCountOrCoreOrAverage() {
    if (this.currentTerm == 'ANNUAL') {
      let countPromise = new Promise((resolve, reject) => {
        this.sch.getPromotionByCountAnnual(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString())
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByCountResults = res;
          resolve(1);
        });
      });
      const countResult = await countPromise;
  
      let averagePromise = new Promise((resolve, reject) => {
        this.sch.getPromotionPositionAnnualAverageStudents(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString())
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByAverageResults = res;
          resolve(1);
        });
      });
      const averageResult = await averagePromise;

      let corePromise = new Promise((resolve, reject) => {
        this.sch.getPromotionAnnualCoreSubject(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString())
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByCoreSubjectsResults = res;
          resolve(1);
        });
      });
      const coreResult = await corePromise;
    } else {
      let countPromise = new Promise((resolve, reject) => {
        this.sch.getPromotionByCount(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm)
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByCountResults = res;
          resolve(1);
        });
      });
      const countResult = await countPromise;
  
      let averagePromise = new Promise((resolve, reject) => {
        this.sch.getPromotionPositionAverageStudents(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm)
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByAverageResults = res;
          resolve(1);
        });
      });
      const averageResult = await averagePromise;

      let corePromise = new Promise((resolve, reject) => {
        this.sch.getPromotionCoreSubject(this.genk.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm)
        .subscribe(res => {
          this.resultlist = res;
          this.promotionByCoreSubjectsResults = res;
          resolve(1);
        });
      });
      const coreResult = await corePromise;
    }

    

    for (let i = 0; i < this.promotionByCoreSubjectsResults.length; i++) {
      this.promotionByCoreSubjectsResults[i].count =  this.promotionByCountResults[this.promotionByCountResults.findIndex(t => t.studentId == this.promotionByCoreSubjectsResults[i].studentId)].passCount;
    }
    this.passedResult = this.promotionByCoreSubjectsResults.filter(t => t.average >= this.failLimit || t.count >= this.promotionByCountTotalPass || t.passCount >= this.coreSubjectCount)
    let mypasslist = this.passedResult;
    let restu = this.promotionByCoreSubjectsResults;
    mypasslist.forEach(d => {
      if (restu.filter(f => f.studentId == d.studentId).length > 0) {
          restu = restu.filter(f => f.studentId !== d.studentId);
      }
    });
    this.failedResult = restu;

    this.passPercentage = (this.passedResult.length / this.promotionByCoreSubjectsResults.length) * 100;
    this.isChartReady = true;
    this.showChart();

    if (this.genk.isCategoryActive) {
      this.resultlist = this.passedResult;
    } else {
      this.resultlist = this.failedResult;
    }
  }


}
