import { HttpClient } from '@angular/common/http';
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
import { BillingService } from 'app/core/service/billing/billing.service';
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component"; import { SharedService } from 'app/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-add-payment-type',
  templateUrl: './add-payment-type.component.html',
  styleUrls: ['./add-payment-type.component.scss']
})
export class AddPaymentTypeComponent implements OnInit {

  addpaymentType: FormGroup;
  hide = true;
  agree = false;
  paymentType: any;
  formValue: any;
  dialogTitle: string;
  resetButton :string;
  buttonTitle: string;
  currentUser: any;
  customers: any;
  orders: any;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private billingService: BillingService,
    private authService: AuthService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private spinner: NgxSpinnerService,
  ) {
    this.paymentType = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId
  }

  ngOnInit(): void {

    this.addpaymentType = this.fb.group({
      id: [],
      paymentType: ['', [Validators.required]],
      description: [''],
      updatedBy: [this.currentUser],


    });

    if (this.paymentType) {
      this.dialogTitle = 'Update Payment Type';
      this.buttonTitle = "Update";
      this.resetButton = "cancel";
      let data;
      this.billingService.getIdPaymentType(this.paymentType).subscribe((res) => {
        data = res.data

        this.addpaymentType.controls["id"].setValue(data.id);
        this.addpaymentType.controls["paymentType"].setValue(data.paymentType);
        this.addpaymentType.controls["description"].setValue(data.description);


      });
    }
    else {
      this.dialogTitle = 'Add Payment Type';
      this.buttonTitle = "Save";
      this.resetButton ="Reset";
    }

  }

  ngOnDestroy() {
    this.shared.toEdit = null;
  }


  onNoClick() {
    if (this.paymentType) {

      this.router.navigate(['/billing/manage-payment-type']);
    } else {
      // this.formValue = new UntypedFormControl({});
    }
  }

  onRegister() {
    if (this.paymentType) {
      
      this.billingService.editPaymentType(this.paymentType, this.addpaymentType.value).subscribe((data: any) => {
        let message;
        if (data.status === "OK") {
          this.addpaymentType.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "info"
            },
          );
          
          this.router.navigate(['/billing/manage-payment-type']);
        }
        else {
          let message;
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "warning"
            });
          
        }
      })
    } else {
      this.billingService.postPaymentType(this.addpaymentType.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addpaymentType.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
          
          this.router.navigate(['/billing/manage-payment-type']);
        } else {
          let message;
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "warning"
            });
          
        }
      })
    }
  }
}



