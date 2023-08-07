import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvoiceService } from 'src/app/services/invoice.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit
{

  allInvoices:any = [];
  invoiceType:any;

  isLoading:boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private route:ActivatedRoute,private invoiceService:InvoiceService){}
  ngOnInit(): void 
  {
    this.invoiceType = this.route.snapshot.params["type"];
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
    if(this.invoiceType)
    {
      this.GetAllInvoices();
    }
  }

  GetAllInvoices()
  {
    const query = "type="+this.invoiceType;
    $('#datatable').DataTable().destroy();
    this.invoiceService.GetInvoices(query).subscribe((res:any)=>{
      this.allInvoices = res;
      this.dtTrigger.next(null);
    },(error)=>{

    });
  }
}
