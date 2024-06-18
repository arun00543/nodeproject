import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { DatepickerDropdownPositionX } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
// import { id } from '@swimlane/ngx-datatable';
import { AuthService } from 'app/core/service/auth.service';
import { OrdersService } from 'app/core/service/orders/orders.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';

@Component({
  selector: 'app-add-reject-reason',
  templateUrl: './add-reject-reason.component.html',
  styleUrls: ['./add-reject-reason.component.scss']
})
export class AddRejectReasonComponent implements OnInit {
  addReason: FormGroup;
  hide = true;
  agree = false;
  updatedBy: string;
  dialogTitle: string;
  buttonTitle: string;
  cancelTitle: string;
  formValue: UntypedFormControl;
  currentUser: any;
  reasonId: number;
  rejection = ["LeaveRejection", "OrderRejection"];
  

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private orderService:OrdersService
  ) { 
    this.reasonId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId
  }

  ngOnInit(): void {
    this.addReason = this.fb.group({
      id:[],
      rejectReason:[''],
      rejection:[''],
      updatedBy: [this.currentUser]
    });

    if (this.reasonId) {
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & Save"
      this.cancelTitle = "Cancel";
      this.orderService.getReasonById(this.reasonId).subscribe((res) => {
        let data = res.data
        this.addReason.controls["id"].setValue(data.id);
        this.addReason.controls["rejectReason"].setValue(data.rejectReason);
        this.addReason.controls["rejection"].setValue(data.rejection);
        this.addReason.controls["updatedBy"].setValue(data.updatedBy);
      })
      
    } else {
      this.dialogTitle = 'New Reason';
      this.buttonTitle = "Save";
      this.cancelTitle = "Reset";
       
    }
  }

  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  onCancel() {
    if (this.reasonId) {
      this.router.navigate(['administrative/manage-reject-reason']);
    } else {
      this.formValue = new UntypedFormControl({});
    }
  }

  onNoClick() {
    if (this.reasonId) {
      this.router.navigate(['administrative/manage-reject-reason']);
    } else {
      this.formValue = new UntypedFormControl({});
    }
  }

  onRegister() {

    if (this.reasonId) {
      this.orderService.editReason(this.reasonId,this.addReason.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addReason.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "info"
            },
          );
          this.router.navigate(['administrative/manage-reject-reason']);
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
      this.orderService.postReason(this.addReason.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addReason.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
          this.router.navigate(['administrative/manage-reject-reason']);
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

