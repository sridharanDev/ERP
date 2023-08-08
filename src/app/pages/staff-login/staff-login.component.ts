import { Component,OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { FormValidatorService } from '../../utils/form-validator.service';
import { StaffService } from 'src/app/services/staff.service';
import { Router } from '@angular/router';

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

  constructor(private formValidatorService:FormValidatorService,private staffService:StaffService,private router:Router){}

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
        this.router.navigate(['profile']);
      }
      this.isLoading = false;
    },(error)=>{
      this.loginErrors = error.error;
      console.log(this.loginErrors);
      
      this.isLoading = false;
    });
    
  }

  isInvalidField(control: any) {
    return control.invalid && control.touched;
  }
}
