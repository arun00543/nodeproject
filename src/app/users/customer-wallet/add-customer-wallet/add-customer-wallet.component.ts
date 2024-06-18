import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormControl, UntypedFormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { AuthService } from 'app/core/service/auth.service';
import { OrdersService } from 'app/core/service/orders/orders.service';
import { UserService } from 'app/core/service/user.service';
import { VehicleService } from 'app/core/service/vehicle/vehicle.service';
import { SharedService } from 'app/shared/shared.service';
import { Validators } from 'ngx-editor';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-add-customer-wallet',
  templateUrl: './add-customer-wallet.component.html',
  styleUrls: ['./add-customer-wallet.component.scss']
})
export class AddCustomerWalletComponent implements OnInit {
  addCustomerWallet: FormGroup;
  hide = true;
  agree = false;
  vehicleId: number;
  vehicleTypeName: string;
  filteredCustomerOptions: Observable<any[]>;
  description: string;
  updatedBy: string;
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  customerControl = new FormControl("");
  formValue: UntypedFormControl;
  currentUser: any;
  hideCustomer=false;
  userId: number;
  outstandingPayment: number=0;

  customer:any;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    public userService: UserService,
    public orderService: OrdersService,
  ) {
    this.userId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId
  }

  ngOnInit(): void {
    this.addCustomerWallet = this.fb.group({
      id: [],
      customer: ['', [Validators.required]],
      addAmount: ['', [Validators.required]],
      updatedBy: [this.currentUser]
    });

      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & Save";
      this.cancelButton = "Cancel";
      this.userService.getCustomerWalletId(this.userId).subscribe((res) => {
        let data = res.data
        this.customer = data
        this.getOutStandingPayment(data.customer?.id)
        this.addCustomerWallet.controls["id"].setValue(data.id);
        this.addCustomerWallet.controls["customer"].setValue(data.customer);
        this.addCustomerWallet.controls["addAmount"].setValue(data.addAmount);
      });
  }

  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  getOutStandingPayment(id){
    this.orderService
    .getOutstandingPaymentById(id, "admin")
    .subscribe((res) => {
      this.outstandingPayment = res.data;
    });
  }

  onCancel() {
    if (this.userId) {
      this.router.navigate(['/user/manage-customer-wallet']);
    } else {
      this.formValue = new UntypedFormControl({});
    }
  }

  onNoClick() {
    if (this.userId) {
      this.router.navigate(['/user/manage-customer-wallet']);
    } else {
      this.formValue = new UntypedFormControl({});
    }
  }

  onRegister() {

      this.userService.editCustomerWallet(this.userId, this.addCustomerWallet.value).subscribe((data: any) => {
          let message;
          if (data.status === "OK") {
          this.addCustomerWallet.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "info"
            },
          );
          this.router.navigate(['/user/manage-customer-wallet']);
        }
        else {
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
