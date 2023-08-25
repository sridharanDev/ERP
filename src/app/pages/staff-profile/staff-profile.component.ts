import { Component,OnInit } from '@angular/core';
import { StaffService } from 'src/app/services/staff.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-staff-profile',
  templateUrl: './staff-profile.component.html',
  styleUrls: ['./staff-profile.component.css']
})
export class StaffProfileComponent implements OnInit
{

  envUri:string = environment.uploadsUrl;
  staffId:any = null;
  staffProfile:any;

  constructor(private staffService:StaffService,private route: ActivatedRoute){}

  ngOnInit(): void 
  {
    this.staffId = this.route.snapshot.paramMap.get('id');
    this.GetStaffProfile();
  }

  GetStaffProfile()
  {
    this.staffService.GetStaff(this.staffId).subscribe((res:any)=>{
      this.staffProfile = res;
    },(error)=>{
      console.log(error);
    });
  }

  GetFileType(fileName:string)
  {
    let image = "assets/img/";
    const lastDotIndex = fileName.lastIndexOf('.');
    const fileExtension = fileName.substring(lastDotIndex + 1);
    if(fileExtension == 'pdf')
    {
      image += "pdf.png";
    }
    else if(fileExtension == 'csv')
    {
      image += "csv.png";
    }
    else if(fileExtension == 'docx')
    {
      image += "doc.png";
    }
    else if(fileExtension == 'zip')
    {
      image += "zip.png";
    }
    else if(fileExtension == 'rar')
    {
      image += "rar.png";
    }
    else if(fileExtension == 'txt')
    {
      image += "txt.png";
    }
    else if(fileExtension == 'png' || fileExtension == 'jpg' || fileExtension == 'jpeg')
    {
      image = environment.uploadsUrl + fileName;
    }
    else
    {
      image += "unknown-file.png";
    }
    return image;
  }

  GetStatusColor(status:String):any
  {
    if(status == "active")
    {
      return "bg-success"
    }
    else if(status == "inactive")
    {
      return "bg-warning"
    }
    else if(status == "relived")
    {
      return "bg-danger"
    }
    else
    {
      return "bg-secondary"
    }
  }
}
