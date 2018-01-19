import {Component, HostListener, NgZone, OnInit} from '@angular/core';
import {SolContractService} from '../sol-contract.service';


@Component({
  selector: 'app-fidadmin-dashboard',
  templateUrl: './fidadmin-dashboard.component.html',
  styleUrls: ['./fidadmin-dashboard.component.css']
})
export class FidadminDashboardComponent {

  requestArray: any[] = [];
  constructor(private _ngZone: NgZone, public contractService: SolContractService) {
    this.contractService.contractInitialized$.subscribe(didInit => {
      console.log('****', didInit)
      if (didInit) {
          this.doSomething();
      }
    });
  }
  doSomething= () => {
    this._ngZone.run(() =>
      this.viewAllRequests()
    );
  }


  approveFid(requestId) {
    return this.contractService.approveRequestByFidelity(requestId, true).then(() => {
      this.viewAllRequests();
      return true;
    });
  }

  viewAllRequests() {
    return this.contractService.viewAllRequests().then((result) => {
      this.requestArray = [];
      console.log('****', result);
      this.requestArray = result;
    });
  }

}
