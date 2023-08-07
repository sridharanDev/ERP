import { Component,OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { InvoiceService } from 'src/app/services/invoice.service';
import { StudentService } from 'src/app/services/student.service';
import { CourseService } from 'src/app/services/course.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit
{
  constructor(private route:ActivatedRoute,private studentService:StudentService,
    private invoiceService:InvoiceService,private toastr: ToastrService,
    private courseService:CourseService,private router: Router){}

  studentId:any;
  allCourses:any  = [];

  invoiceDetails:any = null;

  ngOnInit(): void 
  {
    const studentId = this.route.snapshot.queryParamMap.get("studentId");
    const invoiceNo = this.route.snapshot.queryParamMap.get("invoiceno");
    this.GetInvoiceNumber();
    const currentDate:any = new Date();
    this.form1.get("date")?.setValue(this.DateFormate(currentDate));
    if(studentId)
    {
      this.studentId = studentId;
      this.GetStudentData(studentId);
    }
    else if(invoiceNo)
    {
      this.GetInvoice(invoiceNo);
    }
    this.GetCourses();
  }
  
  GetInvoiceNumber()
  {
    this.invoiceService.GetInvoiceNumber().subscribe((res:any)=>{

      this.form1.get("invoice_no")?.setValue(res.invoice_no);
    },(error)=>{
      this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
    });

  }

  form1 = new FormGroup({
    invoice_no :new FormControl('',Validators.required),
    date :new FormControl('',Validators.required),
    customer_name :new FormControl('',Validators.required),
    customer_email :new FormControl(''),
    customer_mobile :new FormControl('',Validators.required),
  });
  form2 = new FormGroup({
    type :new FormControl('NA'),
    option :new FormControl('NA'),
  });

  form3 = new FormGroup({
    sub_total :new FormControl(0),
    tax :new FormControl(0),
    tax_amount :new FormControl(0),
    gst_no :new FormControl(''),
    discount_percent :new FormControl(0),
    discount_amount :new FormControl(0),
    discount :new FormControl(0),
    net_total :new FormControl(0),
    pay_type :new FormControl('NA'),
    paid :new FormControl(0),
    balance :new FormControl(0),
    remider_date :new FormControl(''),
  });

  billList:any = [];

  GetStudentData(studentId:any)
  {
    this.studentService.GetStudent(studentId).subscribe((res:any)=>{   
      this.form1.get("customer_name")?.setValue(res.name);   
      this.form1.get("customer_email")?.setValue(res.email);   
      this.form1.get("customer_mobile")?.setValue(res.mobile);   
      const courses = res.courses;
      for (let i = 0; i < courses.length; i++) {
        const item = {name:courses[i].title,desc:courses[i].description,price:courses[i].fees,amount:courses[i].fees};
        this.AddToBill(item);        
      }
      this.OnChange();
    },(error)=>{
      this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
    });
  }

  GetCourses()
  {
    this.courseService.GetCourses().subscribe((res:any)=>{
      this.allCourses = res;      
    },(error)=>{
      this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
    });
  }

  GetInvoice(invoiceNo:any)
  {
    this.invoiceService.GetInvoice(invoiceNo).subscribe((res:any)=>{
      this.invoiceDetails = res;
      this.form1.get("invoice_no")?.setValue(res.invoice_no);   
      this.form1.get("date")?.setValue(res.date);   
      this.form1.get("customer_name")?.setValue(res.customer_name);   
      this.form1.get("customer_email")?.setValue(res.customer_email);   
      this.form1.get("customer_mobile")?.setValue(res.customer_mobile); 
      this.form3.get("tax")?.setValue(res.tax); 
      this.form3.get("discount_percent")?.setValue(res.discount_percent); 
      this.form3.get("pay_type")?.setValue(res.pay_type); 
      this.form3.get("paid")?.setValue(res.paid); 
      const items = res.items;
      this.billList.splice(0,this.billList.length);
      for (let i = 0; i < items.length; i++) {
        const item = {name:items[i].name,desc:items[i].desc,price:items[i].price,amount:items[i].amount};
        this.AddToBill(item);        
      }
      this.OnChange();
    },(error)=>{

    });
  }
  
  OnChange()
  {
    this.form3.get("sub_total")?.setValue(this.CaculateSubtotal());   
    this.form3.get("tax_amount")?.setValue(this.CalculateTax());
    this.form3.get("net_total")?.setValue(this.CalculateNetTotal());
    this.form3.get("balance")?.setValue(this.CalculateBalace());
    this.form3.get("discount")?.setValue(this.CalaculateDiscount());
  }

  CaculateSubtotal()
  {
    var total = 0;
    for (let i = 0; i < this.billList.length; i++) 
    {
      const item = this.billList[i];
      total += item.price;  
    }
    return total;
  }

  CalculateTax()
  {
    var tax_amount = 0;
    var tax:any = this.form3.value.tax;
    tax_amount = (this.CaculateSubtotal() * tax) / 100;
    return tax_amount;
  }

  CalaculateDiscount()
  {
    var amount = 0;
    var discount:any = this.form3.value.discount_percent;
    amount = (this.CaculateSubtotal() * discount) / 100;
    return amount;
  }
  
  CalculateNetTotal()
  {
    var net_total = 0;
    net_total = this.CaculateSubtotal() + this.CalculateTax();
    net_total = net_total - this.CalaculateDiscount();
    return net_total;
  }

  CalculateBalace()
  {
    var balance = 0;
    var paid:any = this.form3.value.paid;
    balance = this.CalculateNetTotal() - paid;
    // balance = balance >= 0 ? balance : 0;
    return balance;
  }

  DateFormate(inputDateString:string)
  {
    const dateObj = new Date(inputDateString);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  AddToBill(list_item:any)
  {
    this.billList.push(list_item);
  }

  RemoveFromBill(index:any)
  {
    this.billList.splice(index,1);
    this.OnChange();
  }

  SelectType(type:any)
  {
    if(type == "courses")
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  AddItemSubmit()
  {
    const _id = this.form2.value.option;
    var selected = null;
    for (let i = 0; i < this.allCourses.length; i++) 
    {
      if(this.allCourses[i]._id == _id)
      {
        selected = this.allCourses[i];
        break;
      }
    }
    if(selected)
    {
      const item = {name:selected.title,desc:selected.description,price:selected.fees,amount:selected.fees};
      this.AddToBill(item);
    }    
    this.OnChange();
  }

  OnPrintSubmit()
  {
    const type = {type:"course",student_id:this.studentId};
    const items = {items:this.billList};
    const formData = Object.assign({},items,type,this.form1.value,this.form3.value);
    
    if(!this.invoiceDetails)
    {
      this.invoiceService.CreateInvoice(formData).subscribe((res:any)=>{
        const routePath = '/invoice/'+res.invoice_no;
        window.open(this.router.createUrlTree([routePath]).toString(), '_blank');
      },(error)=>{
        this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      });
    }
    else
    {
      this.invoiceService.EditInvoice(this.invoiceDetails.invoice_no,formData).subscribe((res:any)=>{
        const routePath = '/invoice/'+res.invoice_no;
        window.open(this.router.createUrlTree([routePath]).toString(), '_blank');
      },(error)=>{
        this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      });
    }
  }
  OnSaveSubmit()
  {
    const type = {type:"course",student_id:this.studentId};
    const items = {items:this.billList};
    const formData = Object.assign({},items,type,this.form1.value,this.form3.value);
    
    if(!this.invoiceDetails)
    {

      this.invoiceService.CreateInvoice(formData).subscribe((res:any)=>{
        this.GetInvoice(res.invoice_no);
        this.toastr.success('Invoice saved successfully.', 'Save Invoice',{timeOut: 3000,closeButton: true,progressBar: true,},);
      },(error)=>{
        this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      });
    }
    else
    {
      this.invoiceService.EditInvoice(this.invoiceDetails.invoice_no,formData).subscribe((res:any)=>{
        this.toastr.warning('Invoice updated successfully.', 'Update Invoice',{timeOut: 3000,closeButton: true,progressBar: true,},);
      },(error)=>{
        this.toastr.error(error.error, 'Something went wrong.',{timeOut: 3000,closeButton: true,progressBar: true,},);
      });
    }
  }



}
