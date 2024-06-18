import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, catchError, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {

  }

   // User Roles
  getUserRoles(): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/user-roles`)
  }
  getUserRoleList(page:number, size:number, sort:string, dir:string, searchTerm:string): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/user-role-list?page=${page}&size=${size}&sortByField=${sort}&search=${searchTerm}&sortBy=${dir}`)
  }
  getUserRoleById(id:number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user-role/${id}`);
  }
  postUserRole(data:any): Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/user-role`,data)
  }
  editUserRole(id:number,data:any): Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}/user-role/${id}`,data)
  }
  deleteUserRole(id:number): Observable<any>{
    return this.http.delete<any>(`${environment.apiUrl}/user-role/${id}`)
  }

    // departments Apis
    getEmployeeDepartments(): Observable<any>{
      return this.http.get<any>(`${environment.apiUrl}/employee-department`)
    }
  
    getEmployeeDepartmentList(page:number, size:number, sort:string, dir:string, searchTerm:string): Observable<any>{
      return this.http.get<any>(`${environment.apiUrl}/employee-department/list?page=${page}&size=${size}&search=${searchTerm}&sortByField=${sort}&sortBy=${dir}`)
    }
  
    getEmployeeDepartmentById(id:number): Observable<any> {
      return this.http.get<any>(`${environment.apiUrl}/employee-department/${id}`);
    }
    postEmployeeDepartment(data:any): Observable<any>{
      return this.http.post<any>(`${environment.apiUrl}/employee-department`,data)
    }
    editEmployeeDepartment(id:number,data:any): Observable<any>{
      return this.http.put<any>(`${environment.apiUrl}/employee-department/${id}`,data)
    }
    deleteEmployeeDepartment(id:number): Observable<any>{
      return this.http.delete<any>(`${environment.apiUrl}/employee-department/${id}`)
    }

// Employee API's
  getEmployee(){
    return this.http.get(`${environment.apiUrl}/employee`);
  }

  getEmployeeByName(employeeName:string){
    return this.http.get(`${environment.apiUrl}/employee/employee?employeeName=${employeeName}`);
  }

  getNonUserEmployee(){
    return this.http.get(`${environment.apiUrl}/employee-user-list`);
  }

  getEmployeeList(page:number, size:number, sort:string, dir:string, searchTerm:string){
    return this.http.get(`${environment.apiUrl}/employee/list?page=${page}&size=${size}&search=${searchTerm}&sortByField=${sort}&sortBy=${dir}`);
  }

  getEmployeeById(id:number): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/employee/${id}`)
  }

  getEmployeeByUserId(id:number): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/employee/by-userId?id=${id}`)
  }

  postEmployee(data:any){
    return this.http.post(`${environment.apiUrl}/employee`,data)
  }

  editEmployee(id:number,data:any){
    return this.http.put(`${environment.apiUrl}/employee/${id}`,data)
  }

  deleteEmployee(id:number){
    return this.http.delete(`${environment.apiUrl}/employee/${id}`)
  }

  // Employee work-contract API's
  getEmployeeContract(){
    return this.http.get(`${environment.apiUrl}/contractor`);
  }

  getEmployeeContractList(page:number, size:number, sort:string, dir:string, searchTerm:string){
    return this.http.get(`${environment.apiUrl}/contractor/list?page=${page}&size=${size}&search=${searchTerm}&sortByField=${sort}&sortBy=${dir}`);
  }

  getEmployeeContractById(id:number): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/contractor/${id}`)
  }

  postEmployeeContract(data:any){
    return this.http.post(`${environment.apiUrl}/contractor`,data)
  }

  editEmployeeContract(id:number,data:any){
    return this.http.put(`${environment.apiUrl}/contractor/${id}`,data)
  }

  deleteEmployeeContract(id:number){
    return this.http.delete(`${environment.apiUrl}/contractor/${id}`)
  }

  // Customer API's
  getCustomer(): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/customer`)
  }

  getCustomerByName(customerName): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/customer/customer?customerName=${customerName}`)
  }

  getNonUserCustomer(): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/customer-user-list`)
  }

  getCustomerList(page:number, size:number, sort:string, dir:string, searchTerm:string){
    return this.http.get(`${environment.apiUrl}/customer/list?page=${page}&size=${size}&search=${searchTerm}&sortByField=${sort}&sortBy=${dir}`);
  }

  getCustomerTypeLists(page:number, size:number, sort:string, dir:string, searchTerm:string, customerType:string): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/customer/type-list?customerType=${customerType}&page=${page}&size=${size}&sortBy=${dir}&search=${searchTerm}&sortByField=${sort}`)
  }

  getCustomerById(id:number): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/customer/${id}`)
  }

  postCustomer(data:any){
    return this.http.post(`${environment.apiUrl}/customer`,data)
  }

  editCustomer(id:number,data:any){
    return this.http.put(`${environment.apiUrl}/customer/${id}`,data)
  }

  updateCustomer(id:number,data:any){
    return this.http.put(`${environment.apiUrl}/customer/user?id=${id}`,data)
  }

  updateEmployee(id:number,data:any){
    return this.http.put(`${environment.apiUrl}/employee/user?id=${id}`,data)
  }

  deleteCustomer(id:number){
    return this.http.delete(`${environment.apiUrl}/customer/${id}`)
  }


  //Wallet
  getCustomerWalletId(id:number): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/customer-wallet/${id}`)
  }
  editCustomerWallet(id:number,data:any){
    return this.http.put(`${environment.apiUrl}/customer-wallet/${id}`,data)
  }

  deleteCustomerWallet(id:number){
    return this.http.delete(`${environment.apiUrl}/customer-wallet/${id}`)
  }

  getCustomerWallet():Observable<any>{
    return this.http.get(`${environment.apiUrl}/customer-wallet`);
  }
  getCustomerWalletList(page:number, size:number, sort:string, dir:string, searchTerm:string): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/customer-wallet/list?page=${page}&size=${size}&search=${searchTerm}&sortByField=${sort}&sortBy=${dir}`);
  }

   getCustomerWalletHistoryList(roll:string, id:number,page:number, size:number, sort:string, dir:string, searchTerm:string, fromDate:string, toDate:string):Observable<any> {
   if(roll === 'CUSTOMER'){
    return this.http.get<any>(`${environment.apiUrl}/wallet-history/list?id=${id}&page=${page}&size=${size}&sortByField=${sort}&sortBy=${dir}&search=${searchTerm}&fromDate=${fromDate}&toDate=${toDate}`);
   } else {
    return this.http.get<any>(`${environment.apiUrl}/wallet-history/by-walletId?walletId=${id}&page=${page}&size=${size}&sortByField=${sort}&sortBy=${dir}&search=${searchTerm}&fromDate=${fromDate}&toDate=${toDate}`);
   }
   }


   // User API's
   getUser(): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/user`)
  }

  getUserByCustonerUserId(id:number): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/customer/user?id=${id}`)
  }

  getUserByEmployeeUserId(id:number): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/employee/user?id=${id}`)
  }

  getUserList(page:number, size:number, sort:string, dir:string, searchTerm:string): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/user/list?page=${page}&size=${size}&search=${searchTerm}&sortByField=${sort}&sortBy=${dir}`)
  }

  getUserById(id:number): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/user/${id}`)
  }

  postUser(data:any){
    return this.http.post(`${environment.apiUrl}/user`,data)
  }

  editUser(id:number,data:any){
    return this.http.put(`${environment.apiUrl}/user/${id}`,data)
  }

  deleteUser(id:number){
    return this.http.delete(`${environment.apiUrl}/user/${id}`)
  }

//employee leave entry

getLeaveById(id:number): Observable<any>{
  return this.http.get<any>(`${environment.apiUrl}/employee-leave/${id}`)
}

changeViewStatus(id:number): Observable<any>{
  return this.http.get<any>(`${environment.apiUrl}/employee-leave/employee-notification-enabled?id=${id}`)
}

getLeaveRequestById(id: number, page:number, size:number, sort:string, dir:string, searchTerm:string, from:string, to:string, status:string): Observable<any>{
  if(from && to){
    return this.http.get<any>(`${environment.apiUrl}/employee-leave?id=${id}&page=${page}&size=${size}&sortBy=${dir}&sortByField=${sort}&search=${searchTerm}&fromDate=${from}&toDate=${to}&employeeLeaveStatus=${status}`)
  } else {
    return this.http.get<any>(`${environment.apiUrl}/employee-leave?id=${id}&page=${page}&size=${size}&sortBy=${dir}&sortByField=${sort}&search=${searchTerm}&employeeLeaveStatus=${status}`)
  }
}

getLeaveRequestByStatus(page:number, size:number, sort:string, dir:string, searchTerm:string, from:string, to:string, status:string): Observable<any>{
  if(from && to){
    return this.http.get<any>(`${environment.apiUrl}/employee-leave?page=${page}&size=${size}&sortBy=${dir}&sortByField=${sort}&search=${searchTerm}&fromDate=${from}&toDate=${to}&employeeLeaveStatus=${status}`)
  }else{
    return this.http.get<any>(`${environment.apiUrl}/employee-leave?page=${page}&size=${size}&sortBy=${dir}&sortByField=${sort}&search=${searchTerm}&employeeLeaveStatus=${status}`)
  }
}

getLeaveHistoryByStatus(id:number, page:number, size:number, sort:string, dir:string, searchTerm:string, from:string, to:string, status:string): Observable<any>{
  if(from && to){
  return this.http.get<any>(`${environment.apiUrl}/employee-leave?id=${id}&page=${page}&size=${size}&sortBy=${dir}&sortByField=${sort}&search=${searchTerm}&fromDate=${from}&toDate=${to}&employeeLeaveStatus=${status}`)
  }else{
  return this.http.get<any>(`${environment.apiUrl}/employee-leave?id=${id}&page=${page}&size=${size}&sortBy=${dir}&sortByField=${sort}&search=${searchTerm}&employeeLeaveStatus=${status}`)
  }
}

postLeave(data:any){
  return this.http.post(`${environment.apiUrl}/employee-leave`,data)
}

editLeave(id:number,data:any){
  return this.http.put(`${environment.apiUrl}/employee-leave/${id}`,data)
}

deleteLeave(id:number){
  return this.http.delete(`${environment.apiUrl}/employee-leave/${id}`)
}

  //Employee-Daily Status
  getDailyStatus(page:number, size:number, sort:string, dir:string, searchTerm:string, from:string, to:string): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/daily-status/view?page=${page}&size=${size}&sortByField=${sort}&search=${searchTerm}&fromDate=${from}&toDate=${to}&sortBy=${dir}`)
  }

  getDailyStatusByUserId(id:number, page:number, size:number, sort:string, dir:string, from:string, to:string): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/daily-status/view?id=${id}&page=${page}&size=${size}&sortByField=${sort}&fromDate=${from}&toDate=${to}&sortBy=${dir}`)
  }

  getDailyStatusById(id:number): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/daily-status/${id}`)
  }

  postDailyStatus(data:any){
    return this.http.post(`${environment.apiUrl}/daily-status`,data)
  }

  editDailyStatus(id:number,data:any){
    return this.http.put(`${environment.apiUrl}/daily-status/${id}`,data)
  }

  deleteDailyStatus(id:number){
    return this.http.delete(`${environment.apiUrl}/daily-status/${id}`)
  }

  //employee-contract

  getContract(){
    return this.http.get(`${environment.apiUrl}/employee-contract`);
  }

  getContractList(page:number, size:number, sort:string, dir:string, status:string, searchTerm:string){
    return this.http.get(`${environment.apiUrl}/employee-contract/list?page=${page}&size=${size}&search=${searchTerm}&sortByField=${sort}&sortBy=${dir}&contractStatus=${status}`);
  }

  getContractById(id:number): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/employee-contract/${id}`)
  }

  postContract(data:any){
    return this.http.post(`${environment.apiUrl}/employee-contract`,data)
  }

  editContract(id:number,data:any){
    return this.http.put(`${environment.apiUrl}/employee-contract/${id}`,data)
  }

  deleteContract(id:number){
    return this.http.delete(`${environment.apiUrl}/employee-contract/${id}`)
  }

//Swipe Entry

getSwipeList(id:number,swipeDate:any){
  return this.http.get<any>(`${environment.apiUrl}/swipe-entry/date-employee?id=${id}&swipeDate=${swipeDate}`)
}
getSwipeEntry(){
  return this.http.get(`${environment.apiUrl}/swipe-entry`);
}

getSwipeEntryList(page:number, size:number, sort:string, dir:string, searchTerm:string, from:string, to:string){
  if(from && to){
  return this.http.get(`${environment.apiUrl}/swipe-entry/list?page=${page}&size=${size}&search=${searchTerm}&sortByField=${sort}&sortBy=${dir}&fromDate=${from}&toDate=${to}`);
  } else {
  return this.http.get(`${environment.apiUrl}/swipe-entry/list?page=${page}&size=${size}&search=${searchTerm}&sortByField=${sort}&sortBy=${dir}`);
  }
}

getSwipeEntryById(id:number): Observable<any>{
  return this.http.get<any>(`${environment.apiUrl}/swipe-entry/${id}`)
}

postSwipeEntry(data:any){
  return this.http.post(`${environment.apiUrl}/swipe-entry`,data)
}

editSwipeEntry(id:number,data:any){
  return this.http.put(`${environment.apiUrl}/swipe-entry/${id}`,data)
}

deleteSwipeEntry(id:number){
  return this.http.delete(`${environment.apiUrl}/swipe-entry/${id}`)
}

// Contractor
getContractorPayment(){
  return this.http.get(`${environment.apiUrl}/contract-payment`);
}

getContractorPaymentList(page:number, size:number, sort:string, dir:string, status:string, searchTerm:string){
  return this.http.get(`${environment.apiUrl}/contract-payment/list?page=${page}&size=${size}&search=${searchTerm}&sortByField=${sort}&sortBy=${dir}&contractStatus=${status}`);
}

getContractorPaymentHistory(id:number): Observable<any>{
  return this.http.get<any>(`${environment.apiUrl}/contract-payment/history?id=${id}`)
}

getContractorPaymentById(id:number): Observable<any>{
  return this.http.get<any>(`${environment.apiUrl}/contract-payment/${id}`)
}

postContractorPayment(data:any){
  return this.http.post(`${environment.apiUrl}/contract-payment`,data)
}

editContractorPayment(id:number,data:any){
  return this.http.put(`${environment.apiUrl}/contract-payment/${id}`,data)
}

deleteContractorPayment(id:number){
  return this.http.delete(`${environment.apiUrl}/contract-payment/${id}`)
}

//Contract Employee

getContractEmployee(){
  return this.http.get(`${environment.apiUrl}/contract-employee`);
}

getContractEmployeeByContractor(id:number){
  return this.http.get(`${environment.apiUrl}/contract-employee/by-contractor?id=${id}`);
}

getContractEmployeeList(page:number, size:number, sort:string, dir:string, searchTerm:string){
  return this.http.get(`${environment.apiUrl}/contract-employee/list?page=${page}&size=${size}&search=${searchTerm}&sortByField=${sort}&sortBy=${dir}`);
}

getContractEmployeeById(id:number): Observable<any>{
  return this.http.get<any>(`${environment.apiUrl}/contract-employee/${id}`)
}

postContractEmployee(data:any){
  return this.http.post(`${environment.apiUrl}/contract-employee`,data)
}

editContractEmployee(id:number,data:any){
  return this.http.put(`${environment.apiUrl}/contract-employee/${id}`,data)
}

deleteContractEmployee(id:number){
  return this.http.delete(`${environment.apiUrl}/contract-employee/${id}`)
}

//excel import export 

downloadContractEmployeeExcel(className:any){
  return this.http.get<any>(`${environment.apiUrl}/download-sample-template?className=${className}`);

}

downloadPaymentExcel(){
  return this.http.get<any>(`${environment.apiUrl}/download-payment-template`);
}

uploadContractEmployeeExcel(data:any){
  let formParams = new FormData();
  formParams.append('file', data)
  return this.http.post(`${environment.apiUrl}/upload-contract-employees`, formParams)
}

uploadCustomerExcel(data:any){
  let formParams = new FormData();
  formParams.append('file', data)
  return this.http.post(`${environment.apiUrl}/upload-customers`, formParams)
}

uploadEmployeeExcel(data:any){
  let formParams = new FormData();
  formParams.append('file', data)
  return this.http.post(`${environment.apiUrl}/upload-employees`, formParams)
}

uploadEmployeePayHours(data:any){
  let formParams = new FormData();
  formParams.append('file', data)
  return this.http.post(`${environment.apiUrl}/upload-employee-pay-hours`, formParams)
}

uploadEmployeeWeeklyWages(data:any){
  let formParams = new FormData();
  formParams.append('file', data)
  return this.http.post(`${environment.apiUrl}/upload-employee-weekly-wages`, formParams)
}

uploadCustomerPayment(data:any){
  let formParams = new FormData();
  formParams.append('file', data)
  return this.http.post(`${environment.apiUrl}/upload-customer-payment`, formParams)
}





// Address
getAllCountry(){
  return this.http.get(`${environment.apiUrl}/country`);
}

getStateById(id:number): Observable<any>{
  return this.http.get(`${environment.apiUrl}/state/by-country?id=${id}`);
}

getCityById(id:number): Observable<any>{
  return this.http.get<any>(`${environment.apiUrl}/city/by-state?id=${id}`)
}


// FAQ 
getFAQByRating(question:string): Observable<any>{
  return this.http.get<any>(`${environment.apiUrl}/faq/search?question=${question}`)
}

}
