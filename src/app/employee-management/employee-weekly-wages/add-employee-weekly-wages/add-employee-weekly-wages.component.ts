import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { AdministrativeService } from 'app/core/service/administrative/administrative.service';
import { AuthService } from 'app/core/service/auth.service';
import { UserService } from 'app/core/service/user.service';
import { SharedService } from 'app/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-add-employee-weekly-wages',
  templateUrl: './add-employee-weekly-wages.component.html',
  styleUrls: ['./add-employee-weekly-wages.component.scss']
})
export class AddEmployeeWeeklyWagesComponent implements OnInit {

  addEmployeeWeeklyWages: FormGroup;
  employeeControl = new FormControl("");
  filteredEmployeeOptions: Observable<any[]>;
  employeeWeeklyWagesId: number
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  currentUser: any;
  formValue: any;
  employeeData: any;
  today=new Date();

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private administrativeService: AdministrativeService,
    private userService: UserService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private spinner: NgxSpinnerService,
  ) {
    this.employeeWeeklyWagesId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId
  }

  ngOnInit(): void {
    
    this.userService.getEmployee().subscribe((response: any) => {
      this.employeeData = response.data;
      this.filteredEmployeeOptions = this.employeeControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name
            ? this._filter(name as string)
            : this.employeeData.slice();
        })
      );
      
    })


    this.addEmployeeWeeklyWages = this.fb.group({
      id: [],
      employee: ['', [Validators.required]],
      workStartDate: ['', [Validators.required]],
      workEndDate: ['', [Validators.required]],
      weeklyWorkedHours:  ['', [Validators.required]],
      hourlyPay: ['', [Validators.required]],
      weeklyTotalPay: ['', [Validators.required]],
      updatedBy: [this.currentUser],
    });

    if (this.employeeWeeklyWagesId) {
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & save";
      this.cancelButton = "Cancel";
      this.administrativeService.getEmployeeWeeklyWagesById(this.employeeWeeklyWagesId).subscribe((res) => {
        let data = res.data;
    
          this.addEmployeeWeeklyWages.controls["id"].setValue(data.id);
          this.addEmployeeWeeklyWages.controls["employee"].setValue(data.employee);
          this.employeeControl.setValue(data.employee);
          this.addEmployeeWeeklyWages.controls["workStartDate"].setValue(data.workStartDate);
          this.addEmployeeWeeklyWages.controls["workEndDate"].setValue(data.workEndDate);
          this.addEmployeeWeeklyWages.controls["weeklyWorkedHours"].setValue(data.weeklyWorkedHours);
          this.addEmployeeWeeklyWages.controls["hourlyPay"].setValue(data.hourlyPay);
          this.addEmployeeWeeklyWages.controls["weeklyTotalPay"].setValue(data.weeklyTotalPay);
          this.addEmployeeWeeklyWages.controls["updatedBy"].setValue(data.updatedBy);  
      })
    } else {
      this.dialogTitle = 'New Employee Weekly Wages';
      this.buttonTitle = "Save";
      this.cancelButton = "Reset";
    }
  }
  
  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.employeeData.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
  public displayProperty(value) {
    if (value) {
      return value.name;
    }
  } 

  onNoClick() {
    if (this.employeeWeeklyWagesId) {
      this.router.navigate(['/employee/manage-employee-weekly-wages']);
    } else {
      this.formValue = new UntypedFormControl({});
    }
  } 

  onChange() {
    this.totalWeeklyTotalPay();
  }

 totalWeeklyTotalPay() {
    let data = this.addEmployeeWeeklyWages.value;
    let weeklyTotalPay = data.hourlyPay * data.weeklyWorkedHours;
    this.addEmployeeWeeklyWages.controls["weeklyTotalPay"].setValue(weeklyTotalPay);
  }

  onSelect(event: any) {
    let data = event.option.value;
    this.addEmployeeWeeklyWages.controls["employee"].setValue(data);
  }


  onRegister() {

    if (this.employeeWeeklyWagesId) {
      
      this.administrativeService.editEmployeeWeeklyWages(this.employeeWeeklyWagesId, this.addEmployeeWeeklyWages.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let messages;
          this.notification.showNotification(
            'top',
            'right',
            messages = {
              "message": data.message,
              "status": "info"
            },
          );
          this.router.navigate(['/employee/manage-employee-weekly-wages']);
          
        }
        else {
          let messages;
          this.notification.showNotification(
            'top',
            'right',
            messages = {
              "message": data.message,
              "status": "warning"
            },
          );
          
          this.router.navigate(['/employee/manage-employee-weekly-wages']);
        }
      })
    } else {
      this.administrativeService.postEmployeeWeeklyWages(this.addEmployeeWeeklyWages.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addEmployeeWeeklyWages.reset();
          this.employeeControl.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
          
          this.router.navigate(['/employee/manage-employee-weekly-wages']);
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
          
          this.router.navigate(['/employee/manage-employee-weekly-wages']);
        }
      })
    }
  }
}
