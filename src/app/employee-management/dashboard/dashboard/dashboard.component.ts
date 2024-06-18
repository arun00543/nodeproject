import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/core/service/auth.service';
import { InventoryService } from 'app/core/service/inventory/inventory.service';
import { noImg } from "app/inventory-management/noImg";
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentDateTime: Date = new Date();

  public datasets: any;
  public data: any;
  public dashData: any;
  public userRole: string;
  noImg = noImg;

  constructor(
    private inventoryService: InventoryService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    
    this.userRole =this.authService.currentUserValue.role;
    setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);
    this.inventoryService.getDashboardDetails().subscribe((response: any) => {
      if(response){
        this.dashData = response.data
      }
    })
    
  }

}


