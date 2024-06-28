import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3002/bp/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<{ data: Product[] }>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  createProduct(product: Product): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }
}
