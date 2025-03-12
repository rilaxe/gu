import { Component, OnInit, Input } from "@angular/core";
import { Config, Menu } from "./types";
import { AuthenticationService, GenericService } from "../services";
import { Router } from "@angular/router";
import { ObjectService } from "../services/object.service";

@Component({
  selector: "app-admin-bar-mobile",
  templateUrl: "./admin-bar-mobile.component.html",
  styleUrls: ["./bars.component.css"]
})
export class AdminBarsMobileComponent implements OnInit {
  config: Config;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  obj: ObjectService;

  constructor( 
    private router: Router,
    private auth: AuthenticationService,
    private gen: GenericService,
    private objserve: ObjectService
    ) {
      this.genk = gen;
      this.obj = objserve;
      this.userName = auth.currentUserValue.status == '1'? 'Super Admin' : auth.currentUserValue.name;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = gen.getStatus(auth.currentUserValue.status);
}

  ngOnInit() {
    this.obj.config = this.objserve.mergeConfig(this.objserve.options);
  }

  get setImg() {
    if (this.userImgPath && this.userImgPath.length > 0) {
      return this.genk.imgurl + this.userImgPath;
    } else {
      return this.genk.defaultImg;
    }
  }

  logout() {
    let id = this.auth.currentUserValue.schoolId;
    this.auth.logout();
    this.router.navigate(['/']);
  }
  
  
}

