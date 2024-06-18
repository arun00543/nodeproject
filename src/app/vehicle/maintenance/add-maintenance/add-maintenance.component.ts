import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { DatepickerDropdownPositionX, DatepickerDropdownPositionY } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/service/auth.service';
import { VehicleService } from 'app/core/service/vehicle/vehicle.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { Observable, map, startWith } from 'rxjs';

export class list {
  serviceItem: any;
  serviceType: any;
  cost: any;
}

@Component({
  selector: 'app-add-maintenance',
  templateUrl: './add-maintenance.component.html',
  styleUrls: ['./add-maintenance.component.scss']
})
export class AddMaintenanceComponent implements OnInit {

  addMaintenance: FormGroup;
  hide = true;
  agree = false;
  vehicleId: number;
  vehicleDetails:any;
  vehicleType: any;
  itemName: any;
  serviceProvider: string;
  notes: string;
  currentService: DatepickerDropdownPositionX;
  nextService: DatepickerDropdownPositionY;
  cost: number;
  updatedBy: string;
  today = new Date();
  dialogTitle: string;
  buttonTitle: string;
  cancelButton:string;
  formValue: any;
  currentUser: any;
  filteredVehicleOptions: Observable<any>;
  vehicleControl= new FormControl("");
  serviceControl= new FormControl("");
  filteredServiceOptions: Observable<any>;
  serviceTypes = [ "INSPECTION", "SERVICE", "CHANGE" ]
  vehicleTypeName: any;
  items: any;
  itemList: Array<list> = [];
  total = 0;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private vehicleService:VehicleService,
  ) { 
    this.vehicleId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId
  }

  ngOnInit(): void {

    this.addMaintenance = this.fb.group({
      id: [],
      vehicleDetails: ['', [Validators.required]],
      serviceType: [],
      serviceItem: [],
      serviceProvider: ['', [Validators.required]],
      cost: [],
      notes: ['', [Validators.required]],
      currentService: ['', [Validators.required]],
      nextService: ['', [Validators.required]],
      vehicleServiceDetails: [],
       updatedBy: [this.currentUser],
    });

    if (this.vehicleId) {
      this.dialogTitle = 'Edit Service';
      this.buttonTitle = "Edit & Save";
      this.cancelButton ="Cancel"
      this.vehicleService.getVehicleServiceById(this.vehicleId).subscribe((res) => {
        let data = res.data   
        this.addMaintenance.controls["id"].setValue(data.id);
        this.addMaintenance.controls["vehicleDetails"].setValue(data.vehicleDetails);
        this.vehicleControl.setValue(data.vehicleDetails), 
        this.addMaintenance.controls["vehicleServiceDetails"].setValue(data.vehicleServiceDetails);
        this.itemList = data.vehicleServiceDetails;
        this.totalPrice();
        // this.serviceControl.setValue(data.vehicleServiceDetails),
        // this.addMaintenance.controls["serviceType"].setValue(data.serviceType);
        this.addMaintenance.controls["serviceProvider"].setValue(data.serviceProvider);
        // this.addMaintenance.controls["cost"].setValue(data.cost);
        this.addMaintenance.controls["currentService"].setValue(data.currentService);
        this.addMaintenance.controls["nextService"].setValue(data.nextService);
        this.addMaintenance.controls["notes"].setValue(data.notes);
        // this.addMaintenance.controls["vehicleServiceHistoryDetails"].setValue(data.vehicleServiceHistoryDetails);
      })
      

    } else {
      this.dialogTitle = 'New Service';
      this.buttonTitle = "Save";
      this.cancelButton="Reset";
    }
    

    this.vehicleService.getVehicle().subscribe((response: any) => {
      this.vehicleType = response.data;
      this.filteredVehicleOptions = this.vehicleControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name ? this._filter(name as string) : this.vehicleType.slice();
        })
      );
    });
    this.vehicleService.getServiceItems().subscribe((response: any) => {
      this.itemName = response.data;
      this.filteredServiceOptions = this.serviceControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name ? this._filter1(name as string) : this.itemName.slice();
        })
      );
    });
  }

  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  addToList() {
    let itemObj = new list();
    if (this.itemList.length > 0) {
      for (let item of this.itemList) {
        if (
          item.serviceItem.id === this.addMaintenance.value.serviceItem.id &&
          item.serviceType === this.addMaintenance.value.serviceType
        ) {
          item.cost = this.addMaintenance.value.cost;
          this.totalPrice();
          this.conditionalReset();
          return
        }
        }
    }
    itemObj.serviceItem = this.addMaintenance.value.serviceItem;
    itemObj.serviceType = this.addMaintenance.value.serviceType;
    itemObj.cost=this.addMaintenance.value.cost;
    this.itemList.push(itemObj);
      this.totalPrice();
    this.conditionalReset();
  }
  
  totalPrice() {
    this.total = 0;
    for (let data of this.itemList) {
      this.total += data.cost;
    }
  }

  removeObject(row: any) {
    const index: number = this.itemList.indexOf(row);
    if (index !== -1) {
      this.itemList.splice(index, 1);
    }
    this.totalPrice();
  }

  conditionalReset() {
    this.serviceControl.reset();
    this.addMaintenance.controls["serviceItem"].reset();
    this.addMaintenance.controls["serviceType"].reset();
    this.addMaintenance.controls["cost"].reset();
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.vehicleType.filter((option) =>
      option.vehicleType.vehicleTypeName.toLowerCase().includes(filterValue)
    );
  }

  public displayPropertyVehicleType(value) {
    if (value) {
      return value.vehicleType.vehicleTypeName; 
      
    }
  }

  private _filter1(name:string):any[]{
    const filterValue = name.toLowerCase();
    return this.itemName.filter((option) =>
      option.itemName.toLowerCase().includes(filterValue) 
    );
  }

  public displayPropertyServiceType(value) {
    if (value) {
      return value.itemName;
    }
  }

  onCancel() {
    if (this.vehicleId) {
      this.router.navigate(['/vehicle/manage-service']);
    } else {
      this.formValue = new UntypedFormControl({});
    }
  }

  onNoClick() {
    if (this.vehicleId) {
      this.router.navigate(['/vehicle/manage-service']);
    } else {
      this.formValue = new UntypedFormControl({});
      this.itemList = []
    }
  }


  onSelectVehicle(event: any) {
    let data = event.option.value;
    this.addMaintenance.controls["vehicleDetails"].setValue(data);
  }

  onSelectService(event: any) {
    let data = event.option.value;
    this.addMaintenance.controls["serviceItem"].setValue(data);
  }

 

  onRegister() {
    this.addMaintenance.controls["vehicleServiceDetails"].setValue(this.itemList);
    if (this.vehicleId) {
      this.vehicleService.editVehicleService(this.vehicleId, this.addMaintenance.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addMaintenance.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "info"
            },
          );
          this.router.navigate(['/vehicle/manage-service']);
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
      this.vehicleService.postVehicleService(this.addMaintenance.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addMaintenance.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
          this.router.navigate(['/vehicle/manage-service']);
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
