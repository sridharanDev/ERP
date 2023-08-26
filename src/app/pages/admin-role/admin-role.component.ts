import { Component,OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin-role',
  templateUrl: './admin-role.component.html',
  styleUrls: ['./admin-role.component.css']
})
export class AdminRoleComponent implements OnInit
{

  allRoles:any = [];
  isLoading:boolean = false;
  roleId:any = null;
  selectedRow:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private modalService: NgbModal,private adminService:AdminService,
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
          targets:[3],
          width:'10px',
          orderable: false,
          searchable: false,
        },
      ]
    };
    this.GetAllRoles();
  }

  openModal(component:any,roleId:any)
  {
    this.roleId = roleId;

    const modalRef = this.modalService.open(component,{
      size: 'md',
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });
    if(roleId)
    {
      this.adminService.GetRole(this.roleId).subscribe((res:any)=>{
        this.selectedRow = res;
      });
    }
  }

  GetAllRoles()
  {
    this.isLoading=true;
    $('#datatable').DataTable().destroy();
    this.adminService.GetRoles().subscribe((res:any)=>{
      this.allRoles = res;
      this.dtTrigger.next(null);
      this.isLoading=false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading=false;
    });
  }

  DeleteSubmit()
  {
    if(!this.roleId)
    {
      return;
    }
    this.isLoading = true;
    this.adminService.DeleteRole(this.roleId).subscribe((res)=>{
      this.modalService.dismissAll();
      this.isLoading = false;
      this.GetAllRoles();
      this.toastr.error('Role deleted successfully.', 'Delete role',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }
}
