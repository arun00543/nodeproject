import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {

  constructor(
    private http:HttpClient
  ) { }

  getShipment(){
    return this.http.get<any>(`${environment.apiUrl}/shipment`)
  }

  getShipmentListing(page:number, size:number, dir:string, sort:string, searchTerm: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/shipment/list?page=${page}&size=${size}&sortBy=${dir}&search=${searchTerm}&sortByField=${sort}`);
  }

  getShipmentListingWithCustomer(page:number, size:number, dir:string, sort:string, searchTerm: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/shipment/listing-customer?page=${page}&size=${size}&sortBy=${dir}&search=${searchTerm}&sortByField=${sort}`);
  }

  getShipmentListingBySalesId(page:number, size:number, dir:string, sort:string, searchTerm: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/shipment/BySalesId?salesId=${searchTerm}&page=${page}&size=${size}&sortBy=${dir}&sortByField=${sort}`);
  }

  postShipment(data:any){
    return this.http.post<any>(`${environment.apiUrl}/shipment`,data)
  }
  //editpage data get by id
  getShipmentById(id:number){
    return this.http.get<any>(`${environment.apiUrl}/shipment/${id}`)
  }
  editShipment(id:number,data:any){
    return this.http.put<any>(`${environment.apiUrl}/shipment/${id}`,data)
  }

  updateShipment(data:any){
    return this.http.put<any>(`${environment.apiUrl}/shipment`,data)
  }

  deleteShipment(id:number){
    return this.http.delete<any>(`${environment.apiUrl}/shipment/${id}`)
  }
  getShipmentBySalesId(id:number){
    return this.http.get<any>(`${environment.apiUrl}/shipment/salesId?salesId=${id}`)
  }

  getShipmenWallet(id:number){
    return this.http.get<any>(`${environment.apiUrl}/payment/customer-outstanding-userid?id=${id}`);
  }

  //shipment details
  getShipmentDetails(): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/shipment-details`)
  }

  getShipmentDetailsListing(page:number, size:number, dir:string, sort:string, searchTerm: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/shipment-details/list?page=${page}&size=${size}&sortBy=${dir}&search=${searchTerm}&sortByField=${sort}`);
  }

  getShipmentHistory(id:number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/shipment-details/history-salesid?salesId=${id}`);
  }

  getShipmentStatus(data:any, page:number, size:number, dir:string, sort:string, searchTerm: string):Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/shipment-details/shipment-status?shipmentStatus=${data}&page=${page}&size=${size}&sortBy=${dir}&search=${searchTerm}&sortByField=${sort}`);
   }

   getShipmentUserId(id:number,data:any, page:number, size:number, dir:string, sort:string, searchTerm: string):Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/shipment-details/shipment-userId?id=${id}&shipmentStatus=${data}&page=${page}&size=${size}&sortBy=${dir}&search=${searchTerm}&sortByField=${sort}`);
   }

   getShipmentUserSaleId(id:number,data:any, page:number, size:number, dir:string, sort:string, searchTerm: string):Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/shipment-details/shipment-salesid-status?id=${id}&shipmentStatus=${data}&page=${page}&size=${size}&sortBy=${dir}&sortByField=${sort}&salesId=${searchTerm}`);
   }

   getShipmentStatusBySalesId(data:any, page:number, size:number, dir:string, sort:string, searchTerm: number):Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/shipment-details/shipment-salesid-status?shipmentStatus=${data}&salesId=${searchTerm}&page=${page}&size=${size}&sortBy=${dir}&sortByField=${sort}`);
   }
  
   //pdf 
   getPDF(trackId:any): Observable<HttpResponse<Blob>>{
    return this.http.get<Blob>(`${environment.apiUrl}/shipment/invoice?trackingNumber=${trackId}`,{ observe: 'response', responseType: 'blob' as 'json'}); 
   }
}
