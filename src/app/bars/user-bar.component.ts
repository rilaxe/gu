import { Component, OnInit, Input } from "@angular/core";
import { Config, Menu } from "./types";
import { AuthenticationService, GenericService, UserData } from "../services";
import { Router } from "@angular/router";
import { ObjectService } from "../services/object.service";

@Component({
  selector: "admin-bar",
  templateUrl: "./user-bar.component.html",
  styleUrls: ["./bars.component.css"]
})
export class UserBarsComponent implements OnInit {
  config: Config;
  userdata: UserData;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  obj: ObjectService;
  loaderonly = false;

  constructor( 
    private router: Router,
    private auth: AuthenticationService,
    private gen: GenericService,
    private userdat: UserData,

    private objserve: ObjectService
    ) {
      this.genk = gen;
      this.obj = objserve;
      this.userName = auth.currentUserValue.status == '1'? 'Super Admin' : auth.currentUserValue.name;
      this.userImgPath = auth.currentUserValue.logo;
      this.adminStatus = gen.getStatus(auth.currentUserValue.status);
      this.userdata = userdat;

      this.userdata.loaderOnly.subscribe(res => {
        this.logLoaderOnly(res);
      });
}

  ngOnInit() {
    this.obj.config = this.objserve.mergeConfig(this.objserve.options);
  }

  logout() {
    let id = this.auth.currentUserValue.schoolId;
    this.auth.logout();
    this.router.navigate(['/']);
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }

  logLoaderOnly(res: boolean) {
    this.loaderonly = res;
  }
  
  
}

