import { Component,OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { FormValidatorService } from '../../utils/form-validator.service';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit
{

  loginForm = new FormGroup({
    username :new FormControl('',Validators.required),
    password :new FormControl('',Validators.required),
  });

  loginErrors:any;
  isLoading:boolean = false;

  constructor(private formValidatorService:FormValidatorService,private adminService:AdminService,private router:Router){}

  ngOnInit(): void 
  {
    if(this.adminService.isAuthenticated())
    {
      this.router.navigate(['admin','dashboard']);
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
    this.adminService.Login(formData).subscribe((res:any)=>{
      if(res.redirect && res.token)
      {
        this.adminService.setUserData(res);
        this.router.navigate(['admin',res.redirect]);
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
