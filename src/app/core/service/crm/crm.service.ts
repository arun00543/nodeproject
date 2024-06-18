import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrmService {
  basicUrl = environment.apiUrl;

  constructor(
    private http:HttpClient,
  ) {
   }

   getLeadFollowUp_Notification(){
    return this.http.get<any>(`${environment.apiUrl}/lead-notification`)
  }

   // Lead Generations
   getLeadGeneration(){
    return this.http.get<any>(`${environment.apiUrl}/lead-generation`)
  }
  getLeadGenerationList(page:number, size:number, sort:string, dir:string, searchTerm:string): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/lead-generation/list?page=${page}&size=${size}&sortByField=${sort}&search=${searchTerm}&sortBy=${dir}`)
  }
  getLeadGenerationById(id:number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/lead-generation/${id}`);
  }
  postLeadGeneration(data:any){
    return this.http.post<any>(`${environment.apiUrl}/lead-generation`,data)
  }
  postLeadGenerationByWeb(data:any){
    return this.http.post<any>(`${environment.apiUrl}/api/v1/auth/lead-generation/web`,data)
  }
  editLeadGeneration(id:number,data:any){
    return this.http.put<any>(`${environment.apiUrl}/lead-generation/${id}`,data)
  }
  deleteLeadGeneration(id:number){
    return this.http.delete<any>(`${environment.apiUrl}/lead-generation/${id}`)
  }


  //Lead Followups
  getLeadFollowup(){
    return this.http.get<any>(`${environment.apiUrl}/lead-followup`)
  }
  getLeadFollowupList(page:number, size:number, sort:string, dir:string, status:string, searchTerm:string): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/lead-followup/list?page=${page}&size=${size}&sortByField=${sort}&sortBy=${dir}&search=${searchTerm}&leadStatus=${status}`)
  }
  getLeadFollowupById(id:number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/lead-followup/${id}`);
  }
  postLeadFollowup(data:any){
    return this.http.post<any>(`${environment.apiUrl}/lead-followup`,data)
  }
  editLeadFollowup(id:number,data:any){
    return this.http.put<any>(`${environment.apiUrl}/lead-followup/${id}`,data)
  }
  deleteLeadFollowup(id:number){
    return this.http.delete<any>(`${environment.apiUrl}/lead-followup/${id}`)
  }
}
