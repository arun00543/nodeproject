import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, of, map } from "rxjs";
import { environment } from "environments/environment";
import { User } from "../models/user";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<object>;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  decodeToken(data: string) {
    return this.jwtHelper.decodeToken(data);
  }

  login(userName: string, password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/api/v1/auth/authenticate`, {
        userName,
        password,
      })
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          if (user.status === "OK") {
            const decodeData = JSON.parse(
              this.decodeToken(user.data.token).sub
            );
            const userDetail = {
              userId: decodeData.userId,
              userName: decodeData.userName,
              role: decodeData.role,
              isFL: decodeData.isFirstLogin,
              token: user.data.token,
            };
            localStorage.setItem("currentUser", JSON.stringify(userDetail));
            this.currentUserSubject.next(userDetail);
            return user.data;
          }
        })
      );
  }


  register(
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    tenantid: string,
    role: string
  ): Observable<Object> {
    return this.http.post(`${environment.apiUrl}/api/v1/auth/register`, {
      firstname,
      lastname,
      email,
      password,
      tenantid,
      role,
    });
  }

  changePassowrd(data: any) {
    return this.http.put<any>(`${environment.apiUrl}/user/change-password`, data);
  }


  refreshToken() {
    return this.http.post<any>(`${environment.apiUrl}/user/refresh-token`, null).subscribe(
      (user) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        if (user.status === "OK") {
          const decodeData = JSON.parse(this.decodeToken(user.data).sub);
          const userDetail = {
            userId: decodeData.userId,
            userName: decodeData.userName,
            role: decodeData.role,
            isFL: decodeData.isFirstLogin,
            token: user.data,
          };
          localStorage.setItem("currentUser", JSON.stringify(userDetail));
          this.currentUserSubject.next(userDetail);
          return user.data;
        }
      }
    );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    sessionStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/authentication/login']);
  }

  forgotPassword(phoneNumber: number) {
    return this.http
      .post<any>(`${environment.apiUrl}/api/v1/auth/otp`, phoneNumber);
  }

  otpVerify(otp: number, phoneNumber: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/api/v1/auth/otp/verify`, { otp, phoneNumber });
  }

  confirmPassword(newPassword: string, userName: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/api/v1/auth/reset/password`, {
        newPassword,
        userName
      });
  }
}
