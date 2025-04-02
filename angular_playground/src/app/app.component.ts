import { Component,computed,effect,OnInit ,signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import { HistoryComponent } from './history/history.component';
import { HeaderComponent } from './header/header.component';
import { SwapSectionComponent } from './swap-section/swap-section.component';
import { QuotationComponent } from './quotation/quotation.component';
import { ApiService } from '../services/api.service';
import { HelperService } from '../services/helper.service';
import { WalletselectComponent } from './walletselect/walletselect.component';
import { SignalService } from '../services/signal.service';
import { ModalComponent } from './modal/modal.component';
import { FilterPipe } from '../helper/filter.pipe';

@Component({
  selector: 'app-root',
  imports: [CommonModule,FilterPipe,SwapSectionComponent,ModalComponent,QuotationComponent,HistoryComponent,HeaderComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit  {
  isModalOpen = false;
  walletPopup:any=false;
  wsignal:any
  activeModal="walletSelect"
  constructor(
    private signalService:SignalService,
    private api:ApiService,
    public helper:HelperService
  ){
    this.wsignal=this.signalService.showWalletSelect;
    console.log(this.showWalletPopup)
  }
  title = 'angular_playground';
  showWalletPopup=false;





  activeTab: 'buy' | 'sell' = 'buy';
  currentPrice: number = 43250.75;




  marketStats = [
    { label: '24h Volume', value: '$2.1B', change: 5.2 },
    { label: '24h High', value: '$43,750.00', change: 2.8 },
    { label: '24h Low', value: '$42,150.00', change: -1.5 }
  ];



  ngOnInit() {

    this.simulatePriceUpdates();
    this.getConfig()
   
    effect(()=>{
      console.log(this.wsignal())
      if(this.wsignal()){
       console.log("triggered")
      }

    })
    
    
      
    
   
  }
  openModal(activeModal:string) {
    this.activeModal=activeModal;
    this.isModalOpen = true;
  }
  getConfig(){
    this.api.getConfigs().then((res:any)=>{
      console.log(res);
      this.helper.allConfig=res;
      console.log(this.helper.allConfig)

    })
    
  }



  setActiveTab(tab: 'buy' | 'sell') {
    this.activeTab = tab;
  }

  calculateTotal(){
    // const amount = this.tradeForm.get('amount')?.value || 0;
    // const price = this.tradeForm.get('price')?.value || 0;
    // return amount * price;
  }

  executeTrade() {
    // if (this.tradeForm.valid) {
    //   const selectedQuote = this.quotes.find(q => q.selected);
    //   console.log(`Executing ${this.activeTab} order with ${selectedQuote?.provider}:`, this.tradeForm.value);
    // }
  }

  private simulatePriceUpdates() {
    // setInterval(() => {
    //   this.currentPrice += (Math.random() - 0.5) * 100;
    //   this.currentPrice = Math.max(this.currentPrice, 0);
      
    //   this.quotes.forEach(quote => {
    //     quote.rate = this.currentPrice + (Math.random() - 0.5) * 10;
    //     quote.expectedOutput = quote.rate - (Math.random() * 50);
    //   });
    // }, 3000);
  }
}


