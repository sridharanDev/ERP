import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { StaffService } from '../../services/staff.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css']
})
export class StaffListComponent implements OnInit
{
  constructor(private modalService: NgbModal,private staffService:StaffService,
    private toastr: ToastrService) {}
  
  staffId:any = null;
  allStaffs:any = [];
  isLoading:boolean = false;

  passwordInput:any;
  statusInput:any;

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
          width:'50px',
          className: 'text-center',
        },
        {
          targets:[4],
          width:'10px',
          orderable: false,
          searchable: false,
        },
      ]
    };
    this.GetAllStaffs();
  }

  openModal(component:any,staffId:any)
  {
    this.staffId = staffId;
    const modalRef = this.modalService.open(component,{
      size: 'md',
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });
    this.passwordInput = null;
    this.statusInput = "active";
    if(this.staffId)
    {
      this.staffService.GetProfile(this.staffId).subscribe((res:any)=>{
        this.statusInput = res.status;
      });
    }
  }
  
  GetAllStaffs()
  {
    this.isLoading = true;
    $('#datatable').DataTable().destroy();
    this.staffService.GetStaffs().subscribe((res)=>{
      this.allStaffs = res;
      this.dtTrigger.next(null);
      this.isLoading = false;
    },(error)=>{
      this.isLoading = false;
    });
  }

  ChangePassSubmit()
  {
    if(!this.staffId || this.passwordInput == "")
    {
      return;
    }
    const formData = {password:this.passwordInput};
    this.isLoading = true;
    this.staffService.EditStaff(this.staffId,formData).subscribe((res)=>{
      this.isLoading = false;
      this.GetAllStaffs();
      this.modalService.dismissAll();
      this.toastr.info('Password updated successfully.', 'Update password',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  ChangeStatusSubmit()
  {
    if(!this.staffId)
    {
      return;
    }
    const formData = {status:this.statusInput};
    this.isLoading = true;
    this.staffService.EditStaff(this.staffId,formData).subscribe((res)=>{
      this.isLoading = false;
      this.GetAllStaffs();
      this.modalService.dismissAll();
      this.toastr.info('Status updated successfully.', 'Status password',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  DeleteSubmit()
  {
    if(!this.staffId)
    {
      return;
    }
    this.isLoading = true;
    this.staffService.DeleteStaff(this.staffId).subscribe((res)=>{
      this.isLoading = false;
      this.GetAllStaffs();
      this.modalService.dismissAll();
      this.toastr.error('Staff deleted successfully.', 'Delete staff',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  GetStatusColor(status:String):any
  {
    if(status == "active")
    {
      return "bg-success"
    }
    else if(status == "inactive")
    {
      return "bg-warning"
    }
    else if(status == "relived")
    {
      return "bg-danger"
    }
    else
    {
      return "bg-secondary"
    }
  }
}
