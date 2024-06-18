import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'app/core/service/analytics/analytics.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-production-chart',
  templateUrl: './production-chart.component.html',
  styleUrls: ['./production-chart.component.scss']
})
export class ProductionChartComponent implements OnInit {
  ratio: any = 4 / 1.4;
  data: any;
  dataSource: any[];
  hideChart = false;
  brands: Array<any> = [];
  allItem: Array<any> = [];
  unit: Array<any> = [];
  brandId = '';
  itemId = '';
  unitId = ''; protected
  chartType: string = '';
  duration = 'daily'
  durations = [
    { key: 'Daily', value: "daily" },
    { key: 'Week', value: "weekly" },
    { key: 'Month', value: "monthly" },
    { key: 'Custom', value: "custom" },

  ];
  selectType = 'items'
  selectedType: any[] = [
    { key: 'Items', value: "items" },
    { key: 'Duration', value: "duration" },
    { key: 'Units', value: "units" },
  ]

  productionChart: any;
  unitChart: any;
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
    this.unitChartEnable();
  }

  reset() {
    this.hideChart = false;
  }

  productionChartEnable() {
    this.productionChart = new Chart("productionChart", {
      type: this.chartType === "line" ? "line" : "bar", //this denotes tha type of chart

      data: {
        labels: this.data?.map((d) => (d.item ? d.item : d.uom ? (this.unitId ? d.brandname : d.uom) : d.brandname ? d.brandname : d.date ? d.date : d.brandName)),
        datasets: [
          {
            label: "Production",
            data: this.data?.map((d) => (d.quantity)),
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
              text: this.selectType != "duration" ? (this.brandId ? "ITEMS" : "BRAND") : (this.selectType != "duration" ? (this.unitId ? "BRAND" : "UNIT OF MEASURE") : this.duration.toUpperCase())
            },
          },
        },
      },
    });
  }

  unitChartEnable() {

    this.unitChart = new Chart("unitChart", {
      type: 'bar',

      data: {
        labels: this.data?.map((d) => d.uom),
        datasets: [{
          label: 'Unit Of Measure',
          data: this.data.map((d) => d.quantity),
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
    if (this.selectType != "duration" && this.selectType != 'units') {
      if (this.brandId) {
        this.analyticsService
          .itemsByBrandCount(this.brandId)
          .subscribe((response: any) => {
            if (response) {
              this.data = response.data ? response.data : [];
              this.chartType = 'bar';
              this.productionChartEnable();
            }
          });
      } else if (!this.brandId) {
        this.analyticsService
          .brandCount()
          .subscribe((response: any) => {
            if (response) {
              this.data = response.data ? response.data : [];
              this.brands = [];
              this.data.map((a) => {
                let brand = {
                  id: a.brand,
                  name: a.brandname
                }
                this.brands.push(brand)
              })
              this.chartType = 'line';
              this.productionChartEnable();
            }
          });
      }
    }
    else if (this.duration === 'custom' && this.selectType !='units') {
      this.analyticsService.durationProduction('daily').subscribe((response: any) => {
        if (response) {
          this.data = response.data ? response.data : [];
          this.chartType = 'bar';
          this.productionChartEnable();
        }
      });
    } else if (this.selectType === 'units') {
      this.unitId = '';
      this.analyticsService.uomById(this.unitId).subscribe((response: any) => {
        if (response) {
          this.data = response.data ? response.data : [];
          this.unit = [];
          this.data.map((b) => {
            let units = {
              id: b.uomid,
              name: b.uom
            }
            this.unit.push(units);
          })
          this.chartType = 'bar';
          this.productionChartEnable();
        }
      });
    } else {
      this.analyticsService.durationProduction(this.duration).subscribe((response: any) => {
        if (response) {
          this.data = response.data ? response.data : [];
          this.chartType = 'bar';
          this.productionChartEnable();
        }
      });
    }
  }
  dateFilter(){
    this.analyticsService.dateFilterProduction(this.fromDate ? this.convert(this.fromDate) : "",
    this.toDate ? this.convert(this.toDate) : "",).subscribe((response: any) => {
      if (response) {
        this.data = response.data ? response.data : [];
        this.productionChart.destroy();
        this.chartType = 'bar';
        this.productionChartEnable();
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
    this.unitId = '';
    if (data) {
      this.unitId = data.id;
    }
    this.analyticsService.uomById(this.unitId).subscribe((response: any) => {
      this.data = response.data ? response.data : [];
      this.productionChart.destroy();
      this.productionChartEnable();
    })
  }
}
