import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  GetProjects(status:any):Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'projects?status='+status); 
  }

  GetProject(_id:any):Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'projects/'+_id); 
  }

  CreateProject(formData:any):Observable<any>
  {
    return this.http.post(environment.apiBaseUrl + 'projects/',formData); 
  }

  EditProject(_id:any,formData:any):Observable<any>
  {
    return this.http.put(environment.apiBaseUrl + 'projects/'+_id,formData); 
  }

  DeleteProject(_id:any):Observable<any>
  {
    return this.http.delete(environment.apiBaseUrl + 'projects/'+_id); 
  }
}
