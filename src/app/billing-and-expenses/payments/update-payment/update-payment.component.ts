
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/service/auth.service';
import { BillingService } from 'app/core/service/billing/billing.service';
import { OrdersService } from 'app/core/service/orders/orders.service';
import { UserService } from 'app/core/service/user.service';
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component"; import { SharedService } from 'app/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-update-payment',
  templateUrl: './update-payment.component.html',
  styleUrls: ['./update-payment.component.scss']
})
export class UpdatePaymentComponent implements OnInit {

  addpayment: FormGroup;
  hide = true;
  agree = false;
  paymentId: number;
  formValue: any;
  dialogTitle: string;
  buttonTitle: string;
  currentUser: any;
  customers: any;
  orders: any;
  paymentTypes: any;
  paymentType: any;
  paidAmount: number;
  status: any[] = [
    { value: "UNPAID" },
    { value: "PARTIAL" },
    { value: "PAID" },
    { value: "REFUNDED" },
    { value: "CREDIT" },
  ];

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    private billingService: BillingService,
    private authService: AuthService,
    private userService: UserService,
    private orderService: OrdersService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private spinner: NgxSpinnerService,
  ) {
    this.paymentId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId
  }

  ngOnInit(): void {
    this.getDropDownData();

    this.addpayment = this.fb.group({
      id: [],
      customerId: ['', [Validators.required]],
      salesId: ['', [Validators.required]],
      paymentAmount: ['', [Validators.required]],
      paymentStatus: ['', [Validators.required]],
      balanceAmount: ['', [Validators.required]],
      refundAmount: ['', [Validators.required]],
      paymentType: ['', [Validators.required]],
      paidAmount: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      updatedBy: [this.currentUser],
    });

    if (this.paymentId) {
      this.dialogTitle = 'Update Payments';
      this.buttonTitle = "Update";
      let data;
      this.billingService.getIdPayment(this.paymentId).subscribe((res) => {
        data = res.data
        this.addpayment.controls["id"].setValue(data.id);
        this.addpayment.controls["customerId"].setValue(data.customerId);
        this.addpayment.controls["salesId"].setValue(data.salesId);
        this.addpayment.controls["paymentAmount"].setValue(data.paymentAmount);
        this.addpayment.controls["paymentStatus"].setValue(data.paymentStatus);
        this.addpayment.controls["balanceAmount"].setValue(data.balanceAmount);
        this.paidAmount = parseInt(data.paidAmount)
      });
    }
    let currentDate = this.datepipe.transform(new Date(), "MM-dd-yyyy");
    this.addpayment.controls["paymentDate"].setValue(currentDate);
  }

  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  onChange(event) {
    let balance
    let refund
    if (event <= this.addpayment.value.paymentAmount) {
      balance = this.addpayment.value.paymentAmount - event
      refund = 0
    } else {
      balance = 0
      refund = event - this.addpayment.value.paymentAmount
    }
    // this.addpayment.controls["balanceAmount"].setValue(balance);
    this.addpayment.controls["refundAmount"].setValue(refund);
  }

  onNoClick() {
    if (this.paymentId) {

      this.router.navigate(['/billing/manage-payment']);
    } else {
      // this.formValue = new UntypedFormControl({});
    }
  }

  getDropDownData() {
    this.userService.getCustomer().subscribe((res) => {
      this.customers = res.data;
    });
    this.orderService.getSalesOrder().subscribe((res) => {
      this.orders = res.data
    });
    this.billingService.getAllPaymentType().subscribe((res) => {
      this.paymentTypes = res.data
    });
  }

  onSelectCustomer(data: any) {
    this.addpayment.controls["customerId"].setValue(data);
  }

  onSelectOrder(data: any) {
    this.addpayment.controls["orderId"].setValue(data);
  }

  onSelectPaymentType(data: any) {
    this.addpayment.controls["paymentType"].setValue(data);
  }

  onUpdate() {
    if (this.addpayment.value.balanceAmount > 0) {
      this.addpayment.controls["paymentStatus"].setValue('PARTIAL');
    } else {
      this.addpayment.controls["paymentStatus"].setValue('PAID');
    }
    if (this.paymentId) {
      
      this.billingService.editPayment(this.addpayment.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "info"
            },
          );
          this.router.navigate(['/billing/manage-payment']);
          
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


