import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HelperService } from '../../services/helper.service';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { MultiColSearchPipe,FilterPipe } from "../../helper/filter.pipe";
import _, { cloneDeep } from 'lodash'

@Component({
  selector: 'app-tokenselection',
  imports: [CommonModule, FormsModule, MultiColSearchPipe],
  templateUrl: './tokenselection.component.html',
  styleUrl: './tokenselection.component.scss'
})
export class TokenselectionComponent implements OnInit {
  @Input() modalType:any
  @Output() close=new EventEmitter<boolean>();

  
  tokenNum=1;
  public coinSearchQuery:string = "";
  filterDeb = _.debounce(this.filterCoins,200);
  allNetworks: any[]=[];
  public networks: any[]= [];
  inputNumber:number=new Date().getTime();
  public selectedNetwork:any;
  public paginationTimestamp:any;
  public importConfirmation=false;
  public loading: boolean = false;
  itemsPerPage:number=100;
  coinNotFound: boolean=false;
  type="FROM"

  lastSearchResult: any;
  pageNum:number=1;
  searchQueryNetwork = ""
  latestQuery: string='';
  coins=[]
  filteredCoins=[];
  paginationLoad: boolean=false;
  
  constructor(
    public helper:HelperService,
    public api:ApiService
  ){
    
   
  }
  ngOnInit(): void {
  
     this.type=this.modalType=='fromTokenSelector'?"FROM":"TO"
      
      this.getNetworks()
  }
  getNetworks(){
    const networks=this.helper.allConfig.supported_network;
    networks.forEach((nw:any)=>{
      nw['enabled'] = true;
    });
    networks.sort((a:any,b:any) =>{
      return  a.sort_order - b.sort_order;
    })
    this.selectedNetwork=this.type=="TO"?this.helper.activeCombination.destinationNetwork:this.helper.activeCombination.sourceNetwork;
    this.allNetworks = networks;
    this.networkSelected(this.selectedNetwork,true)
  

  }
  public async networkSelected(network: any,isFirstLoad:boolean=false) {
    if(network?.id===this.selectedNetwork?.id && !isFirstLoad)return;
    // if(this.type == "FROM" && network?.sell_enabled === 0) return;
   
    this.loading = true;
    this.pageNum = 1;
    this.searchQueryNetwork = "";
    if(!network.enabled) return;
    this.selectedNetwork = network;
   
    await this.initTokenList();
    // setTimeout(() => {
    //   if(document.getElementById("tokenSearchBox"))(document.getElementById("tokenSearchBox") as any).focus();
    // }, 200);
    // if(!isFirstLoad) {
     
    //   setTimeout(() => {
    //     if(document.getElementById("tokenSearchBox"))(document.getElementById("tokenSearchBox") as any).focus();
    //   }, 200);
    // }
    // else{
    
    // }
  }
  private async initTokenList(){
    try {
      this.loading = true;
      let coins:any = await this.api.getPaginatedCoins(_.get(this.selectedNetwork,"chainId",1),1,this.itemsPerPage,'All');
      this.lastSearchResult = coins;
      if(this.latestQuery) await this.filterCoins(this.latestQuery)
      else{
       
        this.initialFilter(coins);
        this.filteredCoins = this.coins;
      }
      
      try{
      
      } catch(e){
        console.log("clear error",e)
      }
     
    
      this.loading = false;
      
    } catch (err) {
      this.loading=false;
    }
  }
  public async filterCoins(query:string){
    this.loading = true;
    if(!query){
      this.latestQuery = '';
      this.coins = [];
      this.filteredCoins = [];
      this.pageNum = 0;
      await this.getMoreTokens();
      this.loading = false;
      return;
    }
    this.filteredCoins = [];

   
    const coins:any = await this.api.getFilteredCoins(query,_.get(this.selectedNetwork,"chainId",'0x1'));
   
    this.latestQuery = query;
    
    // const importedCustomTokens = this.filterTokensViaQuery(query,this.getCustomTokensForChain(_.toLower(this.selectedNetwork.chainId)));
    // const importedCustomTokenArr = [...new Set(importedCustomTokens.map((obj:any) => obj['id']))];
   
    // if its a custom token
    this.initialFilter(coins);
    this.filteredCoins = this.coins;
    if(this.filteredCoins.length)
    this.loading = false;
    if(this.helper.RegexCheck(_.get(this.selectedNetwork,'regex'),query))this.filteredCoins=this.filterViaContract(this.filteredCoins,query)
  }
  async getMoreTokens(){
    this.pageNum++;
    this.paginationTimestamp = new Date().getTime();
    const timeStamp = _.cloneDeep(this.paginationTimestamp);
    this.paginationLoad = true;
    let coins:any = await this.api.getPaginatedCoins(_.get(this.selectedNetwork,"chainId",1),this.pageNum,this.itemsPerPage, 'All');
    if(timeStamp===this.paginationTimestamp){
      this.paginationLoad = false;
    } 
    this.lastSearchResult = coins; 
    if(this.latestQuery)return;
    // const customTokens = this.getCustomTokensForChain(_.toLower(this.selectedNetwork.chainId));
    // coins = coins.concat(customTokens).concat(this.widgetService.usersFavouriteListOfCoins);
    this.initialFilter(coins);
   
    this.filteredCoins = this.filteredCoins.concat(this.coins);
    // console.log(total);
  }
 
  private initialFilter(coins:any){
   
    // const nwListFavCoins:any = favouriteCoins[_toLower(this.selectedNetwork.chainId)] || {};
    if(this.type==='FROM'){
      coins = coins.filter((item:any)=>{
        return _.toLower(item.chainId) === _.toLower(this.selectedNetwork.chainId) && item.contract_address!=='NOT_AVAILABLE';
      });
    }
    else if(this.type==='TO'){
      const sameChain = _.toLower(this.selectedNetwork.chainId) ===  _.toLower(this.helper.activeCombination.sourceNetwork.chainId);
      coins = coins.filter((item:any)=>{
        return  _.toLower(item.chainId) === _.toLower(this.selectedNetwork?.chainId) && !(sameChain && item.id===this.helper.activeCombination.sourceToken['id'])
      });
    }
   
    this.coins = coins
   
  }
  filterViaContract(coins:any,contractAddress:string){
    return coins.filter((item:any)=>{
      return item.contract_address.toLowerCase()===contractAddress.toLowerCase()
    })
  }
  exit(){
    console.log("clicked");
    this.close.emit(true)
  }
  onScroll(event:any) {
    if(this.paginationTimestamp + 1000 > new Date().getTime()) {
      return;
    }
    if (event.target.clientHeight + event.target.scrollTop >= 0.99*event.target.scrollHeight && !this.latestQuery && !this.paginationLoad && this.lastSearchResult.length>0) {
      this.getMoreTokens();
    }
    event.preventDefault();
  }
  public tokenSelected(coin: any) {
    console.log(coin)
   
    // coin enabled and imported if its a custom token

    if(!!coin.enabled && (!coin.is_custom || (!!coin.is_custom && coin.isImported) )){
      // network
      let activeCombination=_.cloneDeep(this.helper.activeCombination)
      if(this.type==='TO'){
        
        activeCombination.destinationNetwork=this.selectedNetwork;
        activeCombination.destinationToken=coin;

      }
      else {
        activeCombination.sourceNetwork=this.selectedNetwork;
        activeCombination.sourceToken=coin;
      }
      // token
      this.helper.updateCombination(activeCombination);
     
      this.exit();
    }
  }

 

}
