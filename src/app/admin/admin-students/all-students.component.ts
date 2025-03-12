import { Component, ElementRef, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService, UserData } from '../../services';
import { studentDetails } from '../../_models/school.model';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { SchoolService } from '../../services/school.service';
import * as XLSX from 'xlsx/xlsx.mjs';
import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'app-personalIn',
  templateUrl: './all-students.component.html',
  styleUrls: ['sample.css', 'all-students.component.css']
})
export class AllStudentsComponent implements OnInit {
  @Input() header: string;
  @ViewChild('bto') someInput!: ElementRef;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  tabActive = 'Person';
  student = new studentDetails();
  loading = false;
  imgFile: File = null;
  imgError: string;
  passportName: string;
  destroy = new Subject;
  schoolClasses = [];
  currentSessionName: string;
  regstep = 1;
  excelData = [];
  columnArray = [];
  isSumbitError = false;
  rejectedData = [];
  bulkClassId: number;
  bulkClassName: string;
  isupload = false;
  studentList = [];
  studentListBackup = [];
  classDropdownList = [];
  classLevelDropdownList = [];
  schoolLevels = [];
  term: string;
  isOpen = false;
  currentPage = 1;
  itemsPerPage = 50;
  totalPages: number;


  constructor(
    private router: Router,
    private sch: SchoolService,
    private auth: AuthenticationService,
    private userdata: UserData,
    private gen: GenericService,
    private excelService: ExcelService
    ) {
      this.genk = gen;
      this.userName = auth.currentUserValue.name;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = auth.currentUserValue.status;
}

ngOnInit(): void {
  this.genk.topdata = 'All Students';
  this.getAllStudents();
  this.getLevels();
  this.getClassNames();
  this.getCurrentSession();
}

public get pageIndex(): number {
  return (this.currentPage - 1) * this.itemsPerPage;
}



  // getUserList() {
  //   let params = this.commonService.addPaginationParams(this.offset / this.limit, this.limit);
  // }

 // const worksheetData = [
    //     //   {
    //     //     Admission_No: "",
    //     //     Surname: "",
    //     //     First_Name: "",
    //     //     Middle_Name: "",
    //     //     Class: "",
    //     //     Gender: "",
    //     //     Birth_Date: '',
    //     //     Guardian_Name: '',
    //     //     Guardian_Phone: '',
    //     //     Guardian_Address: ''
    //     // }
    //     // ];

    getLevels() {
      this.sch.getClassLevels()
      .subscribe(res => {
        this.schoolLevels = res;
      });
    }



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


setImg(imgpath) {
    if (imgpath && imgpath.length > 0) {
      return this.genk.imgurl + imgpath;
    } else {
      return this.genk.defaultImg;
    }
  }

  toggle(value: string) {
    this.tabActive = value;
  }


  logout() {
    this.auth.logout();
    this.router.navigate(['/', this.genk.account]);
  }

  showPreview(DeFile: any) {
    //debugger;
      this.imgFile = <File>DeFile.target.files[0];
      this.student.passport = this.imgFile;
      if (this.imgFile.size < 1 || this.imgFile.size > 1024 * 1024 * 10) {
          this.imgError = 'File size is too large. try 500kb or less';
          this.imgFile = null;
        return;
      }
      this.passportName = this.gen.getExpImg(this.imgFile.name, this.imgFile.type);
      this.student.passportUrl = this.passportName;
      //this.cd.markForCheck();
  }

  savePersonalInfo() {
        this.loading = true;
        this.student.schoolId = this.auth.currentUserValue.schoolId;
        this.student.passport = this.genk.studentImgFile;
        if (this.student.classId) {
          this.student.Class = this.schoolClasses.filter(t => t.id == this.student.classId)[0].class;
        }

        const formDat: FormData = new FormData();

        for (const key in this.student) {
            if (this.student[key]) {
                switch (key.toString()) {
                    case 'passport':
                        formDat.append("media", this.genk.studentImgFile, this.passportName);
                        break;
                    default:
                        formDat.append(key.toString(), this.student[key]);
                        break;
                }
            }
        }
        // this.auth.savePersonalInfo(this.student).subscribe();
        let timerInterval;
    Swal.fire({
      title: 'Processing Data...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      //timer: 2000,
      didOpen: () => {
        Swal.showLoading();
        this.auth.savePersonalInfo(formDat)
      .pipe(takeUntil(this.destroy))
      .subscribe(res => {
          Swal.close();
          this.loading = false;
      });

      }
    }).then(x => {
      this.getAllStudents();
      Swal.fire({
        icon: 'success',
        title: 'Student Information Saved!.',
        showConfirmButton: false,
        timer: 2000
      });
    })
    }

    getClassNames() {
      this.sch.getClassNames()
      .subscribe(res => {
        this.schoolClasses = res;
      });
    }

    getCurrentSession() {
      this.sch.getCurrentSession()
        .subscribe(res => {
          this.currentSessionName = res.sessionName;
        });
    }


    getAllStudents() {
      this.userdata.loadingOnly();
      this.sch.getActiveStudents(this.pageIndex.toString(), this.itemsPerPage.toString())
        .subscribe(res => {
          this.studentList = res.data;
          this.totalPages = res.pageCount;
          //this.studentList = res;
          this.studentListBackup = res;
          this.userdata.togLoadingOnly();
        })
    }



    columns = [
      {
        columnDef: 'admissionNo',
        header: 'Admission_No',
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
        columnDef: 'Class',
        header: 'Class',
      },
      {
        columnDef: 'classLevel',
        header: 'ClassLevel',
      },
      {
        columnDef: 'sex',
        header: 'Gender',
      },
      {
        columnDef: 'birthDate',
        header: 'Birth_Date',
      },
      {
        columnDef: 'guardianName',
        header: 'Guardian_Name',
      },
      {
        columnDef: 'guardianPhone',
        header: 'Guardian_Phone',
      },
      {
        columnDef: 'guardianAddress',
        header: 'Guardian_Address',
      }
    ];


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
            debugger;
            rowObject = rowObject.filter(t => t.Surname && t.Class);
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


      saveStudents(bto: HTMLButtonElement) {
        debugger;
        let arr = [];
        if (this.bulkClassId) {
          this.bulkClassName = this.schoolClasses.filter(t => t.id == this.bulkClassId)[0].class;
        }
        //const formDat: FormData = new FormData();

        this.excelData.forEach(student => {
          let studente = new studentDetails();
          for (const key in student) {
            var feye = this.columns.filter(t => t.header == key);
            var keye = feye[0].columnDef;
            studente[keye] = student[key];
        }
        arr.push(studente);
      })
      let me = arr;
      this.sch.registerStudentsBulk(arr)
      .subscribe(res => {
        if(res.length > 0) {
          this.rejectedData = res;
          this.someInput.nativeElement.click();
          this.isupload = false;
          this.transformStudent();
          bto.click();
          this.isSumbitError = true;
        }
        else {
          Swal.fire({
            icon: 'success',
            title: 'Students registered successfully!.',
            showConfirmButton: false,
            timer: 2000
          });
        }
        this.getAllStudents();
      })
      }


      exportObj() {
      //   const worksheet = XLSX.utils.json_to_sheet(this.rejectedData);
      //   const workbook = XLSX.utils.book_new();
      //   XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
      //   XLSX.writeFile(workbook, "Students Lists.xlsx", { compression: true });
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
          return excelDate;
        }
        
    }

    search(inp: HTMLInputElement) {
      this.term = inp.value.toString();
      if (this.term.length > 0) {
        this.isOpen = true;
          this.getActiveStudentKeyup();
      } else {
        this.isOpen = false;
        this.getAllStudents();
      }
    }

    getActiveStudentKeyup() {
      this.sch.getActiveStudentKeyup(this.term, this.pageIndex.toString(), this.itemsPerPage.toString())
        .subscribe(res => {
          debugger;
          this.studentList = res.data;
          this.totalPages = res.pageCount;
        });
    }



      // const schema = {
      //   'A': { prop: 'property_1', type: String },
      //   'B': { prop: 'propert_2', type: String },
      // };

      // debugger;
      //   //const file = event.target.files[0];
      //   const data = await readXlsxFile(file, { schema });
      //   let ae = 'b';


      //var file = e.target.files[0];
      // input canceled, return
      // if (!file) return;

      // var FR = new FileReader();
      // FR.onload = function(e) {
      //   debugger;
      //   var data = new Uint8Array(FR.result);
      //   var workbook = XLSX.read(data, {type: 'array'});
      //   var firstSheet = workbook.Sheets[workbook.SheetNames[0]];

      //   // header: 1 instructs xlsx to create an 'array of arrays'
      //   var result_obj = XLSX.utils.sheet_to_json(firstSheet);
      //   console.log(result_obj); // PRINTS TO CONSOLE
      //   //console.log(result_obj[0].Project) // PRINTS TO CONSOLE


      //   // data preview
      //   // var output = document.getElementById('result');
      //   // output.innerHTML = JSON.stringify(result, null, 2);
      //   return result_obj
      // };
      // //console.log(result_obj); // DOES NOT PRINT TO CONSOLE
      // FR.readAsArrayBuffer(file);

      transformStudent() {
        let arr = [];
        //const formDat: FormData = new FormData();

        this.rejectedData.forEach(student => {
          let studente = new studentDetails();
          for (const key in student) {
            var feye = this.columns.filter(t => t.columnDef == key);
            var keye = feye[0].header;
            studente[keye] = student[key];
        }
        arr.push(studente);
      })
      this.rejectedData = arr;
      }

    transformDate(obj: any) {
      debugger;
      let arr = [];
      //const formDat: FormData = new FormData();

      obj.forEach(student => {
        let studente = {};
        for (const key in student) {
          if (key == 'Birth_Date') {
            if (!isNaN(student[key])) {
              studente[key] = this.getJsDateFromExcel(student[key]);
            } else {
              //let datelist = student[key].toString().split('/');
              //studente[key] = datelist[2] + '-' + datelist[0] + '-' + datelist[1];
              studente[key] = student[key];
            }
          } else {
            studente[key] = student[key];

          }
          // var feye = this.columns.filter(t => t.columnDef == key);
          // var keye = feye[0].header;

        }
        arr.push(studente);
      })
      return arr;
    }

    // async downloadTemplate() {
    //   // const tem = [
    //   //   {
    //   //       "Admission No": "SN3440",
    //   //       "Surname": "Frank",
    //   //       "First Name": "Dallas",
    //   //       "Middle Name": "Jones",
    //   //       //"Class": "JS 1A",
    //   //       "Gender": "Male",
    //   //       "Birth Date": '2/23/2011',
    //   //       "Guardian Name": 'Olumo Mathew',
    //   //       "Guardian Phone": '09060456723',
    //   //       "Guardian Address": 'Blvd 5, sapele street, Abuja',

    //   //   },
    //   //   {
    //   //       "Admission No": "SN9050",
    //   //       "Surname": "Resce",
    //   //       "First Name": "Kellolas",
    //   //       "Middle Name": "Fred",
    //   //       //"Class": "SS 2B",
    //   //       "Gender": "Male",
    //   //       "Birth Date": '8/30/2013',
    //   //       "Guardian Name": 'Oluwasegun Mathew',
    //   //       "Guardian Phone": '09060809723',
    //   //       "Guardian Address": 'Blvd 2, sapele street, Abuja',
    //   //   }];

    //   //   const worksheet = XLSX.utils.json_to_sheet(tem);
    //   //   const workbook = XLSX.utils.book_new();
    //   //   XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    //   //   XLSX.writeFile(workbook, "Students Lists.xlsx", { compression: true });


    //     // const worksheetData = [
    //     //   {
    //     //     Admission_No: "",
    //     //     Surname: "",
    //     //     First_Name: "",
    //     //     Middle_Name: "",
    //     //     Class: "",
    //     //     Gender: "",
    //     //     Birth_Date: '',
    //     //     Guardian_Name: '',
    //     //     Guardian_Phone: '',
    //     //     Guardian_Address: ''
    //     // }
    //     // ];

    //     // // Create the worksheet
    //     // const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    //     // // Add dropdown options for the "class" column
    //     // worksheet['!dataValidations'] = [
    //     //   {
    //     //     type: 'list',
    //     //     allowBlank: true,
    //     //     showInputMessage: true,
    //     //     sqref: 'E2:E100', // Apply to cells in the "class" column (from row 2 onwards)
    //     //     formula1: '"ss1,ss2,ss3,ss4"' //this.schoolClasses.join(','), // Dropdown options for classes
    //     //   }
    //     // ];

    //     // // Create a workbook and add the worksheet
    //     // const workbook: XLSX.WorkBook = {
    //     //   Sheets: { 'Sheet1': worksheet },
    //     //   SheetNames: ['Sheet1']
    //     // };

    //     // // Export the workbook
    //     // const excelBuffer: any = XLSX.write(workbook, {
    //     //   bookType: 'xlsx',
    //     //   type: 'array'
    //     // });

    //     // // Save the Excel file
    //     // const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    //     // saveAs(blob, 'student_data.xlsx');

    //     const workbook = new ExcelJS.Workbook();
    // const worksheet = workbook.addWorksheet('Sheet1');

    // // Define columns and header row
    // worksheet.columns = [
    //   { header: 'Serial', key: 'serial', width: 10 },
    //   { header: 'Name', key: 'name', width: 30 },
    //   { header: 'Class', key: 'class', width: 15 },
    //   { header: 'City', key: 'city', width: 25 }
    // ];

    // // Set up the dropdown list for the "class" column
    // const classOptions = ['ss1', 'ss2', 'ss3', 'ss4'];
    // worksheet.getColumn('class').eachCell({ includeEmpty: true }, (cell, rowNumber) => {
    //   if (rowNumber > 1) { // Apply to all rows except header
    //     cell.dataValidation = {
    //       type: 'list',
    //       allowBlank: true,
    //       formulae: classOptions
    //     };
    //   }
    // });

    // // Add sample rows if needed (or keep it empty for users to fill in)
    // worksheet.addRow({ serial: '', name: '', class: '', city: '' });

    // // Export the workbook to a Blob
    // const buffer = await workbook.xlsx.writeBuffer();
    // const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    // saveAs(blob, 'student_data.xlsx');

    // }


    downloadTemplate(): void {
      this.classDropdownList = this.schoolClasses.map(item => ({ name: item.class }));
      this.classLevelDropdownList = this.schoolLevels.map(item => ({ name: item.name }));
      let data1 = [
        {
          name: "data1", //sheet1 with name data1
          values: [
            { header: "Admission_No", value: "" },
            { header: "Surname", value: "" },
            { header: "First_Name", value: "" },
            { header: "Middle_Name", value: "" },
            { header: "Class", value: this.classDropdownList },
            { header: "ClassLevel", value: this.classLevelDropdownList },
            { header: "Gender", value: [{ name: "Male" }, { name: "Female" }] },
            { header: "Birth_Date", value: "" }
          ]
        }
      ];

      let data2 = this.transform(data1);
      let workbookData = this.transform(data1)

      this.excelService.exportAsExcelFile(workbookData, "sample");
    }



    // async loadExcelForMigration(DeFile: any) {
    //   debugger;
    //   var file = <File>DeFile.target.files[0];

    //   if (file) {
    //     console.log("hi");
    //     var fileReader = new FileReader();
    //     fileReader.onload = (event: any) => {
    //       let mee = fileReader.result;
    //       var data = event.target.result;

    //       var workbook = XLSX.read(mee, {
    //         type: "binary"
    //       });
    //       workbook.SheetNames.forEach(sheet => {
    //         let rowObject = XLSX.utils.sheet_to_row_object_array(
    //           workbook.Sheets[sheet]
    //         );
    //         debugger;
    //         rowObject = rowObject.map(t => t.admission);
    //         console.log(rowObject);
    //         this.sch.matchStudentPlacement(rowObject).subscribe();
    //       });
    //     };


    //     fileReader.readAsBinaryString(file);
    //     let ree = fileReader;
    //   }
    // }


  // get totalPages() {
  //   return Math.ceil(this.studentListBackup.length / this.itemsPerPage);
  // }

  // Get students for the current page
  paginatedStudents() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.studentListBackup.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Navigate to a specific page
  goToPage(page: number) {
    debugger
    if (page >= 1 && page <= this.totalPages) {
      debugger
      this.currentPage = page;
      if (this.term?.length > 0) {
        this.getActiveStudentKeyup()
      } else {
        this.getAllStudents();
      }
      
    }
  }
}
