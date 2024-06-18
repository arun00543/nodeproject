import { Component, OnInit } from "@angular/core";

import {
  UntypedFormBuilder,
  Validators,
  FormControl,
  FormGroup,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { InventoryService } from "app/core/service/inventory/inventory.service";
import { NotificationsComponent } from "app/additional-components/notifications/notifications.component";
import { SharedService } from 'app/shared/shared.service';
import { Observable, map, startWith } from "rxjs";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { AuthService } from "app/core/service/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Editor } from 'ngx-editor';
import { noImg } from "app/inventory-management/noImg";

@Component({
  selector: "app-add-items",
  templateUrl: "./add-items.component.html",
  styleUrls: ["./add-items.component.scss"],
})
export class AddItemsComponent implements OnInit {
  // [x: string]: any;

  editor: Editor | undefined;
  addItem: FormGroup;
  categoriesControl = new FormControl("");
  brandControl = new FormControl("");
  unitControl = new FormControl("");
  filteredCategoriesOptions: Observable<any[]>;
  filteredBrandOptions: Observable<any[]>;
  filteredUnitOptions: Observable<any[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  itemId: number;
  addedDetail: any;
  dialogTitle: string;
  buttonTitle: string;
  cancelButton: string;
  currentUser: any;
  categories: any;
  units: any;
  brands: any;
  selectedFile: any;
  noImg = noImg
  selectedUnits: Array<any> = [];

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private inventoryService: InventoryService,
    private notification: NotificationsComponent,
    private shared: SharedService,
    private spinner: NgxSpinnerService,
  ) {
    this.itemId = shared.toEdit;
    this.addedDetail = this.shared.newOnRow;
    this.currentUser = authService.currentUserValue.userId;
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.addItem = this.fb.group({
      id: [],
      itemName: ["", [Validators.required]],
      itemDescription: [""],
      itemCategory: ["", [Validators.required]],
      fixedPrice: ["", [Validators.required]],
      brand: ["", [Validators.required]],
      unitOfMeasures: [[''], [Validators.required]],
      itemImage: ["."],
      updatedBy: [this.currentUser],
    });
    if (this.addedDetail) {
      this.fillForm(this.addedDetail.formData, true);
      this.shared.newOnRow = null;
    }
    if (this.itemId) {
      this.dialogTitle = "Edit";
      this.buttonTitle = "Edit & save";
      this.cancelButton = "Cancel";
      this.inventoryService.getItemById(this.itemId).subscribe((res) => {
        this.fillForm(res.data);
      });
    } else {
      this.dialogTitle = "New Item";
      this.buttonTitle = "Save";
      this.cancelButton = "Reset";
    }
  }

  fillForm(data, isAddNew?: boolean) {
    if (isAddNew) {
      this.addItem.controls["id"].setValue(data?.id);
      this.addItem.controls["itemName"].setValue(data?.itemName);
      this.addItem.controls["itemDescription"].setValue(data?.itemDescription);
      this.addItem.controls["itemCategory"].setValue(data?.itemCategory);
      this.categoriesControl.setValue(data?.itemCategory);
      this.addItem.controls["fixedPrice"].setValue(data?.fixedPrice);
      for (let unit of data?.unitOfMeasures) {
        if (unit) {
          this.selectedUnits.push(unit);
        }
      }
      this.addItem.controls["brand"].setValue(data?.brand);
      this.brandControl.setValue(data?.brand);
      this.addItem.controls["itemImage"].setValue(data?.itemImageString === "." ? "" : data?.itemImageString);
      switch (this.addedDetail.class) {
        case 'category':
          this.addItem.controls["itemCategory"].setValue(this.addedDetail.data);
          this.categoriesControl.setValue(this.addedDetail.data);
          break;
        case 'brand':
          this.addItem.controls["brand"].setValue(this.addedDetail.data);
          this.brandControl.setValue(this.addedDetail.data);
          break;
        case 'units':
          if(this.addedDetail.data){
          this.selectedUnits.push(this.addedDetail.data);
          this.addItem.controls["unitOfMeasures"].setValue(this.selectedUnits);
          }
          break;
        default: this.addedDetail = null
      }
    } else {
      this.addItem.controls["id"].setValue(data?.id);
      this.addItem.controls["itemName"].setValue(data?.itemName);
      this.addItem.controls["itemDescription"].setValue(data?.itemDescription);
      this.addItem.controls["itemCategory"].setValue(data?.itemCategory);
      this.categoriesControl.setValue(data?.itemCategory);
      this.addItem.controls["fixedPrice"].setValue(data?.fixedPrice);
      this.addItem.controls["unitOfMeasures"].setValue(data?.unitOfMeasures);
      for (let unit of data?.unitOfMeasures) {
        this.selectedUnits.push(unit);
      }
      this.unitControl.setValue(data?.unitOfMeasures);
      this.addItem.controls["brand"].setValue(data?.brand);
      this.brandControl.setValue(data?.brand);
      this.addItem.controls["itemImage"].setValue(data?.itemImageString === "." ? "" : data?.itemImageString);

    }

  }

  ngOnDestroy() {
    this.shared.toEdit = null;
  }

  onSelectNew(data) {
    this.router.navigate([`/inventory/products/add-${data}`]);
    this.shared.newOnRow = {
      class: data,
      formData: this.addItem.value
    }
  }

  onBrandControlChange(event: any) {
    if (event.target.value != '') {
      this.inventoryService.getBrandByName(event.target.value).subscribe((res) => {
        this.filteredBrandOptions = res.data;
      });
    } else {
      this.filteredBrandOptions = null;
    }
  }

  onCategoryControlChange(event: any) {
    if (event.target.value != '') {
      this.inventoryService.getItemCategoriesByName(event.target.value).subscribe((res) => {
        this.filteredCategoriesOptions = res.data;
      });
    } else {
      this.filteredCategoriesOptions = null;
    }
  }

  onUnitControlChange(event: any) {
    if (event.target.value != '') {
      this.inventoryService.getUnitsByName(event.target.value).subscribe((res) => {
        this.filteredUnitOptions = res.data;
      });
    } else {
      this.filteredUnitOptions = null;
    }
  }

  public displayPropertybrand(value) {
    if (value) {
      return value.name;
    }
  }

  public displayPropertyCategory(value) {
    if (value) {
      return value.categoryName;
    }
  }

  private _filter(name: string, type: string): any[] {
    const filterValue = name.toLowerCase();
    if (type) {
      switch (type) {
        case "category":
          return this.categories.filter((option) =>
            option.categoryName.toLowerCase().includes(filterValue)
          );

        case "unit":
          return this.units.filter((option) =>
            option.unitWeight.toString().toLowerCase().includes(filterValue)
          );

        case "brand":
          return this.brands.filter((option) =>
            option.name.toLowerCase().includes(filterValue)
          );
      }
    }
  }

  remove(unit: string): void {
    const index = this.selectedUnits.indexOf(unit);
    if (index >= 0) {
      this.selectedUnits.splice(index, 1);
    }
    this.addItem.controls["unitOfMeasures"].setValue(this.selectedUnits);
  }

  onNoClick() {
    if (this.itemId) {
      this.router.navigate(["/inventory/products/manage-items"]);
    } else {
      this.addItem.reset();
      this.selectedUnits = []
      this.selectedFile = "";
    }
  }

  onSelectCategory(event: any) {
    let data = event.option.value
    this.addItem.controls["itemCategory"].setValue(data);
  }

  onSelectUnit(event: MatAutocompleteSelectedEvent, input: HTMLInputElement): void {
    if (this.selectedUnits.length != 0) {
      for (let item of this.selectedUnits) {
        if (item?.id === event.option.value?.id) {
          return
        }
      }
      this.selectedUnits.push(event.option.value);
    } else {
      this.selectedUnits.push(event.option.value);
    }
    this.addItem.controls["unitOfMeasures"].setValue(this.selectedUnits);
    input.value = '';
  }

  onSelectBrand(event: any) {
    let data = event.option.value
    this.addItem.controls["brand"].setValue(data);
  }

  onRegister() {

    if (this.addItem.value.itemImage === ".") {
      this.addItem.controls["itemImage"].setValue("");
    }

    if (this.itemId) {

      this.inventoryService
        .editItem(this.itemId, this.addItem.value)
        .subscribe((data: any) => {
          let message;
          if (data.status === "OK") {
            this.addItem.reset();
            this.notification.showNotification(
              "top",
              "right",
              (message = {
                message: data.message,
                status: "info",
              })
            );


            this.router.navigate(["/inventory/products/manage-items"]);

          }
          else {
            let message;
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
      this.inventoryService
        .postItem(this.addItem.value)
        .subscribe((data: any) => {
          let message;
          if (data.status === "OK") {
            this.addItem.reset();
            this.selectedFile = "";
            this.selectedUnits = [];
            this.categoriesControl.reset();
            this.brandControl.reset();
            this.notification.showNotification(
              "top",
              "right",
              (message = {
                message: data.message,
                status: "success",
              })
            );

            this.router.navigate(["/inventory/products/manage-items"]);
          }
          else {
            let message;
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

  onFileSelected(event: any): void {
    if (event.target.files[0].type === "image/png" || event.target.files[0].type === "image/jpeg") {
      if (event.target.files[0]?.size > 2000 * 1024) {
        alert('The file size should Not be more then 2MB');
      } else {
        this.selectedFile = event.target.files[0] ?? null;
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile);
        reader.onload = () => {
          let file = reader.result;
          this.addItem.controls["itemImage"].setValue(file);
        };
      }
    } else {
      let message;
      this.notification.showNotification(
        'top',
        'center',
        message = {
          "message": "Only Image Files can be uploaded",
          "status": "danger"
        },
      );
    }
  }
}
