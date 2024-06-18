import { Component, OnInit } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "app/core/service/auth.service";
import { UserService } from "app/core/service/user.service";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component";
import { SharedService } from "app/shared/shared.service";

@Component({
  selector: "app-add-leave-request",
  templateUrl: "./add-leave-request.component.html",
  styleUrls: ["./add-leave-request.component.scss"],
})
export class AddLeaveRequestComponent_U implements OnInit {
  addEmployeeleave: FormGroup;
  userId: number;
  userRole:string;
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  currentUser: any;
  employee: any;
  employees: any;
  dateRange1 =[];
  status = ["CASUAL", "SICK", "PERMISSION"];
  leaveStatus = ["APPROVED", "PENDING", "REJECTED"];

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private notification: NotificationsComponent,
    private shared: SharedService,
  ) {
    this.userId = shared.toEdit;
    this.currentUser = authService.currentUserValue;
    this.userRole = authService.currentUserValue.role;

  }

  ngOnInit(): void {
    this.getData();
    this.addEmployeeleave = this.fb.group({
      id: [],
      employee: [""],
      leaveType: ["", [Validators.required]],
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
      duration: [""],
      reason: ["", [Validators.required]],
      isCompensation: [false, [Validators.required]],
      compensationDate: [""],
      employeeLeaveStatus: ["PENDING"],
      updatedBy: [this.currentUser.userId],
    });
    this.check();
    if (this.userId) {
      this.dialogTitle = "Edit";
      this.buttonTitle = "Edit & save";
      this.cancelButton = "Cancel";
      this.userService.getLeaveById(this.userId).subscribe((res) => {
        let data = res.data;
        if (res.status === "OK") {
          this.addEmployeeleave.controls["id"].setValue(data.id);
          this.addEmployeeleave.controls["employee"].setValue(data.employee);
          this.addEmployeeleave.controls["leaveType"].setValue(data.leaveType);
          this.addEmployeeleave.controls["startDate"].setValue(data.startDate);
          this.addEmployeeleave.controls["endDate"].setValue(data.endDate);
          this.addEmployeeleave.controls["duration"].setValue(data.duration);
          this.addEmployeeleave.controls["reason"].setValue(data.reason);
          this.addEmployeeleave.controls["compensationDate"].setValue(
            data.compensationDate
          );
        }
        let d = data.dateOfJoining;
      });
    } else {
      this.dialogTitle = "New Request";
      this.buttonTitle = "Save";
      this.cancelButton = "Reset";
    }
  }
  
  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  getData() {
    if(this.userRole === 'ADMIN'){
      this.userService.getEmployee().subscribe((res: any) => {
        this.employees = res.data;
      });
    }
    let u_Id = this.currentUser.userId;
    this.userService.getEmployeeByUserId(u_Id).subscribe((res: any) => {
      this.employee = res.data;
      this.addEmployeeleave.controls["employee"].setValue({
        id: this.employee.id,
      });
    });
  }

  check() {
    if (!this.addEmployeeleave.value.isCompensation) {
      this.addEmployeeleave.controls["compensationDate"].removeValidators([]);
      this.addEmployeeleave.controls["compensationDate"].disable();
    } else {
      this.addEmployeeleave.controls["compensationDate"].setValidators([
        Validators.required,
      ]);
      this.addEmployeeleave.controls["compensationDate"].enable();
    }
  }

  onNoClick() {
    if (this.userId) {
      this.router.navigate(["/user/manage-leave-request"]);
    } else {
    }
  }

  onSelectemployee(data: any) {
    this.addEmployeeleave.controls["employee"].setValue(data);
  }

  calculateDuration() {
    if (
      this.addEmployeeleave.value.startDate &&
      this.addEmployeeleave.value.endDate
    ) {
      var startDate: any = new Date(this.addEmployeeleave.value.startDate);
      var endDate: any = new Date(this.addEmployeeleave.value.endDate);
      var diffDays: any = Math.floor(
        (endDate - startDate) / (1000 * 60 * 60 * 24)
      );
      this.addEmployeeleave.controls["duration"].setValue(diffDays + 1);
    }
    this.myFilter();
  }
  

  myFilter = (d?: Date | null): boolean => {
    const date = d || new Date();
    this.dateRange1 = [new Date(this.addEmployeeleave.value.startDate), new Date(this.addEmployeeleave.value.endDate)]
    return !(d >= this.dateRange1[0] && d <= this.dateRange1[1])
  }

  onRegister() {
    this.addEmployeeleave.controls["employeeLeaveStatus"].setValue("PENDING");
    this.addEmployeeleave.controls["employee"].setValue({
      id: this.employee.id,
    });
    if (this.userId) {
      this.userService
        .editLeave(this.userId, this.addEmployeeleave.value)
        .subscribe((data: any) => {
          if (data.status === "OK") {
            let message;
            this.addEmployeeleave.reset();
            this.addEmployeeleave.controls["employee"].setValue({
              id: this.employee.id,
            });
            this.notification.showNotification(
              "top",
              "right",
              (message = {
                message: data.message,
                status: "info",
              })
            );
            this.router.navigate(["/employee/manage-leave-request"]);
          } else {
            let message;
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
    } else {
      this.userService
        .postLeave(this.addEmployeeleave.value)
        .subscribe((data: any) => {
          if (data.status === "OK") {
            let message;
            this.addEmployeeleave.reset();
            this.addEmployeeleave.controls["employee"].setValue({
              id: this.employee.id,
            });
            this.notification.showNotification(
              "top",
              "right",
              (message = {
                message: data.message,
                status: "success",
              })
            );
            this.router.navigate(["/employee/manage-leave-request"]);
          } else {
            let message;
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
