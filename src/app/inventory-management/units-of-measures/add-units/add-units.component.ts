

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
import { response } from 'express';
import { InventoryService } from 'app/core/service/inventory/inventory.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { AuthService } from 'app/core/service/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
@Component({
  selector: 'app-add-units',
  templateUrl: './add-units.component.html',
  styleUrls: ['./add-units.component.scss']
})
export class AddUnitsComponent implements OnInit {

  addUnit: FormGroup;
  hide = true;
  agree = false;
  unitId: number
  formValue: any
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  currentUser: any;
  selectedFile: any = null;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private inventoryService: InventoryService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private location : Location,
    private spinner: NgxSpinnerService,
  ) {
    this.unitId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId
  }

  ngOnInit(): void {

    this.addUnit = this.fb.group({
      id: [],
      unitName: ['', [Validators.required]],
      unitDescription: [''],
      unitWeight: ["", [Validators.required]],
      updatedBy: [this.currentUser],
    });

    if (this.unitId) {
      
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & save";
      this.cancelButton = "Cancel";
      this.inventoryService.getUnitById(this.unitId).subscribe((res) => {
        if (res.status === "OK") {
          let data = res.data
          this.addUnit.controls["unitName"].setValue(data.unitName);
          this.addUnit.controls["unitDescription"].setValue(data.unitDescription);
          this.addUnit.controls["unitWeight"].setValue(data.unitWeight);
        }
      })     
    } else {
      this.dialogTitle = 'New';
      this.buttonTitle = "Save";
      this.cancelButton = "Reset";
    }
  }

  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  back(){
    this.location.back();
  }

  onNoClick() {
    if (this.unitId) {
      this.back();
        } else {
      this.addUnit.reset();
      this.selectedFile = ''
    }
  }

  onRegister() {

    if (this.unitId) {
      
      this.inventoryService.editUnit(this.unitId, this.addUnit.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addUnit.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "info"
            },
          );
            this.back();
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
      this.inventoryService.postUnit(this.addUnit.value).subscribe((data: any) => {
        if (data.status === "OK") {
          if(this.shared.newOnRow?.class === 'units'){
            let formData = this.shared.newOnRow.formData
            this.shared.newOnRow = {
              class:'units',
              formData : formData,
              data: data.data,
            }
          }
          let message;
          this.addUnit.reset();
          this.selectedFile = ''
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
            this.back();
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

