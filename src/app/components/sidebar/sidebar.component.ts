import { Component, OnInit} from "@angular/core";
import { Role } from "app/core/models/role";
import { ROUTES } from "./sidebarItems";
import { Router } from "@angular/router";
import { AuthService } from "app/core/service/auth.service";
import { OrdersService } from "app/core/service/orders/orders.service";
import { interval, switchMap } from "rxjs";
import { SharedService } from "app/shared/shared.service";
import { AdministrativeService } from "app/core/service/administrative/administrative.service";
import { Location } from "@angular/common";
import { TranslationService } from "app/core/service/translation.service";

declare const $: any;

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  public sidebarItems: any[];
  userType: string;
  userRole: string;
  routeRole: string;
  currentUser: any;
  notification: any = [];
  dataSubscription: any;
  activeRoute:string;
  activeRouteContainer1:string;
  activeRouteContainer2:string;
  notification_important:any = [];
  // lang :boolean = false ;

  constructor(
    private router: Router,
    private shared: SharedService,
    public authService: AuthService,
    public orderService: OrdersService,
    public location: Location,
    private administrativeService: AdministrativeService,
    public trans:TranslationService
  ) { }
  ngOnInit() {
    this.currentUser =  this.authService.currentUserValue;
    this.userRole = this.authService.currentUserValue.role;
    this.blockActive();
    
    this.router.events.subscribe((event:any) => {
    this.blockActive();
    });

    this.sidebarItems = ROUTES.filter(
      (x) =>
        x.role.indexOf(this.userRole) !== -1 || x.role.indexOf("All") !== -1
    );
    if (this.userRole === Role.SuperAdmin) {
      this.userType = Role.Admin;
      this.routeRole = "/admin/dashboard/super/dashboard";
    } else if (this.userRole === Role.Admin) {
      this.userType = Role.Admin;
      this.routeRole = "/admin/dashboard";
    }  else if (this.userRole === Role.Employee) {
      this.userType = Role.Employee;
      this.routeRole = "/employee/dashboard";
    } else if (this.userRole === Role.Customer) {
      this.userType = Role.Customer;
      this.routeRole = "/user/dashboard";
    } else {
      this.userType = Role.Admin;
    }

    if ($(window).width() < 768) {
      this.getData();
      this.trans.loadTranslationScript();
      this.dataSubscription = interval(10000) // Repeat every 10 seconds
        .pipe(
          switchMap(async () => this.getData()) // Switch to new observable on every interval
        )
        .subscribe((data) => {
          // Do something with the data here
        });
    }
  }

  clear(data){
    sessionStorage.setItem("_ARC1", null);
    sessionStorage.setItem("_ARC2", null);
    this.activeRouteContainer1 = sessionStorage.getItem("_ARC1") ? sessionStorage.getItem("_ARC1") : null;
    this.activeRouteContainer2 = sessionStorage.getItem("_ARC2") ? sessionStorage.getItem("_ARC2") : null;
  }

  blockActive(){
  this.activeRoute = this.router.url //this.shared.activeLink
}

getActive(data, menu, menu2?){
  if(data.child) {
    for(let item of data.child){
      if(item === this.activeRoute) {
        if(menu){
              sessionStorage.setItem("_ARC1", menu.id);
              sessionStorage.setItem("_ARC2", menu2?.id);
              }
              this.activeRouteContainer1 = sessionStorage.getItem("_ARC1") ? sessionStorage.getItem("_ARC1") : null;
              this.activeRouteContainer2 = sessionStorage.getItem("_ARC2") ? sessionStorage.getItem("_ARC2") : null;
      return true ;
      }
    }
  }
  return false
}

  getData() {
    if (this.userRole === "EMPLOYEE") {
      this.orderService.getApprovalStatus_Notification(this.currentUser.userId).subscribe((response)=>{
        this.notification = response.data
      })
    } else if(this.userRole === "CUSTOMER") {
      this.orderService.getOrderIdByCustomerId_Notification(this.currentUser.userId).subscribe((response)=>{
        this.notification = response.data
      })
    } else {
      this.orderService.getOrderId_Notification().subscribe((response)=>{
        this.notification = response.data
      })
      this.administrativeService.getNotification().subscribe((response)=>{
        this.notification_important= response.data
      })

    }
  }

  ngOnDestroy() {
    if ($(window).width() < 768) {
      this.dataSubscription.unsubscribe(); // Unsubscribe when the component is destroyed
    }
    this.shared.activeLink = null;
  }

  showDetails(data: any) {
    this.shared.toEdit = data.orderId;
    this.router.navigate([`/order&cart/approve-orders`]);
  }

  isMobileMenu() {
    if ($(window).width() > 768) {
      return false;
    }
    return true;
  }

  logout() {
    this.authService.logout();
  }

}
