import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { StaffService } from '../../services/staff.service';

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

  ngOnInit(): void 
  {
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
  }
  
  GetAllStaffs()
  {
    this.isLoading = true;
    this.staffService.GetStaffs().subscribe((res)=>{
      this.allStaffs = res;
      this.isLoading = false;
    },(error)=>{
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
}
