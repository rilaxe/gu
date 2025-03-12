import { Component, OnInit, Input } from "@angular/core";
//import { Config, Menu } from "./types";
import { AuthenticationService, GenericService } from "../services";
import { Router } from "@angular/router";
import { ObjectService } from "../services/object.service";

@Component({
  selector: "admin-bar",
  templateUrl: "./student-noticeboard.component.html",
  styleUrls: []
})
export class StudentNoticeboardComponent implements OnInit {
  //config: Config;
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
    this.genk.topdata = 'Noticeboard';
    //this.obj.config = this.objserve.mergeConfig(this.objserve.options);
  }

  logout() {
    let id = this.auth.currentUserValue.schoolId;
    this.auth.logout();
    this.router.navigate(['/', this.genk.school, id]);
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }
  
  
}

