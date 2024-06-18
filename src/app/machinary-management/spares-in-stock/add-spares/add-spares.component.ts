import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormControl, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/service/auth.service';
import { MachineryService } from 'app/core/service/machinery/machinery.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { Validators } from 'ngx-editor';
import { Location } from '@angular/common';
export class list {
  spareItemName: any;
  description: string;
  estimatedDate : any;
  spareReturns: string = null;
  serviceReturnDate: any = null;
}

@Component({
  selector: 'app-add-spares',
  templateUrl: './add-spares.component.html',
  styleUrls: ['./add-spares.component.scss']
})
export class AddSparesComponent implements OnInit {

  addSpareItems: FormGroup;
  hide = true;
  agree = false;
  sparesId: number;
  updatedBy: string;
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  formValue: UntypedFormControl;
  currentUser: any;
  status = ["PENDING", "RECEIVED", "PARTIAL"];
  returnStatus = ["RETURNABLE", "NON_RETURNABLE"];
  // items: any;
  itemList: Array<list> = [];
  total = 0;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private location : Location,
    private machineryService: MachineryService,
  ) {
    this.sparesId = shared.toEdit;
    if(!this.sparesId){
      this.sparesId = shared.generalNotification?.machinerySpareId;
    }
    this.currentUser = authService.currentUserValue.userId
  }

  ngOnInit(): void {
    this.addSpareItems = this.fb.group({
      id: [],
      serviceGivenDate: [],
      technicianName: [],
      machinerySpareDetails:[],
      remarks: [''],
      status: ['', [Validators.required]],
      updatedBy: [this.currentUser],
    });

    if (this.sparesId) {
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & Save";
      this.cancelButton = "Cancel";
      this.machineryService.getSparesById(this.sparesId).subscribe((res) => {
        let data = res.data
        this.addSpareItems.controls["id"].setValue(data.id);
        this.addSpareItems.controls['technicianName'].setValue(data.technicianName);
        this.addSpareItems.controls['machinerySpareDetails'].setValue(data.machinerySpareDetails);
        this.itemList = data.machinerySpareDetails;
        this.addSpareItems.controls["serviceGivenDate"].setValue(data.serviceGivenDate);
        this.addSpareItems.controls["status"].setValue(data.status);
        this.addSpareItems.controls["remarks"].setValue(data.remarks);
      })
    } else {
      this.dialogTitle = 'New Spares';
      this.buttonTitle = "Save";
      this.cancelButton = "Reset";
    }
  }

  ngOnDestroy() {
    this.shared.toEdit = null;
    this.shared.generalNotification = null;
  }

  back(){
    this.location.back();
  }

  addToList(spareItemName, description, estimatedDate) {
    let itemObj = new list();
    itemObj.spareItemName = spareItemName;
    itemObj.description = description;
    itemObj.estimatedDate = estimatedDate;
    itemObj.spareReturns = "RETURNABLE";
    itemObj.serviceReturnDate = null;
    this.itemList.push(itemObj);
    // this.conditionalReset();
  }

  onChangeInputDate(event, index) {
    this.itemList[index].serviceReturnDate = event.target.value
  }

  onChangeInputStatus(event, index) {
    this.itemList[index].spareReturns = event.target.value
  }

  removeObject(row: any) {
    const index: number = this.itemList.indexOf(row);
    if (index !== -1) {
      this.itemList.splice(index, 1);
    }
  }

  // conditionalReset() {
  //   this.spareItemName = ''
  //   this.description = ''
  //  }

  onCancel() {
    if (this.sparesId) {
      this.back();
    } else {
      this.formValue = new UntypedFormControl({});
    }
  }

  onNoClick() {
    if (this.sparesId) {
      this.back();
    } else {
      this.formValue = new UntypedFormControl({});
      this.itemList = []
    }
  }

  onRegister() {
    this.addSpareItems.controls['machinerySpareDetails'].setValue(this.itemList);
    if (this.sparesId) {
      this.machineryService.editSpares(this.sparesId, this.addSpareItems.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addSpareItems.reset();
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
            },
          );
        }
      })
    } else {
      this.addSpareItems.controls["status"].setValue('PENDING');
      this.machineryService.postSpares(this.addSpareItems.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addSpareItems.reset();
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
            },
          );
        }
      })

    }
  }
}
