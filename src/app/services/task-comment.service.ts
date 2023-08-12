import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TaskCommentCommentService {

  constructor(private http: HttpClient) { }

  GetTaskComments(query:any):Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'taskcomments?'+query); 
  }

  GetTaskComment(_id:any):Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'taskcomments/'+_id); 
  }

  CreateTaskComment(formData:any):Observable<any>
  {
    return this.http.post(environment.apiBaseUrl + 'taskcomments/',formData); 
  }

  EditTaskComment(_id:any,formData:any):Observable<any>
  {
    return this.http.put(environment.apiBaseUrl + 'taskcomments/'+_id,formData); 
  }

  DeleteTaskComment(_id:any):Observable<any>
  {
    return this.http.delete(environment.apiBaseUrl + 'taskcomments/'+_id); 
  }
}
