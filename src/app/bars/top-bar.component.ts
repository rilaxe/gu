import { Component, Inject, Input, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AuthenticationService, GenericService } from '../services';
import { DropDownAnimation, SlideInAnimation, WaveInAnimation } from './animations';

@Component({
  selector: 'app-topbar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./bars.component.css'],
  animations: [DropDownAnimation, SlideInAnimation, WaveInAnimation]
})
export class TopBarComponent {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;

  constructor( 
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private auth: AuthenticationService,
    private gen: GenericService
    ) {
      this.genk = gen;
      this.userName = auth.currentUserValue.status == '1'? 'Super Admin' : auth.currentUserValue.name;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = gen.getStatus(auth.currentUserValue.status);
}

get setImg() {
    if (this.userImgPath && this.userImgPath.length > 0) {
      return this.userImgPath;
    } else {
      return this.genk.defaultImg;
    }
  }

get topdata() {
    return this.genk.topdata.replace(/\b\w/g, char => char.toUpperCase());
}

  
  logout() {
    this.auth.logout();
    this.router.navigate(['/', this.genk.account]);
  }
}
