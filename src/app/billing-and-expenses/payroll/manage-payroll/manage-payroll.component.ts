import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatMenuTrigger } from "@angular/material/menu";
import { sort } from "app/core/models/sort";
import { BillingService } from "app/core/service/billing/billing.service";
import { Router } from "@angular/router";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component"; import { SharedService } from 'app/shared/shared.service';
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { ExportType, MatTableExporterDirective } from "mat-table-exporter";
import { ConfirmationDialogComponent } from "app/additional-components/confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { IndCurrencyFormat } from "app/core/custom/pipe/currencyPipe";

@Component({
  selector: "app-manage-payroll",
  templateUrl: "./manage-payroll.component.html",
  styleUrls: ["./manage-payroll.component.scss"],
})
export class ManagePayrollComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter: MatTableExporterDirective;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };
  displayedColumns = [
    // 'select',
    // "index",
    "employee.name",
    "netPay",
    "Department",
    "actions",
  ];
  dataSource: any;
  data: any;
  searchTerm: string = "";
  fromDate: string = "";
  toDate: string = "";
  sortEvent: sort = {
    active: "",
    direction: "DESC",
  };
  pageSize: number = 5;
  pageIndex: number = 0;
  itemList: any;
  deleteItem = {
    id:0,
    key : ''
  };
  currentDateTime: string;

  constructor(private billingService: BillingService,
    private notification:NotificationsComponent,
    private shared: SharedService,
    public dialog :MatDialog,
    private router: Router) {}

  refresh() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
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

    editCall(row) {
  this.shared.toEdit = row.id;
    this.router.navigate([`/billing/edit-payroll`])
  }
  
  deleteCall(row: any) {
    let name = row.employee.name
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message : "Delete",
        id: name
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteRow(row.id);
      } 
    });
  }

  deleteRow(id){
    this.billingService.deletePayroll(id).subscribe((res)=>{
      
      this.loadData();
     // if(res.status === "OK"){
      let message;
      this.notification.showNotification(
       'top',
         'right',
          message={
          "message": res.message,
          "status": "danger"
         },
         );
    })
  }

  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_PayRoll_History_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR PayRoll History", 15, 25);

    autoTable(doc,
      {
        theme: "grid",
        styles: { halign: "center", fillColor: [78, 78, 229] },
        bodyStyles: { fillColor: [235, 235, 238] },
        margin: { top: 40 },
        body: data,
        columns: [
          { header: "Employee Name", dataKey: "employee" },
          { header: "Net Pay", dataKey: "netPay" },
          { header: "Department", dataKey: "departmentName" },
         
        ],
        didParseCell: function (data) {
          if (data.column.dataKey === 'employee') {
            var text = data.row.raw["employee"].name;
            if (text && text.length > 0) {
              data.cell.text = text;
            }
          }
          if (data.column.dataKey === 'netPay') {
            var text;
            if("Net Pay" != data.row.raw["netPay"]) {
             text = new IndCurrencyFormat().transform(data.row.raw["netPay"]).replace('₹','Rs.');
            } else {
              text = data.row.raw["netPay"]
            }
            if (text && text.length > 0) {
              data.cell.text = text;
            }            
          }
        }
      }
    );
    doc.save("KPR_PayRoll_History_" + this.currentDateTime);
  }
  
  cancel(){
    this.deleteItem.id = 0;
    this.deleteItem.key ='';
  }

  public loadData() {
    this.billingService
      .getEmployeePayList(
        this.pageIndex,
        this.pageSize,
        this.sortEvent.direction.toUpperCase(),
        this.sortEvent.active,
        this.searchTerm
      )
      .subscribe((response: any) => {
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
      });
  }
}
