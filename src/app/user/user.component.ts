import {Component, HostListener, NgZone} from '@angular/core';
import {SolContractService} from '../sol-contract.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  title = 'app';
  userArray: any[] = [];
  nameOfThePerson: string;
  nylId: string;

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
      this.viewAllUsers()
    );
  }

  viewAllUsers() {
    return this.contractService.viewAllUsers().then((result) => {
      this.userArray = [];
      console.log('****', result);
      this.userArray = result;
    });
  }

  setUser() {
    const name = this.nameOfThePerson;
    const id = this.nylId;
    return this.contractService.registerNewUser(id, name).then(res => {
      console.log(res);
      this.viewAllUsers();
      return res;
    });
  }

}

