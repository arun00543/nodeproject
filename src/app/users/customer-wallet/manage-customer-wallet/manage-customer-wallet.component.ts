import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { IndCurrencyFormat } from 'app/core/custom/pipe/currencyPipe';
import { sort } from 'app/core/models/sort';
import { UserService } from 'app/core/service/user.service';
import { SharedService } from 'app/shared/shared.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatTableExporterDirective, ExportType } from 'mat-table-exporter';

@Component({
  selector: 'app-manage-customer-wallet',
  templateUrl: './manage-customer-wallet.component.html',
  styleUrls: ['./manage-customer-wallet.component.scss']
})
export class ManageCustomerWalletComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter: MatTableExporterDirective;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  displayedColumns = [
    'customer.name',
    'customer.phoneNumber',
    'balance',
    'actions'
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
    public router: Router,
    private userService: UserService,
    private shared: SharedService,
    public datepipe: DatePipe
  ) { }

  refresh() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }


  editCall(row) {
    this.shared.toEdit = row.id;
    this.router.navigate([`/user/edit-customer-wallet`]);
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
      return [date.getFullYear(), mnth, day].join("-");
  }

  viewHistoryCall(row?) {
    this.shared.toEdit = row.id;
    this.router.navigate([`/billing/wallet-history`]);
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
    doc.text("KPR Customer Wallet Details", 15, 25);

    autoTable(doc,
      {
        theme: "grid",
        styles: { halign: "center", fillColor: [78, 78, 229] },
        bodyStyles: { fillColor: [235, 235, 238] },
        margin: { top: 40 },
        body: data,
        columns: [
          { header: "Cutomer", dataKey: "customer" },
          { header: "Balance", dataKey: "balance" },

        ],
        didParseCell: function (data) {
          if (data.column.dataKey === 'customer') {
            var text = data.row.raw["customer"].name;
            if (text && text.length > 0) {
              data.cell.text = text;
            }
          }
          if (data.column.dataKey === 'balance') {
            var text;
            if("Balance" != data.row.raw["balance"]) {
             text = new IndCurrencyFormat().transform(data.row.raw["balance"]).replace('₹','Rs.');
            } else {
              text = data.row.raw["balance"]
            }
            if (text && text.length > 0) {
              data.cell.text = text;
            }            
          }
        }
      }
    );
    doc.save("KPR_Customer_Wallet_Details" + this.currentDateTime);
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
    this.userService.getCustomerWalletList(
      this.pageIndex,
      this.pageSize,
      this.sortEvent.active,
      this.sortEvent.direction.toUpperCase(),
      this.searchTerm)
      .subscribe((response: any) => {
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
      });
  }
}
