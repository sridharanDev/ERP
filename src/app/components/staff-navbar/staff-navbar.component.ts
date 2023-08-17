import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StaffService } from 'src/app/services/staff.service';
import { Router } from '@angular/router';
import { AttendanceService } from 'src/app/services/attendance.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-staff-navbar',
  templateUrl: './staff-navbar.component.html',
  styleUrls: ['./staff-navbar.component.css']
})
export class StaffNavbarComponent 
{
  userProfile:any;
  userId:String = ""
  notificationSound!: HTMLAudioElement;
  allNotifications:any = [];

  constructor(private modalService: NgbModal,private staffService:StaffService,private notificationService:NotificationService,
    private router:Router,private attendanceService:AttendanceService,private toastr: ToastrService)
    {
      this.notificationSound = new Audio('assets/audio/notification.mp3');
    }

  ngOnInit(): void 
  {
    if(this.staffService.isAuthenticated())
    {
      this.staffService.ValidateJWT(this.staffService.getUserData().token).subscribe((res:any)=>{
        this.userId = res._id;
        this.GetProfile();  
        setInterval(() => {
          this.GetNotifications();
        }, 3000);
      });
    } 
  }
  playNotification() 
  {
    this.notificationSound.play();
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
    this.staffService.GetProfile(this.userId).subscribe((res:any)=>{
      this.userProfile = res;      
    },(error)=>{
      console.log(error);
    });
  }

  GetNotifications()
  {
    const query = "recipient="+this.userId;
    this.notificationService.GetNotifications(query).subscribe((res:any)=>{
      this.allNotifications = res;
    },(error)=>{
      console.log(error);
    });
  }

  RedirectNotification(_id:any,type:any)
  {
    const formData = {staff_id:this.userId};
    if(type === "Task")
    {
      this.notificationService.ViewNotification(_id,formData).subscribe((res:any)=>{
        this.router.navigate(['/profile','tasks']);
      },(error)=>{
        console.log(error);
        
      });
    }
    else if(type === "Attendance")
    { 
      this.notificationService.ViewNotification(_id,formData).subscribe((res:any)=>{
        this.router.navigate(['profile','attendance']);
      },(error)=>{
        console.log(error);
        
      });
    }
    else if(type === "Leave")
    { 
      this.notificationService.ViewNotification(_id,formData).subscribe((res:any)=>{
        this.router.navigate(['profile','leave-application']);
      },(error)=>{
        console.log(error);
        
      });
    }
    else
    {
      this.notificationService.ViewNotification(_id,formData).subscribe((res:any)=>{
      },(error)=>{
        console.log(error);
        
      });
    }
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
