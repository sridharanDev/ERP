import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { FormValidatorService } from '../../utils/form-validator.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit
{
  allSchedules:any = [];
  scheduleId:any;
  isLoading:boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  scheduleForm = new FormGroup({
    in_time :new FormControl('',Validators.required),
    out_time :new FormControl('',Validators.required),
  });

  constructor(private scheduleService:ScheduleService,private modalService: NgbModal,
    private formValidatorService:FormValidatorService,private toastr: ToastrService){}

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
          width:'10px',
          orderable: false,
          searchable: false,
        },
      ]
    };
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
        },(error)=>{
          this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
        });
      }
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
