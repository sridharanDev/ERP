import { Component,OnInit } from '@angular/core';
import { IncomeService } from 'src/app/services/income.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-income-report',
  templateUrl: './income-report.component.html',
  styleUrls: ['./income-report.component.css']
})
export class IncomeReportComponent implements OnInit
{

  allIncomes:any = [];

  totalIncome:number = 0;

  filter1:string = "Project";
  filter2:string = "";

  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();

  constructor(
    private incomeService:IncomeService,
  ){}

  ngOnInit(): void 
  {
    this.dtOptions1 = {
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: "<'row'<'col-sm-6'l<'float-left'B>><'col-sm-6'f>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-6'i><'col-sm-6'<'float-right'p>>>",
      buttons: [
        'csv', 'excel', 'pdf', 'print'
      ],
    } as DataTables.Settings;
    this.GetAllIncomes();
  }

  GetAllIncomes()
  {
    const incomes:any = [];
    let totalIncome = 0;
    $('#datatable1').DataTable().destroy();
    this.incomeService.GetIncomes().subscribe((res:any)=>{
      if(this.filter1 === "Project")
      {
        for(const income of res.incomesWithProjects)
        {
          if(this.filter2.length <= 0)
          {
            incomes.push(income);
            totalIncome += income.amount;
          }
          else
          {
            const date = income.createdAt.split("T")[0].slice(0, -3);
            if(date === this.filter2)
            {
              incomes.push(income);
              totalIncome += income.amount;
            }            
          }
        }
      }
      else if(this.filter1 === "Student")
      {
        for(const income of res.incomesWithCourses)
        {
          if(this.filter2.length <= 0)
          {
            incomes.push(income);
            totalIncome += income.amount;
          }
          else
          {
            const date = income.createdAt.split("T")[0].slice(0, -3);
            if(date === this.filter2)
            {
              incomes.push(income);
              totalIncome += income.amount;
            }            
          }
        }
      }
      else if(this.filter1 === "Intern")
      {
        for(const income of res.incomesWithInterns)
        {
          if(this.filter2.length <= 0)
          {
            incomes.push(income);
            totalIncome += income.amount;
          }
          else
          {
            const date = income.createdAt.split("T")[0].slice(0, -3);
            if(date === this.filter2)
            {
              incomes.push(income);
              totalIncome += income.amount;
            }            
          }
        }
      }
      else if(this.filter1 === "Rent")
      {
        for(const income of res.incomesWithRents)
        {
          if(this.filter2.length <= 0)
          {
            incomes.push(income);
            totalIncome += income.amount;
          }
          else
          {
            const date = income.createdAt.split("T")[0].slice(0, -3);
            if(date === this.filter2)
            {
              incomes.push(income);
              totalIncome += income.amount;
            }            
          }
        }
      }
      this.allIncomes = incomes;
      this.totalIncome = totalIncome;
      this.dtTrigger1.next(null);
    },(error)=>{

    });
  }
}
