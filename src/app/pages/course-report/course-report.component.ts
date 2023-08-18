import { Component,OnInit } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-course-report',
  templateUrl: './course-report.component.html',
  styleUrls: ['./course-report.component.css']
})
export class CourseReportComponent implements OnInit
{

  allStudents:any = [];

  selectFilter:String = "all_students";
  filter2:String = "";

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private studentService:StudentService,
  ){}

  ngOnInit(): void 
  {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: "<'row'<'col-sm-6'l<'float-left'B>><'col-sm-6'f>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-6'i><'col-sm-6'<'float-right'p>>>",
      buttons: [
        'csv', 'excel', 'pdf', 'print'
      ],
    } as DataTables.Settings;
   this.GetAllStudents(); 
  }

  GetAllStudents()
  {
    const students:any = [];
    $('#datatable').DataTable().destroy();
    this.studentService.GetStudents().subscribe((res:any)=>{

      for(const student of res)
      {
        if(student.status === this.selectFilter && this.selectFilter !== "all_students")
        {
          if(this.filter2.length <= 0)
          {
            students.push(student);
          }
          else
          {
            const date = student.createdAt.split("T")[0].slice(0, -3);
            if(date === this.filter2)
            {
              students.push(student);
            }
          }
        }
        else if(this.selectFilter === "all_students")
        {
          if(this.filter2.length <= 0)
          {
            students.push(student);
          }
          else
          {
            const date = student.createdAt.split("T")[0].slice(0, -3);
            if(date === this.filter2)
            {
              students.push(student);
            }
          }
        }
      }

      this.allStudents = students;
      this.dtTrigger.next(null);
    },(error)=>{

    });
  }
}
