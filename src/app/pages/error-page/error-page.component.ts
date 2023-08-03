import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent 
{
  constructor(private location:Location){}

  GoBack()
  {
    this.location.back();
  }
}
