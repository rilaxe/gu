import { Component, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexPlotOptions, ApexStroke, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts';
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
  templateUrl: './block-result.component.html',
  styleUrls: []
})
export class BlockResultComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  countdata: any;
  genderStat: any;  
  schoolClasses = [];
  currentClassId: string;
  currentClassName: string;
  sessionlist = [];
  currentSessionObj: any;
  currentSession: string;
  currentSessionId: string;
  currentTerm: string;
  students = [];
  reason: string;
  isOther = false;
  selectedStudent: any;


  constructor( 
    private router: Router,
    private auth: AuthenticationService,
    private sch: SchoolService,
    private gen: GenericService
    ) {
      this.genk = gen;
      this.userName = auth.currentUserValue.name;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = auth.currentUserValue.status;

      
}

ngOnInit(): void {
  this.genk.topdata = 'Block Result';
  this.getClassNames();
  this.getSession();
  this.getCurrentSession();
}

get setImg() {
    if (this.userImgPath && this.userImgPath.length > 0) {
      return this.genk.imgurl + this.userImgPath;
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

  getStudents() {
    this.sch.getStudentByClass(this.currentClassId)
      .subscribe(res => {
        this.students = res;
      })
  }

  blockStudent(studentId: number) {
    this.sch.blockStudentResult(studentId.toString(), this.reason)
      .subscribe(res => {
        this.students = res;
        this.getStudents();
        this.isOther = false;
        Swal.fire({
            icon: 'success',
            title: 'Student result blocked successfully!.',
            showConfirmButton: false,
            timer: 2000
        });
      })
  }

  unblockStudent(studentId: number) {
    this.sch.unblockStudentResult(studentId.toString())
      .subscribe(res => {
        this.students = res;
        this.getStudents();
        Swal.fire({
            icon: 'success',
            title: 'Student result unblocked successfully!.',
            showConfirmButton: false,
            timer: 2000
          });
      })
  }

  changeReason(value: string) {
    if (value == 'Others') {
      this.isOther = true;
    } else {
      this.reason = value;
    }
  }

  

}
