import { Component,OnInit } from '@angular/core';
import { WorklogService } from 'src/app/services/worklog.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { FormValidatorService } from 'src/app/utils/form-validator.service';
import { Subject } from 'rxjs';
import { StaffService } from 'src/app/services/staff.service';


@Component({
  selector: 'app-worklog',
  templateUrl: './worklog.component.html',
  styleUrls: ['./worklog.component.css']
})
export class WorklogComponent implements OnInit
{
  allWorklogs:any = [];
  userId:String = ""
  worklogID:any;
  isLoading:boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  worklogForm = new FormGroup({
    title:new FormControl('',Validators.required),
    description :new FormControl('',Validators.required),
  });

  constructor(private worklogService:WorklogService,private modalService: NgbModal,
    private toastr: ToastrService,private staffService:StaffService,private formValidatorService:FormValidatorService){}

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
          targets:[4],
          width:'10px',
          orderable: false,
          searchable: false,
        },
      ]
    }
    if(this.staffService.isAuthenticated())
    {
      this.staffService.ValidateJWT(this.staffService.getUserData().token).subscribe((res:any)=>{
        this.userId = res._id;
        this.GetAllWorklogs();
      });
    } 
  }

  openModal(component:any,worklogID:any)
  {
    this.worklogID = worklogID;
    const modalRef = this.modalService.open(component,{
      size: 'md',
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });
    this.worklogForm.reset();
    if(this.worklogID)
    {
      this.worklogService.GetWorklog(this.worklogID).subscribe((res:any)=>{
        this.worklogForm.patchValue(res);
      },(error)=>{
        this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      });
    }
   
  }
  
  GetAllWorklogs()
  {
    this.isLoading = true;
    $('#datatable').DataTable().destroy();
    this.worklogService.GetWorklogs("").subscribe((res:any)=>{
      this.allWorklogs = res;
      this.dtTrigger.next(null);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }


  OnEditSubmit()
  {
    if(this.worklogForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.worklogForm);
      return;
    }
    let formData:any = this.worklogForm.value;
    formData['staff'] = this.userId;

    this.isLoading = true;
    this.worklogService.EditWorklog(this.worklogID,formData).subscribe((res:any)=>{
      this.modalService.dismissAll();
      this.GetAllWorklogs();
      this.toastr.warning("Worklog updated successfully. ", 'Edit worklog.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  OnDeleteSubmit()
  {
    this.isLoading = true;
    this.worklogService.DeleteWorklog(this.worklogID).subscribe((res:any)=>{
      this.modalService.dismissAll();
      this.GetAllWorklogs();
      this.toastr.error("Worklog deleted successfully. ", 'Delete worklog',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  isInvalidField(control: any) {
    return control.invalid && control.touched;
  }
}
