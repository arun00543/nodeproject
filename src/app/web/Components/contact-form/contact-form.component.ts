import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { CrmService } from 'app/core/service/crm/crm.service';
 
@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent {
  contactForm: UntypedFormGroup;
  isSubmit = false;
  icon: string;
  responseText: string;
 
  constructor(private fb: UntypedFormBuilder,
    private crmService: CrmService,
    private notification: NotificationsComponent,
    private router: Router
    ) {}
 
  ngOnInit(): void {
  this.contactForm = this.fb.group({
    name: ['', []],
    email: ['', []],
    phone: ['', []],
    location: ['', []],
    notes: [''],
    referralSourceType: ['Website'],
    status: ['Interested'],
    updatedBy: ["Website"]
  });
}
 
  onSubmit() {
    if (this.contactForm.valid) {
      this.crmService.postLeadGenerationByWeb(this.contactForm.value).subscribe((res: any) => {
        if (res.status === "OK") {
          this.contactForm.reset();
          this.isSubmit = true;
          this.icon = "thumb_up"
          this.responseText = res.message;
        }else{
          this.contactForm.reset();
          this.isSubmit = true;
          this.icon = "contacts"
          this.responseText = res.message;
        } 
      });
    }
  }
  
  
}
 