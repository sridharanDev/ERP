import { Component,OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

interface Module {
  name: string;
  permissions: string[];
  selected: boolean;
}

@Component({
  selector: 'app-add-admin-role',
  templateUrl: './add-admin-role.component.html',
  styleUrls: ['./add-admin-role.component.css']
})
export class AddAdminRoleComponent implements OnInit
{

  allModules: Module[] = [
    { name: 'dashboard', permissions: [], selected: false },
    { name: 'admin', permissions: [], selected: false },
    { name: 'staff', permissions: [], selected: false },
    { name: 'project', permissions: [], selected: false },
    { name: 'course', permissions: [], selected: false },
    { name: 'billing', permissions: [], selected: false },
  ];

  roleName:String = '';
  isLoading:boolean = false;

  constructor(private adminService:AdminService,private toastr: ToastrService,private location: Location){}

  ngOnInit(): void 
  {
    
  }

  submitData()
  {
    const selectedModules = this.allModules.filter((module) => module.selected);

    const submittedData = selectedModules.map((module) => ({
      name: module.name,
      permissions: module.permissions.filter((permission) =>
        ['read', 'write', 'edit', 'delete'].includes(permission)
      ),
    }));

    
    if(this.roleName.length > 0 && submittedData.length > 0)
    {
      const formData = {name:this.roleName,modules:submittedData};
      this.adminService.CreateRole(formData).subscribe((res:any)=>{
        this.toastr.success('New admin role added successfully.', 'Add admin role',{timeOut: 3000,closeButton: true,progressBar: true,},);
        this.isLoading=false;
        this.location.back();
      },(error)=>{
        this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
        this.isLoading=false;
      });
    }
  }

  togglePermission(permission: string, index: number) {
    const module = this.allModules[index];
    const permissionIndex = module.permissions.indexOf(permission);

    if (permissionIndex !== -1) {
      module.permissions.splice(permissionIndex, 1);
    } else {
      module.permissions.push(permission);
    }

  }

  toggleModuleSelection(index: number) {
    this.allModules[index].selected = !this.allModules[index].selected;
  }

}
