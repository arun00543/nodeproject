import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UnsubscribeOnDestroyAdapter } from 'app/shared/UnsubscribeOnDestroyAdapter';
import { MachineryService } from 'app/core/service/machinery/machinery.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { sort } from 'app/core/models/sort';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from "@angular/common";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatTableExporterDirective, ExportType } from 'mat-table-exporter';
import { ConfirmationDialogComponent } from 'app/additional-components/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-manage-maintenance',
  templateUrl: './manage-maintenance.component.html',
  styleUrls: ['./manage-maintenance.component.scss']
})
export class ManageMaintenanceComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

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
    // 'select',
    // "index",
    'machineryId.name',
    'description',
    'maintenanceDate',
    // 'cost',
    'technicianName',
    // 'technicianPhoneNo',
    // 'firstMaintenanceDate',
    'nextMaintenanceDate',
    'actions',
  ];
  dataSource: any;
  selection = new SelectionModel<any>(true, []);
  rows = [];
  loading = false;
  userDetails: any;
  newUserImg = 'assets/images/user/user1.jpg';
  data :any=[];
  filteredData = [];
  editMaintenance: UntypedFormGroup;
  register: UntypedFormGroup;
  selectedOption: string;
  id: number;
role: any | null;
isLoading = true;
searchTerm: string = "";
sortEvent: sort = {
  active: "",
  direction: "DESC",
};
pageSize: number = 5;
pageIndex: number = 0;
deleteItem = {
  id:0,
  key : ''
};

  constructor(
    private fb: UntypedFormBuilder,
    public httpClient: HttpClient,
    public router: Router,
    public dialog: MatDialog,
    private machineryService: MachineryService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private spinner : NgxSpinnerService,
    public datepipe:DatePipe
  ) {
    super();
  }

  refresh() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }


    editCall(row) {
  this.shared.toEdit = row.id;
    this.router.navigate([`/machinery/edit-maintenance`]);
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

  deleteCall(row: any) {
    let name = row.machineryId.name
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

  currentDateTime = this.datepipe.transform(
    new Date(),
    "MM-dd-yyyy h-mm-ss"
  );


  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_Service_Details_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Service Details", 15, 25);

    autoTable(doc,
      {
        theme: "grid",
        styles: { halign: "center", fillColor: [78, 78, 229] },
        bodyStyles: { fillColor: [235, 235, 238] },
        margin: { top: 40 },
        body: data,
        columns: [
  
          { header: "Machinery Id ", dataKey: "machineryId" },
          { header: "Description", dataKey: "description" },
          { header: "Maintenance Date", dataKey: "maintenanceDate" },
          { header: "Cost", dataKey: "cost" },
          { header: "Technician Name", dataKey: "technicianName" },
          { header: "Technician Ph No", dataKey: "technicianPhoneNo" },
          { header: "NextMaintenance Date", dataKey: "nextMaintenanceDate" }

        ],
        didParseCell: function (data) {
          if (data.column.dataKey === 'machineryId') {
            var text = data.row.raw["machineryId"].name;
            // var text = data.row.raw["machineryId"].serialNumber;
            if (text && text.length > 0) {
              data.cell.text = text;
            }

          }
        }
      }
    );
    doc.save("KPR_Service_Details_" + this.currentDateTime);
  }

  cancel() {
    this.deleteItem.id = 0;
    this.deleteItem.key = '';
  }

  deleteRow(id) {
    this.machineryService.deleteMaintenance(id).subscribe((res) => {

      this.loadData();
      // if (res.status === "OK") {
      //   let message;
      //   this.notification.showNotification(
      //     'top',
      //     'center',
      //     message = {
      //       "message": res.message,
      //       "status": "success"
      //     },
      //   );
      // }
      // else {
        let message;
        this.notification.showNotification(
          'top',
          'right',
          message = {
            "message": res.message,
            "status": "danger"
          },
        );
      // }
    })
  }

  public loadData() {
    this.loading = true;

  this.machineryService.getMaintenanceList(
    this.pageIndex,
    this.pageSize,
    this.sortEvent.active,
    this.sortEvent.direction.toUpperCase(),
    this.searchTerm
  ).subscribe((response:any)=>{
    this.data = response.data;
    this.dataSource = this.data.content
  })
    
  }
}
