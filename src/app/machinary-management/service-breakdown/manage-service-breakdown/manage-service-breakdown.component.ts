import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { MachineryService } from 'app/core/service/machinery/machinery.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { sort } from 'app/core/models/sort';

@Component({
  selector: 'app-manage-service-breakdown',
  templateUrl: './manage-service-breakdown.component.html',
  styleUrls: ['./manage-service-breakdown.component.scss']
})
export class ManageServiceBreakdownComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  public focus;
  displayedColumns = [
    // 'select',
    // "index",
    'name',
    'description',
    'serialNumber',
    'manufacturer',
    'modelNumber',
    'yearPurchased',
    'purchaseCost',
    'actions',
  ];
  dataSource: any;
  hide = false;
  data: any;
  searchTerm: string = "";
  sortEvent: sort = {
    active: "",
    direction: "DESC",
  };
  pageSize: number = 5;
  pageIndex: number = 0;
  deleteItem = {
    id: 0,
    key: ''
  };

  constructor(
    public router: Router,
    private machineryService: MachineryService,
    private notification: NotificationsComponent,
    private shared: SharedService,

  ) { }

  refresh() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }


    editCall(row) {
  this.shared.toEdit = row.id;
    this.router.navigate([`/machinery/edit-machinery`]);
  }

  deleteCall(row: any) {
    this.deleteItem.id = row.id;
    this.deleteItem.key = row.name;
    this.hide = true
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }

  cancel() {
    this.hide = false
    this.deleteItem.id = 0;
    this.deleteItem.key = '';
  }

  deleteRow() {
    this.machineryService.deleteMachinery(this.deleteItem.id).subscribe((res) => {

      this.loadData();
      if (res.status === "OK") {
        let message;
        this.notification.showNotification(
          'top',
          'center',
          message = {
            "message": res.message,
            "status": "success"
          },
        );
      }
      else {
        let message;
        this.notification.showNotification(
          'top',
          'center',
          message = {
            "message": res.message,
            "status": "danger"
          },
        );
      }
    })
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
    this.hide = false;
    this.machineryService.getMachineryList(
      this.pageIndex,
      this.pageSize,
      this.sortEvent.active,
      this.sortEvent.direction.toUpperCase(),
      this.searchTerm
    )
      .subscribe((response: any) => {
        ;
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
      });
  }
}

