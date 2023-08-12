import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  GetInvoiceNumber():Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'invoice-no'); 
  }
  GetInvoices(query:any):Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'invoices?'+query); 
  }

  GetInvoice(_id:any):Observable<any>
  {
    return this.http.get(environment.apiBaseUrl + 'invoices/'+_id); 
  }

  CreateInvoice(formData:any):Observable<any>
  {
    return this.http.post(environment.apiBaseUrl + 'invoices/',formData); 
  }

  EditInvoice(_id:any,formData:any):Observable<any>
  {
    return this.http.put(environment.apiBaseUrl + 'invoices/'+_id,formData); 
  }

  DeleteInvoice(_id:any):Observable<any>
  {
    return this.http.delete(environment.apiBaseUrl + 'invoices/'+_id); 
  }
}
