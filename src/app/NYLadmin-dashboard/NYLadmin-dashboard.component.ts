import { Component, OnInit } from '@angular/core';
import {SolContractService} from '../sol-contract.service';


@Component({
  selector: 'app-nyl-admin-dashboard',
  templateUrl: './NYLadmin-dashboard.component.html',
  styleUrls: ['./NYLadmin-dashboard.component.css']
})
export class NYLAdminDashboardComponent {
  requestArray: any[] = [];

  constructor(private contractService: SolContractService) {
  }
  approveNYL(requestId) {
    return this.contractService.approveRequestByNYL(requestId, true).then(() => {
      return true;
    });
  }

  approveFid() {
    return this.contractService.approveRequestByFidelity(1, true).then(() => {
      return true;
    });
  }

  viewAllRequests() {
    return this.contractService.viewAllRequests().then((result)=>{
      this.requestArray = result;
    });
  }

}
