import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgModel, UntypedFormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'app/core/service/auth.service';
import { UserService } from 'app/core/service/user.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { ConfirmationDialogComponent } from 'app/additional-components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  stateControl = new FormControl("");
  cityControl = new FormControl('');
  countryControl = new FormControl('');
  updateProfile: FormGroup;
  userId: number;
  userDetail: any;
  detectChange: boolean = false;
  name: any;
  state: any;
  country: any;
  city: any;
  data: any;
  filteredStateOptions: Observable<any[]>;
  filteredCountryOptions: Observable<any[]>;
  filteredCityOptions: Observable<any[]>;

  constructor(
    private fb: UntypedFormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private notification: NotificationsComponent,
    public dialog: MatDialog,
  ) {
    this.userId = authService.currentUserValue.userId
  }

  ngOnInit() {
    this.getData();
    this.updateProfile = this.fb.group({
      user: [this.userId],
      changeUserName: [""],
      name: ["", [Validators.required]],
      email: ["", [Validators.email, Validators.minLength(5)]],
      phoneNumber: ["", [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      organization: ["", [Validators.required]],
      addressLine1: ['', [Validators.required]],
      addressLine2: ['', [Validators.required]],
      city: ['', [Validators.required]],
      pincode: ['', [Validators.required]],
      userName: ['', [Validators.required]],
    });
  }
  getData() {
    this.userService.getUserByCustonerUserId(this.userId).subscribe((res) => {
      (res)
      let data = res.data;
      this.userDetail = data;
      this.updateProfile.controls["user"].setValue(data.user);
      this.updateProfile.controls["userName"].setValue(data.phoneNumber);
      this.updateProfile.controls["name"].setValue(data.name);
      // this.updateProfile.controls["changeUserName"].setValue(data.changeUserNamename);
      this.updateProfile.controls["email"].setValue(data.email);
      this.updateProfile.controls["phoneNumber"].setValue(data.phoneNumber);
      this.updateProfile.controls["organization"].setValue(data.organization);
      this.updateProfile.controls["addressLine2"].setValue(data.addressLine2);
      this.updateProfile.controls["addressLine1"].setValue(data.addressLine1);
      this.onSelectCountry(data.city.state.country)
      this.onSelectState(data.city.state)
      this.cityControl.setValue(data.city);
      this.stateControl.setValue(data.city.state);
      this.countryControl.setValue(data.city.state.country);
      this.updateProfile.controls["city"].setValue(data.city);
      this.updateProfile.controls["pincode"].setValue(data.pincode);
      this.detectChange = false;
    });
    this.userService.getAllCountry().subscribe((response: any) => {
      this.country = response.data;
      this.filteredCountryOptions = this.countryControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name ? this._filter1(name as string) : this.country?.slice();
        })
      );
    });
    
  }

  ngAfterViewInit() {
    this.updateProfile.valueChanges.subscribe(() => {
      this.detectChange = true;
    });
  }
  onSelectCountry(data: any) {
    this.stateControl.reset();
    this.cityControl.reset();
    this.city = null
    this.filteredCityOptions = null
    this.updateProfile.controls["city"].setValue('');
    this.userService.getStateById(data.id).subscribe((response) => {
      this.state = response.data;
      this.filteredStateOptions = this.stateControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name ? this._filter2(name as string) : this.state?.slice();
        })
      );
    })
  }
  onSelectState(data: any) {
    this.cityControl.reset();
    this.updateProfile.controls["city"].setValue('');
    this.userService.getCityById(data.id).subscribe((response) => {
      this.city = response.data;
      this.filteredCityOptions = this.cityControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name ? this._filter3(name as string) : this.city?.slice();
        })
      );
    })
  }
  onSelectCity(data: any) {
    this.updateProfile.controls["city"].setValue(data);
  }

  private _filter1(name: string): any {
    const filterValue = name.toLowerCase();
    return this.country?.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
  private _filter2(name: string): any {
    const filterValue = name.toLowerCase();
    return this.state?.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
  private _filter3(name: string): any {
    const filterValue = name.toLowerCase();
    return this.city?.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
  public displayProperty(value) {
    if (value) {
      return value.name;
    }
  }
  checkValue(data) {
    if (!data) {
      this.updateProfile.controls["phoneNumber"].setValue(this.updateProfile.value.userName);
    }
  }

  updateCall() {
    if (this.updateProfile.value.changeUserName) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          message: "After updating user name you should login again",
          id: ""
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.update();
        } else {
          this.getData();
        }
      })
    } else {
      this.update();
    }
  }

  update() {
    this.userService
      .updateCustomer(this.userId, this.updateProfile.value)
      .subscribe((res: any) => {
        this.userDetail = res.data;
        let message;
        if (res.status === "OK") {
          if (this.updateProfile.value.changeUserName) {
            this.authService.logout();
          } else {
            this.notification.showNotification(
              'top',
              'center',
              message = {
                "message": res.message,
                "status": "success"
              },
            )
            this.detectChange = false;
            this.getData();
          }
        } else {
          this.notification.showNotification(
            'top',
            'center',
            message = {
              "message": res.message,
              "status": "warning"
            },
          )
          this.detectChange = false;
        }
      })
  }

}
