import { Component,OnInit } from '@angular/core';
import { StaffService } from 'src/app/services/staff.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';
import { forkJoin } from 'rxjs';
import { ChartConfiguration, ChartDataset, Chart } from 'chart.js';

@Component({
  selector: 'app-staff-dashboard',
  templateUrl: './staff-dashboard.component.html',
  styleUrls: ['./staff-dashboard.component.css']
})
export class StaffDashboardComponent implements OnInit
{

  userId:any = null;
  staffProfile:any;

  allProjects:any = [];
  allPendingTasks:any = [];
  attendaceFilter:any = "monthly";
  attendanceChart :any;

  constructor(
    private staffService:StaffService,
    private attendanceService:AttendanceService,
    private projectService:ProjectService,
    private taskService:TaskService,
  ){}

  ngOnInit(): void 
  {
    if(this.staffService.isAuthenticated())
    {
      this.staffService.ValidateJWT(this.staffService.getUserData().token).subscribe((res:any)=>{
        this.userId = res._id;
        this.GetStaffProfile();
        this.GetAttendanceReport();
        this.GetProjectsAndTasks();
      });
    } 
  }

  GetStaffProfile()
  {
    this.staffService.GetProfile(this.userId).subscribe((res:any)=>{
      this.staffProfile = res;
    },(error)=>{

    });
  }

  GetProjectsAndTasks()
  {
    const projectQuery = "staffs="+this.userId;
    const taskQuery = "staff="+this.userId;
    const projectObservable = this.projectService.GetProjects(projectQuery);
    const taskObservable = this.taskService.GetTasks(taskQuery);
    
    const projects:any = [];
    const tasks:any = [];
    forkJoin([projectObservable,taskObservable]).subscribe(([projectRes,TaskRes])=>{
      for(const project of projectRes)
      {
        let pending = 0;
        let completed = 0;
        for(const task of TaskRes)
        {
          if(task.status === "pending")
          {
            tasks.push(task);
            pending++;
          }
          else if(task.status === "completed")
          {
            completed++;
          }
        }
        projects.push({name:project.project_name,pending:pending,completed:completed});
      }
      this.allProjects = projects;
      this.allPendingTasks = tasks;
    });
  }

  GetAttendanceReport()
  {

    const labels:any = [];
    const lateLogin:any = [];
    const ontimeLogin:any = [];
    if(this.attendaceFilter == "weekly")
    {
      for(let i=1;i <= this.calculateWeeksInMonth();i++)
      {
        labels.push("Week "+i);
        lateLogin.push(0);
        ontimeLogin.push(0);
      }
    }
    else if(this.attendaceFilter == "monthly")
    {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov","Dec"];
      for(let month of months)
      {
        labels.push(month);
        lateLogin.push(0);
        ontimeLogin.push(0);
      }
    }

    this.attendanceService.GetAttendances().subscribe((res:any)=>{
      for(let attendace of res)
      {        
        if(attendace.staff._id !== this.userId) continue;
        if(this.attendaceFilter == "weekly")
        {
          if(this.isDateInCurrentYear(attendace.date))
          {
            const week = this.getWeekNumberInCurrentMonth(new Date(attendace.date))-1;
            if(attendace.lateLogin)
            {
              lateLogin[week]++;
            }
            else
            {
              ontimeLogin[week]++;
            }
          }
        }
        else if(this.attendaceFilter == "monthly")
        {
          if(this.isDateInCurrentYear(attendace.date))
          {
            const month = this.getMonthNumberFromDate(new Date(attendace.date));
            if(attendace.lateLogin)
            {
              lateLogin[month]++;
            }
            else
            {
              ontimeLogin[month]++;
            }
          }
          
        }
        
      }
      this.CreateAttendanceChart(labels,lateLogin,ontimeLogin);
      
    },(error)=>{

    })
  }

  CreateAttendanceChart(labels: any, lateLogin: any, ontimeLogin: any) {
    const canvas = document.getElementById('attendance-bar-chart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (this.attendanceChart) {
      this.attendanceChart.destroy();
    }
  
    const datasets: ChartDataset<'bar', number[]>[] = [
      {
        label: 'On-Time Attendance',
        backgroundColor: '#1CBB8C',
        data: ontimeLogin
      },
      {
        label: 'Late Attendance',
        backgroundColor: '#DC3545',
        data: lateLogin
      },
    ];
  
    const chartConfig: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 2,
        indexAxis: 'x',
        scales: {
          x: {
            stacked: false
          },
          y: {
            stacked: false
          }
        }
      }
    };
  
    this.attendanceChart = new Chart(ctx!, chartConfig);
  }

  calculateWeeksInMonth() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month, lastDayOfMonth.getDate() + 1);

    const daysInMonth = (lastDay.getTime() - firstDay.getTime()) / (1000 * 3600 * 24);
    return Math.ceil(daysInMonth / 7);
  }

  getWeekNumberInCurrentMonth(inputDate: Date): number {
    const currentYear = inputDate.getFullYear();
    const currentMonth = inputDate.getMonth();
    
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const daysOffset = firstDayOfMonth.getDay() === 0 ? 1 : 8 - firstDayOfMonth.getDay();
    
    const timeDifference = inputDate.getTime() - firstDayOfMonth.getTime(); // Get the time difference in milliseconds
    const daysDifference = timeDifference / (24 * 60 * 60 * 1000);
    
    const weekNumber = Math.ceil((daysDifference + daysOffset) / 7);
    
    return weekNumber;
  }

  getMonthNumberFromDate(inputDate: Date): number {
    return inputDate.getMonth();
  }

  isDateInCurrentYear(dateString: string): boolean {
    const currentDate = new Date();
    const inputDate = new Date(dateString);
  
    return currentDate.getFullYear() === inputDate.getFullYear();
  }
  
  isDateInCurrentMonth(dateString: string): boolean {
    const currentDate = new Date();
    const inputDate = new Date(dateString);
  
    return (
      currentDate.getFullYear() === inputDate.getFullYear() &&
      currentDate.getMonth() === inputDate.getMonth()
    );
  }

  formatDate(dateString:any) {
    const date = new Date(dateString);
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

  formatTimeTo12Hour(time: string): string {
    const [hours, minutes] = time.split(':');
    let formattedTime = '';
  
    const numericHours = Number(hours);
    if (numericHours === 0) {
      formattedTime = `12:${minutes} AM`;
    } else if (numericHours < 12) {
      formattedTime = `${numericHours}:${minutes} AM`;
    } else if (numericHours === 12) {
      formattedTime = `12:${minutes} PM`;
    } else {
      formattedTime = `${numericHours - 12}:${minutes} PM`;
    }
  
    return formattedTime;
  }
}
