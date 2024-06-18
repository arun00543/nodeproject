import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'app/core/service/analytics/analytics.service';
import { UserService } from 'app/core/service/user.service';
import { Chart } from 'chart.js';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-crm-chart',
  templateUrl: './crm-chart.component.html',
  styleUrls: ['./crm-chart.component.scss']
})
export class CrmChartComponent implements OnInit {

  noData =
    [
      { "clientName": '', "dd": 33, "type": "None" },
    ]

  duration = [
    { key: 'Daily', value: "daily" },
    { key: 'Week', value: "week" },
    { key: 'Year', value: "year" },
  ]

  chartType = [
    { key: 'Line', value: "line" },
    { key: 'Bar', value: "bar" },
  ]

  // myData.map(d => d.Region),
  empList: any;
  empId: any = '';
  chart1Type: any = 'line'
  isData: boolean = false;
  G_countChart: any;
  S_countChart: any;
  chart1Ratio: any = 4 / 1.4
  G_by_emp_countChart: any;
  replied: number = 0;
  opportunity: number = 0;
  quotation: number = 0;
  lostQuotation: number = 0;
  interested: number = 0;
  converted: number = 0;
  doNotContact: number = 0;
  showChart: boolean = false;
  hide = true
  // events

  constructor(
    private analytics: AnalyticsService,
    private userService: UserService,
    private spinner: NgxSpinnerService
  ) { }
  chart1: any;
  chart2: any;
  chart3: any;

  ngOnInit() {
    this.isMobileMenu();
    this.getData()
  }

  isMobileMenu() {
    if ($(window).width() > 768) {
      this.chart1Ratio = 4 / 1.4
    } else {
      this.chart1Ratio = 1
    }
  }

  show() {
    if(!this.hide){
      this.getData();
    }
    else if(this.hide){
      this.getLeadStatusCount();
    }
    this.hide = !this.hide
  }
  onSelectChartType(data) {
    this.chart1.destroy();
    if (this.chart2) {
      this.chart2.destroy();
    }
    this.chart1Type = data
    this.leadCountChart();
  }

  onSelectDuration(data) {
    this.chart1.destroy();
    if (this.chart2) {
      this.chart2.destroy();
    }
    if (data === "daily") {
      this.analytics.leadDailyCount().subscribe((response: any) => {
        if (response) {
          this.isData = false;
          this.G_countChart = (response.data ? response.data : [])
          this.leadCountChart();
        } else {
          this.isData = true;
        }
      });
    } else if (data === "week") {
      this.analytics.leadWeeklyCount().subscribe((response: any) => {
        if (response) {
          this.isData = false;
          this.G_countChart = (response.data ? response.data : [])
          this.leadCountChart();
        } else {
          this.isData = true;
        }
      });
    } else {
      this.analytics.leadYearlyCount().subscribe((response: any) => {
        if (response) {
          this.isData = false;
          this.G_countChart = response.data
          this.leadCountChart();
        } else {
          this.isData = true;
        }
      });
    }

  }

  LeadStatusChart() {
    this.chart2 = new Chart("LeadStatusChart", {
      type: "pie", //this denotes tha type of chart

      data: {
        labels: ["Replied",
          "Opportunity",
          "Quotation",
          "LostQuotation",
          "Interested",
          "Converted",
          "DoNotContact"],
        datasets: [
          {
            label: "Count",
            data: [
              this.replied,
              this.opportunity,
              this.quotation,
              this.lostQuotation,
              this.interested,
              this.converted,
              this.doNotContact,
            ],
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 165, 0)",
              "rgb(255, 255, 0)",
              "rgb(0,0,255)",
              "rgb(0,128,0)",
              "rgb(255,0,0)",
            ]
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        maintainAspectRatio: false,
      },
    });
  }

  leadCountChart() {
    this.chart1 = new Chart("LeadCountChart", {
      type: this.chart1Type, //this denotes tha type of chart

      data: {
        labels: this.G_countChart.map(d => d.date),
        datasets: [
          {
            label: 'Lead Count',
            data: this.G_countChart.map(d => d.leads),
            backgroundColor: 'rgb(54, 162, 235,0.7)',
            borderColor: 'rgb(54, 162, 235, 0.6)',
          }
        ]
      },
      options: {
        responsive: true,
        aspectRatio: this.chart1Ratio,
        layout: {
          padding: {
            top: 0
          }
        },
        animations: {
          radius: {
            duration: 400,
            easing: 'linear',
            loop: (context) => context.active
          }
        },
        interaction: {
          mode: 'nearest',
          intersect: false,
          axis: 'x'
        },
        plugins: {
          title: {
            display: true,
            text: ''
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Day',
              font: {
                weight: 'bold'
              }
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'No. of Leads',
              font: {
                weight: 'bold'
              }
            }
          }
        }
      },
    });
  }

  getLeadStatusCount() {
    this.analytics.leadStatusCount().subscribe((response: any) => {
      if (response) {
        this.chart1.destroy();
        this.S_countChart = (response.data ? response.data : [])
        for (let count of this.S_countChart) {
          switch (count.status) {
            case "Replied": this.replied = count.leadsCount; break;
            case "Opportunity": this.opportunity = count.leadsCount; break;
            case "Quotation": this.quotation = count.leadsCount; break;
            case "LostQuotation": this.lostQuotation = count.leadsCount; break;
            case "Interested": this.interested = count.leadsCount; break;
            case "Converted": this.converted = count.leadsCount; break;
            case "DoNotContact": this.doNotContact = count.leadsCount; break;
          }
        }
        this.LeadStatusChart();
      }
    });
  }


  getData() {
    if (this.chart2) {
      this.chart2.destroy();
    }

    this.analytics.leadDailyCount().subscribe((response: any) => {
      if (response) {
        this.isData = false;
        this.G_countChart = (response.data ? response.data : [])
        this.leadCountChart();
      } else {
        this.isData = true;
      }
    });
  }
}
