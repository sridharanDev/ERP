import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaveApplicationService {

  constructor(private http: HttpClient) { }

  GetApplications(query:any):Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'leaveapplications?'+query); 
  }

  GetApplication(_id:any):Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'leaveapplications/'+_id); 
  }

  CreateApplication(formData:any):Observable<any>
  {
    return this.http.post(environment.apiBaseUrl + 'leaveapplications/',formData); 
  }

  EditApplication(_id:any,formData:any):Observable<any>
  {
    return this.http.put(environment.apiBaseUrl + 'leaveapplications/'+_id,formData); 
  }

  DeleteApplication(_id:any):Observable<any>
  {
    return this.http.delete(environment.apiBaseUrl + 'leaveapplications/'+_id); 
  }
}
