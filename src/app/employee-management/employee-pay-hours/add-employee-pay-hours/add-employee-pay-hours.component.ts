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
  selector: 'app-add-employee-pay-hours',
  templateUrl: './add-employee-pay-hours.component.html',
  styleUrls: ['./add-employee-pay-hours.component.scss']
})
export class AddEmployeePayHoursComponent implements OnInit {

  addEmployeePayHours: FormGroup;
  employeeControl = new FormControl("");
  filteredEmployeeOptions: Observable<any[]>;
  employeePayHoursId: number
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  currentUser: any;
  formValue: any;
  employeeData: any;
  swipeType = ["IN", "OUT"];
  today=new Date();

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private spinner: NgxSpinnerService,
    private administrativeService: AdministrativeService
  ) {
    this.employeePayHoursId = shared.toEdit;
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


    this.addEmployeePayHours = this.fb.group({
      id: [],
      employee: ['', [Validators.required]],
      workDate: ['', [Validators.required]],
      hoursWorked: ['', [Validators.required]],
      hourlyPay:  ['', [Validators.required]],
      updatedBy: [this.currentUser],
    });

    if (this.employeePayHoursId) {
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & save";
      this.cancelButton = "Cancel";
      this.administrativeService.getEmployeePayHoursById(this.employeePayHoursId).subscribe((res) => {
        let data = res.data;
    
          this.addEmployeePayHours.controls["id"].setValue(data.id);
          this.addEmployeePayHours.controls["employee"].setValue(data.employee);
          this.employeeControl.setValue(data.employee);
          this.addEmployeePayHours.controls["workDate"].setValue(data.workDate);
          this.addEmployeePayHours.controls["hoursWorked"].setValue(data.hoursWorked);
          this.addEmployeePayHours.controls["hourlyPay"].setValue(data.hourlyPay);
          this.addEmployeePayHours.controls["updatedBy"].setValue(data.updatedBy);  
      })
    } else {
      this.dialogTitle = 'New Employee Pay Hours';
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
    if (this.employeePayHoursId) {
      this.router.navigate(['/employee/manage-employee-pay-hours']);
    } else {
      this.formValue = new UntypedFormControl({});
    }
  } 

  onSelect(event: any) {
    let data = event.option.value;
    this.addEmployeePayHours.controls["employee"].setValue(data);
  }


  onRegister() {

    if (this.employeePayHoursId) {
      
      this.administrativeService.editEmployeePayHours(this.employeePayHoursId, this.addEmployeePayHours.value).subscribe((data: any) => {
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
          this.router.navigate(['/employee/manage-employee-pay-hours']);
          
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
          
          this.router.navigate(['/employee/manage-employee-pay-hours']);
        }
      })
    } else {
      this.administrativeService.postEmployeePayHours(this.addEmployeePayHours.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addEmployeePayHours.reset();
          this.employeeControl.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
          
          this.router.navigate(['/employee/manage-employee-pay-hours']);
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
          
          this.router.navigate(['/employee/manage-employee-pay-hours']);
        }
      })
    }
  }
}
