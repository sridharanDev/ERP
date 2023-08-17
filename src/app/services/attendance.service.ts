import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private http: HttpClient) { }

  AddAttendances(formData:any):Observable<any>
  {
    return this.http.post(environment.apiBaseUrl + 'attendance',formData); 
  }

  GetAttendances():Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'attendance'); 
  }

  GetStaffAttendances(_id:any):Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'attendance/staff/'+_id); 
  }

  DeleteAttendance(_id:any,date:any):Observable<any>
  {
    return this.http.delete(environment.apiBaseUrl + 'attendance/'+_id +"/"+date); 
  }
}
