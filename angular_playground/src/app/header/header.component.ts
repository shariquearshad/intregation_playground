import { Component, EventEmitter, Output } from '@angular/core';
import { SignalService } from '../../services/signal.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
 
  @Output() openWalletSelector=new EventEmitter<string>()
  constructor(
    private signalService:SignalService
  ){}
  updateWalletPopup(){
    console.log("triggere")
    this.openWalletSelector.emit('walletSelector')
  }


}
