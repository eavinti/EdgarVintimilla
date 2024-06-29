import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {Product} from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3002/bp/products';

  constructor(private http: HttpClient) {
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<{ data: Product[] }>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  verifyProductId(id: string): Observable<boolean> {
    return this.http.get(`${this.apiUrl}/verification/${id}`, {responseType: 'text'}).pipe(
      map(response => response === 'true')
    );
  }

  createProduct(product: Product): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<{ data: Product }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  updateProduct(id: string, product: Product): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product);
  }

}
