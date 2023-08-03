import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from 'src/app/services/project.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-upcomming-projects',
  templateUrl: './upcomming-projects.component.html',
  styleUrls: ['./upcomming-projects.component.css']
})
export class UpcommingProjectsComponent implements OnInit
{
  projectId:any = null;
  allProjects:any = [];
  isLoading:boolean = false;

  constructor(private projectService:ProjectService,private modalService: NgbModal,private toastr: ToastrService){}

  ngOnInit(): void 
  {
    this.GetAllProjects();
  }

  openModal(component:any,projectId:any)
  {
    this.projectId = projectId;
    const modalRef = this.modalService.open(component,{
      size: 'md',
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });
  }

  GetAllProjects()
  {
    this.isLoading = true;
    this.projectService.GetProjects("upcomming").subscribe((res:any)=>{
      this.allProjects = res;
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  DeleteSubmit()
  {
    if(!this.projectId)
    {
      return;
    }
    this.isLoading = true;
    this.projectService.DeleteProject(this.projectId).subscribe((res)=>{
      this.isLoading = false;
      this.GetAllProjects();
      this.modalService.dismissAll();
      this.toastr.error('Project deleted successfully.', 'Delete project',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }
}

