
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  constructor( private http:HttpClient) { }
   
  getCredit_Notification(){
    return this.http.get<any>(`${environment.apiUrl}/pending-payment-notification`)
  }
  
  
  //payments
  
  getPayment(page:number, size:number, sort:string, dir:string, searchTerm:string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/payments?page=${page}&size=${size}&search=${searchTerm}&sortByField=${sort}&sortBy=${dir}`);
  }

  getPaymentByOrderId(id:number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/payment/byOrderId?order=${id}`);
  }

  getPaymentBySalesId(page:number, size:number, dir:string, sort:string, searchTerm: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/payment/list-bySalesId?page=${page}&size=${size}&sortBy=${dir}&sortByField=${sort}&salesId=${searchTerm}`);
  }
  getPaymentStatusBySalesId(id:number, data:any, page:number, size:number, dir:string, sort:string, searchTerm: number,searchType :string):Observable<any> {
    if(searchType === 'saleId'){
      return this.http.get<any>(`${environment.apiUrl}/payment/status-salesid?paymentStatus=${data}&salesId=${searchTerm}&page=${page}&size=${size}&sortByField=${sort}&sortBy=${dir}&id=${id}`);
    } else {
    return this.http.get<any>(`${environment.apiUrl}/payment/status-salesid?paymentStatus=${data}&search=${searchTerm}&page=${page}&size=${size}&sortByField=${sort}&sortBy=${dir}&id=${id}`); 
  }
  }

  getPaymentByCustomer(data:any, page:number, size:number, dir:string, sort:string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/payment/customer?name=${data}&page=${page}&size=${size}&sortBy=${dir}&sortByField=${sort}`);
  }

  getPaymentByCustomerId(id:number, page:number, size:number, dir:string, sort:string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/payment/customerId?id=${id}&page=${page}&size=${size}&sortBy=${dir}&sortByField=${sort}`);
  }
  
  getIdPayment(id:number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/payment/${id}`);
  }
  
  postPayment(data:any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/payment`,data)
  }
  
  editPayment(data:any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/payment`,data)
  }
  
  deletePayment(id:number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/payment/${id}`)
  }
  
  getPaymentStatus(data:any, page:number, size:number, dir:string, sort:string, searchTerm: string):Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/payment/status?paymentStatus=${data}&page=${page}&size=${size}&sortBy=${dir}&search=${searchTerm}&sortByField=${sort}`);
 }

 getPaymentinvoice(page:number, size:number, dir:string, sort:string, searchTerm: string):Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/sales-order/customer-paymentStatus?page=${page}&size=${size}&sortBy=${dir}&search=${searchTerm}&sortByField=${sort}`);
   }

   getPaymentinvoiceBySalesId(page:number, size:number, dir:string, sort:string, searchTerm: string):Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/sales-order/BySalesId?page=${page}&size=${size}&sortBy=${dir}&sortByField=${sort}&salesId=${searchTerm}`);
   }

   getPaymentCustinvoiceBySalesId(id:number, page:number, size:number, dir:string, sort:string, searchTerm: string):Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/sales-order/BySalesId?id=${id}&page=${page}&size=${size}&sortBy=${dir}&sortByField=${sort}&salesId=${searchTerm}`);
   }

 getPaymentinvoiceCustomer(id:number,page:number, size:number, dir:string, sort:string, searchTerm: string):Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/sales-order/customer-paymentStatus?id=${id}&page=${page}&size=${size}&sortBy=${dir}&search=${searchTerm}&sortByField=${sort}`);
 }

 getPaymentCustomerUserId(id:number,data:any, page:number, size:number, dir:string, sort:string, searchTerm: string):Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/payment/status-salesid?id=${id}&PaymentStatus=${data}&page=${page}&size=${size}&sortBy=${dir}&search=${searchTerm}&sortByField=${sort}`);
 }

 getPaymentHistory(id:number):Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/payment-history?id=${id}`);
 }

 getPaymentUserId(id:number):Observable<any>{
  return this.http.get<any>(`${environment.apiUrl}/payment/userId?id=${id}`);
 }

 getViewPaymentBySalesId(id:number): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/payment/view-payment?salesId=${id}`);
}
getOutstandingPayment(id:number):Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/payment/outstanding-order-payment?id=${id}`);
}


//expense


getExpenses(): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/expense`);
}

getExpensesById(id:number): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/expense/${id}`);
}

postExpenses(data:any): Observable<any> {
  return this.http.post<any>(`${environment.apiUrl}/expense`,data)
}

editExpenses(id:number, data:any): Observable<any> {
  return this.http.put<any>(`${environment.apiUrl}/expense/${id}`,data)
}

deleteExpenses(id:number): Observable<any> {
  return this.http.delete<any>(`${environment.apiUrl}/expense/${id}`)
}

getExpensesList(page:number, size:number, sort:string, dir:string, searchTerm:string){
  return this.http.get<any>(`${environment.apiUrl}/expense/list?page=${page}&size=${size}&search=${searchTerm}&sortByField=${sort}&sortBy=${dir}`)
 
}

//expense category


getExpensesCategory(): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/expense-category`);
}

getExpensesCategoryById(id:number): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/expense-category/${id}`);
}

postExpensesCategory(data:any): Observable<any> {
  return this.http.post<any>(`${environment.apiUrl}/expense-category`,data)
}

editExpensesCategory(id:number, data:any): Observable<any> {
  return this.http.put<any>(`${environment.apiUrl}/expense-category/${id}`,data)
}

deleteExpensesCategory(id:number): Observable<any> {
  return this.http.delete<any>(`${environment.apiUrl}/expense-category/${id}`)
}

getExpensesCategoryList(page:number, size:number, sort:string, dir:string, searchTerm:string){
  return this.http.get<any>(`${environment.apiUrl}/expense-category/list?page=${page}&size=${size}&search=${searchTerm}&sortByField=${sort}&sortBy=${dir}`)
 
}


//paymentType

getPaymentType(page:number, size:number, dir:string, sort:string, searchTerm: string): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/payment-type-list?page=${page}&size=${size}&sortBy=${dir}&search=${searchTerm}&sortByField=${sort}`);
}

getAllPaymentType(): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/payment-types`);
}

getIdPaymentType(paymentType:any): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/payment-type/${paymentType}`);
}

postPaymentType(data:any): Observable<any> {
  return this.http.post<any>(`${environment.apiUrl}/payment-type`,data)
}

editPaymentType(paymentType:any, data:any): Observable<any> {
  return this.http.put<any>(`${environment.apiUrl}/payment-type/${paymentType}`,data)
}

deletePaymentType(paymentType:any): Observable<any> {
  return this.http.delete<any>(`${environment.apiUrl}/payment-type/${paymentType}`)
}


//Credit Payment Track
getAllCreditPaymentTracker(page:number, size: number, dir: string, sort: string, searchTerm: string): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/credit-payment?page=${page}&size=${size}&sortBy=${dir}&search=${searchTerm}&sortByField=${sort}`);
}

editCreditPaymentTracker(id:number,data:any):Observable<any>{
  return this.http.put<any>(`${environment.apiUrl}/credit-payment/${id}`,data)
}






// --------------------------------------------------------------------

getOrderInvoices(){
  return this.http.get<any>(`${environment.apiUrl}/sales-order`) 
}
 //pdf download API
 getPDF(id:number): Observable<HttpResponse<Blob>>{
  return this.http.get<Blob>(`${environment.apiUrl}/salesInvoice?salesId=${id}`,{ observe: 'response', responseType: 'blob' as 'json'}); 
 }
// downloadPdf(id: number) {
//   return this.http.get(this.apiRoutes.download + "/" + id, { headers: this.headers })
//     .map((res: any) => res)
//     .toPromise();
// }

 getSalesOrderStatus(){
  return this.http.get<any>(`${environment.apiUrl}/sales-order/status?orderStatus=APPROVED`)
 
}

// Employee pay

 getEmployeePayList(page:number, size: number, dir: string, sort: string, searchTerm: string): Observable<any>{
  return this.http.get<any>(`${environment.apiUrl}/employee-pay/list?page=${page}&size=${size}&sortBy=${dir}&search=${searchTerm}&sortByField=${sort}`);
 }

 getIdPayroll(id:number): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/employee-pay/${id}`);
}
editPayroll(id:number,data:any): Observable<any> {
  return this.http.put<any>(`${environment.apiUrl}/employee-pay/${id}`,data);
}
postPayroll(data:any): Observable<any> {
  return this.http.post<any>(`${environment.apiUrl}/employee-pay`,data)
}

deletePayroll(id:number): Observable<any> {
  return this.http.delete<any>(`${environment.apiUrl}/employee-pay/${id}`)
}


//employee - pay - configuration
getEmployeePayConfigurationlist(page:number, size: number, dir: string, sort: string, searchTerm: string): Observable<any>{
  return this.http.get<any>(`${environment.apiUrl}/pay-configuration/list?page=${page}&size=${size}&sortBy=${dir}&search=${searchTerm}&sortByField=${sort}`);
 }

 getIdEmployeePayConfigurationById(id:number): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/pay-configuration/${id}`);
}

editEmployeePayConfiguration(id:number,data:any): Observable<any> {
  return this.http.put<any>(`${environment.apiUrl}/pay-configuration/${id}`,data);
}
postEmployeePayConfiguration(data:any): Observable<any> {
  return this.http.post<any>(`${environment.apiUrl}/pay-configuration`,data)
}

deleteEmployeePayConfiguration(id:number): Observable<any> {
  return this.http.delete<any>(`${environment.apiUrl}/pay-configuration/${id}`)
}
getIdEmployeePayConfiguration(): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/pay-configuration/employee-pay-configuration`);
}

//employee pay slip
downloadEmployeePay(id:number){
  return this.http.get<Blob>(`${environment.apiUrl}/employee-monthly-payslip?id=${id}`,{ observe: 'response', responseType: 'blob' as 'json'});
}
getEmployeeMonthlyPay(page:number, size: number, dir: string, sort: string, searchTerm: string): Observable<any>{
  return this.http.get<any>(`${environment.apiUrl}/monthly-pay/list?page=${page}&size=${size}&sortBy=${dir}&search=${searchTerm}&sortByField=${sort}`);
}
}
