import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environment';
import { retry, catchError, map } from 'rxjs/operators';
import { from, of, Observable  } from 'rxjs';
const request_types = {
  get: 'GET',
  post: 'POST'
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {
 
  private API_URL=environment.API_URL;


  constructor(private http: HttpClient) { }
  public generateRequestRx2(type: string, url: string, payload: any = {},params: any = {},header:any ={}) {

    let key = environment.key;
    const headers = {
      "x-api-key": key,
      'Content-Type':'application/json',
      ...header
    };

    return this.generateRequest(type,this.API_URL+url, payload, headers,params);
  }
  public generateRequestRx(type: string, url: string, payload: any = {},params: any = {},header:any ={}) {

    const headers = {
      'Content-Type':  'application/json',
      ...header
    };

    return this.generateRequest(type,this.API_URL + url, payload, headers,params);
  }
  public generateRequest(type: string, url: string, payload: any = {}, customheaders: any = {}, params: any = {}) {

    let headers = {
        ...customheaders
    };

    const httpOptions = {
      headers: new HttpHeaders(headers),
      params: params
    };

    if (type === request_types.post) {
      return this.http.post(url, payload, httpOptions)
        .pipe(
          map(data => {
            return data;
          }),
          catchError(error => {

            throw error;
          }),
         
        ).toPromise()
    } else {
      return this.http.get(url, httpOptions)
      .pipe(
        map(data => {
          return data;
        }),
        catchError(error => {

          throw error;
        }),
      ).toPromise();
    }
  }
  public getConfigs(){
    return this.generateRequestRx(request_types.get, `/v1/configs`);
  }
  public getQuotes(fromToken:any,fromNetwork:any,toToken:any,toNetwork:any,amount:any){
    return from(this.generateRequestRx2(request_types.get, `/v1/quotation?fromToken=${fromToken.is_native_token?undefined:fromToken.contract_address}&fromNetwork=${fromNetwork.id}&toToken=${toToken.is_native_token?undefined:toToken.contract_address}&toNetwork=${toNetwork.id}&amount=${amount}`))
  }
  public swap(payload:any){
    return this.generateRequestRx2(request_types.post, `/swap`,payload,{});
  }
  public async getPaginatedCoins(chainId:any,page:number,items:number,query?:string){
    return await this.generateRequestRx2(request_types.get, `/v1/tokens?chainId=${chainId}&page=${page}&perPage=${items}`); 
  }
  public async getFilteredCoins(query:string,chainId:number){
    return await this.generateRequestRx2(request_types.get, `/v1/tokens${query ? `?keyword=${query}&chainId=${chainId}` : ``}`); 
  }
  
}
