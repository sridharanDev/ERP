import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StaffService } from '../../services/staff.service';
import { SalaryService } from '../../services/salary.service';
import { FormValidatorService } from '../../utils/form-validator.service';
import { CustomValidatorService } from '../../utils/custom-validator.service';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.css']
})
export class SalaryComponent implements OnInit
{
  

  salaryForm = new FormGroup({
    staff_id :new FormControl('NA',[Validators.required,this.CustomValidators.isEqual('NA')]),
    staff_name:new FormControl('',Validators.required),
    working_days :new FormControl(0,Validators.required),
    salary_date :new FormControl('',Validators.required),
    credited_date :new FormControl('',Validators.required),
    actual_salary :new FormControl(0,Validators.required),
    paid :new FormControl(0,Validators.required),
    status :new FormControl('NA',[Validators.required,this.CustomValidators.isEqual('NA')]),
  });

  salaries:any = [];
  allStaffs:any = [];
  salaryDetailId:any = null;
  isLoading:boolean = false;

  selectedCSV:File | null = null;

  constructor(private modalService: NgbModal,private staffService:StaffService,
    private formValidatorService:FormValidatorService,private CustomValidators:CustomValidatorService,
    private salaryService:SalaryService,private toastr: ToastrService) {}

  ngOnInit(): void 
  {
    this.GetAllStaffs();
    this.GetAllSalary();
  }

  openLgModal(component:any,salaryId:any)
  {
    this.salaryDetailId = salaryId;
    const modalRef = this.modalService.open(component,{
      size: 'lg',
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });

    this.salaryForm.reset();
    if(this.salaryDetailId != null)
    {
      this.salaryService.GetSalary(this.salaryDetailId).subscribe((res:any)=>{
        this.salaryForm.patchValue(res);
        this.GetSelectedStaff();
      },(error)=>{
        this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      });
    }
  }
  openModal(component:any,salaryId:any)
  {
    this.salaryDetailId = salaryId;
    const modalRef = this.modalService.open(component,{
      size: 'md',
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });
    if(this.selectedCSV)
    {
      this.selectedCSV = null;
    }
  }

  GetAllStaffs()
  {
    this.staffService.GetStaffs().subscribe((res:any)=>{
      this.allStaffs = res;
    },(error)=>{
      this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
    });
  }
  GetAllSalary()
  {
    this.isLoading = true;
    this.salaryService.GetSalarys().subscribe((res:any)=>{
      this.salaries = res;
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  GetSelectedStaff()
  {
    const staff_id = this.salaryForm.value.staff_id;
    this.staffService.GetStaff(staff_id).subscribe((res:any)=>{
      this.salaryForm.get("staff_name")?.setValue(res.name);
      this.salaryForm.get("actual_salary")?.setValue(res.role.salery);
    },(error)=>{
      this.salaryForm.get("staff_name")?.setValue(null);
      this.salaryForm.get("actual_salary")?.setValue(0);
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
    });
  }

  OnAddFormSubmit()
  {
    if(this.salaryForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.salaryForm);
      return;
    }

    const formData = this.salaryForm.value;
    this.isLoading = true;
    this.salaryService.CreateSalary(formData).subscribe((res:any)=>{
      this.GetAllSalary();
      this.modalService.dismissAll();
      this.toastr.success('New salary detail added successfully.', 'Add salary detail',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
    
  }

  OnEditFormSubmit()
  {
    if(this.salaryForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.salaryForm);
      return;
    }

    const formData = this.salaryForm.value;
    this.isLoading = true;
    this.salaryService.EditSalary(this.salaryDetailId,formData).subscribe((res:any)=>{
      this.GetAllSalary();
      this.modalService.dismissAll();
      this.toastr.warning('Salary detail updated successfully.', 'Update salary detail',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
    
  }

  DeleteSubmit()
  {
    this.isLoading = true;
    this.salaryService.DeleteSalary(this.salaryDetailId).subscribe((res:any)=>{
      this.GetAllSalary();
      this.modalService.dismissAll();
      this.toastr.error('Salary detail deleted successfully.', 'Delete salary detail',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  onFileSelected(event: any) {
    this.selectedCSV = event.target.files[0] as File;
  }

  UploadCSVSubmit()
  {
    const formData = new FormData();

    if(!this.selectedCSV)
    {
      return;
    }

    formData.append('csvFile', this.selectedCSV, this.selectedCSV.name);

    this.isLoading = true;
    this.salaryService.UploadSalary(formData).subscribe((res:any)=>{
      this.GetAllSalary();
      this.modalService.dismissAll();
      this.toastr.info('Salary detail uploaded successfully.', 'Upload salary detail',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  isInvalidField(control: any) {
    return control.invalid && control.touched;
  }
}


