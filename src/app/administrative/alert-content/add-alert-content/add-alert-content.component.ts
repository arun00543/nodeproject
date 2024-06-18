import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  UntypedFormControl,
  UntypedFormBuilder,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AdministrativeService } from "app/core/service/administrative/administrative.service";
import { AuthService } from "app/core/service/auth.service";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component"; import { SharedService } from 'app/shared/shared.service';

@Component({
  selector: "app-add-alert-content",
  templateUrl: "./add-alert-content.component.html",
  styleUrls: ["./add-alert-content.component.scss"],
})
export class AddAlertContentComponent implements OnInit {

  @ViewChild('content') content: ElementRef;
  alertContent: FormGroup;
  hide = true;
  agree = false;
  updatedBy: string;
  dialogTitle: string;
  buttonTitle: string;
  formValue: UntypedFormControl;
  currentUser: any;
  leaveReasonId: number;

  chips: any[] = [
    { name: "Employee Name", key: "employeeName" },
    { name: "Customer Name", key: "customerName" },
    { name: "Sales Id", key: "salesId" },
    { name: "Date", key: "date" },
  ];

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.chips, event.previousIndex, event.currentIndex);
  }

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private administrativeService: AdministrativeService
  ) {
    this.leaveReasonId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId;
  }

  ngOnInit(): void {
    this.alertContent = this.fb.group({
      id: [],
      content: [""],
      updatedBy: [this.currentUser],
    });

    if (this.leaveReasonId) {
      this.dialogTitle = "Edit";
      this.buttonTitle = "Edit & Save";
      this.administrativeService
        .getLeaveRejectReasonById(this.leaveReasonId)
        .subscribe((res) => {
          let data = res.data;
          this.alertContent.controls["id"].setValue(data.id);
          this.alertContent.controls["content"].setValue(data.rejectReason);
          this.alertContent.controls["updatedBy"].setValue(data.updatedBy);
        });
    } else {
      this.dialogTitle = "New Content";
      this.buttonTitle = "Save";
    }
  }

  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  onCancel() {
    if (this.leaveReasonId) {
      this.router.navigate(["administrative/manage-leave-reject-reason"]);
    } else {
      this.formValue = new UntypedFormControl({});
    }
  }

  onNoClick() {
    if (this.leaveReasonId) {
      this.router.navigate(["administrative/manage-leave-reject-reason"]);
    } else {
      this.formValue = new UntypedFormControl({});
    }
  }

  paste(data) {
    this.alertContent.controls["content"].setValue(
      this.alertContent.value.content + "{{" + data + "}}"
    );
    this.content.nativeElement.focus();
  }

  onRegister() {
    if (this.leaveReasonId) {
      this.administrativeService
        .editLeaveRejectReason(this.leaveReasonId, this.alertContent.value)
        .subscribe((data: any) => {
          if (data.status === "OK") {
            let message;
            this.alertContent.reset();
            this.notification.showNotification(
              "top",
              "center",
              (message = {
                message: data.message,
                status: "success",
              })
            );
            this.router.navigate(["administrative/manage-leave-reject-reason"]);
          } else {
            let message;
            this.alertContent.reset();
            this.notification.showNotification(
              "top",
              "center",
              (message = {
                message: data.message,
                status: "danger",
              })
            );
          }
        });
    } else {
      this.administrativeService
        .postLeaveRejectReason(this.alertContent.value)
        .subscribe((data: any) => {
          if (data.status === "OK") {
            let message;
            this.alertContent.reset();
            this.notification.showNotification(
              "top",
              "center",
              (message = {
                message: data.message,
                status: "success",
              })
            );
            this.router.navigate(["administrative/manage-leave-reject-reason"]);
          } else {
            let message;
            this.alertContent.reset();
            this.notification.showNotification(
              "top",
              "center",
              (message = {
                message: data.message,
                status: "danger",
              })
            );
          }
        });
    }
  }
}
