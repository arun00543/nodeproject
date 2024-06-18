import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { sort } from 'app/core/models/sort';
import { VehicleService } from 'app/core/service/vehicle/vehicle.service';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from "@angular/common";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatTableExporterDirective, ExportType } from 'mat-table-exporter';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'app/additional-components/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-manage-maintenance',
  templateUrl: './manage-maintenance.component.html',
  styleUrls: ['./manage-maintenance.component.scss']
})
export class ManageMaintenanceComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter: MatTableExporterDirective;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  displayedColumns = [
  'vehicleDetails.vehicleRegistrationNumber',
  'serviceProvider',
  'notes',
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
  deleteItem = {
    id: 0,
    key: ''
  };

  constructor(
    public router: Router,
    private vehicleService: VehicleService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    public dialog :MatDialog,
    public datepipe:DatePipe
  ) { }

  refresh() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }

  editCall(row) {
  this.shared.toEdit = row.id;
    this.router.navigate([`/vehicle/edit-service`]);
  }

  deleteCall(row: any) {
    let name = row.vehicleDetails.vehicleRegistrationNumber
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
    this.vehicleService.deleteVehicleService(id).subscribe((res) => {
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
          },
        );
      }
    })
  }

  currentDateTime = this.datepipe.transform(
    new Date(),
    "MM-dd-yyyy h-mm-ss"
  );

  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_Vehicle_Maintenance_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Vehicle Maintenance", 15, 25);

    autoTable(doc,
      {
        theme: "grid",
        styles: { halign: "center", fillColor: [78, 78, 229] },
        bodyStyles: { fillColor: [235, 235, 238] },
        margin: { top: 40 },
        body: data,
        columns: [
          { header: "Vehicle Number", dataKey: "vehicleDetails" },
          { header: "Vehicle Model", dataKey: "vehicleTypeName" },
          { header: "Service Provider", dataKey: "serviceProvider" },
          { header: "Notes", dataKey: "notes" },
          { header: "Current Service", dataKey: "currentService" },
          { header: "Next Service", dataKey: "nextService" },
        ],
        didParseCell: function (data) {
          if (data.column.dataKey === 'vehicleDetails') {
            var text = data.row.raw["vehicleDetails"].vehicleRegistrationNumber;
            if (text && text.length > 0) {
              data.cell.text = text;
            }
          }
        }
      }
    );
    doc.save("KPR_Vehicle_Maintenance_" + this.currentDateTime);
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
    this.vehicleService.getVehicleServiceList(
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

 
  

  