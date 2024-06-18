import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  Validators,
  FormControl,
  FormGroup,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "app/core/service/auth.service";
import { UserService } from "app/core/service/user.service";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component";
import { SharedService } from "app/shared/shared.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, map, startWith } from "rxjs";

@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.sass"],
})
export class AddUserComponent implements OnInit {
  addUser: FormGroup;
  roleControl = new FormControl("");
  customerControl = new FormControl("");
  employeeControl = new FormControl("");
  filteredRoleOptions: Observable<any[]>;
  filteredCustomerOptions: Observable<any[]>;
  filteredEmployeeOptions: Observable<any[]>;
  hideCustomer = false;
  hideEmployee = false;
  userId: number;
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  currentUser: any;
  userRole1 = ['ADMIN', 'EMPLOYEE', 'CUSTOMER'];
  userRole2 = ['ADMIN', 'EMPLOYEE', 'CUSTOMER'];
  customer: any;
  employee: any;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private spinner: NgxSpinnerService
  ) {
    this.userId = shared.toEdit;
    this.currentUser = authService.currentUserValue;
  }

  ngOnInit(): void {
    this.getData();
    this.addUser = this.fb.group({
      id: [],
      userRole: ["", [Validators.required]],
      userName: ["", [Validators.required]],
      empCusId: [""],
      updatedBy: [this.currentUser.userId],
    });

    if (this.userId) {
      this.dialogTitle = "Edit";
      this.buttonTitle = "Edit & save";
      this.cancelButton = "Cancel";
      this.userService.getUserById(this.userId).subscribe((res) => {
        if (res.status === "OK") {
          let data = res.data.user;
          this.addUser.controls["id"].setValue(data.id);
          this.addUser.controls["userRole"].setValue(data.userRoles);
          this.roleControl.setValue(data.userRoles);
          this.addUser.controls["userName"].setValue(data.username);
          if (res.data.customer) {
            this.addUser.controls["empCusId"].setValue(res.data.customer.id);
            this.customerControl.setValue(res.data.customer);
          }
          if (res.data.employee) {
            this.addUser.controls["empCusId"].setValue(res.data.employee.id);
            this.employeeControl.setValue(res.data.employee);
          }
          this.onSelectRole(data.userRoles);
        }
      });
    } else {
      this.dialogTitle = "New User";
      this.buttonTitle = "Save";
      this.cancelButton = "Reset";
    }
    if (this.currentUser.role === "ADMIN") {
      this.filteredRoleOptions = this.roleControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name
            ? this._filter(name as string, "role2")
            : this.userRole2.slice();
        })
      );
    } else {
      this.filteredRoleOptions = this.roleControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name
            ? this._filter(name as string, "role1")
            : this.userRole1.slice();
        })
      );
    }
  }

  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  getData() {
    this.userService.getEmployee().subscribe((response: any) => {
      this.employee = response.data;
      this.filteredEmployeeOptions = this.employeeControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name
            ? this._filter(name as string, "employee")
            : this.employee.slice();
        })
      );
    });

    this.userService.getCustomer().subscribe((response: any) => {
      this.customer = response.data;
      this.filteredCustomerOptions = this.customerControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name
            ? this._filter(name as string, "customer")
            : this.customer.slice();
        })
      );
    });

    // this.userService.getUserRoles().subscribe((response: any) => {
    //   this.userRole = response.data;
    //   this.filteredRoleOptions = this.roleControl.valueChanges.pipe(
    //     startWith(""),
    //     map((value: any) => {
    //       const name = typeof value === "string" ? value : value?.name;
    //       return name
    //         ? this._filter(name as string, "role")
    //         : this.userRole.slice();
    //     })
    //   );
    // })
  }

  private _filter(name: string, type: string): any[] {
    const filterValue = name.toLowerCase();
    if (type) {
      switch (type) {
        case "role1":
          return this.userRole1.filter((option) =>
            option.toLowerCase().includes(filterValue)
          );

        case "role2":
          return this.userRole2.filter((option) =>
            option.toLowerCase().includes(filterValue)
          );

        case "customer":
          return this.customer.filter((option) =>
            option.name.toLowerCase().includes(filterValue)
          );

        case "employee":
          return this.employee.filter((option) =>
            option.name.toLowerCase().includes(filterValue)
          );
      }
    }
  }
  public displayProperty(value) {
    if (value) {
      return value.name;
    }
  }

  onChange(data: string) {
    if (!this.userId) {
      let userNum = Math.floor(1000 * Math.random());
      let passNum = Math.floor(100000 * Math.random());
      this.addUser.controls["userName"].setValue(data.toLowerCase() + userNum);
      this.addUser.controls["password"].setValue(
        userNum + data.toLowerCase() + passNum
      );
    }
  }

  onNoClick() {
    this.onSelectRole("");
    this.roleControl.reset();
    this.employeeControl.reset();
    this.customerControl.reset();
    if (this.userId) {
      this.router.navigate(["/user/manage-user"]);
    }
  }

  onSelectRole(data: any) {
    if (data === "EMPLOYEE" || data === "ADMIN") {
      this.hideEmployee = true;
      this.hideCustomer = false;
      this.addUser.controls["userName"].reset();
      this.employeeControl.reset();
    } else if (data === "CUSTOMER") {
      this.hideCustomer = true;
      this.hideEmployee = false;
      this.addUser.controls["userName"].reset();
    } else {
      this.hideCustomer = false;
      this.hideEmployee = false;
      this.addUser.controls["empCusId"].setValidators([]);
    }
    this.addUser.controls["userRole"].setValue(data);
  }

  onSelectCustomer(event: any) {
    let data = event.option.value;
    this.addUser.controls["empCusId"].setValue(data.id);
    this.addUser.controls["userName"].setValue(data.phoneNumber);
  }
  onSelectEmployee(event: any) {
    let data = event.option.value;
    this.addUser.controls["empCusId"].setValue(data.id);
    this.addUser.controls["userName"].setValue(data.phoneNumber);
  }

  onRegister() {
    if (this.userId) {
      this.userService
        .editUser(this.userId, this.addUser.value)
        .subscribe((data: any) => {
          if (data.status === "OK") {
            let messages;
            this.notification.showNotification(
              "top",
              "right",
              (messages = {
                message: data.message,
                status: "info",
              })
            );
            this.router.navigate(["/user/manage-user"]);
            
          } else {
            let messages;
            this.notification.showNotification(
              "top",
              "right",
              (messages = {
                message: data.message,
                status: "warning",
              })
            );
            
          }
        });
    } else {
      this.userService.postUser(this.addUser.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addUser.reset();
          this.onSelectRole("");
          this.customerControl.reset();
          this.employeeControl.reset();
          this.roleControl.reset();
          this.notification.showNotification(
            "top",
            "right",
            (message = {
              message: data.message,
              status: "success",
            })
          );
          alert(data.data);
          this.router.navigate(["/user/manage-user"]);
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
