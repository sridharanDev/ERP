import { Component,OnInit ,ViewChild } from '@angular/core';
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

  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  dtOptions2: DataTables.Settings = {};
  dtTrigger2: Subject<any> = new Subject<any>();

  constructor(
    private staffService:StaffService,
    private attendanceService:AttendanceService,
    ){}

  ngOnInit(): void 
  {
    this.dtOptions1 = {
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: "<'row'<'col-sm-6'l<'float-left'B>><'col-sm-6'f>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-6'i><'col-sm-6'<'float-right'p>>>",
      buttons: [
        'csv', 'excel', 'pdf', 'print'
      ],
    } as DataTables.Settings;
    this.dtOptions2 = {
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: "<'row'<'col-sm-6'l<'float-left'B>><'col-sm-6'f>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-6'i><'col-sm-6'<'float-right'p>>>",
      buttons: [
        'csv', 'excel', 'pdf', 'print'
      ],
    } as DataTables.Settings;
    this.GetAllStaffs();
    this.GetStaffAttendance();
  }

  GetAllStaffs()
  {
    $('#datatable1').DataTable().destroy();
    this.staffService.GetStaffs().subscribe((res:any)=>{
      this.allStaffs = res;
      this.dtTrigger1.next(null);
    },(error)=>{

    });
  }

  GetStaffAttendance()
  {    
    const allAttendance:any = [];
    $('#datatable2').DataTable().destroy();
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
      this.dtTrigger2.next(null);
    });
  }

  toggleTable()
  {
    
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
