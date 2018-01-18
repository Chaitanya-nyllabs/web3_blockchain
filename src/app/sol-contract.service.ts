import {Injectable} from '@angular/core';
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

    this.truffleContract.deployed().then(instance => {
      this.contractInstance = instance;
    });

    // until we set the logged in user account we call getAccounts to set the first account as the "logged in" user
    this.getAccounts();
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
    console.log(this)
    const requestCount = await this.contractInstance.getRequestCount.call({from: this.account});
    console.log('the request count is'+requestCount)
    for (let requestId = 1; requestId <= requestCount; requestId++) {
      const request = await this.contractInstance.getSingleRequest.call(requestId, {from: this.account});
      allRequests.push({
        requestId: requestId,
        NylId: request[0],
        amount: request[1],
        from: request[2],
        to: request[3],
        approvedByNYL: request[4],
        approvedByFidelity: request[5]
      });
    }
    return allRequests;
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
