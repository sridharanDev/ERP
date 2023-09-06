import { Component,OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StaffService } from '../../services/staff.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { FormValidatorService } from '../../utils/form-validator.service';
import { CustomValidatorService } from '../../utils/custom-validator.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.css']
})
export class AddStaffComponent implements OnInit
{
 

  staffRoles:any = [];
  staffSchedules:any = [];
  isLoading:boolean = false;

  selectedFiles: File[] = [];

  staffForm = new FormGroup({
    staff_id :new FormControl('',Validators.required),
    name :new FormControl('',Validators.required),
    father_name :new FormControl('',Validators.required),
    email :new FormControl('',Validators.required),
    mobile :new FormControl('',Validators.required),
    dob :new FormControl('',Validators.required),
    address :new FormControl('',Validators.required),
    qualification :new FormControl('',Validators.required),
    skills :new FormControl('',Validators.required),
    interview_date :new FormControl('',Validators.required),
    join_date :new FormControl('',Validators.required),
    designation :new FormControl('',Validators.required),
    role :new FormControl('NA',[Validators.required,this.CustomValidators.isEqual('NA')]),
    schedule :new FormControl('NA',[Validators.required,this.CustomValidators.isEqual('NA')]),
    status :new FormControl('active',Validators.required),
  });

  constructor(private staffService:StaffService,private toastr: ToastrService,
    private breadcrumbService: BreadcrumbService,private formValidatorService:FormValidatorService,
    private CustomValidators:CustomValidatorService,private location: Location,private scheduleService:ScheduleService){}


  ngOnInit(): void 
  {
    this.breadcrumbService.setBreadcrumb([
      { label: 'Staffs', url: '/staff-list' },
      { label: 'Add new staff', url: '#' },
    ]);
    this.GetAllStaffRoles();
    this.GetAllStaffSchedule();
  }

  GetAllStaffRoles()
  {
    this.isLoading = true;
    this.staffService.GetRoles().subscribe((res)=>{
      this.staffRoles = res;
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  GetAllStaffSchedule()
  {
    this.isLoading = true;
    this.scheduleService.GetSchedules().subscribe((res)=>{
      this.staffSchedules = res;
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  OnFormSubmit()
  {
    if(this.staffForm.valid)
    {
      const formData = this.convertFormGroupToFormData(this.staffForm);
      for (const file of this.selectedFiles) {
        formData.append('attachments', file);
      }
      this.isLoading=true;
      this.staffService.CreateStaff(formData).subscribe((res)=>{
        this.toastr.success('New staff added successfully.', 'Add new staff',{timeOut: 3000,closeButton: true,progressBar: true,},);
        this.isLoading=false;
        this.location.back();
      },(error)=>{
        this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
        this.isLoading=false;
      });
    }
    else
    {
      this.formValidatorService.markFormGroupTouched(this.staffForm);
    }
    
  }

  convertFormGroupToFormData(formGroup: FormGroup): FormData {
    const formData = new FormData();
  
    for (const controlName in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(controlName)) {
        const control = formGroup.controls[controlName];
  
        if (control.value instanceof File) {
          formData.append(controlName, control.value, control.value.name);
        } else {
          formData.append(controlName, control.value);
        }
      }
    }
  
    return formData;
  }

  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files) {
      const filesArray = Array.from(inputElement.files);

      this.selectedFiles = filesArray;
    }
  }

  removeFile(file: File) {
    const index = this.selectedFiles.indexOf(file);
    if (index !== -1) {
      this.selectedFiles.splice(index, 1);
    }
  }

  formatTimeTo12Hour(time: string): string {
    const [hours, minutes] = time.split(':');
    let formattedTime = '';
  
    const numericHours = Number(hours);
    if (numericHours === 0) {
      formattedTime = `12:${minutes} AM`;
    } else if (numericHours < 12) {
      formattedTime = `${numericHours}:${minutes} AM`;
    } else if (numericHours === 12) {
      formattedTime = `12:${minutes} PM`;
    } else {
      formattedTime = `${numericHours - 12}:${minutes} PM`;
    }
  
    return formattedTime;
  }

  formatFileSize(size: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let index = 0;
    while (size >= 1024 && index < units.length - 1) {
      size /= 1024;
      index++;
    }
    return `${size.toFixed(2)} ${units[index]}`;
  }

  isInvalidField(control: any) {
    return control.invalid && control.touched;
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
      image = fileName;
    }
    else
    {
      image += "unknown-file.png";
    }
    return image;
  }
}
