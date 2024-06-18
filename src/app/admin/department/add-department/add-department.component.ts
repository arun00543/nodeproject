import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/service/auth.service';
import { UserService } from 'app/core/service/user.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.scss']
})
export class AddDepartmentComponent implements OnInit {

  addDepartment: FormGroup;
  hide = true;
  agree = false;
  departmentId: number
  formValue: any
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  currentUser: any;

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
    this.departmentId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId
  }

  ngOnInit(): void {

    this.addDepartment = this.fb.group({
      id: [],
      departmentName: ['', [Validators.required ]],
      updatedBy: [this.currentUser],
    });

    if (this.departmentId) {
      
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & save";
      this.cancelButton = "Cancel";
      this.userService.getEmployeeDepartmentById(this.departmentId).subscribe((res) => {
        if (res.status === "OK") {
          let data = res.data
          this.addDepartment.controls["id"].setValue(data.id);
          this.addDepartment.controls["departmentName"].setValue(data.departmentName);
        }
  })
  
    } else {
      this.dialogTitle = 'New department';
      this.buttonTitle = "Save";
      this.cancelButton = "Reset";
    }
  }

  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  onNoClick() {
    if (this.departmentId) {
      this.router.navigate(['/admin/manage-department']);
    } else {

    }
  }


  onRegister() {
   
    if (this.departmentId) {
      
      this.userService.editEmployeeDepartment(this.departmentId, this.addDepartment.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addDepartment.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "info"
            },
          );
          
          this.router.navigate(['/admin/manage-department']);
        } else {
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
      this.userService.postEmployeeDepartment(this.addDepartment.value).subscribe((data: any) => {
        if (data.status === "OK") {
          let message;
          this.addDepartment.reset();
          this.notification.showNotification(
            'top',
            'right',
            message = {
              "message": data.message,
              "status": "success"
            },
          );
      
      this.router.navigate(['/admin/manage-department']);
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
