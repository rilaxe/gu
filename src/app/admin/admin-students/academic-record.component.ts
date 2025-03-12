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
    selector: 'app-academic-record',
  templateUrl: './academic-record.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcademicRecordComponent implements OnInit {
  @Input() header: string;
  @ViewChild("chart") chart: ChartComponent;
  public chartDoubleOptions: Partial<ChartDoubleOptions>;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
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
  @Input() studentId: string = '';
  isViewAR = false;

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
}

ngOnInit(): void {
  this.getClassNames();
  
}

// getPopulationData() {
//   this.sch.getPopulationData()
//     .subscribe(res => {
//       this.countdata = res[0];
//     })
// }

getStudent() {
  this.sch.getStudentById(this.studentId.toString())
    .subscribe(res => {
      this.student = res;
      this.getAverageData();
    })
}

getSession() {
  this.sch.getSession()
    .subscribe(res => {
      this.sessionlist = res;

      this.getCurrentSession();
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
      this.getStudent();
      
    })
}


getClassNames() {
  this.sch.getClassNames()
  .subscribe(res => {
    this.schoolClasses = res;
    this.getSession();
  });
}


  changeSession(value: string) {
    debugger;
    this.academicSessionId = value;
    this.subjectlist = [];
    this.scorelist = [];
    this.highlist = [];
    this.chartDoubleOptions = null;
    this.getAcademicRecordData();
  }

  changeTerm(value: string) {
    this.academicTerm = value;
    this.subjectlist = [];
    this.scorelist = [];
    this.highlist = [];
    this.chartDoubleOptions = null;
    this.getAcademicRecordData();
  }

  getAverageData() {
    this.sch.getAcademicAverage(this.student.classId, this.academicSessionId, this.academicTerm, this.student.id.toString())
    .subscribe(res => {
      this.myave = res.myaverage ? res.myaverage : 0;
      this.highestave = res.highest ? res.highest: 0;
      this.lowestave = res.lowest ? res.lowest : 0;
      this.isViewAR = true;
      this.cd.markForCheck();
    })
  }

  getAcademicRecordData() {
    this.getAverageData();
    this.sch.getAcademicRecordData(this.student.classId, this.academicSessionId, this.academicTerm, this.student.id.toString())
      .subscribe((res: any[]) => {
        this.genderStat = res;
        let keydata = Object.keys(res);
        
        for(var item of res) {
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
            },
            labels: {
              formatter: function (val) {
                return val.toFixed(1);  // Reduce to 1 decimal place
              }
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function(val) {
                return val + " points";
              }
            }
          }
        };
      })
  }
}
