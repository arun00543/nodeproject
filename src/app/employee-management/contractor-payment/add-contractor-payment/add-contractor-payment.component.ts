import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { sort } from 'app/core/models/sort';
import { AuthService } from 'app/core/service/auth.service';
import { UserService } from 'app/core/service/user.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-add-contractor-payment',
  templateUrl: './add-contractor-payment.component.html',
  styleUrls: ['./add-contractor-payment.component.scss']
})
export class AddContractorPaymentComponent implements OnInit {

  addContractorPayment: FormGroup;
  contractControl = new FormControl("");
  filteredContractOptions: Observable<any[]>;
  hide = true;
  agree = false;
  contratorPaymentId: number
  formValue: any
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  currentUser: any;
  contractData: any;
  searchTerm: string = "";
  sortEvent: sort = {
    active: "",
    direction: "DESC",
  };
  pageSize: number = 5;
  pageIndex: number = 0;
  paymentBasis = ['Cash','NEFT'];
  today= new Date();

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
    this.contratorPaymentId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId
  }

  ngOnInit(): void {
    
    this.userService.getContract().subscribe((response: any) => {
      this.contractData = response.data;
      this.filteredContractOptions = this.contractControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name
            ? this._filter(name as string)
            : this.contractData.slice();
        })
      );
      
    })

    this.addContractorPayment = this.fb.group({
      id: [],
      contractDetails: ['', [Validators.required]],
      paymentDate: ['', [Validators.required]],
      amountPaid: ['', [Validators.required]],
      amountBalance: [''],
      totalAmount: ['', [Validators.required]],
      paymentBasis: ['', [Validators.required]],
      notes:['',[Validators.required]],
      updatedBy: [this.currentUser],
    });

    if (this.contratorPaymentId) {
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & save";
      this.cancelButton = "Cancel";
      this.userService.getContractorPaymentById(this.contratorPaymentId).subscribe((res) => {
        let data = res.data
        this.addContractorPayment.controls["id"].setValue(data.id);
        this.addContractorPayment.controls["contractDetails"].setValue(data.contractDetails);
        this.contractControl.setValue(data.contractDetails.contractName),
        this.addContractorPayment.controls["amountBalance"].setValue(data.amountBalance);
        this.addContractorPayment.controls["totalAmount"].setValue(data.totalAmount);
        this.addContractorPayment.controls["updatedBy"].setValue(data.updatedBy);
      })
    } else {
      this.dialogTitle = 'New Contract Payment';
      this.buttonTitle = "Save";
      this.cancelButton = "Reset";
    }
  }
  
  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  public displayProperty(value) {
    if (value) {
      return value.contractName;
    }
  }

  onSelect(event: any) {
    let data = event.option.value
    this.addContractorPayment.controls["contractDetails"].setValue(data);
    this.addContractorPayment.controls['totalAmount'].setValue(data.contractAmount)
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.contractData.filter((option) =>
      option.contractName.toLowerCase().includes(filterValue)
    );
  }

  onCancel() {
    if (this.contratorPaymentId) {
      this.router.navigate(['/employee/manage-contractor-payment']);
    } else {
      this.formValue = new UntypedFormControl({});
    }
  }

  onNoClick() {
    if (this.contratorPaymentId) {
      this.router.navigate(['/employee/manage-contractor-payment']);
    } else {
      this.formValue = new UntypedFormControl({});
    }
  }

  onRegister() {
    if (this.contratorPaymentId) {
      this.addContractorPayment.controls["amountBalance"].setValue(this.addContractorPayment.value.totalAmount - this.addContractorPayment.value.amountPaid);
      
      this.userService.editContractorPayment(this.contratorPaymentId, this.addContractorPayment.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addContractorPayment.reset();
          this.contractControl.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "info"
            },
          );
          
          
          this.router.navigate(['/employee/manage-contractor-payment']);
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
      this.addContractorPayment.controls["amountBalance"].setValue(this.addContractorPayment.value.totalAmount - this.addContractorPayment.value.amountPaid);
      this.userService.postContractorPayment(this.addContractorPayment.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addContractorPayment.reset();
          this.contractControl.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
          
          this.router.navigate(['/employee/manage-contractor-payment']);
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

