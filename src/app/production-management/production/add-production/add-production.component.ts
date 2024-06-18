import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  Validators,
  FormControl,
  FormGroup,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ProductionService } from "app/core/service/Production/production.service";
import { AuthService } from "app/core/service/auth.service";
import { InventoryService } from "app/core/service/inventory/inventory.service";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component";
import { SharedService } from "app/shared/shared.service";
import { Observable, map, startWith } from "rxjs";
export class list {
  unitOfMeasure: any;
  quantity: any;
}

@Component({
  selector: "app-add-production",
  templateUrl: "./add-production.component.html",
  styleUrls: ["./add-production.component.scss"],
})
export class AddProductionComponent implements OnInit {
  addProduction: FormGroup;
  productionId: number;
  dialogTitle: string;
  buttonTitle: string;
  currentUser: any;
  cancelButton: string;
  brandControl = new FormControl("", [Validators.required]);
  itemControl = new FormControl("", [Validators.required]);
  items: any;
  brand: any;
  filteredBrandOptions: Observable<any[]>;
  filteredItemOptions: Observable<any>;
  itemList: Array<list> = [];
  units: any;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private productionService: ProductionService,
    private inventoryService: InventoryService
  ) {
    this.productionId = shared.toEdit;
    this.currentUser = authService.currentUserValue.userId;
  }

  ngOnInit(): void {

    this.addProduction = this.fb.group({
      id: [],
      itemMaster: ["", [Validators.required]],
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
      status: ["FINISHED", [Validators.required]],
      quantity: [],
      unitOfMeasure: [],
      productionDetails: [],
      supervisor: ["", [Validators.required]],
      notes: ["", [Validators.required]],
      updatedBy: [this.currentUser],
    });

    if (this.productionId) {
      this.dialogTitle = "Edit";
      this.buttonTitle = "Edit & save";
      this.cancelButton = "Cancel";
      this.productionService
        .getProductionById(this.productionId)
        .subscribe((res) => {
          if (res.status === "OK") {
            let data = res.data;
            this.addProduction.controls["id"].setValue(data.id);
            this.addProduction.controls["itemMaster"].setValue(data.itemMaster);
            this.onSelectBrand(data.itemMaster.brand)
            this.brandControl.setValue(data.itemMaster.brand);
            this.onSelectItem(data.itemMaster)
            this.itemControl.setValue(data.itemMaster);
            this.addProduction.controls["startDate"].setValue(data.startDate);
            this.addProduction.controls["endDate"].setValue(data.endDate);
            this.addProduction.controls["status"].setValue(data.status);
            this.addProduction.controls["productionDetails"].setValue(
              data.productionDetails
            );
            this.itemList = data.productionDetails;
            this.addProduction.controls["supervisor"].setValue(data.supervisor);
            this.addProduction.controls["notes"].setValue(data.notes);
          }
        });
    } else {
      this.dialogTitle = "New Production";
      this.buttonTitle = "Save";
      this.cancelButton = "Reset";
    }
  }

  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  addToList() {
    let itemObj = new list();
    for (let item of this.itemList) {
      if (item.unitOfMeasure.id === this.addProduction.value.unitOfMeasure.id) {
        item.quantity = item.quantity + this.addProduction.value.quantity;
        this.conditionalReset();
        return;
      }
    }
    itemObj.unitOfMeasure = this.addProduction.value.unitOfMeasure;
    itemObj.quantity = this.addProduction.value.quantity;
    this.itemList.push(itemObj);
    this.conditionalReset();
  }

  removeObject(row: any) {
    const index: number = this.itemList.indexOf(row);
    if (index !== -1) {
      this.itemList.splice(index, 1);
    }
  }

  conditionalReset() {
    this.addProduction.controls["unitOfMeasure"].reset();
    this.addProduction.controls["quantity"].reset();
  }

  onBrandControlChange(event: any) {
    if (event.target.value != '') {
      this.inventoryService.getBrandByName(event.target.value).subscribe((res) => {
        this.filteredBrandOptions = res.data;
      });
    } else {
      this.conditionalReset();
      this.filteredBrandOptions = null;
      this.filteredItemOptions = null;
      this.units = [];
    }
  }

  private _filter(name: string, type: string): any[] {
    const filterValue = name.toLowerCase();
    if (type) {
      switch (type) {
        case "brand":
          return this.brand.filter((option) =>
            option.name.toLowerCase().includes(filterValue)
          );
        case "item":
          return this.items.filter((option) =>
            option.itemName.toLowerCase().includes(filterValue)
          );
      }
    }
  }

  public displayPropertyItem(value) {
    if (value) {
      return value.itemName;
    }
  }
  
  public displayPropertyBrand(value) {
    if (value) {
      return value.name;
    }
  }


  onSelectUnit(event: any): void {
    let data = event.option.value;
    this.addProduction.controls["unitOfMeasure"].setValue(data);
  }

  onNoClick() {
    if (this.productionId) {
      this.router.navigate(["/production/manage-production"]);
    } else {
      this.itemList = [];
      this.brandControl.reset();
      this.filteredBrandOptions = null;
      this.itemControl.reset();
      this.filteredItemOptions = null;
      this.units = [];
    }
  }

  onSelectItem(event: any) {
    this.itemList = []
    let data = event;
    this.addProduction.controls["unitOfMeasure"].setValue("");
    this.units = data.unitOfMeasures;
    this.addProduction.controls["itemMaster"].setValue(data);
  }

  onSelectBrand(event: any) {
    let data = event;
    this.itemControl.reset();
    this.units = [];
    this.inventoryService
      .getItemByBrandId(data.id)
      .subscribe((response: any) => {
        this.items = response.data;
        this.filteredItemOptions = this.itemControl.valueChanges.pipe(
          startWith(""),
          map((value: any) => {
            const name = typeof value === "string" ? value : value?.itemName;
            return name ? this._filter(name as string, "item") : this.items.slice();
          })
        );
      });
  }

  onRegister() {
    this.addProduction.controls["productionDetails"].setValue(this.itemList);
    if (this.productionId) {
      this.productionService
        .editProduction(this.productionId, this.addProduction.value)
        .subscribe((data: any) => {
            let message;
            if (data.status === "OK") {
            this.addProduction.reset();
            this.notification.showNotification(
              "top",
              "right",
              (message = {
                message: data.message,
                status: "info",
              })
            );
            this.router.navigate(["/production/manage-production"]);
          } else {
            this.addProduction.reset();
            this.notification.showNotification(
              "top",
              "right",
              (message = {
                message: data.message,
                status: "warning",
              })
            );
          }
        });
    } else {
      this.productionService
        .postProduction(this.addProduction.value)
        .subscribe((data: any) => {
            let message;
            if (data.status === "OK") {
            this.addProduction.reset();
            this.notification.showNotification(
              "top",
              "right",
              (message = {
                message: data.message,
                status: "success",
              })
            );
            this.router.navigate(["/production/manage-production"]);
          } else {
            this.addProduction.reset();
            this.notification.showNotification(
              "top",
              "right",
              (message = {
                message: data.message,
                status: "warning",
              })
            );
          }
        });
    }
  }
}
