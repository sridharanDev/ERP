import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { FormValidatorService } from '../../utils/form-validator.service';
import { AssetService } from 'src/app/services/asset.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css']
})
export class AssetsComponent implements OnInit
{
  allTypes:any = [];
  allAssets:any = [];
  expenseId:any;
  isLoading:boolean = false;

  filter:String = "NA";

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();


  assetForm = new FormGroup({
    type :new FormControl('',Validators.required),
    name :new FormControl('',Validators.required),
    asset_id :new FormControl('',Validators.required),
    to :new FormControl('',Validators.required),
    note :new FormControl(''),
    status :new FormControl('',Validators.required),
  });

  constructor(private assetService:AssetService,private modalService: NgbModal,
    private formValidatorService:FormValidatorService,private toastr: ToastrService){}

  ngOnInit(): void 
  {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: "<'row'<'col-sm-6'l<'float-left'B>><'col-sm-6'f>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-6'i><'col-sm-6'<'float-right'p>>>",
      buttons: [
        'csv', 'excel', 'pdf', 'print'
      ],
      columnDefs :[
        {
          targets:[0],
          width:'10px'
        },
        {
          targets:[6],
          width:'50px'
        },
        {
          targets:[7],
          width:'10px',
          orderable: false,
          searchable: false,
        },
      ]
    } as DataTables.Settings;  
    this.GetAllTypes();
    this.GetAllAssets();
  }

  openModal(component:any,expenseId:any)
  {
    this.expenseId = expenseId;
    const modalRef = this.modalService.open(component,{
      size: 'md',
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });
    this.assetForm.reset();
    if(this.expenseId)
    {
      this.assetService.GetAsset(this.expenseId).subscribe((res:any)=>{
        this.assetForm.patchValue(res);
      },(error)=>{
        this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      });
    }
  }

  GetAllTypes()
  {
    this.assetService.GetTypes().subscribe((res:any)=>{
      this.allTypes = res;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
    });
  }

  GetAllAssets()
  {
    this.isLoading = true;
    $('#datatable').DataTable().destroy();
    this.assetService.GetAssets().subscribe((res:any)=>{
      const assets:any = [];
      for(const asset of res)
      {
        if(this.filter === "NA")
        {
          assets.push(asset);
        }
        else
        {
          if(this.filter === asset.type._id)
          {
            assets.push(asset);
          }
        }
      }
      this.allAssets = assets;
      this.dtTrigger.next(null);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  OnCreateSumbit()
  {
    if(this.assetForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.assetForm);
      return;
    }
    const formData = this.assetForm.value;
    this.isLoading = true;
    this.assetService.CreateAsset(formData).subscribe((res:any)=>{
      this.GetAllAssets();
      this.modalService.dismissAll();
      this.toastr.success('New asset created successfully.', 'Create asset',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  OnEditSumbit()
  {
    if(this.assetForm.invalid)
    {
      this.formValidatorService.markFormGroupTouched(this.assetForm);
      return;
    }
    const formData = this.assetForm.value;
    this.isLoading = true;
    this.assetService.EditAsset(this.expenseId,formData).subscribe((res:any)=>{
      this.GetAllAssets();
      this.modalService.dismissAll();
      this.toastr.warning('Asset updated successfully.', 'Edit asset',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  OnDeleteSubmit()
  {
    this.isLoading = true;
    this.assetService.DeleteAsset(this.expenseId).subscribe((res:any)=>{
      this.GetAllAssets();
      this.modalService.dismissAll();
      this.toastr.error('Asset deleted successfully.', 'Delete asset',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  isInvalidField(control: any) {
    return control.invalid && control.touched;
  }
}
