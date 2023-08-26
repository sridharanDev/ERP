import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StaffService } from '../../services/staff.service';
import { FormValidatorService } from '../../utils/form-validator.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-staff-role',
  templateUrl: './staff-role.component.html',
  styleUrls: ['./staff-role.component.css']
})
export class StaffRoleComponent implements OnInit
{
  constructor(private modalService: NgbModal,private staffService:StaffService,
    private formValidatorService:FormValidatorService,
    private toastr: ToastrService) {}

  roleForm = new FormGroup({
    name :new FormControl('',Validators.required),
    salery :new FormControl('',Validators.required),
  });

  selectedRow:any;

  allRoles:any = [];
  roleId:any = null;

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
          targets:[2],
          width:'50px'
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
    
    if(this.roleId)
    {
      this.staffService.GetRole(this.roleId).subscribe((res)=>{
        const data:any = res;
        this.roleForm.get("name")?.setValue(data.name);
        this.roleForm.get("salery")?.setValue(data.salery);
        this.selectedRow = res;
      },(error)=>{
        this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      });
    }    
    
  }

  GetAllRoles()
  {
    this.isLoading = true;
    $('#datatable').DataTable().destroy();
    this.staffService.GetRoles().subscribe((res)=>{
      this.allRoles = res;
      this.dtTrigger.next(null);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  CreateFromSubmit()
  {
    if(this.roleForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.roleForm);
      return;
    }
    const formData = this.roleForm.value;
    this.isLoading = true;
    this.staffService.CreateRole(formData).subscribe((res)=>{
      this.modalService.dismissAll();
      this.roleForm.reset();
      this.isLoading = false;
      this.GetAllRoles();
      this.toastr.success('New role created successfully.', 'Create new role',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
    
  }

  EditFromSubmit()
  {
    if(this.roleForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.roleForm);
      return;
    }
    const formData = this.roleForm.value;
    this.isLoading = true;
    this.staffService.EditRole(this.roleId,formData).subscribe((res)=>{
      this.modalService.dismissAll();
      this.roleForm.reset();
      this.isLoading = false;
      this.GetAllRoles();
      this.toastr.warning('Role updated successfully.', 'Update role',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
    
  }

  DeleteSubmit()
  {
    if(!this.roleId)
    {
      return;
    }
    this.isLoading = true;
    this.staffService.DeleteRole(this.roleId).subscribe((res)=>{
      this.modalService.dismissAll();
      this.isLoading = false;
      this.GetAllRoles();
      this.toastr.error('Role deleted successfully.', 'Delete role',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
    
  }

  isInvalidField(control: any) {
    return control.invalid && control.touched;
  }
}
