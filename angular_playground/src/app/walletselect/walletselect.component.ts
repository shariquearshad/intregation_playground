import { Component, OnInit } from '@angular/core';
import { HelperService } from '../../services/helper.service';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../../helper/filter.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-walletselect',
  imports: [CommonModule,FilterPipe,FormsModule],
  templateUrl: './walletselect.component.html',
  styleUrl: './walletselect.component.scss'
})
export class WalletselectComponent implements OnInit {
  networks: any;
  selectedNetwork: any;
  selectedWallet: any;
  networkSearchQuery=""
  allWallets=
    [{
      id:1,
      title:"Evm Browser Wallet",
      keyword:"evm",
      type:"evm"
    },
    {
      id:2,
      title:"Phantom",
      keyword:"phantom",
      type:"solana"
    },
    {
      id:3,
      title:"Kepler",
      keyword:"keplr",
      type:"solana"
    }]
  
  constructor(
    public helper:HelperService
  ){

  }
  public wallets: any = [];
  ngOnInit(): void {
    try {
      let configs:any = this.helper.allConfig;
     

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
  selectWallet(wallet:any){
    console.log(wallet)
  }
  exit(){
    console.log("exit triggered")
  }
}
