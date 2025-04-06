import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WalletselectComponent } from "../walletselect/walletselect.component";
import { TokenselectionComponent } from "../tokenselection/tokenselection.component";


@Component({
  selector: 'app-modal',
  imports: [CommonModule, WalletselectComponent, TokenselectionComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() activeModal:any;
  @Output() isOpenChange = new EventEmitter<boolean>();
  modal=""
  constructor(){
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


}
