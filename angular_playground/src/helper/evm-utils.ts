import { Injectable } from '@angular/core';
declare let Web3: any;
import { toLower as _toLower, multiply } from 'lodash';

import { multiplyNumbers, removeLeadingZeroesFromHex } from './math';
import { toString as _toString } from 'lodash';
import { HelperService } from '../services/helper.service';

@Injectable({
  providedIn: 'root'
})
export class EvmUtils {
  constructor(
    
    private helper: HelperService
  ){

  }
  
  public checkAllowance(contract:string,spendor:string,user:string,decimals:number,isNative:boolean,chain:any){
    return check_allowance(contract,spendor,user,decimals,isNative,new Web3(chain.chainId));
  }
  public async approveSwap(token:any,spendor:string,data:any='',wallet:string,chainId:string,web3:any,provider:any,fromAmount?:number,preswap?:boolean){
    const multipliers:any = {
      '0x89':3,
      '0xa4b1':3
    };
    const limitMap:any = {
      '0x1' : 130000
    };
    const [gas, gasPrice]  = await  Promise.all([
      this.getEstimatedGas(wallet,web3),
      this.getGasPrice(web3)
    ]);
    

    let abi = [{
      "name": "approve",
      "type": "function",
      "stateMutability": "nonpayable",
      "inputs": [{ "name": "_spender", "type": "address"}, { "name": "_value", "type": "uint256"}],
      "outputs": [{ "name": "success", "type": "bool" }]
    }];
    const multiplier = multipliers[_toLower(chainId)] || 1.25;
    let params:any={
      from: wallet
    };
    if(!!gas){
      // gas limit for all
      const gaslimit = limitMap[`${chainId}`] ? limitMap[`${chainId}`] : parseInt(((gas ? gas : 130000)*multiplier).toString());
      params['gas'] = `0x${(gaslimit).toString(16)}`
    }

    // send gas price for Polygon only
    if(chainId==='0x89') params['gasPrice'] = `${(gasPrice).toString(16)}`; 

    let contract = await new web3.eth.Contract(abi,token?.contract_address , params);
    if(data){
      let txParams = [{
        data:data,
        from:wallet,
        to:spendor
      }]
      try{
        let transactionHash = await provider.request({
          method: "eth_sendTransaction",
          params: txParams
        });
       
          return transactionHash;
      }catch(e){
        throw e;
      } 
      
    }

    try{
      if(_toLower(chainId) == "0x1" || _toLower(chainId) == "0xa4b1") {
        contract.options["gas"] = null;
        contract.options["gasPrice"] = null;  
      }
      var value = !!fromAmount ? 
      removeLeadingZeroesFromHex(multiplyNumbers(fromAmount||0,token.token_decimals)?._hex || '') : 
      '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
      let dontSubscribe = false;
      if(fromAmount == 0) {
        value = '0';
        dontSubscribe = true;
      }
      return contract.methods.approve(spendor, value)
      .send( (err:any, res:any)=> {
          if (err) {
            console.log("An error occured", err);
            return;
          }
         return res;
        })
      }catch(e){
        console.log('error',e)
        return;
      } 
  }
  public async getEstimatedGas(wallet:string,web3:any){
    try{
      const eg = await web3.eth.estimateGas({
        from: wallet,
      });
      return eg;
    }catch(e){
      return 0;
    }
  }
  public async getGasPrice(web3:any){
    const gp = await web3.eth.getGasPrice();
    return gp;
  }
}

export const minABI = [
  {
    "name": "transfer",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [{ "name": "_to", "type": "address"}, { "name": "_value", "type": "uint256"}],
    "outputs": [{ "name": "success", "type": "bool" }]
  },
  {
    "name": "balanceOf",
    "type": "function",
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "outputs": [{ "name": "balance", "type": "uint256" }]
  },
  {
    "name": "decimals",
    "type": "function",
    "constant": true,
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint8" }]
  }
];

 async function check_allowance(contract_address:string,spendor:string,user:string,decimals:number,isNative:boolean,web3:any){
  try{
   
    let abi = [{
      "name": "allowance",
      "type": "function",
      "stateMutability": "nonpayable",
      "inputs": [{ "name": "_owner", "type": "address"}, { "name": "_spender", "type": "address"}],
      "outputs": [{ "name": "_value", "type": "uint256"}]
    }];
    const contract = await new web3.eth.Contract(abi, contract_address);
    const allowance = await contract.methods.allowance(user,spendor).call();
    if(decimals) return allowance/(10**decimals);
    return allowance;
  }catch(e){
    console.log('error',e)
    return 0;
  } 
}