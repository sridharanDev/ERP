import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';

interface Module {
  name: string;
  permissions: string[];
  _id: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders().set('Content-Type', 'application/json'); 

  GetProfile(formData:any):Observable<any>
  {
    return this.http.post(environment.apiBaseUrl + 'admin/profile',formData); 
  }

  GetRoles():Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'admin/roles'); 
  }

  GetRole(_id:any):Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'admin/roles/'+_id); 
  }

  CreateRole(formData:any):Observable<any>
  {
    return this.http.post(environment.apiBaseUrl + 'admin/roles',formData); 
  }

  EditRole(_id:any,formData:any):Observable<any>
  {
    return this.http.put(environment.apiBaseUrl + 'admin/roles/'+_id,formData); 
  }

  DeleteRole(_id:any):Observable<any>
  {
    return this.http.delete(environment.apiBaseUrl + 'admin/roles/'+_id); 
  }

  GetUsers():Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'admin'); 
  }

  GetUser(_id:any):Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'admin/'+_id); 
  }

  CreateUser(formData:any):Observable<any>
  {
    return this.http.post(environment.apiBaseUrl + 'admin',formData); 
  }

  EditUser(_id:any,formData:any):Observable<any>
  {
    return this.http.put(environment.apiBaseUrl + 'admin/'+_id,formData); 
  }

  DeleteUser(_id:any):Observable<any>
  {
    return this.http.delete(environment.apiBaseUrl + 'admin/'+_id); 
  }

  Login(formData:any):Observable<any>
  {
    return this.http.post(environment.apiBaseUrl + 'admin/login',formData); 
  }

  Logout(formData:any):Observable<any>
  {
    return this.http.post(environment.apiBaseUrl + 'admin/logout',formData); 
  }

  isAuthenticated()
  {    
    if(this.retrieveDataFromLocalStorage() != null)
    {
        return true;
    }
    return false;
  }
  

  hasModules(userRoles: string[]){
    const modulesData: Module[] = this.getUserData().modules;
    return modulesData.some(module => userRoles.includes(module.name));
  }

  getUserData()
  {   
    return this.retrieveDataFromLocalStorage();
  }

  setUserData(value:any)
  {
    const data = { value: value, expiration: Date.now() + 8 * 60 * 60 * 1000 };
    const json = JSON.stringify(data);
    localStorage.setItem('usersession', json);
  }

  retrieveDataFromLocalStorage()
  {
    const storedData = localStorage.getItem('usersession');    
    if (storedData) {
      const data = JSON.parse(storedData);
      if (data.expiration > Date.now()) {
        return data.value;
      } else {
        console.log('Data has expired');
        localStorage.removeItem('usersession');
        return null;
      }
    } else {
      console.log('No data found');
      return null;
    }
  }

  clearUserData()
  {
    localStorage.removeItem('usersession');
  }
}
