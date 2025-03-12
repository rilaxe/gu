import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { environment } from '../../environments/environment';
import { retry } from 'rxjs/operators';
import { SchoolService } from './school.service';
import { GenericService } from './generic.service';

@Injectable({ providedIn: 'root'})
export class PromotionService {
    private num = 2;
    private coreSubjects = [];
    private promotionSetting: any;
    failLimit = 0;
    isPromoAverage = false;
    isCoreSubject = false;
    isPromotionByCount = false;
    isBoth = '';
    isBothAnd = false;
    isBothOr = false;
    coreSubjectMustPassCount: number;
    promotionByCountTotalPass: number;
    averageCoreSubjectType: string;
    coreSubjectCount: number;
    isPass = true;
    currentTerm: string;
    myAverage: number;
    currentSessionId: string;
    promotionByCoreSubjectsResults = [];
    studentId: number;
    truePass = true;

    constructor(private http: HttpClient, 
        private sch: SchoolService, 
        private gen: GenericService) {
    }

    loadPromotion(classId: number, studentId: number) {
        this.studentId = studentId;
        this.getPromotionAverage();
        this.getCoreSubjects();
        this.getPromotionSetting();
    }


    getPromotionAverage() {
        this.sch.getPromotionAverage(this.gen.criCurrentClassId.toString())
        .subscribe(res => {
          this.failLimit = res.failLimit;
        });
    }

    getCoreSubjects() {
        this.sch.getCoreSubjectsByClass(this.gen.criCurrentClassId.toString())
        .subscribe(res => {
          this.coreSubjects = res;
          //this.coreSubjectCount = this.coreSubjects.length;
        });
    }

    getPromotionSetting() {
        this.sch.getPromotionSetting(this.gen.criCurrentClassId.toString())
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


      getPromotionPositionAverageStudents() {
        this.truePass = this.myAverage >= this.failLimit ? true : false;
      }



      findPosition() {
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
        // if (this.isPromotionByCount && this.isCoreSubject && !this.isPromoAverage) {
        //   if (this.averageCoreSubjectType == 'OR') this.getCountOrCore();
        //   if (this.averageCoreSubjectType == 'AND')this.getCountAndCore();
        // }
        // if (this.isPromotionByCount && !this.isCoreSubject && this.isPromoAverage) {
        //   if (this.averageCoreSubjectType == 'OR') this.getCountOrAverage();
        //   if (this.averageCoreSubjectType == 'AND')this.getCountAndAverage();w
        // }
    
        // if (this.isPromotionByCount && this.isCoreSubject && this.isPromoAverage) {
        //   if (this.averageCoreSubjectType == 'OR') this.getCountOrCoreOrAverage();
        //   if (this.averageCoreSubjectType == 'AND')this.getCountAndCoreAndAverage();
        // }
      }


      getPromotionCoreSubject() {
        if (this.currentTerm == 'ANNUAL') {
            this.sch.getStudentPromotionAnnualCoreSubject(this.gen.criCurrentClassId.toString(), this.currentSessionId.toString(), this.studentId.toString())
          .subscribe(res => {
            if (res.passCount >= this.coreSubjectCount) {
                this.truePass = true;
            }
          })
        } else {
          this.sch.getStudentPromotionCoreSubject(this.gen.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm, this.studentId.toString())
          .subscribe(res => {
            if (res.passCount >= this.coreSubjectCount) {
              this.truePass = true;
          }
          })
        }
      }


      getPromotionByCount() {
        if (this.currentTerm == 'ANNUAL') {
            this.sch.getStudentPromotionByCountAnnual(this.gen.criCurrentClassId.toString(), this.currentSessionId.toString(), this.studentId.toString())
          .subscribe(res => {
            if (res.passCount >= this.promotionByCountTotalPass) {
              this.truePass = true;
            }
            
          })
        } else {
          this.sch.getStudentPromotionByCount(this.gen.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm, this.studentId.toString())
          .subscribe(res => {
            if (res.passCount >= this.promotionByCountTotalPass) {
              this.truePass = true;
            }
          })
        }
      }


      getPromotionTotalORStudents() {
        if (this.currentTerm == 'ANNUAL') {
          this.sch.getStudentPromotionAnnualCoreSubject(this.gen.criCurrentClassId.toString(), this.currentSessionId.toString(), this.studentId.toString())
              .subscribe(res => {
                let avepass = this.myAverage >= this.failLimit ? true : false;
                let corepass = res.passCount >= this.coreSubjectCount ? true : false;
                this.truePass = avepass || corepass ? true : false;
              });
        } else {
          this.sch.getStudentPromotionCoreSubject(this.gen.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm, this.studentId.toString())
              .subscribe(res => {
                let avepass = this.myAverage >= this.failLimit ? true : false;
                let corepass = res.passCount >= this.coreSubjectCount ? true : false;
                this.truePass = avepass || corepass ? true : false;
              })
          }
      }

      getPromotionTotalAndStudents() {
        if (this.currentTerm == 'ANNUAL') {
          this.sch.getStudentPromotionAnnualCoreSubject(this.gen.criCurrentClassId.toString(), this.currentSessionId.toString(), this.studentId.toString())
              .subscribe(res => {
                let avepass = this.myAverage >= this.failLimit ? true : false;
                let corepass = res.passCount >= this.coreSubjectCount ? true : false;
                this.truePass = avepass && corepass ? true : false;
              });
        } else {
          this.sch.getStudentPromotionCoreSubject(this.gen.criCurrentClassId.toString(), this.currentSessionId.toString(), this.currentTerm, this.studentId.toString())
              .subscribe(res => {
                let avepass = this.myAverage >= this.failLimit ? true : false;
                let corepass = res.passCount >= this.coreSubjectCount ? true : false;
                this.truePass = avepass && corepass ? true : false;
              })
          }
      }



      

}