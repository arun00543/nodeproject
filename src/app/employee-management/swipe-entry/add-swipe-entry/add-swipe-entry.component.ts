import { Component, OnInit } from '@angular/core';
import { FormControl, FormControlName, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/service/auth.service';
import { UserService } from 'app/core/service/user.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { Observable, Subscription, map, startWith } from 'rxjs';

export class list {
  swipeDate: string = "";
  tempTime: any;
  swipeTime: any;
  remarks: string;
  swipeType: any;
}
@Component({
  selector: 'app-add-swipe-entry',
  templateUrl: './add-swipe-entry.component.html',
  styleUrls: ['./add-swipe-entry.component.scss']
})
export class AddSwipeEntryComponent implements OnInit {

  addSwipeEntry: FormGroup;
  employeeControl = new FormControl("");
  filteredEmployeeOptions: Observable<any[]>;
  swipeEntryId: number
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  currentUser: any;
  formValue: any;
  employeeData: any;
  swipeType = [
    { key: 'IN', value: "IN" },
    { key: 'OUT', value: "OUT" }
  ];
  today = new Date();
  swipeList: Array<list> = [];
  subscription: Subscription;
  data: any;
  empId: number;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private notification: NotificationsComponent,
    private shared: SharedService,
  ) {
    this.swipeEntryId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId;
  }

  ngOnInit(): void {

    this.addSwipeEntry = this.fb.group({
      id: [],
      employee: ['', [Validators.required]],
      swipeDate: ['', [Validators.required]],
      employeeSwipeEntryDetails: [[]],
      updatedBy: [this.currentUser],
    });

    if (this.swipeEntryId) {
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & save";
      this.cancelButton = "Cancel";
      this.userService.getSwipeEntryById(this.swipeEntryId).subscribe((res) => {
        let data = res.data;

        this.addSwipeEntry.controls["id"].setValue(data.id);
        this.addSwipeEntry.controls["employee"].setValue(data.employee);
        this.employeeControl.setValue(data.employee);
        this.addSwipeEntry.controls['swipeDate'].setValue(data.swipeDate);
        this.addSwipeEntry.controls['employeeSwipeEntryDetails'].setValue(data.employeeSwipeEntryDetails);
        this.swipeList = data.employeeSwipeEntryDetails;
        this.createTempTime();
        this.addSwipeEntry.controls["updatedBy"].setValue(data.updatedBy);

      })
    } else {
      this.dialogTitle = 'New Entry';
      this.buttonTitle = "Save";
      this.cancelButton = "Reset";
    }
  }

  ngAfterViewInit() {
    this.addSwipeEntry.valueChanges.subscribe(() => {
      if (this.addSwipeEntry.valid) {
        this.userService.getSwipeList(this.addSwipeEntry.value.employee.id, this.convert(this.addSwipeEntry.value.swipeDate)).subscribe((response) => {
          let data = response.data[0];
          this.swipeEntryId = data?.id;
          this.swipeList = data ? data.employeeSwipeEntryDetails : [];
          this.createTempTime();
        });
      }
    });
  }

  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  createTempTime() {
    this.swipeList.map(swipe => {
      let t = swipe.swipeTime.split("T")[1]
      swipe.tempTime = t.split(".")[0]
    })
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  addToList() {
    let itemObj = new list();
    let hrs = (new Date().getHours()).toString()
    let min = (new Date().getMinutes()).toString()
    itemObj.swipeDate = this.convert(this.addSwipeEntry.value.swipeDate);
    itemObj.swipeTime = itemObj.swipeDate + 'T' + (hrs.length != 2 ? ('0' + hrs) : hrs) + ':' + (min.length != 2 ? ('0' + min) : min)
    itemObj.tempTime = (hrs.length != 2 ? ('0' + hrs) : hrs) + ':' + (min.length != 2 ? ('0' + min) : min)
    itemObj.remarks = '';
    itemObj.swipeType = this.swipeList.length % 2 != 0 ? 'OUT' : 'IN';
      this.swipeList.push(itemObj);
     let index =  this.swipeList.length-1
     let t = (hrs.length != 2 ? ('0' + hrs) : hrs) + ':' + (min.length != 2 ? ('0' + min) : min)
     this.timeValidation (t,index)
  }

  removeObject(row: any) {
    const index: number = this.swipeList.indexOf(row);
    if (index !== -1) {
      if (row.swipeType != 'IN') {
        this.swipeList.splice(index, -2);
      } else {
        this.swipeList.splice(index, 2);
      }
    }
  }

  sliseAsTime(data) {
    let index = data.indexOf("T")
    let time = data.slice(index + 1)
    time = time.replace(':00.000+00:00', '')
    return time.replace(':', '')
  }

  currentDayValidation(time,index){
    let hrs = (new Date().getHours()).toString()
    let min = (new Date().getMinutes()).toString()
    let currentTime = this.swipeList[index].swipeDate + 'T' + (hrs.length != 2 ? ('0' + hrs) : hrs) + ':' + (min.length != 2 ? ('0' + min) : min)
     if (this.sliseAsTime(time) <= this.sliseAsTime(currentTime)) {
      this.timeValidation(time,index)
      } else {
        this.setTime(currentTime,index);
      }
  }

  onEmployeeControlChange(event: any) {
    if (event.target.value != '') {
      this.userService.getEmployeeByName(event.target.value).subscribe((res : any) => {
        this.filteredEmployeeOptions = res.data;
      });
    } else {
      this.filteredEmployeeOptions = null;
      this.addSwipeEntry.controls["employee"].reset();
        this.employeeControl.reset();
    }
  }

  timeValidation(time,index){
    let t = null
    if (this.swipeList.length > index + 1) {
      if (this.sliseAsTime(time) > this.sliseAsTime(this.swipeList[index+1].swipeTime)) {
        this.swipeList.splice(index+1, this.swipeList.length-(index+1));
      }
    }
    if(index > 0){
      let time1 : any = this.swipeList[index - 1].swipeTime;
      if (this.sliseAsTime(time1) > this.sliseAsTime(time)) {
        t = this.swipeList[index - 1].swipeTime.replace(':00.000+00:00', '')
      } else {
        t = this.swipeList[index].swipeDate + 'T' + time
      }
    } else {
      t = this.swipeList[index].swipeDate + 'T' + time
    }
   this.setTime(t,index);
  }

  setTime(t,index){
    this.swipeList[index].swipeTime = t;
    let i = t.indexOf("T")
    let tempT = t.slice(i + 1)
    this.swipeList[index].tempTime = tempT;
    let id = (<HTMLInputElement>document.getElementById('time'+index))
    if(id){
      id.value = tempT
    }
  }

  editList(event, remark, index) {
    if (event) {
    let time = event?.target?.value
    if (this.swipeList[index].swipeDate === this.convert(new Date())) {
        this.currentDayValidation(time,index)
      } else {
        this.timeValidation(time,index)
      }
    } else {
      this.swipeList[index].remarks = remark;
    }
  }

  convertTo12HourFormat(inputTime): string {
    const timeParts = inputTime.split(":");
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12hr = (hours % 12 || 12).toString();
    return `${hours12hr}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.employeeData.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
  public displayProperty(value) {
    if (value) {
      return value.name;
    }
  }

  onNoClick() {
    if (this.swipeEntryId) {
      this.router.navigate(['/employee/manage-swipe-entry']);
    } else {
      this.addSwipeEntry.reset();
      this.employeeControl.reset();
      this.swipeList = [];
      (<HTMLInputElement>document.getElementById('swipetype')).value = 'IN'
    }
  }

  onSelect(event) {
    let data = event.option.value;
    this.empId = data.id;
    this.addSwipeEntry.controls["employee"].setValue(data);
  }

  onRegister() {
    this.addSwipeEntry.controls['employeeSwipeEntryDetails'].setValue(this.swipeList);
    if (this.swipeEntryId) {
      this.userService.editSwipeEntry(this.swipeEntryId, this.addSwipeEntry.value).subscribe((data: any) => {
        let messages;
        if (data.status === "OK") {
          this.notification.showNotification(
            'top',
            'right',
            messages = {
              "message": data.message,
              "status": "info"
            },
          );
          this.router.navigate(['/employee/manage-swipe-entry']);
        }
        else {
          this.notification.showNotification(
            'top',
            'right',
            messages = {
              "message": data.message,
              "status": "warning"
            },
          );
          this.router.navigate(['/employee/manage-swipe-entry']);
        }
      })
    } else {
      this.addSwipeEntry.controls["employeeSwipeEntryDetails"].setValue(this.swipeList)
      this.userService.postSwipeEntry(this.addSwipeEntry.value).subscribe((data: any) => {
        let message;
        if (data.status === "OK") {
          // this.addSwipeEntry.reset();
          // this.employeeControl.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
          this.router.navigate(['/employee/manage-swipe-entry']);
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

          this.router.navigate(['/employee/manage-swipe-entry']);
        }
      })
    }
  }
}
