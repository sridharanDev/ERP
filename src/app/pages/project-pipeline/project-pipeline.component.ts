import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from '../../services/project.service';
import { StaffService } from '../../services/staff.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { FormValidatorService } from '../../utils/form-validator.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-project-pipeline',
  templateUrl: './project-pipeline.component.html',
  styleUrls: ['./project-pipeline.component.css']
})
export class ProjectPipelineComponent implements OnInit
{
  projectId:any = null;
  allProjects:any = [];
  allStaffs:any = [];
  isLoading:boolean = false;
  selectedRow:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  showSecondLabel: boolean = false;

  constructor(private projectService:ProjectService,private modalService: NgbModal,
    private staffService:StaffService, private formValidatorService:FormValidatorService,
    private toastr: ToastrService){}



  statusForm = new FormGroup({
    status :new FormControl('',Validators.required),
    call_back_date :new FormControl(Validators.required),
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
          width:'100px'
        },
        {
          targets:[5],
          width:'50px',
        },
        {
          targets:[6],
          width:'10px',
          orderable: false,
          searchable: false,
        },
      ]
    };
    this.GetAllProjects();
    this.GetAllStaffRoles();
  }


  onStatusChange() {
    const statusControl = this.statusForm.get('status');

    // Check if "Ongoing" is selected in the first select box
    this.showSecondLabel = statusControl?.value === 'ongoing';

    // Optionally, you can reset the staffs selection when the status changes
    // if (!this.showSecondLabel) {
    //   this.statusForm.patchValue({
    //     staffs: 'NA',
    //   });
    // }
  }
  GetAllStaffRoles()
  {
    this.isLoading = true;
    this.staffService.GetStaffs().subscribe((res)=>{
      this.allStaffs = res;
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
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
    this.projectService.GetProjects("status=pipeline&status=call back").subscribe((res:any)=>{
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

  GetStatusColor(status:String):any
  {
    if(status == "call back")
    {
      return "bg-primary"
    }
    else if(status == "pipeline")
    {
      return "bg-secondary"
    }
  }
  
  isInvalidField(control: any) {
    return control.invalid && control.touched;
  }
}
