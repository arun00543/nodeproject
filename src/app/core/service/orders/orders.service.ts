import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { id } from '@swimlane/ngx-datatable';
import { environment } from 'environments/environment';
import { data } from 'jquery';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) { }

  // Pending Order Apis
  getOrderStatusList(page:number, size:number, sort:string, dir:string, searchTerm:string, status:string): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/order-item/order-status?page=${page}&size=${size}&sortBy=${dir}&sortByField=${sort}&search=${searchTerm}&orderStatus=${status}`)
}

  getorderItemById(id:number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/order-item/${id}`);
  }

   getorderStatus(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/order-item/order-status`);
   }

   getOrderId_Notification(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/order-item/orders-notification`);
   }

   getApprovalStatus_Notification(id:number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/employee-leave/employee-notification?id=${id}`);
   }

   getOrderIdByCustomerId_Notification(id:number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/order-item/customer-notification?id=${id}`);
   }
  
  postItem(data:any): Observable<any> {
      return this.http.post<any>(`${environment.apiUrl}/order-item`,data)
  }
  
   editorderItems(id:number, data:any): Observable<any> {
      return this.http.put<any>(`${environment.apiUrl}/order-item/${id}`,data)
    }

    deleteorderItems(id:number): Observable<any> {
      return this.http.delete<any>(`${environment.apiUrl}/order-item/${id}`)
    }

    getClientStatus(){
      return this.http.get<any>(`${environment.apiUrl}/payment/customers-status`)
    }

    getSalesOrder(): Observable<any> {
      return this.http.get<any>(`${environment.apiUrl}/sales-order`);
    }
  
    // Get Orders
  
    getOrder(): Observable<any> {
      return this.http.get<any>(`${environment.apiUrl}/orders-item`);
    }

    getOrderByCustomer(id:number,page:number, size:number, sort:string, dir:string, searchTerm:string, status:string): Observable<any> {
      return this.http.get<any>(`${environment.apiUrl}/order-item/order-status-userId?id=${id}&page=${page}&size=${size}&sortBy=${dir}&sortByField=${sort}&search=${searchTerm}&orderStatus=${status}`);
    }
  
    getOrderById(id:number): Observable<any> {
      return this.http.get<any>(`${environment.apiUrl}/order-item/orderId?orderId=${id}`);
    }

    getOrderStatusById(orderId:number): Observable<any> {
      return this.http.get<any>(`${environment.apiUrl}/order-item/customer-notification-enabled?orderId=${orderId}`);
    }

    getOutstandingPaymentById(id:number, role:string): Observable<any> {
      if(role === "customer"){
        return this.http.get<any>(`${environment.apiUrl}/payment/customer-outstanding-userid?id=${id}`);
      } else {
      return this.http.get<any>(`${environment.apiUrl}/payment/customer-outstanding?id=${id}`);
    }
    }

    getOrderBySalesId(id:number): Observable<any> {
      return this.http.get<any>(`${environment.apiUrl}/order-item/salesId?salesId=${id}`);
    }
  
    deleteOrder(id:number): Observable<any> {
      return this.http.delete<any>(`${environment.apiUrl}/order-item/pending-order-delete?orderId=${id}`);
    }

    //Rejected Reason

    getReason(data:string): Observable<any>{
      return this.http.get<any>(`${environment.apiUrl}/reject-reason/order-leave-rejection?rejection=${data}`);
    }

    getReasonById(id:Number): Observable<any>{
      return this.http.get<any>(`${environment.apiUrl}/reject-reason/${id}`);
    }

    postReason(data:any){
      return this.http.post<any>(`${environment.apiUrl}/reject-reason`,data)
    }
    editReason(id:number,data:any){
      return this.http.put<any>(`${environment.apiUrl}/reject-reason/${id}`,data)
    }
    deleteReason(id:number){
      return this.http.delete<any>(`${environment.apiUrl}/reject-reason/${id}`)
    }
    getReasonList(page:number, size:number, sort:string, dir:string, searchTerm:string){
      return this.http.get<any>(`${environment.apiUrl}/reject-reason/list?page=${page}&size=${size}&search=${searchTerm}&sortByField=${sort}&sortBy=${dir}`)
     
    }
}
