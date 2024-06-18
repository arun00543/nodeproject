import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
  import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService  {
  basicUrl = environment.apiUrl;

  constructor(
    private http:HttpClient,
  ) { 
   
  }
  //Vehicle 

  getVehicle(){
    return this.http.get<any>(`${environment.apiUrl}/vehicle-detail`)
  }
  getVehicleById(id:number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/vehicle-detail/${id}`);
  }
  postVehicle(data:any){
    return this.http.post<any>(`${environment.apiUrl}/vehicle-detail`,data)
  }
  editVehicle(id:number,data:any){
    return this.http.put<any>(`${environment.apiUrl}/vehicle-detail/${id}`,data)
  }
  deleteVehicle(id:number){
    return this.http.delete<any>(`${environment.apiUrl}/vehicle-detail/${id}`)
  }
  getVehicleList(page:number, size:number, sort:string, dir:string, searchTerm:string){
    return this.http.get<any>(`${environment.apiUrl}/vehicle-detail/list?page=${page}&size=${size}&search=${searchTerm}&sortByField=${sort}&sortBy=${dir}`)
   
  }

  //vehicle type

  getVehicleType(){
    return this.http.get<any>(`${environment.apiUrl}/vehicle-type`)
  }
  getVehicleTypeById(id:number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/vehicle-type/${id}`);
  }
  postVehicleType(data:any){
    return this.http.post<any>(`${environment.apiUrl}/vehicle-type`,data)
  }
  editVehicleType(id:number,data:any){
    return this.http.put<any>(`${environment.apiUrl}/vehicle-type/${id}`,data)
  }
  deleteVehicleType(id:number){
    return this.http.delete<any>(`${environment.apiUrl}/vehicle-type/${id}`)
  }
  getVehicleTypeList(page:number, size:number, sort:string, dir:string, searchTerm:string){
    return this.http.get<any>(`${environment.apiUrl}/vehicle-type/list?page=${page}&size=${size}&search=${searchTerm}&sortByField=${sort}&sortBy=${dir}`)
   
  }
  // Service Type

  getServiceItems(){
    return this.http.get<any>(`${environment.apiUrl}/service-item`)
  }
  getServiceItemsById(id:number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/service-item/${id}`);
  }
  postServiceItems(data:any){
    return this.http.post<any>(`${environment.apiUrl}/service-item`,data)
  }
  editServiceItems(id:number,data:any){
    return this.http.put<any>(`${environment.apiUrl}/service-item/${id}`,data)
  }
  deleteServiceItems(id:number){
    return this.http.delete<any>(`${environment.apiUrl}/service-item/${id}`)
  }
  getServiceItemList(page:number, size:number, sort:string, dir:string, searchTerm:string){
    return this.http.get<any>(`${environment.apiUrl}/service-item/list?page=${page}&size=${size}&search=${searchTerm}&sortByField=${sort}&sortBy=${dir}`)
   
  }

  // Vehicle Service

  getVehicleService(){
    return this.http.get<any>(`${environment.apiUrl}/vehicleService-detail`)
  }
  getVehicleServiceById(id:number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/vehicleService-detail/${id}`);
  }
  postVehicleService(data:any){
    return this.http.post<any>(`${environment.apiUrl}/vehicleService-detail`,data)
  }
  editVehicleService(id:number,data:any){
    return this.http.put<any>(`${environment.apiUrl}/vehicleService-detail/${id}`,data)
  }
  deleteVehicleService(id:number){
    return this.http.delete<any>(`${environment.apiUrl}/vehicleService-detail/${id}`)
  }
  getVehicleServiceList(page:number, size:number, sort:string, dir:string, searchTerm:string){
    return this.http.get<any>(`${environment.apiUrl}/vehicleService-detail/list?page=${page}&size=${size}&search=${searchTerm}&sortByField=${sort}&sortBy=${dir}`)
   
  }

  
}
