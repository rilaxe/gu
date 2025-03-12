import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { Staff } from '../../_models/school.model';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import * as XLSX from 'xlsx/xlsx.mjs';
import { SchoolService } from '../../services/school.service';
import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'app-admin-register',
  templateUrl: './all-staff.component.html',
  styleUrls: ['../admin-students/sample.css']
})
export class AllStaffComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  tabActive = 'Person';
  staff = new Staff();
  step1 = true;
  step2 = false;
  loading = false;
  imgFile: File = null;
  imgError: string;
  passportName: string;
  destroy = new Subject;
  regstep = 1;
  staffList = [];
  academicStaffList = [];
  nonAcademicStaffList = [];
  excelData = [];
  columnArray = [];

  constructor( 
    private router: Router,
    private sch: SchoolService,
    private auth: AuthenticationService,
    private gen: GenericService,
    private excelService: ExcelService
    ) {
      this.genk = gen;
      this.userName = auth.currentUserValue.name;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = auth.currentUserValue.status;
}

ngOnInit(): void {
  this.genk.topdata = "All Staff";
  this.getAllStaff();
}

  toggle(value: string) {
    this.tabActive = value;
  }

  setImg(imgpath) {
    if (imgpath && imgpath.length > 0) {
      return this.genk.imgurl + imgpath;
    } else {
      return this.genk.defaultImg;
    }
  }

  moveToTwo() {
    this.step1 = false;
    this.step2 = true;
  }

  moveToOne() {
    this.step1 = true;
    this.step2 = false;
  }

  saveStaff(f: HTMLFormElement) {
    this.loading = true;
    this.staff.schoolId = this.auth.currentUserValue.schoolId;
    this.staff.passport = this.genk.staffImgFile;
    const formDat: FormData = new FormData();
    for (const key in this.staff) {
        if (this.staff[key]) {
            switch (key.toString()) {
                case 'passport':
                    formDat.append("media", this.genk.staffImgFile, this.passportName);
                    break;
                default:
                    formDat.append(key.toString(), this.staff[key]);
                    break;
            }
        }
    }
    
Swal.fire({
  title: 'Processing Data...',
  allowEscapeKey: false,
  allowOutsideClick: false,
  //timer: 2000,
  didOpen: () => {
    Swal.showLoading();
    this.auth.saveStaff(formDat)
  .pipe(takeUntil(this.destroy))
  .subscribe(res => {
      Swal.close();
      this.loading = false;
  });
    
  }
}).then(x => {
  f.reset();
  this.staff = new Staff();
  this.genk.imag = '';
  Swal.fire({
    icon: 'success',
    title: 'Staff registered successfully!.',
    showConfirmButton: false,
    timer: 2000
  });
})
}

columns = [
  {
    columnDef: 'idCardNo',
    header: 'IdCard_No',
  },
  {
    columnDef: 'surname',
    header: 'Surname',
  },

  {
    columnDef: 'firstName',
    header: 'First_Name',
  },
  {
    columnDef: 'middleName',
    header: 'Middle_Name',
  },
  {
    columnDef: 'phone',
    header: 'Phone_Number',
  },
  {
    columnDef: 'email',
    header: 'Email',
  },
  {
    columnDef: 'gender',
    header: 'Gender',
  },
  {
    columnDef: 'birthDate',
    header: 'Date_Of_Birth',
  },
  {
    columnDef: 'homeAddress',
    header: 'Home_Address',
  },
  {
    columnDef: 'department',
    header: 'Department',
  },
  {
    columnDef: 'position',
    header: 'Position',
  }
];


// columnsOld = [
//   {
//     columnDef: 'idCardNo',
//     header: 'Staff Id-Card-No',
//   },
//   {
//     columnDef: 'surname',
//     header: 'Surname',
//   },

//   {
//     columnDef: 'firstName',
//     header: 'First Name',
//   },
//   {
//     columnDef: 'middleName',
//     header: 'Middle Name',
//   },
//   {
//     columnDef: 'phone',
//     header: 'Phone Number',
//   },
//   {
//     columnDef: 'email',
//     header: 'Email',
//   },
//   {
//     columnDef: 'gender',
//     header: 'Gender',
//   },
//   {
//     columnDef: 'birthDate',
//     header: 'Date Of Birth',
//   },
//   {
//     columnDef: 'homeAddress',
//     header: 'Address',
//   },
//   {
//     columnDef: 'department',
//     header: 'Department',
//   },
//   {
//     columnDef: 'position',
//     header: 'Position',
//   }
// ];


async loadExcel(DeFile: any) {
  debugger;
  var file = <File>DeFile.target.files[0];

  if (file) {
    console.log("hi");
    var fileReader = new FileReader();
    fileReader.onload = (event: any) => {
      let mee = fileReader.result;
      var data = event.target.result;

      var workbook = XLSX.read(mee, {
        type: "binary"
      });
      workbook.SheetNames.forEach(sheet => {
        let rowObject = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheet]
        );
        rowObject = rowObject.filter(t => t.Phone_Number);
        //debugger;
        console.log(rowObject);
        this.columnArray =  Object.keys(rowObject[0]);
        //var daye = this.getJsDateFromExcel(42216).toJSON();
        this.excelData = this.transformDate(rowObject);
        //let jsonObject = JSON.stringify(rowObject);
        //document.getElementById("jsonData").innerHTML = jsonObject;
        console.log(this.excelData);
      });
    };


    fileReader.readAsBinaryString(file);
    let ree = fileReader;
  }
}

// downloadTemplate() {
//   const tem = [
//     {
//         "Staff Id-Card-No": "SN3440",
//         "Surname": "Frank",
//         "First Name": "Dallas",
//         "Middle Name": "Jones",
//         "Gender": "Male",
//         "Date Of Birth": '2/23/2011',
//         "Staff Category": 'Olumo Mathew',
//         "Department": '09060456723',
//         "Position": 'Blvd 5, sapele street, Abuja',
//         "Email": 'sio@gmail.com',
//         "Phone Number": '0989023493',
//         "Address": 'Sarun way doha.'
        
//     },
//     {
//         "Staff Id-Card-No": "SN9050",
//         "Surname": "Resce",
//         "First Name": "Kellolas",
//         "Middle Name": "Fred",
//         "Gender": "Male",
//         "Date Of Birth": '8/30/2013',
//         "Staff Category": 'Oluwasegun Mathew',
//         "Department": '09060809723',
//         "Position": 'Blvd 2, sapele street, Abuja',
//         "Email": 'sio@gmail.com',
//         "Phone Number": '0989023493',
//         "Address": 'Sarun way doha.'
//     }];

//     const worksheet = XLSX.utils.json_to_sheet(tem);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Staff");
//     XLSX.writeFile(workbook, "Staffs Lists.xlsx", { compression: true });

// }

transform (data) {
  const noOfRowaToGenerate = 1000;
  return data.map(({name, values}) => {
    const headers = values.reduce((prev, next) => 
      ({...prev, [next.header]: Array.isArray
      (next.value) ? next.value.map(({name}) => name): next.value}), {})
    return {
      workSheet: name,
      rows: Array(noOfRowaToGenerate).fill(headers)
    }
  })
}

downloadTemplate(): void {
  // this.classDropdownList = this.schoolClasses.map(item => ({ name: item.class }));
  // this.classLevelDropdownList = this.schoolLevels.map(item => ({ name: item.name }));
  let data1 = [
    {
      name: "data1", //sheet1 with name data1
      values: [
        { header: "Surname", value: "" },
        { header: "First_Name", value: "" },
        { header: "Middle_Name", value: "" },
        { header: "Phone_Number", value: ""},
        { header: "Email", value: "" },
        { header: "IdCard_No", value: "" },
        { header: "Gender", value: [{ name: "Male" }, { name: "Female" }] },
        { header: "Date_Of_Birth", value: "" },
        { header: "Home_Address", value: "" },
        { header: "Department", value: "" },
        { header: "Position", value: "" },
      ]
    }
  ];

  let data2 = this.transform(data1);
  let workbookData = this.transform(data1)

  this.excelService.exportAsExcelFile(workbookData, "sample");
}

getAllStaff() {
  this.sch.getAllStaff()
    .subscribe(res => {
      this.staffList = res;
      this.academicStaffList = this.staffList.filter(t => t.category == 'Academic Staff');
      this.nonAcademicStaffList = this.staffList.filter(t => t.category == 'Non Academic Staff');
    })
}

transformDate(obj: any) {
  let arr = [];

  obj.forEach(student => {
    let studente = {};
    for (const key in student) {
      if (key == 'Date_Of_Birth') {
        if (!isNaN(student[key])) {
          studente[key] = this.getJsDateFromExcel(student[key]);
        } else {
          studente[key] = null;
        }
      } else {
        studente[key] = student[key];

      }

    }
    arr.push(studente);
  })
  return arr;
}

getJsDateFromExcel(excelDate){
  if (excelDate) {
    const SECONDS_IN_DAY = 24 * 60 * 60;
    const MISSING_LEAP_YEAR_DAY = SECONDS_IN_DAY * 1000;
    const MAGIC_NUMBER_OF_DAYS = (25567 + 2);

    const delta = excelDate - MAGIC_NUMBER_OF_DAYS;
    const parsed = delta * MISSING_LEAP_YEAR_DAY;
    const date = new Date(parsed);

    return date.toJSON().split('T')[0];
  } else {
    return null;
  }
  
}

saveStaffBulk(bto: HTMLButtonElement) {
  debugger;
  let arr = [];
  // if (this.bulkClassId) {
  //   this.bulkClassName = this.schoolClasses.filter(t => t.id == this.bulkClassId)[0].class;
  // }
  //const formDat: FormData = new FormData();

  this.excelData.forEach(student => {
    let studente = new Staff();
    for (const key in student) {
      var feye = this.columns.filter(t => t.header == key);
      var keye = feye[0].columnDef;
      studente[keye] = student[key];
  }
  arr.push(studente);
})
let me = arr;
this.sch.registerStaffBulk(arr)
.subscribe(res => {
  // if(res.length > 0) {
  //   this.rejectedData = res;
  //   this.someInput.nativeElement.click();
  //   this.isupload = false;
  //   this.transformStudent();
  //   bto.click();
  //   this.isSumbitError = true;
  // }
  // else {
    Swal.fire({
      icon: 'success',
      title: 'Students registered successfully!.',
      showConfirmButton: false,
      timer: 2000
    });
  //}
  this.getAllStaff();
})
}


}
