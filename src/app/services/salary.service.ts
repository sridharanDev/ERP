import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders().set('Content-Type', 'application/json');  

  GetSalarys() {
    return this.http.get(environment.apiBaseUrl + 'salaries');
  }

  GetSalary(_id:any) {
    return this.http.get(environment.apiBaseUrl + 'salaries/'+_id);
  }

  CreateSalary(formData:any): Observable<any> {
    return this.http.post(environment.apiBaseUrl + 'salaries',formData); 
  }

  EditSalary(_id:any,formData:any): Observable<any> {
    return this.http.put(environment.apiBaseUrl + 'salaries/'+_id,formData); 
  }

  DeleteSalary(_id:any): Observable<any> {
    return this.http.delete(environment.apiBaseUrl + 'salaries/'+_id); 
  }

  UploadSalary(formData:any): Observable<any> {
    return this.http.post(environment.apiBaseUrl + 'salaries/upload',formData); 
  }
}
