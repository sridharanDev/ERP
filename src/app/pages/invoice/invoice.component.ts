import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvoiceService } from 'src/app/services/invoice.service';
import { tap ,delay} from 'rxjs/operators';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit
{
  billingData:any = {};

  constructor(private route: ActivatedRoute,private invoiceService:InvoiceService) {}

  ngOnInit(): void 
  {
    const invoice_no = this.route.snapshot.paramMap.get('invoice_no');
    this.invoiceService.GetInvoice(invoice_no).pipe(
      tap((res: any) => {
        this.billingData = res;
        this.OnChange();
      }),
      delay(500)
    ).subscribe(() => {
      // Print the invoice after fetching the data
      this.printInvoice();
    });
  }

  OnChange()
  {
    this.billingData.sub_total = this.CaculateSubtotal();   
    this.billingData.tax_amount = this.CalculateTax();
    this.billingData.net_total = this.CalculateNetTotal();
    this.billingData.balance = this.CalculateBalace();
    // this.form3.get("discount")?.setValue(this.CalaculateDiscount());
  }

  CaculateSubtotal()
  {
    var total = 0;
    for (let i = 0; i < this.billingData.items.length; i++) 
    {
      const item = this.billingData.items[i];
      total += item.price;  
    }
    return total;
  }

  CalculateTax()
  {
    var tax_amount = 0;
    var tax:any = this.billingData["tax"];
    tax_amount = (this.CaculateSubtotal() * tax) / 100;
    return tax_amount;
  }

  CalaculateDiscount()
  {
    var amount = 0;
    var discount:any = this.billingData["discount_percent"];
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
    var paid:any = this.billingData["paid"];
    balance = this.CalculateNetTotal() - paid;
    // balance = balance >= 0 ? balance : 0;
    return balance;
  }

  convertPriceToWords(price: number): string {
    // Array of words for numbers from 0 to 19
    const words: string[] = [
      'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
    ];

    // Array of words for tens from 20 to 90
    const tensWords: string[] = [
      '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];

    if (price === 0) {
      return words[0];
    }

    let result = '';

    // Function to convert a two-digit number to words
    const convertTwoDigitNumber = (num: number): string => {
      if (num < 20) {
        return words[num];
      } else {
        const tensDigit = Math.floor(num / 10);
        const onesDigit = num % 10;
        return tensWords[tensDigit] + (onesDigit !== 0 ? '-' + words[onesDigit] : '');
      }
    };

    if (price >= 10000000) {
      result += convertTwoDigitNumber(Math.floor(price / 10000000)) + ' Crore ';
      price %= 10000000;
    }

    if (price >= 100000) {
      result += convertTwoDigitNumber(Math.floor(price / 100000)) + ' Lakh ';
      price %= 100000;
    }

    if (price >= 1000) {
      result += convertTwoDigitNumber(Math.floor(price / 1000)) + ' Thousand ';
      price %= 1000;
    }

    if (price >= 100) {
      result += words[Math.floor(price / 100)] + ' Hundred ';
      price %= 100;
    }

    if (price > 0) {
      if (result !== '') {
        result += 'and ';
      }
      result += convertTwoDigitNumber(price);
    }

    return result;
  }

  printInvoice() {
    window.print();
  }
}
