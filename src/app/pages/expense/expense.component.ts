import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { FormValidatorService } from '../../utils/form-validator.service';
import { ExpenseService } from 'src/app/services/expense.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit
{
  allTypes:any = [];
  allExpenses:any = [];
  expenseId:any;
  isLoading:boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();


  expenseForm = new FormGroup({
    type :new FormControl('',Validators.required),
    date :new FormControl('',Validators.required),
    amount :new FormControl(0,Validators.required),
    note :new FormControl(''),
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
          targets:[5],
          width:'10px',
          orderable: false,
          searchable: false,
        },
      ]
    };  
    this.GetAllTypes();
    this.GetAllExpenses();
  }

  openModal(component:any,expenseId:any)
  {
    this.expenseId = expenseId;
    const modalRef = this.modalService.open(component,{
      size: 'md',
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });
    this.expenseForm.reset();
    if(this.expenseId)
    {
      this.expenseService.GetExpense(this.expenseId).subscribe((res:any)=>{
        this.expenseForm.patchValue(res);
        this.expenseForm.get("date")?.setValue(new Date(res.date).toISOString().substring(0, 10));        
      },(error)=>{
        this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      });
    }
  }

  GetAllTypes()
  {
    this.expenseService.GetTypes().subscribe((res:any)=>{
      this.allTypes = res;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
    });
  }

  GetAllExpenses()
  {
    this.isLoading = true;
    $('#datatable').DataTable().destroy();
    this.expenseService.GetExpenses().subscribe((res:any)=>{
      this.allExpenses = res;
      this.dtTrigger.next(null);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  OnCreateSumbit()
  {
    if(this.expenseForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.expenseForm);
      return;
    }
    const formData = this.expenseForm.value;
    this.isLoading = true;
    this.expenseService.CreateExpense(formData).subscribe((res:any)=>{
      this.GetAllExpenses();
      this.modalService.dismissAll();
      this.toastr.success('New expense created successfully.', 'Create expense',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  OnEditSumbit()
  {
    if(this.expenseForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.expenseForm);
      return;
    }
    const formData = this.expenseForm.value;
    this.isLoading = true;
    this.expenseService.EditExpense(this.expenseId,formData).subscribe((res:any)=>{
      this.GetAllExpenses();
      this.modalService.dismissAll();
      this.toastr.warning('Expense updated successfully.', 'Edit expense',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  OnDeleteSubmit()
  {
    this.isLoading = true;
    this.expenseService.DeleteExpense(this.expenseId).subscribe((res:any)=>{
      this.GetAllExpenses();
      this.modalService.dismissAll();
      this.toastr.error('Expense deleted successfully.', 'Delete expense',{timeOut: 3000,closeButton: true,progressBar: true,},);
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
