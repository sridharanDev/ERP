import { Component,OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { StaffService } from 'src/app/services/staff.service';

@Component({
  selector: 'app-staff-tasks',
  templateUrl: './staff-tasks.component.html',
  styleUrls: ['./staff-tasks.component.css']
})
export class StaffTasksComponent implements OnInit
{

  allTasks:any = [];
  query:String = "";
  userId:String = ""
  taskId:any;
  isLoading:boolean = false;

  statusInput:String = "pending";

  constructor(private taskService:TaskService,private modalService: NgbModal,
    private toastr: ToastrService,private staffService:StaffService){}

  ngOnInit(): void 
  {
    
    if(this.staffService.isAuthenticated())
    {
      this.staffService.ValidateJWT(this.staffService.getUserData().token).subscribe((res:any)=>{
        this.userId = res._id;
        this.query = "staff="+this.userId;
        this.GetAllTasks();
      });
    } 
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
      this.taskService.GetTask(this.taskId).subscribe((res:any)=>{
        this.statusInput = res.status;
      },(error)=>{
        this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      });
    }    
    
  }

  GetAllTasks()
  {
    this.isLoading = true;
    this.taskService.GetTasks(this.query).subscribe((res:any)=>{
      this.allTasks = res;
      this.isLoading = false;
    },(error)=>{
      this.isLoading = false;
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
    });
  }
  
  OnStatusEditSumbit()
  {
    const formData = {status:this.statusInput};
    this.isLoading = true;
    this.taskService.EditTask(this.taskId,formData).subscribe((res:any)=>{
      this.GetAllTasks();
      this.modalService.dismissAll();
      this.isLoading = false;
      this.toastr.success('Task updated successfully.', 'Update task status',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.isLoading = false;
      this.modalService.dismissAll();
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
    });
  }

  onSelectFilter(event: any)
  {
    const selectedValue = event.target.value;
    this.query = "staff="+this.userId;
    if(selectedValue == "today tasks")
    {
      const currentDate = new Date();
      // console.log(currentDate);
    }
    else if(selectedValue == "pending tasks")
    {
      this.query += "&status=pending";
    }
    else if(selectedValue == "inProgres tasks")
    {
      this.query += "&status=inProgres";
    }
    else if(selectedValue == "completed tasks")
    {
      this.query += "&status=completed";   
    }
    this.GetAllTasks();
  }

  GetStatusColor(status:String):any
  {
    if(status == "completed")
    {
      return "bg-success"
    }
    else if(status == "pending")
    {
      return "bg-secondary"
    }
    else if(status == "inProgres")
    {
      return "bg-warning"
    }
  }
}
