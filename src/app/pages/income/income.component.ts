import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from 'src/app/services/course.service';
import { ProjectService } from 'src/app/services/project.service';
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
  allCourses:any = [];

  incomeForm = new FormGroup({
    entityType:new FormControl('',Validators.required),
    entity:new FormControl(''),
    name:new FormControl(''),
    from:new FormControl('',Validators.required),
    to:new FormControl('',Validators.required),
    amount:new FormControl('',Validators.required),
    note:new FormControl(''),
    date:new FormControl('',Validators.required),
  });

  constructor(private modalService: NgbModal,private courseService:CourseService,
    private projectService:ProjectService,private formValidatorService:FormValidatorService,
    private toastr: ToastrService) {}

  ngOnInit(): void 
  {
    this.GetAllProjects();
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

}
