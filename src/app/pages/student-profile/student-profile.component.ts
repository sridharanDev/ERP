import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from 'src/app/services/student.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit
{

  isLoading:boolean = false;
  studentDetail:any;

  constructor(private studentService:StudentService,private route:ActivatedRoute,
    private toastr: ToastrService){}

  ngOnInit(): void 
  {
    const studentId = this.route.snapshot.params['id'];
    if(studentId)
    {
      this.GetStudentDetails(studentId);
    }
  }

  GetStudentDetails(studentId:any)
  {
    this.isLoading = true;
    this.studentService.GetStudent(studentId).subscribe((res:any)=>{
      this.studentDetail = res;
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }
}
