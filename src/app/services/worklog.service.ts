import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorklogService {

  constructor(private http: HttpClient) { }

  GetWorklogs(query:any):Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'worklogs?'+query); 
  }

  GetWorklog(_id:any):Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'worklogs/'+_id); 
  }

  CreateWorklog(formData:any):Observable<any>
  {
    return this.http.post(environment.apiBaseUrl + 'worklogs/',formData); 
  }

  EditWorklog(_id:any,formData:any):Observable<any>
  {
    return this.http.put(environment.apiBaseUrl + 'worklogs/'+_id,formData); 
  }

  DeleteWorklog(_id:any):Observable<any>
  {
    return this.http.delete(environment.apiBaseUrl + 'worklogs/'+_id); 
  }
}
