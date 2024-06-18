import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/service/auth.service';
import { UserService } from 'app/core/service/user.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-add-leave',
  templateUrl: './add-leave.component.html',
  styleUrls: ['./add-leave.component.scss']
})
export class AddLeaveComponent_A implements OnInit {


  addEmployeeleave: FormGroup;
  employeeControl =new FormControl("");
  hide = true;
  agree = false;
  userId: number
  formValue: any
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  filteredEmployeeOptions: Observable<any[]>;
  currentUser: any;
  Departments: any;
  employees: any;
  userRole :string;
  dateRange1 = []
  status = ["CASUAL", "SICK", "PERMISSION"];
  leaveStatus = ["APPROVED", "PENDING", "REJECTED"];
  rejectReason = ["Reason 1", "Reason 2", "Reason 3", "Reason 4"]


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
    this.userId = shared.toEdit;
    this.currentUser = authService.currentUserValue;
    this.userRole = authService.currentUserValue.role;

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

    this.addEmployeeleave = this.fb.group({
      id: [],
      employee: ['', [Validators.required]],
      leaveType: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      duration: [''],
      isCompensation: [false, [Validators.required]],
      compensationDate: [""],
      reason: ['', [Validators.required]],
      // employeeLeaveStatus: ['', [Validators.required]],
      updatedBy: [this.currentUser.userId],
    });
    this.check();
    if (this.userId) {
      this.dialogTitle = 'Leave Approval';
      this.buttonTitle = "Update";
      this.cancelButton = "Cancel";
      this.userService.getLeaveById(this.userId).subscribe((res) => {
        let data = res.data;
        if (res.status === "OK") {
          this.addEmployeeleave.controls["id"].setValue(data.id);
          this.addEmployeeleave.controls["employee"].setValue(data.employee);
          this.employeeControl.setValue(data.employee);
          this.addEmployeeleave.controls["leaveType"].setValue(data.leaveType);
          this.addEmployeeleave.controls["startDate"].setValue(data.startDate);
          this.addEmployeeleave.controls["endDate"].setValue(data.endDate);
          this.addEmployeeleave.controls["duration"].setValue(data.duration);
          this.addEmployeeleave.controls["reason"].setValue(data.reason);
          // this.addEmployeeleave.controls["employeeLeaveStatus"].setValue(data.employeeLeaveStatus);
        }
      })
    } else {
      this.dialogTitle = 'Leave Request';
      this.buttonTitle = "Save"
      this.cancelButton = "Reset"
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
      this.myFilter();
    }
  }
  myFilter = (d?: Date | null): boolean => {
    const date = d || new Date();
    this.dateRange1 = [new Date(this.addEmployeeleave.value.startDate), new Date(this.addEmployeeleave.value.endDate)]
    // Prevent dates in ranges from being selected.    
    return !(d >= this.dateRange1[0] && d <= this.dateRange1[1])
  }



  onNoClick() {
    if (this.userId) {
      this.router.navigate(['/admin/manage-leave-request']);
    } else {
      this.employeeControl.reset();
      this.addEmployeeleave.reset();
    }
  }

  onSelect(event: any) {
    let data = event.option.value;
    this.addEmployeeleave.controls["employee"].setValue(data);
  }


  check(){
    if (!this.addEmployeeleave.value.isCompensation) {
      this.addEmployeeleave.controls['compensationDate'].removeValidators([]);
      this.addEmployeeleave.controls['compensationDate'].disable();
      // this.addEmployeeleave.controls.accessType.updateValueAndValidity();
   } else{
      this.addEmployeeleave.controls['compensationDate'].setValidators([Validators.required]);
      this.addEmployeeleave.controls['compensationDate'].enable();
      // this.addEmployeeleave.controls.accessType.updateValueAndValidity();
   }  
  }

  onChecked(event:any){
    // let data = event.option.value;
    let {checked, value} = event;
    if(checked) {
      if(this.employees){
      for(let emp of this.employees){
        if(parseInt(this.currentUser.userName) === emp.phoneNumber){
          this.addEmployeeleave.controls["employee"].setValue(emp);
          this.employeeControl.setValue(emp);          

        }
      }
      }
    // this.addDailyStatus.controls["id"].setValue(data);
    // this.employees.name.push(value);
      } else{
        this.addEmployeeleave.controls["employee"].reset();
        this.employeeControl.reset();
        // this.addEmployeeleave.reset();

      }
  }



  onRegister() {

    if (this.userId) {
      
      this.userService.editLeave(this.userId, this.addEmployeeleave.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addEmployeeleave.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "info"
            },
          );
          
          this.router.navigate(['/admin/manage-leave-request']);
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
      })
    } else {
      this.userService.postLeave(this.addEmployeeleave.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addEmployeeleave.reset();
          this.notification.showNotification(
            'top',
            'center',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
          
        }
        else {
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
