import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/service/auth.service';
import { UserService } from 'app/core/service/user.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { Observable, map, startWith } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-contract-employee',
  templateUrl: './add-contract-employee.component.html',
  styleUrls: ['./add-contract-employee.component.scss']
})
export class AddContractEmployeeComponent implements OnInit {
  addContractEmployee: FormGroup;
  hide = true;
  agree = false;
  contractEmployeeId: number
  formValue: any
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  currentUser: any;
  filteredContractorOptions: Observable<any>;
  ContractorControl = new FormControl("");
  contractor: any;
  name: any;
  contractEmployees: any;
  selectedEmployee: Array<any> = [];



  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private location: Location
  ) {
    this.contractEmployeeId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId
  }
  ngOnInit(): void {


    this.addContractEmployee = this.fb.group({
      id: [],
      name: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      address: ['', [Validators.required]],
      aadhaarNumber: ['', [Validators.required]],
      notes: ['', [Validators.required]],
      contractor: ['', [Validators.required]],
      updatedBy: [this.currentUser],
    });

    if (this.contractEmployeeId) {
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & save";
      this.cancelButton = "Cancel";
      this.userService.getContractEmployeeById(this.contractEmployeeId).subscribe((res) => {
        let data = res.data;
        if (res.status === "OK") {
          this.addContractEmployee.controls["id"].setValue(data.id);
          this.addContractEmployee.controls["name"].setValue(data.name);
          this.addContractEmployee.controls["contractor"].setValue(data.contractor),
          this.ContractorControl.setValue(data.contractor),
          this.addContractEmployee.controls["phoneNumber"].setValue(data.phoneNumber);
          this.addContractEmployee.controls["address"].setValue(data.address);
          this.addContractEmployee.controls["aadhaarNumber"].setValue(data.aadhaarNumber);
          this.addContractEmployee.controls["notes"].setValue(data.notes);
        }
      })
    } else {
      this.dialogTitle = 'New Contract Employee';
      this.buttonTitle = "Save"
      this.cancelButton = "Reset"
    }

    this.userService.getEmployeeContract().subscribe((response: any) => {
      this.name = response.data;
      this.filteredContractorOptions = this.ContractorControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name
            ? this._filter(name as string)
            : this.name.slice();
        })
      );
    })
  }
  
  ngOnDestroy() {
    this.shared.toEdit = null;
  }
  private _filter(name: string): any {
    const filterValue = name.toLowerCase();
    return this.name.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  public displayProperty(value) {
    if (value) {
      return value.name;
    }
  }

  onNoClick() {
    if (this.contractEmployeeId) {
      this.back();
    } else {
      this.addContractEmployee.reset();
      this.selectedEmployee = []
    }
  }
  
  back() {
    this.location.back();
  }

  onSelectContract(event: any) {
    let data = event.option.value
    this.addContractEmployee.controls["contractor"].setValue(data);
  }

  onRegister() {

    if (this.contractEmployeeId) {
      this.userService.editContractEmployee(this.contractEmployeeId, this.addContractEmployee.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addContractEmployee.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "info"
            },
          );
          this.back();
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
      this.userService.postContractEmployee(this.addContractEmployee.value).subscribe((data: any) => {
        if (data.status === "OK") {
          if(this.shared.newOnRow?.class === 'contract-employee'){
            let formData = this.shared.newOnRow.formData
            this.shared.newOnRow = {
              class:'contract-employee',
              formData: formData,
              data: data.data
            }
          }
          let message;
          this.addContractEmployee.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
          this.back();
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


