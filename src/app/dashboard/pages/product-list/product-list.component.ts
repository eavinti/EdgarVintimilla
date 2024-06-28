import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Product} from '../../../interfaces/product.interface';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  contextMenuVisible: boolean[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.contextMenuVisible = new Array(this.products.length).fill(false);
      },
      error: (error) => console.error('Error al obtener los productos', error)
    });
  }

  toggleContextMenu(index: number): void {
    console.log(index);

    this.contextMenuVisible = this.contextMenuVisible.map((visible, i) => (i === index ? !visible : false));
    console.log(this.contextMenuVisible);
  }

  editProduct(product: Product): void {
    console.log('Edit product', product);
  }

  deleteProduct(product: Product): void {
    console.log('Delete product', product);
  }

}
