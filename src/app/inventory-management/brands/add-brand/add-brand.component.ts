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
import { noImg } from "app/inventory-management/noImg";
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.scss']
})
export class AddBrandComponent implements OnInit {
  addBrand: FormGroup;
  hide = true;
  agree = false;
  brandId: number
  formValue: any
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  logo: string;
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
    private location: Location,
    private spinner: NgxSpinnerService,
  ) {
    this.brandId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId
  }

  ngOnInit(): void {
    this.addBrand = this.fb.group({
      id: [],
      name: ['', [Validators.required]],
      description: [''],
      logoString: [''],
      updatedBy: [this.currentUser],
    });

    if (this.brandId) {
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & save";
      this.cancelButton = "Cancel";
      this.inventoryService.getBrandById(this.brandId).subscribe((res) => {
        let data = res.data
        this.addBrand.controls["id"].setValue(data.id);
        this.addBrand.controls["name"].setValue(data.name);
        this.addBrand.controls["description"].setValue(data.description);
        if (data.logoString) {
          this.addBrand.controls["logoString"].setValue(data.logoString);
        } else {
          this.logo = noImg
        }
        this.addBrand.controls["updatedBy"].setValue(data.updatedBy);
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

  back() {
    this.location.back();
  }

  onCancel() {
    if (this.brandId) {
      this.back();
    } else {
      this.addBrand.reset();
      this.selectedFile = ''
    }
  }

  onRegister() {
    this.addBrand.controls["updatedBy"].setValue(this.currentUser);
    if (this.brandId) {
      
      this.inventoryService.editBrand(this.brandId, this.addBrand.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addBrand.reset();
          this.selectedFile = ''
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
      this.inventoryService.postBrand(this.addBrand.value).subscribe((data: any) => {
        if (data.status === "OK") {
          if(this.shared.newOnRow?.class === 'brand'){
            let formData = this.shared.newOnRow.formData
            this.shared.newOnRow = {
              class:'brand',
              formData: formData,
              data: data.data
            }
          }
          let message;
          this.addBrand.reset();
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

  onFileSelected(event: any): void {
    if(event.target.files[0].type === "image/png" || event.target.files[0].type === "image/jpeg"){
      if (event.target.files[0]?.size > 2000 * 1024) {
        let message;
        this.notification.showNotification(
          'top',
          'right',
          message = {
            "message": "The file size should Not be more then 2MB",
            "status": "warning"
          },
        );
      } else {
        this.selectedFile = event.target.files[0] ?? null;
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile);
        reader.onload = () => {
          let file = reader.result
          this.addBrand.controls["logoString"].setValue(file);
        };
      }
    } else {
      let message;
      this.notification.showNotification(
        'top',
        'center',
        message = {
          "message": "Only Image Files can be uploaded",
          "status": "danger"
        },
      );
    } 
  }
}
