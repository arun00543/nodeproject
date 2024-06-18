import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'app/core/service/analytics/analytics.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-expense-chart',
  templateUrl: './expense-chart.component.html',
  styleUrls: ['./expense-chart.component.scss']
})
export class ExpenseChartComponent implements OnInit {
  ratio: any = 4 / 1.4;
  data: any;
  dataSource: any[];
  hideChart = false;
  brands: Array<any> = [];
  allItem: Array<any> = [];
  unit: Array<any> = [];
  brandId = '';
  itemId = '';
  employeeId = ''; protected
  chartType: string = '';
  duration = 'daily'
  durations = [
    { key: 'Daily', value: "daily" },
    { key: 'Week', value: "weekly" },
    { key: 'Month', value: "monthly" },
    { key: 'Custom', value: "custom" },

  ];
  selectType = 'category'
  selectedType: any[] = [
    { key: 'Category', value: "category" },
    { key: 'Duration', value: "duration" },
    { key: 'Employee', value: "employee" },
  ]

  productionChart: any;
  employeeChart: any;
  myChart: any;
  fromDate: string = "";
  toDate: string = "";
  today = new Date();
  unitDetails: any;

  constructor(
    private analyticsService: AnalyticsService,
  ) { }


  ngOnInit() {
    this.isMobileMenu();
    this.loadData();
  }

  isMobileMenu() {
    if ($(window).width() > 768) {
      this.ratio = 4 / 1.4;
    } else {
      this.ratio = 1;
    }
  }
  onClickChart(data) {
    this.chartType = 'bar';
    this.employeeChartEnable();
  }

  reset() {
    this.hideChart = false;
  }

  expenseChartEnable() {
    this.productionChart = new Chart("expenseChart", {
      type: this.chartType === "line" ? "line" : "bar", //this denotes tha type of chart

      data: {
        labels: this.data?.map((d) => (d.category? d.category : d.expenseByEmployeeId ? (this.employeeId? d.employeeName : d.employeeId) : d.category ? d.category : d.date ? d.date : d.employeeName)),
        datasets: [
          {
            label: "expense",
            data: this.data?.map((d) => (d.totalAmount)),
            backgroundColor: ["#03A9F5"],
            borderColor: "#03A9F5",
            borderWidth: 3,
            yAxisID: "y",
            hidden: !this.chartType,
            tension: 0.3
          },
          {
            label: "",
            data: this.data?.map((d) => (d.itemid ? d.itemid : d.brand)),
            backgroundColor: "transparent",
            borderColor: "transparent",
            hidden: true
            // yAxisID: "y",/
            // hidden : this.chartTypes,
            // type:'bar'
          },
        ],
      },
      options: {
        onClick: (event: any, elements, chart) => {
          const bars = chart.getElementsAtEventForMode(
            event,
            'nearest',
            { intersect: true },
            true
          );
          if (bars.length === 0) return;

          const bar = bars[0];

          const index = bar.index;
          let id = chart.data.datasets[1];
          this.onClickChart(id.data[index])
        },
        onHover(event: any, elements) {
          event.native.target.style.cursor = 'default';
        },
        responsive: true,
        aspectRatio: this.ratio,
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
            bottom: 10,
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: this.selectType != "duration" ? (this.brandId ? "EXPENSE" : "EXPENSE CATEGORY") : (this.selectType != "duration" ? (this.employeeId ? "EXPENSE CATEGORY" : "UNIT OF MEASURE") : this.duration.toUpperCase())
            },
          },
        },
      },
    });
  }

  employeeChartEnable() {

    this.employeeChart = new Chart("employeeChart", {
      type: 'bar',

      data: {
        labels: this.data?.map((d) => d.employeeName),
        datasets: [{
          label: 'Unit Of Measure',
          data: this.data.map((d) => d.totalAmount),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1
        }]
      }
    });
  }

  loadData() {
    if (this.selectType != "duration" && this.selectType != 'employee') {
      if (this.brandId) {
        this.analyticsService
          .expenseByCategory(this.brandId)
          .subscribe((response: any) => {
            if (response) {
              this.data = response.data ? response.data : [];
              this.chartType = 'bar';
              this.expenseChartEnable();
            }
          });
      } else if (!this.brandId) {
        this.analyticsService
        .expenseByCategory(this.brandId)
          .subscribe((response: any) => {
            if (response) {
              this.data = response.data ? response.data : [];
              this.brands = [];
              this.data.map((a) => {
                let brand = {
                  id: a.expenseCategoryId,
                  name: a.category
                }
                this.brands.push(brand)
              })
              this.chartType = 'line';
              this.expenseChartEnable();
            }
          });
      }
    }
    else if (this.duration === 'custom' && this.selectType !='employee') {
      this.analyticsService.durationExpense('daily').subscribe((response: any) => {
        if (response) {
          this.data = response.data ? response.data : [];
          this.chartType = 'bar';
          this.expenseChartEnable();
        }
      });
    } else if (this.selectType === 'employee') {
      this.employeeId = '';
      this.analyticsService.expenseByEmployeeId(this.employeeId).subscribe((response: any) => {
        if (response) {
          this.data = response.data ? response.data : [];
          this.unit = [];
          this.data.map((b) => {
            let units = {
              id: b.employeeId,
              name: b.employeeName
            }
            this.unit.push(units);
          })
          this.chartType = 'bar';
          this.expenseChartEnable();
        }
      });
    } else {
      this.analyticsService.durationExpense(this.duration).subscribe((response: any) => {
        if (response) {
          this.data = response.data ? response.data : [];
          this.chartType = 'bar';
          this.expenseChartEnable();
        }
      });
    }
  }
  dateFilter(){
    this.analyticsService.dateFilterExpense(this.fromDate ? this.convert(this.fromDate) : "",
    this.toDate ? this.convert(this.toDate) : "",).subscribe((response: any) => {
      if (response) {
        this.data = response.data ? response.data : [];
        this.productionChart.destroy();
        this.chartType = 'bar';
        this.expenseChartEnable();
      }
    });
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  onSelect(data) {
    this.brandId = '';
    if (data) {
      this.brandId = data.id
    }
    this.fromDate = "";
    this.toDate = "";
    this.productionChart.destroy();
    this.loadData();
  }

  onSelectUnit(data?) {
    this.employeeId = '';
    if (data) {
      this.employeeId = data.id;
    }
    this.analyticsService.expenseByEmployeeId(this.employeeId).subscribe((response: any) => {
      this.data = response.data ? response.data : [];
      this.productionChart.destroy();
      this.expenseChartEnable();
    })
  }
}
