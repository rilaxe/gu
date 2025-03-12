import { Component, Inject, Input, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import * as XLSX from 'xlsx/xlsx.mjs';

@Component({
  selector: 'app-admin-register',
  templateUrl: './import-staff.component.html',
  styleUrls: ['../../admin/admin-students/admin-students.component.css', '../../table.css']
})
export class ImportStaffComponent {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  excelData = [];
  columnArray = [];


  step1 = true;
  step2 = false;

  constructor( 
    private router: Router,
    private auth: AuthenticationService,
    private gen: GenericService
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

  
  async loadExcel(DeFile: any) {
    var file = <File>DeFile.target.files[0];

    if (file) {
      console.log("hi");
      var fileReader = new FileReader();
      fileReader.onload = (event: any) => {
        debugger;
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
          this.columnArray =  Object.keys(rowObject[0]);
          this.excelData = rowObject;
         
        });
      };
    
      
      fileReader.readAsBinaryString(file);
      let ree = fileReader;
    }

  }
}
