import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/service/auth.service';
import { CrmService } from 'app/core/service/crm/crm.service';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, map, startWith } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-lead-followup',
  templateUrl: './add-lead-followup.component.html',
  styleUrls: ['./add-lead-followup.component.scss']
})
export class AddLeadFollowupComponent implements OnInit {

  addLeadFollowup: FormGroup;
  leadGenerationControl = new FormControl("");
  LeadFollowupId: number
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  today=new Date();
  currentUser: any;
  data: any;
  status = ["Replied","Opportunity","Quotation","LostQuotation","Interested","Converted","DoNotContact"];


  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private crmService: CrmService,
    private notification: NotificationsComponent,
    private location : Location,
    private shared: SharedService,
  ) {
    this.LeadFollowupId = shared.toEdit;
    if(!this.LeadFollowupId){
      this.LeadFollowupId = shared.generalNotification?.id;
    }
    this.currentUser = authService.currentUserValue.userId
  }

  ngOnInit(): void {
    this.crmService.getLeadGeneration().subscribe((response: any) => {
      this.data = response.data;
    })
    this.addLeadFollowup = this.fb.group({
      id: [],
      leadGeneration: ['', [Validators.required]],
      followUpDate: ['', [Validators.required]],
      notes: [''],
      status: ['', [Validators.required]],
      updatedBy: [this.currentUser],
    });

    if (this.LeadFollowupId) {
      this.dialogTitle = 'Edit';
      this.buttonTitle = "Edit & save";
      this.cancelButton = 'Cancel'
      this.crmService.getLeadFollowupById(this.LeadFollowupId).subscribe((res) => {
        let data = res.data
        this.addLeadFollowup.controls["id"].setValue(data.id);
        this.addLeadFollowup.controls["leadGeneration"].setValue(data.leadGeneration);
        this.leadGenerationControl.setValue(data.leadGeneration.name),
          this.addLeadFollowup.controls["followUpDate"].setValue(data.followUpDate);
        this.addLeadFollowup.controls["notes"].setValue(data.notes);
        this.addLeadFollowup.controls["status"].setValue(data.status);
        this.addLeadFollowup.controls["updatedBy"].setValue(data.updatedBy);
      })
    } else {
      this.dialogTitle = 'New Lead FollowUps';
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

  onNoClick() {
    if (this.LeadFollowupId) {
      this.back();
    } 
  }

  onRegister() {
    if (this.LeadFollowupId) {
      this.crmService.editLeadFollowup(this.LeadFollowupId, this.addLeadFollowup.value).subscribe((data: any) => {
          let message;
          if (data.status === "OK") {
          this.addLeadFollowup.reset();
          this.leadGenerationControl.reset();
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
      this.crmService.postLeadFollowup(this.addLeadFollowup.value).subscribe((data: any) => {
          let message;
          if (data.status === "OK") {
          this.addLeadFollowup.reset();
          this.leadGenerationControl.reset();
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


