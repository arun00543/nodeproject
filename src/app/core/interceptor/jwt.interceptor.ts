import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private totalRequests = 0;
  constructor(
    private authenticationService: AuthService,
    private spinner : NgxSpinnerService
    ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.totalRequests++;

      var endPoint = request.url;
      var index = endPoint.lastIndexOf( "-" );
      endPoint = endPoint.slice(index + 1);
      if(endPoint){
        if(endPoint.substring(0,12) != 'notification' && endPoint.substring(0,12) != 'logs'){
          this.spinner.show();
        }
        }

    let currentUser =  this.authenticationService.currentUserValue
    if (currentUser && currentUser.token) {
      request = request.clone({
        url: request.url,
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
    }

    return next.handle(request).pipe(
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests === 0) {
          this.spinner.hide();
        }
      })
    );
  }
}
