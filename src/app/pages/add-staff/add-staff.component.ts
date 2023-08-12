import { Component,OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StaffService } from '../../services/staff.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { FormValidatorService } from '../../utils/form-validator.service';
import { CustomValidatorService } from '../../utils/custom-validator.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.css']
})
export class AddStaffComponent implements OnInit
{
 

  staffRoles:any = [];
  staffSchedules:any = [];
  isLoading:boolean = false;

  staffForm = new FormGroup({
    staff_id :new FormControl('',Validators.required),
    name :new FormControl('',Validators.required),
    father_name :new FormControl('',Validators.required),
    email :new FormControl('',Validators.required),
    mobile :new FormControl('',Validators.required),
    dob :new FormControl('',Validators.required),
    address :new FormControl('',Validators.required),
    qualification :new FormControl('',Validators.required),
    interview_date :new FormControl('',Validators.required),
    join_date :new FormControl('',Validators.required),
    designation :new FormControl('',Validators.required),
    role :new FormControl('NA',[Validators.required,this.CustomValidators.isEqual('NA')]),
    schedule :new FormControl('NA',[Validators.required,this.CustomValidators.isEqual('NA')]),
    status :new FormControl('Y',Validators.required),
  });

  constructor(private staffService:StaffService,private toastr: ToastrService,
    private breadcrumbService: BreadcrumbService,private formValidatorService:FormValidatorService,
    private CustomValidators:CustomValidatorService,private location: Location,private scheduleService:ScheduleService){}


  ngOnInit(): void 
  {
    this.breadcrumbService.setBreadcrumb([
      { label: 'Staffs', url: '/staff-list' },
      { label: 'Add new staff', url: '#' },
    ]);
    this.GetAllStaffRoles();
    this.GetAllStaffSchedule();
  }

  GetAllStaffRoles()
  {
    this.isLoading = true;
    this.staffService.GetRoles().subscribe((res)=>{
      this.staffRoles = res;
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  GetAllStaffSchedule()
  {
    this.isLoading = true;
    this.scheduleService.GetSchedules().subscribe((res)=>{
      this.staffSchedules = res;
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  OnFormSubmit()
  {
    if(this.staffForm.valid)
    {
      const formData = this.staffForm.value;
      this.isLoading=true;
      this.staffService.CreateStaff(formData).subscribe((res)=>{
        this.toastr.success('New staff added successfully.', 'Add new staff',{timeOut: 3000,closeButton: true,progressBar: true,},);
        this.isLoading=false;
        this.location.back();
      },(error)=>{
        this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
        this.isLoading=false;
      });
    }
    else
    {
      this.formValidatorService.markFormGroupTouched(this.staffForm);
    }
    
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
