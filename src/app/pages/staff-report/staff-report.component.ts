import { Component,OnInit } from '@angular/core';
import { StaffService } from 'src/app/services/staff.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-staff-report',
  templateUrl: './staff-report.component.html',
  styleUrls: ['./staff-report.component.css']
})
export class StaffReportComponent implements OnInit
{
  filterInput1:String = "all_staffs";
  filterInput2:String = "all_attendance";

  attFromDate:String = "";
  attToDate:String = "";

  loginType:String = "NA";

  allStaffs:any = [];
  allAttendance:any = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private staffService:StaffService,
    private attendanceService:AttendanceService,
    ){}

  ngOnInit(): void 
  {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    };
    this.GetAllStaffs();
    this.GetStaffAttendance();
  }

  GetAllStaffs()
  {
    $('#datatable').DataTable().destroy();
    this.staffService.GetStaffs().subscribe((res:any)=>{
      this.allStaffs = res;
      this.dtTrigger.next(null);
    },(error)=>{

    });
  }

  GetStaffAttendance()
  {    
    const allAttendance:any = [];
    $('#datatable1').DataTable().destroy();
    this.attendanceService.GetAttendances().subscribe((res:any)=>{
      if(this.filterInput2 !== "all_attendance")
      {
        for(const attendance of res)
        {        
          if(attendance.staff._id === this.filterInput2)
          {
            if(this.attFromDate.length > 0 && this.attToDate.length > 0)
            {

              if(this.isDateGreaterThanOrEqual(attendance.date,this.attFromDate) && this.isDateLessThanOrEqual(attendance.date,this.attToDate) && (this.attFromDate !== this.attToDate))
              {
                if(this.loginType === "ontime")
                {
                  if(!attendance.lateLogin)
                  {
                    allAttendance.push(attendance);
                  }
                }
                else if(this.loginType === "late")
                {
                  if(attendance.lateLogin)
                  {
                    allAttendance.push(attendance);
                  }
                }
                else
                {
                  allAttendance.push(attendance);
                }
              }
              else
              {
                if(this.loginType === "ontime")
                {
                  if(!attendance.lateLogin)
                  {
                    allAttendance.push(attendance);
                  }
                }
                else if(this.loginType === "late")
                {
                  if(attendance.lateLogin)
                  {
                    allAttendance.push(attendance);
                  }
                }
                else
                {
                  allAttendance.push(attendance);
                }
              }
            }
            else
            {
              if(this.loginType === "ontime")
              {
                if(!attendance.lateLogin)
                {
                  allAttendance.push(attendance);
                }
              }
              else if(this.loginType === "late")
              {
                if(attendance.lateLogin)
                {
                  allAttendance.push(attendance);
                }
              }
              else
              {
                allAttendance.push(attendance);
              }
            }
          }
        }
        this.allAttendance = allAttendance;
      }
      else
      {
        for(const attendance of res)
        {
          if(this.attFromDate.length > 0 && this.attToDate.length > 0)
          {

            if(this.isDateGreaterThanOrEqual(attendance.date,this.attFromDate) && this.isDateLessThanOrEqual(attendance.date,this.attToDate) && (this.attFromDate !== this.attToDate))
            {
              if(this.loginType === "ontime")
              {
                if(!attendance.lateLogin)
                {
                  allAttendance.push(attendance);
                }
              }
              else if(this.loginType === "late")
              {
                if(attendance.lateLogin)
                {
                  allAttendance.push(attendance);
                }
              }
              else
              {
                allAttendance.push(attendance);
              }
            }
            else
            {
              if(this.areDatesEqual(attendance.date,this.attFromDate))
              {
                if(this.loginType === "ontime")
                {
                  if(!attendance.lateLogin)
                  {
                    allAttendance.push(attendance);
                  }
                }
                else if(this.loginType === "late")
                {
                  if(attendance.lateLogin)
                  {
                    allAttendance.push(attendance);
                  }
                }
                else
                {
                  allAttendance.push(attendance);
                }
              }
            }
          }
          else
          {
            if(this.loginType === "ontime")
            {
              if(!attendance.lateLogin)
              {
                allAttendance.push(attendance);
              }
            }
            else if(this.loginType === "late")
            {
              if(attendance.lateLogin)
              {
                allAttendance.push(attendance);
              }
            }
            else
            {
              allAttendance.push(attendance);
            }
          }
        }
        this.allAttendance = allAttendance;
      }
    });
  }

  areDatesEqual(dateString1: any, dateString2: any) {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
  
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth();
    const day1 = date1.getDate();
  
    const year2 = date2.getFullYear();
    const month2 = date2.getMonth();
    const day2 = date2.getDate();
  
    return year1 === year2 && month1 === month2 && day1 === day2;
  }
  
  isDateLessThan(dateString1: any, dateString2: any) {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
  
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);
  
    return date1.getTime() < date2.getTime();
  }
  
  isDateGreaterThan(dateString1: any, dateString2: any) {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
  
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);
  
    return date1.getTime() > date2.getTime();
  }
  
  isDateGreaterThanOrEqual(dateString1: any, dateString2: any) {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
  
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);
  
    return date1.getTime() >= date2.getTime();
  }
  
  isDateLessThanOrEqual(dateString1: any, dateString2: any) {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
  
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);
  
    return date1.getTime() <= date2.getTime();
  }
}
