import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductionService {

  constructor(
    private http:HttpClient
  ) { }

  getProduction(){
    return this.http.get<any>(`${environment.apiUrl}/production`)
  }
  postProduction(data:any){
    return this.http.post<any>(`${environment.apiUrl}/production`,data)
  }
  //getproduction data by id
  getProductionById(id:number){
    return this.http.get<any>(`${environment.apiUrl}/production/${id}`)
  }
  editProduction(id:number,data:any){
    return this.http.put<any>(`${environment.apiUrl}/production/${id}`,data)
  }
 deleteProduction(id:number){
  return this.http.delete<any>(`${environment.apiUrl}/production/${id}`)
 }

 getProductionList(page:number, size:number, sort:string, dir:string, searchTerm:string,from:string, to:string){
  if(from && to){
  return this.http.get<any>(`${environment.apiUrl}/production/list?page=${page}&size=${size}&search=${searchTerm}&sortByField=${sort}&sortBy=${dir}&fromDate=${from}&toDate=${to}`)
  }else{
    return this.http.get<any>(`${environment.apiUrl}/production/list?page=${page}&size=${size}&search=${searchTerm}&sortByField=${sort}&sortBy=${dir}`)
  }
}


//Stock
getProductionStock(){
  return this.http.get<any>(`${environment.apiUrl}/stock`)
}
getProductionStockList(page:number, size:number, sort:string, dir:string, searchTerm:string){
  return this.http.get<any>(`${environment.apiUrl}/stock/list?page=${page}&size=${size}&search=${searchTerm}&sortByField=${sort}&sortBy=${dir}`)
}

}
