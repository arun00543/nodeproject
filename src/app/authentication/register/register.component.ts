import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "app/core/service/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  authForm: UntypedFormGroup;
  submitted = false;
  returnUrl: string;
  status: string;
  statusClass: string;
  message: string;
  refEmail: string;
  hide = true;
  chide = true;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    let generatedId = Math.floor(1000 * Math.random());

    this.authForm = this.formBuilder.group({
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      email: [
        "",
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      password: ["", Validators.required],
      tenantid: [1],
      role: ["USER"],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  onSubmit() {
    this.submitted = true;
    const userData = this.authForm.value;
    // stop here if form is invalid
    if (this.authForm.invalid) {
      return;
    } else {
      this.authService
        .register(
          userData.firstname,
          userData.lastname,
          userData.email,
          userData.password,
          userData.tenantid,
          userData.role
        )
        .subscribe((res: any) => {
          this.hide = false;
          if (res.isSuccess === true) {
            this.statusClass = "terms-head text-success mb-2 mx-5";
            this.status = "Registered Successfully";
            this.message = "Verify your Account through the Mail sended to";
            this.refEmail = res.data;
          } else {
            this.statusClass = "terms-head text-danger mb-2 mx-5";
            this.status = "Error !";
            this.message = "There is an issue";
            this.refEmail = res.data;
          }

          setTimeout(() => {
            this.router.navigate(["/"]);
          }, 1000);
        });
    }
  }
}
