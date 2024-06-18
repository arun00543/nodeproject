import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { DatepickerDropdownPositionX, MatDatepicker } from '@angular/material/datepicker';
import { ActivatedRoute,Router } from '@angular/router';
import { AuthService } from 'app/core/service/auth.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
// import { Router } from 'express';
import { VehicleService } from 'app/core/service/vehicle/vehicle.service';
import { Observable, map, startWith } from 'rxjs';


@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss']
})
export class AddVehicleComponent implements OnInit {
  addVehicle: FormGroup;
  hide = true;
  agree = false;
  vehicleId: number;
  vehicleType: any;
  vehicleNumber: string;
  vehicleMake: string;
  vehicleModel: string;
  purchaseDate: DatepickerDropdownPositionX;
  purchasePrice: 0;
  updatedBy: string;
  dialogTitle: string;
  buttonTitle: string;
  cancelButton:string;
  formValue: any;
  currentUser: any;
  today = new Date();
  filteredVehicleOptions: Observable<any>;
  vehicleControl= new FormControl("");
  isKeyPressedNumeric: any;
  input: any;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private vehicleService:VehicleService,
  ) { 
    this.vehicleId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId
  }

  onVehicleNo(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const cursorStart = inputElement.selectionStart;
    const cursorEnd = inputElement.selectionEnd;
    const newValue = inputElement.value.toUpperCase();
    this.addVehicle.patchValue({ vehicleRegistrationNumber: newValue }, { emitEvent: false });
    inputElement.setSelectionRange(cursorStart, cursorEnd);
  }
  onVehicleModel(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const cursorStart = inputElement.selectionStart;
    const cursorEnd = inputElement.selectionEnd;
    const newValue = inputElement.value.toUpperCase();
    this.addVehicle.patchValue({ vehicleModel: newValue }, { emitEvent: false });
    inputElement.setSelectionRange(cursorStart, cursorEnd);
  }
  onVehicleChase(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const cursorStart = inputElement.selectionStart;
    const cursorEnd = inputElement.selectionEnd;
    const newValue = inputElement.value.toUpperCase();
    this.addVehicle.patchValue({ chassisNumber: newValue }, { emitEvent: false });
    inputElement.setSelectionRange(cursorStart, cursorEnd);
  }
  onVehicleRc(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const cursorStart = inputElement.selectionStart;
    const cursorEnd = inputElement.selectionEnd;
    const newValue = inputElement.value.toUpperCase();
    this.addVehicle.patchValue({ rcNumber: newValue }, { emitEvent: false });
    inputElement.setSelectionRange(cursorStart, cursorEnd);
  }

  ngOnInit(): void {
    this.addVehicle = this.fb.group({
      id: [],
      vehicleType: ['', [Validators.required]],
      vehicleRegistrationNumber: ['', [Validators.required, Validators.pattern("^[A-Z]{2}[0-9]{1,2}([A-Z])?(?:[A-Z]*)[0-9]{4}$")]],
      vehicleMake: ['', [Validators.required]],
      vehicleModel: ['', [Validators.required]],
      chassisNumber: ['',[Validators.required, Validators.pattern("^[A-HJ-NPR-Z\\d]{8}[\\dX][A-HJ-NPR-Za-hj-npr-z\\d]{2}\\d{6}$")]],
      rcNumber: ['',[Validators.required, Validators.pattern("^[A-Z]{2}[0-9]{1,2}([A-Z])?(?:[A-Z]*)[0-9]{4}$")]],
      insuranceCompanyName: ['',[Validators.required]],
      policyNo: ['',[Validators.required]],
      insuranceStartDate: ['',[Validators.required]],
      insuranceEndDate: ['',[Validators.required]],
      fastTag: ['',[Validators.required]],
      purchaseDate: ['', [Validators.required]],
      purchasePrice: ['', [Validators.required]],
       updatedBy: [this.currentUser],
    });

    if (this.vehicleId) {
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & Save";
      this.cancelButton="Cancel";
      this.vehicleService.getVehicleById(this.vehicleId).subscribe((res) => {
        let data = res.data
        this.addVehicle.controls["id"].setValue(data.id);
        this.addVehicle.controls["vehicleType"].setValue(data.vehicleType);
        this.vehicleControl.setValue(data.vehicleType), 
        this.addVehicle.controls["vehicleRegistrationNumber"].setValue(data.vehicleRegistrationNumber);
        this.addVehicle.controls["vehicleMake"].setValue(data.vehicleMake);
        this.addVehicle.controls["vehicleModel"].setValue(data.vehicleModel);
        this.addVehicle.controls["purchaseDate"].setValue(data.purchaseDate);
        this.addVehicle.controls["purchasePrice"].setValue(data.purchasePrice);
        this.addVehicle.controls["chassisNumber"].setValue(data.chassisNumber);
        this.addVehicle.controls["rcNumber"].setValue(data.rcNumber);
        this.addVehicle.controls["insuranceCompanyName"].setValue(data.insuranceCompanyName);
        this.addVehicle.controls["policyNo"].setValue(data.policyNo);
        this.addVehicle.controls["insuranceStartDate"].setValue(data.insuranceStartDate);
        this.addVehicle.controls["insuranceEndDate"].setValue(data.insuranceEndDate);
        this.addVehicle.controls["fastTag"].setValue(data.fastTag);
      })
    } else {
      this.dialogTitle = 'New Vehicle';
      this.buttonTitle = "Save";
      this.cancelButton ="Reset";
    }
    this.vehicleService.getVehicleType().subscribe((response: any) => {
      this.vehicleType = response.data;
      this.filteredVehicleOptions = this.vehicleControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name ? this._filter(name as string) : this.vehicleType.slice();
        })
      );
    });
  }

  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.vehicleType.filter((option) =>
      option.vehicleTypeName.toLowerCase().includes(filterValue)
    );
  }

  public displayPropertyVehicleType(value) {
    if (value) {
      return value.vehicleTypeName;
    }
  }



  onCancel() {
    if (this.vehicleId) {
      this.router.navigate(['/vehicle/manage-vehicle']);
    } else {
      this.formValue = new UntypedFormControl({});
    }
  }

  onNoClick() {
    if (this.vehicleId) {
      this.router.navigate(['/vehicle/manage-vehicle']);
    } else {
      this.formValue = new UntypedFormControl({});
    }
  }


  onSelect(event: any) {
    let data = event.option.value;
    this.addVehicle.controls["vehicleType"].setValue(data);
  }

  onRegister() {

    if (this.vehicleId) {
      this.vehicleService.editVehicle(this.vehicleId, this.addVehicle.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addVehicle.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "info"
            },
          );
          this.router.navigate(['/vehicle/manage-vehicle']);
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
      this.vehicleService.postVehicle(this.addVehicle.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addVehicle.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
          this.router.navigate(['/vehicle/manage-vehicle']);
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
