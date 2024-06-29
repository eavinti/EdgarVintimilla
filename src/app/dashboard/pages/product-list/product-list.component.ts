import {Component, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import { Router } from '@angular/router';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';

import {Product} from '../../../interfaces/product.interface';
import {ProductService} from '../../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  displayedProducts: Product[] = [];
  searchControl: FormControl = new FormControl('');
  resultsPerPageControl: FormControl = new FormControl('5');
  totalProducts: number = 0;

  contextMenuVisible: boolean[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    ) {
  }

  ngOnInit(): void {
    this.loadProducts();
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.filterProducts();
    });
    this.resultsPerPageControl.valueChanges.subscribe(value => {
      this.filterProducts();
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.totalProducts = this.products.length;
        this.filterProducts();
        this.contextMenuVisible = new Array(this.products.length).fill(false);
      },
      error: (error) => console.error('Error al obtener los productos', error)
    });
  }


  filterProducts(): void {
    const searchTerm = this.searchControl.value.toLowerCase();
    const resultsPerPage = parseInt(this.resultsPerPageControl.value, 10);

    let filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm)
    );

    if (!isNaN(resultsPerPage) && resultsPerPage > 0) {
      this.displayedProducts = filteredProducts.slice(0, resultsPerPage);
    } else {
      this.displayedProducts = filteredProducts;
    }
  }

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  toggleContextMenu(index: number): void {
    this.contextMenuVisible = this.contextMenuVisible.map((visible, i) => (i === index ? !visible : false));
    console.log(this.contextMenuVisible);
  }

  editProduct(product: Product): void {
    console.log('Edit product', product);
    this.router.navigate(['/dashboard/form', product.id]);
  }

  deleteProduct(product: Product): void {
    console.log('Delete product', product);
  }

}
