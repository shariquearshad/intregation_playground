import { Injectable } from '@angular/core';
import { HelperService } from './helper.service';
import { multiplyNumbers,removeLeadingZeroesFromHex } from '../helper/math';
import { EvmUtils } from './../helper/evm-utils';
import * as _ from 'lodash';
import Web3 from 'web3';

declare let ethereum: any;
@Injectable({
  providedIn: 'root'
})
export class EvmService {
  provider:any
  account:any
  activeWallet:string =""
  public web3: any;
  
  chainId:any;
  

  constructor(
    private helper:HelperService,
    private evmUtils:EvmUtils
    
  ) { }
  public async getAccounts() {
    try {
     
      
        this.provider = ethereum.providers ? ethereum.providers.find((provider:any) => provider.isMetaMask ) : ethereum;
        if(!this.provider)alert("no evm provider");
      
      let ac = await this.provider.request({ method: 'eth_requestAccounts' });
      this.activeWallet = ac[0];
      return this.activeWallet;
    } catch (err) { 
      throw(err); }
  }
  public initiate() {
    try{
      this.provider.on('accountsChanged', async (accounts: any) => {
        if (_.isEmpty(accounts)) {
          this.helper.logoutSub()
          return
        }
        if (this.activeWallet) {
          
          if (accounts && accounts.length > 0) {
              this.activeWallet = accounts[0];
          }
          else{
           
          }
        }
      });
  
      this.provider.on('chainChanged', async (chainId: any) => {
        chainId=`0x${(Number(chainId)).toString(16)}`;
       
        if(chainId !== undefined ) {
            
            // sync with new network
            let chainId = await this.helper.getChainId();
            
        }
        else {
        
          await this.helper.getChainId();
        }
      });
  
      this.provider.on('error', (data: any) => {
       
      });
      this.provider.on('confirmation', (data: any) => {
        
      });
      this.provider.on('disconnect', (data: any) => {
        if(data.code!==1013) this.helper.logoutSub();
      });
    }catch(e){

    }
  }
  public async getChainId(){
    try{
      this.web3 = new Web3(this.provider);
      this.chainId = await this.provider.request({ method: 'eth_chainId' }); 
      return this.chainId;
    } catch(err){
      console.log(err);
      return undefined;
    }
  }
  async requestChangeNetwork(network:any){
    if (this.provider) {
      try {
        // check if the chain to connect to is installed
        await this.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: network.chainId}]
        });
      } catch (error: any) {
        if (error.code === 4902 || error.code === 32603 || error.data?.originalError?.code === 4902 ) {
          try {
            await this.provider.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: network.chainId,
                  chainName:network.name,
                  rpcUrls:  [network.rpc_url],
                  blockExplorerUrls: [network.block_explorer_url],
                  nativeCurrency: {
                    symbol: network.base_token,
                    decimals: 18
                },
                },
              ],
            });
          } catch (addError) {
            console.log('wallet_addEthereumChain:',addError);
            alert(`Please switch the wallet network to : ${network.name}`);
          }
        }
        else{
          console.log('wallet_switchEthereumChain:',error);
          throw error;
        }
      }
    }
    else{
      throw new Error('not defined');
    }
  }
  public async logOut(){
    this.provider={};
		
	}
  public getGasPrice(){
    return "";
  }
  public async initiateTransaction(txObj: any,token:any,srctokn:any,trgtokn:any,depositAddress:any) {
    try {
      // if data is not present for a DEX then it will be available in token.value with decimal parsing already done
      let amtInNumber = !token?.swap?.tx?.data && token?.exchangeInfo?.exchange_type==='DEX' ? token.swap.fromAmount : multiplyNumbers(txObj.amount,srctokn.token_decimals);
      let amt = amtInNumber._hex  ? removeLeadingZeroesFromHex(amtInNumber._hex) : this.web3.utils.toHex(amtInNumber);

      // If data is present
      if(!!token.swap?.tx){
        let params:any = [{
          from: this.activeWallet,
        //   to: token?.swap?.tx?.to,
        //  // value : _isNumber(+token?.swap?.tx?.value)?`0x${BigInt(token?.swap?.tx?.value || 0).toString(16)}`:token?.swap?.tx?.value,
        //   data : token.swap.tx.data
        }];
        if(token.swap.tx.data){
          params[0]['data']=token.swap.tx.data;
        }
        if(token.exchangeInfo?.exchange_type==='DEX'){
          params[0]['value']=`0x${BigInt(token.swap.tx?.value || 0).toString(16)}`;
          params[0]['to']=depositAddress
        }
        if(!!srctokn.is_native_token && token.exchangeInfo?.exchange_type==='CEX') {
          params[0]['value'] = amt;
          params[0]['to']=depositAddress
        }
        if(!srctokn.is_native_token && token.exchangeInfo?.exchange_type==='CEX') {
          params[0]['to'] = srctokn.contract_address;
        }


        if(!token?.swap?.tx?.gas || !Number(token?.swap?.tx?.gas)){
          const estimate = await this.provider.request({
            method:'eth_estimateGas',
            params: params
          });  
          if(this.helper.chainId==='0x89'){
            const gasPrice = await this.getGasPrice();
            params[0]["maxFeePerGas"]=`0x${((parseInt(gasPrice)*3)<60000?60000:parseInt(gasPrice)*3).toString(16)}`;
          }
          else if(this.helper.chainId==='0x1'){
            params[0]["gas"]=`0x${(
              !!srctokn.is_native_token ? (parseInt(estimate)+30000) : Math.floor(parseInt(estimate)*1.8)
              ).toString(16)}`;
          }
          else if(token.exchangeInfo?.exchange_type==='DEX'){
          token.swap.tx.gas = parseInt(estimate)+60000;
          params[0]['gas']=`0x${(+token.swap.tx.gas).toString(16)}`;
          }
        }
        else{
          if(token.exchangeInfo?.exchange_type==='DEX'){
            token.swap.tx.gas = +token.swap.tx.gas+60000;
            params[0]['gas']=`0x${(+token.swap.tx.gas).toString(16)}`;
            if(this.helper?.chainId?.toLowerCase()==='0xa4b1'){
              params[0]['gas']=`0x${(+params[0]['gas']+40000).toString(16)}`;
            }
          }
          else  
          params[0]['gas']=`0x${(+token.swap.tx.gas).toString(16)}`;
        }


        // params[0]['gas'] =  `0x${(+token?.swap?.tx?.gas).toString(16)}`;

        let transactionHash = await this.provider.request({
          method: "eth_sendTransaction",
          params: params
        });
        console.log(JSON.stringify({ transactionHash: transactionHash, token: token?.requestId}))
        return transactionHash
      }

    } catch (err:any) {
     
      return err
    }
  }
  public async approveSwap(token:any,spendor:string,data:any='',fromAmount:number,preswap:boolean=false){
    return this.evmUtils.approveSwap(token,spendor,data,this.activeWallet,this.chainId,this.web3,this.provider,fromAmount)
  }
  isNetworkSupported(nw:any){
     return nw.type.toLowerCase()==='evm'
  }
}
