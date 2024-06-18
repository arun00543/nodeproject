import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  Validators,
} from "@angular/forms";
import { AuthService } from "app/core/service/auth.service";
import { InventoryService } from "app/core/service/inventory/inventory.service";
import { UserService } from "app/core/service/user.service";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component";
import { Observable, map, startWith, take } from "rxjs";

export class list {
  itemMaster: any;
  unitOfMeasure: any;
  unitPrice: number;
  orderedQuantity: number;
}
@Component({
  selector: "app-admin-cart",
  templateUrl: "./admin-cart.component.html",
  styleUrls: ["./admin-cart.component.scss"],
})
export class AdminCartComponent implements OnInit {
  orderForm: FormGroup;
  custId: number;
  brand: any;
  customers: any;
  units: any;
  items: any;
  itemList: Array<list> = [];
  paymentType: string = "Credit";
  paymentTypes = ["Full Payment", "Partial", "Credit"];
  orderData: any;
  total = 0;

  // search dropdown variables
  brandControl = new FormControl("", [Validators.required]);
  itemControl = new FormControl("");
  customerControl = new FormControl("", [Validators.required]);
  filteredBrandOptions: Observable<any[]>;
  filteredItemOptions: Observable<any[]>;
  filteredCustomerOptions: Observable<any[]>;

  constructor(
    private fb: UntypedFormBuilder,
    private inventoryService: InventoryService,
    private userService: UserService,
    private authService: AuthService,
    private notification: NotificationsComponent
  ) { }

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      item: ["", [Validators.required]],
      orderedQuantity: ["", [Validators.required]],
      unit: ["", [Validators.required]],
      customer: ["", [Validators.required]],
    });
  }

  // filter for select dropdown list
  private _filter(name: string, type: string): any[] {
    const filterValue = name.toLowerCase();
    if (type) {
      switch (type) {
        case "brand":
          return this.brand.filter((option) =>
            option.name.toLowerCase().includes(filterValue)
          );
        case "customer":
          return this.customers.filter((option) =>
            option.name.toLowerCase().includes(filterValue)
          );
        case "item":
          return this.items.filter((option) =>
            option.itemName.toLowerCase().includes(filterValue)
          );
      }
    }
  }

  onBrandControlChange(event: any) {
    if (event.target.value != '') {
      this.inventoryService.getBrandByName(event.target.value).subscribe((res) => {
        this.filteredBrandOptions = res.data;
      });
    } else {
      this.conditionalFormReset();
      this.filteredBrandOptions = null;
    }
    this.filteredItemOptions = null;
    this.units = [];
  }
  onCustomerControlChange(event: any) {
    if (event.target.value != '') {
      this.userService.getCustomerByName(event.target.value).subscribe((res) => {
        this.filteredCustomerOptions = res.data;
      });
    } else {
      this.customerControl.reset();
      this.filteredCustomerOptions = null;
    }
  }

  // to show the value from the object
  public displayProperty(value) {
    if (value) {
      return value.name;
    }
  }
  public displayPropertyitem(value) {
    if (value) {
      return value.itemName;
    }
  }

  onSelectBrand(event: any) {
    let data = event.option.value;
    this.itemControl.reset();
    this.inventoryService
      .getItemByBrandId(data.id)
      .subscribe((response: any) => {
        this.items = response.data;
        this.filteredItemOptions = this.itemControl.valueChanges.pipe(
          startWith(""),
          map((value: any) => {
            const name = typeof value === "string" ? value : value?.itemName;
            return name
              ? this._filter(name as string, "item")
              : this.items.slice();
          })
        );
      });
  }

  onSelectItem(event: any) {
    let data = event.option.value;
    this.orderForm.controls["unit"].setValue("");
    this.units = data.unitOfMeasures;
    this.orderForm.controls["item"].setValue(data);
  }

  onSelectCustomer(event: any) {
    let data = event.option.value;
    this.custId = data.id;
    this.orderForm.controls["customer"].setValue(data);
  }

  // add item to item list
  addToList() {
    let itemObj = new list();
    if (this.itemList.length > 0) {
      for (let item of this.itemList) {
        if (
          item.itemMaster.id === this.orderForm.value.item.id &&
          item.unitOfMeasure.id === this.orderForm.value.unit.id
        ) {
          item.orderedQuantity = item.orderedQuantity + this.orderForm.value.orderedQuantity;
          this.totalPrice();
          this.conditionalFormReset();
          return;
        }
      }
    }
    itemObj.itemMaster = this.orderForm.value.item;
    itemObj.unitOfMeasure = this.orderForm.value.unit;
    itemObj.orderedQuantity = this.orderForm.value.orderedQuantity;
    itemObj.unitPrice = this.orderForm.value.item.fixedPrice;
    this.itemList.push(itemObj);
    this.totalPrice();
    this.conditionalFormReset();
    this.filteredBrandOptions = null;
    this.filteredItemOptions = null;
    this.units = []
  }

  // romoves item form item list
  removeObject(row: any) {
    const index: number = this.itemList.indexOf(row);
    if (index !== -1) {
      this.itemList.splice(index, 1);
    }
    this.totalPrice();
  }

  // calculate price of listed items
  totalPrice() {
    this.total = 0;
    for (let data of this.itemList) {
      this.total +=
        data.itemMaster.fixedPrice *
        (data.unitOfMeasure.unitWeight * data.orderedQuantity);
    }
  }

  // reset form with condition
  conditionalFormReset() {
    this.itemControl.reset();
    this.brandControl.reset();
    this.orderForm.controls["item"].reset();
    this.orderForm.controls["unit"].reset();
    this.orderForm.controls["orderedQuantity"].reset();
  }

  // reset form
  completeFormReset() {
    this.orderForm.reset();
    this.brandControl.reset();
    this.itemControl.reset();
    this.customerControl.reset();
    this.filteredCustomerOptions = null;
    this.items = [];
    this.filteredItemOptions = null;
    this.units = [];
  }

  // reset form and item list
  reset() {
    this.completeFormReset();
    this.conditionalFormReset();
    this.itemList = [];
    this.total = 0;
    this.custId = 0;
    this.orderData = null;
  }

  placeOrder() {
    // declare payload
    this.orderData = {
      customer: {
        id: this.custId,
      },
      itemDetails: this.itemList,
      updatedBy: this.authService.currentUserValue.userId,
      orderStatus: "PENDING",
    };
    this.inventoryService.postOrder(this.orderData).subscribe((res) => {
      let message;
      if (res.status === "OK") {
        this.reset();
        this.notification.showNotification(
          "top",
          "right",
          (message = {
            message: res.message,
            status: "success",
          })
        );
      } else {
        this.notification.showNotification(
          "top",
          "right",
          (message = {
            message: res.message,
            status: "warning",
          })
        );
      }
    });
  }
}
