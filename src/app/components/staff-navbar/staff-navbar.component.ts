import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StaffService } from 'src/app/services/staff.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staff-navbar',
  templateUrl: './staff-navbar.component.html',
  styleUrls: ['./staff-navbar.component.css']
})
export class StaffNavbarComponent 
{
  userProfile:any;

  constructor(private modalService: NgbModal,private staffService:StaffService,private router:Router){}

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
    const formData = this.staffService.getUserData();
    // this.staffService.GetProfile(formData).subscribe((res:any)=>{
    //   this.userProfile = res;
    // },(error)=>{
    //   console.log(error);
    // });
  }

  OnLogout()
  {
    this.staffService.clearUserData();
    this.modalService.dismissAll();
    this.router.navigate(['']);
  }
}
