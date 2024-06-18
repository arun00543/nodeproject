import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SharedService } from 'app/shared/shared.service';


@Component({
  selector: 'web-app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  currentUrl: string;
  isActive: boolean = true;

  constructor(
    public router: Router,
    public shared: SharedService
  ) { 
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        if (this.currentUrl === '/web/home') {
          this.shared.activeLink = this.currentUrl
        } else if (this.currentUrl === '/web/about-us') {
        this.shared.activeLink = this.currentUrl
        } else if (this.currentUrl === '/web/contact') {
          this.shared.activeLink = this.currentUrl;
        } else if (this.currentUrl === '/web/gallery') {
          this.shared.activeLink = this.currentUrl;
        } else {
          this.shared.activeLink = '/web/products'
        }
      }
    });
  }


  targetGallery() {
      this.router.navigate(['/web/gallery'])
        .then(() => {
          window.location.reload();
        }).then(()=>{
          this.shared.activeLink = this.currentUrl;
        })

  }

  targetAbout() {
    this.router.navigate(['/web/about-us'])
      .then(() => {
        window.location.reload();
      }).then(()=>{
        this.shared.activeLink = this.currentUrl;
      })
  }
}
