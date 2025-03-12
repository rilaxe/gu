import { Injectable} from '@angular/core';
import { HttpEventType, HttpParams} from '@angular/common/http';
import { Subject} from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
//import { getDocument } from 'pdfjs-dist';

// import * as pdfjsLib from 'pdfjs-dist';
// import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
// GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.js`;

//import { Clipboard } from '@ionic-native/clipboard/ngx';

@Injectable({ providedIn: 'root'})
export class GenericService {
    fileData: File = null;
    imgFile: File = null;
    studentImgFile: File = null;
    staffImgFile: File = null;
    bannerImgFile: File = null;
    logoImgFile: File = null;
    signatureImgFile: File = null;
    localUrl: string;
    searchTerm: string;
    selectedPage = 1;
    sizePerPage = 10;
    pagesCount: number;
    dateNow = '';
    submitted = false;
    loading = false;
    progress: number;
    private pageloadcom = new Subject<boolean>();
    pageload = this.pageloadcom.asObservable();
    starlist?: boolean[] = [false, false, false, false, false, false, false, false, false, false];
    imgForm: FormGroup;
    rating?: number;
    minImageSize = 100;
    maxImageSize = 665600;
    auth = 'account';
    account = 'account';
    profile = 'profile';
    adminprofile = 'admin-profile';
    home = 'home';
    school = 'school';
    login = 'login';
    register = 'register';
    dashboard = 'dashboard';
    admindashboard = 'admin-dashboard';
    search = 'search';
    //imgurl = 'http://localhost:5184/';
    //imgurl = 'https://localhost:7060/';
    imgurl = 'https://gradex-web-api.azurewebsites.net/';
    resourceImgUrl = '';
    newName: string;
    defaultImg =  '../../../assets/images/avatar.png';
    isCategoryOpen = false;
    isSearch = false;
    isUploadForm = false;
    isCategoryActive = false;
    fullList: any = [];
    offsetMap: any;
    isAdminLogin = false;
    isLogin = false;
    imag: string;
    imagsign: string;
    bannerimag: string;
    logoimag: string;
    blankimg = '../../../assets/images/avatar.png';
    storeUrl = 'https://gradex-web-api.azurewebsites.net/';
    topdata = '';
    mobileModal = false;
    criCurrentClassLevelId: number;
    criCurrentClassId: number;
    isResultSession = false;
    signatureString: string
    logoString: string;
    photoString: string;
    selectedSchoolId: number;
    isView = false;
    pdfUrl = '';
    pdfCanvas: any;
    pdfSource: string;

    resultTemplate = [
      {id: 1, result: 'student-result', annual: 'annual-result', midterm: 'midterm-result', multiple: 'result-multiple', annualmultiple: 'annual-result-multiple'},
      {id: 520, result: 'louisville-result', annual: 'louisville-annual-result', midterm: 'louisville-midterm-result'},
      {id: 60, result: 'notre-dame-result', annual: 'annual-notre-dame-result', midterm: 'midterm-result'},
      {id: 66, result: 'trailblazer-result', annual: 'annual-notre-dame-result', midterm: 'midterm-result', multiple: 'trailblazer-result-multiple', annualmultiple: 'annual-trailblazer-result-multiple'},
    ];

    // resultTemplate = [
    //   {id: 1, result: 'student-result', annual: 'annual-result', midterm: 'midterm-result'},
    //   {id: 38, result: 'louisville-result', annual: 'louisville-annual-result', midterm: 'louisville-midterm-result'},
    //   {id: 43, result: 'notre-dame-result', annual: 'annual-notre-dame-result', midterm: 'midterm-result'},
    //   {id: 66, result: 'trailblazer-result', annual: 'annual-notre-dame-result', midterm: 'midterm-result'},
    // ];



    constructor() { }


    public get pageIndex(): number {
        return (this.selectedPage - 1) * this.sizePerPage;
    }

    get f() {
      return this.imgForm.controls;
    }

    setMedia(path: string) {
      return path ? path : null;
    }

    setImg(imgPath: string) {
      if (imgPath && imgPath.length > 0) {
        return this.imgurl + imgPath;
      } else {
        return this.defaultImg;
      }
    }

    
    public createHttpParams(params: {}): HttpParams {
        let httpParams: HttpParams = new HttpParams();
        Object.keys(params).forEach(param => {
            if (params[param]) {
                httpParams = httpParams.set(param, params[param]);
            }
        });
        return httpParams;
    }

    showPreview(DeFile: any, mag: HTMLImageElement) {
      this.staffImgFile = <File>DeFile.target.files[0];
      this.studentImgFile = <File>DeFile.target.files[0];
      let img = new Image();
      const reader = new FileReader();
      reader.onload = (event: any) => {
          mag.src = event.target.result;
          img.src = event.target.result;
          this.imag = event.target.result;
      };
      reader.readAsDataURL(DeFile.target.files[0]);
      this.newName = this.getExpImg(this.imgFile.name, this.imgFile.type);
      
      img.onload = (event: any) => {
        if (this.fileData.size < this.minImageSize || this.fileData.size > this.maxImageSize) {
          this.createImg(img, img.naturalWidth, img.naturalHeight);
        }
      }
    }

    showPreviewBanner(DeFile: any, mag: HTMLImageElement) {
      this.bannerImgFile = <File>DeFile.target.files[0];
      let img = new Image();
      const reader = new FileReader();
      reader.onload = (event: any) => {
          mag.src = event.target.result;
          img.src = event.target.result;
          this.imag = event.target.result;
      };
      reader.readAsDataURL(DeFile.target.files[0]);
      this.newName = this.getExpImg(this.imgFile.name, this.imgFile.type);
      
      img.onload = (event: any) => {
        if (this.fileData.size < this.minImageSize || this.fileData.size > this.maxImageSize) {
          this.createImg(img, img.naturalWidth, img.naturalHeight);
        }
      }
    }

    showPreviewLogo(DeFile: any, mag: HTMLImageElement) {
      this.logoImgFile = <File>DeFile.target.files[0];
      let img = new Image();
      const reader = new FileReader();
      reader.onload = (event: any) => {
          mag.src = event.target.result;
          img.src = event.target.result;
          this.imag = event.target.result;
      };
      reader.readAsDataURL(DeFile.target.files[0]);
      this.newName = this.getExpImg(this.imgFile.name, this.imgFile.type);
      
      img.onload = (event: any) => {
        if (this.fileData.size < this.minImageSize || this.fileData.size > this.maxImageSize) {
          this.createImg(img, img.naturalWidth, img.naturalHeight);
        }
      }
    }


    showPreviewSignature(DeFile: any, mag: HTMLImageElement) {
      this.signatureImgFile = <File>DeFile.target.files[0];
      let img = new Image();
      const reader = new FileReader();
      reader.onload = (event: any) => {
          mag.src = event.target.result;
          img.src = event.target.result;
          this.imagsign = event.target.result;
      };
      reader.readAsDataURL(DeFile.target.files[0]);
      this.newName = this.getExpImg(this.imgFile.name, this.imgFile.type);
      
      img.onload = (event: any) => {
        if (this.fileData.size < this.minImageSize || this.fileData.size > this.maxImageSize) {
          this.createImg(img, img.naturalWidth, img.naturalHeight);
        }
      }
    }


    createImg(img, imgWidth, imgHeight) {
        //let myFile: File = null;
        let canvas = document.createElement('canvas');
          let max_size = 544,// TODO : pull max size from a site config
          width = imgWidth,
          height = imgHeight;
          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }
    
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d').drawImage(img, 0, 0, width, height);
          canvas.toBlob((res) => {
            let newname = this.getExpImg("pvi", res.type);
            this.fileData = new File([res], newname, { type: res.type });
          });
      }

    clearPreview() {
      this.fileData = null;
      this.imgForm = null;
    }

    
    getExpImg(value: string, type: string) {
      debugger
        let ext;
        switch (type) {
            case 'image/jpeg':
                ext = '.jpg';
                break;
            case 'image/png':
                ext = '.png';
                break;
            case 'image/gif':
                ext = '.gif';
                break;
            case 'image/webp':
                ext = '.webp';
                break;
            default:
                return null;
        }
        const reg = /[^A-Za-z0-9]/g;
        return value.replace(reg, '').substring(0, 4).toLowerCase() + Math.floor(Math.random() * 20000) + Date.now() + ext;
    }
    
    getImgExt(value: string, type: string) {
        let ext;
        switch (type) {
            case 'image/jpeg':
                ext = '.jpg';
                break;
            case 'image/png':
                ext = '.png';
                break;
            case 'image/gif':
                ext = '.gif';
                break;
            default:
                return null;
        }
        const reg = /[^A-Za-z0-9]/g;
        return value + ext;
    }

    getExt(value: string) {
        const reg = value.slice(value.lastIndexOf('.')).replace(/[.]/, '').toUpperCase();
        return reg;
    }

    trimDocName(name: string) {
      name = name.slice(0, name.lastIndexOf('.')).trim();
      const fres = name.split(/\s/g);
      fres.forEach((part, i) => {
        fres[i] = part.toLowerCase().replace(/[^A-Za-z0-9_]/g, "").trim();
      });
      let reel = fres.join(" ").substring(0, 20);
      return reel;
    }

    createFilename(value: string, ext: string) {
        const reg = /[^A-Za-z0-9]/g;
        return value.replace(reg, '').substring(0, 4).toLowerCase() + Math.floor(Math.random() * 20000) + Date.now() + ext;
    }
    

    coolon(response: any, name: string, format?: string) {
      //let filename = name + '.' + format;
      let filename = name.replaceAll('.', '').substring(0, 20) + '.' + format;
      let downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(response);
      
      if (filename) {
        downloadLink.setAttribute('download', filename)
      }
      document.body.appendChild(downloadLink);
      downloadLink.click();


      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'File Downloaded successfully!.',
        showConfirmButton: false,
        timer: 2000
      });
    }

    hook(value: string) {
        return value.replace(/[\<\>]/g, '');
    }

    firstPage() {
        this.selectedPage = 1;
    }
    lastPage() {
        this.selectedPage = this.pagesCount;
    }
    changePagePlus() {
        this.selectedPage++;
    }
    changePageMinus() {
        this.selectedPage--;
    }

    setPageCount(count: number) {
        return Array(count).fill(0).map((x, i) => i + 1);
    }
    reset() {
        this.selectedPage = 1;
    }
    createImgForm(): FormData {
        this.submitted = true;
        const formData: FormData = new FormData();
        const med = this.getExpImg(this.fileData.name, this.fileData.type);
        formData.append('file', this.fileData, med);
        return formData;
    }

    
    clearImgForm() {
        this.localUrl = '';
        this.fileData = null;
        this.progress = 0;
    }

  editRoute(router: Router) {
    this.selectedPage = 1;
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
          this.selectedPage = 1;
      }
    });
  }

  editStayRoute(router: Router) {
    this.selectedPage = 1;
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
          this.selectedPage = 1;
      }
    });
  }

  setStar(data: any) {
        this.rating = data + 1;
        for (let i = 0; i <= 9; i++) {
            if (i <= data) {
                this.starlist[i] = true;
            } else {
                this.starlist[i] = false;
            }
        }
    }

    changeStar(value: number, rate: number, songs: any) {
        songs.find(t => t.id === value).rate = rate;
    }
    changeSingleStar(value: number, rate: number, song: any) {
      song.rate = rate;
    }

    cleanStar(data: any) {
      for (let i = 0; i <= 9; i++) {
          if (i <= data) {
              this.starlist[i] = true;
          } else {
              this.starlist[i] = false;
          }
      }
  }

  cutText(text: string) {
    if (text.length > 64) {
      return text.substring(0, 62) + '...';
    }
    return text;
  }

  cutTextOnline(text: string) {
    if (text.length > 34) {
      return text.substring(0, 32) + '...';
    }
    return text;
  }

  cutTextAuthor(text: string) {
    if (text.length > 38) {
      return text.substring(0, 36) + '...';
    }
    return text;
  }


  closeBar() {
    this.isCategoryOpen = false;
  }

  setReturn(days: number) {
    if (days > 1) {
      //this.returnColor = 'rgb(0, 124, 128)';
      return `Returns in ${days} days`;
    } 
    if(days < 0) {
      if (days == -1) {
        //this.returnColor = 'rgb(238, 74, 74)';
        return `Overdue by ${days *= -1} day`;
      } else {
        //var fre = days == -1 ? 
      //this.returnColor = 'rgb(238, 74, 74)';
      return `Overdue by ${days *= -1} days`;
      }
    }

    if(days == 0) { 
      //this.returnColor = 'orange';
      return `Returns in ${days} day`;
    }

    //this.returnColor = 'rgb(0, 124, 128)';
    return `Returns in ${days} days`;
  }



  setDueColor(days: number) {
    if (days > 1) {
      return 'rgb(0, 124, 128)';
    } 
    if(days < 0) {
      if (days == -1) {
        return 'rgb(238, 74, 74)';
      } else {
      return 'rgb(238, 74, 74)';
      }
    }

    if(days == 0) { 
      return 'orange';
    }
    return 'rgb(0, 124, 128)';
  }


  setNoteText(status: string) {
    if (status == 'APPROVED') {
      //this.returnColor = 'rgb(0, 124, 128)';
      return `Your loan was approved successfully`;
    } 
    else {
      return `Your loan was declined.`;
    }
  }

  setNoteColor(status: string) {
    if (status == 'APPROVED') {
      return 'rgb(0, 124, 128)';
    } 
    else {
      return 'rgb(238, 74, 74)';
    }
  }

  cutSchool(value: string) {
    return value.substring(0, 20) + '..';
  }

  getStatus(value: string) {
    if (value == '1') {
      return 'Admin';
    }
    if (value == '2') {
      return 'Staff';
    }
    if (value == '3') {
      return 'Student';
    }
    return 'Student';
  }

  public get tablePrintCss() {
    return `body
      {
          font-family: Arial;
          font-size: 10pt;
      }
      table
      {
          border: 1px solid #ccc;
          border-collapse: collapse;
          color: black;
      }
      table th
      {
          font-weight: bold;
          padding: 10px 15px;
          text-align: center;
          background-color: rgb(9, 79, 104);
          color: black;
      }
      table th, table td
      {
          border: 1px solid #16a7e0;
          padding: 10px 15px;
      }`;
  }


  printData(table: HTMLTableElement) {
    let newWin = window.open('');
    newWin.document.write(table.outerHTML);
    newWin.document.write('<style type = "text/css">');
    newWin.document.write(this.tablePrintCss);
    newWin.document.write('</style>');
    newWin.print();
    newWin.close();
  }

  tableToCSV(table: HTMLTableElement) {
    // Variable to store the final csv data
    let csv_data = [];

    // Get each row data
    let rows = table.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
      // Get each column data
      let cols = rows[i].querySelectorAll('td,th');

      // Stores each csv row data
      let csvrow = [];
      for (var j = 0; j < cols.length; j++) {
        // Get the text data of each cell
        // of a row and push it to csvrow
        csvrow.push(cols[j].innerHTML);
      }

      // Combine each column value with comma
      csv_data.push(csvrow.join(','));
    }
  }


  searchTable(input: HTMLInputElement, tableBody: HTMLTableElement) {
    var filter, found, tr, td, i, j;
    filter = input.value.toUpperCase();
    tr = tableBody.getElementsByTagName('tr');
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName('td');
      for (j = 0; j < td.length; j++) {
        if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
          found = true;
        }
      }
      if (found) {
        tr[i].style.display = '';
        found = false;
      } else {
        tr[i].style.display = 'none';
      }
    }
  }

  formatPosition(value: number) {
    let position;
    let newValue;
    if (value == 11 || value == 12 || value == 13) {
      newValue = value;
    } else {
      newValue = Number(value.toString()[value.toString().length - 1]);
    }

    switch (newValue) {
      case 1:
        position = value + "st";
        break;
      case 2:
        position = value + "nd";
        break;
      case 3:
        position = value + "rd";
        break;
      default:
        position = value + 'th';
        break;
    }
    return position;
  }

  getDownload(event, name, type, format) {
    if (event.type === HttpEventType.Response) {
      let myfile = new Blob([event.body], { type: type });
      this.coolon(myfile, this.genName(name), format);
    }
  }

  async getMediaBase64(event, type) {
    let baseString = "";
    if (event.type === HttpEventType.Response) {
      let myfile = new Blob([event.body], { type: event.body.type });
      baseString = await this.convertBlobToBase64(myfile);
    }
    return baseString;
  }

  genName(loc: string): string {
    return `${loc}${Math.floor(Math.random() * 20000)}`;
  }

  setImgRemote(imgpath) {
    if (imgpath && imgpath.length > 0) {
      return imgpath;
    } else {
      return this.defaultImg;
    }
  }

  convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        if (blob.size > 0) {
          this.signatureString =base64data;
        }
        
        resolve(base64data);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  }

  convertLogoBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        if (blob.size > 0) {
          this.logoString =base64data;
        }
        
        resolve(base64data);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  }

  convertPhotoBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        if (blob.size > 0) {
          this.photoString =base64data;
        }
        
        resolve(base64data);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  }

  async getLogoMediaBase64(event, type) {
    let baseString = "";
    if (event.type === HttpEventType.Response) {
      let myfile = new Blob([event.body], { type: event.body.type });
      baseString = await this.convertLogoBlobToBase64(myfile);
    }
    return baseString;
  }

  async getPhotoMediaBase64(event, type) {
    let baseString = "";
    if (event.type === HttpEventType.Response) {
      let myfile = new Blob([event.body], { type: event.body.type });
      baseString = await this.convertPhotoBlobToBase64(myfile);
    }
    return baseString;
  }

  async fetchBase64Image(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  };


  getResultFont(resul: any[] , psycolist: any[]) {
    if (psycolist.length > 0 && resul.length > 0) {
      let les = resul.length + (psycolist.length / 3);
      if (les > 20) {
        return {cellpadding: 2, font: 7};
      }
    } else {
      return {cellpadding: 3, font: 8};
    }
    return {cellpadding: 3, font: 8};
  }


  
}