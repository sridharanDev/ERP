import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  GetTasks(query:any):Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'tasks?'+query); 
  }

  GetTask(_id:any):Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'tasks/'+_id); 
  }

  CreateTask(formData:any):Observable<any>
  {
    return this.http.post(environment.apiBaseUrl + 'tasks/',formData); 
  }

  EditTask(_id:any,formData:any):Observable<any>
  {
    return this.http.put(environment.apiBaseUrl + 'tasks/'+_id,formData); 
  }

  DeleteTask(_id:any):Observable<any>
  {
    return this.http.delete(environment.apiBaseUrl + 'tasks/'+_id); 
  }
}
