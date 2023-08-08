import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FormValidatorService } from '../../utils/form-validator.service';
import { StaffService } from '../../services/staff.service';
import { ProjectService } from '../../services/project.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-manage-tasks',
  templateUrl: './manage-tasks.component.html',
  styleUrls: ['./manage-tasks.component.css']
})
export class ManageTasksComponent implements OnInit
{

  allTasks:any = [];
  allStaffs:any = [];
  allProjects:any = [];

  taskId:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private modalService: NgbModal,private toastr: ToastrService,
    private formValidatorService:FormValidatorService,private staffService:StaffService,
    private projectService:ProjectService){}

  ngOnInit(): void 
  {
    this.GetAllStaffs();
    this.GetAllProjects();
  }

  openModal(component:any,taskId:any)
  {
    this.taskId = taskId;

    const modalRef = this.modalService.open(component,{
      size: 'md',
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });
    
    if(this.taskId)
    {
      
    }    
    
  }

  GetAllStaffs()
  {
    this.staffService.GetStaffs().subscribe((res:any)=>{
      this.allStaffs = res;
    },(error)=>{

    });
  }

  GetAllProjects()
  {
    this.projectService.GetProjects("ongoing").subscribe((res:any)=>{
      this.allProjects = res;
    },(error)=>{

    });
  }
}
