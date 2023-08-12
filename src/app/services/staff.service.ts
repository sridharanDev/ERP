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

    GetProfile(_id:any) {
      return this.http.get(environment.apiBaseUrl + 'staffs/profile/'+_id);
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

    Login(formData:any):Observable<any>
    {
      return this.http.post(environment.apiBaseUrl + 'staffs/login',formData); 
    }

    ValidateJWT(token:any):Observable<any>
    {
      return this.http.post(environment.apiBaseUrl + 'validate-token/'+token,{}); 
    }

    isAuthenticated()
    {    
      if(this.retrieveDataFromLocalStorage() != null)
      {
          return true;
      }
      return false;
    }

    getUserData()
    {   
      const token = this.retrieveDataFromLocalStorage().token;
      return this.retrieveDataFromLocalStorage();
    }

    setUserData(value:any)
    {
      const data = { value: value, expiration: Date.now() + 8 * 60 * 60 * 1000 };
      const json = JSON.stringify(data);
      localStorage.setItem('staffsession', json);
    }
  
    retrieveDataFromLocalStorage()
    {
      const storedData = localStorage.getItem('staffsession');    
      if (storedData) {
        const data = JSON.parse(storedData);
        if (data.expiration > Date.now()) {
          return data.value;
        } else {
          console.log('Data has expired');
          localStorage.removeItem('staffsession');
          return null;
        }
      } else {
        console.log('No data found');
        return null;
      }
    }

    clearUserData()
    {
      localStorage.removeItem('staffsession');
    }
  
  }
