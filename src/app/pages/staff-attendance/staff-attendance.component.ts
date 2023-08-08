import { Component,OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/services/attendance.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-staff-attendance',
  templateUrl: './staff-attendance.component.html',
  styleUrls: ['./staff-attendance.component.css']
})
export class StaffAttendanceComponent implements OnInit
{

  allAttendances:any = [];
  attendanceId:any;
  isLoading:boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private attendanceService:AttendanceService,private modalService: NgbModal,
    private toastr: ToastrService){}

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
          targets:[5],
          width:'100px',
          className: 'text-center',
        },
        {
          targets:[6],
          width:'10px',
          orderable: false,
          searchable: false,
        },
      ]
    };
   this.GetAllAttendances(); 
  }

  openModal(component:any,attendanceId:any)
  {
    this.attendanceId = attendanceId;
    const modalRef = this.modalService.open(component,{
      size: 'md',
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });
  }

  GetAllAttendances()
  {
    this.isLoading = true;
    $('#datatable').DataTable().destroy();
    this.attendanceService.GetAttendances().subscribe((res:any)=>{
      this.allAttendances = res;
      this.dtTrigger.next(null);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  DeleteSubmit()
  {
    return;
    this.isLoading = true;
    this.attendanceService.DeleteAttendance(this.attendanceId).subscribe((res:any)=>{
      this.GetAllAttendances();
      this.modalService.dismissAll();
      this.toastr.error('Attendance detail deleted successfully.', 'Delete Attendance',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }
}
