
import { Component, OnInit, ViewChild } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { BillingService } from 'app/core/service/billing/billing.service';
import { sort } from "app/core/models/sort";
import { SharedService } from "app/shared/shared.service";
@Component({
  selector: 'app-manage-payment',
  templateUrl: './manage-payment.component.html',
  styleUrls: ['./manage-payment.component.scss']
})
export class ManagePaymentComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns = [
    "customerId.name",
    "salesId",
    "paymentAmount",
    "paymentStatus",
    "paidAmount",
    "balanceAmount",
  ];

  dataSource: any;
  data: any;
  searchTerm: string = '';
  searchField: string = "customer";
  sortEvent: sort = {
    active: "",
    direction: "DESC",
  };
  pageSize: number = 5;
  pageIndex: number = 0;
  searchType = [
    { key: "Customer", value: "customer" },
    { key: "Sale Id", value: "saleId" },
  ]
  deleteItem = {
    id: 0,
    key: ''
  };

  constructor(
    public router: Router,
    public billingService: BillingService,
    public shared: SharedService,
  ) {}

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

  loadData(){
    if(this.searchField === 'saleId'){
      this.filterSales();
    } else{
      this.filterCustomer();
    }
  }


  filterSales() {
    this.billingService.getPaymentBySalesId(
        this.pageIndex,
        this.pageSize,
        this.sortEvent.direction.toUpperCase(), 
        this.sortEvent.active,
        this.searchTerm).
        subscribe((response) => {
      if (response.status === "OK") {
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
        } else {
          this.dataSource = []
        }
        });
    }
  
    filterCustomer() {
      this.billingService.getPayment(
        this.pageIndex,
        this.pageSize,
        this.sortEvent.active,
        this.sortEvent.direction.toUpperCase(),
      this.searchTerm
        ).subscribe((response) => {
        if (response.status === "OK") {
          this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
        } else {
          this.dataSource = []
        }
      });
    }

  editCall(data) {
    this.shared.toEdit = data.id;
    this.router.navigate([`/billing/edit-payment`]);
  }

}
