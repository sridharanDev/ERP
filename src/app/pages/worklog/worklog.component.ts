import { Component,OnInit } from '@angular/core';
import { WorklogService } from 'src/app/services/worklog.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { FormValidatorService } from 'src/app/utils/form-validator.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-worklog',
  templateUrl: './worklog.component.html',
  styleUrls: ['./worklog.component.css']
})
export class WorklogComponent implements OnInit
{
  allWorklogs:any = [];
  userId:String = ""
  worklogID:any;
  isLoading:boolean = false;
  selectedRow:any;

  filterInput:any = "recent";

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  worklogForm = new FormGroup({
    title:new FormControl('',Validators.required),
    description :new FormControl('',Validators.required),
  });

  constructor(private worklogService:WorklogService,private modalService: NgbModal,
    private toastr: ToastrService,private formValidatorService:FormValidatorService){}

  ngOnInit(): void 
  {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      columnDefs :[
        {
          targets:[0],
          width:'50px'
        },
        {
          targets:[2],
          width:'100px'
        },
        {
          targets:[5],
          width:'10px',
          orderable: false,
          searchable: false,
        },
      ]
    }
    this.GetAllWorklogs();
  }

  openModal(component:any,worklogID:any)
  {
    this.worklogID = worklogID;
    const modalRef = this.modalService.open(component,{
      size: 'md',
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });
    this.worklogForm.reset();
    if(this.worklogID)
    {
      this.worklogService.GetWorklog(this.worklogID).subscribe((res:any)=>{
        this.worklogForm.patchValue(res);
        this.selectedRow = res;
      },(error)=>{
        this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      });
    }
   
  }
  
  GetAllWorklogs()
  {
    this.isLoading = true;
    $('#datatable').DataTable().destroy();
    this.worklogService.GetWorklogs("").subscribe((res:any)=>{
      if(this.filterInput === "recent")
      {
        this.allWorklogs = this.GetRecentLogs(res);
      }
      else
      {
        this.allWorklogs = res;
      }
      this.dtTrigger.next(null);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  GetRecentLogs(workLogsRes:any)
  {
    const worklogs:any = [];
    for(const log of workLogsRes)
    {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 1);
      const previousDate = currentDate.toISOString();
      if(this.isDateGreaterThanOrEqual(log.createdAt,previousDate))
      {
        worklogs.push(log);
      }
    }    
    return worklogs;
  }


  OnEditSubmit()
  {
    if(this.worklogForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.worklogForm);
      return;
    }
    let formData:any = this.worklogForm.value;
    formData['staff'] = this.userId;

    this.isLoading = true;
    this.worklogService.EditWorklog(this.worklogID,formData).subscribe((res:any)=>{
      this.modalService.dismissAll();
      this.GetAllWorklogs();
      this.toastr.warning("Worklog updated successfully. ", 'Edit worklog.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  OnDeleteSubmit()
  {
    this.isLoading = true;
    this.worklogService.DeleteWorklog(this.worklogID).subscribe((res:any)=>{
      this.modalService.dismissAll();
      this.GetAllWorklogs();
      this.toastr.error("Worklog deleted successfully. ", 'Delete worklog',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  areDatesEqual(dateString1: any, dateString2: any) {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
  
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth();
    const day1 = date1.getDate();
  
    const year2 = date2.getFullYear();
    const month2 = date2.getMonth();
    const day2 = date2.getDate();
  
    return year1 === year2 && month1 === month2 && day1 === day2;
  }
  
  isDateLessThan(dateString1: any, dateString2: any) {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
  
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);
  
    return date1.getTime() < date2.getTime();
  }
  
  isDateGreaterThan(dateString1: any, dateString2: any) {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
  
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);
  
    return date1.getTime() > date2.getTime();
  }
  
  isDateGreaterThanOrEqual(dateString1: any, dateString2: any) {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
  
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);
  
    return date1.getTime() >= date2.getTime();
  }
  
  isDateLessThanOrEqual(dateString1: any, dateString2: any) {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
  
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);
  
    return date1.getTime() <= date2.getTime();
  }

  isInvalidField(control: any) {
    return control.invalid && control.touched;
  }
}
