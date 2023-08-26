import { Component,OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { FormValidatorService } from '../../utils/form-validator.service';
import { CustomValidatorService } from '../../utils/custom-validator.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { CourseService } from '../../services/course.service';
import { StudentService } from 'src/app/services/student.service';
import { StaffService } from 'src/app/services/staff.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

interface DropdownItem {
  _id: string;
  title: string;
}

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit
{

  studentId:any = null;
  allCourses:any = [];
  allStaffs:any = [];
  isLoading:boolean = false;

  totalFees:string = "₹0";
  selectedCourses:DropdownItem[] = [];
  dropdownSettings = {};

  selectedStaffs:DropdownItem[] = [];

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
    courses:new FormControl([Validators.required,this.CustomValidators.isEqual('NA')]),
    staffs:new FormControl([Validators.required,this.CustomValidators.isEqual('NA')]),
    note :new FormControl(''),

  });

  constructor(private toastr: ToastrService,
    private breadcrumbService: BreadcrumbService,private formValidatorService:FormValidatorService,
    private courseService:CourseService,private studentService:StudentService,
    private CustomValidators:CustomValidatorService,private location: Location,
    private route: ActivatedRoute,
    private staffService:StaffService
    ){      
      this.dropdownSettings = {
        singleSelection: false,
        idField: '_id',
        textField: 'title',
      };
    }

  ngOnInit(): void 
  {
    this.studentId = this.route.snapshot.paramMap.get('id');
    this.breadcrumbService.setBreadcrumb([
      { label: 'Enquiry', url: '/enquiry' },
      { label: 'Edit student', url: '#' },
    ]);
    this.GetAllCourses();
    this.GetAllStaffs();
    this.GetStudentData();
  }

  GetStudentData()
  {
    this.isLoading = true;
    this.studentService.GetStudent(this.studentId).subscribe((res:any)=>{
      this.studentForm.patchValue(res);      
      this.studentForm.get("current_status")?.setValue(res.current_status);
      this.studentForm.get("courses")?.setValue(res.courses);
      const tempStaffs:any = [];
      for(const staff of res.staffs)
      {
        tempStaffs.push({_id:staff._id,title:staff.staff_id + " - " + staff.name});
      }
      
      this.studentForm.get("staffs")?.setValue(tempStaffs);
      this.selectedStaffs = tempStaffs;
      this.selectedCourses = res.courses;
      this.isLoading = false;
      this.GetFees();
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
  GetAllStaffs()
  {
    this.staffService.GetStaffs().subscribe((res:any)=>{
      const allStaffs = [];
      for(const staff of res)
      {
        allStaffs.push({_id:staff._id,title:staff.staff_id + " - " + staff.name});
      }
      this.allStaffs = allStaffs;
      
    },(error)=>{
      console.log(error);
    });
  }

  onItemSelect(item:any)
  {
    this.selectedCourses.push(item);
    this.GetFees();
  }
  
  onItemDeSelect(item: any) {
    
    const index = this.selectedCourses.findIndex(course => course._id === item._id);
    if (index !== -1) {
      this.selectedCourses.splice(index, 1);
    }
    this.GetFees();
  }
  onItemSelect2(item:any)
  {
    this.selectedStaffs.push(item);
    this.GetFees();
  }
  
  onItemDeSelect2(item: any) {
    
    const index = this.selectedStaffs.findIndex(course => course._id === item._id);
    if (index !== -1) {
      this.selectedStaffs.splice(index, 1);
    }
    this.GetFees();
  }

  GetFees()
  {
    var fees = 0;
    for(let selectedCourse  of this.selectedCourses)
    {
      const course = this.allCourses.find((course:any) => course._id === selectedCourse._id);
      if (course) {
        fees += course.fees;
      }
      
    }
    this.totalFees = "₹"+fees;
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
