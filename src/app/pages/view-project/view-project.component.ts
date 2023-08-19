import { Component,OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent implements OnInit
{
  projectDetails:any;

  constructor(private projectService:ProjectService,private route:ActivatedRoute){}

  ngOnInit(): void 
  {
    const projectId = this.route.snapshot.params['id'];
    this.GetProjectDetails(projectId);
  }

  GetProjectDetails(projectId:any)
  {
    this.projectService.GetProject(projectId).subscribe((res:any)=>{
      this.projectDetails = res;
    },(error)=>{

    });
  }

  GetStatusColor(status:String):any
  {
    if(status == "upcomming")
    {
      return "bg-primary"
    }
    else if(status == "completed")
    {
      return "bg-success"
    }
    else if(status == "ongoing")
    {
      return "bg-warning"
    }
    else if(status == "pipeline")
    {
      return "bg-secondary"
    }
    else if(status == "call back")
    {
      return "bg-primary"
    }
  }
}
