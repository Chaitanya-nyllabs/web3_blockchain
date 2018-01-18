import {Component} from '@angular/core';
import {SolContractService} from '../sol-contract.service';


@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
})
export class OwnerComponent {
  request: any = '';
  owner: string;
  user: any;
  nylId: string;
  nameOfThePerson: string;
  sendingAmount: number;
  fromValue: number;
  toValue: number;

  constructor(private contractService: SolContractService) {
  }

  getOwner() {
    this.contractService.getOwner().then((result) => {
      this.owner = result;
    });
  }

  getUser(id: number) {
    this.contractService.viewUser(id).then(user => {
      console.log(user);
      this.user = user;
    });
  }

  setUser() {
    const name = this.nameOfThePerson;
    const id = this.nylId;
    return this.contractService.registerNewUser(id, name).then(res => {
      console.log(res);
      return res;
    });
  }

  makeRequest() {
    return this.contractService.makeRequest('123', this.sendingAmount, this.fromValue, this.toValue).then(res => {
      console.log(res);
      return res;
    });
  }

  approveNYL() {
    return this.contractService.approveRequestByNYL(1, true).then(() => {
      return true;
    });
  }

  approveFid() {
    return this.contractService.approveRequestByFidelity(1, true).then(() => {
      return true;
    });
  }
}
