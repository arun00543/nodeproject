import { DataSource } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { BehaviorSubject, map, merge, Observable } from "rxjs";

export class ExampleDataSource extends DataSource<any> {
  filterChange = new BehaviorSubject("");
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }

  filterColumn: string;

  filteredData: any[] = [];
  renderedData: any[] = [];
  constructor(
    public columnData: any,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.columnData,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        if (this.columnData) {
          this.filteredData = this.columnData.slice().filter((data: any) => {
            let searchStr;
            if (data.id) {
              searchStr = data.id.toString().toLowerCase();
            } else if (data.orderId) {
              searchStr = data.orderId.toString().toLowerCase();
            } else if (data.salesId) {
              searchStr = data.salesId.toString().toLowerCase();
            }

            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });
        } else {
          return null;
        }

        const sortedData = this.sortData(this.filteredData.slice());
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(
          startIndex,
          this.paginator.pageSize
        );
        return this.renderedData;
      })
    );
  }
  disconnect() {}
  /** Returns a sorted copy of the database data. */
  sortData(data: any[]): any[] {
    if (!this._sort.active || this._sort.direction === "") {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = "";
      let propertyB: number | string = "";
      switch (this._sort.active) {
        case "userName":
          [propertyA, propertyB] = [a.userName, b.userName];
          break;
        case "email":
          [propertyA, propertyB] = [a.email, b.email];
          break;
        case "phoneNumber":
          [propertyA, propertyB] = [a.phoneNumber, b.phoneNumber];
          break;
        case "userType":
          [propertyA, propertyB] = [a.userType, b.userType];
          break;
        case "paymentType":
          [propertyA, propertyB] = [a.paymentType, b.paymentType];
          break;
        case "description":
          [propertyA, propertyB] = [a.description, b.description];
          break;
        case "customerId":
          [propertyA, propertyB] = [a.customerId, b.customerId];
          break;
        case "salesId":
          [propertyA, propertyB] = [a.salesId, b.salesId];
          break;
        case "paymentAmount":
          [propertyA, propertyB] = [a.paymentAmount, b.paymentAmount];
          break;
        case "paymentStatus":
          [propertyA, propertyB] = [a.paymentStatus, b.paymentStatus];
          break;
        case "paidAmount":
          [propertyA, propertyB] = [a.paidAmount, b.paidAmount];
          break;
        case "balanceAmount":
          [propertyA, propertyB] = [a.balanceAmount, b.balanceAmount];
          break;
        case "serialNumber":
          [propertyA, propertyB] = [a.serialNumber, b.serialNumber];
          break;
        case "manufacturer":
          [propertyA, propertyB] = [a.manufacturer, b.manufacturer];
          break;
        case "modelNumber":
          [propertyA, propertyB] = [a.modelNumber, b.modelNumber];
          break;
        case "purchaseCost":
          [propertyA, propertyB] = [a.purchaseCost, b.purchaseCost];
          break;
        case "yearPurchased":
          [propertyA, propertyB] = [a.yearPurchased, b.yearPurchased];
          break;
        case "machineryId":
          [propertyA, propertyB] = [a.machineryId, b.machineryId];
          break;
        case "maintenanceDate":
          [propertyA, propertyB] = [a.maintenanceDate, b.maintenanceDate];
          break;
        case "cost":
          [propertyA, propertyB] = [a.cost, b.cost];
          break;
        case "technicianName":
          [propertyA, propertyB] = [a.technicianName, b.technicianName];
          break;
        case "nextMaintenanceDate":
          [propertyA, propertyB] = [
            a.nextMaintenanceDate,
            b.nextMaintenanceDate,
          ];
          break;
        case "itemName":
          [propertyA, propertyB] = [a.itemName, b.itemName];
          break;
        case "itemDescription":
          [propertyA, propertyB] = [a.itemDescription, b.itemDescription];
          break;
        case "itemCategory":
          [propertyA, propertyB] = [a.itemCategory, b.itemCategory];
          break;
        case "brand":
          [propertyA, propertyB] = [a.brand, b.brand];
          break;
        case "fixedPrice":
          [propertyA, propertyB] = [a.fixedPrice, b.fixedPrice];
          break;
        case "unitOfMeasure":
          [propertyA, propertyB] = [a.unitOfMeasure, b.unitOfMeasure];
          break;
        case "itemImage":
          [propertyA, propertyB] = [a.itemImage, b.itemImage];
          break;
        case "categoryName":
          [propertyA, propertyB] = [a.categoryName, b.categoryName];
          break;
        case "categoryDescription":
          [propertyA, propertyB] = [
            a.categoryDescription,
            b.categoryDescription,
          ];
          break;
        case "maintenanceDate":
          [propertyA, propertyB] = [a.maintenanceDate, b.maintenanceDate];
          break;
        case "unitName":
          [propertyA, propertyB] = [a.unitName, b.unitName];
          break;
        case "unitDescription":
          [propertyA, propertyB] = [a.unitDescription, b.unitDescription];
          break;
        case "unitWeight":
          [propertyA, propertyB] = [a.unitWeight, b.unitWeight];
          break;
        case "name":
          [propertyA, propertyB] = [a.name, b.name];
          break;
        case "phone":
          [propertyA, propertyB] = [a.phone, b.phone];
          break;
        case "email":
          [propertyA, propertyB] = [a.email, b.email];
          break;
        case "organization":
          [propertyA, propertyB] = [a.organization, b.organization];
          break;
        case "userId":
          [propertyA, propertyB] = [a.userId, b.userId];
          break;
        case "firstName":
          [propertyA, propertyB] = [a.firstName, b.firstName];
          break;
        case "lastName":
          [propertyA, propertyB] = [a.lastName, b.lastName];
          break;
        case "userRole":
          [propertyA, propertyB] = [a.userRole, b.userRole];
          break;
        case "dob":
          [propertyA, propertyB] = [a.dob, b.dob];
          break;
        case "dateOfJoining":
          [propertyA, propertyB] = [a.dateOfJoining, b.dateOfJoining];
          break;
        case "employeeDepartment":
          [propertyA, propertyB] = [a.employeeDepartment, b.employeeDepartment];
          break;
        case "departmentName":
          [propertyA, propertyB] = [a.departmentName, b.departmentName];
          break;
        case "orderId":
          [propertyA, propertyB] = [a.orderId, b.orderId];
          break;
        case "status":
          [propertyA, propertyB] = [a.status, b.status];
          break;
        case "trackingNumber":
          [propertyA, propertyB] = [a.trackingNumber, b.trackingNumber];
          break;
        case "customer":
          [propertyA, propertyB] = [a.customer, b.customer];
          break;
        case "customerId":
          [propertyA, propertyB] = [a.customerId, b.customerId];
          break;
        case "address":
          [propertyA, propertyB] = [a.address, b.address];
          break;
          case "employeeLeaveStatus":
          [propertyA, propertyB] = [a.employeeLeaveStatus, b.employeeLeaveStatus];
          break;
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === "asc" ? 1 : -1)
      );
    });
  }
}
