import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
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


  updateProfile: FormGroup;
  userId: number;
  userRole: string;
  userDetail: any;
  detectChange: boolean = false;
  stateControl = new FormControl("");
  cityControl = new FormControl('');
  countryControl = new FormControl('');
  state: any;
  name:any;
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
    this.userRole = authService.currentUserValue.role
  }

  ngOnInit() {
    this.getData();
    this.updateProfile = this.fb.group({
      user: [this.userId],
      name: ["", [Validators.required]],
      changeUserName:[""],
      email: ["", [Validators.email, Validators.minLength(5)]],
      phoneNumber: ["", [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      dateOfBirth: ["", [Validators.required]],
      aadhaarNumber: ["", [Validators.required,Validators.pattern(
        "[0-9]{12}"
      )]],
      esiNumber: ["", [Validators.pattern(
        "[0-9]{17}"
      )]],
      panNumber: ["",[Validators.pattern("^([A-Z]){5}([0-9]){4}([A-Z]){1}$")]],
      pfNumber: ["", 
      [Validators.pattern("^[A-Z]{2}[A-Z]{3}[0-9]{7}[0-9]{3}[0-9]{7}$"),]
    ],
      uanNumber: [""],
      addressLine1: ['', [Validators.required]],
      addressLine2: ['', [Validators.required]],
      city: ['', [Validators.required]],
      pincode: ['', [Validators.required]],
      userName: ['', [Validators.required]],
    });
  }

  getData() {
    this.userService.getUserByEmployeeUserId(this.userId).subscribe((res) => {
      let data = res.data;
      this.userDetail = data;
      this.updateProfile.controls["user"].setValue(data.user);
      this.updateProfile.controls["name"].setValue(data.name);
      this.updateProfile.controls["email"].setValue(data.email);
      this.updateProfile.controls["phoneNumber"].setValue(data.phoneNumber);
      // this.updateProfile.controls['changeUserName'].setValue(data.changeUserName);
      this.updateProfile.controls["dateOfBirth"].setValue(data.dateOfBirth);
      this.updateProfile.controls["aadhaarNumber"].setValue(data.aadhaarNumber);
      this.updateProfile.controls["panNumber"].setValue(data.panNumber);
      this.updateProfile.controls["pfNumber"].setValue(data.pfNumber);
      this.updateProfile.controls["esiNumber"].setValue(data.esiNumber);
      this.updateProfile.controls["uanNumber"].setValue(data.uanNumber);
      this.updateProfile.controls["userName"].setValue(data.phoneNumber);
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
    })

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

  checkValue(data){
   if(!data){
          this.updateProfile.controls["phoneNumber"].setValue(this.updateProfile.value.userName);
        }
  }

  esiNumbers = ''
  regexTest() {
    const regex = /^\d{0,17}$/;
    if (regex.test(this.updateProfile.value.esiNumber)) {
      this.esiNumbers = this.updateProfile.value.esiNumber;
    }
    this.updateProfile.controls["esiNumber"].setValue(this.esiNumbers);

  }

  onPanInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const cursorStart = inputElement.selectionStart;
    const cursorEnd = inputElement.selectionEnd;
  
    const newValue = inputElement.value.toUpperCase();
  
    this.updateProfile.patchValue({ panNumber: newValue }, { emitEvent: false });
  
    // Restore the cursor position
    inputElement.setSelectionRange(cursorStart, cursorEnd);
  }
  
  onPfInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const cursorStart = inputElement.selectionStart;
    const cursorEnd = inputElement.selectionEnd;
  
    const newValue = inputElement.value.toUpperCase();
  
    this.updateProfile.patchValue({ pfNumber: newValue }, { emitEvent: false });
  
    // Restore the cursor position
    inputElement.setSelectionRange(cursorStart, cursorEnd);
  }

  updateCall() {
    if(this.updateProfile.value.changeUserName){
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          message : "After updating user name you should login again",
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

  update(){
    this.userService
    .updateEmployee(this.userId, this.updateProfile.value)
    .subscribe((res: any) => {
      this.userDetail = res.data;
        let message;
        if (res.status === "OK") {
      if(this.updateProfile.value.changeUserName){
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
