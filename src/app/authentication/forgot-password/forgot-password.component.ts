import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/core/service/auth.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  resetForm: UntypedFormGroup;
  otpForm: UntypedFormGroup;
  passwordForm: UntypedFormGroup;
  submitted = false;
  returnUrl: string;
  isTrue = true;
  isFalse = false;
  passwordPage = false;
  interval: NodeJS.Timer;
  timeLeft: number = 120;
  
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private notification: NotificationsComponent,
    private authservice: AuthService
  ) {  }
  
  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      number: [
        [Validators.required],
      ],
    });

    this.otpForm = this.formBuilder.group({
      otpNumber: [[Validators.required]],
    });

    this.passwordForm = this.formBuilder.group({
      newPassword: ["", [Validators.required,
        Validators.pattern(
          /^(?=\D*\d)(?=[^a-z]*[a-z])(?=.*[$@$!%*?&])(?=[^A-Z]*[A-Z]).{8,30}$/
        ),]],
      confirmPassword: ["",
        [Validators.required],
      ],
    });
  }
  onSubmit() {
    // stop here if form is invalid
    if (this.resetForm.invalid) {
      return;
    } else {
      this.authservice.forgotPassword(this.resetForm.value.number).subscribe(
        (response: any) => {
          if (response) {
            if (response.status === "OK") {
              this.isTrue = false;
              this.isFalse = true;
              let message;
              this.notification.showNotification(
                'top',
                'right',
                message = {
                  "message": response.message,
                  "status": "success"
                },
              );
            } else {
              let message;
              this.notification.showNotification(
                'top',
                'right',
                message = {
                  "message": response.message,
                  "status": "danger"
                },
              );
            }
          }
        }
      )
      // this.router.navigate(['/dashboard/maindashboard']);
    }
  }
  reset(){
    this.onSubmit();
    this.otpForm.reset();
    this.startTimer();
  }

  onSubmitOtp() {
    if (this.resetForm.invalid) {
      return;
    } else {
      this.authservice.otpVerify(this.otpForm.value.otpNumber,this.resetForm.value.number).subscribe(
        (response: any) => {
          if (response) {
            if (response.data === true && response.status === "OK") {
              this.isFalse = false;
              this.passwordPage = true;
              let message;
              this.notification.showNotification(
                'top',
                'right',
                message = {
                  "message": response.message,
                  "status": "success"
                },
              ); 
            } else {
              this.otpForm.reset();
              let message;
              this.notification.showNotification(
                'top',
                'right',
                message = {
                  "message": response.message,
                  "status": "danger"
                },
              );
            }
          }
        }
      )
    }
  }
  setPassword() {
    if (this.resetForm.invalid) {
      return;
    } else {
      this.authservice.confirmPassword(this.passwordForm.value.newPassword,this.resetForm.value.number.toString()).subscribe(
        (response: any) => {
          if (response) {
            if (response.status === "OK") {
              this.isFalse = false;
              this.passwordPage = true;
              let message;
              this.notification.showNotification(
                'top',
                'right',
                message = {
                  "message": response.message,
                  "status": "success"
                },
              );
              this.router.navigate(['/authentication/login']);
            } else {
              let message;
              this.notification.showNotification(
                'top',
                'right',
                message = {
                  "message": response.message,
                  "status": "danger"
                },
              );
            }
          }
        }
      )
    }
  }
  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 120;
      }
      if(this.timeLeft==0){
        this.pauseTimer();
      }
    },1000)
  }
  pauseTimer() {
    clearInterval(this.interval);
  }    
}
