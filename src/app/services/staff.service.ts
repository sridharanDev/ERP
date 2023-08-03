import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private http: HttpClient) { }

    headers = new HttpHeaders().set('Content-Type', 'application/json');  

    GetRoles():Observable<any>
    {
      return this.http.get(environment.apiBaseUrl + 'staffs/roles'); 
    }

    GetRole(_id:any):Observable<any>
    {
      return this.http.get(environment.apiBaseUrl + 'staffs/roles/'+_id); 
    }

    CreateRole(formData:any):Observable<any>
    {
      return this.http.post(environment.apiBaseUrl + 'staffs/roles',formData); 
    }

    EditRole(_id:any,formData:any):Observable<any>
    {
      return this.http.put(environment.apiBaseUrl + 'staffs/roles/'+_id,formData); 
    }

    DeleteRole(_id:any):Observable<any>
    {
      return this.http.delete(environment.apiBaseUrl + 'staffs/roles/'+_id); 
    }

    GetStaffs() {
      return this.http.get(environment.apiBaseUrl + 'staffs');
    }

    GetStaff(_id:any) {
      return this.http.get(environment.apiBaseUrl + 'staffs/'+_id);
    }

    CreateStaff(formData:any): Observable<any> {
      return this.http.post(environment.apiBaseUrl + 'staffs',formData); 
    }

    EditStaff(_id:any,formData:any): Observable<any> {
      return this.http.put(environment.apiBaseUrl + 'staffs/'+_id,formData); 
    }

    DeleteStaff(_id:any): Observable<any> {
      return this.http.delete(environment.apiBaseUrl + 'staffs/'+_id); 
    }
  
  }
