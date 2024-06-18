import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { sort } from 'app/core/models/sort';
import { UserService } from 'app/core/service/user.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatTableExporterDirective, ExportType } from 'mat-table-exporter';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'app/additional-components/confirmation-dialog/confirmation-dialog.component';
import { IndCurrencyFormat } from 'app/core/custom/pipe/currencyPipe';

@Component({
  selector: 'app-manage-contract',
  templateUrl: './manage-contract.component.html',
  styleUrls: ['./manage-contract.component.scss']
})
export class ManageContractComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter: MatTableExporterDirective;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  displayedColumns1 = [
    "contractName",
    "contractor.name",
    "contractAmount",
    "actions",
  ];
  displayedColumns2 = [
    "contractName",
    "contractor.name",
    "contractAmount",
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
  deleteItem = {
    id: 0,
    key: ''
  };
  getStatus = "ONGOING";
  status: any[] = [
    { key: "Upcoming", value: "UPCOMING" },
    { key: "Ongoing", value: "ONGOING" },
    { key: "Pending", value: "PARTIALY_CLOSED" },
    { key: "Closed", value: "CLOSED" },
  ];


  constructor(
    public router: Router,
    public userService: UserService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    public datepipe:DatePipe,
    public dialog : MatDialog
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
    this.router.navigate([`/employee/edit-contract`]);
  }

  deleteCall(row: any) {
    let name = row.contractName
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

  cancel() {
    this.deleteItem.id = 0;
    this.deleteItem.key = '';
  }

  deleteRow(id) {
    this.userService.deleteContract(id).subscribe((res: any) => {
      this.loadData();
        let message;
        if (res.status === "NO_CONTENT") {
        this.notification.showNotification(
          'top',
          'right',
          message = {
            "message": res.message,
            "status": "danger"
          },
        );
      }
      else {
        this.notification.showNotification(
          'top',
          'right',
          message = {
            "message": res.message,
            "status": "warning"
          });
      }
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
          { header: "Name", dataKey: "contractName" },
          { header: "Contractor", dataKey: "contractor" },
          { header: "Contractor Amount", dataKey: "contractAmount" },
        ],
        didParseCell: function (data) {
          if (data.column.dataKey === 'contractor') {
            var text = data.row.raw["contractor"].name;
            if (text && text.length > 0) {
              data.cell.text = text;
            }
          }
          if (data.column.dataKey === 'contractAmount') {
            var text;
            if("Contractor Amount" != data.row.raw["contractAmount"]) {
             text = new IndCurrencyFormat().transform(data.row.raw["contractAmount"]).replace('₹','Rs.');
            } else {
              text = data.row.raw["contractAmount"]
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
    this.userService
      .getContractList(
        this.pageIndex,
        this.pageSize,
        this.sortEvent.active,
        this.sortEvent.direction.toUpperCase(),
        this.getStatus,
        this.searchTerm
      )
      .subscribe((response: any) => {
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
      });
  }

}

