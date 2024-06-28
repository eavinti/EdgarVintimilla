import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {Product} from '../../../interfaces/product.interface';
import { ProductService } from '../../../services/product.service';


@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent {

  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: [{value: '', disabled: false}, Validators.required]
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const product: Product = this.productForm.getRawValue();
      this.productService.createProduct(product).subscribe({
        next: response => console.log('Producto creado con éxito', response),
        error: error => console.error('Error al crear el producto', error)
      });
    } else {
      console.log('Formulario no válido');
    }
  }

}
