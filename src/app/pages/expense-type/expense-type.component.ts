import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { FormValidatorService } from '../../utils/form-validator.service';
import { ExpenseService } from 'src/app/services/expense.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-expense-type',
  templateUrl: './expense-type.component.html',
  styleUrls: ['./expense-type.component.css']
})
export class ExpenseTypeComponent implements OnInit
{
  types:any = [];
  typeId:any;
  isLoading:boolean = false;
  selectedRow:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  typeForm = new FormGroup({
    name :new FormControl('',Validators.required),
  });

  constructor(private expenseService:ExpenseService,private modalService: NgbModal,
    private formValidatorService:FormValidatorService,private toastr: ToastrService){}

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
        width:'10px',
        orderable: false,
        searchable: false,
      },
    ]
  };
    this.GetAllTypes(); 
  }

  openModal(component:any,typeId:any)
  {
    this.typeId = typeId;
    const modalRef = this.modalService.open(component,{
      size: 'md',
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });
    this.typeForm.reset();
    if(this.typeId)
    {
      this.expenseService.GetType(this.typeId).subscribe((res:any)=>{
        this.typeForm.patchValue(res);
        this.selectedRow = res;
      },(error)=>{
        this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      });
    }
  }

  GetAllTypes()
  {
    this.isLoading = true;
    $('#datatable').DataTable().destroy();
    this.expenseService.GetTypes().subscribe((res:any)=>{
      this.types = res;
      this.dtTrigger.next(null);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  OnCreateSumbit()
  {
    if(this.typeForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.typeForm);
      return;
    }
    const formData = this.typeForm.value;
    this.isLoading = true;
    this.expenseService.CreateType(formData).subscribe((res:any)=>{
      this.GetAllTypes();
      this.modalService.dismissAll();
      this.toastr.success('New type created successfully.', 'Create type',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  OnEditSumbit()
  {
    if(this.typeForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.typeForm);
      return;
    }
    const formData = this.typeForm.value;
    this.isLoading = true;
    this.expenseService.EditType(this.typeId,formData).subscribe((res:any)=>{
      this.GetAllTypes();
      this.modalService.dismissAll();
      this.toastr.warning('Type updated successfully.', 'Edit type',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  OnDeleteSubmit()
  {
    this.isLoading = true;
    this.expenseService.DeleteType(this.typeId).subscribe((res:any)=>{
      this.GetAllTypes();
      this.modalService.dismissAll();
      this.toastr.error('Type deleted successfully.', 'Delete type',{timeOut: 3000,closeButton: true,progressBar: true,},);
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
