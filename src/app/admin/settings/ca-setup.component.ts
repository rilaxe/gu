import { Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, GenericService } from '../../services';
import { CaSetup } from '../../_models/settings';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { SchoolService } from '../../services/school.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './ca-setup.component.html',
  styleUrls: ['./settings.component.css']
})
export class CASetupComponent implements OnInit {
  @Input() header: string;
  genk: GenericService;
  userName: string = '';
  userImgPath: string = '';
  adminStatus: string;
  mobileModal = false;
  CA1Jun = new CaSetup();
  CA2Jun = new CaSetup();
  CA3Jun = new CaSetup();
  CA4Jun = new CaSetup();
  CA5Jun = new CaSetup();
  CA6Jun = new CaSetup();
  CA7Jun = new CaSetup();
  CA8Jun = new CaSetup();
  CA9Jun = new CaSetup();
  examJun = new CaSetup();

  CA1Sen = new CaSetup();
  CA2Sen = new CaSetup();
  CA3Sen = new CaSetup();
  CA4Sen = new CaSetup();
  CA5Sen = new CaSetup();
  CA6Sen = new CaSetup();
  CA7Sen = new CaSetup();
  CA8Sen = new CaSetup();
  CA9Sen = new CaSetup();
  CA10Sen = new CaSetup();
  CA11Sen = new CaSetup();
  CA12Sen = new CaSetup();
  CA13Sen = new CaSetup();
  CA14Sen = new CaSetup();
  CA15Sen = new CaSetup();
  examSen = new CaSetup();
  examScore: number;
  destroy = new Subject;
  caData: any[];
  juniorSetupList = [];
  seniorSetupList = [];
  levelCategory: string;

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
  this.genk.topdata = 'CA Setup';
  this.levelCategory = 'JUNIOR';
  this.getCaSetup();
  //this.getCaSetup();
}

getCaSetup() {
  this.sch.getCASetup(this.levelCategory)
  .subscribe(res => {
    this.caData = res;

    this.juniorSetupList = this.caData.filter(t => t.class.toLowerCase() == this.levelCategory.toLowerCase());
    //this.seniorSetupList = this.caData.filter(t => t.class.toLowerCase() == 'senior');
    // this.CA1Jun = this.checkIsEmpty(this.seniorSetupList.filter(t => t.systemName == 'CA1'));
    // this.CA2Jun = this.checkIsEmpty(this.seniorSetupList.filter(t => t.systemName == 'CA2'));
    // this.CA3Jun = this.checkIsEmpty(this.seniorSetupList.filter(t => t.systemName == 'CA3'));
    // this.CA4Jun = this.checkIsEmpty(this.seniorSetupList.filter(t => t.systemName == 'CA4'));
    // this.CA5Jun = this.checkIsEmpty(this.seniorSetupList.filter(t => t.systemName == 'CA5'));
    // this.CA6Jun = this.checkIsEmpty(this.seniorSetupList.filter(t => t.systemName == 'CA6'));
    // this.CA7Jun = this.checkIsEmpty(this.seniorSetupList.filter(t => t.systemName == 'CA7'));
    // this.CA8Jun = this.checkIsEmpty(this.seniorSetupList.filter(t => t.systemName == 'CA8'));
    // this.CA9Jun = this.checkIsEmpty(this.seniorSetupList.filter(t => t.systemName == 'CA9'));
    // this.examJun= this.checkIsEmpty(this.seniorSetupList.filter(t => t.systemName == 'exam'));

    this.CA1Sen = this.checkIsEmpty(this.juniorSetupList.filter(t => t.systemName == 'CA1'));
    this.CA2Sen = this.checkIsEmpty(this.juniorSetupList.filter(t => t.systemName == 'CA2'));
    this.CA3Sen = this.checkIsEmpty(this.juniorSetupList.filter(t => t.systemName == 'CA3'));
    this.CA4Sen = this.checkIsEmpty(this.juniorSetupList.filter(t => t.systemName == 'CA4'));
    this.CA5Sen = this.checkIsEmpty(this.juniorSetupList.filter(t => t.systemName == 'CA5'));
    this.CA6Sen = this.checkIsEmpty(this.juniorSetupList.filter(t => t.systemName == 'CA6'));
    this.CA7Sen = this.checkIsEmpty(this.juniorSetupList.filter(t => t.systemName == 'CA7'));
    this.CA8Sen = this.checkIsEmpty(this.juniorSetupList.filter(t => t.systemName == 'CA8'));
    this.CA9Sen = this.checkIsEmpty(this.juniorSetupList.filter(t => t.systemName == 'CA9'));
    this.CA10Sen = this.checkIsEmpty(this.juniorSetupList.filter(t => t.systemName == 'CA10'));
    this.CA11Sen = this.checkIsEmpty(this.juniorSetupList.filter(t => t.systemName == 'CA11'));
    this.CA12Sen = this.checkIsEmpty(this.juniorSetupList.filter(t => t.systemName == 'CA12'));
    this.CA13Sen = this.checkIsEmpty(this.juniorSetupList.filter(t => t.systemName == 'CA13'));
    this.CA14Sen = this.checkIsEmpty(this.juniorSetupList.filter(t => t.systemName == 'CA14'));
    this.CA15Sen = this.checkIsEmpty(this.juniorSetupList.filter(t => t.systemName == 'CA15'));
    this.examSen= this.checkIsEmpty(this.juniorSetupList.filter(t => t.systemName.toLowerCase() == 'exam'));
  });
}

setCategory(value: string) {
    this.levelCategory = value;
    this.getCaSetup();
}

onExam(ca: CaSetup, value: number) {
  ca.status = 'Enabled';
  ca.systemName = 'Exam';
  ca.actualName = 'Exam';
  ca.Class = this.levelCategory;
  ca.maxScore = value;
}

onSelect(state:boolean, ca: CaSetup, value: string) {
    ca.status = state ? 'Enabled' : 'Disabled';
    ca.systemName = value;
    ca.Class = this.levelCategory;
    console.log("Is Checked? ", state);
}

checkEnabled(ca: CaSetup) {
  ca.state = ca.status == 'Disabled' ? false : true;
  return ca;
}

checkIsEmpty(ca: CaSetup[]) {
  if (ca.length > 0) {
    return this.checkEnabled(ca[0]);
  } else {
    return new CaSetup();
  }
 
}

  saveData() {
   
    let newlist = [];
    let calist = [];
    if (this.levelCategory) {
      calist = [this.CA1Sen, this.CA2Sen, this.CA3Sen, this.CA4Sen, this.CA5Sen, this.CA6Sen, this.CA7Sen, this.CA8Sen, this.CA9Sen, this.CA10Sen, this.CA11Sen, this.CA12Sen, this.CA13Sen, this.CA14Sen, this.CA15Sen, this.examSen];
      debugger;
      calist.forEach(t => {
        if (t.systemName) {
          t.maxScore = Number(t.maxScore);
          newlist.push(t);
        }
      })
      this.sch.saveCaSetup(newlist, this.levelCategory)
        .pipe(takeUntil(this.destroy))
        .subscribe(res => {
          this.getCaSetup();
          Swal.fire({
            icon: 'success',
            title: 'CA-Setup saved successfully!.',
            showConfirmButton: false,
            timer: 2000
          });
        });
    }
  }

}
