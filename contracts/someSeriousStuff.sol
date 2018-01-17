pragma solidity ^0.4.4;

contract someSeriousStuff {

  address public owner;
  //address[] public clients;
  mapping(uint=>User) clients;
  mapping(string=>uint) someTest;



  uint[] public requests;
  mapping(uint=>RequestTransfer) mapReqIdToReq;
  uint requestId = 1;

  struct Account{
    string name;
    uint amount;
  }

  struct User{
    string name;
    //can include multiple properties like policy_holder_number and other user detail
    Account[2] accounts;
  }

  struct RequestTransfer{
    uint NylId;
    uint amount;
    uint from;
    uint to;
    bool approvedByNYL;
    bool approvedByFidelity;
  }

  RequestTransfer[] request;

  function someSeriousStuff(){
    owner = msg.sender;
    //clients.push(_client);
  }

  function registerNewUser(uint NylId ,string _name) returns (bool success) {
    clients[NylId].name = _name;
    clients[NylId].accounts[0] = Account({name:'annuity', amount:100000});
    clients[NylId].accounts[1] = Account({name:'long term', amount:5000});
    someTest[_name] = NylId;
    return true;
  }


  enum Stages{
    WaitingApproval,
    RequestAcceptedByNYL,
    RequestAcceptedByFidelity
  }
  uint public currentStageTime = now;

  Stages public currentStage = Stages.WaitingApproval;

  modifier onlyBy(address _account) {
    require(msg.sender == _account);
    _;
  }

  modifier atStage(Stages _stage) {
    require(currentStage == _stage);
    _;
  }

  function nextStage() internal {
    uint next = uint(currentStage) + 1;
    if (next > 1) next = 0;
    currentStage = Stages(next);
    currentStageTime = now;
  }



  function makeRequest(uint _NylId, uint _amount, uint _from, uint _to)
  public
  {
    require(clients[_NylId].accounts[_from].amount- _amount>=0);
    RequestTransfer memory localRequest = RequestTransfer({NylId:_NylId,amount:_amount,from:_from,to:_to, approvedByNYL:false, approvedByFidelity:false});
    mapReqIdToReq[requestId] = localRequest;
    requests.push(requestId);
    //wait for approval
    requestId = requestId + 1;
    nextStage();
  }

  function viewUser(uint _NylId) public returns (string, string, uint, string, uint)
  {
    return (clients[_NylId].name,clients[_NylId].accounts[0].name,clients[_NylId].accounts[0].amount,clients[_NylId].accounts[1].name,clients[_NylId].accounts[1].amount);
  }


  function viewRequestAtNyl(uint requestId) public onlyBy(owner) returns (uint,string,uint, uint, uint, bool, bool)
  {
    RequestTransfer localRequest = mapReqIdToReq[requestId];
    return (localRequest.NylId, clients[localRequest.NylId].name,localRequest.amount, localRequest.from, localRequest.to, localRequest.approvedByNYL, localRequest.approvedByFidelity);
  }

  function approveRequestByFidelity(uint requestId, bool approved)
  public
  onlyBy(owner)
  {
    RequestTransfer localRequest = mapReqIdToReq[requestId];
    if(approved && localRequest.approvedByNYL==true && localRequest.approvedByFidelity==false)
    {
      clients[localRequest.NylId].accounts[localRequest.from].amount -= localRequest.amount;
      clients[localRequest.NylId].accounts[localRequest.to].amount += localRequest.amount;
      localRequest.approvedByFidelity = true;
    }
    //delete request;
  }

  function approveRequestByNYL(uint requestId, bool approved)
  public
  {
    RequestTransfer localRequest = mapReqIdToReq[requestId];
    if(approved && localRequest.approvedByFidelity==false && localRequest.approvedByNYL==false)
    {
      localRequest.approvedByNYL=true;
    }
  }

}
