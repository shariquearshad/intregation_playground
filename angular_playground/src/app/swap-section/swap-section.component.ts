import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import _ from 'lodash';

@Component({
  selector: 'app-swap-section',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './swap-section.component.html',
  styleUrl: './swap-section.component.scss'
})
export class SwapSectionComponent  implements OnInit,OnChanges{
  walletAddress:{
    error: boolean;
    address: string;

  } | undefined

  constructor(
    private cd:ChangeDetectorRef
  ){

  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    console.log(this.combination)
    this.cd.detectChanges()

  }
  @Input() combination:any
  @Output() updateCombination=new EventEmitter<any>()
  @Output() openTokenSelector=new EventEmitter<any>()
  @Input() activeQuote:any
 ngOnInit(): void {
     console.log(this.combination)
 }
 
  changeCombination(){
    this.updateCombination.emit(this.combination);
  }
  openPopup(type:any){
    this.openTokenSelector.emit(type)
  }
  getNegativeValue(value:number){
    if(_.isNaN(value)) return 0;
    return -1*value;
  }
  isBridge(quote:any){
    return quote.type==='transfer';
   }

  
}
