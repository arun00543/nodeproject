import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/service/auth.service';
import { UserService } from 'app/core/service/user.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { Observable, startWith, map } from 'rxjs';

@Component({
  selector: 'app-add-contractor',
  templateUrl: './add-contractor.component.html',
  styleUrls: ['./add-contractor.component.scss']
})
export class AddContractorComponent implements OnInit {

  addContract: FormGroup;
  hide = true;
  agree = false;
  userId: number
  formValue: any
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  currentUser: any;
  departmentName: any;
  department: any;
  filteredDepartmentOptions: Observable<any>;
  departmentControl = new FormControl("");
  cType = [ "DIRECT", "SUB" ]

  depId = {
    "id": 0,
    "departmentName": 'ooo'
  }
  getemp: any



  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private notification: NotificationsComponent,
    private shared: SharedService,
  ) {
    this.userId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId
  }

  ngOnInit(): void {

    this.userService.getEmployeeDepartments().subscribe((response: any) => {
      this.department = response.data;
      this.filteredDepartmentOptions = this.departmentControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name
            ? this._filter(name as string)
            : this.department.slice();
        })
      );
    })


    this.addContract = this.fb.group({
      id: [],
      name: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.required]],
      address: ['', [Validators.required]],
      aadhaarNumber: ['', [Validators.required]],
      panNumber: [
        "",
        [
          Validators.pattern("^([A-Z]){5}([0-9]){4}([A-Z]){1}$"),
        ],
      ],
      contractorType: ['', [Validators.required]],
      notes: ['', [Validators.required]],
      updatedBy: [this.currentUser],
    });

    if (this.userId) {
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & save";
      this.cancelButton = "Cancel";
      this.userService.getEmployeeContractById(this.userId).subscribe((res) => {
        let data = res.data;
        if (res.status === "OK") {
          this.addContract.controls["id"].setValue(data.id);
          this.addContract.controls["name"].setValue(data.name);
          this.addContract.controls["phoneNumber"].setValue(data.phoneNumber);
          this.addContract.controls["email"].setValue(data.email);
          this.addContract.controls["address"].setValue(data.address);
          this.addContract.controls["aadhaarNumber"].setValue(data.aadhaarNumber);
          this.addContract.controls["panNumber"].setValue(data.panNumber);
          this.addContract.controls["contractorType"].setValue(data.contractorType);
          this.addContract.controls["notes"].setValue(data.notes);
        }
      })
    } else {
      this.dialogTitle = 'New Contractor';
      this.buttonTitle = "Save"
      this.cancelButton = "Reset"
    }
  }

  onPanInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const cursorStart = inputElement.selectionStart;
    const cursorEnd = inputElement.selectionEnd;
  
    const newValue = inputElement.value.toUpperCase();
  
    this.addContract.patchValue({ panNumber: newValue }, { emitEvent: false });
  
    // Restore the cursor position
    inputElement.setSelectionRange(cursorStart, cursorEnd);
  }
  
  ngOnDestroy() {
    this.shared.toEdit = null;
  }
  private _filter(name: string): any {
    const filterValue = name.toLowerCase();
    return this.department.filter((option) =>
      option.departmentName.toLowerCase().includes(filterValue)
    );
  }

  public displayPropertydepartment(value) {
    if (value) {
      return value.departmentName;
    }
  }


  onNoClick() {
    if (this.userId) {
      this.router.navigate(['/employee/manage-contractor']);
    } else {

    }
  }

  onSelect(event: any) {
    let data = event.option.value
    this.addContract.controls["department"].setValue(data);
  }

  onRegister() {

    if (this.userId) {
      this.userService.editEmployeeContract(this.userId, this.addContract.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addContract.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "info"
            },
          );
          this.router.navigate(['/employee/manage-contractor']);
        }
        else {
          let message;
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "warning"
            });
        }
      })
    } else {
      this.userService.postEmployeeContract(this.addContract.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addContract.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
          this.router.navigate(['/employee/manage-contractor']);
        }
        else {
          let message;
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "warning"
            });
        }
      })
    }
  }


}
