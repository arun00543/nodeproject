import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/service/auth.service';
import { CrmService } from 'app/core/service/crm/crm.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { noImg } from "app/inventory-management/noImg";
import { MatChipInputEvent } from '@angular/material/chips';
import { InventoryService } from 'app/core/service/inventory/inventory.service';
import { map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-add-lead-generation',
  templateUrl: './add-lead-generation.component.html',
  styleUrls: ['./add-lead-generation.component.scss']
})
export class AddLeadGenerationComponent implements OnInit {

  addLeadGeneration: FormGroup;
  hide = true;
  agree = false;
  LeadGenerationId: number
  formValue: any
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  currentUser: any;
  isSampleProvided: any;
  referenceImage: string;
  selectedFile: any = null;
  otherReferralSourceType: string;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  referralSourceType = ["LINKEDIN", "FACEBOOK", "ADVERTISEMENT", "OTHERS"];
  status = ["Replied",
    "Opportunity",
    "Quotation",
    "LostQuotation",
    "Interested",
    "Converted",
    "DoNotContact"];
  seletedInrestedField: Array<any> = [];
  itemName: any;
  filteredEmployeeOptions: any;
  ReferralControl = new FormControl("");
  items: any;
  currentDate: Date;




  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private crmService: CrmService,
    private invetoryService: InventoryService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private spinner: NgxSpinnerService,
  ) {
    this.LeadGenerationId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId;
    this.isSampleProvided = true;
    this.currentDate = new Date;
  }

  ngOnInit(): void {

    this.addLeadGeneration = this.fb.group({
      id: [],
      name: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.minLength(5)]],
      phone: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      location: ['', [Validators.required]],
      intrestedIn: ['', [Validators.required]],
      referralSourceType: ['', [Validators.required]],
      referralName: ['', [Validators.required]],
      referralPhone: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      noOfFollowups: ['', [Validators.required]],
      followupDate: ['', [Validators.required]],
      referenceImageString: [''],
      notes: [''],
      status: ['', [Validators.required]],
      isSampleProvided: [this.isSampleProvided],
      updatedBy: [this.currentUser],
    });

    if (this.LeadGenerationId) {
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & Save";
      this.cancelButton = "Cancel";
      this.crmService.getLeadGenerationById(this.LeadGenerationId).subscribe((res) => {
        let data = res.data
        this.addLeadGeneration.controls["id"].setValue(data.id);
        this.addLeadGeneration.controls["name"].setValue(data.name);
        this.addLeadGeneration.controls["email"].setValue(data.email);
        this.addLeadGeneration.controls["phone"].setValue(data.phone);
        this.addLeadGeneration.controls["location"].setValue(data.location);
        this.addLeadGeneration.controls["intrestedIn"].setValue(data.intrestedIn);
        for (let items of data.intrestedIn) {
          this.seletedInrestedField.push(items);
        }
        this.addLeadGeneration.controls["referralName"].setValue(data.referralName);
        this.addLeadGeneration.controls["referralPhone"].setValue(data.referralPhone);
        this.addLeadGeneration.controls["noOfFollowups"].setValue(data.noOfFollowups);
        this.addLeadGeneration.controls["followupDate"].setValue(data.followupDate);
        if (data.referenceImageString) {
          this.addLeadGeneration.controls["referenceImageString"].setValue(data.referenceImageString);
        } else {
          this.referenceImage = noImg
        }
        this.addLeadGeneration.controls["notes"].setValue(data.notes);
        this.addLeadGeneration.controls["status"].setValue(data.status);
        this.addLeadGeneration.controls["isSampleProvided"].setValue(data.isSampleProvided);
        this.addLeadGeneration.controls["updatedBy"].setValue(data.updatedBy);
        for (let type of this.referralSourceType) {
          if (type === data.referralSourceType) {
            this.addLeadGeneration.controls["referralSourceType"].setValue(data.referralSourceType);
            return;
          }
          this.addLeadGeneration.controls["referralSourceType"].setValue('OTHERS');
          this.otherReferralSourceType = data.referralSourceType
        }
      })
    } else {
      this.dialogTitle = 'New Lead Generation';
      this.buttonTitle = "Save";
      this.cancelButton = "Reset";
    }

    this.invetoryService.getItems().subscribe((response: any) => {
      this.items = response.data;
      this.filteredEmployeeOptions = this.ReferralControl.valueChanges.pipe(
        startWith(""),
        map((value: any) => {
          const name = typeof value === "string" ? value : value?.name;
          return name
            ? this._filter1(name as string)
            : this.items.slice();
        })
      );
    })
  }

  ngOnDestroy() {
    this.shared.toEdit = null;
  }
  private _filter1(name: string): any {
    const filterValue = name.toLowerCase();
    return this.items.filter((option) =>
      option.itemName.toLowerCase().includes(filterValue)
    );
  }

  remove(items: string): void {
    const index = this.seletedInrestedField.indexOf(items);
    if (index >= 0) {
      this.seletedInrestedField.splice(index, 1);
    }
    this.addLeadGeneration.controls["intrestedIn"].setValue(this.seletedInrestedField);
  }


  onSelect(event: MatAutocompleteSelectedEvent): void {
    if (this.seletedInrestedField.length != 0) {
      for (let item of this.seletedInrestedField) {
        if (item.id === event.option.value.id) {
          return
        }
      }
      this.seletedInrestedField.push(event.option.value);
    } else {
      this.seletedInrestedField.push(event.option.value);
    }
    this.addLeadGeneration.controls["intrestedIn"].setValue(this.seletedInrestedField);
    this.ReferralControl.reset();
  }

  onNoClick() {
    if (this.LeadGenerationId) {
      this.router.navigate(['/crm/manage-lead-generation']);
    } else {
      this.addLeadGeneration.reset();
      this.seletedInrestedField = [];
    }
  }

  onFileSelected(event: any): void {
    if (event.target.files[0]?.size > 2000 * 1024) {
      alert('The file size should Not be more then 2MB');
    } else {
      this.selectedFile = event.target.files[0] ?? null;
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        let file = reader.result
        this.addLeadGeneration.controls["referenceImageString"].setValue(file);
      };
    }
  }

  onRegister() {

    if (this.addLeadGeneration.value.referralSourceType === 'OTHERS') {
      this.addLeadGeneration.controls["referralSourceType"].setValue(this.otherReferralSourceType);
    }


    if (this.LeadGenerationId) {

      this.crmService.editLeadGeneration(this.LeadGenerationId, this.addLeadGeneration.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addLeadGeneration.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "info"
            },
          );


          this.router.navigate(['/crm/manage-lead-generation']);
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
      this.crmService.postLeadGeneration(this.addLeadGeneration.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addLeadGeneration.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "success"
            },
          );

          this.router.navigate(['/crm/manage-lead-generation']);
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




