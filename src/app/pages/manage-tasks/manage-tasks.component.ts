import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FormValidatorService } from '../../utils/form-validator.service';
import { CustomValidatorService } from '../../utils/custom-validator.service';
import { NotificationService } from 'src/app/services/notification.service';
import { StaffService } from '../../services/staff.service';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { TaskCommentCommentService } from 'src/app/services/task-comment.service';
import { AdminService } from 'src/app/services/admin.service';
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

  isLoading:boolean = false;
  allComments:any = [];
  taskId:any;
  commentField:String = "";
  commentIntervalId: any;

  userId:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  taskForm = new FormGroup({
    title :new FormControl('',Validators.required),
    description :new FormControl('',Validators.required),
    project :new FormControl('NA'),
    staff :new FormControl('NA',[Validators.required,this.CustomValidators.isEqual('NA')]),
  });

  constructor(private modalService: NgbModal,private toastr: ToastrService,
    private formValidatorService:FormValidatorService,private staffService:StaffService,
    private projectService:ProjectService,private taskService:TaskService,
    private CustomValidators:CustomValidatorService,private notificationService:NotificationService,
    private commentService:TaskCommentCommentService,private adminService:AdminService){}

  ngOnInit(): void 
  {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      columnDefs :[
        {
          targets:[0],
          width:'10px'
        },
        {
          targets:[3],
          width:'20px'
        },
        {
          targets:[4],
          width:'50px'
        },
        {
          targets:[5],
          width:'30px',
          className: 'text-center',
        },
        {
          targets:[6],
          width:'10px',
          orderable: false,
          searchable: false,
        },
      ]
    };
    this.GetAllStaffs();
    this.GetAllProjects();
    this.GetAlltasks();
    if(this.adminService.isAuthenticated())
    {
      this.adminService.ValidateJWT(this.adminService.getUserData().token).subscribe((res:any)=>{
        this.userId = res._id;
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
    this.taskForm.reset();
    this.commentField = "";
    if(this.taskId)
    {
      this.taskService.GetTask(this.taskId).subscribe((res:any)=>{
        this.taskForm.patchValue(res);
        this.taskForm.get("project")?.setValue(res.project?res.project._id:"NA");        
        this.taskForm.get("staff")?.setValue(res.staff._id);       
        this.commentIntervalId = setInterval(() => {
          this.GetAllComments(this.taskId);
        }, 1000);
      },(error)=>{
        this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      });
    }    
    
  }

  DestroyIntravel()
  {
    if (this.commentIntervalId) {
      clearInterval(this.commentIntervalId);
    }
  }

  GetAllStaffs()
  {
    this.staffService.GetStaffs().subscribe((res:any)=>{
      this.allStaffs = res;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
    });
  }

  GetAllProjects()
  {
    this.projectService.GetProjects("").subscribe((res:any)=>{
      this.allProjects = res;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
    });
  }

  GetAlltasks()
  {

    this.isLoading = true;
    $('#datatable').DataTable().destroy();
    this.taskService.GetTasks("").subscribe((res:any)=>{
      this.allTasks = res;
      this.dtTrigger.next(null);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  OnAddFormSubmit()
  {
    if(this.taskForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.taskForm);
      return;
    }

    const formData = this.taskForm.value;
    
    this.isLoading = true;
    this.taskService.CreateTask(formData).subscribe((res:any)=>{
      this.SendNotification(res);
      this.modalService.dismissAll();
      this.GetAlltasks();
      this.isLoading = false;
      this.toastr.success('Task added successfully.', 'Add task',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  SendNotification(res:any)
  {
    const formData = {
      type:"Task",
      message:res.title,
      recipient:res.staff,
    };
    this.notificationService.CreateNotification(formData).subscribe((res)=>{

    },(error)=>{
      console.log(error);
    });
  }

  OnEditFormSubmit()
  {
    if(this.taskForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.taskForm);
      return;
    }

    const formData = this.taskForm.value;
    
    this.isLoading = true;
    this.taskService.EditTask(this.taskId,formData).subscribe((res:any)=>{
      this.modalService.dismissAll();
      this.GetAlltasks();
      this.isLoading = false;
      this.toastr.warning('Task updated successfully.', 'Edit task',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  OnDeleteFormSubmit()
  {
    this.isLoading = true;
    this.taskService.DeleteTask(this.taskId).subscribe((res:any)=>{
      this.modalService.dismissAll();
      this.GetAlltasks();
      this.isLoading = false;
      this.toastr.error('Task deleted successfully.', 'Delete task',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  GetAllComments(taskId:any)
  {
    const query = "task="+taskId;
    this.commentService.GetTaskComments(query).subscribe((res:any)=>{
      this.allComments = res;
    },(error)=>{
      console.log(error);
    });
  }

  SendComment()
  {
    if(this.commentField.length <= 0)
    {
      return;
    }
    const formData = {
      task:this.taskId,
      content:this.commentField,
      admin:this.userId,
    };
    this.commentService.CreateTaskComment(formData).subscribe((res)=>{
      this.GetAllComments(this.taskId);
      this.commentField = "";
    },(error)=>{
      console.log(error);
    })
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

  isInvalidField(control: any) {
    return control.invalid && control.touched;
  }
}
