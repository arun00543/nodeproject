import { DatePipe, Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { IndCurrencyFormat } from 'app/core/custom/pipe/currencyPipe';
import { sort } from 'app/core/models/sort';
import { AuthService } from 'app/core/service/auth.service';
import { BillingService } from 'app/core/service/billing/billing.service';
import { UserService } from 'app/core/service/user.service';
import { SharedService } from 'app/shared/shared.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatTableExporterDirective, ExportType } from 'mat-table-exporter';

@Component({
  selector: 'app-wallet-history',
  templateUrl: './wallet-history.component.html',
  styleUrls: ['./wallet-history.component.scss']
})
export class WalletHistoryComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter: MatTableExporterDirective;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  displayedColumns = [
    'paymentDate',
    'paymentTime',
    'amount',
    'notes',
    'transactionType'
  ];
  dataSource: any = [];
  data: any;
  searchTerm: string = "";
  sortEvent: sort = {
    active: "",
    direction: "DESC",
  };
  pageSize: number = 5;
  pageIndex: number = 0;
  selectType: string = "date";
  walletType: any[] = [
    { key: "Date", value: "date" },
    { key: "Amount", value: "amount" }
  ]
  id: number;
  userRole: string;
  fromDate: string = "";
  toDate: string = "";

  constructor(
    public router: Router,
    private userService: UserService,
    private authService: AuthService,
    private shared: SharedService,
    public dialog: MatDialog,
    public location : Location,
    public datepipe: DatePipe
  ) {
    this.userRole = authService.currentUserValue.role;
    if (this.userRole === 'CUSTOMER') {
      this.id = authService.currentUserValue.userId
    } else {
      this.id = shared.toEdit;
    }
  }

  refresh() {
    this.searchTerm = '';
    this.fromDate='';
    this.toDate='';
    this.loadData();
  }
back(){
  this.location.back();
}
  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.shared.toEdit = null;
  }
  currentDateTime = this.datepipe.transform(
    new Date(),
    "MM-dd-yyyy h-mm-ss"
  );

  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_Customer_Wallet_History" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Customer Wallet History", 15, 25);

    autoTable(doc,
      {
        theme: "grid",
        styles: { halign: "center", fillColor: [78, 78, 229] },
        bodyStyles: { fillColor: [235, 235, 238] },
        margin: { top: 40 },
        body: data,
        columns: [
          { header: "Payment Date", dataKey: "updatedAt" },
          { header: "Amount", dataKey: "amount" },
          { header: "Transaction Type", dataKey: "transactionType" },
          { header: "Note", dataKey: "notes" },

        ],
        didParseCell: function (data) {
          if (data.column.dataKey === 'updatedAt') {
            var text = data.row.raw["updatedAt"];
           if(text != "Payment Date"){
            var date = new Date(text),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2),
            hrs = ("0" + date.getHours()).slice(-2),
            min = ("0" + date.getMinutes()).slice(-2),
            sec = ("0" + date.getSeconds()).slice(-2);
            let period = (date.getHours()>= 12 ? "PM" : "AM")
            let a = [[day, mnth, date.getFullYear()].join("-")+", " + [hrs, min, sec].join(":") + period];
            if (text && text.length > 0) {
              data.cell.text = a;
            }
           }
          }
          if (data.column.dataKey === 'amount') {
            var text;
            if("Amount" != data.row.raw["amount"]) {
             text = new IndCurrencyFormat().transform(data.row.raw["amount"]).replace('₹','Rs.');
            } else {
              text = data.row.raw["amount"]
            }
            if (text && text.length > 0) {
              data.cell.text = text;
            }            
          }
        }
      }
    );
    doc.save("KPR_Customer_Wallet_History" + this.currentDateTime);
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
  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  public loadData() {
    this.userService.getCustomerWalletHistoryList(
      this.userRole,
      this.id,
      this.pageIndex,
      this.pageSize,
      this.sortEvent.active,
      this.sortEvent.direction.toUpperCase(),
      (this.searchTerm ? this.searchTerm : ''),
      (this.fromDate ? this.convert(this.fromDate) : ""),
      (this.toDate ? this.convert(this.toDate) : "")
    )
      .subscribe((response: any) => {
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
      });
  }
}
