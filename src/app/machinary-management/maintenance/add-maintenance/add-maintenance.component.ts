import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  Validators,
  FormControl,
  UntypedFormControl,
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { sort } from 'app/core/models/sort';
import { AuthService } from 'app/core/service/auth.service';
import { MachineryService } from 'app/core/service/machinery/machinery.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-add-maintenance',
  templateUrl: './add-maintenance.component.html',
  styleUrls: ['./add-maintenance.component.scss']
})
export class AddMaintenanceComponent implements OnInit {

  addMaintenance: FormGroup;
  machineryControl = new FormControl("");
  filteredMachineryOptions: Observable<any[]>;
  hide = true;
  agree = false;
  maintenanceId: number
  formValue: any
  dialogTitle: string;
  buttonTitle: string;
  cancelButton:string;
  machinery: any;
  currentUser: any;
  currentDate: Date;
  machinarydata: any;
  searchTerm: string = "";
  sortEvent: sort = {
    active: "",
    direction: "DESC",
  };
  pageSize: number = 5;
  pageIndex: number = 0;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private machineryService: MachineryService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private spinner: NgxSpinnerService,
  ) {
    this.maintenanceId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId;
    this.currentDate = new Date

  }

  ngOnInit(): void {
    
    this.machineryService.getMachinery().subscribe((response: any) => {
      this.machinarydata = response.data;
      this.filteredMachineryOptions = this.machineryControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name
            ? this._filter(name as string)
            : this.machinarydata.slice();
        })
      );
      
    })

    this.addMaintenance = this.fb.group({
      id: [],
      machineryId: ['', [Validators.required]],
      description: [''],
      maintenanceDate: ['', [Validators.required]],
      cost: ['', [Validators.required]],
      technicianName: ['', [Validators.required]],
      technicianPhoneNo: ['', [Validators.required]],
      // firstMaintenanceDate:['',[Validators.required]],
      nextMaintenanceDate: ['', [Validators.required]],
      updatedBy: [this.currentUser],
    });

    if (this.maintenanceId) {
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & save";
      this.cancelButton = "Cancel"
      this.machineryService.getMaintenanceById(this.maintenanceId).subscribe((res) => {
        let data = res.data
        this.addMaintenance.controls["id"].setValue(data.id);
        this.addMaintenance.controls["machineryId"].setValue(data.machineryId);
        this.machineryControl.setValue(data.machineryId),
        this.addMaintenance.controls["description"].setValue(data.description);
        this.addMaintenance.controls["maintenanceDate"].setValue(data.maintenanceDate);
        this.addMaintenance.controls["cost"].setValue(data.cost);
        this.addMaintenance.controls["technicianName"].setValue(data.technicianName);
        this.addMaintenance.controls["technicianPhoneNo"].setValue(data.technicianPhoneNo);
        // this.addMaintenance.controls["firstMaintenanceDate"].setValue(data.firstMaintenanceDate);
        this.addMaintenance.controls["nextMaintenanceDate"].setValue(data.nextMaintenanceDate);
        this.addMaintenance.controls["updatedBy"].setValue(data.updatedBy);
      })
    } else {
      this.dialogTitle = 'New Maintenance';
      this.buttonTitle = "Save";
      this.cancelButton = "Reset"
    }
  }

  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  public displayProperty(value) {
    if (value) {
      return value.name;
    }
  }

  onSelect(event: any) {
    let data = event.option.value
    this.addMaintenance.controls["machineryId"].setValue(data);
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.machinarydata.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  onCancel() {
    if (this.maintenanceId) {
      this.router.navigate(['/machinery/manage-service']);
    } else {
      this.formValue = new UntypedFormControl({});
    }
  }

  onNoClick() {
    if (this.maintenanceId) {
      this.router.navigate(['/machinery/manage-service']);
    } else {
      this.formValue = new UntypedFormControl({});
    }
  }

  onRegister() {
    if (this.maintenanceId) {
      
      this.machineryService.editMaintenance(this.maintenanceId, this.addMaintenance.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addMaintenance.reset();
          this.machineryControl.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "info"
            },
          );
          
          
          this.router.navigate(['/machinery/manage-service']);
        }
        else {
          let message;
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "warning"
            },
          );
          
        }
      })
    } else {
      this.machineryService.postMaintenance(this.addMaintenance.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addMaintenance.reset();
          this.machineryControl.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
          
          this.router.navigate(['/machinery/manage-service']);
        }
        else {
          let message;
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "warning"
            },
          );
          
        }
      })
    }
  }


}


