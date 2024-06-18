import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { UserService } from 'app/core/service/user.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { sort } from 'app/core/models/sort';
import { NgxSpinnerService } from 'ngx-spinner';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DatePipe } from "@angular/common";
import { ExportType, MatTableExporterDirective } from "mat-table-exporter";
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'app/additional-components/confirmation-dialog/confirmation-dialog.component';



@Component({
  selector: 'app-manage-employee',
  templateUrl: './manage-employee.component.html',
  styleUrls: ['./manage-employee.component.scss']
})
export class ManageEmployeeComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter: MatTableExporterDirective;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  public focus;
  displayedColumns = [
    'id',
    // "index",
    'name',
    'phoneNumber',
    // 'email',
    'city',
    // 'dateOfBirth',
    // 'dateOfJoining',
    'employeeDepartment',
    'actions',
  ];
  dataSource: any;
  loading = false;
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
  currentDateTime = this.datepipe.transform(
    new Date(),
    "MM-dd-yyyy h-mm-ss"
  );

  constructor(
    public router: Router,
    private userService: UserService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    public dialog:MatDialog,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
 
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
    this.router.navigate([`/employee/edit-employee`]);
  }
  importExport() {
    this.shared.importExportClass = "Employee";
    this.router.navigate([`/administrative/employee/excel-import-export`]);
  }

  deleteCall(row: any) {
    let name = row.name
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
    
    this.userService.deleteEmployee(id).subscribe((res: any) => {
      this.loadData();
      if (res.status === "NO_CONTENT") {
        let message;
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
        let message;
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

  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_EmployeeDetails_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Employee Details", 15, 25);
    
    autoTable(doc, 
      {
      theme: "grid",
      styles: { halign: "center", fillColor: [78, 78, 229] },
      bodyStyles: { fillColor: [235, 235, 238] },
      margin: { top: 40 },
      body: data,
      columns: [
        // { header: "Employee Id", dataKey: "id" },
        { header: "Name", dataKey: "name" },
        { header: "Phone Number", dataKey: "phoneNumber" },
        { header: "Email", dataKey: "email" },
        { header: "Address", dataKey: "city" },
        // { header: "Date Of Birth", dataKey: "dateOfBirth" },
        // { header: "Date Of Joining", dataKey: "dateOfJoining" },
        { header: "Employee Department", dataKey: "employeeDepartment"},
      ],
      didParseCell: function(data) {
        if (data.column.dataKey === 'employeeDepartment') {
          var text = data.row.raw["employeeDepartment"].departmentName;
            if (text && text.length > 0) {
              data.cell.text = text;
            }
        }
        if (data.column.dataKey === 'city') {
          var text = "";
          if (data.row.raw["addressLine1"]) {
            text += data.row.raw["addressLine1"] + ", ";
          }
          if (data.row.raw["addressLine2"]) {
            text += data.row.raw["addressLine2"] + ", ";
          }
          if (data.row.raw["city"] && data.row.raw["city"].name) {
            text += data.row.raw["city"].name + ", ";
          }
          if (data.row.raw["city"] && data.row.raw["city"].state && data.row.raw["city"].state.name) {
            text += data.row.raw["city"].state.name + ", ";
          }
          if (data.row.raw["pincode"]) {
            text += data.row.raw["pincode"];
          }
          if (text && text.length > 0) {
            data.cell.text = text;
          }
        }
          
    }
    }
    );
    doc.save("KPR_EmployeeDetails_" + this.currentDateTime);
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
    this.loading = true;
    this.userService.getEmployeeList(
      this.pageIndex,
      this.pageSize,
      this.sortEvent.active,
      this.sortEvent.direction.toUpperCase(),
      this.searchTerm
    )
      .subscribe((response: any) => {
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
      });
    
  }

}
