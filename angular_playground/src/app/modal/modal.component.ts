import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output,ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { WalletselectComponent } from "../walletselect/walletselect.component";
import { TokenselectionComponent } from "../tokenselection/tokenselection.component";
import { TransactionComponent } from '../transaction/transaction.component';
import { HistoryComponent } from "../history/history.component";


@Component({
  selector: 'app-modal',
  imports: [CommonModule,HistoryComponent, WalletselectComponent, TransactionComponent, TokenselectionComponent, HistoryComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() activeModal:any;
  @Output() isOpenChange = new EventEmitter<boolean>();
  modal=""
  constructor(
    private cd:ChangeDetectorRef
  ){
    this.modal=this.activeModal;

  }
  ngOnInit(): void {
      console.log("triggered")
  }

  close(val?:any) {
    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen);
  }
  stopPropagation(event: Event) {
    event.stopPropagation(); // Prevents event from bubbling up to the backdrop
  }
  openActiveHistory(){
    this.activeModal="activeHistory"

  }


}
