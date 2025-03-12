import { ChangeDetectorRef, Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../services';
import { SchoolService } from '../services/school.service';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexPlotOptions, ApexStroke, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts';
import { studentDetails } from '../_models/school.model';
import Swal from 'sweetalert2';


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
  templateUrl: './result-analysis.component.html'
})
export class ResultAnalysisComponent implements OnInit {
  @Input() header: string;
  public chartDoubleOptions: Partial<ChartDoubleOptions>;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  student: any;
  calendarEventList = [];
  isViewModal = false;
  eventDisplayObj: any;
  academicTerm: string;
  subjectlist = [];
  scorelist = [];
  highlist = [];
  myave: number;
  highestave: number;
  lowestave: number;
  isResultPublished = false;
  reasonForNoResult: string;
  isResult = false;
  sessionlist = [];
  currentSessionObj: any;
  currentSession: string;
  currentSessionId: string;
  currentTerm: string;
  academicSessionId: string;
  studentId: string;
  genderStat: any;
  schoolClasses = [];
  studentobj: any;

  constructor( 
    private router: Router,
    private auth: AuthenticationService,
    private sch: SchoolService,
    private activeRoute: ActivatedRoute,
    private gen: GenericService
    ) {
      this.genk = gen;
      this.userName = auth.currentUserValue.name;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = auth.currentUserValue.status;
}

ngOnInit(): void {
    this.genk.topdata = 'Result Analysis';
    this.studentId = this.auth.currentUserValue.id.toString();
    this.getStudent();
    this.getClassNames();
    this.getSession();
    this.getCurrentSession();
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
          this.academicTerm = this.currentTerm;
          this.academicTerm = this.currentSessionObj.currentTerm;
          this.startChart();
        }

      })
  }

  getClassNames() {
    this.sch.getClassNames()
      .subscribe(res => {
        this.schoolClasses = res;
      });
  }

  getStudent() {
    this.sch.getStudentById(this.studentId.toString())
      .subscribe(res => {
        this.studentobj = res;
        this.student = res;
      })
  }




changeTerm(value: string) {
    this.academicTerm = value;
    this.subjectlist = [];
    this.scorelist = [];
    this.highlist = [];
    this.chartDoubleOptions = null;
    this.startChart();
  }


  getGenderStat() {
    this.sch.checkResultPublication(this.student.classId, this.currentSessionId.toString(), this.academicTerm)
      .subscribe(res => {
        this.isResultPublished = res.val;
        if (res.val) {
            this.reasonForNoResult = '';
          this.sch.getStudentById(this.studentId).subscribe(restu => {
            let details = restu as studentDetails;
            if (!details.isResultBlocked) {
              this.isResult = true;
              this.getAverageData();
              this.sch.getAcademicRecordData(this.student.classId, this.academicSessionId, this.academicTerm, this.student.id.toString())
                .subscribe((res: any[]) => {
                    Swal.close();
                  this.genderStat = res;
                  let keydata = Object.keys(res);

                  for (var item of res) {
                    this.subjectlist.push(item.subject);
                    this.scorelist.push(item.score);
                    this.highlist.push(item.highestScore);
                  }
                  //let valuedata = Object.values(res);
                  this.chartDoubleOptions = {
                    series: [
                      {
                        name: "Student Score",
                        data: this.scorelist.length > 0 ? this.scorelist : []
                      },
                      {
                        name: "Highest Score",
                        data: this.highlist.length > 0 ? this.highlist : []
                      }
                    ],
                    chart: {
                      type: "bar",
                      height: 350
                    },
                    plotOptions: {
                      bar: {
                        horizontal: false,
                        columnWidth: "55%"
                      }
                    },
                    dataLabels: {
                      enabled: false
                    },
                    stroke: {
                      show: true,
                      width: 2,
                      colors: ["transparent"]
                    },
                    xaxis: {
                      categories: this.subjectlist.length > 0 ? this.subjectlist : []
                    },
                    yaxis: {
                      title: {
                        text: "Student score"
                      }
                    },
                    fill: {
                      opacity: 1
                    },
                    tooltip: {
                      y: {
                        formatter: function (val) {
                          return val + " points";
                        }
                      }
                    }
                  };
                })
            } else {
              this.isResult = false;
              this.reasonForNoResult = 'You are unable to view your result at the moment. Please clarify with the school admin!';
            }
          });

        } else {
          this.isResult = false;
          this.reasonForNoResult = 'This result has not been published!';
          Swal.close();
        }
        //this.currentSession = this.sessionlist.filter(t => t.id == this.currentSessionId)[0].sessionName;
      })

  }

  getAverageData() {
    this.sch.getAcademicAverage(this.student.classId, this.academicSessionId, this.academicTerm, this.student.id.toString())
      .subscribe(res => {
        this.myave = res.myaverage ? res.myaverage : 0;
        this.highestave = res.highest ? res.highest : 0;
        this.lowestave = res.lowest ? res.lowest : 0;
      })
  }

  changeSession(value: string) {
    this.academicSessionId = value;
    this.subjectlist = [];
    this.scorelist = [];
    this.highlist = [];
    this.chartDoubleOptions = null;
    this.startChart();
  }


  numget(value: number) {
    return Number(value.toFixed(2));
  }


  startChart() {
    Swal.fire({
        title: 'Loading Performance data....',
        allowEscapeKey: false,
        allowOutsideClick: false,
        //timer: 2000,
        didOpen: async () => {
          Swal.showLoading();
         this.getGenderStat();
        }
      });
  }


}
