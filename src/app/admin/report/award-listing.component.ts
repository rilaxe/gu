import { Component, ElementRef, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService, UserData } from '../../services';
import { SchoolService } from '../../services/school.service';
import * as XLSX from 'xlsx/xlsx.mjs';

@Component({
  templateUrl: './award-listing.component.html',
  styleUrls: ['award.component.css']
})
export class AwardListingComponent implements OnInit {
  @ViewChild('myTable', { static: false }) myTable!: ElementRef;
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  countdata: any;
  genderStat: any;
  schoolClasses = [];
  schoolLevels = [];
  currentLevelId: string;
  currentClassLevel: string;
  sessionlist = [];
  currentSessionObj: any;
  currentSession: string;
  currentSessionId: string;
  currentTerm: string;
  resultlist = [];
  currentSubjectId: number;
  currentSubjectName: number;
  bestlist = [];
  bestClassList = [];
  awardType = "ACADEMIC PILLARS"
  classSubjects = [];
  topDataType = 1;


  constructor( 
    private router: Router,
    private auth: AuthenticationService,
    private sch: SchoolService,
    private gen: GenericService,
    private userdata: UserData
    ) {
      this.genk = gen;
      this.userName = auth.currentUserValue.name;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = auth.currentUserValue.status;
}

ngOnInit(): void {
  this.genk.topdata = 'Award Listings';
  this.getLevels();
  this.getSession();
  this.getCurrentSession();
  this.getClassNames();
}

getLevels() {
  this.sch.getClassLevels()
  .subscribe(res => {
    this.schoolLevels = res;
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

getClassSubjects() {
  this.sch.getSubjectByLevel(this.currentLevelId.toString())
  .subscribe(res => {
    console.log(res);
    this.classSubjects = res;
  });
}

getClassNames() {
  this.sch.getClassNames()
  .subscribe(res => {
    this.schoolClasses = res;
    
  });
}

  setClass(id: number) {
    this.currentLevelId = id.toString();
    this.currentClassLevel = this.schoolLevels.filter(t => t.id == id)[0].name;
    this.getClassSubjects();
  }

  getSubjectBest() {
    if (this.currentTerm == "ANNUAL") {
        this.sch.getSubjectBestAnnual(this.currentLevelId.toString(), this.currentSessionId, this.currentTerm)
        .subscribe(res => {
          this.bestlist = res;
          this.userdata.togLoadingOnly();
        });
    } else {
      this.sch.getSubjectBest(this.currentLevelId.toString(), this.currentSessionId, this.currentTerm)
        .subscribe(res => {
          this.bestlist = res;
          this.userdata.togLoadingOnly();
        });
    }
  }

  getClassBest() {
    if (this.currentTerm == "ANNUAL") {
        this.sch.getClassBestAnnual(this.currentLevelId.toString(), this.currentSessionId, this.currentTerm)
        .subscribe(res => {
          this.bestClassList = res;
          this.userdata.togLoadingOnly();
        });
    } else {
      this.sch.getClassBest(this.currentLevelId.toString(), this.currentSessionId, this.currentTerm)
        .subscribe(res => {
          this.bestClassList = res;
          this.userdata.togLoadingOnly();
        });
    }
  }

  getClasslevelBest() {
    if (this.currentTerm == "ANNUAL") {
        this.sch.getClasslevelBestAnnual(this.currentLevelId.toString(), this.currentSessionId)
        .subscribe(res => {
          this.bestClassList = res;
          this.userdata.togLoadingOnly();
        });
    } else {
      this.sch.getClasslevelBest(this.currentLevelId.toString(), this.currentSessionId, this.currentTerm)
        .subscribe(res => {
          this.bestClassList = res;
          this.userdata.togLoadingOnly();
        });
    }
  }

  setAward(award: string) {
    this.bestClassList = [];
    this.bestlist = [];
    this.awardType = award;
    //this.loadAwards();
  }

  loadAwards() {
    this.userdata.loadingOnly();
    if (this.awardType == 'ACADEMIC AWARDS') {
      this.getSubjectBest();
    } 
    else if (this.awardType == 'BEST IN CLASSLEVEL') {
      this.getClasslevelBest();
    } 
    else {
      this.getClassBest();
    }
    
  }

  getpositionByClass(ave: number, classId: number) {
    return this.bestClassList.filter(t => t.classId == classId).findIndex(t => t.totalScore == ave);
  }

  getpositionByClassLevel(ave: number) {
    return this.bestClassList.findIndex(t => t.totalScore == ave);
  }

  getpositionBySubject(ave: number, subjectId: number) {
    return this.bestlist.filter(t => t.subjectId == subjectId).findIndex(t => t.totalScore == ave);
  }

  // get groupedDataBySubject() {
  //   const grouped = {};
  //   this.bestlist.forEach(item => {
  //     if (!grouped[item.subject]) {
  //       grouped[item.subject] = [];
  //     }
  //     grouped[item.subject].push(item);
  //   });
  //   return grouped;
  // }

  // get groupedDataBySubject() {
  //   const grouped = {};
  //   this.bestlist.forEach(item => {
  //     if (!grouped[item.subject]) {
  //       grouped[item.subject] = [];
  //     }
  //     grouped[item.subject].push(item);
  //   });

  //   // Sort each subject's data by score in descending order and take top 2
  //   for (const subject in grouped) {
  //     grouped[subject] = grouped[subject]
  //       .sort((a, b) => b.totalScore - a.totalScore) // Sort by score (descending)
  //       .slice(0, this.topnum); // Take top 2
  //   }

  //   return grouped;
  // }

  get groupedDataBySubject() {
    const grouped = {};
    this.bestlist.forEach(item => {
      if (!grouped[item.subject]) {
        grouped[item.subject] = [];
      }
      grouped[item.subject].push(item);
    });

    // Sort each subject's data by score in descending order
    for (const subject in grouped) {
      grouped[subject] = grouped[subject].sort((a, b) => b.totalScore - a.totalScore);

      // Get the top 3 scores, including ties for the 3rd place
      const top3Scores = grouped[subject].slice(0, this.topnum).map(item => item.totalScore);
      const minTop3Score = top3Scores[top3Scores.length - 1]; // Get the 3rd highest score

      // Include all students with the same score as the 3rd highest score
      grouped[subject] = grouped[subject].filter(item => item.totalScore >= minTop3Score);
    }

    return grouped;
  }

  // Function to get unique subjects
  get subjects() {
    return Object.keys(this.groupedDataBySubject);
  }

  // get groupedDataByClass() {
  //   const grouped = {};
  //   this.bestClassList.forEach(item => {
  //     if (!grouped[item.classId]) {
  //       grouped[item.classId] = [];
  //     }
  //     grouped[item.classId].push(item);
  //   });
  //   return grouped;
  // }

  get groupedDataByClass() {
    const grouped = {};
    this.bestClassList.forEach(item => {
      if (!grouped[item.classId]) {
        grouped[item.classId] = [];
      }
      grouped[item.classId].push(item);
    });

    // Sort each subject's data by score in descending order
    for (const subject in grouped) {
      grouped[subject] = grouped[subject].sort((a, b) => b.totalScore - a.totalScore);

      // Get the top 3 scores, including ties for the 3rd place
      const top3Scores = grouped[subject].slice(0, this.topnum).map(item => item.totalScore);
      const minTop3Score = top3Scores[top3Scores.length - 1]; // Get the 3rd highest score

      // Include all students with the same score as the 3rd highest score
      grouped[subject] = grouped[subject].filter(item => item.totalScore >= minTop3Score);
    }

    return grouped;
  }

  // Function to get unique subjects
  get myclassData() {
    return Object.keys(this.groupedDataByClass);
  }

  getclass(id: number) {
    return this.schoolClasses.filter(c => c.id == id)[0].class
  }

  getsubject(id: number) {
    return this.classSubjects.filter(c => c.id == id)[0].class
  }

  // getTopScores(data: any) {
  //   debugger
  //   // Extract scores and remove duplicates
  //   let uniqueScores = [...new Set(data.map(item => item.totalScore))] as number[];
    
  //   // Sort scores in descending order
  //   const sortedScores = uniqueScores.sort((a, b) => b - a);
    
  //   // Take the top 3 scores
  //   const topScores = sortedScores.slice(0, 3);
    
  //   // Filter objects matching the top 3 scores
  //   const result = data.filter(item => topScores.includes(item.totalScore));
    
  //   return result;
  // };

  get topnum() {
    if (this.topDataType == 2) {
      return 5;
    } else {
      return 3;
    }
    
  }

  exportObj() {
    let table = this.myTable.nativeElement;
    //const table = document.getElementById('myTable');
    const worksheet = XLSX.utils.table_to_sheet(table);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Award_list");
    XLSX.writeFile(workbook, "Award_list.xlsx", { compression: true });
  }

}
