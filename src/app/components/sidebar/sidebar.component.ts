import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(private adminService:AdminService){}

  hasModules(modules:string[])
  {    
    return this.adminService.hasModules(modules);
  }

}
