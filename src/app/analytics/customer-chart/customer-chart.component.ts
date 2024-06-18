import { Component, OnInit } from "@angular/core";
import { AnalyticsService } from "app/core/service/analytics/analytics.service";
import { UserService } from "app/core/service/user.service";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

@Component({
  selector: "app-customer-chart",
  templateUrl: "./customer-chart.component.html",
  styleUrls: ["./customer-chart.component.scss"],
})
export class CustomerChartComponent implements OnInit {
  chart1Ratio: any = 4 / 2;
  chart2Ratio: any = 4 / 1.4;
  orderChart: any;
  saleChart: any;
  paymentChart: any;
  customerDetail: any;
  custId: any = '';
  chartType: boolean = true;
  chartTypes =  [
    { key: 'Orders & Sales', value: true },
    { key: 'Payment', value: false },
  ]

  constructor(
    private analyticsService: AnalyticsService,
    private userService: UserService,
  ) {}
  chart1: any;
  chart2: any;
  customer:Array<any> = [''];

  ngOnInit() {
    this.isMobileMenu();
    // this.getData();
    this.loadData();
  }

  isMobileMenu() {
    if ($(window).width() > 768) {
      this.chart2Ratio = 4 / 1.4;
    } else {
      this.chart2Ratio = 1;
    }
  }

  customersChart() {
    this.chart2 = new Chart("customersChart", {
      type: "line", //this denotes tha type of chart

      data: {
        labels: this.customerDetail?.map((d) => d.clientName),
        datasets: [
          {
            type: "bar",
            label: "Orders",
            data: this.customerDetail?.map((d) => d.orderCount),
            backgroundColor: "#209d207d",
            borderColor: "green",
            borderWidth: 1,
            yAxisID: "y1",
            barPercentage: 0.9, // Adjust the width of the bars
            hidden: !this.chartType
          },
          {
            type: "bar",
            label: "Sales",
            data: this.customerDetail?.map((d) => d.salesCount),
            backgroundColor: "rgb(171 209 235 / 56%)",
            borderColor: "rgb(54, 162, 235)",
            borderWidth: 1,
            yAxisID: "y1",
            barPercentage: 0.9, // Adjust the width of the bars
            hidden: !this.chartType
          },
          {
            label: "Total Amount",
            data: this.customerDetail?.map((d) => d.totalPaymentAmount),
            fill: false,
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            yAxisID: "y",
            tension: 0.4,
            hidden: this.chartType
          },
          {
            label: "Amount Paid",
            data: this.customerDetail?.map((d) => d.totalPaidAmount),
            backgroundColor: "rgb(255,15,0)",
            borderColor: "rgb(255,15,0)",
            borderDash: [5, 5],
            fill: false,
            yAxisID: "y",
            tension: 0.4,
            hidden: this.chartType
          },
          {
            label: "Balance Amount",
            data: this.customerDetail?.map((d) => d.totalBalanceAmount),
            backgroundColor: "rgb(217 217 217 / 74%)",
            borderColor: "rgb(116 116 116)",
            borderWidth: 1,
            fill: true,
            yAxisID: "y",
            tension: 0.4,
            hidden: this.chartType
          },
        ],
      },
      options: {
        responsive:true,
        aspectRatio: this.chart2Ratio,
        plugins: {
          title: {
            display: true,
            text: "",
          },
        },
        interaction: {
          mode: "index",
          intersect: false,
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 0,
            bottom: 10
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "Customer",
            },
          },
          y: {
            display: true,
            position: this.chartType ? "right" : "left",
            title: {
              display: true,
              text: "Total Payment",
            },
            ticks: {
              callback: function(value) {
                 var ranges = [
                    { divider: 1e7, suffix: 'C' },
                    { divider: 1e5, suffix: 'L' }
                 ];
                 function formatNumber(n) {
                    for (var i = 0; i < ranges.length; i++) {
                       if (n >= ranges[i].divider) {
                          return (n / ranges[i].divider).toString() + ranges[i].suffix;
                       }
                    }
                    return n;
                 }
                 return '₹' + formatNumber(value);
              }
           }
          },
          y1: {
            display: true,
            position: this.chartType ? "left" : "right",
            title: {
              display: true,
              text: "Total Sales and Orders",
            },
          },
        },
      },
    });
  }

  onSelect(){
    this.chart2.destroy();
    this.customersChart();
  }

  onSelectCust(data?){
    if(this.custId){
      this.chart1.destroy();
     } else {
       this.chart2.destroy();
   }
    this.custId = data? data.id : ''
    this.loadData();
  }

  customerChart() {
    this.chart1 = new Chart("customerChart", {
      type: "pie", //this denotes tha type of chart
      data: {
        labels:  ["Total Amount",
        "Paid Amount",
        "Balance Amount",
        ],
        datasets: [
          {
            label: "Amount",
            data: [
              this.customerDetail[0]?.totalPaymentAmount,
              this.customerDetail[0]?.totalPaidAmount,
              this.customerDetail[0]?.totalBalanceAmount
            ],  
            backgroundColor: [
              "rgb(54, 162, 235)",
              "rgb(255, 99, 132)",
              "rgb(255,0,0)"
            ]
          },
        ],
      },
      options: {
        responsive: true,
        aspectRatio: this.chart1Ratio,
      },
    });
  }

  loadData(){
    this.analyticsService
    .customerSalesOrdersChartCount(this.custId)
    .subscribe((response: any) => {
      if (response) {
        this.customerDetail = response?.data;
        if(this.custId){
          this.customerChart();
        } else {
        this.customer = [];
        this.customerDetail.map((a) => {
        let cust = {
        id: a.id,
        name: a.clientName
        }
        this.customer.push(cust)
        })
        this.customersChart();
      }
      }
    });
  }

  // getData() {
  //   this.userService.getCustomer().subscribe((res) => {
  //     this.customer = res.data;
  //   });
  //   this.loadData();
  // }
}
