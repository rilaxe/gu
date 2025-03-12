import{a as H}from"./chunk-B2YP673Q.js";import{$a as I,A as C,I as y,J as o,K as u,Ma as b,Pa as w,T as l,Ua as V,Va as M,W as t,Wa as k,X as i,Xa as E,Y as p,Ya as h,bb as L,la as r,ma as c,r as S,s as f,ta as s,ub as F,vb as j,w as v,x as g}from"./chunk-WDIAUSLE.js";import"./chunk-3EYC4JTX.js";var R=e=>[e,"settings","school-profile"],D=e=>[e,"settings","ca-setup"],A=e=>[e,"settings","class-level"],G=e=>[e,"settings","grade-scale"],U=e=>[e,"settings","manage-subjects"],T=e=>[e,"settings","elective-subjects"],B=e=>[e,"settings","pyscomotor-setup"],O=e=>[e,"settings","core-subject"],z=e=>[e,"settings","promotion"],q=e=>[e,"settings","session"],N=(()=>{let n=class n{constructor(m,a,d,x){this.router=m,this.auth=a,this.sch=d,this.gen=x,this.schoolName="",this.schoolEmail="",this.userImgPath="",this.mobileModal=!1,this.genk=x,this.schoolName=a.currentUserValue.schoolName,this.userImgPath=a.currentUserValue.logo,this.adminStatus=a.currentUserValue.status}ngOnInit(){this.getPopulationData(),this.getSchool()}get setImg(){return this.userImgPath&&this.userImgPath.length>0?this.genk.imgurl+this.userImgPath:this.genk.defaultImg}getPopulationData(){this.sch.getPopulationData().subscribe(m=>{this.countdata=m[0]})}logout(){this.auth.logout(),this.router.navigate(["/",this.genk.account])}getSchool(){this.sch.getSchoolById(this.auth.currentUserValue.schoolId.toString()).subscribe(m=>{this.school=m})}};n.\u0275fac=function(a){return new(a||n)(u(M),u(I),u(H),u(L))},n.\u0275cmp=S({type:n,selectors:[["app-dashboard"]],inputs:{header:"header"},decls:85,vars:37,consts:[[1,"mx-6","my-12"],[1,"card","mb-5","mb-xl-10"],[1,"card-body","pt-9","pb-0"],[1,"d-flex","flex-wrap","flex-sm-nowrap","mb-3"],[1,"me-7","mb-4"],[1,"symbol","symbol-100px","symbol-lg-160px","symbol-fixed","position-relative"],["alt","image",2,"object-fit","cover",3,"src"],[1,"flex-grow-1"],[1,"d-flex","justify-content-between","align-items-start","flex-wrap","mb-2"],[1,"d-flex","flex-column"],[1,"d-flex","align-items-center","mb-2"],["href","#",1,"text-gray-900","text-hover-primary","fs-2","fw-bolder","me-2"],["href","#"],[1,"svg-icon","svg-icon-1","svg-icon-primary"],["xmlns","http://www.w3.org/2000/svg","width","24px","height","24px","viewBox","0 0 24 24"],["d","M10.0813 3.7242C10.8849 2.16438 13.1151 2.16438 13.9187 3.7242V3.7242C14.4016 4.66147 15.4909 5.1127 16.4951 4.79139V4.79139C18.1663 4.25668 19.7433 5.83365 19.2086 7.50485V7.50485C18.8873 8.50905 19.3385 9.59842 20.2758 10.0813V10.0813C21.8356 10.8849 21.8356 13.1151 20.2758 13.9187V13.9187C19.3385 14.4016 18.8873 15.491 19.2086 16.4951V16.4951C19.7433 18.1663 18.1663 19.7433 16.4951 19.2086V19.2086C15.491 18.8873 14.4016 19.3385 13.9187 20.2758V20.2758C13.1151 21.8356 10.8849 21.8356 10.0813 20.2758V20.2758C9.59842 19.3385 8.50905 18.8873 7.50485 19.2086V19.2086C5.83365 19.7433 4.25668 18.1663 4.79139 16.4951V16.4951C5.1127 15.491 4.66147 14.4016 3.7242 13.9187V13.9187C2.16438 13.1151 2.16438 10.8849 3.7242 10.0813V10.0813C4.66147 9.59842 5.1127 8.50905 4.79139 7.50485V7.50485C4.25668 5.83365 5.83365 4.25668 7.50485 4.79139V4.79139C8.50905 5.1127 9.59842 4.66147 10.0813 3.7242V3.7242Z","fill","#00A3FF"],["d","M14.8563 9.1903C15.0606 8.94984 15.3771 8.9385 15.6175 9.14289C15.858 9.34728 15.8229 9.66433 15.6185 9.9048L11.863 14.6558C11.6554 14.9001 11.2876 14.9258 11.048 14.7128L8.47656 12.4271C8.24068 12.2174 8.21944 11.8563 8.42911 11.6204C8.63877 11.3845 8.99996 11.3633 9.23583 11.5729L11.3706 13.4705L14.8563 9.1903Z","fill","white",1,"permanent"],[1,"d-flex","flex-wrap","fw-bold","fs-6","mt-4","mb-2","pe-2"],["href","#",1,"d-flex","align-items-center","text-gray-400","text-hover-primary","mb-2"],[1,"svg-icon","svg-icon-4","me-1"],["xmlns","http://www.w3.org/2000/svg","width","24","height","24","viewBox","0 0 24 24","fill","none"],["d","M20 14H18V10H20C20.6 10 21 10.4 21 11V13C21 13.6 20.6 14 20 14ZM21 19V17C21 16.4 20.6 16 20 16H18V20H20C20.6 20 21 19.6 21 19ZM21 7V5C21 4.4 20.6 4 20 4H18V8H20C20.6 8 21 7.6 21 7Z","fill","currentColor"],["opacity","0.3","d","M17 22H3C2.4 22 2 21.6 2 21V3C2 2.4 2.4 2 3 2H17C17.6 2 18 2.4 18 3V21C18 21.6 17.6 22 17 22ZM10 7C8.9 7 8 7.9 8 9C8 10.1 8.9 11 10 11C11.1 11 12 10.1 12 9C12 7.9 11.1 7 10 7ZM13.3 16C14 16 14.5 15.3 14.3 14.7C13.7 13.2 12 12 10.1 12C8.10001 12 6.49999 13.1 5.89999 14.7C5.59999 15.3 6.19999 16 7.39999 16H13.3Z","fill","currentColor"],["href","#",1,"d-flex","align-items-center","text-gray-400","text-hover-primary","mb-2",2,"margin-left","15px"],[1,"svg-icon","mr-10","svg-icon-4","me-1"],["opacity","0.3","d","M21 19H3C2.4 19 2 18.6 2 18V6C2 5.4 2.4 5 3 5H21C21.6 5 22 5.4 22 6V18C22 18.6 21.6 19 21 19Z","fill","currentColor"],["d","M21 5H2.99999C2.69999 5 2.49999 5.10005 2.29999 5.30005L11.2 13.3C11.7 13.7 12.4 13.7 12.8 13.3L21.7 5.30005C21.5 5.10005 21.3 5 21 5Z","fill","currentColor"],[1,"d-flex","flex-wrap","flex-stack"],[1,"d-flex","flex-column","flex-grow-1","pe-8"],[1,"d-flex","flex-wrap"],[1,"border","border-gray-300","border-dashed","rounded","min-w-125px","py-3","px-4","me-6","mb-3"],[1,"d-flex","align-items-center"],["data-kt-countup","true","data-kt-countup-value","4500","data-kt-countup-prefix","",1,"fs-2","fw-bolder"],[1,"fw-bold","fs-6","text-gray-400"],["data-kt-countup","true","data-kt-countup-value","150",1,"fs-2","fw-bolder"],["data-kt-countup","true","data-kt-countup-value","12","data-kt-countup-prefix","",1,"fs-2","fw-bolder"],[1,"nav","nav-stretch","nav-line-tabs","nav-line-tabs-2x","border-transparent","fs-5","fw-bolder"],[1,"nav-item","mt-2"],[1,"nav-link","text-active-primary","ms-0","me-10","py-5",3,"routerLink"],["routerLinkActive","active",1,"nav-link","text-active-primary","ms-0","me-10","py-5",3,"routerLink"],[1,"mx-6","my-12",2,"font-family","'Poppins'"]],template:function(a,d){a&1&&(t(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"div",4)(5,"div",5),p(6,"img",6),i()(),t(7,"div",7)(8,"div",8)(9,"div",9)(10,"div",10)(11,"a",11),r(12),i(),t(13,"a",12)(14,"span",13),v(),t(15,"svg",14),p(16,"path",15)(17,"path",16),i()()()(),g(),t(18,"div",17)(19,"a",18)(20,"span",19),v(),t(21,"svg",20),p(22,"path",21)(23,"path",22),i()(),r(24),i(),g(),t(25,"a",23)(26,"span",24),v(),t(27,"svg",20),p(28,"path",25)(29,"path",26),i()(),r(30),i()()()(),g(),t(31,"div",27)(32,"div",28)(33,"div",29)(34,"div",30)(35,"div",31)(36,"div",32),r(37),i()(),t(38,"div",33),r(39,"No of Student"),i()(),t(40,"div",30)(41,"div",31)(42,"div",34),r(43),i()(),t(44,"div",33),r(45,"No of Staff"),i()(),t(46,"div",30)(47,"div",31)(48,"div",35),r(49),i()(),t(50,"div",33),r(51,"No of Classes"),i()()()()()()(),t(52,"ul",36)(53,"li",37)(54,"a",38),r(55,"School Information"),i()(),t(56,"li",37)(57,"a",39),r(58,"CA Setup"),i()(),t(59,"li",37)(60,"a",39),r(61,"Class-level"),i()(),t(62,"li",37)(63,"a",39),r(64,"Grade Scale"),i()(),t(65,"li",37)(66,"a",39),r(67," Subject"),i()(),t(68,"li",37)(69,"a",39),r(70,"Elective Subject"),i()(),t(71,"li",37)(72,"a",39),r(73,"Psychomotor "),i()(),t(74,"li",37)(75,"a",38),r(76,"Core Subject "),i()(),t(77,"li",37)(78,"a",38),r(79,"Promotion Criteria"),i()(),t(80,"li",37)(81,"a",39),r(82,"Session"),i()()()()()(),t(83,"div",40),p(84,"router-outlet"),i()),a&2&&(o(6),l("src",d.setImg,y),o(6),c(d.schoolName),o(12),c(d.school.phoneOne),o(6),c(d.school.email),o(7),c(d.countdata.studentCount),o(6),c(d.countdata.staffCount),o(6),c(d.countdata.classCount),o(5),l("routerLink",s(17,R,"/admin")),o(3),l("routerLink",s(19,D,"/admin")),o(3),l("routerLink",s(21,A,"/admin")),o(3),l("routerLink",s(23,G,"/admin")),o(3),l("routerLink",s(25,U,"/admin")),o(3),l("routerLink",s(27,T,"/admin")),o(3),l("routerLink",s(29,B,"/admin")),o(3),l("routerLink",s(31,O,"/admin")),o(3),l("routerLink",s(33,z,"/admin")),o(3),l("routerLink",s(35,q,"/admin")))},dependencies:[V,k,E]});let e=n;return e})();var J=[{path:"dashboard",loadChildren:()=>import("./chunk-7WQJ7VML.js").then(e=>e.DashboardModule)},{path:"payment",loadChildren:()=>import("./chunk-LKLBFQQA.js").then(e=>e.PaymentModule)},{path:"admin-students",loadChildren:()=>import("./chunk-2TBYNIXE.js").then(e=>e.AdminStudentsModule)},{path:"admin-staff",loadChildren:()=>import("./chunk-UVEOQ3NZ.js").then(e=>e.AdminStaffModule)},{path:"settings",component:N,loadChildren:()=>import("./chunk-3WW3T2L5.js").then(e=>e.SettingsModule)},{path:"result",loadChildren:()=>import("./chunk-YABD5ZIK.js").then(e=>e.ResultModule)},{path:"discipline",loadChildren:()=>import("./chunk-MIOBPQWT.js").then(e=>e.DisciplineModule)},{path:"report",loadChildren:()=>import("./chunk-DLIZTDRG.js").then(e=>e.ReportModule)},{path:"access-pin",loadChildren:()=>import("./chunk-3SPS2BHQ.js").then(e=>e.AccessPinModule)}],Z=(()=>{let n=class n{};n.\u0275fac=function(a){return new(a||n)},n.\u0275mod=f({type:n}),n.\u0275inj=C({imports:[h.forChild(J),h]});let e=n;return e})();var le=(()=>{let n=class n{};n.\u0275fac=function(a){return new(a||n)},n.\u0275mod=f({type:n}),n.\u0275inj=C({imports:[b,F,j,w,h,Z]});let e=n;return e})();export{le as AdminModule};
