import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WalletselectComponent } from "../walletselect/walletselect.component";


@Component({
  selector: 'app-modal',
  imports: [CommonModule, WalletselectComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() activeModal:any;
  @Output() isOpenChange = new EventEmitter<boolean>();
  close(val?:any) {
    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen);
  }
  stopPropagation(event: Event) {
    event.stopPropagation(); // Prevents event from bubbling up to the backdrop
  }


}
