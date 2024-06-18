import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

 
@Injectable({
  providedIn: 'root'
})
export class InventoryService {


  constructor(private http: HttpClient) { }

  // website ----------------------------------------------

  getWebBrand(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/auth/brands`);
  }

  getWebCartItems(page:number, size:number, searchTerm:string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/auth/item-master-list?page=${page}&size=${size}&search=${searchTerm}&sortBy=ASC`);
  }

  // __________________________________________________________

  getDashboardDetails() {
    return this.http.get(`${environment.apiUrl}/item-master/price`);
  }

  // Item Categories Apis
  getItems(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/item-master`);
  }

  getItemsList(page:number, size:number, sort:string, dir:string, searchTerm:string){
    return this.http.get(`${environment.apiUrl}/item-master/list?page=${page}&size=${size}&sortByField=${sort}&search=${searchTerm}&sortBy=${dir}`);
  }

    getCartItems(page:number, size:number, searchTerm:string): Observable<any> {
      return this.http.get<any>(`${environment.apiUrl}/item-master/list?page=${page}&size=${size}&search=${searchTerm}&sortBy=ASC`);
    }
    
    getItemById(id:number): Observable<any> {
      return this.http.get<any>(`${environment.apiUrl}/item-master/${id}`);
    }

    getItemByname(searchString:string): Observable<any> {
      return this.http.get<any>(`${environment.apiUrl}/search-by-itemAndBrand?search=${searchString}`);
    }

    getItemByBrandId(id:number): Observable<any> {
      return this.http.get<any>(`${environment.apiUrl}/item-master/item-brands?id=${id}`);
    }

  postItem(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/item-master`, data)
  }

  editItem(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/item-master/${id}`, data)
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/item-master/${id}`)
  }


  // Item Categories Apis
  getitemCategories(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/item-category`);
  }

  getItemCategoriesByName(categoryName:string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/item-category/name?categoryName=${categoryName}`);
  }

  getitemCategoriesList(page:number, size:number, sort:string, dir:string, searchTerm:string){
    return this.http.get(`${environment.apiUrl}/item-category/list?page=${page}&size=${size}&sortByField=${sort}&search=${searchTerm}&sortBy=${dir}`);
  }

  getitemCategoriesById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/item-category/${id}`);
  }

  postitemCategory(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/item-category`, data)
  }

  edititemCategory(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/item-category/${id}`, data)
  }

  deleteitemCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/item-category/${id}`)
  }

  // Unit of Measures Apis
  getUnits(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/unit-of-measure`);
  }

  getUnitsByName(unitName:string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/unit-of-measure/unit-name?unitName=${unitName}`);
  }


  // Brand Apis
  getBrand(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/brand`);
  }

  getBrandByName(brandName:string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/brand/name?brandName=${brandName}`);
  }

  getBrandList(page:number, size:number, sort:string, dir:string, searchTerm:string){
    return this.http.get(`${environment.apiUrl}/brand/list?page=${page}&size=${size}&sortByField=${sort}&search=${searchTerm}&sortBy=${dir}`);
  }

  getBrandById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/brand/${id}`);
  }

  postBrand(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/brand`, data)
  }

  editBrand(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/brand/${id}`, data)
  }

  deleteBrand(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/brand/${id}`)
  }

  //units -of -measures

  getUnit(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/unit-of-measure`);
  }

  getUnitList(page:number, size:number, sort:string, dir:string, searchTerm:string){
    return this.http.get(`${environment.apiUrl}/unit-of-measure/list?page=${page}&size=${size}&sortByField=${sort}&search=${searchTerm}&sortBy=${dir}`);
  }

  getUnitById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/unit-of-measure/${id}`);
  }

  postUnit(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/unit-of-measure`, data)
  }

  editUnit(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/unit-of-measure/${id}`, data)
  }

  deleteUnit(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/unit-of-measure/${id}`)
  }

  // Order Apis
  getOrder(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/order-items`);
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/order-item/${id}`);
  }

  postOrder(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/order-item`, data)
  }

  approveOrder(data: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/order-item/approval`, data)
  }

  editOrder(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/order-item/${id}`, data)
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/order-item/${id}`)
  }

}

