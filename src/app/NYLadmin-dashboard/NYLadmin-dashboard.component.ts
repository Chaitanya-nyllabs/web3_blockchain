import {Component, NgZone} from '@angular/core';
import {SolContractService} from '../sol-contract.service';


@Component({
  selector: 'app-nyl-admin-dashboard',
  templateUrl: './NYLadmin-dashboard.component.html',
  styleUrls: ['./NYLadmin-dashboard.component.css']
})
export class NYLAdminDashboardComponent {
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

  approveNYL(requestId) {
    return this.contractService.approveRequestByNYL(requestId, true).then(() => {
      this.viewAllRequests();
      return true;
    });
  }

  viewAllRequests() {
    return this.contractService.viewAllRequests().then((result)=>{
      this.requestArray = result;
    });
  }

}
