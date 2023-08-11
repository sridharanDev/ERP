import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders().set('Content-Type', 'application/json');  

  GetSchedules() {
    return this.http.get(environment.apiBaseUrl + 'schedules');
  }

  GetSchedule(_id:any) {
    return this.http.get(environment.apiBaseUrl + 'schedules/'+_id);
  }

  CreateSchedule(formData:any): Observable<any> {
    return this.http.post(environment.apiBaseUrl + 'schedules',formData); 
  }

  EditSchedule(_id:any,formData:any): Observable<any> {
    return this.http.put(environment.apiBaseUrl + 'schedules/'+_id,formData); 
  }

  DeleteSchedule(_id:any): Observable<any> {
    return this.http.delete(environment.apiBaseUrl + 'schedules/'+_id); 
  }
}
