import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { getData } from "ajv/dist/compile/validate";
import { AuthService } from "app/core/service/auth.service";
import { BillingService } from "app/core/service/billing/billing.service";
import { UserService } from "app/core/service/user.service";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component"; import { SharedService } from 'app/shared/shared.service';
import { Observable, map, startWith } from "rxjs";

@Component({
  selector: "app-create-payroll",
  templateUrl: "./create-payroll.component.html",
  styleUrls: ["./create-payroll.component.scss"],
})
export class CreatePayrollComponent implements OnInit {
  createPayroll: FormGroup;
  employeeControl = new FormControl("");
  payrollId: number;
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  currentUser: any;
  employeeName: any;
  employees: any;
  filteredEmployeeOptions: Observable<any[]>;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private billingService: BillingService,
    private userSerive: UserService,
    private shared: SharedService,
    private notification: NotificationsComponent
  ) {
    this.payrollId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId;
  }

  ngOnInit(): void {
    this.getEmployeeData();
    this.createPayroll = this.fb.group({
      id: [],
      employee: ["", [Validators.required]],
      basicPay: [, [Validators.required]],
      hra: [0,[Validators.required]],
      da: [0,[Validators.required]],
      conveyanceAllowance: [0,[Validators.required]],
      medicalAllowance: [0,[Validators.required]],
      specialAllowance: [0,[Validators.required]],
      bonus: [0,[Validators.required]],
      ita: [0,[Validators.required]],
      esi: [0,[Validators.required]],
      epf: [0,[Validators.required]],
      deductions: [0,[Validators.required]],
      earnings: [0,[Validators.required]],
      netPay: [0,[Validators.required]],
      updatedBy: [this.currentUser],
    });
    if (this.payrollId) {
      this.dialogTitle = "Edit";
      this.buttonTitle = "Edit & Save";
      this.cancelButton = "Cancel";

      this.billingService.getIdPayroll(this.payrollId).subscribe((res) => {
        let data = res.data;
        this.createPayroll.controls["id"].setValue(data.id);
        this.createPayroll.controls["employee"].setValue(data.employee);
        this.employeeControl.setValue(data.employee.name);
        this.createPayroll.controls["basicPay"].setValue(data.basicPay);
        this.createPayroll.controls["hra"].setValue(data.hra);
        this.createPayroll.controls["da"].setValue(data.da);
        this.createPayroll.controls["conveyanceAllowance"].setValue(
          data.conveyanceAllowance
        );
        this.createPayroll.controls["medicalAllowance"].setValue(
          data.medicalAllowance
        );
        this.createPayroll.controls["specialAllowance"].setValue(
          data.specialAllowance
        );
        this.createPayroll.controls["bonus"].setValue(data.bonus);
        this.createPayroll.controls["ita"].setValue(data.ita);
        this.createPayroll.controls["esi"].setValue(data.esi);
        this.createPayroll.controls["epf"].setValue(data.epf);
        this.createPayroll.controls["deductions"].setValue(data.deductions);
        this.createPayroll.controls["earnings"].setValue(data.earnings);
        this.createPayroll.controls["netPay"].setValue(data.netPay);
      });
    } else {
      this.dialogTitle = "New Employee Pay";
      this.buttonTitle = "Save";
      this.cancelButton = "Reset";
    }
  }
  
  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  getEmployeeData() {
    this.userSerive.getEmployee().subscribe((response: any) => {
      this.employees = response.data;
      this.filteredEmployeeOptions = this.employeeControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name ? this._filter(name as string) : this.employees.slice();
        })
      );
    });
  }

  private _filter(name: string) {
    const filterValue = name.toLowerCase();
    return this.employees.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  onSelectEmployee(data: any) {
    this.createPayroll.controls["employee"].setValue(data);
  }

  onRegister() {
    if (this.payrollId) {
      this.billingService
        .editPayroll(this.payrollId, this.createPayroll.value)
        .subscribe((data: any) => {
          let message;
          if (data.status === "OK") {
            this.notification.showNotification(
              "top",
              "right",
              (message = {
                message: data.message,
                status: "info",
              })
            );
            this.router.navigate(["/billing/manage-payroll"]);
          }
          else {
            this.notification.showNotification(
              "top",
              "right",
              (message = {
                message: data.message,
                status: "warning",
              })
            );
            this.router.navigate(["/billing/manage-payroll"]);
          }
        });
    } else {
      this.billingService
        .postPayroll(this.createPayroll.value)
        .subscribe((data: any) => {
          let message;
          if (data.status === "OK") {
            this.createPayroll.reset();
            this.employeeControl.reset();
            this.notification.showNotification(
              "top",
              "right",
              (message = {
                message: data.message,
                status: "success",
              })
            );
            this.router.navigate(["/billing/manage-payroll"]);
          }
          else {
            this.notification.showNotification(
              "top",
              "right",
              (message = {
                message: data.message,
                status: "warning",
              })
            );
            this.router.navigate(["/billing/manage-payroll"]);
          }
        });
    }
  }

  onNoClick() {
    if (this.payrollId) {
      this.router.navigate(["/billing/manage-payroll"]);
    } else {
    }
  }

  onChange() {
    this.totalEarnings();
    this.totalDeductions();
    this.netPay();
  }

  totalEarnings() {
    let data = this.createPayroll.value;
    let earnings =
      data.basicPay +
      data.hra +
      data.da +
      data.conveyanceAllowance +
      data.medicalAllowance +
      data.specialAllowance +
      data.bonus;
    this.createPayroll.controls["earnings"].setValue(earnings.toFixed(2));
  }

  totalDeductions() {
    let data = this.createPayroll.value;
    let deductions = data.ita + data.esi + data.epf;
    this.createPayroll.controls["deductions"].setValue(deductions.toFixed(2));
  }

  netPay() {
    let data = this.createPayroll.value;
    let netPay = data.earnings - data.deductions;
    this.createPayroll.controls["netPay"].setValue(netPay.toFixed(2));
  }
}
