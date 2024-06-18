import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from '../service/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';


const jwtHelper = new JwtHelperService
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements  CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  
  decodeToken(data:string){
    return jwtHelper.decodeToken(data);
  }

  refreshToken(){
    let token = this.authService.currentUserValue?.token
    const expires = new Date(this.decodeToken(token).exp * 1000);
    if(expires.getTime() - 10000 * 60 < Date.now()){
      this.authService.refreshToken();
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.currentUserValue) {
     let token = this.authService.currentUserValue?.token;
      const userRole = this.authService.currentUserValue.role;
      const tokenDetail = jwtHelper.isTokenExpired(token)
      if(tokenDetail){
        this.authService.logout();
        return false;
      }
      this.refreshToken();
      return true;
    }
    this.authService.logout();
    return false;
  }
}
