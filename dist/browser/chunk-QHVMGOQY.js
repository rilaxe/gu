import{a as W}from"./chunk-B2YP673Q.js";import{$a as P,A as E,Ba as x,Ga as Z,Ha as j,I,J as d,K as b,Ka as G,Ma as B,Pa as N,R as u,T as C,Va as F,W as e,Wa as O,X as t,Y as n,Ya as S,aa as L,ba as V,bb as A,ca as h,gb as R,ib as U,la as i,lb as z,ma as f,na as y,oa as w,r as H,s as _,ta as D,u as k,ub as $,v as M,vb as q,w as o,x as m,za as g}from"./chunk-WDIAUSLE.js";import"./chunk-3EYC4JTX.js";function J(a,l){if(a&1&&(e(0,"div",170)(1,"span",171),i(2,"Time:"),t(),e(3,"span",172),i(4),g(5,"date"),g(6,"date"),t()()),a&2){let r=h().$implicit;d(4),w("",x(5,2,r.startDateTime,"hh:mm a"),"\xA0 - \xA0",x(6,5,r.endDateTime,"hh:mm a"),"")}}function K(a,l){if(a&1&&(e(0,"div",170)(1,"span",171),i(2,"Time:"),t(),e(3,"span",172),i(4),g(5,"date"),g(6,"date"),t()()),a&2){let r=h().$implicit;d(4),w("",x(5,2,r.startDateTime,"EEE hh:mm a"),"\xA0 - \xA0",x(6,5,r.endDateTime,"EEE hh:mm a (MMM d)"),"")}}function Q(a,l){if(a&1){let r=L();e(0,"div")(1,"div",158),n(2,"span",159),e(3,"div",160)(4,"div",161)(5,"span",162),i(6),g(7,"date"),t(),n(8,"br"),e(9,"span",163),i(10),g(11,"date"),t()()(),e(12,"div",164)(13,"div",165),i(14),t(),u(15,J,7,8,"div",166)(16,K,7,8,"div",166),e(17,"div",167),i(18,"Venue: "),e(19,"span",168),i(20),t()()(),e(21,"a",169),V("click",function(){let p=k(r).$implicit,v=h();return M(v.viewEvent(p.id))}),i(22,"View"),t()()()}if(a&2){let r=l.$implicit;d(6),f(x(7,6,r.startDateTime,"EEE")),d(4),f(x(11,9,r.startDateTime,"MMM	d")),d(4),f(r.title),d(),C("ngIf",r.isSameDay),d(),C("ngIf",!r.isSameDay),d(4),f(r.location)}}function ee(a,l){if(a&1&&(e(0,"div")(1,"div",136)(2,"span",140),o(),e(3,"svg",141),n(4,"circle",142),t()(),m(),e(5,"div",46)(6,"span",177),i(7,"Start: "),t(),e(8,"span",144),i(9),g(10,"date"),t()()(),e(11,"div",145)(12,"span",146),o(),e(13,"svg",141),n(14,"circle",142),t()(),m(),e(15,"div",46)(16,"span",178),i(17,"Ends: "),t(),e(18,"span",147),i(19),g(20,"date"),t()()()()),a&2){let r=h(2);d(9),y("",x(10,2,r.eventDisplayObj.startDateTime,"EEE hh:mm a, MMM d y")," "),d(10),f(x(20,5,r.eventDisplayObj.endDateTime,"EEE hh:mm a, MMM d y"))}}function te(a,l){if(a&1&&(e(0,"div",136)(1,"span",140),o(),e(2,"svg",141),n(3,"circle",142),t()(),m(),e(4,"div",46)(5,"span",177),i(6,"Time: "),t(),e(7,"span",144),i(8),g(9,"date"),g(10,"date"),t()()()),a&2){let r=h(2);d(8),w("",x(9,2,r.eventDisplayObj.startDateTime,"EEE hh:mm a")," \xA0 - \xA0 ",x(10,5,r.eventDisplayObj.endDateTime,"hh:mm a, MMM d y"),"")}}function ie(a,l){if(a&1){let r=L();e(0,"div",173),V("click",function(){k(r);let s=h();return M(s.closeModal())}),e(1,"div",87)(2,"div",88)(3,"div",120)(4,"div",128)(5,"span",63),o(),e(6,"svg",31),n(7,"rect",93)(8,"rect",94),t()()()(),m(),e(9,"div",129)(10,"div",130)(11,"span",131),o(),e(12,"svg",31),n(13,"path",132)(14,"path",133)(15,"path",134),t()(),m(),e(16,"div",135)(17,"div",136)(18,"span",174),i(19),t(),n(20,"span",138),t(),e(21,"div",139),i(22),t()()(),u(23,ee,21,8,"div",175)(24,te,11,8,"div",176),e(25,"div",148)(26,"span",131),o(),e(27,"svg",31),n(28,"path",149)(29,"path",150),t()(),m(),e(30,"div",151),i(31),t()()()()()()}if(a&2){let r=h();d(19),f(r.eventDisplayObj.title),d(3),f(r.eventDisplayObj.description),d(),C("ngIf",!r.eventDisplayObj.isSameDay),d(),C("ngIf",r.eventDisplayObj.isSameDay),d(7),f(r.eventDisplayObj.location)}}var ne=a=>[a,"result-entry"],ae=a=>[a,"profile"],T=(()=>{let l=class l{constructor(c,s,p,v){this.router=c,this.auth=s,this.sch=p,this.gen=v,this.userName="",this.userImgPath="",this.mobileModal=!1,this.calendarEventList=[],this.isViewModal=!1,this.genk=v,this.userName=s.currentUserValue.name,this.userImgPath=s.currentUserValue.logo,this.adminStatus=s.currentUserValue.status}ngOnInit(){this.genk.topdata="Dashboard",this.getResults(),this.getCalendarEvent()}setImg(c){return c&&c.length>0?this.genk.imgurl+c:this.genk.defaultImg}logout(){this.auth.logout(),this.router.navigate(["/",this.genk.account])}getResults(){this.sch.getStaffByIdOnly().subscribe(c=>{this.staff=c})}profile(){debugger;this.router.navigate(["/student","profile"])}getCalendarEvent(){this.sch.getUpcomingCalendarEvents().subscribe(c=>{this.calendarEventList=c})}viewEvent(c){debugger;this.eventDisplayObj=this.calendarEventList.filter(s=>s.id==Number(c))[0],this.isViewModal=!0}closeModal(){this.isViewModal=!1}};l.\u0275fac=function(s){return new(s||l)(b(F),b(P),b(W),b(A))},l.\u0275cmp=H({type:l,selectors:[["app-dashboard"]],inputs:{header:"header"},decls:263,vars:13,consts:[["id","kt_wrapper",1,"wrapper","d-flex","flex-column","flex-row-fluid"],["id","kt_content",1,"content","d-flex","flex-column","flex-column-fluid"],["id","kt_post",1,"post","d-flex","flex-column-fluid"],["id","kt_content_container",1,"container-xxl"],[1,"row","g-5","g-xl-10"],[1,"col-xl-8","mb-5","mb-xl-5"],[1,"card","mb-xl-7","mb-5","mt-8","mt-xl-0",2,"background","linear-gradient(112.14deg, #00D2FF 0%, #3A7BD5 100%)"],[1,"card-body","d-flex","ps-xl-15"],[1,"m-0"],[1,"text-white","pt-6"],[1,"fs-2qx","fw-bolder"],[1,"position-relative","fs-1x","z-index-2","fw-bolder","text-white","mb-7"],[1,"me-2"],[1,"position-relative","d-inline-block","text-danger"],["href","#",1,"text-white","opacity-75-hover"],[1,"position-absolute","opacity-50","bottom-0","start-0","border-4","border-danger","border-bottom","w-100"],[1,"mb-0"],[1,"btn","btn-danger","fw-bold","me-2"],["src","assets/media/illustrations/sigma-1/17-dark.png","alt","",1,"position-absolute","me-3","bottom-0","end-0","h-200px","d-none","d-sm-block"],[1,"row","g-5","g-xl-8"],[1,"col-xl-6"],[1,"card","bg-dark","hoverable","card-xl-stretch","mb-xl-8",3,"routerLink"],[1,"card-body"],[1,"svg-icon","svg-icon-gray-100","svg-icon-5x","mb-2","ms-n1"],["xmlns","http://www.w3.org/2000/svg","width","32","height","32","viewBox","0 0 24 24","fill","none"],["opacity","0.3","d","M18 21.6C16.3 21.6 15 20.3 15 18.6V2.50001C15 2.20001 14.6 1.99996 14.3 2.19996L13 3.59999L11.7 2.3C11.3 1.9 10.7 1.9 10.3 2.3L9 3.59999L7.70001 2.3C7.30001 1.9 6.69999 1.9 6.29999 2.3L5 3.59999L3.70001 2.3C3.50001 2.1 3 2.20001 3 3.50001V18.6C3 20.3 4.3 21.6 6 21.6H18Z","fill","currentColor"],["d","M12 12.6H11C10.4 12.6 10 12.2 10 11.6C10 11 10.4 10.6 11 10.6H12C12.6 10.6 13 11 13 11.6C13 12.2 12.6 12.6 12 12.6ZM9 11.6C9 11 8.6 10.6 8 10.6H6C5.4 10.6 5 11 5 11.6C5 12.2 5.4 12.6 6 12.6H8C8.6 12.6 9 12.2 9 11.6ZM9 7.59998C9 6.99998 8.6 6.59998 8 6.59998H6C5.4 6.59998 5 6.99998 5 7.59998C5 8.19998 5.4 8.59998 6 8.59998H8C8.6 8.59998 9 8.19998 9 7.59998ZM13 7.59998C13 6.99998 12.6 6.59998 12 6.59998H11C10.4 6.59998 10 6.99998 10 7.59998C10 8.19998 10.4 8.59998 11 8.59998H12C12.6 8.59998 13 8.19998 13 7.59998ZM13 15.6C13 15 12.6 14.6 12 14.6H10C9.4 14.6 9 15 9 15.6C9 16.2 9.4 16.6 10 16.6H12C12.6 16.6 13 16.2 13 15.6Z","fill","currentColor"],["d","M15 18.6C15 20.3 16.3 21.6 18 21.6C19.7 21.6 21 20.3 21 18.6V12.5C21 12.2 20.6 12 20.3 12.2L19 13.6L17.7 12.3C17.3 11.9 16.7 11.9 16.3 12.3L15 13.6V18.6Z","fill","currentColor"],[1,"fw-bold","fs-1","pt-10","text-gray-100"],[1,"card","bg-warning","hoverable","card-xl-stretch","mb-xl-8",3,"routerLink"],[1,"svg-icon","svg-icon-white","svg-icon-5x","ms-n1"],["xmlns","http://www.w3.org/2000/svg","width","24","height","24","viewBox","0 0 24 24","fill","none"],["d","M6.28548 15.0861C7.34369 13.1814 9.35142 12 11.5304 12H12.4696C14.6486 12 16.6563 13.1814 17.7145 15.0861L19.3493 18.0287C20.0899 19.3618 19.1259 21 17.601 21H6.39903C4.87406 21 3.91012 19.3618 4.65071 18.0287L6.28548 15.0861Z","fill","currentColor"],["opacity","0.3","x","8","y","3","width","8","height","8","rx","4","fill","currentColor"],[1,"fw-bold","fs-1","pt-10","text-white"],[1,"col-xl-4"],[1,"card","mb-5","mb-xl-8"],[1,"card-body","pt-15"],[1,"d-flex","flex-center","flex-column","mb-5"],[1,"symbol","symbol-150px","symbol-circle","mb-7"],["alt","user",2,"object-fit","cover",3,"src"],["href","#",1,"fs-3","text-gray-800","text-hover-primary","fw-bold","mb-1"],[1,"badge","badge-light-info","d-inline"],[1,"pb-1","fs-6"],[1,"fw-bold","mt-5"],[1,"text-gray-600"],[1,"fs-6"],[1,"row","gy-5","g-xl-8"],[1,"card","card-xl-stretch","mb-xl-8"],[1,"card-header","border-0"],[1,"card-title","fw-bolder","text-dark"],[1,"card-toolbar"],["type","button","data-kt-menu-trigger","click","data-kt-menu-placement","bottom-end",1,"btn","btn-sm","btn-icon","btn-color-primary","btn-active-light-primary"],[1,"svg-icon","svg-icon-2"],["xmlns","http://www.w3.org/2000/svg","width","24px","height","24px","viewBox","0 0 24 24"],["stroke","none","stroke-width","1","fill","none","fill-rule","evenodd"],["x","5","y","5","width","5","height","5","rx","1","fill","currentColor"],["x","14","y","5","width","5","height","5","rx","1","fill","currentColor","opacity","0.3"],["x","5","y","14","width","5","height","5","rx","1","fill","currentColor","opacity","0.3"],["x","14","y","14","width","5","height","5","rx","1","fill","currentColor","opacity","0.3"],[1,"card-body","pt-0"],[1,"d-flex","align-items-center","bg-light-info","rounded","p-5","mb-7"],[1,"svg-icon","svg-icon-warning","me-5"],[1,"svg-icon","svg-icon-1"],["opacity","0.3","d","M21.25 18.525L13.05 21.825C12.35 22.125 11.65 22.125 10.95 21.825L2.75 18.525C1.75 18.125 1.75 16.725 2.75 16.325L4.04999 15.825L10.25 18.325C10.85 18.525 11.45 18.625 12.05 18.625C12.65 18.625 13.25 18.525 13.85 18.325L20.05 15.825L21.35 16.325C22.35 16.725 22.35 18.125 21.25 18.525ZM13.05 16.425L21.25 13.125C22.25 12.725 22.25 11.325 21.25 10.925L13.05 7.62502C12.35 7.32502 11.65 7.32502 10.95 7.62502L2.75 10.925C1.75 11.325 1.75 12.725 2.75 13.125L10.95 16.425C11.65 16.725 12.45 16.725 13.05 16.425Z","fill","currentColor"],["d","M11.05 11.025L2.84998 7.725C1.84998 7.325 1.84998 5.925 2.84998 5.525L11.05 2.225C11.75 1.925 12.45 1.925 13.15 2.225L21.35 5.525C22.35 5.925 22.35 7.325 21.35 7.725L13.05 11.025C12.45 11.325 11.65 11.325 11.05 11.025Z","fill","currentColor"],[1,"flex-grow-1","me-2"],["href","#",1,"fw-bolder","text-gray-800","text-hover-info","fs-6"],[1,"text-muted","fw-bold","d-block"],[1,"svg-icon","svg-icon-success","me-5"],[1,"svg-icon","svg-icon-danger","me-5"],[1,"d-flex","align-items-center","bg-light-info","rounded","p-5"],[1,"svg-icon","svg-icon-info","me-5"],[1,"col-xl-8","mb-xl-10"],[1,"card","h-md-100"],[1,"card-header","border-0","pt-5"],[1,"card-title","align-items-start","flex-column"],[1,"card-label","fw-bolder","text-dark"],[1,"text-muted","mt-1","fw-bold","fs-7"],[1,"card-body","pt-7","px-0"],[1,"tab-content","mb-2","px-9"],["id","kt_timeline_widget_3_tab_content_1",1,"tab-pane","fade","show","active"],[4,"ngFor","ngForOf"],[1,"float-end","d-none"],["href","#","data-bs-toggle","modal","data-bs-target","#kt_modal_create_project",1,"btn","btn-sm","btn-light","me-2"],["href","#","data-bs-toggle","modal","data-bs-target","#kt_modal_create_app",1,"btn","btn-sm","btn-danger"],["id","kt_modal_add_event","tabindex","-1","aria-hidden","true",1,"modal","fade"],[1,"modal-dialog","modal-dialog-centered","mw-650px"],[1,"modal-content"],["action","#","id","kt_modal_add_event_form",1,"form"],[1,"modal-header"],["data-kt-calendar","title",1,"fw-bolder"],["id","kt_modal_add_event_close",1,"btn","btn-icon","btn-sm","btn-active-icon-primary"],["opacity","0.5","x","6","y","17.3137","width","16","height","2","rx","1","transform","rotate(-45 6 17.3137)","fill","currentColor"],["x","7.41422","y","6","width","16","height","2","rx","1","transform","rotate(45 7.41422 6)","fill","currentColor"],[1,"modal-body","py-10","px-lg-17"],[1,"fv-row","mb-9"],[1,"fs-6","fw-bold","required","mb-2"],["type","text","placeholder","","name","calendar_event_name",1,"form-control","form-control-solid"],[1,"fs-6","fw-bold","mb-2"],["type","text","placeholder","","name","calendar_event_description",1,"form-control","form-control-solid"],["type","text","placeholder","","name","calendar_event_location",1,"form-control","form-control-solid"],[1,"form-check","form-check-custom","form-check-solid"],["type","checkbox","value","","id","kt_calendar_datepicker_allday",1,"form-check-input"],["for","kt_calendar_datepicker_allday",1,"form-check-label","fw-bold"],[1,"row","row-cols-lg-2","g-10"],[1,"col"],[1,"fs-6","fw-bold","mb-2","required"],["name","calendar_event_start_date","placeholder","Pick a start date","id","kt_calendar_datepicker_start_date",1,"form-control","form-control-solid"],["data-kt-calendar","datepicker",1,"col"],["name","calendar_event_start_time","placeholder","Pick a start time","id","kt_calendar_datepicker_start_time",1,"form-control","form-control-solid"],["name","calendar_event_end_date","placeholder","Pick a end date","id","kt_calendar_datepicker_end_date",1,"form-control","form-control-solid"],["name","calendar_event_end_time","placeholder","Pick a end time","id","kt_calendar_datepicker_end_time",1,"form-control","form-control-solid"],[1,"modal-footer","flex-center"],["type","reset","id","kt_modal_add_event_cancel",1,"btn","btn-light","me-3"],["type","button","id","kt_modal_add_event_submit",1,"btn","btn-primary"],[1,"indicator-label"],[1,"indicator-progress"],[1,"spinner-border","spinner-border-sm","align-middle","ms-2"],["id","kt_modal_view_event","tabindex","-1","aria-hidden","true",1,"modal","fade"],[1,"modal-header","border-0","justify-content-end"],["data-bs-toggle","tooltip","data-bs-dismiss","click","title","Edit Event","id","kt_modal_view_event_edit",1,"btn","btn-icon","btn-sm","btn-color-gray-400","btn-active-icon-primary","me-2"],["opacity","0.3","d","M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z","fill","currentColor"],["d","M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z","fill","currentColor"],["data-bs-toggle","tooltip","data-bs-dismiss","click","title","Delete Event","id","kt_modal_view_event_delete",1,"btn","btn-icon","btn-sm","btn-color-gray-400","btn-active-icon-danger","me-2"],["d","M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z","fill","currentColor"],["opacity","0.5","d","M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z","fill","currentColor"],["opacity","0.5","d","M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z","fill","currentColor"],["data-bs-toggle","tooltip","title","Hide Event","data-bs-dismiss","modal",1,"btn","btn-icon","btn-sm","btn-color-gray-500","btn-active-icon-primary"],[1,"modal-body","pt-0","pb-20","px-lg-17"],[1,"d-flex"],[1,"svg-icon","svg-icon-1","svg-icon-muted","me-5"],["opacity","0.3","d","M21 22H3C2.4 22 2 21.6 2 21V5C2 4.4 2.4 4 3 4H21C21.6 4 22 4.4 22 5V21C22 21.6 21.6 22 21 22Z","fill","currentColor"],["d","M6 6C5.4 6 5 5.6 5 5V3C5 2.4 5.4 2 6 2C6.6 2 7 2.4 7 3V5C7 5.6 6.6 6 6 6ZM11 5V3C11 2.4 10.6 2 10 2C9.4 2 9 2.4 9 3V5C9 5.6 9.4 6 10 6C10.6 6 11 5.6 11 5ZM15 5V3C15 2.4 14.6 2 14 2C13.4 2 13 2.4 13 3V5C13 5.6 13.4 6 14 6C14.6 6 15 5.6 15 5ZM19 5V3C19 2.4 18.6 2 18 2C17.4 2 17 2.4 17 3V5C17 5.6 17.4 6 18 6C18.6 6 19 5.6 19 5Z","fill","currentColor"],["d","M8.8 13.1C9.2 13.1 9.5 13 9.7 12.8C9.9 12.6 10.1 12.3 10.1 11.9C10.1 11.6 10 11.3 9.8 11.1C9.6 10.9 9.3 10.8 9 10.8C8.8 10.8 8.59999 10.8 8.39999 10.9C8.19999 11 8.1 11.1 8 11.2C7.9 11.3 7.8 11.4 7.7 11.6C7.6 11.8 7.5 11.9 7.5 12.1C7.5 12.2 7.4 12.2 7.3 12.3C7.2 12.4 7.09999 12.4 6.89999 12.4C6.69999 12.4 6.6 12.3 6.5 12.2C6.4 12.1 6.3 11.9 6.3 11.7C6.3 11.5 6.4 11.3 6.5 11.1C6.6 10.9 6.8 10.7 7 10.5C7.2 10.3 7.49999 10.1 7.89999 10C8.29999 9.90003 8.60001 9.80003 9.10001 9.80003C9.50001 9.80003 9.80001 9.90003 10.1 10C10.4 10.1 10.7 10.3 10.9 10.4C11.1 10.5 11.3 10.8 11.4 11.1C11.5 11.4 11.6 11.6 11.6 11.9C11.6 12.3 11.5 12.6 11.3 12.9C11.1 13.2 10.9 13.5 10.6 13.7C10.9 13.9 11.2 14.1 11.4 14.3C11.6 14.5 11.8 14.7 11.9 15C12 15.3 12.1 15.5 12.1 15.8C12.1 16.2 12 16.5 11.9 16.8C11.8 17.1 11.5 17.4 11.3 17.7C11.1 18 10.7 18.2 10.3 18.3C9.9 18.4 9.5 18.5 9 18.5C8.5 18.5 8.1 18.4 7.7 18.2C7.3 18 7 17.8 6.8 17.6C6.6 17.4 6.4 17.1 6.3 16.8C6.2 16.5 6.10001 16.3 6.10001 16.1C6.10001 15.9 6.2 15.7 6.3 15.6C6.4 15.5 6.6 15.4 6.8 15.4C6.9 15.4 7.00001 15.4 7.10001 15.5C7.20001 15.6 7.3 15.6 7.3 15.7C7.5 16.2 7.7 16.6 8 16.9C8.3 17.2 8.6 17.3 9 17.3C9.2 17.3 9.5 17.2 9.7 17.1C9.9 17 10.1 16.8 10.3 16.6C10.5 16.4 10.5 16.1 10.5 15.8C10.5 15.3 10.4 15 10.1 14.7C9.80001 14.4 9.50001 14.3 9.10001 14.3C9.00001 14.3 8.9 14.3 8.7 14.3C8.5 14.3 8.39999 14.3 8.39999 14.3C8.19999 14.3 7.99999 14.2 7.89999 14.1C7.79999 14 7.7 13.8 7.7 13.7C7.7 13.5 7.79999 13.4 7.89999 13.2C7.99999 13 8.2 13 8.5 13H8.8V13.1ZM15.3 17.5V12.2C14.3 13 13.6 13.3 13.3 13.3C13.1 13.3 13 13.2 12.9 13.1C12.8 13 12.7 12.8 12.7 12.6C12.7 12.4 12.8 12.3 12.9 12.2C13 12.1 13.2 12 13.6 11.8C14.1 11.6 14.5 11.3 14.7 11.1C14.9 10.9 15.2 10.6 15.5 10.3C15.8 10 15.9 9.80003 15.9 9.70003C15.9 9.60003 16.1 9.60004 16.3 9.60004C16.5 9.60004 16.7 9.70003 16.8 9.80003C16.9 9.90003 17 10.2 17 10.5V17.2C17 18 16.7 18.4 16.2 18.4C16 18.4 15.8 18.3 15.6 18.2C15.4 18.1 15.3 17.8 15.3 17.5Z","fill","currentColor"],[1,"mb-9"],[1,"d-flex","align-items-center","mb-2"],["data-kt-calendar","event_name",1,"fs-3","fw-bolder","me-3"],["data-kt-calendar","all_day",1,"badge","badge-light-success"],["data-kt-calendar","event_description",1,"fs-6"],[1,"svg-icon","svg-icon-1","svg-icon-success","me-5"],["xmlns","http://www.w3.org/2000/svg","width","24px","height","24px","viewBox","0 0 24 24","version","1.1"],["fill","currentColor","cx","12","cy","12","r","8"],[1,"fw-bolder"],["data-kt-calendar","event_start_date"],[1,"d-flex","align-items-center","mb-9"],[1,"svg-icon","svg-icon-1","svg-icon-danger","me-5"],["data-kt-calendar","event_end_date"],[1,"d-flex","align-items-center"],["opacity","0.3","d","M18.0624 15.3453L13.1624 20.7453C12.5624 21.4453 11.5624 21.4453 10.9624 20.7453L6.06242 15.3453C4.56242 13.6453 3.76242 11.4453 4.06242 8.94534C4.56242 5.34534 7.46242 2.44534 11.0624 2.04534C15.8624 1.54534 19.9624 5.24534 19.9624 9.94534C20.0624 12.0453 19.2624 13.9453 18.0624 15.3453Z","fill","currentColor"],["d","M12.0624 13.0453C13.7193 13.0453 15.0624 11.7022 15.0624 10.0453C15.0624 8.38849 13.7193 7.04535 12.0624 7.04535C10.4056 7.04535 9.06241 8.38849 9.06241 10.0453C9.06241 11.7022 10.4056 13.0453 12.0624 13.0453Z","fill","currentColor"],["data-kt-calendar","event_location",1,"fs-6"],["id","kt_footer",1,"footer","py-4","d-flex","flex-lg-column"],[1,"container-fluid","d-flex","flex-column","flex-md-row","align-items-center","justify-content-between"],[1,"text-dark","order-2","order-md-1"],[1,"text-muted","fw-bold","me-1"],["href","#","target","_blank",1,"text-gray-800","text-hover-primary"],["class","modale",3,"click",4,"ngIf"],[1,"d-flex","align-items-center","mb-9",2,"font-family","'Poppins'"],["data-kt-element","bullet",1,"bullet","bullet-vertical","d-flex","align-items-center","min-h-70px","mh-100","me-4","bg-success"],[2,"margin-right","15px","background-color","dodgerblue","color","white","width","70px","height","70px","border-radius","100%","display","flex","justify-content","center","align-items","center"],[2,"text-align","center"],[2,"font-weight","500","font-size","18px"],[2,"font-weight","700","font-size","12px"],[1,"flex-grow-1","me-5"],[1,"text-black-500","fw-bold","fs-2"],["class","fw-bold fs-4","style","color: #3A7BD5;",4,"ngIf"],[1,"text-gray-600","fw-bolder","fs-7"],["href","#",1,"text-grey","opacity-85-hover","fw-bold"],["data-bs-toggle","modal","data-bs-target","#kt_modal_create_project",1,"btn","btn-sm","btn-light",3,"click"],[1,"fw-bold","fs-4",2,"color","#3A7BD5"],[2,"font-weight","600","margin-right","8px"],[1,"fw-bold","fs-4"],[1,"modale",3,"click"],["data-kt-calendar","event_name",1,"fs-2","fw-bolder","me-3"],[4,"ngIf"],["class","d-flex align-items-center mb-2",4,"ngIf"],[1,"fw-bolder",2,"padding-right","15px"],[1,"fw-bolder",2,"padding-right","20px"]],template:function(s,p){if(s&1&&(e(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"div",4)(5,"div",5)(6,"div",6)(7,"div",7)(8,"div",8)(9,"div",9)(10,"span",10),i(11),t()(),e(12,"div",11)(13,"span",12),i(14,"You have got "),e(15,"span",13)(16,"a",14),i(17,"4 New Notifications"),t(),n(18,"span",15),t()()(),e(19,"div",16)(20,"a",17),i(21,"View Profile"),t()()(),n(22,"img",18),t()(),e(23,"div",19)(24,"div",20)(25,"a",21)(26,"div",22)(27,"span",23),o(),e(28,"svg",24),n(29,"path",25)(30,"path",26)(31,"path",27),t()(),m(),e(32,"div",28),i(33,"Results Entry"),t()()()(),e(34,"div",20)(35,"a",29)(36,"div",22)(37,"span",30),o(),e(38,"svg",31),n(39,"path",32)(40,"rect",33),t()(),m(),e(41,"div",34),i(42,"Profile"),t()()()()()(),e(43,"div",35)(44,"div",36)(45,"div",37)(46,"div",38)(47,"div",39),n(48,"img",40),t(),e(49,"a",41),i(50),t(),e(51,"div",42),i(52),t()(),e(53,"div",43)(54,"div",44),i(55,"Staff ID"),t(),e(56,"div",45),i(57),t()(),e(58,"div",46)(59,"div",44),i(60,"Department"),t(),e(61,"div",45),i(62,"Teacher"),t()()()()()(),e(63,"div",47)(64,"div",35)(65,"div",48)(66,"div",49)(67,"h3",50),i(68,"Notice Board"),t(),e(69,"div",51)(70,"button",52)(71,"span",53),o(),e(72,"svg",54)(73,"g",55),n(74,"rect",56)(75,"rect",57)(76,"rect",58)(77,"rect",59),t()()()()()(),m(),e(78,"div",60)(79,"div",61)(80,"span",62)(81,"span",63),o(),e(82,"svg",31),n(83,"path",64)(84,"path",65),t()()(),m(),e(85,"div",66)(86,"a",67),i(87,"Course Registration Deadline"),t(),e(88,"span",68),i(89,"Posted 2 Days ago"),t()()(),e(90,"div",61)(91,"span",69)(92,"span",63),o(),e(93,"svg",31),n(94,"path",64)(95,"path",65),t()()(),m(),e(96,"div",66)(97,"a",67),i(98,"Complete your payment"),t(),e(99,"span",68),i(100,"Posted 22 Mar, 2024"),t()()(),e(101,"div",61)(102,"span",70)(103,"span",63),o(),e(104,"svg",31),n(105,"path",64)(106,"path",65),t()()(),m(),e(107,"div",66)(108,"a",67),i(109,"School Fees Deadline"),t(),e(110,"span",68),i(111,"Posted 1 Feb, 2024"),t()()(),e(112,"div",71)(113,"span",72)(114,"span",63),o(),e(115,"svg",31),n(116,"path",64)(117,"path",65),t()()(),m(),e(118,"div",66)(119,"a",67),i(120,"Exam Registration"),t(),e(121,"span",68),i(122,"Posted 22 Mar, 2022"),t()()()()()(),e(123,"div",73)(124,"div",74)(125,"div",75)(126,"h3",76)(127,"span",77),i(128,"Upcoming School Events"),t(),e(129,"span",78),i(130,"Upcoming Events"),t()()(),e(131,"div",79)(132,"div",80)(133,"div",81),u(134,Q,23,12,"div",82),t()(),e(135,"div",83)(136,"a",84),i(137,"Add Lesson"),t(),e(138,"a",85),i(139,"Call Sick for Today"),t()()()()()(),e(140,"div",86)(141,"div",87)(142,"div",88)(143,"form",89)(144,"div",90)(145,"h2",91),i(146,"Add Event"),t(),e(147,"div",92)(148,"span",63),o(),e(149,"svg",31),n(150,"rect",93)(151,"rect",94),t()()()(),m(),e(152,"div",95)(153,"div",96)(154,"label",97),i(155,"Event Name"),t(),n(156,"input",98),t(),e(157,"div",96)(158,"label",99),i(159,"Event Description"),t(),n(160,"input",100),t(),e(161,"div",96)(162,"label",99),i(163,"Event Location"),t(),n(164,"input",101),t(),e(165,"div",96)(166,"label",102),n(167,"input",103),e(168,"span",104),i(169,"All Day"),t()()(),e(170,"div",105)(171,"div",106)(172,"div",96)(173,"label",107),i(174,"Event Start Date"),t(),n(175,"input",108),t()(),e(176,"div",109)(177,"div",96)(178,"label",99),i(179,"Event Start Time"),t(),n(180,"input",110),t()()(),e(181,"div",105)(182,"div",106)(183,"div",96)(184,"label",107),i(185,"Event End Date"),t(),n(186,"input",111),t()(),e(187,"div",109)(188,"div",96)(189,"label",99),i(190,"Event End Time"),t(),n(191,"input",112),t()()()(),e(192,"div",113)(193,"button",114),i(194,"Cancel"),t(),e(195,"button",115)(196,"span",116),i(197,"Submit"),t(),e(198,"span",117),i(199,"Please wait... "),n(200,"span",118),t()()()()()()(),e(201,"div",119)(202,"div",87)(203,"div",88)(204,"div",120)(205,"div",121)(206,"span",53),o(),e(207,"svg",31),n(208,"path",122)(209,"path",123),t()()(),m(),e(210,"div",124)(211,"span",53),o(),e(212,"svg",31),n(213,"path",125)(214,"path",126)(215,"path",127),t()()(),m(),e(216,"div",128)(217,"span",63),o(),e(218,"svg",31),n(219,"rect",93)(220,"rect",94),t()()()(),m(),e(221,"div",129)(222,"div",130)(223,"span",131),o(),e(224,"svg",31),n(225,"path",132)(226,"path",133)(227,"path",134),t()(),m(),e(228,"div",135)(229,"div",136),n(230,"span",137)(231,"span",138),t(),n(232,"div",139),t()(),e(233,"div",136)(234,"span",140),o(),e(235,"svg",141),n(236,"circle",142),t()(),m(),e(237,"div",46)(238,"span",143),i(239,"Starts"),t(),n(240,"span",144),t()(),e(241,"div",145)(242,"span",146),o(),e(243,"svg",141),n(244,"circle",142),t()(),m(),e(245,"div",46)(246,"span",143),i(247,"Ends"),t(),n(248,"span",147),t()(),e(249,"div",148)(250,"span",131),o(),e(251,"svg",31),n(252,"path",149)(253,"path",150),t()(),m(),n(254,"div",151),t()()()()()()()(),e(255,"div",152)(256,"div",153)(257,"div",154)(258,"span",155),i(259,"2022\xA9"),t(),e(260,"a",156),i(261,"GradeX-cloud"),t()()()()(),u(262,ie,32,5,"div",157)),s&2){let v;d(11),y("Welcome Back ",p.staff==null?null:p.staff.surname,"\u{1F44B}\u{1F3FE} "),d(14),C("routerLink",D(9,ne,"/staff")),d(10),C("routerLink",D(11,ae,"/staff")),d(13),C("src",p.genk.setImgRemote(p.staff==null?null:p.staff.photo),I),d(2),y(" ",(((v=p.staff.surname)!==null&&v!==void 0?v:"")+" "+((v=p.staff.otherNames)!==null&&v!==void 0?v:"")).trim(),""),d(2),f(p.staff.gender),d(5),f(p.staff.idCardNo),d(77),C("ngForOf",p.calendarEventList),d(128),C("ngIf",p.isViewModal)}},dependencies:[Z,j,z,R,U,O,G],styles:[".modale[_ngcontent-%COMP%]{display:block;position:fixed;z-index:6;width:100%;height:100%;top:0;left:0;overflow:auto;align-items:center;background-color:#0000004d}"]});let a=l;return a})();var le=[{path:"",component:T},{path:"dashboard",component:T}],Y=(()=>{let l=class l{};l.\u0275fac=function(s){return new(s||l)},l.\u0275mod=_({type:l}),l.\u0275inj=E({imports:[S.forChild(le),S]});let a=l;return a})();var _e=(()=>{let l=class l{};l.\u0275fac=function(s){return new(s||l)},l.\u0275mod=_({type:l}),l.\u0275inj=E({imports:[B,$,q,N,S,Y]});let a=l;return a})();export{_e as StaffDashboardModule};
