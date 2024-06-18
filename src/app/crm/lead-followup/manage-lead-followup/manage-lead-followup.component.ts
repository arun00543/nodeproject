import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { sort } from 'app/core/models/sort';
import { CrmService } from 'app/core/service/crm/crm.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportType, MatTableExporterDirective } from 'mat-table-exporter';

import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'app/additional-components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-manage-lead-followup',
  templateUrl: './manage-lead-followup.component.html',
  styleUrls: ['./manage-lead-followup.component.scss']
})
export class ManageLeadFollowupComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter: MatTableExporterDirective;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  displayedColumns = [
    'leadGeneration.name',
    'followUpDate',
    'notes',
    'status',
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
  currentDateTime: string;
  getStatus = "";
  status: any[] = [
    { value: "" }, 
    { value: "Replied" }, 
    { value: "Opportunity" },
    { value: "Quotation" },
    { value: "LostQuotation" },
    { value: "Interested" },
    { value: "Converted" },
    { value: "DoNotContact" },
  ];

  constructor(
    public router: Router,
    private crmService: CrmService,
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
    this.router.navigate([`/crm/edit-lead-followup`]);
  }

  cancel() {
    this.deleteItem.id = 0;
    this.deleteItem.key = '';
  }

  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_FollowUp_Details_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Lead FollowUp Details", 15, 25);

    autoTable(doc,
      {
        theme: "grid",
        styles: { halign: "center", fillColor: [78, 78, 229] },
        bodyStyles: { fillColor: [235, 235, 238] },
        margin: { top: 40 },
        body: data,
        columns: [
          { header: "Lead Generation", dataKey: "leadGeneration" },
          { header: "Follow up Date", dataKey: "followUpDate" },
          { header: "Notes", dataKey: "notes" },
          { header: "Status", dataKey: "status" },

        ],
        didParseCell: function (data) {
          if (data.column.dataKey === 'leadGeneration') {
            var text = data.row.raw["leadGeneration"].name;
            if (text && text.length > 0) {
              data.cell.text = text;
            }
          }
        }
      }
    );
    doc.save("KPR_FollowUp_Details_" + this.currentDateTime);
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
    this.crmService.getLeadFollowupList(
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


