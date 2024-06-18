import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "app/core/service/auth.service";
import { UserService } from "app/core/service/user.service";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component"; import { SharedService } from 'app/shared/shared.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, map, startWith } from "rxjs";

@Component({
  selector: "app-add-daily-status",
  templateUrl: "./add-daily-status.component.html",
  styleUrls: ["./add-daily-status.component.scss"],
})
export class AddDailyStatusComponent_A implements OnInit {
  addDailyStatus: FormGroup;
  hide = true;
  agree = false;
  today = new Date();
  dailyStatusId: number;
  formValue: any;
  employees: any;
  filteredEmployeeOptions: Observable<any[]>;
  employeeControl = new FormControl("");
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  currentUser: any;
  status = ["PRESENT", "ABSENT"];

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
    this.currentUser = authService.currentUserValue;
  }

  ngOnInit(): void {
    this.userService.getEmployee().subscribe((response: any) => {
      this.employees = response.data;
      this.filteredEmployeeOptions = this.employeeControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name ? this._filter(name as string) : this.employees.slice();
        })
      );
    });

    this.addDailyStatus = this.fb.group({
      id: [],
      employee: [false, [Validators.required]],
      // dailyStatus: ['', [Validators.required]],
      date: ["", [Validators.required]],
      notes: ["", [Validators.required]],
      updatedBy: [this.currentUser.userId],
    });

    if (this.dailyStatusId) {

      this.dialogTitle = "Edit";
      this.buttonTitle = "Edit & Save";
      this.cancelButton = "Cancel";
      this.userService
        .getDailyStatusById(this.dailyStatusId)
        .subscribe((res) => {
          let data = res.data;
          if (res.status === "OK") {
            this.addDailyStatus.controls["id"].setValue(data.id);
            this.addDailyStatus.controls["employee"].setValue(data.employee);
            this.employeeControl.setValue(data.employee);
            this.addDailyStatus.controls["date"].setValue(data.date);
            this.addDailyStatus.controls["notes"].setValue(data.notes);
          }
        });

    } else {
      this.dialogTitle = "New Daily Status";
      this.buttonTitle = "Save";
      this.cancelButton = "Reset";
    }
  }

  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  public displayPropertyEmployee(value) {
    if (value) {
      return value.name;
    }
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.employees.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  onNoClick() {
    if (this.dailyStatusId) {
      this.router.navigate(["/admin/manage-daily-status"]);
    } else {
      this.addDailyStatus.reset();
      this.employeeControl.reset();
    }
  }

  onSelect(event: any) {
    let data = event.option.value;
    this.addDailyStatus.controls["employee"].setValue(data);
  }
  onChecked(event: any) {
    let { checked, value } = event;
    if (checked) {
      if (this.employees) {
        for (let emp of this.employees) {
          if (parseInt(this.currentUser.userName) === emp.phoneNumber) {
            this.addDailyStatus.controls["employee"].setValue(emp);
            this.employeeControl.setValue(emp);
          }
        }
      }
    } else {
      this.addDailyStatus.controls["employee"].reset();
      this.employeeControl.reset();
    }
  }

  onRegister() {

    if (this.dailyStatusId) {

      this.userService
        .editDailyStatus(this.dailyStatusId, this.addDailyStatus.value)
        .subscribe((data: any) => {
          let message;
          if (data.status === "OK") {
            let message;
            this.addDailyStatus.reset();
            this.employeeControl.reset();
            this.notification.showNotification(
              "top",
              "right",
              (message = {
                message: data.message,
                status: "info",
              })
            );

            this.router.navigate(["/admin/manage-daily-status"]);
          } else {
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
        });
    } else {
      this.userService.postDailyStatus(this.addDailyStatus.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addDailyStatus.reset();
          this.employeeControl.reset();
          this.notification.showNotification(
            'top',
            'center',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
          this.router.navigate(["/admin/manage-daily-status"]);
        } else {
          let message;
          this.notification.showNotification(
            'top',
            'center',
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
