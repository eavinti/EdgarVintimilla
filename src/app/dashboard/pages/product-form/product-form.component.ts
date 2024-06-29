import {Component, OnInit} from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import {
  FormBuilder, FormGroup, ReactiveFormsModule, Validators,
  AsyncValidatorFn, AbstractControl, ValidationErrors
} from '@angular/forms';

import { catchError, debounceTime, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import {Product} from '../../../interfaces/product.interface';
import { ProductService } from '../../../services/product.service';


@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {

  productForm: FormGroup;
  successMessage: string | null = null;
  productId: string | null = null;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)], [this.idValidator()]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, this.dateValidator()]],
      date_revision: [{value: '', disabled: true}, [Validators.required, this.dateRevisionValidator()]]
    });

    this.productForm.get('date_release')?.valueChanges.subscribe(value => {
      const releaseControl = this.productForm.get('date_release');
      const revisionControl = this.productForm.get('date_revision');

      if (releaseControl?.valid) {
        revisionControl?.enable();
        const releaseDate = new Date(value);
        const revisionDate = new Date(releaseDate);
        revisionDate.setFullYear(revisionDate.getFullYear() + 1);
        revisionControl?.setValue(revisionDate.toISOString().split('T')[0], { emitEvent: false });
      } else {
        revisionControl?.disable();
        revisionControl?.reset();
      }
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;

    if (this.isEditMode && this.productId) {
      this.productService.getProductById(this.productId).subscribe({
        next: (product) => {
          this.productForm.patchValue(product);
          this.productForm.get('id')?.disable();

        },
        error: (error) => console.error('Error al cargar el producto', error)
      });
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      const product: Product = this.productForm.getRawValue();
      if (this.isEditMode && this.productId) {
        this.productService.updateProduct(this.productId, product).subscribe({
          next: response => {
            console.log('Producto actualizado con éxito', response);
            this.successMessage = 'Producto actualizado con éxito';
          },
          error: error => console.error('Error al actualizar el producto', error)
        });
      } else {
        this.productService.createProduct(product).subscribe({
          next: response => {
            console.log('Producto creado con éxito', response);
            this.successMessage = 'Producto creado con éxito';
            this.resetForm();
          },
          error: error => console.error('Error al crear el producto', error)
        });
      }
    } else {
      console.log('Formulario no válido');
    }
  }


  resetForm() {
    this.productForm.reset();
    this.productForm.get('date_revision')?.disable();
  }

  dateValidator() {
    return (control: { value: string | number | Date; }) => {
      const date = new Date(control.value);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      return date >= yesterday ? null : { invalidDate: true };
    };
  }

  dateRevisionValidator() {
    return (control: { value: string | number | Date; }) => {
      const revisionDate = new Date(control.value);
      const releaseDate = new Date(this.productForm?.get('date_release')?.value);
      const expectedRevisionDate = new Date(releaseDate);
      expectedRevisionDate.setFullYear(expectedRevisionDate.getFullYear() + 1);
      return revisionDate.toDateString() === expectedRevisionDate.toDateString() ? null : { invalidRevisionDate: true };
    };
  }

  idValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return this.productService.verifyProductId(control.value).pipe(
        debounceTime(300),
        switchMap(exists => {
          if (exists) {
            control.setErrors({ idExists: true });
          } else {
            control.setErrors(null);
          }
          return of(exists ? { idExists: true } : null);
        }),
        catchError(() => of(null))
      );
    };
  }
}
