import { Injectable } from '@angular/core';
import { BreadcrumbItem } from './breadcrumb-item/breadcrumb-item.module';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  private breadcrumbItems$ = new BehaviorSubject<BreadcrumbItem[]>([]);
  breadcrumbItems = this.breadcrumbItems$.asObservable();

  setBreadcrumb(items: BreadcrumbItem[]) {
    this.breadcrumbItems$.next(items);
  }
}
