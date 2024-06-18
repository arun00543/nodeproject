import { DatePipe } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { sort } from "app/core/models/sort";
import { ProductionService } from "app/core/service/Production/production.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MatTableExporterDirective, ExportType } from "mat-table-exporter";

@Component({
  selector: "app-manage-production-stock",
  templateUrl: "./manage-production-stock.component.html",
  styleUrls: ["./manage-production-stock.component.scss"],
})
export class ManageProductionStockComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter: MatTableExporterDirective;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  displayedColumns = [
    "itemMaster.brand.name",
    "itemMaster.itemName",
    "unitOfMeasure.unitName",
    "inStock",
  ];
  dataSource: any;
  data: any;
  searchTerm: string = "";
  sortEvent: sort = {
    active: "",
    direction: "DESC",
  };
  pageSize: number = 5;
  pageIndex: number = 0;

  constructor(
    private productionService: ProductionService,
    public datepipe: DatePipe
  ) {}

  refresh() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }

  currentDateTime = this.datepipe.transform(new Date(), "MM-dd-yyyy h-mm-ss");

  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_Production_Management_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Production Maintenance", 15, 25);

    autoTable(doc, {
      theme: "grid",
      styles: { halign: "center", fillColor: [78, 78, 229] },
      bodyStyles: { fillColor: [235, 235, 238] },
      margin: { top: 40 },
      body: data,
      columns: [
        { header: "Item Name", dataKey: "itemMaster" },
        { header: "Unit Of Measure", dataKey: "unitOfMeasure" },
        { header: "Stock", dataKey: "inStock" },
      ],
      didParseCell: function (data) {
        if (data.column.dataKey === "itemMaster") {
          var text = data.row.raw["itemMaster"].itemName;
          if (text && text.length > 0) {
            data.cell.text = text;
          }
        }
        if (data.column.dataKey === "unitOfMeasure") {
          var text = data.row.raw["unitOfMeasure"].unitName;
          if (text && text.length > 0) {
            data.cell.text = text;
          }
        }
      },
    });
    doc.save("KPR_Production_Management_" + this.currentDateTime);
  }

  sortData(event: Sort) {
    this.sortEvent = event;
    this.sort.disableClear = true;
    this.paginator.firstPage();
    this.loadData();
  }

  getPage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadData();
  }

  search(){
    this.paginator.firstPage();
    this.loadData();
  }

  public loadData() {
    this.productionService
      .getProductionStockList(
        this.pageIndex,
        this.pageSize,
        this.sortEvent.active,
        this.sortEvent.direction.toUpperCase(),
        this.searchTerm
      )
      .subscribe((response: any) => {
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
      });
  }
}
