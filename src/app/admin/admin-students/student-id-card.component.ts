import { Component, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { SchoolService } from '../../services/school.service';

@Component({
  templateUrl: './student-id-card.component.html',
  styleUrls: ['sample.css']
})
export class StudentIdCardComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  countdata: any;
  genderStat: any;
  slideIndex = 1;
  localUrl: string;
  localUrlBack: string;


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
  this.genk.topdata = 'Student IdCard';
  this.drawImage();
}

get setImg() {
    if (this.userImgPath && this.userImgPath.length > 0) {
      return this.genk.imgurl + this.userImgPath;
    } else {
      return this.genk.defaultImg;
    }
  }

  getPopulationData() {
    this.sch.getPopulationData()
      .subscribe(res => {
        
      })
  }

  
  logout() {
    this.auth.logout();
    this.router.navigate(['/', this.genk.account]);
  }


plusDivs(n, slid: HTMLDivElement) {
  this.showDivs(this.slideIndex += n, slid);
}

showDivs(n, slid: HTMLDivElement) {
  var i;
  let x = slid.getElementsByClassName("mySlides") as any;
  if (n > x.length) {this.slideIndex = 1}
  if (n < 1) {this.slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  x[this.slideIndex-1].style.display = "block";  
}




//showSlides(slideIndex);

// Next/previous controls
plusSlides(n, slid: HTMLDivElement) {
  this.showSlides(this.slideIndex += n, slid);
}

// Thumbnail image controls
currentSlide(n, slid: HTMLDivElement) {
  this.showSlides(this.slideIndex = n, slid);
}

showSlides(n, slid: HTMLDivElement) {
  let i;
  let slides = slid.getElementsByClassName("mySlides") as any;
  let dots = slid.getElementsByClassName("dot");
  if (n > slides.length) {this.slideIndex = 1}
  if (n < 1) {this.slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[this.slideIndex-1].style.display = "block";
  dots[this.slideIndex-1].className += " active";
}


drawImage() {
    debugger;
    let canvas = document.createElement('canvas');
    canvas.width = 521;
    canvas.height = 828;
    let ctx = canvas.getContext('2d');
    
//const ctx = canvas.getContext('2d');

// Load the background image
const backgroundImage = new Image();
backgroundImage.src = "../../../assets/images/front-student-id.png"; // Path to your background image

// Load the overlay image
const overlayImage = new Image();
overlayImage.src = '../../../assets/images/davido-web.png';
// overlayImage.style.width = '300px';
// overlayImage.style.height = '460px';
// overlayImage.style.objectFit = 'cover';  // Path to your overlay image (e.g., transparent PNG)


    backgroundImage.onload = () => {

        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        overlayImage.onload = () => {
            // debugger
            // let canvasStudent = document.createElement('canvas');
            // const ctxdent = canvasStudent.getContext('2d');

            // // Set canvas dimensions same as the image element's styles
            // canvasStudent.width = parseInt(overlayImage.style.width);
            // canvasStudent.height = parseInt(overlayImage.style.height);


            // ctxdent.drawImage(overlayImage, 0, 0, canvasStudent.width, canvasStudent.height);


            // const dataURL = canvasStudent.toDataURL('image/png');

            // const overlayImage2 = new Image();
            // overlayImage2.src = dataURL;

            ctx.drawImage(overlayImage, 130, 360, 270, 270);
    //         ctx.fillStyle = 'white';
    // ctx.fillRect(20, 400, 400, 400);

// Add text to the canvas
    ctx.font = '700 40px Segoe UI';
    ctx.fillStyle = 'black';
    ctx.fillText('Hello, World!', 150, 737);

            const url = canvas.toDataURL();
            this.localUrl = url;
        };
    };

}


downloadImage(url, filename) {
    const link = document.createElement('a'); // Create a link element
    link.href = url; // Set the dataURL as the href
    link.download = filename; // Set the download attribute with the desired filename
    document.body.appendChild(link); // Append the link to the body
    link.click(); // Programmatically click the link to trigger download
    document.body.removeChild(link); // Remove the link from the document
}


}
