import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ConfirmationDialogComponent } from 'app/additional-components/confirmation-dialog/confirmation-dialog.component';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { IndCurrencyFormat } from 'app/core/custom/pipe/currencyPipe';
import { sort } from 'app/core/models/sort';
import { AdministrativeService } from 'app/core/service/administrative/administrative.service';
import { AuthService } from 'app/core/service/auth.service';
import { UserService } from 'app/core/service/user.service';
import { SharedService } from 'app/shared/shared.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportType, MatTableExporterDirective } from 'mat-table-exporter';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-manage-employee-pay-hours',
  templateUrl: './manage-employee-pay-hours.component.html',
  styleUrls: ['./manage-employee-pay-hours.component.scss']
})
export class ManageEmployeePayHoursComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter: MatTableExporterDirective;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };
  public focus;
  displayedColumns = [
    // 'select',
    // "index",
    "employee.name",
    "workDate",
    "hoursWorked",
    "hourlyPay",
    "actions",
  ];

  addEmployeePayHours: FormGroup;
  employeeControl = new FormControl("");
  filteredEmployeeOptions: Observable<any[]>;
  hideEmployeePayHours = false;
  employeePayHourList: any = [];
  employeeName: string = "";
  fromDate: string = "";
  toDate: string = "";
  employeeData: any;
  employeeId = '';
  // fromDate = '';
  // toDate = '';
  today = new Date();
  currentUser: any;
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
  data1 :Array<any> = [];

  constructor(
    private fb: UntypedFormBuilder,
    public router: Router,
    public userService: UserService,
    public administrativeService: AdministrativeService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private authService: AuthService,
  ) {
    this.currentUser = authService.currentUserValue.userId
  }

  refresh() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();

    this.userService.getEmployee().subscribe((response: any) => {
      this.employeeData = response.data;
      this.filteredEmployeeOptions = this.employeeControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name
            ? this._filter(name as string)
            : this.employeeData.slice();
        })
      );

    })

    this.addEmployeePayHours = this.fb.group({
      id: [],
      employee: ['', [Validators.required]],
      fromDate: [, [Validators.required]],
      toDate: [, [Validators.required]],
    });

  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.employeeData.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
  public displayProperty(value) {
    if (value) {
      return value.name;
    }
  }

  onSelect(event: any) {
    let data = event.option.value;
    this.addEmployeePayHours.controls["employee"].setValue(data);
  }

  editCall(row) {
    this.shared.toEdit = row.id;
    this.router.navigate([`/employee/edit-employee-pay-hours`]);
  }

  deleteCall(row: any) {
    let name = row.employee.name
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: "Delete",
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
    this.hideEmployeePayHours = false;
  }

  deleteRow(id) {

    this.administrativeService.deleteEmployeePayHours(id).subscribe((res: any) => {

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
      fileName: "KPR_Employee_Pay_Hours_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Employee Pay Hours", 15, 25);

    autoTable(doc,
      {
        theme: "grid",
        styles: { halign: "center", fillColor: [78, 78, 229] },
        bodyStyles: { fillColor: [235, 235, 238] },
        margin: { top: 40 },
        body: data,
        columns: [
          { header: "Employee", dataKey: "employee" },
          { header: "Work Date", dataKey: "workDate" },
          { header: "Hourly Pay", dataKey: "hourlyPay" },
          { header: "Hours Worked", dataKey: "hoursWorked" },

        ],
        didParseCell: function (data) {
          if (data.column.dataKey === 'employee') {
            var text = data.row.raw["employee"].name;
            if (text && text.length > 0) {
              data.cell.text = text;
            }
          }
          if (data.column.dataKey === 'hourlyPay') {
            var text;
            if("Hourly Pay" != data.row.raw["hourlyPay"]) {
             text = new IndCurrencyFormat().transform(data.row.raw["hourlyPay"]).replace('₹','Rs.');
            } else {
              text = data.row.raw["hourlyPay"]
            }
            if (text && text.length > 0) {
              data.cell.text = text;
            }            
          }
        }
      }
    );
    doc.save("KPR_Employee_Pay_Hours_" + this.currentDateTime);
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

  search() {
    this.paginator.firstPage();
    this.loadData();
  }

  public loadData() {
    this.loading = true;
    this.administrativeService
      .getEmployeePayHoursList(
        this.pageIndex,
        this.pageSize,
        this.sortEvent.active,
        this.sortEvent.direction.toUpperCase(),
        this.searchTerm
      )
      .subscribe((response: any) => {
        if (response) {
          this.data = response.data;
          this.dataSource = this.data.content;
          this.pageIndex = 0;
          this.data1 = [];
          this.dataSource.map((a) =>{
            let payhours = {
                id:a.id,
                name:a.hourlyPay.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0})
            }
            this.data1.push(payhours);
          })
        }
      });

  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  onClick() {
    this.administrativeService.EmployeePayHoursFilter(
      this.addEmployeePayHours.value.employee.id,
      this.convert(this.addEmployeePayHours.value.fromDate),
      this.convert(this.addEmployeePayHours.value.toDate)
    ).subscribe((response: any) => {
      this.employeePayHourList = response.data;
    });
    this.hideEmployeePayHours = true;
    this.employeeName = this.addEmployeePayHours.value.employee.name;
    this.fromDate = this.addEmployeePayHours.value.fromDate;
    this.toDate = this.addEmployeePayHours.value.toDate;
  }

  importExport() {
    this.shared.importExportClass = "EmployeePayHours";
    this.router.navigate([`/administrative/pay-hours/excel-import-export`]);
  }

}
