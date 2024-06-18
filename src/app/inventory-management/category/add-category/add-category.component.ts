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
import { InventoryService } from 'app/core/service/inventory/inventory.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  addCategory: FormGroup;
  hide = true;
  agree = false;
  itemId: number
  formValue: any
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  currentUser: any;


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
    this.itemId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId
  }

  ngOnInit(): void {

    this.addCategory = this.fb.group({
      id: [],
      categoryName: ['', [Validators.required]],
      categoryDescription: [''],
      updatedBy: [this.currentUser],


    });

    if (this.itemId) {
      
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & save";
      this.cancelButton = "Cancel";
      this.inventoryService.getitemCategoriesById(this.itemId).subscribe((res) => {
        let data = res.data
        this.addCategory.controls["id"].setValue(data.id);
        this.addCategory.controls["categoryName"].setValue(data.categoryName);
        this.addCategory.controls["categoryDescription"].setValue(data.categoryDescription);
        this.addCategory.controls["updatedBy"].setValue(data.updatedBy);      
      });
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
    if (this.itemId) {
      this.back();
    } else {
      this.addCategory.reset();
    }
  }

  onRegister() {

    if (this.itemId) {
      this.inventoryService.edititemCategory(this.itemId, this.addCategory.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          
          this.addCategory.reset();
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
          
          this.addCategory.reset();
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
      this.inventoryService.postitemCategory(this.addCategory.value).subscribe((data: any) => {
        if (data.status === "OK") {
          if(this.shared.newOnRow?.class === 'category'){
            let formData = this.shared.newOnRow.formData
            this.shared.newOnRow = {
              class:'category',
              formData:formData,
              data: data.data,
            }
          }
          let message;
          this.addCategory.reset();
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
          this.addCategory.reset();
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
