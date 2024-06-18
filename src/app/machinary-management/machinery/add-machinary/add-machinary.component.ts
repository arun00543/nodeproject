import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormControl,
  UntypedFormControl,
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/service/auth.service';
import { MachineryService } from 'app/core/service/machinery/machinery.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-machinary',
  templateUrl: './add-machinary.component.html',
  styleUrls: ['./add-machinary.component.scss']
})
export class AddMachinaryComponent implements OnInit {

  addMachinery: FormGroup;
  hide = true;
  agree = false;
  machineryId: number
  formValue: any
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  currentUser: any;
  currentDate: any;


  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private machineryService: MachineryService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private spinner: NgxSpinnerService,
  ) {
    this.machineryId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId;
    this.currentDate = new Date
  }

  ngOnInit(): void {

    this.addMachinery = this.fb.group({
      id: [],
      name: ['', [Validators.required]],
      description: [''],
      serialNumber: ['', [Validators.required]],
      manufacturer: ['', [Validators.required]],
      modelNumber: ['', [Validators.required]],
      dateOfPurchase: ['', [Validators.required]],
      purchaseCost: ['', [Validators.required]],
      updatedBy: [this.currentUser],
    });

    if (this.machineryId) {
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & Save";
      this.cancelButton ="Cancel";
      this.machineryService.getMachineryById(this.machineryId).subscribe((res) => {
        let data = res.data
        this.addMachinery.controls["id"].setValue(data.id);
        this.addMachinery.controls["name"].setValue(data.name);
        this.addMachinery.controls["description"].setValue(data.description);
        this.addMachinery.controls["serialNumber"].setValue(data.serialNumber);
        this.addMachinery.controls["manufacturer"].setValue(data.manufacturer);
        this.addMachinery.controls["modelNumber"].setValue(data.modelNumber);
        this.addMachinery.controls["dateOfPurchase"].setValue(data.dateOfPurchase);
        this.addMachinery.controls["purchaseCost"].setValue(data.purchaseCost);
        this.addMachinery.controls["updatedBy"].setValue(data.updatedBy);
      })
    } else {
      this.dialogTitle = 'New Machinery';
      this.buttonTitle = "Save";
      this.cancelButton ="Reset";
    }
  }

  ngOnDestroy() {
    this.shared.toEdit = null;
  }


  onCancel() {
    if (this.machineryId) {
      this.router.navigate(['/machinery/manage-machinery']);
    } else {
      this.formValue = new UntypedFormControl({});
    }
  }

  onNoClick() {
    if (this.machineryId) {
      this.router.navigate(['/machinery/manage-machinery']);
    } else {
      this.formValue = new UntypedFormControl({});
    }
  }

  onRegister() {
    if (this.machineryId) {
      
      this.machineryService.editMachinery(this.machineryId, this.addMachinery.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addMachinery.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "info"
            },
          );
          
          
          this.router.navigate(['/machinery/manage-machinery']);
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
      this.machineryService.postMachinery(this.addMachinery.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addMachinery.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
          
          this.router.navigate(['/machinery/manage-machinery']);
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





