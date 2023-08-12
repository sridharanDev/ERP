import { Component,OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

interface Module {
  name: string;
  permissions: string[];
  selected: boolean;
}

@Component({
  selector: 'app-edit-admin-role',
  templateUrl: './edit-admin-role.component.html',
  styleUrls: ['./edit-admin-role.component.css']
})
export class EditAdminRoleComponent implements OnInit
{
  allModules: Module[] = [
    { name: 'dashboard', permissions: [], selected: false },
    { name: 'admin', permissions: [], selected: false },
    { name: 'staff', permissions: [], selected: false },
    { name: 'project', permissions: [], selected: false },
    { name: 'course', permissions: [], selected: false },
    { name: 'billing', permissions: [], selected: false },
    { name: 'assets', permissions: [], selected: false },
    { name: 'expenses', permissions: [], selected: false },
    { name: 'others', permissions: [], selected: false },
  ];

  roleName:string = "";
  isLoading:boolean = false;
  roleId:any = null;

  constructor(private adminService:AdminService,private toastr: ToastrService,
    private location: Location,private router:ActivatedRoute){}

  ngOnInit(): void 
  {
    this.roleId = this.router.snapshot.params["id"];
    if(this.roleId)
    {
      this.GetRoleData();
    }
  }

  GetRoleData() {
    this.isLoading = true;
    this.adminService.GetRole(this.roleId).subscribe((res: any) => {
      this.roleName = res.name;
        for (let module of res.modules) {
          const existingModuleIndex = this.allModules.findIndex(
            (existingModule) => existingModule.name === module.name
          );
          if (existingModuleIndex !== -1) {
            this.allModules[existingModuleIndex].selected = true;
  
            if (module.permissions) {
              this.allModules[existingModuleIndex].permissions = module.permissions;
            }
          }
        }
        this.isLoading = false;
      },(error) => {
        this.toastr.error(error.message, 'Something went wrong.', {
          timeOut: 3000,
          closeButton: true,
          progressBar: true,
        });
        this.isLoading = false;
      }
    );
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
      this.isLoading=true;
      this.adminService.EditRole(this.roleId,formData).subscribe((res:any)=>{
        this.toastr.success('Admin role updated successfully.', 'Update admin role',{timeOut: 3000,closeButton: true,progressBar: true,},);
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
