import { Component,OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-project-report',
  templateUrl: './project-report.component.html',
  styleUrls: ['./project-report.component.css']
})
export class ProjectReportComponent implements OnInit
{
  allProjects:any = [];

  filter1:string = "all_projects"
  filter2:string = "NA"
  filter3:string = "all_tasks"

  projectList:any = [];
  taskList:any = [];

  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  dtOptions2: DataTables.Settings = {};
  dtTrigger2: Subject<any> = new Subject<any>();

  constructor(
    private projectService:ProjectService,
    private taskService:TaskService,
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
    this.GetAllProjects();
    this.GetProjectReport();
    this.GetTaskReports();
  }

  GetAllProjects()
  {
    this.projectService.GetProjects("").subscribe((res:any)=>{
      this.allProjects = res;
    },(error)=>{

    });
  }
  
  GetProjectReport()
  {
    if(this.filter1 === "all_projects")
    {
      this.filter3 = "all_tasks"
      $('#datatable1').DataTable().destroy();
      const query = this.filter2 == "NA" ? "" : "status="+this.filter2;
      const projects:any = [];
      this.projectService.GetProjects(query).subscribe((res:any)=>{
        for(const project of res)
        {
          projects.push(project);
        }
        this.projectList = projects;
        this.dtTrigger1.next(null);
      },(error)=>{
    
      });
    }
    else
    {
      this.filter2 = "NA"
    }
  }

  GetTaskReports()
  {
    let query = "project="+this.filter1;
    if(this.filter3 != "all_tasks")
    {
      query += "&status="+this.filter3;
    }
    $('#datatable2').DataTable().destroy();
    this.taskService.GetTasks(query).subscribe((res:any)=>{
      this.taskList = res;
      this.dtTrigger2.next(null);
    },(error)=>{

    });
  }
}
