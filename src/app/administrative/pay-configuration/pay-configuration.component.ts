import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, Validators, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component";
import { AuthService } from "app/core/service/auth.service";
import { BillingService } from "app/core/service/billing/billing.service";

@Component({
  selector: "app-pay-configuration",
  templateUrl: "./pay-configuration.component.html",
  styleUrls: ["./pay-configuration.component.scss"],
})
export class PayConfigurationComponent implements OnInit {
  addemployeepay: FormGroup;
  save = false;
  update = false;
  dialogTitle: string = "Pay Configuration";
  buttonTitle: string;
  currentUser: any;
  today = new Date();

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    public location: Location,
    private billingService: BillingService,
    private notification: NotificationsComponent
  ) {
    this.currentUser = authService.currentUserValue.userId;
  }

  ngOnInit(): void {
    this.addemployeepay = this.fb.group({
      id: [],
      monthlyLeavesAllowed: ["", [Validators.required]],
      overtimeRate: ["", [Validators.required]],
      attendanceBonus: ["", [Validators.required]],
      attendanceClosingDate: ["", [Validators.required]],
      updatedBy: [this.currentUser],
    });
    this.buttonTitle = "Save";
    this.bindData();
  }

  bindData(){
    this.billingService.getIdEmployeePayConfiguration().subscribe((res) => {
      if (res.status === "OK") {
          let data = res.data;
          if (data) {
            this.addemployeepay.controls["id"].setValue(
              data.id
            );
          this.addemployeepay.controls["monthlyLeavesAllowed"].setValue(
            data.monthlyLeavesAllowed
          );
          this.addemployeepay.controls["overtimeRate"].setValue(
            data.overtimeRate
          );
          this.addemployeepay.controls["attendanceBonus"].setValue(
            data.attendanceBonus
          );
          this.addemployeepay.controls["attendanceClosingDate"].setValue(
            data.attendanceClosingDate
          );
          this.buttonTitle = "Edit & save";
        } else {
          this.new();
        }
      }
      else {
       this.new()
      }
    });
  }

  back(): void {
    this.location.back();
  }

  new(){
    this.buttonTitle = "Save";
    this.update = true;
    this.save = true;
  }

  refresh(){
    this.update = false;
    this.save = false;
    this.bindData();
  }

  onRegister() {
    if (!this.save) {
      this.billingService
        .editEmployeePayConfiguration(this.addemployeepay.value.id, this.addemployeepay.value)
        .subscribe((data: any) => {
          let message;
          if (data.status === "OK") {
            this.refresh();
            this.notification.showNotification(
              "top",
              "right",
              (message = {
                message: data.message,
                status: "info",
              })
            );
          } else {
            this.notification.showNotification(
              "top",
              "right",
              (message = {
                // "message": data.message,
                status: "warning",
              })
            );
          }
        });
    } else {
      this.billingService
        .postEmployeePayConfiguration(this.addemployeepay.value)
        .subscribe((data: any) => {
            let message;
            if (data.status === "OK") {
            this.refresh();
            this.notification.showNotification(
              "top",
              "right",
              (message = {
                message: data.message,
                status: "success",
              })
            );
          } else {
            this.notification.showNotification(
              "top",
              "right",
              (message = {
                message: data.message,
                status: "warning",
              })
            );
          }
        });
    }
  }
}
