import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-dashboard',
  templateUrl: './class-placement.component.html',
  styleUrls: []
})
export class ClassPlacementComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  currentClass: string;
  destinationCurrentClass: string;
  studentList = [];
  schoolClasses = [];
  destinationClasses = [];
  placementType = 'MANUAL';
  currentSessionObj: any;
  currentSession: string;
  bigboss = [];
  smallboss = [];
  destroy = new Subject;


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
  this.genk.topdata = 'Class Placement';
  this.getClassNames();
  this.getCurrentSession();
}

getStudents() {
    this.sch.getStudentsByLevel(this.currentClass)
      .subscribe(res => {
        this.studentList = res;
        this.getClassByLevel();
        if (Number(this.destinationCurrentClass) == 0) {
          this.callGraduatePlacement();
        } else {
          setTimeout(() => {
            this.callPlacement();
          }, 1000);
        }
        
      })
}

getStudentsAlternate() {
  this.sch.getStudentsByLevel(this.currentClass)
    .subscribe(res => {
      this.studentList = null;
      this.studentList = res;
      this.getClassByLevel();
    });
}

callPlacement() {
  if (this.placementType == 'NORMAL') {
    this.normalize();
  } else if (this.placementType == 'RANDOM') {
    this.randomize();
  } else {
    console.log('Manual');
  }
}

callGraduatePlacement() {
  if (this.placementType == 'NORMAL') {
    this.normalizeGraduate();
  } else if (this.placementType == 'RANDOM') {
    this.normalizeGraduate();
  } else {
    console.log('Manual');
  }
}

getClassNames() {
    this.sch.getClassLevels()
    .subscribe(res => {
      this.schoolClasses = res;
    });
  }

  getClassByLevel() {
    if (Number(this.destinationCurrentClass) == 0) {
    } else {
        this.sch.getClassByLevel(this.destinationCurrentClass.toString())
        .subscribe(res => {
            this.destinationClasses = res;
        });
    }
    
  }

  getCurrentSession() {
    this.sch.getCurrentSession()
      .subscribe(res => {
        this.currentSessionObj = res;
        this.currentSession = this.currentSessionObj.sessionName;
      })
  }

  setPlacement(classId: string, studentId: number, index: number) {
    this.bigboss.push({studentId: studentId, classId: classId});
  }

  findPlacement() {
    if (Number(this.destinationCurrentClass) == 0) {
      this.saveGraduatePlacement();
    } else {
      this.savePlacement();
    }
  }

  findFinalize() {
    if (Number(this.destinationCurrentClass) == 0) {
      this.finalizeGraduate();
    } else {
      this.finalize();
    }
  }



  savePlacement() {
    let rea = this.bigboss;
Swal.fire({
  title: 'Processing Data...',
  allowEscapeKey: false,
  allowOutsideClick: false,
  //timer: 2000,
  didOpen: () => {
    Swal.showLoading();
    this.sch.saveClassPlacement(this.bigboss)
  .pipe(takeUntil(this.destroy))
  .subscribe(res => {
      Swal.close();
  });
    
  }
}).then(x => {
    this.getStudents();
  Swal.fire({
    icon: 'success',
    title: 'Student(s) Class updated successfully!.',
    showConfirmButton: false,
    timer: 2000
  });
})
}


randomize() {
  let rea = this.bigboss;
  this.sch.randomizePlacement(this.currentClass, this.destinationCurrentClass)
  .pipe(takeUntil(this.destroy))
  .subscribe(res => {
      this.getStudentsAlternate();
      Swal.fire({
        icon: 'success',
        title: 'Student(s) Class randomized successfully!.',
        showConfirmButton: false,
        timer: 2000
      });
  });
}

normalize() {
  let rea = this.bigboss;
  this.sch.normalizePlacement(this.currentClass, this.destinationCurrentClass)
  .pipe(takeUntil(this.destroy))
  .subscribe(res => {
    this.getStudentsAlternate();
    Swal.fire({
      icon: 'success',
      title: 'Student(s) Class normalized successfully!.',
      showConfirmButton: false,
      timer: 2000
    });
  });
}


// randomize() {
//   let rea = this.bigboss;
// Swal.fire({
// title: 'Processing Data...',
// allowEscapeKey: false,
// allowOutsideClick: false,
// //timer: 2000,
// didOpen: () => {
//   Swal.showLoading();
//   this.sch.randomizePlacement(this.currentClass, this.destinationCurrentClass)
// .pipe(takeUntil(this.destroy))
// .subscribe(res => {
//     Swal.close();
// });
  
// }
// }).then(x => {
//   this.getStudents();
// Swal.fire({
//   icon: 'success',
//   title: 'Student(s) Class updated successfully!.',
//   showConfirmButton: false,
//   timer: 2000
// });
// })
// }

// normalize() {
//   let rea = this.bigboss;
// Swal.fire({
// title: 'Processing Data...',
// allowEscapeKey: false,
// allowOutsideClick: false,
// //timer: 2000,
// didOpen: () => {
//   Swal.showLoading();
//   this.sch.normalizePlacement(this.currentClass, this.destinationCurrentClass)
// .pipe(takeUntil(this.destroy))
// .subscribe(res => {
//     Swal.close();
// });
  
// }
// }).then(x => {
//   this.getStudents();
// Swal.fire({
//   icon: 'success',
//   title: 'Student(s) Class updated successfully!.',
//   showConfirmButton: false,
//   timer: 2000
// });
// })
// }

finalize() {
  Swal.fire({
    title: "Do you want to permanently change these students classes? You will not be able to undo this action.",
    showCancelButton: true,
    confirmButtonText: "Yes, Finalize"
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      this.sch.finalizePlacement(this.currentClass.toString())
        .subscribe(res => {
          this.getStudents();
          Swal.fire("Class Placement Finalized", "", "success");
      });
    }
  });
  
}


saveGraduatePlacement() {
  let rea = this.bigboss;
Swal.fire({
title: 'Processing Data...',
allowEscapeKey: false,
allowOutsideClick: false,
//timer: 2000,
didOpen: () => {
  Swal.showLoading();
  this.sch.saveGraduateClassPlacement(this.bigboss)
.pipe(takeUntil(this.destroy))
.subscribe(res => {
    Swal.close();
});
  
}
}).then(x => {
  this.getStudents();
Swal.fire({
  icon: 'success',
  title: 'Student(s) Class updated successfully!.',
  showConfirmButton: false,
  timer: 2000
});
})
}

finalizeGraduate() {
  Swal.fire({
    title: "Do you want to permanently change these students classes? You will not be able to undo this action.",
    showCancelButton: true,
    confirmButtonText: "Yes, Finalize"
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      this.sch.finalizeGraduatePlacement(this.currentClass.toString())
        .subscribe(res => {
          this.getStudents();
          Swal.fire("Class Placement Finalized", "", "success");
      });
    }
  });
  
}

normalizeGraduate() {
  let rea = this.bigboss;
  this.sch.normalizeGraduatePlacement(this.currentClass, this.destinationCurrentClass)
  .pipe(takeUntil(this.destroy))
  .subscribe(res => {
      this.getStudentsAlternate();
      Swal.fire({
        icon: 'success',
        title: 'Student(s) Class randomized successfully!.',
        showConfirmButton: false,
        timer: 2000
      });
  });
}

}
