import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { DatepickerDropdownPositionX } from '@angular/material/datepicker';
import { ActivatedRoute ,Router} from '@angular/router';
import { AuthService } from 'app/core/service/auth.service';
import { VehicleService } from 'app/core/service/vehicle/vehicle.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';


@Component({
  selector: 'app-add-vehicle-type',
  templateUrl: './add-vehicle-type.component.html',
  styleUrls: ['./add-vehicle-type.component.scss']
})
export class AddVehicleTypeComponent implements OnInit {
  addVehicleType: FormGroup;
  hide = true;
  agree = false;
  vehicleId: number;
  vehicleTypeName: string;
  description: string;
  updatedBy: string;
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  formValue: UntypedFormControl;
  currentUser: any;

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
    this.addVehicleType = this.fb.group({
      id: [],
      vehicleTypeName: ['', [Validators.required]],
      description: [''],
        updatedBy: [this.currentUser],
    });

    if (this.vehicleId) {
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & Save";
      this.cancelButton="Cancel";
      this.vehicleService.getVehicleTypeById(this.vehicleId).subscribe((res) => {
        let data = res.data
        this.addVehicleType.controls["id"].setValue(data.id);
        this.addVehicleType.controls["vehicleTypeName"].setValue(data.vehicleTypeName);
        this.addVehicleType.controls["description"].setValue(data.description);
        this.addVehicleType.controls["updatedBy"].setValue(data.updatedBy);
      })
    } else {
      this.dialogTitle = 'New Vehicle';
      this.buttonTitle = "Save";
      this.cancelButton = "Reset";
    }
  }

  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  onCancel() {
    if (this.vehicleId) {
      this.router.navigate(['/vehicle/manage-vehicle-type']);
    } else {
      this.formValue = new UntypedFormControl({});
    }
  }

  onNoClick() {
    if (this.vehicleId) {
      this.router.navigate(['/vehicle/manage-vehicle-type']);
    } else {
      this.formValue = new UntypedFormControl({});
    }
  }

  onRegister() {

    if (this.vehicleId) {
      this.vehicleService.editVehicleType(this.vehicleId, this.addVehicleType.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addVehicleType.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "info"
            },
          );
          this.router.navigate(['/vehicle/manage-vehicle-type']);
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
      this.vehicleService.postVehicleType(this.addVehicleType.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addVehicleType.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
          this.router.navigate(['/vehicle/manage-vehicle-type']);
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

