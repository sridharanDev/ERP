import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit
{

  userProfile:any;

  constructor(private modalService: NgbModal,private adminService:AdminService,private router:Router){}

  ngOnInit(): void 
  {
    this.GetProfile();  
  }

  openModal(component:any)
  {
    const modalRef = this.modalService.open(component,{
      size: 'md',
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });
  }

  GetProfile()
  {
    const formData = this.adminService.getUserData();
    this.adminService.GetProfile(formData).subscribe((res:any)=>{
      this.userProfile = res;
    },(error)=>{
      console.log(error);
    });
  }

  OnLogout()
  {
    this.adminService.clearUserData();
    this.modalService.dismissAll();
    this.router.navigate(['admin','login']);
  }
}
