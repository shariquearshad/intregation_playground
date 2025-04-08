import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output,  } from '@angular/core';
@Component({
  selector: 'app-quotation',
  imports: [CommonModule],
  templateUrl: './quotation.component.html',
  styleUrl: './quotation.component.scss'
})
export class QuotationComponent implements OnInit {
  @Input() quotation:any
  @Output() activeQuotation=new EventEmitter<any>()
  quotes= [
    {
      provider: "1inch",
      providerIcon: "https://images.unsplash.com/photo-1622012861596-d2658749fb7c",
      rate: 43250.75,
      expectedOutput: 43200.50,
      gasFee: 2.5,
      estimatedTime: 15,
      selected: true
    },
    {
      provider: "Uniswap",
      providerIcon: "https://images.unsplash.com/photo-1622012431203-42c5bf096666",
      rate: 43245.80,
      expectedOutput: 43190.30,
      gasFee: 3.0,
      estimatedTime: 20,
      selected: false
    },
    {
      provider: "SushiSwap",
      providerIcon: "https://images.unsplash.com/photo-1622012440034-0c172dfd01df",
      rate: 43242.90,
      expectedOutput: 43185.40,
      gasFee: 2.8,
      estimatedTime: 18,
      selected: false
    }
  ];
  @Output() refreshQoute=new EventEmitter<void>()
  ngOnInit(): void {
      console.log('a',this.quotation)
      this.quotation.quotes[0].selected=true;
  }
  selectQuote(selectedQuote:any) {
    if(!selectedQuote.err && selectedQuote.isTxnAllowed){
    this.quotation.quotes.forEach((quote:any) => quote['selected'] = quote === selectedQuote);
    this.activeQuotation.emit(selectedQuote);
    }
  }
  refresh(){
    this.refreshQoute.emit()
  }
  
}
