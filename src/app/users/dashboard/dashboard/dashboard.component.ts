import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AnalyticsService } from 'app/core/service/analytics/analytics.service';
import { AuthService } from 'app/core/service/auth.service';
import { InventoryService } from 'app/core/service/inventory/inventory.service';
import { OrdersService } from 'app/core/service/orders/orders.service';
import { noImg } from "app/inventory-management/noImg";
import { Chart, registerables } from "chart.js";
import { SharedService } from 'app/shared/shared.service';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentDateTime: Date = new Date();

  public datasets: any;
  public chart: any;
  public walletOutstanding: any;
  data: any;
  public dashData: any;
  dashTableData = [];
  public userRole: string;
  userId: number;
  noImg = noImg;
  customerDetails: any;


  constructor(
    private inventoryService: InventoryService,
    private authService: AuthService,
    private analyticsService: AnalyticsService,
    public router : Router,
    public share:SharedService
  ) { }
  customerAmountChart() {
    this.chart = new Chart("MyChart", {
      type: "doughnut", //this denotes the type of chart
      data: {
        labels: ["Total", "Paid", "Balance"],
        datasets: [
          {
            label: "Rs. ",
            data: [
              this.customerDetails?.totalPaymentAmount,
              this.customerDetails?.totalPaidAmount,
              this.customerDetails?.totalBalanceAmount,
            ],
            backgroundColor: [
              "rgb(54, 162, 235)",
              "#1f8933",
              "#ff4141",
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: 20,
        plugins: {
          legend: {
            // display: false,
            position: 'left',
            align: 'center',
            labels: {
              boxWidth: 15,
              padding: 5
            }
          }
        }
      },
    });
  }

  ngOnInit(): void {
    this.userRole = this.authService.currentUserValue.role;
    this.userId = this.authService.currentUserValue.userId;
    setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);

    this.inventoryService.getDashboardDetails().subscribe((response: any) => {
      if (response) {
        this.dashData = response.data
      }
    })

    this.analyticsService              // chart data call
      .dashboardCustomerSalesCount(this.userId)
      .subscribe((response: any) => {
        if (response) {
          this.customerDetails = response.data;
          this.customerAmountChart();
        }
      });
  }
  onClick(){
    this.router.navigate([`/order&cart/products-list`]);
    this.share.activeLink = ('/order&cart/products-list');
  }
}