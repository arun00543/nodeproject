import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { sort } from 'app/core/models/sort';
import { BillingService } from 'app/core/service/billing/billing.service';
import { OrdersService } from 'app/core/service/orders/orders.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-customer-salesorder',
  templateUrl: './customer-salesorder.component.html',
  styleUrls: ['./customer-salesorder.component.scss']
})
export class CustomerSalesorderComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };
  displayedColumns = [
    // 'select',
    // "index",
    "salesId",
    "customerName",
    "paymentStatus",
    //"actions",
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
  total = null;
  hide = false;
  customerName: string;
  saleId: number;
  userId: number;

  constructor(
    private orderService : OrdersService,
    private billingService: BillingService,
    private spinner: NgxSpinnerService,
  ) {}

  refresh() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }

  viewCall(row) { 
    this.saleId = row.salesId
    this.orderService.getOrderBySalesId(this.saleId).subscribe((res) => {
      this.itemList = res.data
    this.totalPrice();
    });
    this.hide = true;
    this.customerName = row.customerId.name
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
  }

  totalPrice() {
    this.total = 0;
    for (let data of this.itemList) {
      this.total += data.itemMaster.fixedPrice * (data.quantity * data.orderQuantity);
    }
  }

  downloadInvoice(id:any){
    this.billingService.getPDF(id)
    .subscribe((response) => {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(new Blob([response.body], { type: response.body.type }));
        downloadLink.download = "KPR_SALES_INVOICE_"+id;
        downloadLink.click();
        // downloadLink.remove();
    });
    
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
    
    this.saleId = null
    this.billingService
      .getPaymentUserId(this.userId).subscribe((response: any) => {
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
      });
      
  }
}

