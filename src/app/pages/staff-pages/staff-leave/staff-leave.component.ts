import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { LeaveApplicationService } from 'src/app/services/leave-application.service';
import { Subject } from 'rxjs';
import { FormValidatorService } from 'src/app/utils/form-validator.service';
import { StaffService } from 'src/app/services/staff.service';

@Component({
  selector: 'app-staff-leave',
  templateUrl: './staff-leave.component.html',
  styleUrls: ['./staff-leave.component.css']
})
export class StaffLeaveComponent implements OnInit
{

  allApplications:any = [];
  isLoading:boolean = false;

  userId:String = ""
  applicationID:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  leaveForm = new FormGroup({
    from_date:new FormControl('',Validators.required),
    to_date :new FormControl('',Validators.required),
    reason :new FormControl('',Validators.required),
  });

  constructor(private modalService: NgbModal,private toastr: ToastrService,private staffService:StaffService,
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
          targets:[1],
          width:'50px'
        },
        {
          targets:[2],
          width:'50px'
        },
        {
          targets:[4],
          width:'10px',
          className: 'text-center',
        },
        {
          targets:[5],
          width:'10px',
          orderable: false,
          searchable: false,
        },
      ]
    };
    if(this.staffService.isAuthenticated())
    {
      this.staffService.ValidateJWT(this.staffService.getUserData().token).subscribe((res:any)=>{
        this.userId = res._id;
        this.GetAllApplications(); 
      });
    } 
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
    this.leaveForm.reset();
    if(this.applicationID)
    {
      this.leaveApplicationService.GetApplication(this.applicationID).subscribe((res:any)=>{
        this.leaveForm.get("from_date")?.setValue(new Date(res.from_date).toISOString().substring(0, 10));
        this.leaveForm.get("to_date")?.setValue(new Date(res.to_date).toISOString().substring(0, 10));
        this.leaveForm.get("reason")?.setValue(res.reason);
      },(error)=>{
        this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      });
    }
   
  }

  GetAllApplications()
  {
    const query = "staff="+this.userId;
    this.isLoading = true;
    $('#datatable').DataTable().destroy();
    this.leaveApplicationService.GetApplications(query).subscribe((res:any)=>{
      this.allApplications = res;
      this.dtTrigger.next(null);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  OnApplaySubmit()
  {
    if(this.leaveForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.leaveForm);
      return;
    }
    let formData:any = this.leaveForm.value;
    formData['staff'] = this.userId;

    this.isLoading = true;
    this.leaveApplicationService.CreateApplication(formData).subscribe((res:any)=>{
      this.modalService.dismissAll();
      this.GetAllApplications();
      this.toastr.success("Leave applied successfully. ", 'Applay for leave.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  OnEditSubmit()
  {
    if(this.leaveForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.leaveForm);
      return;
    }
    let formData:any = this.leaveForm.value;
    formData['staff'] = this.userId;

    this.isLoading = true;
    this.leaveApplicationService.EditApplication(this.applicationID,formData).subscribe((res:any)=>{
      this.modalService.dismissAll();
      this.GetAllApplications();
      this.toastr.warning("Leave updated successfully. ", 'Applay for leave.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
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

  isInvalidField(control: any) {
    return control.invalid && control.touched;
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
