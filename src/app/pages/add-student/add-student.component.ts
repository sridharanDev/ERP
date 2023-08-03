import { Component,OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { FormValidatorService } from '../../utils/form-validator.service';
import { CustomValidatorService } from '../../utils/custom-validator.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { CourseService } from '../../services/course.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit
{

  allCourses:any = [];
  isLoading:boolean = false;

  studentForm = new FormGroup({
    name :new FormControl('',Validators.required),
    mobile :new FormControl('',Validators.required),
    email :new FormControl('',Validators.required),
    dob :new FormControl('',Validators.required),
    gender :new FormControl('NA',[Validators.required,this.CustomValidators.isEqual('NA')]),
    qualification :new FormControl(''),
    passed_out_year :new FormControl('',Validators.required),
    current_status :new FormControl('NA',[Validators.required,this.CustomValidators.isEqual('NA')]),
    institute_or_company :new FormControl(''),
    courses :new FormControl('NA',[Validators.required,this.CustomValidators.isEqual('NA')]),
    note :new FormControl(''),

  });

  constructor(private toastr: ToastrService,
    private breadcrumbService: BreadcrumbService,private formValidatorService:FormValidatorService,
    private courseService:CourseService,private studentService:StudentService,
    private CustomValidators:CustomValidatorService,private location: Location){}

  ngOnInit(): void 
  {
    this.breadcrumbService.setBreadcrumb([
      { label: 'Enquiry', url: '/enquiry' },
      { label: 'Add new student', url: '#' },
    ]);
    this.GetAllCourses();
  }

  GetAllCourses()
  {
    this.courseService.GetCourses().subscribe((res:any)=>{
      this.allCourses = res;
    },(error)=>{

    });
  }

  GetFees(courseId:any)
  {
    var fees = 0;
    for (let i = 0; i < this.allCourses.length; i++) 
    {
      if(this.allCourses[i]._id == courseId)
      {
        fees = this.allCourses[i].fees;
        break;
      }  
      
    }
    return "₹"+fees;
  }

  OnFormSubmit()
  {
    if(this.studentForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.studentForm);
      return;
    }
    const formData = this.studentForm.value;
    this.isLoading = true;
    this.studentService.CreateStudent(formData).subscribe((res:any)=>{
      this.toastr.success('New student added successfully.', 'Add new student',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading=false;
      this.location.back();
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  isInvalidField(control: any) {
    return control.invalid && control.touched;
  }
}
