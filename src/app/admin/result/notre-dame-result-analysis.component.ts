import { Component } from '@angular/core';
//import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Chart } from 'chart.js/auto';
import jspdf, { jsPDF } from 'jspdf';

@Component({
  selector: 'app-notre-dame-result-analysis',
  templateUrl: './notre-dame-result-analysis.component.html',
  styleUrls: []
})
export class NotreDameResultAnalysis {
  chartOptions: any;

  constructor() {
    // Configure ApexCharts options
    // this.chartOptions = {
    //   series: [{
    //     name: 'Sales',
    //     data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
    //   }],
    //   chart: {
    //     type: 'line',
    //     height: 350
    //   },
    //   xaxis: {
    //     categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
    //   },
    //   title: {
    //     text: 'Sales Overview'
    //   }
    // };


    this.chartOptions = {
        series: [
        {
          name: "High - 2013",
          data: [28, 29, 33, 36, 32, 32, 33]
        },
        {
          name: "Low - 2013",
          data: [12, 11, 14, 18, 17, 13, 13]
        }
      ],
        chart: {
        height: 350,
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      colors: ['#77B6EA', '#545454'],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'Average High & Low Temperature',
        align: 'left'
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      markers: {
        size: 1
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        title: {
          text: 'Month'
        }
      },
      yaxis: {
        title: {
          text: 'Temperature'
        },
        min: 5,
        max: 40
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
      };
  }

  generatePdf() {
    const chartElement = document.getElementById('chart');
    
    if (chartElement) {
      // Convert chart to canvas using html2canvas
      html2canvas(chartElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        
        // Create a new jsPDF instance
        const pdf = new jsPDF();
        
        // Add the chart image to the PDF
        pdf.addImage(imgData, 'PNG', 10, 10, 180, 160);
        
        // Save the PDF
        pdf.save('chart.pdf');
      });
    }
  }

  createPDF() {
    let canvas = document.createElement('canvas');
    canvas.width = 521;
    canvas.height = 828;
    let ctx = canvas.getContext('2d');

    this.chartOptions = {
      series: [
      {
        name: "High - 2013",
        data: [28, 29, 33, 36, 32, 32, 33]
      },
      {
        name: "Low - 2013",
        data: [12, 11, 14, 18, 17, 13, 13]
      }
    ],
      chart: {
      height: 350,
      type: 'line',
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    colors: ['#77B6EA', '#545454'],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'Average High & Low Temperature',
      align: 'left'
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    markers: {
      size: 1
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      title: {
        text: 'Month'
      }
    },
    yaxis: {
      title: {
        text: 'Temperature'
      },
      min: 5,
      max: 40
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -25,
      offsetX: -5
    }
    };
    



    



        // // Convert chart to image and add to PDF
        // document.getElementById('download').addEventListener('click', function () {
        //     const chartImage = document.getElementById('myChart').toDataURL('image/png', 1.0);

        //     const { jsPDF } = window.jspdf;
        //     const pdf = new jsPDF();

        //     pdf.addImage(chartImage, 'PNG', 15, 40, 180, 160);
        //     pdf.save('chart.pdf');
        // });
  }


  renderPieChart(): void {
    let canvas = document.createElement('canvas');
    canvas.width = 521;
    canvas.height = 828;
    let ctx = canvas.getContext('2d');
    //const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: 'Dataset 1',
          data: [300, 50, 100, 40, 120, 30],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        }
      }
    });

    const chartImage = canvas.toDataURL('image/png', 1.0);
    var doc = new jsPDF('p', 'pt', 'letter');
    //const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    pdf.addImage(chartImage, 'PNG', 15, 40, 180, 160);
    pdf.save('chart.pdf');
  }

  renderPdfChart() {
    // Create the chart in memory (without displaying it in the browser)
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    // Create chart
    const myPieChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'My First dataset',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            pointBackgroundColor: 'rgba(255,99,132,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255,99,132,0.8)',
            data: [65, 59, 80, 81, 56, 55, 40]
          },
          {
            label: 'My Second dataset',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,200,132,1)',
            pointBackgroundColor: 'rgba(255,99,132,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255,99,132,0.8)',
            data: [35, 54, 40, 51, 56, 55, 80]
          },
          {
            label: 'My Third dataset',
            backgroundColor: 'rgba(45,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            pointBackgroundColor: 'rgba(255,99,132,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255,99,132,0.8)',
            data: [35, 29, 40, 41, 26, 25, 20]
          },
          {
            label: 'My Fourth dataset',
            backgroundColor: 'rgba(25,199,132,0.2)',
            borderColor: 'rgba(255,200,132,1)',
            pointBackgroundColor: 'rgba(255,99,132,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255,99,132,0.8)',
            data: [52, 45, 4, 15, 65, 55, 8]
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            ticks: {
              maxRotation: 45,  // Rotate labels to 90 degrees (vertical)
              minRotation: 45,
            }
          },
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            position: 'top',
          },
        },
        animation: {
          onComplete: function() {
              // Code to run after animation completes
              console.log("Animation completed");
              const chartImage = canvas.toDataURL('image/png');
              console.log(chartImage);
        const pdf = new jsPDF();

        // Add image to PDF
        pdf.addImage(chartImage, 'PNG', 10, 10, 150, 75, undefined, 'SLOW');

        // Save the PDF to file
        pdf.save('chart.pdf');
          },
          // You can also add other properties such as duration, easing, etc.
          duration: 1000,
      }
      }
    });
  }
}
