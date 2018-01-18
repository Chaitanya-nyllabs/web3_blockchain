import {Component, HostListener, NgZone, OnInit} from '@angular/core';
import {SolContractService} from '../sol-contract.service';


@Component({
  selector: 'app-fidadmin-dashboard',
  templateUrl: './fidadmin-dashboard.component.html',
  styleUrls: ['./fidadmin-dashboard.component.css']
})
export class FidadminDashboardComponent implements OnInit {
  ngOnInit(): void {
    //this.viewAllRequests();
    console.log('OnInit');
  }

  requestArray: any[] = [];
  constructor(private _ngZone: NgZone, public contractService: SolContractService) {
  }

  @HostListener('window:load')
  windowLoaded() {
  this.doSomething();
  }

  doSomething= () =>{
    this._ngZone.run(() =>
      this.viewAllRequests();
    );
  }

  // constructor(private contractService: SolContractService) {
  //   this.viewAllRequests();
  //
  // }

  approveFid(requestId) {
    return this.contractService.approveRequestByFidelity(requestId, true).then(() => {
      return true;
    });
  }

  viewAllRequests() {
    return this.contractService.viewAllRequests().then((result)=>{
      this.requestArray = result;
    });
  }

}
