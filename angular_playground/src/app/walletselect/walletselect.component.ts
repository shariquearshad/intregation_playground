import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HelperService } from '../../services/helper.service';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../../helper/filter.pipe';
import { FormsModule } from '@angular/forms';
import { EvmService } from '../../services/evm.service';

@Component({
  selector: 'app-walletselect',
  imports: [CommonModule,FilterPipe,FormsModule],
  templateUrl: './walletselect.component.html',
  styleUrl: './walletselect.component.scss'
})
export class WalletselectComponent implements OnInit {
  @Output() close=new EventEmitter<boolean>();
  constructor(
    public helper:HelperService,
    public evmService:EvmService
  ){

  }
  networks: any;
  selectedNetwork: any;
  selectedWallet: any;
  networkSearchQuery=""
  allWallets=
    [{
      id:1,
      title:"Evm Wallet",
      keyword:"evm",
      type:"evm",
      logo:'./../img/Browser.png'
    },
    {
      id:2,
      title:"Phantom",
      keyword:"phantom",
      type:"solana",
      logo:'./../img/Browser.png'
    },
    {
      id:3,
      title:"Kepler",
      keyword:"keplr",
      type:"cosmos",
      logo:'./../img/Browser.png'
    }]
  activeNetwork={
    block_explorer_url: "https://etherscan.io/",
  "buy_enabled":1,
  chainId:"0x1",
  enabled:1,
  greyscale_logo:"https://cdn.rocketx.exchange/pd135zq/images/icons-greyscaled/ethereum-grey.png",
  id:"ethereum",
  logo:"https://cdn.rocketx.exchange/pd135zq/images/icons-original/ethereum.png",
  name:"Ethereum Network",
  native_token:"ETH",
  regex: "^(0x)[0-9A-Fa-f]{40}$",
  rpc_url:"https://eth-mainnet.public.blastapi.io",
  sell_enabled: 1,
  shorthand:"ETHEREUM",
  sort_order:2,
  symbol:"ETH",
  type:"EVM", 
  }
  
  

  
  public wallets: any = [];
  ngOnInit(): void {


    try {
      let configs:any = this.helper.allConfig;
      this.selectedNetwork=this.activeNetwork
      this.selectNetwork(this.selectedNetwork)
     

      const networks = configs['supported_network'];
      
      const map:any = {};

      this.allWallets.forEach((wallet:any)=>{
       
      networks.forEach((nw:any)=>{
          nw['wallets'] = map[nw.id] ? map[nw.id] : [];
      });
      // this.networks = networks.filter((nw:any)=>nw['wallets'].length>0);
      this.networks = networks;//.filter((nw:any)=>nw['wallets'].length>0);
      this.networks.sort((a:any,b:any) =>{
        return  a.sort_order - b.sort_order;
     })
    })
     
    } catch (err) {
      console.log(err);
    }
  }
  selectNetwork(network:any){
    this.selectedNetwork = network;
    this.wallets=this.allWallets.filter((w:any)=>{
      return network.type.toLowerCase()===w.type.toLowerCase()
    })
    // this.wallets = this.allWallets.filter((w:any)=>{
      // if(!this.partnerWidget) {
      //   return network.wallets?.includes(w.id)
      // } else if(this.partnerWidget) {
      //   if(network.wallets?.includes(w.id) && this.disableWalletsForWidget.indexOf(w.keyword) == -1) {
      //     return true;
      //   } else return false;
      // }
    // });

    this.wallets.splice(this.wallets.length, 0, {
      id: -1,
      keyword: 'Walletless',
      title: 'TRY WALLETLESS'
    });

   
     

    
  }
  async selectWallet(wallet:any){
    console.log(wallet)
    this.assignWallet(wallet)
  }
  exit(){
    console.log("exit triggered")
    this.close.emit(true)
  }
  public async assignWallet(wallet:string,network:string='',suppressCatchErrorAction:boolean=false, modal: any=null){
    try {
      // disconnect if anything already connected
      if(this.helper.activeWalletService)this.helper.logoutSub()    
      switch(wallet) {
      case 'evm':{
        this.helper.activeWalletService=this.evmService;
        let account=await this.helper.activeWalletService.getAccounts();
        if(account && account.length > 0) {
          console.log(account)
          await this.helper.getChainId();
          this.helper.activeWalletService.activeWallet = account;
          
            if(this.helper.activeWalletService)this.helper.activeWalletService.initiate();
            if(network){
              try{
                this.helper.changeSourceNetworkByUser(network);
              }catch(e){
              }
            }
          
      }
    break;


      }
    }
    this.exit()
    } catch (err:any) {
      this.exit();
    }
  }
  }
