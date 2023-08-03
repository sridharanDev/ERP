import { Component,OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { FormValidatorService } from '../../utils/form-validator.service';
import { CustomValidatorService } from '../../utils/custom-validator.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { CourseService } from '../../services/course.service';
import { StudentService } from 'src/app/services/student.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit
{

  studentId:any = null;
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
    courses:new FormControl('NA',[Validators.required,this.CustomValidators.isEqual('NA')]),
    note :new FormControl(''),

  });

  constructor(private toastr: ToastrService,
    private breadcrumbService: BreadcrumbService,private formValidatorService:FormValidatorService,
    private courseService:CourseService,private studentService:StudentService,
    private CustomValidators:CustomValidatorService,private location: Location,
    private route: ActivatedRoute){}

  ngOnInit(): void 
  {
    this.studentId = this.route.snapshot.paramMap.get('id');
    this.breadcrumbService.setBreadcrumb([
      { label: 'Enquiry', url: '/enquiry' },
      { label: 'Edit student', url: '#' },
    ]);
    this.GetAllCourses();
    this.GetStudentData();
  }

  GetStudentData()
  {
    this.isLoading = true;
    this.studentService.GetStudent(this.studentId).subscribe((res:any)=>{
      this.studentForm.patchValue(res);      
      this.studentForm.get("current_status")?.setValue(res.current_status);
      this.studentForm.get("courses")?.setValue(res.courses[0]._id);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
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
    this.studentService.EditStudent(this.studentId,formData).subscribe((res:any)=>{
      this.toastr.warning('Student updated successfully.', 'Update student',{timeOut: 3000,closeButton: true,progressBar: true,},);
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
