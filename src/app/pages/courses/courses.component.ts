import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from 'src/app/services/course.service';
import { FormValidatorService } from '../../utils/form-validator.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit
{
  constructor(private modalService: NgbModal,private courseService:CourseService,
    private formValidatorService:FormValidatorService,
    private toastr: ToastrService) {}

  courseForm = new FormGroup({
    title :new FormControl('',Validators.required),
    description :new FormControl('',Validators.required),
    duration :new FormControl('',Validators.required),
    fees :new FormControl('',Validators.required),
  });

  allCourses:any = [];
  courseId:any = null;

  isLoading:boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

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
          width:'50px'
        },
        {
          targets:[4],
          width:'50px'
        },
        {
          targets:[5],
          width:'10px',
          orderable: false,
          searchable: false,
        },
      ]
    };
    this.GetAllCourses();
  }
  
  openModal(component:any,courseId:any)
  {
    this.courseId = courseId;

    const modalRef = this.modalService.open(component,{
      size: 'md',
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });
    this.courseForm.reset();
    if(this.courseId)
    {
      this.courseService.GetCourse(this.courseId).subscribe((res:any)=>{
        this.courseForm.patchValue(res);
      },(error)=>{
        this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      });
    }   
  }

  GetAllCourses()
  {
    this.isLoading = true;
    $('#datatable').DataTable().destroy();
    this.courseService.GetCourses().subscribe((res:any)=>{
      this.allCourses = res;
      this.dtTrigger.next(null);
      this.isLoading = false;
    },(error)=>{
      
      this.isLoading = false;
    });
  }

  CreateFromSubmit()
  {
    if(this.courseForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.courseForm);
      return;
    }
    const formData = this.courseForm.value;
    this.isLoading = true;
    this.courseService.CreateCourse(formData).subscribe((res)=>{
      this.modalService.dismissAll();
      this.courseForm.reset();
      this.isLoading = false;
      this.GetAllCourses();
      this.toastr.success('New course created successfully.', 'Create new course',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    })
        
  }

  EditFromSubmit()
  {
    if(this.courseForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.courseForm);
      return;
    }
    const formData = this.courseForm.value;
    this.isLoading = true;
    this.courseService.EditCourse(this.courseId,formData).subscribe((res:any)=>{
      this.modalService.dismissAll();
      this.courseForm.reset();
      this.isLoading = false;
      this.GetAllCourses();
      this.toastr.warning('Course updated successfully.', 'Update course',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
    
  }

  DeleteSubmit()
  {
    if(!this.courseId)
    {
      return;
    }
    this.isLoading = true;
    this.courseService.DeleteCourse(this.courseId).subscribe((res)=>{
      this.modalService.dismissAll();
      this.isLoading = false;
      this.GetAllCourses();
      this.toastr.error('Course deleted successfully.', 'Delete course',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
    
  }

  isInvalidField(control: any) {
    return control.invalid && control.touched;
  }
}
