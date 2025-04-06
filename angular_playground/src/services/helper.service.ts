import { Injectable } from '@angular/core';
import _ from 'lodash';
import {  BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  activeCombination:any={
    sourceToken:{},
    sourceNetwork:{},
    destinationToken:{},
    destinationNetwork:{},
    amount:100
  }
 
  public getTransactionHashSubject = new Subject();
  activeWalletService:any;
  allConfig:any;
  public chainId: string | undefined ;
  sourceNetwork: any;
  public selectCombination= new BehaviorSubject({});
  currentCombination=this.selectCombination.asObservable();
  public currentNetworkSource = new BehaviorSubject({});
  currentNetwork = this.currentNetworkSource.asObservable();
  

  constructor() { }
  logoutSub(){
    this.activeWalletService.logOut()
    this.activeWalletService={}

  }
  setDefaultCoin(coins:any) {
    let n=this.allConfig.supported_network.find((n:any)=>n.chainId==="0x38")
    let combination={
      sourceToken:coins.find((c:any)=>c.token_symbol==='USDT'),
      sourceNetwork:n,
      destinationToken:coins.find((c:any)=>c.is_native_token),
      destinationNetwork:n,
      amount:100
    }
    this.activeCombination=combination
   return combination;
  }
  getChainId(){

  }
  updateCombination(com:any){
    this.selectCombination.next(com);
  }
  public newTransactionHash(Obj:any){
    this.getTransactionHashSubject.next(Obj);
  }
  changeSourceNetworkByUser(nw:any){
    let network:any = this.getNetwork(nw);
    if(this.activeWalletService?.activeWallet ){
      this.changeCurrentNetwork(network);
      return;
    }

  }
  public RegexCheck(regex:string,address:string){
    let regCheck:RegExp = new RegExp(regex);
    return regCheck.test(address)
  }
  public changeCurrentNetwork(net:any){
    if( _.toLower(this.getActiveWalletChainId())!==_.toLower(net.chainId)){
      this.sourceNetwork = net;
      this.chainId = net.chainId;
      this.currentNetworkSource.next(this.sourceNetwork)
    }

  }
  public getActiveWalletChainId(){
    if(!this.activeWalletService){
      return;
    }
    return this.activeWalletService.chainId
  }
  public getNetwork(network:any){
    if(typeof network==='string'){
      return this.allConfig.supported_network.find((nw:any)=>_.toLower(nw.chainId)===_.toLower(network))
    }
    else{
      return network;
    }
  }
}
