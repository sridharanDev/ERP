import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private http: HttpClient) { }
  GetTypes():Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'Expenses/types'); 
  }

  GetType(_id:any):Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'Expenses/types/'+_id); 
  }

  CreateType(formData:any):Observable<any>
  {
    return this.http.post(environment.apiBaseUrl + 'Expenses/types',formData); 
  }

  EditType(_id:any,formData:any):Observable<any>
  {
    return this.http.put(environment.apiBaseUrl + 'Expenses/types/'+_id,formData); 
  }

  DeleteType(_id:any):Observable<any>
  {
    return this.http.delete(environment.apiBaseUrl + 'expenses/types/'+_id); 
  }

  GetExpenses() {
    return this.http.get(environment.apiBaseUrl + 'expenses');
  }

  GetExpense(_id:any) {
    return this.http.get(environment.apiBaseUrl + 'expenses/'+_id);
  }


  CreateExpense(formData:any): Observable<any> {
    return this.http.post(environment.apiBaseUrl + 'expenses',formData); 
  }

  EditExpense(_id:any,formData:any): Observable<any> {
    return this.http.put(environment.apiBaseUrl + 'expenses/'+_id,formData); 
  }

  DeleteExpense(_id:any): Observable<any> {
    return this.http.delete(environment.apiBaseUrl + 'expenses/'+_id); 
  }
}
