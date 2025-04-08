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
  public updateChainId= new BehaviorSubject("");
   currentChainId= this.updateChainId.asObservable();
  public updateWalletAddress=new BehaviorSubject("");
   currentWalletAddress= this.updateWalletAddress.asObservable();

  

  constructor() { }
  async logoutSub(){
    await this.activeWalletService.logOut()
     this.activeWalletService={};
     this.updateChainId.next("");
     this.updateWalletAddress.next("");

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
  async getChainId(){
    let chainId=await this.activeWalletService.getChainId();
    this.updateChainId.next(chainId)
    console.log("chainId",chainId)




  }
  updateCombination(com:any){
    this.activeCombination=com;
    this.selectCombination.next(com);
  }
  updateAddress(add:string){
    this.updateWalletAddress.next(add);
  }
  public newTransactionHash(Obj:any){
    this.getTransactionHashSubject.next(Obj);
  }
  changeSourceNetworkByUser(nw:any){
    // let network:any = this.getNetwork(nw);
    if(this.activeWalletService?.activeWallet ){
      this.changeCurrentNetwork(nw);
      return;
    }

  }
  public RegexCheck(regex:string,address:string){
    let regCheck:RegExp = new RegExp(regex);
    return regCheck.test(address)
  }
  public changeCurrentNetwork(net:any){
    if( _.toLower(this.getActiveWalletChainId())!==_.toLower(net.chainId)){
      this.activeWalletService.requestChangeNetwork(net)
      this.chainId = net.chainId;
    
      // this.currentNetworkSource.next(this.sourceNetwork)
    }

  }
  public getActiveWalletChainId(){
    if(!this.activeWalletService){
      return;
    }
    // this.currentNetworkSource.next(this.activeWalletService.chainId);
    return this.activeWalletService.chainId;
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
