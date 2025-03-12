import { Component, Inject, Input, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
//import * as XLSX from 'xlsx-js-style';
//import readXlsxFile from 'read-excel-file';
import * as XLSX from 'xlsx/xlsx.mjs';
import { studentDetails } from '../../_models/school.model';
import { SchoolService } from '../../services/school.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-register',
  templateUrl: './import-students.component.html',
  styleUrls: ['./admin-students.component.css', '../../table.css', '../../school/school.component.css']
  
})
export class ImportStudentsComponent {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  excelData = [];
  columnArray = [];
  isSumbitError = false;
  rejectedData = [];


  step1 = true;
  step2 = false;

  constructor( 
    private router: Router,
    private auth: AuthenticationService,
    private gen: GenericService,
    private sch: SchoolService
    ) {
      this.genk = gen;
      this.userName = auth.currentUserValue.name;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = auth.currentUserValue.status;
}

get setImg() {
    if (this.userImgPath && this.userImgPath.length > 0) {
      return this.genk.imgurl + this.userImgPath;
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

  columns = [
    {
      columnDef: 'admissionNo',
      header: 'Admission No',
    },
    {
      columnDef: 'surname',
      header: 'Surname',
    },

    {
      columnDef: 'firstName',
      header: 'First Name',
    },
    {
      columnDef: 'middleName',
      header: 'Middle Name',
    },
    {
      columnDef: 'Class',
      header: 'Class',
    },
    {
      columnDef: 'sex',
      header: 'Gender',
    },
    {
      columnDef: 'birthDate',
      header: 'Birth Date',
    },
    {
      columnDef: 'typeofStudent',
      header: 'Student Type',
    },
    {
      columnDef: 'house',
      header: 'House',
    },
    {
      columnDef: 'studentId',
      header: 'Student ID',
    },
    {
      columnDef: 'guardianName',
      header: 'Guardian Name',
    },
    {
      columnDef: 'guardianPhone',
      header: 'Guardian Phone',
    },
    {
      columnDef: 'genuardianAddress',
      header: 'Guardian Address',
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
          console.log(rowObject);
          this.columnArray =  Object.keys(rowObject[0]);
          debugger;
          //var daye = this.getJsDateFromExcel(42216).toJSON();
          this.excelData = this.transformDate(rowObject);
          //let jsonObject = JSON.stringify(rowObject);
          //document.getElementById("jsonData").innerHTML = jsonObject;
          //console.log(jsonObject);
        });
      };
    
      
      fileReader.readAsBinaryString(file);
      let ree = fileReader;
    }
  }


    saveStudents() {
    //   let arr = [];
    //   //const formDat: FormData = new FormData();
      
    //   this.excelData.forEach(student => {
    //     let studente = new studentDetails();
    //     for (const key in student) {
    //       var feye = this.columns.filter(t => t.header == key);
    //       var keye = feye[0].columnDef;
    //       studente[keye] = student[key];
    //   }
    //   arr.push(studente);
    // })
    // let me = arr;
    // this.sch.registerStudentsBulk(arr, '', '')
    // .subscribe(res => {
    //   if(res.length > 0) {
    //     this.rejectedData = res;
    //     //debugger;
    //     this.transformStudent();
    //     this.isSumbitError = true;
    //   }
    //   else {
    //     Swal.fire({
    //       icon: 'success',
    //       title: 'Students registered successfully!.',
    //       showConfirmButton: false,
    //       timer: 2000
    //     });
    //   }
    // })
    }


    exportObj() {
      const worksheet = XLSX.utils.json_to_sheet(this.rejectedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
      XLSX.writeFile(workbook, "Students Lists.xlsx", { compression: true });
    }


    getJsDateFromExcel(excelDate){
      const SECONDS_IN_DAY = 24 * 60 * 60;
      const MISSING_LEAP_YEAR_DAY = SECONDS_IN_DAY * 1000;
      const MAGIC_NUMBER_OF_DAYS = (25567 + 2);    
      if (!Number(excelDate)) {
          alert('wrong input format')
      }

      const delta = excelDate - MAGIC_NUMBER_OF_DAYS;
      const parsed = delta * MISSING_LEAP_YEAR_DAY;
      const date = new Date(parsed)

      return date.toJSON().split('T')[0];
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
    let arr = [];
    //const formDat: FormData = new FormData();

    obj.forEach(student => {
      let studente = {};
      for (const key in student) {
        if (key == 'Birth_Date') {
          studente[key] = this.getJsDateFromExcel(student[key]);
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

  downloadTemplate() {
    const tem = [
      {
          "Admission No": "SN3440",
          "Surname": "Frank",
          "First Name": "Dallas",
          "Middle Name": "Jones",
          "Class": "JS 1A",
          "Gender": "Male",
          "Birth Date": '2/23/2011',
          "Guardian Name": 'Olumo Mathew',
          "Guardian Phone": '09060456723',
          "Guardian Address": 'Blvd 5, sapele street, Abuja',
          
      },
      {
          "Admission No": "SN9050",
          "Surname": "Resce",
          "First Name": "Kellolas",
          "Middle Name": "Fred",
          "Class": "SS 2B",
          "Gender": "Male",
          "Birth Date": '8/30/2013',
          "Guardian Name": 'Oluwasegun Mathew',
          "Guardian Phone": '09060809723',
          "Guardian Address": 'Blvd 2, sapele street, Abuja',
      }];

      const worksheet = XLSX.utils.json_to_sheet(tem);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
      XLSX.writeFile(workbook, "Students Lists.xlsx", { compression: true });
  
  }
  
}
