import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-staff-tasks',
  templateUrl: './staff-tasks.component.html',
  styleUrls: ['./staff-tasks.component.css']
})
export class StaffTasksComponent implements OnInit
{

  allTasks:any = [1,2,3,4,5];

  constructor(){}

  ngOnInit(): void 
  {
    
  }
}
