import { Component, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../services';
import { SchoolService } from '../services/school.service';
import Swal from 'sweetalert2';
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
  templateUrl: './chat.component.html',
  styleUrls: ['chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() header: string;
  @ViewChild("chart") chart: ChartComponent;
  public chartDoubleOptions: Partial<ChartDoubleOptions>;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  countdata: any;
  genderStat: any;
  isEnterModal = false;
  isViewModal = false;

  calendarEventList = [];
  calendarTimelineList = [];
  eventTitle: string;
  eventDesc: string;
  eventLocation: string;
  startDateTime: string;
  endDateTime: string;

  eventDisplayObj: any;
  sessionlist = [];
  currentSessionObj: any;
  currentSession: string;
  currentSessionId: string;
  currentTerm: string = 'UPCOMING';

  isCalendar = true;
  isTimeline = false;


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
  this.genk.topdata = 'Message';
  this.getPopulationData();
  this.genderStat();
}



get setImg() {
    if (this.userImgPath && this.userImgPath.length > 0) {
      return this.genk.imgurl + this.userImgPath;
    } else {
      return this.genk.defaultImg;
    }
  }



  closeModal() {
    this.isEnterModal = false;
    this.isViewModal = false;
  }





  getSession() {
    this.sch.getSession()
      .subscribe(res => {
        this.sessionlist = res;
      })
  }


  switchTimeline(value: string) {
    if (value == 'TIMELINE') {
      this.isCalendar = false;
      this.isTimeline = true;
    } else {
      this.isCalendar = true;
      this.isTimeline = false;
    }
  }


 

  cutText(text: string) {
    if (text.length > 200) {
      return text.substring(0, 200) + '...';
    }
    return text;
  }

  getPopulationData() {
    this.sch.getPopulationData()
      .subscribe(res => {
        this.countdata = res[0];
        this.getGenderStat();
      })
  }

  getGenderStat() {
    this.sch.getGenderStat()
      .subscribe(res => {
        this.genderStat = res;
        let keydata = Object.keys(res);
        let boylist = [];
        let girllist = [];
        for(var item in res) {
          girllist.push(res[item][0]);
          boylist.push(res[item][1]);
        }
        //let valuedata = Object.values(res);
        this.chartDoubleOptions = {
          series: [
            {
              name: "Female Student",
              data: girllist
            },
            {
              name: "Male Student",
              data: boylist
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
            categories: keydata
          },
          yaxis: {
            title: {
              text: "Students"
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function(val) {
                return val + " students";
              }
            }
          }
        };
      })
  }

  showChart() {
    this.chartDoubleOptions = {
      series: [
        {
          name: "Net Profit",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        },
        {
          name: "Revenue",
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
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
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct"
        ]
      },
      yaxis: {
        title: {
          text: "$ (thousands)"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return "$ " + val + " thousands";
          }
        }
      }
    };
  }



}
