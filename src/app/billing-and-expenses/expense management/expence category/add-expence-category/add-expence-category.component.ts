import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute ,Router} from '@angular/router';
import { AuthService } from 'app/core/service/auth.service';
import { BillingService } from 'app/core/service/billing/billing.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';

@Component({
  selector: 'app-add-expence-category',
  templateUrl: './add-expence-category.component.html',
  styleUrls: ['./add-expence-category.component.scss']
})
export class AddExpenceCategoryComponent implements OnInit {
dialogTitle: any;
addExpenceCategory: FormGroup;
  expenseCategoryId: number;
  currentUser: any;
buttonTitle: any;
  userRole: any;
  cancelButton:string;


  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private billingService: BillingService,
  ) {
    this.expenseCategoryId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId
   }

   ngOnInit(): void {

    this.billingService.getExpensesCategory().subscribe((response: any) => {
      ;
      this.userRole = response.data;
    })

    this.addExpenceCategory = this.fb.group({
      id: [],
      // userRoleId:['', [Validators.required]],
      categoryName: ['', [Validators.required]],
      updatedBy: [this.currentUser],
    });


    if (this.expenseCategoryId) {
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & save";
      this.cancelButton = "Cancel"
      this.billingService.getExpensesCategoryById(this.expenseCategoryId).subscribe((res) => {
        if (res.status === "OK") {
          let data = res.data
          this.addExpenceCategory.controls["id"].setValue(data.id);
          this.addExpenceCategory.controls["categoryName"].setValue(data.categoryName);
          this.addExpenceCategory.controls["updatedBy"].setValue(data.updatedBy);

        }
      })

    } else {
      this.dialogTitle = 'New Expense Category';
      this.buttonTitle = "Save"
      this.cancelButton = "Reset"
    }

  }
  
  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  onNoClick() {
    if (this.expenseCategoryId) {
      this.router.navigate(['/billing/manage-expense-category']);
    } else {

    }
  }


  onRegister() {

    if (this.expenseCategoryId) {
      this.billingService.editExpensesCategory(this.expenseCategoryId, this.addExpenceCategory.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addExpenceCategory.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "info"
            },
          );
          this.router.navigate(['/billing/manage-expense-category']);
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
      this.billingService.postExpensesCategory(this.addExpenceCategory.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addExpenceCategory.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
          this.router.navigate(['/billing/manage-expense-category']);
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
