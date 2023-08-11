import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvoiceService } from 'src/app/services/invoice.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit
{

  allInvoices:any = [];
  invoiceType:any;
  invoiceId:any;

  isLoading:boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private route:ActivatedRoute,private invoiceService:InvoiceService,
    private modalService: NgbModal,private toastr: ToastrService){}
    
  ngOnInit(): void 
  {
    this.route.params.pipe(
      switchMap(params => {
        this.invoiceType = params['type'];
        return this.route.data;
      })
    ).subscribe(data => {
      this.handleRouteLogic();
    });
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      columnDefs :[
        {
          targets:[0],
          width:'10px'
        },
        {
          targets:[6],
          width:'10px',
          orderable: false,
          searchable: false,
        },
      ]
    };
  }
  
  handleRouteLogic()
  {
    if(this.invoiceType)
    {
      this.GetAllInvoices();
    }
    
  }
  openModal(component:any,invoiceId:any)
  {
    this.invoiceId = invoiceId;
    const modalRef = this.modalService.open(component,{
      size: 'md',
      windowClass: 'modal',
      centered: false,
      backdrop: 'static',
      keyboard: false,
    });
  }

  GetAllInvoices()
  {
    this.isLoading = true;
    const query = "type="+this.invoiceType;
    $('#datatable').DataTable().destroy();
    this.invoiceService.GetInvoices(query).subscribe((res:any)=>{
      this.allInvoices = res;
      this.dtTrigger.next(null);
      this.isLoading = false;
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }

  DeleteSubmit()
  {
    this.isLoading = true;
    this.invoiceService.DeleteInvoice(this.invoiceId).subscribe((res:any)=>{
      this.modalService.dismissAll();
      this.GetAllInvoices();
      this.isLoading = false;
      this.toastr.error('Invoice deleted successfully.', 'Delete invoice',{timeOut: 3000,closeButton: true,progressBar: true,},);
    },(error)=>{
      this.toastr.error(error.message, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      this.isLoading = false;
    });
  }
}
