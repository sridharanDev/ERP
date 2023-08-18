import { Component,OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from 'src/app/services/project.service';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { FormValidatorService } from '../../utils/form-validator.service';
import { CustomValidatorService } from '../../utils/custom-validator.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent {
 

  isLoading:boolean = false;

  projectForm = new FormGroup({
    client_name :new FormControl('',Validators.required),
    mobile :new FormControl('',Validators.required),
    platform :new FormControl('',Validators.required),
    project_name :new FormControl('',Validators.required),
    reference :new FormControl(''),
    note :new FormControl(''),
  });

  constructor(private projectService:ProjectService ,private toastr: ToastrService,
    private breadcrumbService: BreadcrumbService,private formValidatorService:FormValidatorService,
    private CustomValidators:CustomValidatorService,private location: Location){}


  ngOnInit(): void 
  {
    this.breadcrumbService.setBreadcrumb([
      { label: 'Staffs', url: '/staff-list' },
      { label: 'Add new staff', url: '#' },
    ]);
  }

  

  OnFormSubmit()
  {
    if(this.projectForm.valid)
    {
      const formData = this.projectForm.value;
      this.isLoading=true;
      this.projectService.CreateProject(formData).subscribe((res)=>{
        this.toastr.success('New project added successfully.', 'Add new project',{timeOut: 3000,closeButton: true,progressBar: true,},);
        this.isLoading=false;
        this.location.back();
      },(error)=>{
        this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
        this.isLoading=false;
      });
    }
    else
    {
      this.formValidatorService.markFormGroupTouched(this.projectForm);
    }
    
  }

  isInvalidField(control: any) {
    return control.invalid && control.touched;
  }
}
