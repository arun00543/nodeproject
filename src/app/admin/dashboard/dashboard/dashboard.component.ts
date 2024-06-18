import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'app/core/service/inventory/inventory.service';
import { noImg } from "app/inventory-management/noImg";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentDateTime: Date = new Date();

  public dashData: any;
  noImg = noImg;

  constructor(
    private inventoryService: InventoryService,
  ) { }

  ngOnInit(): void {

    // get Item details
    this.inventoryService.getDashboardDetails().subscribe((response: any) => {
      if(response){
        this.dashData = response.data
      }
    });
  }

}


