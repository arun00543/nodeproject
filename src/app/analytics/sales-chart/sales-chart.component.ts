import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'app/core/service/analytics/analytics.service';
import { UserService } from 'app/core/service/user.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-sales-chart',
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.scss']
})
export class SalesChartComponent implements OnInit {

  duration = 'daily'
  durations =  [
    { key: 'Daily', value: "daily" },
    { key: 'Week', value: "week" },
    { key: 'Month', value: "month" },
  ]

  custId: any = '';
  custDetails: any = '';
  saleChart: any;
  counts: any;
  chart1Ratio: any = 4/1.4
  chart1: any;
	chart2: any;

  constructor(
    private analyticsService: AnalyticsService,
    private userService: UserService,
    ) {}

  ngOnInit() {
    this.isMobileMenu();
    this.loadData();
  }

  isMobileMenu() {
    if ($(window).width() > 768) {
      this.chart1Ratio = 4/1.4
    } else{
      this.chart1Ratio = 1
    }
  }


  orderSalesCountChart(){
    this.chart1 = new Chart("orderAndSalesCountChart", {
      type: 'line', //this denotes tha type of chart
      data: {
        labels:  this.counts.map(d => d.date),
        datasets: [
        {
          type : 'bar',
          label: 'Order Count',
          data: this.counts.map(d => d.totalOrderCounts),
          backgroundColor: "rgb(44 146 215)",
            borderColor: "rgb(44 146 215)",
          yAxisID: "y",
        },
        {
          type : 'bar',
          label: 'Sales Count',
          data: this.counts.map(d => d.totalSalesCounts),
          backgroundColor: "rgb(44 215 57)",
            borderColor: "rgb(44 215 57)",
          yAxisID: "y",
        },
        {
          type : 'line',
          label: 'Payment Done',
          data: this.counts.map(d => d.totalPaidAmount),
          backgroundColor: "rgb(255 75 75)",
            borderColor: "rgb(255 75 75)",
            tension: 0.4,
          yAxisID: "y1",
        }
      ]
      },
      options: {
        responsive: true,
        aspectRatio: this.chart1Ratio,
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
              text: 'Duration',
              font: {
                weight: 'bold'
            }
            }
          },
          y: {
            display: true,
            position: "left",
            title: {
              display: true,
              text: "Orders and Sales",
            },
          },
          y1: {
            display: true,
            position: "right",
            beginAtZero:true,
            title: {
              display: true,
              text: "Payments",
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
        }
      },
    });
  }

  onSelect(){
    this.chart1.destroy();
    this.loadData();
  }

  loadData(){
    if(this.duration === "daily"){
        this.analyticsService.DailyCount().subscribe((response: any) => {
          if (response) {
             this.counts =  (response.data ? response.data : [])
        this.orderSalesCountChart();  
          }
        });
    } else if (this.duration === "week"){
        this.analyticsService.WeeklyCount().subscribe((response: any) => {
          if (response) {
             this.counts =  (response.data ? response.data : [])
        this.orderSalesCountChart();  
          }
        });
    } else {
        this.analyticsService.MonthlyCount().subscribe((response: any) => {
          if (response) {
             this.counts =  (response.data ? response.data : [])
        this.orderSalesCountChart();  
          }
        });
    }
  }
}