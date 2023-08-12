import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  GetNotifications(query:any):Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'notifications?'+query); 
  }
  
  ViewNotification(_id:any,formData:any):Observable<any>
  {
    return this.http.post(environment.apiBaseUrl + 'notifications/'+_id,formData); 
  }

  CreateNotification(formData:any):Observable<any>
  {
    return this.http.post(environment.apiBaseUrl + 'notifications',formData); 
  }
}
