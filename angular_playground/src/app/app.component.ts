import { Component,OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
interface Quote {
  provider: string;
  providerIcon: string;
  rate: number;
  expectedOutput: number;
  gasFee: number;
  estimatedTime: number;
  selected: boolean;
}@Component({
  selector: 'app-root',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit  {
  title = 'angular_playground';
 




  activeTab: 'buy' | 'sell' = 'buy';
  currentPrice: number = 43250.75;
  tradeForm: FormGroup;

  quotes: Quote[] = [
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

  marketStats = [
    { label: '24h Volume', value: '$2.1B', change: 5.2 },
    { label: '24h High', value: '$43,750.00', change: 2.8 },
    { label: '24h Low', value: '$42,150.00', change: -1.5 }
  ];

  constructor(private fb: FormBuilder) {
    this.tradeForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.0001)]],
      price: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.simulatePriceUpdates();
  }

  selectQuote(selectedQuote: Quote) {
    this.quotes.forEach(quote => quote.selected = quote === selectedQuote);
    this.tradeForm.patchValue({
      price: selectedQuote.rate
    });
  }

  setActiveTab(tab: 'buy' | 'sell') {
    this.activeTab = tab;
  }

  calculateTotal(): number {
    const amount = this.tradeForm.get('amount')?.value || 0;
    const price = this.tradeForm.get('price')?.value || 0;
    return amount * price;
  }

  executeTrade() {
    if (this.tradeForm.valid) {
      const selectedQuote = this.quotes.find(q => q.selected);
      console.log(`Executing ${this.activeTab} order with ${selectedQuote?.provider}:`, this.tradeForm.value);
    }
  }

  private simulatePriceUpdates() {
    setInterval(() => {
      this.currentPrice += (Math.random() - 0.5) * 100;
      this.currentPrice = Math.max(this.currentPrice, 0);
      
      this.quotes.forEach(quote => {
        quote.rate = this.currentPrice + (Math.random() - 0.5) * 10;
        quote.expectedOutput = quote.rate - (Math.random() * 50);
      });
    }, 3000);
  }
}

