import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/service/auth.service';
import { UserService } from 'app/core/service/user.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { Validators } from 'ngx-editor';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.scss']
})
export class AddContractComponent implements OnInit {

  addAssignContract: FormGroup;
  hide = true;
  agree = false;
  userId: number
  formValue: any;
  addedDetail:any;
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  currentUser: any;
  filteredContractorOptions: Observable<any>;
  filteredEmployeeOptions: Observable<any>;
  ContractorControl = new FormControl("");
  EmployeeControl = new FormControl("");
  separatorKeysCodes: number[] = [ENTER, COMMA];
  contractor: any;
  name: any;
  contractEmployees: any;
  selectedEmployee: Array<any> = [];
  employee:any;
  isclosed:boolean;
  contractStatus:string;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private notification: NotificationsComponent,
    private shared: SharedService,
  ) {
    this.userId = shared.toEdit;
    this.addedDetail = shared.newOnRow;
    this.currentUser = authService.currentUserValue.userId
  }
  ngOnInit(): void {

    this.addAssignContract = this.fb.group({
      id: [],
      contractName: ['', [Validators.required]],
      contractor: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      contractAmount: ['', [Validators.required]],
      contractEmployees: [[''], [Validators.required]],
      notes: ['', [Validators.required]],
      updatedBy: [this.currentUser],
    });

    if (this.addedDetail) {
      this.fillForm(this.addedDetail.formData, true);
      this.shared.newOnRow = null;
    }

    if (this.userId) {
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & save";
      this.cancelButton = "Cancel";
      this.userService.getContractById(this.userId).subscribe((res) => {
      this.fillForm(res.data);
      })
    } else {
      this.dialogTitle = 'New Contract';
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

  fillForm(data, isAddNew?:boolean){
    if (isAddNew) {
    this.addAssignContract.controls["id"].setValue(data?.id);
    this.addAssignContract.controls["contractName"].setValue(data?.contractName);
    this.addAssignContract.controls["contractor"].setValue(data?.contractor),
    this.ContractorControl.setValue(data?.contractor),
    this.onSelectContract(data?.contractor)
    this.addAssignContract.controls["startDate"].setValue(data?.startDate);
    this.addAssignContract.controls["endDate"].setValue(data?.endDate);
    this.addAssignContract.controls["contractAmount"].setValue(data?.contractAmount);
    this.addAssignContract.controls["contractEmployees"].setValue(data?.contractEmployees);
    for (let employee of data?.contractEmployees) {
      if(employee){
      this.selectedEmployee.push(employee);
      }
    } 
    this.addAssignContract.controls["notes"].setValue(data?.notes);
    if(this.addedDetail.class === 'contract-employee'){
      if(this.addedDetail.data){
        this.selectedEmployee.push(this.addedDetail.data);
        this.addAssignContract.controls["contractEmployees"].setValue(this.selectedEmployee);
      }
    } else{
      this.addedDetail = null;
    }
  } else {
    this.addAssignContract.controls["id"].setValue(data?.id);
    this.addAssignContract.controls["contractName"].setValue(data?.contractName);
    this.addAssignContract.controls["contractor"].setValue(data?.contractor),
    this.ContractorControl.setValue(data?.contractor),
    this.onSelectContract(data?.contractor)
    this.addAssignContract.controls["startDate"].setValue(data?.startDate);
    this.addAssignContract.controls["endDate"].setValue(data?.endDate);
    this.addAssignContract.controls["contractAmount"].setValue(data?.contractAmount);
    this.addAssignContract.controls["contractEmployees"].setValue(data?.contractEmployees);
    for (let employee of data?.contractEmployees) {
      this.selectedEmployee.push(employee);
    }
    this.addAssignContract.controls["notes"].setValue(data?.notes);
  }
  }

  onSelectContractEmployee(data){
  this.router.navigate([`/employee/add-${data}`]);
    this.shared.newOnRow = {
      class: data,
      formData: this.addAssignContract.value,
    }
  }

  private _filter(name: string): any {
    const filterValue = name.toLowerCase();
    return this.name.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  private _filter1(name: string): any {
    const filterValue = name.toLowerCase();
    return this.employee.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  public displayProperty(value) {
    if (value) {
      return value.name;
    }
  }

  remove(employees: string): void {
    const index = this.selectedEmployee.indexOf(employees);
    if (index >= 0) {
      this.selectedEmployee.splice(index, 1);
    }
    this.addAssignContract.controls["contractEmployees"].setValue(this.selectedEmployee);
  }

  onNoClick() {
    if (this.userId) {
      this.router.navigate(['/employee/manage-contract']);
    } else {
      this.addAssignContract.reset();
      this.ContractorControl.reset();
      this.selectedEmployee = []
      this.employee = []
      this.EmployeeControl.reset();
    }
  }
  

  onSelectContract(event: any) {
    let data = event ? event : ''
    this.addAssignContract.controls["contractor"].setValue(data);

    this.userService.getContractEmployeeByContractor(data?.id).subscribe((response: any) => {
      if(response.status === "OK"){
      this.employee = response.data;
      this.filteredEmployeeOptions = this.EmployeeControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name
            ? this._filter1(name as string)
            : this.employee.slice();
        })
      );
      }
    })
  }

  onSelect(event: MatAutocompleteSelectedEvent ,input: HTMLInputElement): void {
    if (this.selectedEmployee.length != 0) {
      for (let item of this.selectedEmployee) {
        if (item?.id === event.option.value?.id) {
          this.EmployeeControl.reset();
          return
        }
      }
      this.selectedEmployee.push(event.option.value);
    } else {
      this.selectedEmployee.push(event.option.value);
    }
    this.addAssignContract.controls["contractEmployees"].setValue(this.selectedEmployee);
    this.EmployeeControl.reset();
  }
  onRegister() {
    if (this.userId) {
      this.userService.editContract(this.userId, this.addAssignContract.value).subscribe((data: any) => {
          let message;
          if (data.status === "OK") {
          this.addAssignContract.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "info"
            },
          );
          this.router.navigate(['/employee/manage-contract']);
        }
        else {
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
      this.userService.postContract(this.addAssignContract.value).subscribe((data: any) => {
          let message;
          if (data.status === "OK") {
          this.addAssignContract.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
          this.router.navigate(['/employee/manage-contract']);
        }
        else {
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

