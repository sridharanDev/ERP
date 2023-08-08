import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private http: HttpClient) { }

  GetAttendances():Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'attendance'); 
  }

  DeleteAttendance(_id:any):Observable<any>
  {
    return this.http.delete(environment.apiBaseUrl + 'attendance/'+_id); 
  }
}
