import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-swap-section',
  imports: [ReactiveFormsModule],
  templateUrl: './swap-section.component.html',
  styleUrl: './swap-section.component.scss'
})
export class SwapSectionComponent  implements OnInit,OnChanges{

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

 ngOnInit(): void {
     console.log(this.combination)
 }
 
  changeCombination(){
    this.updateCombination.emit(this.combination);
  }
  openPopup(type:any){
    this.openTokenSelector.emit(type)
  }

  
}
