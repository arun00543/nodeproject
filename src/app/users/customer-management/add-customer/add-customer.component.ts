import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "app/core/service/auth.service";
import { UserService } from "app/core/service/user.service";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component"; import { SharedService } from 'app/shared/shared.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, map, startWith } from "rxjs";
import { response } from "express";

@Component({
  selector: "app-add-customer",
  templateUrl: "./add-customer.component.html",
  styleUrls: ["./add-customer.component.scss"],
})
export class AddCustomerComponent implements OnInit {
  addCustomer: FormGroup;
  userId: number;
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  stateControl = new FormControl("");
  cityControl = new FormControl('');
  countryControl = new FormControl('');
  name: any;
  state:any;
  country :any;
  city :any;
  data:any;
  filteredStateOptions: Observable<any[]>;
  filteredCountryOptions: Observable<any[]>;
  filteredCityOptions: Observable<any[]>;
  currentUser: any;
  customerType=['TEMPORARY','PERMANENT'];


  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private notification: NotificationsComponent,
    private shared: SharedService,
  ) {
    this.userId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId;
  }

  ngOnInit(): void {
    this.addCustomer = this.fb.group({
      id: [],
      name: ["", [Validators.required]],
      email: ["", [Validators.email, Validators.minLength(5)]],
      phoneNumber: ["", [Validators.required]],
      organization: ["", [Validators.required]],
      addressLine1: ['', [Validators.required]],
      addressLine2: ['', [Validators.required]],
      city: ['', [Validators.required]],
      pincode: ['', [Validators.required]],
      customerType: ['', [Validators.required]],
      followUpDays: ['', [Validators.required]],
      gstNo: ["", [Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"), Validators.maxLength(15)]],
      panNo: ["", [Validators.pattern("^([A-Z]){5}([0-9]){4}([A-Z]){1}$")]],
      updatedBy: [this.currentUser],
    });
    if (this.userId) {
      this.dialogTitle = "Edit";
      this.buttonTitle = "Edit & save";
      this.cancelButton = "Cancel";
      let data;
      this.userService.getCustomerById(this.userId).subscribe((res) => {
        data = res.data;
        this.addCustomer.controls["id"].setValue(data.id);
        this.addCustomer.controls["name"].setValue(data.name);
        this.addCustomer.controls["email"].setValue(data.email);
        this.addCustomer.controls["customerType"].setValue(data.customerType);
        this.addCustomer.controls["followUpDays"].setValue(data.followUpDays);
        this.addCustomer.controls["phoneNumber"].setValue(data.phoneNumber);
        this.addCustomer.controls["organization"].setValue(data.organization);
        this.addCustomer.controls["addressLine1"].setValue(data.addressLine1);
        this.addCustomer.controls["addressLine2"].setValue(data.addressLine2);
        this.addCustomer.controls["gstNo"].setValue(data.gstNo);
        this.addCustomer.controls["panNo"].setValue(data.panNo);
          this.onSelectCountry(data.city.state.country)
          this.onSelectState(data.city.state)
          this.cityControl.setValue(data.city);
          this.stateControl.setValue(data.city.state);
          this.countryControl.setValue(data.city.state.country);
        this.addCustomer.controls["city"].setValue(data.city);
        this.addCustomer.controls["pincode"].setValue(data.pincode);
      });
    } else {
      this.dialogTitle = "New Customer";
      this.buttonTitle = "Save";
      this.cancelButton = "Reset"
    }
    this.userService.getAllCountry().subscribe((response: any) => {
      this.country = response.data;
      this.filteredCountryOptions = this.countryControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name ? this._filter1(name as string) : this.country.slice();
        })
      );
    });
  }

  onPanInput(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  const cursorStart = inputElement.selectionStart;
  const cursorEnd = inputElement.selectionEnd;

  const newValue = inputElement.value.toUpperCase();

  this.addCustomer.patchValue({ panNo: newValue }, { emitEvent: false });

  // Restore the cursor position
  inputElement.setSelectionRange(cursorStart, cursorEnd);
}

onGstInput(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  const cursorStart = inputElement.selectionStart;
  const cursorEnd = inputElement.selectionEnd;

  const newValue = inputElement.value.toUpperCase();

  this.addCustomer.patchValue({ gstNo: newValue }, { emitEvent: false });

  // Restore the cursor position
  inputElement.setSelectionRange(cursorStart, cursorEnd);
}
private _filter(name: string): any {
  const filterValue = name.toLowerCase();
  return this.name.filter((option) =>
    option.name.toLowerCase().includes(filterValue)
  );
}
private _filter1(name: string): any {
  const filterValue = name.toLowerCase();
  return this.country.filter((option) =>
    option.name.toLowerCase().includes(filterValue)
  );
}
private _filter2(name: string): any {
  const filterValue = name.toLowerCase();
  return this.state.filter((option) =>
    option.name.toLowerCase().includes(filterValue)
  );
}
private _filter3(name: string): any {
  const filterValue = name.toLowerCase();
  return this.city.filter((option) =>
    option.name.toLowerCase().includes(filterValue)
  );
}
public displayProperty(value) {
  if (value) {
    return value.name;
  }
}

onSelectCountry(data:any){
  this.stateControl.reset();
  this.cityControl.reset();
  this.city = null
  this.filteredCityOptions = null
  this.addCustomer.controls["city"].setValue('');
   this.userService.getStateById(data.id).subscribe((response) => {
    this.state = response.data;
    this.filteredStateOptions = this.stateControl.valueChanges.pipe(
      startWith(""),
      map((value: any) => {
        const name = typeof value === "string" ? value : value?.name;
        return name ? this._filter2(name as string) : this.state.slice();
      })
    );
   })
}
onSelectState(data:any){
  this.cityControl.reset();
  this.addCustomer.controls["city"].setValue('');
  this.userService.getCityById(data.id).subscribe((response) => {
    this.city = response.data;
    this.filteredCityOptions = this.cityControl.valueChanges.pipe(
      startWith(""),
      map((value: any) => {
        const name = typeof value === "string" ? value : value?.name;
        return name ? this._filter3(name as string) : this.city.slice();
      })
    );
  })
}
onSelectCity(data:any){
  this.addCustomer.controls["city"].setValue(data);
}


  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  onNoClick() {
    if (this.userId) {
      this.router.navigate(["/user/manage-customer"]);
    }
  }

  onRegister() {
    if (this.userId) {
      this.userService
        .editCustomer(this.userId, this.addCustomer.value)
        .subscribe((data: any) => {
            let message;
            if (data.status === "OK") {
            this.addCustomer.reset();
            this.notification.showNotification(
              'top',
              'right',
              message = {
                "message": data.message,
                "status": "info"
              },
            );
            if (data.status === "OK") {
              this.router.navigate(["/user/manage-customer"]);
            }
          }
          else {
            this.notification.showNotification(
              'top',
              'right',
              message = {
                "message": data.message,
                "status": "warning"
              },
            );
          }
        });
    } else {
      this.userService
        .postCustomer(this.addCustomer.value)
        .subscribe((data: any) => {
            let message;
            if (data.status === "OK") {
            this.addCustomer.reset();
            this.notification.showNotification(
              'top',
              'right',
              message = {
                "message": data.message,
                "status": "success"
              },
            );
            this.router.navigate(["/user/manage-customer"]);
          }
          else {
            this.notification.showNotification(
              'top',
              'right',
              message = {
                "message": data.message,
                "status": "warning"
              },
            );
          }
        });
    }
  }
}
