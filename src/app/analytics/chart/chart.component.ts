import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { AnalyticsService } from "app/core/service/analytics/analytics.service";
import { LabelClickEventArgs, MarkerType } from "igniteui-angular-charts";
import { IgxShapeDataSource } from "igniteui-angular-core";
import { IgxGeographicMapComponent } from "igniteui-angular-maps";
import { IgxGeographicPolylineSeriesComponent } from "igniteui-angular-maps";
import { IgxGeographicShapeSeriesComponent } from "igniteui-angular-maps";
import { IgxGeographicSymbolSeriesComponent } from "igniteui-angular-maps";

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.scss"],
})
export class ChartComponent implements AfterViewInit {
  states: Array<any> = [];
  stateId: any;
  stateData = [];
  cityData = [];
  data = [];
  dataSourse:any;

  ngOnInit() {

      this.analyticsService.getAllState().subscribe((response: any) => {
        this.stateData = response.data;
        this.states = [];
        this.stateData.map((a) => {
          let state = {
            id: a.id,
            name: a.statename,
          };
          this.states.push(state);
        });
      });

      this.analyticsService.getMapLocation()
      .subscribe((response: any) => {
        if (response) {
          this.data = response.data;
          this.addSymbolSeriesWith(this.data);
        }
      });
  }

  @ViewChild("map", { static: true })
  public map: IgxGeographicMapComponent;

  @ViewChild("template", { static: true })
  public tooltip: TemplateRef<object>;
  allState = [];
  customer: any;
  showLocation: any;

  constructor(public analyticsService: AnalyticsService) {}

  onSelect(data) {
    this.stateId = data.id
    if(data){
    this.analyticsService
        .getAllCities(this.stateId)
        .subscribe((response: any) => {
          if (response) {
            this.cityData = response.data;
          }
        });
      }
  }

  public ngAfterViewInit(): void {
    this.map.windowRect = { left: 0.66, top: 0.40, width: 0.09, height: 0.09 };
    // this.addSymbolSeriesWith(this.data);
  }

  public addSymbolSeriesWith(data: any[]) {
    const symbolSeries = new IgxGeographicSymbolSeriesComponent();
    symbolSeries.dataSource = data;
    symbolSeries.markerType = MarkerType.Pentagon;
    symbolSeries.markerThickness = 5;
    symbolSeries.latitudeMemberPath = "lati";
    symbolSeries.longitudeMemberPath = "longi";
    symbolSeries.markerBrush = "red";
    symbolSeries.markerOutline = "brush";
    symbolSeries.tooltipTemplate = this.tooltip;
    this.map.series.add(symbolSeries);
  }
}
