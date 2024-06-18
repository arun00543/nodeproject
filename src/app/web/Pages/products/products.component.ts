import { Component, HostListener } from '@angular/core';
import { InventoryService } from 'app/core/service/inventory/inventory.service';
import { noImg } from 'app/inventory-management/noImg';
import { NgxSpinnerService } from 'ngx-spinner';

export class list {
  itemMaster: any;
  unitOfMeasure: any;
  itemCount: any;
  unitPrice: number;
  quantity: any;
}
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {

  @HostListener('window:scroll', ['$event'])
  brands = [];
  productList: Array<list> = [];
  page: number = 0;
  size: number = 10;
  selectedBrand: any = ''
  isMobile = false
  noImg = noImg
  message = "Loading..."
  loadString = 'No Result Found!';

  constructor(
    private inventoryService: InventoryService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.loadString = '';
    this.inventoryService.getWebBrand().subscribe((response: any) => {
      if (response) {
        this.brands = response.data
      } else {
        this.loadString = 'No Result Found!';
      }
    })
    this.isMobileMenu();
    this.loadData();
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollEvent, true);
  }

  scrollEvent = (event: any): void => {
    if (event.target.offsetHeight + Math.ceil(event.target.scrollTop) >= event.target.scrollHeight) {
      this.page = this.page + 1;
      this.loadData();
    }
  }

  isMobileMenu() {
    if ($(window).width() > 758) {
      this.isMobile = false;
    } else {
      this.isMobile = true;
    }
  }

  selectBrand(brand): void {
    this.page = 0;
    this.productList = [];
    this.selectedBrand = brand;
    this.loadData();
  }

  loadData() {
    this.loadString = '';
    this.spinner.show();
    this.inventoryService.getWebCartItems(
      this.page,
      this.size,
      (this.selectedBrand.name ? this.selectedBrand?.name : '')
    ).subscribe((response: any) => {
      if (response.data.content) {
        for (let item of response.data.content) {
          this.productList.push(item);
        }
        this.spinner.hide();
        if (this.productList.length === 0) {
          this.loadString = 'No Result Found!';
        }
      } else {
        this.productList = [];
      }
    }, (error) => {
      this.spinner.hide();
      this.loadString = 'No Result Found!';
    });
  }

}

