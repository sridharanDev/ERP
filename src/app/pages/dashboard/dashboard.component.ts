import { Component,OnInit ,AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { StaffService } from 'src/app/services/staff.service';
import { StudentService } from 'src/app/services/student.service';
import { AssetService } from 'src/app/services/asset.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { IncomeService } from 'src/app/services/income.service';
import { forkJoin } from 'rxjs';
import { ChartConfiguration, ChartDataset, Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit,AfterViewInit 
{

  projects:any = {upcomming:0,ongoing:0,completed:0};
  staffs:any = {total:0,present:0,leave:0};
  students:any = {total:0,studying:0,completed:0};
  assets:any = {laptop:0,desktop:0,scanner:0};
  courses:any = {total:0,monthly:0,followups:0};
  pieChartData:any = [0,0,0];  

  attendaceFilter:any = "monthly";
  attendanceChart :any;

  constructor(private projectService:ProjectService,private staffService:StaffService,private incomeService:IncomeService,
    private studentService:StudentService,private assetService:AssetService,private attendanceService:AttendanceService){}

  ngOnInit(): void 
  {
  }
  
  ngAfterViewInit(): void 
  {
    this.GetProjectDetails();
    this.GetStudentDetails();
    this.GetStaffDetails();
    this.GetAssetDetails();
    this.GetAttendanceReport();
    this.GetOverallReport();
  }


  GetProjectDetails()
  {
    this.projectService.GetProjects("").subscribe((res:any)=>{
      for(let project of res)
      {
        if(project.status === "upcomming")
        {
          this.projects.upcomming++;
        }
        else if(project.status === "ongoing")
        {
          this.projects.ongoing++;
        }
        else if(project.status === "completed")
        {
          this.projects.completed++;
        }
      }      
    },(error)=>{

    });
  }

  GetStaffDetails()
  {
    this.staffService.GetStaffs().subscribe((res:any)=>{
      for(let satff of res)
      {
        this.staffs.total++;
      }
      this.GetAttendanceDetails(res);
      
    },(error)=>{

    });
  }

  GetStudentDetails()
  {
    this.studentService.GetStudents().subscribe((res:any)=>{
      for(let student of res)
      {
        this.students.total++;
        if(student.status === "converted")
        {
          this.students.studying++;
        }
        else if(student.status === "completed")
        {
          this.students.completed++;
        }
        else if(student.status !== "converted" && student.status !== "call back")
        {
          this.courses.total++;          
          if(this.isDateInCurrentMonth(student.createdAt))
          {
            this.courses.monthly++;
          }
        }
        else if(student.status === "call back")
        {
          this.courses.followups++;
        }
      } 
      
    },(error)=>{

    })
  }
  
  GetAssetDetails()
  {
    this.assetService.GetAssets().subscribe((res:any)=>{
      for(let asset of res)
      {
        if(asset.type.name === "Laptop")
        {
          this.assets.laptop++;
        }
        else if(asset.type.name === "Desktop")
        {
          this.assets.desktop++;
        }
        else if(asset.type.name === "Scanner")
        {
          this.assets.scanner++;
        }
      }
    },(error)=>{

    });
  }
  
  GetAttendanceDetails(staffs:any)
  {
    for(let staff of staffs)
    {
      this.attendanceService.GetStaffAttendances(staff._id).subscribe((res:any)=>{        
        for(let attendance of res)
        {
          const isToday = (this.formatDate(new Date()) === this.formatDate(attendance.date));
          
          if(isToday && attendance.status === "login")
          {
            this.staffs.present++;
          }
        }
        this.staffs.leave = this.staffs.total - this.staffs.present;
      },(error)=>{
    
      });
    }    
  }

  GetOverallProgress(projectCount: any, courseCount: any, rentCount: any) {
    const total = projectCount + courseCount + rentCount;
    
    const pieChartData: number[] = [
      (projectCount / total) * 100,
      (courseCount / total) * 100,
      (rentCount / total) * 100
    ];
  
    const canvas = document.getElementById('progress-pie-chart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
  
    const dataset: ChartDataset<"pie", number[]> = {
      data: pieChartData,
      backgroundColor: ['#1CBB8C', '#3B7DDD', '#FFCE56']
    };
  
    const pieChartConfig: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        datasets: [dataset],
        labels: ["Projects", "Courses", "Rents"]
      },
      options: {
      }
    };
  
    const chart = new Chart(ctx!, pieChartConfig);
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

  CreateOverAllProgressChart(projects: any, courses: any,rents:any) {
    const canvas = document.getElementById('allprogress-bar-chart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
  
    const datasets: ChartDataset<'bar', number[]>[] = [
      {
        label: 'Projects',
        backgroundColor: '#1CBB8C',
        data: projects
      },
      {
        label: 'Courses',
        backgroundColor: '#3B7DDD',
        data: courses
      },
      {
        label: 'Rents',
        backgroundColor: '#FFCE56',
        data: rents
      }
    ];
  
    const chartConfig: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov","Dec"],
        datasets: datasets
      },
      options: {
        responsive: true,
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
  
    new Chart(ctx!, chartConfig);
  }

  GetOverallReport() {
    let projectCount = 0;
    let courseCount = 0;
    let rentCount = 0;

    const projects:any = [0,0,0,0,0,0,0,0,0,0,0,0];
    const courses:any = [0,0,0,0,0,0,0,0,0,0,0,0];
    const rents:any = [0,0,0,0,0,0,0,0,0,0,0,0];
  
    const projectObservable = this.projectService.GetProjects("");
    const studentObservable = this.studentService.GetStudents();
    const rentObserveable = this.incomeService.GetIncomes();
  
    forkJoin([projectObservable, studentObservable,rentObserveable]).subscribe(([projectRes, studentRes,incomeRes]) => {
      projectCount = projectRes.length;      
      rentCount = incomeRes.incomesWithRents.length;
      for(let project of projectRes)
      {
        if(this.isDateInCurrentYear(project.createdAt))
        {
          const month = this.getMonthNumberFromDate(new Date(project.createdAt));
          projects[month]++;    
        }
      }
      
      for (const student of studentRes) {
        if (student.status === "converted") {
          if(this.isDateInCurrentYear(student.createdAt))
          {
            courseCount++;
            const month = this.getMonthNumberFromDate(new Date(student.createdAt));
            courses[month]++;    
          }
        }
      } 

      for(let rent of incomeRes.incomesWithRents)
      {
        if(this.isDateInCurrentYear(rent.createdAt))
        {
          const month = this.getMonthNumberFromDate(new Date(rent.createdAt));
          rents[month]++;
        }
      }
      this.CreateOverAllProgressChart(projects,courses,rents);     
      this.GetOverallProgress(projectCount, courseCount, rentCount);
    });
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
}
