import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  GetIncomes():Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'incomes'); 
  }

  GetIncome(_id:any):Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'incomes/'+_id); 
  }

  CreateIncome(formData:any):Observable<any>
  {
    return this.http.post(environment.apiBaseUrl + 'incomes/',formData); 
  }

  EditIncome(_id:any,formData:any):Observable<any>
  {
    return this.http.put(environment.apiBaseUrl + 'incomes/'+_id,formData); 
  }

  DeleteIncome(_id:any):Observable<any>
  {
    return this.http.delete(environment.apiBaseUrl + 'incomes/'+_id); 
  }
}
