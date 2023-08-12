import { Component,OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from 'src/app/services/project.service';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { FormValidatorService } from '../../utils/form-validator.service';
import { CustomValidatorService } from '../../utils/custom-validator.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit
{
  projectId:any;
  isLoading:boolean = false;

  projectForm = new FormGroup({
    client_name :new FormControl('',Validators.required),
    mobile :new FormControl('',Validators.required),
    platform :new FormControl('',Validators.required),
    project_name :new FormControl('',Validators.required),
    reference :new FormControl('',Validators.required),
    note :new FormControl('',Validators.required),
    // start_date :new FormControl('',Validators.required),
    // end_date :new FormControl('',Validators.required),
    // staffs :new FormControl('',Validators.required),
    // status :new FormControl('Y',Validators.required),
  });

  constructor(private projectService:ProjectService ,private toastr: ToastrService,
    private breadcrumbService: BreadcrumbService,private formValidatorService:FormValidatorService,
    private CustomValidators:CustomValidatorService,private location: Location,private route:ActivatedRoute){}

  ngOnInit(): void 
  {
    this.projectId = this.route.snapshot.params["id"];   

    if(this.projectId)
    {
      this.GetProjectDetails();
    }
  }

  GetProjectDetails()
  {
    this.isLoading = true;
    this.projectService.GetProject(this.projectId).subscribe((res:any)=>{
      this.projectForm.patchValue(res);
      this.isLoading=false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading=false;
    });
  }

  OnFormSubmit()
  {
    if(this.projectForm.valid)
    {
      const formData = this.projectForm.value;
      this.isLoading=true;
      this.projectService.EditProject(this.projectId,formData).subscribe((res)=>{
        this.toastr.warning('Project updated successfully.', 'Edit project',{timeOut: 3000,closeButton: true,progressBar: true,},);
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
