import { SelectionModel } from "@angular/cdk/collections";
import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { sort } from "app/core/models/sort";
import { UserService } from "app/core/service/user.service";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component";
import { SharedService } from "app/shared/shared.service";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { MatTableExporterDirective, ExportType } from "mat-table-exporter";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationDialogComponent } from "app/additional-components/confirmation-dialog/confirmation-dialog.component";
import { IndCurrencyFormat } from "app/core/custom/pipe/currencyPipe";


@Component({
  selector: 'app-manage-contractor-payment',
  templateUrl: './manage-contractor-payment.component.html',
  styleUrls: ['./manage-contractor-payment.component.scss']
})
export class ManageContractorPaymentComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter: MatTableExporterDirective;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  displayedColumns = [
    'contractDetails.contractName',
    'paymentDate',
    'totalAmount',
    'amountPaid',
    'amountBalance',
    'actions'
  ];
  dataSource: any;
  data :any=[];
searchTerm: string = "";
sortEvent: sort = {
  active: "",
  direction: "DESC",
};
pageSize: number = 5;
pageIndex: number = 0;
getStatus = "ONGOING";
status: any[] = [
  { key: "Upcoming", value: "UPCOMING" },
  { key: "Ongoing", value: "ONGOING" },
  { key: "Pending", value: "PARTIALY_CLOSED" },
];
contractName = '';
hidePayHistory = false
paymentList = []

  constructor(
    public httpClient: HttpClient,
    public router: Router,
    public dialog: MatDialog,
    private userService: UserService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    public datepipe:DatePipe
  ) {
  }

  refresh() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }

    editCall(row) {
  this.shared.toEdit = row.id;
    this.router.navigate([`/employee/edit-contractor-payment`]);
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

  sortData(event: Sort) {
    this.sortEvent = event;
    this.sort.disableClear = true;
    this.paginator.firstPage();
this.loadData();
  }

  viewHistory(row) {
    this.contractName = row.contractDetails.contractName;
    this.userService.getContractorPaymentHistory(row.id).subscribe((res: any) => {
        this.paymentList = res.data;
      this.hidePayHistory = true;
    })
  }

  currentDateTime = this.datepipe.transform(
    new Date(),
    "MM-dd-yyyy h-mm-ss"
  );

  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_Contractor_Details_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Contractor Details", 15, 25);

    autoTable(doc,
      {
        theme: "grid",
        styles: { halign: "center", fillColor: [78, 78, 229] },
        bodyStyles: { fillColor: [235, 235, 238] },
        margin: { top: 40 },
        body: data,
        columns: [
          { header: "Contract", dataKey: "contractDetails" },
          { header: "Payment Date", dataKey: "paymentDate" },
          { header: "Amount Paid", dataKey: "amountPaid" },
          { header: "Amount Balance", dataKey: "amountBalance" },
          { header: "Payment Basis", dataKey: "paymentBasis" },
        ],
        didParseCell: function (data) {
          if (data.column.dataKey === 'contractDetails') {
            var text = data.row.raw["contractDetails"].contractName;
            if (text && text.length > 0) {
              data.cell.text = text;
            }
          }
          if (data.column.dataKey === 'amountPaid') {
            var text;
            if("Amount Paid" != data.row.raw["amountPaid"]) {
             text = new IndCurrencyFormat().transform(data.row.raw["amountPaid"]).replace('₹','Rs.');
            } else {
              text = data.row.raw["amountPaid"]
            }
            if (text && text.length > 0) {
              data.cell.text = text;
            }            
          }
          if (data.column.dataKey === 'amountBalance') {
            var text;
            if("Amount Balance" != data.row.raw["amountBalance"]) {
             text = new IndCurrencyFormat().transform(data.row.raw["amountBalance"]).replace('₹','Rs.');
            } else {
              text = data.row.raw["amountBalance"]
            }
            if (text && text.length > 0) {
              data.cell.text = text;
            }            
          }
        }
      }
    );
    doc.save("KPR_Contractor_Details_" + this.currentDateTime);
  }

 
  public loadData() {
  this.userService.getContractorPaymentList(
    this.pageIndex,
    this.pageSize,
    this.sortEvent.active,
    this.sortEvent.direction.toUpperCase(),
    this.getStatus,
    this.searchTerm
  ).subscribe((response:any)=>{
    this.data = response.data;
    this.dataSource = this.data.content
  })
  }
}

