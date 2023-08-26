import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from 'src/app/services/project.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { FormValidatorService } from '../../utils/form-validator.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-completed-projects',
  templateUrl: './completed-projects.component.html',
  styleUrls: ['./completed-projects.component.css']
})
export class CompletedProjectsComponent {

  projectId:any = null;
  allProjects:any = [];
  isLoading:boolean = false;
  selectedRow:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private projectService:ProjectService,private modalService: NgbModal,
    private formValidatorService:FormValidatorService,private toastr: ToastrService){}



  statusForm = new FormGroup({
    status :new FormControl('',Validators.required),
  });



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
          targets:[4],
          width:'50px'
        },
        {
          targets:[5],
          width:'10px',
          orderable: false,
          searchable: false,
        },
      ]
    };
    this.GetAllProjects();
  }

  openModal(component:any,projectId:any)
  {
    this.projectId = projectId;
    const modalRef = this.modalService.open(component,{
      size: 'md',
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });
    if(this.projectId)
    {
      this.projectService.GetProject(this.projectId).subscribe((res:any)=>{
        this.selectedRow = res;
      });
    }  
  }

  GetAllProjects()
  {
    this.isLoading = true;
    $('#datatable').DataTable().destroy();
    this.projectService.GetProjects("status=completed").subscribe((res:any)=>{
      this.allProjects = res;
      this.dtTrigger.next(null);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }


  EditFormSubmit()
  {
    if(this.statusForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.statusForm);
      return;
    }
    const formData = this.statusForm.value;
    this.isLoading = true;
    this.projectService.EditProject(this.projectId,formData).subscribe((res)=>{
      this.modalService.dismissAll();
      this.statusForm.reset();
      this.isLoading = false;
      this.GetAllProjects();
      this.toastr.warning('Project updated successfully.', 'Update Project',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
    
  }

  DeleteSubmit()
  {
    if(!this.projectId)
    {
      return;
    }
    this.isLoading = true;
    this.projectService.DeleteProject(this.projectId).subscribe((res)=>{
      this.isLoading = false;
      this.GetAllProjects();
      this.modalService.dismissAll();
      this.toastr.error('Project deleted successfully.', 'Delete project',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }
  
  isInvalidField(control: any) {
    return control.invalid && control.touched;
  }
}


