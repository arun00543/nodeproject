import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ConfirmationDialogComponent } from 'app/additional-components/confirmation-dialog/confirmation-dialog.component';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { sort } from 'app/core/models/sort';
import { AuthService } from 'app/core/service/auth.service';
import { BillingService } from 'app/core/service/billing/billing.service';
import { UserService } from 'app/core/service/user.service';
import { SharedService } from 'app/shared/shared.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatTableExporterDirective, ExportType } from 'mat-table-exporter';

@Component({
  selector: 'app-employee-monthly-pay',
  templateUrl: './employee-monthly-pay.component.html',
  styleUrls: ['./employee-monthly-pay.component.scss']
})
export class EmployeeMonthlyPayComponent implements OnInit {

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
  byteCharacters:any;
  downloadLink:any;
  currentDateTime: string;
  userId:any;
  currentUser:any;

  constructor(private billingService: BillingService,
    private userService:UserService,
    private authService:AuthService,
    private notification:NotificationsComponent,
    private shared: SharedService,
    public dialog :MatDialog,
    private router: Router) {
      this.userId = authService.currentUserValue.userId;
    this.currentUser = authService.currentUserValue;

    }

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

  
  downloadCall(row: any) {
    this.billingService.downloadEmployeePay(row.id)
      .subscribe((response) => {
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(
          new Blob([response.body], { type: response.body.type })
        );
        downloadLink.download = row.employee.name + ".pdf";
        downloadLink.click();
      });
  }

  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_Employee_Pay" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Employee Pay", 15, 25);

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
        }
      }
    );
    doc.save("KPR_Employee_Pay" + this.currentDateTime);
  }
  
  cancel(){
    this.deleteItem.id = 0;
    this.deleteItem.key ='';
  }

  public loadData() {
    this.billingService
      .getEmployeeMonthlyPay(
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
