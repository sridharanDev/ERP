import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor(private http: HttpClient) { }
  GetTypes():Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'assets/types'); 
  }

  GetType(_id:any):Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'assets/types/'+_id); 
  }

  CreateType(formData:any):Observable<any>
  {
    return this.http.post(environment.apiBaseUrl + 'assets/types',formData); 
  }

  EditType(_id:any,formData:any):Observable<any>
  {
    return this.http.put(environment.apiBaseUrl + 'assets/types/'+_id,formData); 
  }

  DeleteType(_id:any):Observable<any>
  {
    return this.http.delete(environment.apiBaseUrl + 'assets/types/'+_id); 
  }

  GetAssets() {
    return this.http.get(environment.apiBaseUrl + 'assets');
  }

  GetAsset(_id:any) {
    return this.http.get(environment.apiBaseUrl + 'assets/'+_id);
  }


  CreateAsset(formData:any): Observable<any> {
    return this.http.post(environment.apiBaseUrl + 'assets',formData); 
  }

  EditAsset(_id:any,formData:any): Observable<any> {
    return this.http.put(environment.apiBaseUrl + 'assets/'+_id,formData); 
  }

  DeleteAsset(_id:any): Observable<any> {
    return this.http.delete(environment.apiBaseUrl + 'assets/'+_id); 
  }
}
