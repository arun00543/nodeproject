import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/service/auth.service';
import { BillingService } from 'app/core/service/billing/billing.service';
import { UserService } from 'app/core/service/user.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { Observable, map, startWith } from 'rxjs';
export class list {
  amount: any;
  receiptFile: number;
  expenseCategory: any;
}

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss']
})
export class AddExpenseComponent implements OnInit {

  addExpenseType: FormGroup;
  hide = true;
  agree = false;
  expenseId: number
  formValue: any
  dialogTitle: string;
  buttonTitle: string;
  currentUser: any;
  userRole: any;
  userName: string;
  // itemControl=new FormControl("");
  itemName: any;
  filteredOptions:  Observable<any>;
  filteredEmployeeOptions:  Observable<any>;
  categoryControl = new FormControl("");
  employeeControl = new FormControl("");
  expenseCategory: any;
  categoryName: any;
  cancelButton:string;
  status = ["PAID","UN-PAID"];
  employee: any;
  today = new Date();
  itemList: Array<list> = [];


  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private billingService: BillingService,
    private userService: UserService,
  ) {
    this.expenseId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId
   }

  ngOnInit(): void {

    this.billingService.getExpenses().subscribe((response: any) => {
      ;
      this.userRole = response.data;
    })

    this.addExpenseType = this.fb.group({
      id: [],
      // userRoleId:['', [Validators.required]],
      date: ['', [Validators.required]],
      amount: [],
      notes: ['', [Validators.required]],
      receiptFile: [],
      status: ['', [Validators.required]],
      expenseCategory: [],
      expenseDetails:[],
      employee:['',[Validators.required]],
      updatedBy: [this.currentUser],
    });


    if (this.expenseId) {
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & save";
      this.cancelButton = "Cancel";
      this.billingService.getExpensesById(this.expenseId).subscribe((res) => {
        if (res.status === "OK") {
          let data = res.data
          this.addExpenseType.controls["id"].setValue(data.id);
          // this.addExpenseType.controls["expenseCategory"].setValue(data.expenseCategory),
          // this.categoryControl.setValue(data.expenseCategory);
          this.addExpenseType.controls["employee"].setValue(data.employee),
          this.employeeControl.setValue(data.employee);
          this.addExpenseType.controls["date"].setValue(data.date);
          this.addExpenseType.controls["expenseDetails"].setValue(data.expenseDetails);
          this.itemList = data.expenseDetails;
          this.addExpenseType.controls["notes"].setValue(data.notes);
          // this.addExpenseType.controls["receiptFile"].setValue(data.receiptFile);
          this.addExpenseType.controls["status"].setValue(data.status);
        }
      })

    } else {
      this.dialogTitle = 'New Expense';
      this.buttonTitle = "Save";
      this.cancelButton = "Reset";
    }
    this.billingService.getExpensesCategory().subscribe((response: any) => {
      this.categoryName = response.data;
      this.filteredOptions = this.categoryControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name ? this._filter(name as string) : this.categoryName.slice();
        })
      );
    });

    this.userService.getEmployee().subscribe((response: any) => {
      this.employee = response.data;
      this.filteredEmployeeOptions = this.employeeControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name ? this._filte1(name as string) : this.employee.slice();
        })
      );
    });

  }

  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  addToList() {
    let itemObj = new list();
    itemObj.expenseCategory = this.addExpenseType.value.expenseCategory;
    itemObj.amount = this.addExpenseType.value.amount;
    itemObj.receiptFile = this.addExpenseType.value.receiptFile;
      this.itemList.push(itemObj);
      // this.totalPrice();
    this.conditionalReset();
  }

  removeObject(row: any) {
    const index: number = this.itemList.indexOf(row);
    if (index !== -1) {
      this.itemList.splice(index, 1);
    }
    // this.totalPrice();
  }

  conditionalReset() {
    this.categoryControl.reset();
    // this.addExpenseType.reset();
    this.addExpenseType.controls["expenseCategory"].reset();
    this.addExpenseType.controls["amount"].reset();
    this.addExpenseType.controls["receiptFile"].reset();
  }

  private _filter(name:string):any[]{
    const filterValue = name.toLowerCase();
    return this.categoryName.filter((option) =>
      option.categoryName.toLowerCase().includes(filterValue) 
    );
  }

  private _filte1(name:string):any[]{
    const filterValue = name.toLowerCase();
    return this.employee.filter((option) =>
      option.name.toLowerCase().includes(filterValue) 
    );
  }

  public displayProperty(value) {
    if (value) {
      return value.categoryName;
    }
  }

  public displayPropertyEmployee(value) {
    if (value) {
      return value.name;
    }
  }



  onNoClick() {
    if (this.expenseId) {
      this.router.navigate(['/billing/manage-expense']);
    } else {
      this.itemList = []
    }
  }

  onSelect(event: any) {
    let data = event.option.value;
    this.addExpenseType.controls["expenseCategory"].setValue(data);
  }

  onSelectEmployee(event: any) {
    let data = event.option.value;
    this.addExpenseType.controls["employee"].setValue(data);
  }



  onRegister() {
    this.addExpenseType.controls["expenseDetails"].setValue(this.itemList);
    if (this.expenseId) {
      this.billingService.editExpenses(this.expenseId, this.addExpenseType.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addExpenseType.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "info"
            },
          );
          this.router.navigate(['/billing/manage-expense']);
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

        }
      })
    } else {
      this.billingService.postExpenses(this.addExpenseType.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addExpenseType.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
          this.router.navigate(['/billing/manage-expense']);
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
        }
      })
    }
  }


}
