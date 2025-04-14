import { Component, Input, OnInit, Output } from '@angular/core';
import { HelperService } from '../../services/helper.service';
import _ from 'lodash';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-history',
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {
  reqId:string=""
  status:any=""
  loading=false;
  constructor(
    private helper:HelperService,
    private api:ApiService
  ){
    

  }
  @Input() modalType:any
  ngOnInit(): void {
      if(this.modalType=='activeHistory'){
        this.reqId=this.helper.activeHistoryReqId.value;
        this.getStatus(this.reqId)
      }
      else{
      this.reqId="4d67719c-b00d-4bd4-9f46-0fa8d49d59eb";
      this.getStatus(this.reqId)
      }
    
  }
  async getStatus(reqId:string){
    this.loading=true;
    this.status=await this.api.getStatus(reqId);
    this.loading=false;
     
  }
  gettxStatus(){
    this.status.status;
   

  }

}
