import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from 'src/app/services/course.service';
import { ProjectService } from 'src/app/services/project.service';
import { IncomeService } from 'src/app/services/income.service';
import { FormValidatorService } from '../../utils/form-validator.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css']
})
export class IncomeComponent implements OnInit
{
  incomeId:any;

  incomeType:string = "NA";
  allProjects:any = [];

  allProjectIncomes:any = [];
  allCourseIncomes:any = [];
  allInternIncomes:any = [];
  allRentIncomes:any = [];

  isLoading:boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  incomeForm = new FormGroup({
    entityType:new FormControl('NA',Validators.required),
    entity:new FormControl(),
    name:new FormControl(''),
    from:new FormControl('',Validators.required),
    to:new FormControl('',Validators.required),
    amount:new FormControl('',Validators.required),
    note:new FormControl(''),
    date:new FormControl('',Validators.required),
    payment_type:new FormControl('NA',Validators.required),
  });

  constructor(private modalService: NgbModal,private courseService:CourseService,
    private projectService:ProjectService,private formValidatorService:FormValidatorService,
    private incomeService:IncomeService,private toastr: ToastrService) {}

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
          width:'100px'
        },
        {
          targets:[7],
          width:'10px',
          orderable: false,
          searchable: false,
        },
      ]
    };  
    this.GetAllProjects();
    this.GetAllIncomes();
  }

  openLgModal(component:any,incomeId:any)
  {
    this.incomeId = incomeId;

    const modalRef = this.modalService.open(component,{
      size: 'lg',
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });
    this.incomeForm.reset();
    if(incomeId)
    {
      this.incomeService.GetIncome(this.incomeId).subscribe((res:any)=>{
        this.incomeForm.patchValue(res);
      },(error)=>{

      });
    }
  }

  openModal(component:any,incomeId:any)
  {
    this.incomeId = incomeId;

    const modalRef = this.modalService.open(component,{
      size: 'md',
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });
  
  }

  GetAllProjects()
  {
    this.projectService.GetProjects("").subscribe((res:any)=>{
      this.allProjects = res; 
    },(error)=>{

    });
  }

  GetAllIncomes()
  {
    this.isLoading = true;
    $('#datatable').DataTable().destroy();
    this.incomeService.GetIncomes().subscribe((res:any)=>{
      this.allProjectIncomes = res.incomesWithProjects;
      this.allCourseIncomes = res.incomesWithCourses;
      this.dtTrigger.next(null);
      this.isLoading = false;
    },(error)=>{
      this.isLoading = false;
    });
  }

  OnCreateSubmit()
  {
    if(this.incomeForm.invalid)
    {
      return;
    }
    const fromData = this.incomeForm.value;
    this.isLoading = true;
    this.incomeService.CreateIncome(fromData).subscribe((res)=>{
      this.modalService.dismissAll();
      this.GetAllIncomes();
      this.isLoading = false;
    },(error)=>{
      this.isLoading = false;
    });
  }

  OnEditSubmit()
  {
    if(this.incomeForm.invalid)
    {
      return;
    }
    const fromData = this.incomeForm.value;
    this.isLoading = true;
    this.incomeService.EditIncome(this.incomeId,fromData).subscribe((res)=>{
      this.modalService.dismissAll();
      this.GetAllIncomes();
      this.isLoading = false;
    },(error)=>{
      this.isLoading = false;
    });
  }

}
