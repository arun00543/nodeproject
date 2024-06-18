import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
// import { DatepickerDropdownPositionX } from '@angular/material/datepicker';
import { ActivatedRoute,Router } from '@angular/router';
import { AuthService } from 'app/core/service/auth.service';
import { VehicleService } from 'app/core/service/vehicle/vehicle.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';


@Component({
  selector: 'app-add-service-items',
  templateUrl: './add-service-items.component.html',
  styleUrls: ['./add-service-items.component.scss']
})
export class AddServiceItemsComponent implements OnInit {

  addServiceItems: FormGroup;
  hide = true;
  agree = false;
  itemId: number;
  description: string;
  updatedBy: string;
  dialogTitle: string;
  cancelButton: string;
  buttonTitle: string;
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
    this.itemId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId
  }

  ngOnInit(): void {
    this.addServiceItems = this.fb.group({
      id: [],
      itemName: ['', [Validators.required]],
      description: [''],
       updatedBy: [this.currentUser],
    });

    if (this.itemId) {
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & Save";
      this.cancelButton="Cancel";
      this.vehicleService.getServiceItemsById(this.itemId).subscribe((res) => {
        let data = res.data
        this.addServiceItems.controls["id"].setValue(data.id);
        this.addServiceItems.controls["itemName"].setValue(data.itemName);
        this.addServiceItems.controls["description"].setValue(data.description);
      })
    } else {
      this.dialogTitle = 'New Service';
      this.buttonTitle = "Save";
      this.cancelButton="Reset";
    }
  }

  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  onCancel() {
    if (this.itemId) {
      this.router.navigate(['/vehicle/manage-service-items']);
    } else {
      this.formValue = new UntypedFormControl({});
    }
  }

  onNoClick() {
    if (this.itemId) {
      this.router.navigate(['/vehicle/manage-service-items']);
    } else {
      this.formValue = new UntypedFormControl({});
    }
  }

  onRegister() {

    if (this.itemId) {
      this.vehicleService.editServiceItems(this.itemId, this.addServiceItems.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addServiceItems.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "info"
            },
          );
          this.router.navigate(['/vehicle/manage-service-items']);
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
      this.vehicleService.postServiceItems(this.addServiceItems.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addServiceItems.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
          this.router.navigate(['/vehicle/manage-service-items']);
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

