import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DataSource, SelectionModel } from "@angular/cdk/collections";
import { HttpClient } from "@angular/common/http";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatDialog } from "@angular/material/dialog";
import {
  BehaviorSubject,
  fromEvent,
  map,
  merge,
  Observable,
  Subject,
} from "rxjs";
import { Router } from "@angular/router";
import { UnsubscribeOnDestroyAdapter } from "app/shared/UnsubscribeOnDestroyAdapter";
import { ExampleDataSource } from "app/shared/short&filterTable";
import { UserService } from "app/core/service/user.service";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component"; import { SharedService } from 'app/shared/shared.service';
import { BillingService } from 'app/core/service/billing/billing.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatTableExporterDirective, ExportType } from 'mat-table-exporter';
import { IndCurrencyFormat } from 'app/core/custom/pipe/currencyPipe';



@Component({
  selector: 'app-sales-order-status',
  templateUrl: './sales-order-status.component.html',
  styleUrls: ['./sales-order-status.component.scss']
})
export class SalesOrderStatusComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

 
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter: MatTableExporterDirective;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };
  public focus;
  displayedColumns = [
    // 'select',
    // "index",
    "itemMaster",
    "customer",
    "quantity",
    "unitPrice",
    "deliveryDate",
    "orderStatus"
 ];

  dataSource: any;
  selection = new SelectionModel<any>(true, []);
  rows = [];
  loading = false;
  hide = false;
  userDetails: any;
  newUserImg = "assets/images/user/user1.jpg";
  data = [];
  filteredData = [];
  editUser: UntypedFormGroup;
  register: UntypedFormGroup;
  selectedOption: string;
  id: number;
  role: any | null;
  isLoading = true;
  deleteItem = {
    id:0,
    key : ''
  };
pdfres:any
  currentDateTime: string;
  sortEvent: Sort;
  constructor(
    private fb: UntypedFormBuilder,
    public httpClient: HttpClient,
    public router: Router,
    public userService: UserService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private billingService:BillingService

  ) {
    super();
  }

  refresh() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }


  cancel(){
    this.hide = false
    this.deleteItem.id = 0;
    this.deleteItem.key ='';
  }

  applyFilter(data: Event, column: string) {
    let filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterColumn = column;
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.renderedData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.renderedData.forEach((row) =>
          this.selection.select(row)
        );
  }
  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.selection.selected.forEach((item) => {
      this.selection = new SelectionModel<any>(true, []);
    });
    this.loadData();
    this.refreshTable();
  }
  
  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_SalesOrder_Details_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Sales Order Details", 15, 25);

    autoTable(doc,
      {
        theme: "grid",
        styles: { halign: "center", fillColor: [78, 78, 229] },
        bodyStyles: { fillColor: [235, 235, 238] },
        margin: { top: 40 },
        body: data,
        columns: [
          { header: "Item Master", dataKey: "itemMaster" },
          { header: "Customer", dataKey: "customer" },
          { header: "Quantity", dataKey: "quantity" },
          { header: "Unit Price", dataKey: "unitPrice" },
          { header: "Delivery Date", dataKey: "deliveryDate" },
          { header: "Order Status ", dataKey: "orderStatus" },

          

        ],
        didParseCell: function (data) {
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
      });
    doc.save("KPR_SalesOrder_Details_" + this.currentDateTime);
  }

  sortData(event: Sort) {
    this.sortEvent = event;
    this.sort.disableClear = true;
    this.paginator.firstPage();
this.loadData();
  } 

  public loadData() {
    this.loading = true;
    this.hide = false

    this.billingService.getSalesOrderStatus().subscribe((response) => {
      if (response.status === "OK") {
        this.data = response.data;
      //  this.pdfres = response.data[0].salesId;
        this.dataSource = new ExampleDataSource(
          this.data,
          this.paginator,
          this.sort
        );
      }
    });

    this.subs.sink = fromEvent(this.filter.nativeElement, "keyup").subscribe(
      () => {
        this.loading = false;

        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      }
    );
  }

  onContextMenu(event: MouseEvent, item: any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + "px";
    this.contextMenuPosition.y = event.clientY + "px";
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem("mouse");
    this.contextMenu.openMenu();
  }
}

