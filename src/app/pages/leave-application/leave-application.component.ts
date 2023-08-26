import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { LeaveApplicationService } from 'src/app/services/leave-application.service';
import { Subject } from 'rxjs';
import { FormValidatorService } from 'src/app/utils/form-validator.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-leave-application',
  templateUrl: './leave-application.component.html',
  styleUrls: ['./leave-application.component.css']
})
export class LeaveApplicationComponent 
{

  allApplications:any = [];
  isLoading:boolean = false;
  selectedRow:any;
  applicationID:any;

  statusField:any = "pending";

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private modalService: NgbModal,private toastr: ToastrService,private notificationService:NotificationService,
    private leaveApplicationService:LeaveApplicationService,private formValidatorService:FormValidatorService){}

    ngOnInit(): void 
  {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      columnDefs :[
        {
          targets:[0],
          width:'50px'
        },
        {
          targets:[2],
          width:'50px'
        },
        {
          targets:[3],
          width:'50px'
        },
        {
          targets:[5],
          width:'10px',
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
    this.GetAllApplications(); 
  }

  openModal(component:any,applicationID:any)
  {
    this.applicationID = applicationID;
    const modalRef = this.modalService.open(component,{
      size: 'md',
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });
    if(this.applicationID)
    {
      this.leaveApplicationService.GetApplication(this.applicationID).subscribe((res:any)=>{
       this.statusField = res.status;
       this.selectedRow = res;
      },(error)=>{
        this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      });
    }
   
  }

  GetAllApplications()
  {
    this.isLoading = true;
    $('#datatable').DataTable().destroy();
    this.leaveApplicationService.GetApplications("").subscribe((res:any)=>{
      this.allApplications = res;
      this.dtTrigger.next(null);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  OnEditSubmit()
  {
    const formData = {status:this.statusField};
    this.isLoading = true;
    this.leaveApplicationService.EditApplication(this.applicationID,formData).subscribe((res:any)=>{
      this.modalService.dismissAll();
      this.GetAllApplications();
      this.toastr.warning("Leave updated successfully. ", 'Applay for leave.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
      this.SendNotification(res);
    },(error)=>{
      this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  OnDeleteSubmit()
  {
    this.isLoading = true;
    this.leaveApplicationService.DeleteApplication(this.applicationID).subscribe((res:any)=>{
      this.modalService.dismissAll();
      this.GetAllApplications();
      this.toastr.error("Leave deleted successfully. ", 'Applay for leave.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  SendNotification(res:any)
  {
    const formData = {
      type:"Leave",
      message: "Your leave application is " + res.status,
      recipient:res.staff,
    };
    this.notificationService.CreateNotification(formData).subscribe((res)=>{

    },(error)=>{
      console.log(error);
    });
  }

  GetStatusColor(status:String):any
  {
    if(status == "pending")
    {
      return "bg-warning"
    }
    else if(status == "approved")
    {
      return "bg-success"
    }
    else if(status == "rejected")
    {
      return "bg-danger"
    }
  }
}
