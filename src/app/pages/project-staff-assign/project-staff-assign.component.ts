import { Component,OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { StaffService } from 'src/app/services/staff.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-project-staff-assign',
  templateUrl: './project-staff-assign.component.html',
  styleUrls: ['./project-staff-assign.component.css']
})
export class ProjectStaffAssignComponent implements OnInit
{

  projectDetails:any;
  projectId:any;

  allStaffs:any = [];

  staffSelect:String = "NA";
  assignedStaffs:any = [];

  constructor(private projectService:ProjectService,private staffService:StaffService,
    private route:ActivatedRoute,private toastr: ToastrService)
  {
  }

  ngOnInit(): void 
  {
    this.projectId = this.route.snapshot.params['id'];
    this.GetProjectDetails(this.projectId);
    this.GetAllStaffs();
  }

  GetProjectDetails(projectId:any)
  {
    this.projectService.GetProject(projectId).subscribe((res:any)=>{
      this.projectDetails = res;
      this.assignedStaffs = res.staffs;
    },(error)=>{

    });
  }

  GetAllStaffs()
  {
    this.staffService.GetStaffs().subscribe((res:any)=>{
      this.allStaffs = res;
    });
  }

  OnAssignSubmit()
  {
    if(this.staffSelect === "NA")
    {
      return;
    }
    for(const staff of this.allStaffs)
    {
      if(staff._id === this.staffSelect)
      {
        if(!this.assignedStaffs.includes(staff))
        {
          this.assignedStaffs.push(staff);
        }
        this.staffSelect = "NA";
        break;
      }
    }
  }

  isSelected(_id:String)
  {
    for(const staff of this.assignedStaffs)
    {
      if(staff._id === _id)
      {
        return true;
      }
    }
    return false;
  }

  RemoveFromAssign(_id:String)
  {
    for(const staff of this.assignedStaffs)
    {
      if(staff._id === _id)
      {
        const index = this.assignedStaffs.indexOf(staff);
        this.assignedStaffs.splice(index,1);
        break;
      }
    }
  }

  OnSaveSumbit()
  {
   if(this.assignedStaffs.length <= 0) return;

   const formData:any = {staffs:[]};
   for(const staff of this.assignedStaffs)
   {
    formData.staffs.push(staff._id);
   }

    this.projectService.EditProject(this.projectId,formData).subscribe((res:any)=>{
      this.toastr.success('Staff assigned successfully.', 'Assign staffs',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
    });
  }

  GetStatusColor(status:String):any
  {
    if(status == "upcomming")
    {
      return "bg-primary"
    }
    else if(status == "completed")
    {
      return "bg-success"
    }
    else if(status == "ongoing")
    {
      return "bg-warning"
    }
  }
}
