import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
  import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
}) 
export class MachineryService  {
  basicUrl = environment.apiUrl;

  constructor(
    private http:HttpClient,
  ) {}

  getSpare_Notification(){
    return this.http.get<any>(`${environment.apiUrl}/pending-spares-notification`)
  }

  //Machinery service

  getMachinery(){
    return this.http.get<any>(`${environment.apiUrl}/machinery`)
  }
  getMachineryList(page:number, size:number, sort:string, dir:string, searchTerm:string): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/machinery/list?page=${page}&size=${size}&sortByField=${sort}&search=${searchTerm}&sortBy=${dir}`)
  }
  getMachineryById(id:number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/machinery/${id}`);
  }
  postMachinery(data:any){
    return this.http.post<any>(`${environment.apiUrl}/machinery`,data)
  }
  editMachinery(id:number,data:any){
    return this.http.put<any>(`${environment.apiUrl}/machinery/${id}`,data)
  }
  deleteMachinery(id:number){
    return this.http.delete<any>(`${environment.apiUrl}/machinery/${id}`)
  }

  //Maintenance Service
  getMaintenanceList(page:number, size:number, sort:string, dir:string, searchTerm:string): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/maintenance/list?page=${page}&size=${size}&sortByField=${sort}&search=${searchTerm}&sortBy=${dir}`)
  }
  getMaintenanceById(id:number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/maintenance/${id}`);
  }
  postMaintenance(data:any){
    return this.http.post<any>(`${environment.apiUrl}/maintenance`,data)
  }
  editMaintenance(id:number,data:any){
    return this.http.put<any>(`${environment.apiUrl}/maintenance/${id}`,data)
  }
  deleteMaintenance(id:number){
    return this.http.delete<any>(`${environment.apiUrl}/maintenance/${id}`)
  }

  // spare details

  getSpares(){
    return this.http.get<any>(`${environment.apiUrl}/machinery-spares`)
  }
  getSparesById(id:number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/machinery-spares/${id}`);
  }
  postSpares(data:any){
    return this.http.post<any>(`${environment.apiUrl}/machinery-spares`,data)
  }
  editSpares(id:number,data:any){
    return this.http.put<any>(`${environment.apiUrl}/machinery-spares/${id}`,data)
  }
  deleteSpares(id:number){
    return this.http.delete<any>(`${environment.apiUrl}/machinery-spares/${id}`)
  }
  getSparesList(page:number, size:number, sort:string, dir:string, searchTerm:string){
    return this.http.get<any>(`${environment.apiUrl}/machinery-spares/list?page=${page}&size=${size}&search=${searchTerm}&sortByField=${sort}&sortBy=${dir}`)
   
  }

}
