import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/shared/models/Order';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.css']
})
export class PaymentPageComponent implements OnInit {

  @ViewChild('orderSummary') orderSummary!: ElementRef; // Reference to the order summary section
  order: Order = new Order();
  successMessage: string | null = null; // Property to hold the success message

  constructor(private orderService: OrderService, private router: Router) {
    this.orderService.getNewOrderForCurrentUser().subscribe({
      next: (order) => {
        this.order = order;
      },
      error: () => {
        this.router.navigateByUrl('/checkout');
      }
    });
  }

  ngOnInit(): void {}

  saveOrderDirectly(): void {
    this.orderService.create(this.order).subscribe({
      next: () => {
        this.successMessage = 'Order placed successfully!'; // Set success message
      },
      error: (err: any) => {
        console.error('Error saving order:', err);
      }
    });
  }

  downloadOrderSummary(): void {
    html2canvas(this.orderSummary.nativeElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('order-summary.pdf');
    });
  }
}
    