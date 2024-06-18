import { Component, OnInit } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { Router } from "@angular/router";
import { AuthService } from "app/core/service/auth.service";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component"; import { SharedService } from 'app/shared/shared.service';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  changePassword: FormGroup;
  currentUser: any;
  error = false;
  title = "Change Password";
  userId: number;


  matcher = new ErrorStateMatcher();

  constructor(
    private fb: UntypedFormBuilder,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
  ) {
    this.userId = authService.currentUserValue.userId;
    this.currentUser = authService.currentUserValue;
  }

  ngOnInit(): void {
    this.changePassword = this.fb.group({
      id: [this.userId],
      oldPassword: ["", [Validators.required]],
      newPassword: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^(?=\D*\d)(?=[^a-z]*[a-z])(?=.*[$@$!%*?&])(?=[^A-Z]*[A-Z]).{8,30}$/
          ),
        ],
      ],
      confirmNewPassword: ["", [Validators.required]],
      updatedBy: [this.userId],
    });
  }

  back() {
    if (this.currentUser.role === "SUPER_ADMIN") {
      this.router.navigate(['/admin/dashboard/super/dashboard']);
      this.shared.activeLink='/admin/dashboard/super/dashboard';
    }
    if (this.currentUser.role === "ADMIN") {
      this.router.navigate(['/admin/dashboard']);
      this.shared.activeLink='/admin/dashboard';
    }
    if (this.currentUser.role === "CUSTOMER") {
      this.router.navigate(['/user/dashboard']);
      this.shared.activeLink='/user/dashboard';
    }
    if (this.currentUser.role === "EMPLOYEE") {
      this.router.navigate(['/employee/dashboard']);
      this.shared.activeLink='/employee/dashboard';
    }
  }

  onUpdate() {
    this.authService
      .changePassowrd(this.changePassword.value)
      .subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.changePassword.reset();
          this.changePassword.controls["id"].setValue(this.userId);
          this.changePassword.controls["updatedBy"].setValue(this.userId);
          this.notification.showNotification(
            "top",
            "right",
            message = {
              message: data.message,
              status: "info",
            }
          );
          setTimeout(()=>{
            this.authService.logout();
          },1000)
        }
        else {
          let message;
          this.notification.showNotification(
            "top",
            "right",
            message = {
              message: data.message,
              status: "warning",
            }
          );
        }
      });
  }
}