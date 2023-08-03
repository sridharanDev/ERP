import { Component,OnInit,ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FormValidatorService } from '../../utils/form-validator.service';
import { CustomValidatorService } from '../../utils/custom-validator.service';
import { AdminService } from 'src/app/services/admin.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit
{

  allUsers:any = [];
  allRoles:any = [];
  userId:any = null;
  isLoading:boolean = false;

  @ViewChild(DataTableDirective, { static: false }) datatableElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject();


  userForm = new FormGroup({
    username :new FormControl('',Validators.required),
    password :new FormControl('',Validators.required),
    role :new FormControl('NA',[Validators.required,this.CustomValidators.isEqual('NA')]),
  });

  constructor(private modalService: NgbModal,private formValidatorService:FormValidatorService,
    private adminService:AdminService,private toastr: ToastrService,private CustomValidators:CustomValidatorService) {}

  ngOnInit(): void 
  {
    this.GetAllRoles();
    this.GetAllUsers();
  }

  openModal(component:any,userId:any)
  {
    this.userId = userId;

    const modalRef = this.modalService.open(component,{
      size: 'md',
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });
    this.userForm.reset();

    if(this.userId)
    {
      this.adminService.GetUser(this.userId).subscribe((res:any)=>{
        this.userForm.patchValue(res);
      },(error)=>{
        this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      });
    }
  }

  GetAllRoles()
  {
    this.adminService.GetRoles().subscribe((res:any)=>{
      this.allRoles = res;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
    });
  }

  GetAllUsers()
  {
    this.isLoading = true;
    this.adminService.GetUsers().subscribe((res:any)=>{
      this.allUsers = res;
      this.dtTrigger.next(null);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  OnAddFormSubmit()
  {
    if(this.userForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.userForm);
      return;
    }

    const formData = this.userForm.value;
    this.isLoading = true;
    this.adminService.CreateUser(formData).subscribe((res:any)=>{
      this.modalService.dismissAll();
      this.GetAllUsers();
      this.isLoading = false;
      this.toastr.success('User added successfully.', 'Create user',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
    
  }

  OnEditFormSubmit()
  {
    if(this.userForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.userForm);
      return;
    }

    const formData = this.userForm.value;
    this.isLoading = true;
    this.adminService.EditUser(this.userId,formData).subscribe((res:any)=>{
      this.modalService.dismissAll();
      this.GetAllUsers();
      this.isLoading = false;
      this.toastr.warning('User updated successfully.', 'Update user',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
    
  }

  OnDeleteFormSubmit()
  {
    if(!this.userId)
    {
      return;
    }

    this.isLoading = true;
    this.adminService.DeleteUser(this.userId).subscribe((res:any)=>{
      this.modalService.dismissAll();
      this.GetAllUsers();
      this.isLoading = false;
      this.toastr.error('User deleted successfully.', 'Delete user',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
    
  }

  isInvalidField(control: any) {
    return control.invalid && control.touched;
  }
}
