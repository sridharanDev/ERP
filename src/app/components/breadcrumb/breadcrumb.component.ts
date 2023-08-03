import { Component,OnInit,OnDestroy } from '@angular/core';
import { BreadcrumbItem } from '../../services/breadcrumb-item/breadcrumb-item.module';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit,OnDestroy 
{
  breadcrumbItems: BreadcrumbItem[] = [];
  private breadcrumbSubscription!: Subscription;

  constructor(private breadcrumbService: BreadcrumbService){}

  ngOnInit(): void 
  {
    this.breadcrumbSubscription = this.breadcrumbService.breadcrumbItems.subscribe(
      (items) => {
        this.breadcrumbItems = items;
      }
    );
  }
  ngOnDestroy() {
    this.breadcrumbSubscription.unsubscribe();
  }
}
