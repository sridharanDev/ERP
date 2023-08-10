import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StaffService } from 'src/app/services/staff.service';
import { Router } from '@angular/router';
import { AttendanceService } from 'src/app/services/attendance.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-staff-navbar',
  templateUrl: './staff-navbar.component.html',
  styleUrls: ['./staff-navbar.component.css']
})
export class StaffNavbarComponent 
{
  userProfile:any;

  constructor(private modalService: NgbModal,private staffService:StaffService,
    private router:Router,private attendanceService:AttendanceService,private toastr: ToastrService){}

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
    this.AddAttendance();
  }
  
  AddAttendance()
  {
    const staff_id = this.staffService.getUserData().staff_id;
    const formData = {staff_id:staff_id,status:"logout"};
    this.attendanceService.AddAttendances(formData).subscribe((res:any)=>{
      console.log(res);
      this.staffService.clearUserData();
      this.modalService.dismissAll();
      this.router.navigate(['']);
    },(error)=>{
      console.log(error);
      this.toastr.error(error.error.message,"Attendance",{timeOut: 3000,closeButton: true,progressBar: true,},)
      this.staffService.clearUserData();
      this.modalService.dismissAll();
      this.router.navigate(['']);
    });
  }
}
