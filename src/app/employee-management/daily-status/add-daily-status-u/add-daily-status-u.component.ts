import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/service/auth.service';
import { UserService } from 'app/core/service/user.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-daily-status-u',
  templateUrl: './add-daily-status-u.component.html',
  styleUrls: ['./add-daily-status-u.component.scss']
})
export class AddDailyStatusComponent_U implements OnInit {
  addDailyStatus: FormGroup;
  hide = true;
  agree = false;
  dailyStatusId: number
  formValue: any;
  employee: any;
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  currentUser: any;
  today=new Date();
  status=["PRESENT", "ABSENT"]


  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private spinner: NgxSpinnerService,
  ) {
    this.dailyStatusId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId
  }

  ngOnInit(): void {

    this.getData();

    this.addDailyStatus = this.fb.group({
      id: [],
      employee: [''],
      dailyStatus: ['PRESENT'],
      date: ['', [Validators.required]],
      notes: ['', [Validators.required]],
      updatedBy: [this.currentUser],
    });

    if (this.dailyStatusId) {
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & save";
      this.cancelButton = "Cancel";
      this.userService.getDailyStatusById(this.dailyStatusId).subscribe((res) => {
        let data = res.data;
        if (res.status === "OK") {
          this.addDailyStatus.controls["id"].setValue(data.id);
          this.addDailyStatus.controls["date"].setValue(data.date);
          this.addDailyStatus.controls["notes"].setValue(data.notes);
        }
      })
    } else {
      this.dialogTitle = 'New Daily Status';
      this.buttonTitle = "Save"
      this.cancelButton = "Reset"
    }
  }
  
  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  getData() {
    let userRole = this.authService.currentUserValue.role

    if (userRole === 'EMPLOYEE') {
      let u_Id = this.authService.currentUserValue.userId;
      this.userService.getEmployeeByUserId(u_Id).subscribe((res: any) => {
        this.employee = res.data;
        this.addDailyStatus.controls["employee"].setValue({ id: this.employee.id });
      });
    } else {
      this.userService.getEmployee().subscribe((response: any) => {
        this.employee = response.data;
      })
    }
  }

  onNoClick() {
    if (this.dailyStatusId) {
      this.router.navigate(['/employee/manage-daily-status']);
    } else {

    }
  }

  onSelect(data: any) {
    this.addDailyStatus.controls["employee"].setValue(data);
  }

  onRegister() {
    this.addDailyStatus.controls["employee"].setValue({ id: this.employee.id });
    if (this.dailyStatusId) {
      
      this.userService.editDailyStatus(this.dailyStatusId, this.addDailyStatus.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addDailyStatus.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "info"
            },
          );
          this.router.navigate(['/employee/manage-daily-status']);
          
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
      this.userService.postDailyStatus(this.addDailyStatus.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addDailyStatus.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
          this.router.navigate(['/employee/manage-daily-status']);
          
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
