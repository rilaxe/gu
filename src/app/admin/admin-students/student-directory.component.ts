import { Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx/xlsx.mjs';

@Component({
  templateUrl: './student-directory.component.html',
  styleUrls: []
})
export class StudentDirectory implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  countdata: any;
  genderStat: any;
  arrayRows = [];
  studentList = [];
  dynamicColumn = [];


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
  this.genk.topdata = 'Student Directory';
  this.getAllStudents();
  //this.genderStat();
}

get setImg() {
    if (this.userImgPath && this.userImgPath.length > 0) {
      return this.genk.imgurl + this.userImgPath;
    } else {
      return this.genk.defaultImg;
    }
  }

  getAllStudents() {
    this.sch.getAllStudents()
      .subscribe(res => {
        this.studentList = res;

        this.arrayRows = this.arrangeDate(res as any[]);;
      })
  }

  columns = [
    {
      columnDef: 'surname',
      header: 'Surname',
    },
    {
      columnDef: 'firstName',
      header: 'Firstname',
    },
    {
      columnDef: 'middleName',
      header: 'Middlename',
    },
    {
      columnDef: 'class',
      header: 'Class',
    },
    {
      columnDef: 'status',
      header: 'Status',
    },
    {
      columnDef: 'admissionNo',
      header: 'Admission Number',
    },
    {
      columnDef: 'stateofOrigin',
      header: 'State of Origin',
    },
    {
      columnDef: 'lga',
      header: 'LGA',
    },
    {
      columnDef: 'sex',
      header: 'Sex',
    },
    {
      columnDef: 'birthDate',
      header: 'Birthdate',
    },
    {
      columnDef: 'nationality',
      header: 'Nationality',
    },
    {
      columnDef: 'parentAddress',
      header: 'Home Address',
    },
    {
      columnDef: 'dateAdmitted',
      header: 'Date Admitted',
    },
    {
      columnDef: 'graduatedYear',
      header: 'Graduated Year',
    },
    {
      columnDef: 'fatherName',
      header: 'Fathers Name',
    },
    {
      columnDef: 'fatherPhone',
      header: 'Fathers Phone Number',
    },
    {
      columnDef: 'fatherOccp',
      header: 'Fathers Occupation',
    },
    {
      columnDef: 'motherName',
      header: 'Mothers Name',
    },
    {
      columnDef: 'motherPhone',
      header: 'Mothers Phone Number',
    },
    {
      columnDef: 'motherOccp',
      header: 'Mothers Occupation',
    },
    {
      columnDef: 'guardianName',
      header: 'Guardians Name',
    },
    {
      columnDef: 'guardianPhone',
      header: 'Guardians Phone Number',
    },
    {
      columnDef: 'guardianAddress',
      header: 'Guardian Address',
    }
  ];

  setDir(columnDef: string, boolValue: boolean) {
    debugger;
    if (boolValue) {
      this.dynamicColumn.push({columnDef: columnDef, header: this.columns[this.columns.findIndex(t => t.columnDef == columnDef)].header});
    } else {
      this.dynamicColumn = this.dynamicColumn.filter(t => t.columnDef != columnDef);
    }
    
  }

  filtercolumn(columnDef: string, text: string) {
    debugger;
    if (text) {
      this.arrayRows = this.studentList.filter(t => t[columnDef].toLowerCase().includes(text.toLowerCase()));
    } else {
      this.arrayRows = this.studentList;
    }
    
  }

  arrangeDate(mydata: any[]) {
    let i = 0;
    while (i < mydata.length) {
      let datePipe = new DatePipe('en-US');
      mydata[i].birthDate =
        datePipe.transform(
          mydata[i].birthDate,
          'dd MMM, y'
        );
      i++;
    }
    return mydata;
  }

  exportObj(table: any) {
    //const table = document.getElementById('myTable');
    const worksheet = XLSX.utils.table_to_sheet(table);;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "Students Lists.xlsx", { compression: true });
  }
}
