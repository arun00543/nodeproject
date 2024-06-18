import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  private brandsUrl = 'assets/products.json'; // Path to your JSON file

  constructor(private http: HttpClient) {}

  getBrands(): Observable<any> {
    return this.http.get<any>(this.brandsUrl);
  }
}
