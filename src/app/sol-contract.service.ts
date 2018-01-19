import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
const Web3 = require('web3');
const contract = require('truffle-contract');
const artifacts = require('../../build/contracts/someSeriousStuff.json');


declare var window: any;

@Injectable()
export class SolContractService {
  web3: any;
  account: any;
  accounts: any;
  owner: string;
  status: string;
  request: any = '';
  contractInstance: any;
  contractInitialized$ = new BehaviorSubject(false);
  truffleContract: any = contract(artifacts);

  constructor() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      // noinspection TsLint
      console.warn(
        'Using web3 detected from external source. If you find that your accounts don\'t appear or you have 0 MetaCoin, ensure you\'ve configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask'
      );
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      // noinspection TsLint
      console.warn(
        'No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
      );
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(
        new Web3.providers.HttpProvider('http://localhost:8545')
      );
    }

    // Bootstrap the Ny abstraction for Use.
    this.truffleContract.setProvider(this.web3.currentProvider);

    this.initializeContract();

    // until we set the logged in user account we call getAccounts to set the first account as the "logged in" user
    this.getAccounts();
  }

  initializeContract() {
     this.truffleContract.deployed().then(instance => {
       this.contractInstance = instance;
       this.contractInitialized$.next(true);
     });
  }


  getAccounts() {
    let accounts: any[] = [];
    // Get the initial account balance so it can be displayed.
    this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        this.setStatus('There was an error fetching your accounts.');
        return;
      }
      if (accs.length === 0) {
        this.setStatus('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
        return;
      }
      console.log('The accounts are ' + accs);
      // this is temporary as a user service will set this.account as the logged in user
      this.account = accs[0];
      accounts = accs;
    });
    return accounts;
  }

  getOwner() {
    return this.contractInstance.owner.call({from: this.account});
  }

  setStatus = message => {
    this.status = message;
  }

  registerNewUser(nylId: string, name: string) {
     return this.contractInstance.registerNewUser.sendTransaction(nylId, name, {from: this.account, gas: 4500000});
  }

  makeRequest(nylId: string, amount: number, from: number, to: number) {
    return this.contractInstance.makeRequest.sendTransaction(nylId, amount, from, to,{from: this.account, gas: 4500000});
  }

  viewAllRequests = async () => {
    const allRequests: any[] = [];
    const requestCount = await this.contractInstance.getRequestCount.call({from: this.account});
    console.log('the request count is', +requestCount);
    for (let requestId = 1; requestId <= requestCount; requestId++) {
      const request = await this.contractInstance.getSingleRequest.call(requestId, {from: this.account});
      allRequests.push({
        requestId: requestId,
        NylId: request[0],
        amount: request[1],
        from: this.checkRequestCode(request[2]),
        to: this.checkRequestCode(request[3]),
        approvedByNYL: request[4],
        approvedByFidelity: request[5]
      });
    }
    return allRequests;
  }
  viewAllUsers = async () => {
    let allUsers: any[] = [];
    const nylIdArray: any[] = [];
    const lengthOfClientArray = await this.contractInstance.getClientCount.call({from: this.account});
    for(let i = 0; i < lengthOfClientArray; i++)
    {
      const NYLID = await this.contractInstance.getSingleClientId.call(i, {from: this.account});
      nylIdArray.push(NYLID);
    }
    console.log('the request count is', +typeof nylIdArray);
    for (let i = 0; i < nylIdArray.length; i++) {
      const request = await this.contractInstance.viewUser.call(nylIdArray[i], {from: this.account});
      allUsers.push({
        nylId: nylIdArray[i],
       name: request[0],
        annuityBalance: request[2].toString(),
        longTermBalance: request[4].toString()
      });
    }
    return allUsers;
  }


  checkRequestCode(requestCode: number) {
    if (requestCode === 0) {
      return 'Annuities';
    }
    return 'Long Term';
  }

  approveRequestByNYL(requestId: number, approved: boolean) {
    return this.contractInstance.approveRequestByNYL.sendTransaction(requestId, approved, {from: this.account, gas: 4500000});
  }

  approveRequestByFidelity(requestId: number, approved: boolean) {
    return this.contractInstance.approveRequestByFidelity.sendTransaction(requestId, approved, {from: this.account, gas: 4500000});
  }

  viewUser(nylId: number) {
    return this.contractInstance.viewUser.call(nylId, {from: this.account}).then(userValues => ({
      name: userValues[0],
      annuitiesBalance: userValues[2],
      longTermBalance: userValues[4]
    }));
  }
}
