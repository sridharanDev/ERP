import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  GetStudents():Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'students'); 
  }
  GetStudentsWithFiter(status:any):Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'students?status='+status); 
  }

  GetStudent(_id:any):Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'students/'+_id); 
  }

  CreateStudent(formData:any):Observable<any>
  {
    return this.http.post(environment.apiBaseUrl + 'students/',formData); 
  }

  EditStudent(_id:any,formData:any):Observable<any>
  {
    return this.http.put(environment.apiBaseUrl + 'students/'+_id,formData); 
  }

  DeleteStudent(_id:any):Observable<any>
  {
    return this.http.delete(environment.apiBaseUrl + 'students/'+_id); 
  }
}
