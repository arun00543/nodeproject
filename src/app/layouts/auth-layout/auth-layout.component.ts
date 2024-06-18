import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

declare var particlesJS: any;
@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit {
  test: Date = new Date();
  public isCollapsed = true;
  message = "Loading..."
  currentUrl: any;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        if (this.currentUrl != '/authentication/forget-password' && this.currentUrl != '/authentication/login') {
          var html = document.getElementsByTagName("html")[0];
          html.classList.remove("auth-layout");
          var body = document.getElementsByTagName("body")[0];
          body.classList.remove("bg-default");
        }else if (this.currentUrl === '/authentication/forget-password') {
          var body = document.getElementsByTagName("body")[0];
          body.classList.remove("bg-default");
        } else {
          particlesJS.load('particles-js', 'assets/particles1.json', function () {
            let el = document.querySelector(".particles-js-canvas-el");
            el.setAttribute("background", "#191181");
          });
          var html = document.getElementsByTagName("html")[0];
          html.classList.add("auth-layout");
          var body = document.getElementsByTagName("body")[0];
          body.classList.add("bg-default");
          this.router.events.subscribe((event) => {
            this.isCollapsed = true;
          });
        }
      }
    });
  }
  ngOnInit() {
  }

}
