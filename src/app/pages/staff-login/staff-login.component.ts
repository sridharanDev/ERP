import { Component,OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { FormValidatorService } from '../../utils/form-validator.service';
import { StaffService } from 'src/app/services/staff.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-staff-login',
  templateUrl: './staff-login.component.html',
  styleUrls: ['./staff-login.component.css']
})
export class StaffLoginComponent implements OnInit
{
  loginErrors:any;
  isLoading:boolean = false;
  
  loginForm = new FormGroup({
    staff_id :new FormControl('',Validators.required),
    password :new FormControl('',Validators.required),
  });

  constructor(private formValidatorService:FormValidatorService,private staffService:StaffService,
    private router:Router,private attendanceService:AttendanceService,private toastr: ToastrService){}

  ngOnInit(): void 
  {
    if(this.staffService.isAuthenticated())
    {
      this.router.navigate(['profile']);
    }   
  }

  OnLoginSubmit()
  {
    if(this.loginForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.loginForm);
      return;
    }
    const formData = this.loginForm.value;
    this.isLoading = true;
    this.staffService.Login(formData).subscribe((res:any)=>{      
      if(res.token)
      {        
        this.staffService.setUserData(res);        
        this.AddAttendance();
      }
      this.isLoading = false;
    },(error)=>{
      this.loginErrors = error.error;
      console.log(this.loginErrors);
      
      this.isLoading = false;
    });
    
  }

  AddAttendance()
  {
    const staff_id = this.staffService.getUserData().staff_id;
    const formData = {staff_id:staff_id,status:"login"};
    this.attendanceService.AddAttendances(formData).subscribe((res:any)=>{
      console.log(res);
      this.router.navigate(['profile']);
    },(error)=>{
      console.log(error);
      this.toastr.error(error.error.message,"Attendance",{timeOut: 3000,closeButton: true,progressBar: true,},)
      this.router.navigate(['profile']);
    });
  }

  isInvalidField(control: any) {
    return control.invalid && control.touched;
  }
}
