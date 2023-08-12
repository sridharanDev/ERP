import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AttendanceService } from 'src/app/services/attendance.service';
import { CalendarEvent } from 'angular-calendar';
import { AttendanceCalendarComponent } from 'src/app/components/attendance-calendar/attendance-calendar.component';
import { StaffService } from 'src/app/services/staff.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit, AfterViewInit {
  @ViewChild(AttendanceCalendarComponent) calendarComponent!: AttendanceCalendarComponent;
  
  currentTime: Date = new Date();

  isLoading:boolean = false;

  attendance:any = [];

  eventColor:any ={
    "login":{ primary: '#54B435', secondary: '#55B6353A' },
    "logout":{ primary: '#C70039', secondary: '#C700393A' },
    "lunch out":{ primary: '#FFA41B', secondary: '#FFA41B3A' },
    "lunch in":{ primary: '#FFA41B', secondary: '#FFA41B3A' },
    "break out":{ primary: '#8CABFF', secondary: '#8CABFF3A' },
    "break in":{ primary: '#8CABFF', secondary: '#8CABFF3A' },
  }

  selectedAttStatus:string = "NA";

  constructor(private attendanceService: AttendanceService,private staffService:StaffService,
    private toastr: ToastrService) {}

  ngOnInit() {
    this.updateTime();
    setInterval(() => {
      this.updateTime();
    }, 1000);
    if(this.staffService.isAuthenticated())
    {
      this.GetAttendance();
    } 
  }
  
  ngAfterViewInit() 
  {
  }

  GetAttendance() {
    this.isLoading = true;
    this.staffService.ValidateJWT(this.staffService.getUserData().token).subscribe((res:any)=>{
      const userId = res._id;
      this.attendanceService.GetStaffAttendances(userId).subscribe(
        (res: any) => {
          this.calendarComponent.events = [];
          for(let attendance of res)
          {
            const eventTitleWithTime = attendance.status + ' ' + new Date(attendance.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            this.AddEvent(attendance.date,eventTitleWithTime,this.eventColor[attendance.status]);
          }
          this.attendance = res;
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
        }
      );
    });
  }

  AddEvent(start:any,title:any,color:any) {
    const newEvent: CalendarEvent = {
      start: new Date(start),
      title: title,
      color: color,
    };
    this.calendarComponent.addEvent(newEvent);
  }

  SubmitAttendance()
  {
    if(this.selectedAttStatus == "NA") return;
    const staff_id = this.staffService.getUserData().staff_id;
    const formData = {staff_id:staff_id,status:this.selectedAttStatus};

    this.isLoading = true;
    this.attendanceService.AddAttendances(formData).subscribe((res:any)=>{
      this.toastr.success(this.selectedAttStatus,"Attendance",{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.selectedAttStatus = "NA";
      this.isLoading = false;
      this.GetAttendance();
    },(error)=>{
      this.toastr.error(error.error.message,"Attendance",{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.selectedAttStatus = "NA";
      this.isLoading = false;
    });
  }

  updateTime() {
    this.currentTime = new Date();
    
  }
}
