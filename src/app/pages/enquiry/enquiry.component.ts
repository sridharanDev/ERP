import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/services/student.service';
import { StaffService } from 'src/app/services/staff.service';
import { Subject } from 'rxjs';

interface DropdownItem {
  _id: string;
  title: string;
}

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.css']
})
export class EnquiryComponent implements OnInit
{
  studentId:any = null;
  allStudents:any = [];
  allStaffs:DropdownItem[] = [

  ];
  isLoading:boolean = false;

  statsuField:any = 'NA';
  staffField:any = 'NA';
  callBackDateField:any = '';

  selectedStaffs:DropdownItem[] = [];
  dropdownSettings = {};
  
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  
  constructor(private modalService: NgbModal,private studentService:StudentService,
    private staffService:StaffService,private toastr: ToastrService) {
      this.dropdownSettings = {
        singleSelection: false,
        enableCheckAll: false,
        idField: '_id',
        textField: 'title',
      };
    }
    
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
          targets:[5],
          width:'50px',
        },
        {
          targets:[6],
          width:'30px',
          className: 'text-center',
        },
        {
          targets:[7],
          width:'10px',
          orderable: false,
          searchable: false,
        },
      ]
    };
    this.GetAllStaffs();
    this.GetAllStudents();
  }
  
  openModal(component:any,studentId:any)
  {
    this.studentId = studentId;
    const modalRef = this.modalService.open(component,{
      size: 'md',
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });

    if(this.studentId)
    {
      this.statsuField = "NA";
      this.staffField = "NA";
      this.callBackDateField = "";

      this.studentService.GetStudent(this.studentId).subscribe((res:any)=>{
        this.statsuField = res.status;
        this.staffField = res.staffs[0]._id;
        this.callBackDateField = res.call_back_date;
      });
    }
  }
  
  GetAllStudents()
  {
    this.isLoading = true;
    $('#datatable').DataTable().destroy();
    this.studentService.GetStudents().subscribe((res:any)=>{
      this.allStudents = res;
      this.dtTrigger.next(null);
      this.isLoading = false;
    },(error)=>{
      this.isLoading = false;
    });
  }

  GetAllStaffs()
  {
    this.staffService.GetStaffs().subscribe((res:any)=>{
      const staffList = [];
      for(let staff of res)
      {
        staffList.push({_id:staff._id,title:staff.staff_id + " - " + staff.name});
      }
      this.allStaffs = staffList;
      
    },(error)=>{
      console.log(error);
      
    });
  }

  onItemSelect(item:any)
  {
    this.selectedStaffs.push(item);
  }
  
  onItemDeSelect(item: any) {
    
    const index = this.selectedStaffs.findIndex(staff => staff._id === item._id);
    if (index !== -1) {
      this.selectedStaffs.splice(index, 1);
    }
  }

  StausSubmit()
  {
    if(this.statsuField == 'NA' || (this.staffField == "converted" && this.staffField == "NA"))
    {
      return;
    }
    var formData = {};
    if(this.staffField != 'NA'){ 
      formData = {status:this.statsuField , staffs:[this.staffField], call_back_date:this.callBackDateField};
    }
    else{
      formData = {status:this.statsuField};
    }

    this.isLoading = true;
    this.studentService.EditStudent(this.studentId,formData).subscribe((res:any)=>{
      this.modalService.dismissAll();
      this.GetAllStudents();
      this.isLoading = false;
      this.toastr.warning('Enquiry status updated successfully.', 'Update enquiry status',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  DeleteSubmit()
  {
    
    this.isLoading = true;
    this.studentService.DeleteStudent(this.studentId).subscribe((res:any)=>{
      this.modalService.dismissAll();
      this.GetAllStudents();
      this.isLoading = false;
      this.toastr.error('Enquiry deleted successfully.', 'Delete enquiry',{timeOut: 3000,closeButton: true,progressBar: true,},);
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
    else if(status == "intrested")
    {
      return "bg-success"
    }
    else if(status == "not intrested")
    {
      return "bg-danger"
    }
    else if(status == "not answer")
    {
      return "bg-warning"
    }
    else if(status == "converted")
    {
      return "bg-success"
    }
  }
}
