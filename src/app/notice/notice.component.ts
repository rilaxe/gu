import { Component, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../services';
import { SchoolService } from '../services/school.service';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';




@Component({
  templateUrl: './notice.component.html',
  styleUrls: ['notice.component.css']
})
export class NoticeComponent implements OnInit {
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
  this.genk.topdata = 'NoticeBoard';
  this.getCurrentSession();
  this.getNoticeboard();
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
  

  fileChange(myFile: any) {
    debugger
    //let defile: File;
    let myfiles = myFile.target.files;

    for (let i = 0; i < myfiles.length; i++) {
      let defile = myfiles[i] as File;
      let namedoc = this.genk.trimDocName(defile.name);

      if (defile.size < 1 || defile.size > 1024 * 1024 * 200) {
        defile = null;
        return;
      }

      const reader = new FileReader();
      reader.onload = (event: any) => {
        let imgurl = event.target.result;

        let myobj = {src: event.target.result, name: defile.name.substring(0, 14), ext: this.genk.getExt(defile.name).toLowerCase(), size: defile.size};
        this.myfilelist.push(defile);
        this.myobjlist.push(myobj);
      };
      reader.readAsDataURL(defile);
    }
    console.log(this.myobjlist);
  }

  extType(value: string) {
    if (value == 'png' || value == 'jpg' || value == 'jpeg' || value == 'gif' || value == 'webp') {
      return "IMAGE";
    } else {
      return "DOC";
    }
  }

  extDotType(value: string) {
    //debugger;
    if (value == '.png' || value == '.jpg' || value == '.jpeg' || value == '.gif' || value == '.webp') {
      return "IMAGE";
    } else {
      return "DOC";
    }
  }

  getNoticeboard() {
    this.sch.getNoticeboard()
      .subscribe(res => {
        debugger
        this.ourNotices = res;
        
      })
  }

  submit() {
    debugger;
    let formdat = new FormData();
    formdat.append("description", this.description);
    formdat.append("titleText", this.title);

    for (let i = 0; i < this.myfilelist.length; i++) {
      const element = this.myfilelist[i];
      let filename = this.genk.createFilename(this.myfilelist[i].name, '.' + this.genk.getExt(this.myfilelist[i].name).toLowerCase());
      formdat.append(this.genk.trimDocName(this.myfilelist[i].name), this.myfilelist[i], filename);
    }
    let foo = formdat;
    Swal.fire({
      title: 'Processing Data...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
        Swal.showLoading();
        debugger
        this.sch.createBoardNotice(formdat, this.currentSessionId.toString(), this.currentTerm)
          .pipe(takeUntil(this.destroy))
          .subscribe(res => {
            Swal.close();
            Swal.fire({
              icon: 'success',
              title: 'Notice Created successfully!.',
              showConfirmButton: false,
              timer: 2000
            });
          });
      }
    })
  }

  downloadFile(url, name, ext: string) {
    Swal.fire({
      title: 'Downloading file...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 1000,
      didOpen: () => {
        Swal.showLoading();
        this.sch.obtain(url).subscribe(event => {
          let newext = ext.replace('.', '');
          this.genk.getDownload(event, name, event.type, newext);
        });
      }})
    // const anchor = document.createElement('a');
    // anchor.href = url;
    // anchor.download = url.substring(url.lastIndexOf('/') + 1);
    // document.body.appendChild(anchor);
    // anchor.click();
    // document.body.removeChild(anchor);

    
  }

  setEdit(title: string, description: string, id: number) {
    this.editTitle = title;
    this.editDescription = description;
    this.editId = id.toString();
  }

  editNotice() {
    this.sch.editNotice(this.editTitle, this.editDescription, this.editId)
    .pipe(takeUntil(this.destroy))
    .subscribe(res => {
      this.getNoticeboard();
      Swal.fire({
        icon: 'success',
        title: 'Notice Deleted Successfully!',
        showConfirmButton: false,
        timer: 2000
      });
    });
  }

  deleteNotice(id: number) {
    Swal.fire({
      title: "Do you really want to delete this Post?",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.sch.deleteNotice(id.toString())
        .subscribe(res => {
          this.getNoticeboard();
          Swal.fire("Data deleted", "", "success");
        });
      }
    });
  }

  // async downloadFile(imageUrl, imageName) {
  //   try {
  //     debugger
  //     const response = await fetch(imageUrl);
  //     if (!response.ok) throw new Error("Network response was not ok");

  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);

  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = imageName || "download.jpg"; // Default name if not provided
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);

  //     window.URL.revokeObjectURL(url); // Clean up
  //   } catch (error) {
  //     console.error("There was a problem with the fetch operation:", error);
  //   }
  // }

}
