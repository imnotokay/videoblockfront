import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ModalService } from './modal.service';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  private baseUrl: string;
  private corsHeaders: HttpHeaders;

  constructor(private http: HttpClient, private modal: ModalService) {
    this.baseUrl = environment.baseUrl;
    this.corsHeaders = new HttpHeaders({
      'Access-Control-Allow-Request-Method': 'GET,POST,PUT,DELETE,OPTIONS',
      'Allow': 'GET,POST,PUT,DELETE,OPTIONS'
    });
  }

  get(url):Promise<any>{
    return new Promise((resolve, reject)=>{
      this.http.get(this.baseUrl + url, { headers: this.corsHeaders }).subscribe(data=>{
        resolve(data);
      }, error =>{
        this.errorHandler(error);
        reject(error);
      });
    });
  };

  post(url, data){
    return new Promise((resolve, reject)=>{
      this.http.post(this.baseUrl + url, data, { headers: this.corsHeaders }).subscribe(data=>{
        resolve(data);
      }, error =>{
        this.errorHandler(error);
        reject(error);
      });
    });
  };

  put(url, data){
    return new Promise((resolve, reject)=>{
      this.http.put(this.baseUrl + url, data, { headers: this.corsHeaders }).subscribe(data=>{
        resolve(data);
      }, error =>{
        this.errorHandler(error);
        reject(error);
      });
    });
  };

  delete(url){
    return new Promise((resolve, reject)=>{
      this.http.delete(this.baseUrl + url, { headers: this.corsHeaders }).subscribe(data=>{
        resolve(data);
      }, error =>{
        this.errorHandler(error);
        reject(error);
      });
    });
  };

  login (username, password){
    return new Promise((resolve, reject)=>{
      let credentials = 'username=' + username + '&password=' + password + '&grant_type=password';
      this.http.post(this.baseUrl + 'token', encodeURI(credentials)).subscribe(data=>{
        resolve(data);
      }, error=>{
        reject(error);
      });
    });
  };
  
  private errorHandler(error): void {
    if(error.status !== 403 && error.status !== 401){
      let type = 4;
      let message = '';
      if(error.error && typeof error.error === 'object'){
        if(error.error['odata.error'] && typeof error.error['odata.error'] === 'object'){
        
          if(error.error['odata.error'].code === 501){
            type = 3;
          }
          if(error.error['odata.error'].innererror)
          {
            message = error.error['odata.error'].innererror.message;
          }else{
            message = error.error['odata.error'].message.value;
          }
        }else if(error.error.ExceptionMessage !== undefined){
            message = error.error.ExceptionMessage;
        }
        
        else{
          if(error.error.code === 501){
            type = 3;
          }
          message = error.error.message;
        } 
      }else {
        message = error.message;
        if(error.code === 501){
          type = 3;
        }
      }  
      this.modal.showAlert(message, type);
    }
  };
}
