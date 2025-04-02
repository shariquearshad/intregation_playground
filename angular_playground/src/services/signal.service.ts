import { effect, Injectable ,signal, WritableSignal} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class SignalService {

  constructor() {
    effect(()=>{
      console.log("t he",this.showWalletSelect())
    })
   }
   showWalletSelect = signal(false);
   showTokenSelect=signal(false);

  updateShowWalletSelect(value:boolean){
    this.showWalletSelect.set(value)
    }
  updateShowTokenSelect(){
    this.showTokenSelect.update(value=>!value)
  }  
  getWalletPopup(){
    return this.showWalletSelect;

  }
  getTokenPopup(){
    return this.showTokenSelect;
  }

 
}
