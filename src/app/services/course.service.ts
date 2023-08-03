import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  GetCourses():Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'courses'); 
  }

  GetCourse(_id:any):Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'courses/'+_id); 
  }

  CreateCourse(formData:any):Observable<any>
  {
    return this.http.post(environment.apiBaseUrl + 'courses/',formData); 
  }

  EditCourse(_id:any,formData:any):Observable<any>
  {
    return this.http.put(environment.apiBaseUrl + 'courses/'+_id,formData); 
  }

  DeleteCourse(_id:any):Observable<any>
  {
    return this.http.delete(environment.apiBaseUrl + 'courses/'+_id); 
  }
}
