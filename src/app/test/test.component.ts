import { Component, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService, TestService } from '../services';
import { SchoolService } from '../services/school.service';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import * as XLSX from 'xlsx/xlsx.mjs';
import jsPDF from 'jspdf';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';




@Component({
  templateUrl: './test.component.html',
  styleUrls: ['test.component.css']
})
export class TestComponent implements OnInit {
  @Input() header: string;
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
  myobjlist = [];
  myfilelist = [];
  destroy = new Subject;
  description: string;
  title: string;
  ourNotices = [];
  boardFiles = [];
  editTitle: string;
  editDescription: string;
  editId: string;


  //pdfSrc: string = 'https://nou.edu.ng/coursewarecontent/PHS821School%20Health.pdf'; // Replace with your PDF URL
  currentPage: number = 1;
  totalPages: number = 0;
  pdf: any;
  pdfSrc: SafeResourceUrl | null = null;




  constructor( 
    private router: Router,
    private auth: AuthenticationService,
    private sch: SchoolService,
    private testServe: TestService,
    private gen: GenericService,
    private sanitizer: DomSanitizer
    ) {
      this.genk = gen;
      this.userName = auth.currentUserValue.name;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = auth.currentUserValue.status;
}

ngOnInit(): void {
  this.genk.topdata = 'Medical Reports';
  //this.loadPdf(this.pdfSrc, this.currentPage);
  //this.getdata();
}


  getdata() {
    this.testServe.getResultEntryAnalysis()
      .subscribe(res => {
        this.sessionlist = res;
        
            const worksheet = XLSX.utils.json_to_sheet(this.sessionlist);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
            XLSX.writeFile(workbook, "Students Lists.xlsx", { compression: true });
        
      })
  }

  sumWeekly() {
    Swal.fire({
      title: 'Processing Data...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
        Swal.showLoading();
        this.testServe.SumWeeklyTest('248', 'SECOND')
      .pipe(takeUntil(this.destroy))
      .subscribe(res => {
          Swal.close();
      });}
    }).then(x => {
      //this.getStudentsPsycomotor();
      Swal.fire({
        icon: 'success',
        title: 'Weekly Summing updated successfully!.',
        showConfirmButton: false,
        timer: 2000
      });
    })
  }





 

  // goToPreviousPage(): void {
  //   if (this.currentPage > 1) {
  //     this.currentPage--;
  //     this.loadPdf(this.pdfSrc, this.currentPage);
  //   }
  // }

  // goToNextPage(): void {
  //   if (this.currentPage < this.totalPages) {
  //     this.currentPage++;
  //     this.loadPdf(this.pdfSrc, this.currentPage);
  //   }
  // }

  generateAndDisplayPDF(): void {
    this.generatePDF();
  }

  generatePDF(): void {
    debugger
    const doc = new jsPDF();
    doc.text("Hello, this is a PDF!", 20, 20);

    // Generate a Data URI for embedding
    let pdfDataUri = doc.output('datauristring');
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(pdfDataUri);

    //return this.pdfSrc;
  }


  name = 'Angular ';
  pdfSource = "data:application/pdf;filename=generated.pdf;base64,JVBERi0xLjMKJbrfrOAKMyAwIG9iago8PC9UeXBlIC9QYWdlCi9QYXJlbnQgMSAwIFIKL1Jlc291cmNlcyAyIDAgUgovTWVkaWFCb3ggWzAgMCA1OTUuMjc5OTk5OTk5OTk5OTcyNyA4NDEuODg5OTk5OTk5OTk5OTg2NF0KL0NvbnRlbnRzIDQgMCBSCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9MZW5ndGggMTM4Cj4+CnN0cmVhbQowLjU2NzAwMDAwMDAwMDAwMDEgdwowIEcKQlQKL0YxIDE2IFRmCjE4LjM5OTk5OTk5OTk5OTk5ODYgVEwKMCBnCjU2LjY5MjkxMzM4NTgyNjc3NzUgNzg1LjE5NzA4NjYxNDE3MzI1ODYgVGQKKEhlbGxvLCB0aGlzIGlzIGEgUERGISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoxIDAgb2JqCjw8L1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUiBdCi9Db3VudCAxCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9CYXNlRm9udCAvSGVsdmV0aWNhCi9TdWJ0eXBlIC9UeXBlMQovRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZwovRmlyc3RDaGFyIDMyCi9MYXN0Q2hhciAyNTUKPj4KZW5kb2JqCjYgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL0Jhc2VGb250IC9IZWx2ZXRpY2EtQm9sZAovU3VidHlwZSAvVHlwZTEKL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcKL0ZpcnN0Q2hhciAzMgovTGFzdENoYXIgMjU1Cj4+CmVuZG9iago3IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9CYXNlRm9udCAvSGVsdmV0aWNhLU9ibGlxdWUKL1N1YnR5cGUgL1R5cGUxCi9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nCi9GaXJzdENoYXIgMzIKL0xhc3RDaGFyIDI1NQo+PgplbmRvYmoKOCAwIG9iago8PAovVHlwZSAvRm9udAovQmFzZUZvbnQgL0hlbHZldGljYS1Cb2xkT2JsaXF1ZQovU3VidHlwZSAvVHlwZTEKL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcKL0ZpcnN0Q2hhciAzMgovTGFzdENoYXIgMjU1Cj4+CmVuZG9iago5IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9CYXNlRm9udCAvQ291cmllcgovU3VidHlwZSAvVHlwZTEKL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcKL0ZpcnN0Q2hhciAzMgovTGFzdENoYXIgMjU1Cj4+CmVuZG9iagoxMCAwIG9iago8PAovVHlwZSAvRm9udAovQmFzZUZvbnQgL0NvdXJpZXItQm9sZAovU3VidHlwZSAvVHlwZTEKL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcKL0ZpcnN0Q2hhciAzMgovTGFzdENoYXIgMjU1Cj4+CmVuZG9iagoxMSAwIG9iago8PAovVHlwZSAvRm9udAovQmFzZUZvbnQgL0NvdXJpZXItT2JsaXF1ZQovU3VidHlwZSAvVHlwZTEKL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcKL0ZpcnN0Q2hhciAzMgovTGFzdENoYXIgMjU1Cj4+CmVuZG9iagoxMiAwIG9iago8PAovVHlwZSAvRm9udAovQmFzZUZvbnQgL0NvdXJpZXItQm9sZE9ibGlxdWUKL1N1YnR5cGUgL1R5cGUxCi9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nCi9GaXJzdENoYXIgMzIKL0xhc3RDaGFyIDI1NQo+PgplbmRvYmoKMTMgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL0Jhc2VGb250IC9UaW1lcy1Sb21hbgovU3VidHlwZSAvVHlwZTEKL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcKL0ZpcnN0Q2hhciAzMgovTGFzdENoYXIgMjU1Cj4+CmVuZG9iagoxNCAwIG9iago8PAovVHlwZSAvRm9udAovQmFzZUZvbnQgL1RpbWVzLUJvbGQKL1N1YnR5cGUgL1R5cGUxCi9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nCi9GaXJzdENoYXIgMzIKL0xhc3RDaGFyIDI1NQo+PgplbmRvYmoKMTUgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL0Jhc2VGb250IC9UaW1lcy1JdGFsaWMKL1N1YnR5cGUgL1R5cGUxCi9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nCi9GaXJzdENoYXIgMzIKL0xhc3RDaGFyIDI1NQo+PgplbmRvYmoKMTYgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL0Jhc2VGb250IC9UaW1lcy1Cb2xkSXRhbGljCi9TdWJ0eXBlIC9UeXBlMQovRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZwovRmlyc3RDaGFyIDMyCi9MYXN0Q2hhciAyNTUKPj4KZW5kb2JqCjE3IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9CYXNlRm9udCAvWmFwZkRpbmdiYXRzCi9TdWJ0eXBlIC9UeXBlMQovRmlyc3RDaGFyIDMyCi9MYXN0Q2hhciAyNTUKPj4KZW5kb2JqCjE4IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9CYXNlRm9udCAvU3ltYm9sCi9TdWJ0eXBlIC9UeXBlMQovRmlyc3RDaGFyIDMyCi9MYXN0Q2hhciAyNTUKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1Byb2NTZXQgWy9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUldCi9Gb250IDw8Ci9GMSA1IDAgUgovRjIgNiAwIFIKL0YzIDcgMCBSCi9GNCA4IDAgUgovRjUgOSAwIFIKL0Y2IDEwIDAgUgovRjcgMTEgMCBSCi9GOCAxMiAwIFIKL0Y5IDEzIDAgUgovRjEwIDE0IDAgUgovRjExIDE1IDAgUgovRjEyIDE2IDAgUgovRjEzIDE3IDAgUgovRjE0IDE4IDAgUgo+PgovWE9iamVjdCA8PAo+Pgo+PgplbmRvYmoKMTkgMCBvYmoKPDwKL1Byb2R1Y2VyIChqc1BERiAyLjUuMSkKL0NyZWF0aW9uRGF0ZSAoRDoyMDI1MDMwNTEzMjQ1NiswMScwMCcpCj4+CmVuZG9iagoyMCAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMSAwIFIKL09wZW5BY3Rpb24gWzMgMCBSIC9GaXRIIG51bGxdCi9QYWdlTGF5b3V0IC9PbmVDb2x1bW4KPj4KZW5kb2JqCnhyZWYKMCAyMQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAzNDEgMDAwMDAgbiAKMDAwMDAwMjE1OCAwMDAwMCBuIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAxNTIgMDAwMDAgbiAKMDAwMDAwMDM5OCAwMDAwMCBuIAowMDAwMDAwNTIzIDAwMDAwIG4gCjAwMDAwMDA2NTMgMDAwMDAgbiAKMDAwMDAwMDc4NiAwMDAwMCBuIAowMDAwMDAwOTIzIDAwMDAwIG4gCjAwMDAwMDEwNDYgMDAwMDAgbiAKMDAwMDAwMTE3NSAwMDAwMCBuIAowMDAwMDAxMzA3IDAwMDAwIG4gCjAwMDAwMDE0NDMgMDAwMDAgbiAKMDAwMDAwMTU3MSAwMDAwMCBuIAowMDAwMDAxNjk4IDAwMDAwIG4gCjAwMDAwMDE4MjcgMDAwMDAgbiAKMDAwMDAwMTk2MCAwMDAwMCBuIAowMDAwMDAyMDYyIDAwMDAwIG4gCjAwMDAwMDI0MDYgMDAwMDAgbiAKMDAwMDAwMjQ5MiAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDIxCi9Sb290IDIwIDAgUgovSW5mbyAxOSAwIFIKL0lEIFsgPDRDOTBEQjlFNTg4RkVERUEwMjZGODkxOTI0MzRFMjJBPiA8NEM5MERCOUU1ODhGRURFQTAyNkY4OTE5MjQzNEUyMkE+IF0KPj4Kc3RhcnR4cmVmCjI1OTYKJSVFT0Y=";

  pdfLoad = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
  page = 1;
  //totalPages = 0;
  zoom = 1;

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  onLoadComplete(pdf: any) {
    this.totalPages = pdf.numPages;
  }

  zoomIn() {
    this.zoom += 0.2;
  }

  zoomOut() {
    if (this.zoom > 0.4) {
      this.zoom -= 0.2;
    }
  }
}
