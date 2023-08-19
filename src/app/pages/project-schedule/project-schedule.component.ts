import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { FormValidatorService } from '../../utils/form-validator.service';
import { ProjectScheduleService } from 'src/app/services/project-schedule.service';
import { ProjectService } from '../../services/project.service';
import { CustomValidatorService } from '../../utils/custom-validator.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-project-schedule',
  templateUrl: './project-schedule.component.html',
  styleUrls: ['./project-schedule.component.css']
})
export class ProjectScheduleComponent implements OnInit
{
  allSchedules:any = [];
  scheduleId:any;
  isLoading:boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  allProjects:any = [];

  scheduleForm = new FormGroup({
    title :new FormControl('',Validators.required),
    description :new FormControl(''),
    project :new FormControl('NA',[Validators.required,this.CustomValidators.isEqual('NA')]),
    date :new FormControl('',Validators.required),
  });

  constructor(private scheduleService:ProjectScheduleService,private modalService: NgbModal,private projectService:ProjectService,
    private formValidatorService:FormValidatorService,private CustomValidators:CustomValidatorService,private toastr: ToastrService){}

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
          targets:[4],
          width:'60px'
        },
        {
          targets:[5],
          width:'10px',
          orderable: false,
          searchable: false,
        },
      ]
    };
    this.GetAllProjects();
    this.GetAllSchedules(); 
    }
  
    openModal(component:any,scheduleId:any)
    {
      this.scheduleId = scheduleId;
      const modalRef = this.modalService.open(component,{
        size: 'md',
        windowClass: 'modal',
        centered: false,
        backdrop: 'static',
        keyboard: false,
      });
      this.scheduleForm.reset();
      if(this.scheduleId)
      {
        this.scheduleService.GetSchedule(this.scheduleId).subscribe((res:any)=>{
          this.scheduleForm.patchValue(res);
          this.scheduleForm.get("project")?.setValue(res.project._id);
          this.scheduleForm.get("date")?.setValue(res.date.split("T")[0]);
        },(error)=>{
          this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
        });
      }
    }

    GetAllProjects()
  {
    this.projectService.GetProjects("").subscribe((res:any)=>{
      this.allProjects = res;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
    });
  }
  
    GetAllSchedules()
    {
      this.isLoading = true;
      $('#datatable').DataTable().destroy();
      this.scheduleService.GetSchedules().subscribe((res:any)=>{
        this.allSchedules = res;
        this.dtTrigger.next(null);
        this.isLoading = false;
      },(error)=>{
        this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
        this.isLoading = false;
      });
    }
  
    OnCreateSumbit()
    {
      if(this.scheduleForm.invalid)
      {
        this.formValidatorService.markFormGroupTouched(this.scheduleForm);
        return;
      }
      const formData = this.scheduleForm.value;
      this.isLoading = true;
      this.scheduleService.CreateSchedule(formData).subscribe((res:any)=>{
        this.GetAllSchedules();
        this.modalService.dismissAll();
        this.toastr.success('New schedule created successfully.', 'Create schedule',{timeOut: 3000,closeButton: true,progressBar: true,},);
        this.isLoading = false;
      },(error)=>{
        this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
        this.isLoading = false;
      });
    }
  
    OnEditSumbit()
    {
      if(this.scheduleForm.invalid)
      {
        this.formValidatorService.markFormGroupTouched(this.scheduleForm);
        return;
      }
      const formData = this.scheduleForm.value;
      this.isLoading = true;
      this.scheduleService.EditSchedule(this.scheduleId,formData).subscribe((res:any)=>{
        this.GetAllSchedules();
        this.modalService.dismissAll();
        this.toastr.warning('Schedule updated successfully.', 'Edit schedule',{timeOut: 3000,closeButton: true,progressBar: true,},);
        this.isLoading = false;
      },(error)=>{
        this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
        this.isLoading = false;
      });
    }
  
    OnDeleteSubmit()
    {
      this.isLoading = true;
      this.scheduleService.DeleteSchedule(this.scheduleId).subscribe((res:any)=>{
        this.GetAllSchedules();
        this.modalService.dismissAll();
        this.toastr.error('Schedule deleted successfully.', 'Delete schedule',{timeOut: 3000,closeButton: true,progressBar: true,},);
        this.isLoading = false;
      },(error)=>{
        this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
        this.isLoading = false;
      });
    }

    formatTimeTo12Hour(time: string): string {
      const [hours, minutes] = time.split(':');
      let formattedTime = '';
    
      const numericHours = Number(hours);
      if (numericHours === 0) {
        formattedTime = `12:${minutes} AM`;
      } else if (numericHours < 12) {
        formattedTime = `${numericHours}:${minutes} AM`;
      } else if (numericHours === 12) {
        formattedTime = `12:${minutes} PM`;
      } else {
        formattedTime = `${numericHours - 12}:${minutes} PM`;
      }
    
      return formattedTime;
    }
    
  
    isInvalidField(control: any) {
      return control.invalid && control.touched;
    }
}
