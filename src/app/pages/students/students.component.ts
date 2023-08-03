import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/services/student.service';
import { StaffService } from 'src/app/services/staff.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit
{
  studentId:any = null;
  allStudents:any = [];
  allStaffs:any = [];
  isLoading:boolean = false;

  statsuField:any = 'NA';
  staffField:any = 'NA';

  constructor(private modalService: NgbModal,private studentService:StudentService,
    private staffService:StaffService,private toastr: ToastrService) {}

  ngOnInit(): void 
  {
    this.GetAllStudents();
    this.GetAllStaffs();
  }

  openModal(component:any,studentId:any)
  {
    this.studentId = studentId;
    const modalRef = this.modalService.open(component,{
      size: 'md',
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });

    if(this.studentId)
    {
      
      this.statsuField = "NA";
      this.staffField = "NA";
      this.studentService.GetStudent(this.studentId).subscribe((res:any)=>{
        this.statsuField = res.status;
        this.staffField = res.staff._id;
      });
    }
  }

  GetAllStudents()
  {
    this.isLoading = true;
    this.studentService.GetStudentsWithFiter("converted").subscribe((res:any)=>{
      this.allStudents = res;
      this.isLoading = false;
    },(error)=>{
      this.isLoading = false;
    });
  }

  GetAllStaffs()
  {
    this.staffService.GetStaffs().subscribe((res:any)=>{
      this.allStaffs = res;
    });
  }

  StausSubmit()
  {
    if(this.statsuField == 'NA' || (this.staffField == "converted" && this.staffField == "NA"))
    {
      return;
    }
    var formData = {};
    if(this.staffField != 'NA'){ 
      formData = {status:this.statsuField , staff:this.staffField};
    }
    else{
      status:this.statsuField
    }

    this.isLoading = true;
    this.studentService.EditStudent(this.studentId,formData).subscribe((res:any)=>{
      this.modalService.dismissAll();
      this.GetAllStudents();
      this.isLoading = false;
      this.toastr.warning('Enquiry status updated successfully.', 'Update enquiry status',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  DeleteSubmit()
  {
    
    this.isLoading = true;
    this.studentService.DeleteStudent(this.studentId).subscribe((res:any)=>{
      this.modalService.dismissAll();
      this.GetAllStudents();
      this.isLoading = false;
      this.toastr.error('Enquiry deleted successfully.', 'Delete enquiry',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  GetStatusColor(status:String):any
  {
    if(status == "call back")
    {
      return "bg-primary"
    }
    else if(status == "intrested")
    {
      return "bg-success"
    }
    else if(status == "not intrested")
    {
      return "bg-danger"
    }
    else if(status == "not answer")
    {
      return "bg-warning"
    }
    else if(status == "converted")
    {
      return "bg-success"
    }
  }
}
