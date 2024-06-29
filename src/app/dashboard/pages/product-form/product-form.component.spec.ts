import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';

import {ProductFormComponent} from './product-form.component';
import {ProductService} from '../../../services/product.service';

class MockProductService {
  getProductById(id: string) {
    return of({
      id: '1',
      name: 'Mock Product',
      description: 'Mock Description',
      logo: 'mock-logo-url',
      date_release: '2023-01-01',
      date_revision: '2024-01-01'
    });
  }

  verifyProductId(id: string) {
    return of(false);
  }

  createProduct(product: any) {
    return of({});
  }

  updateProduct(id: string, product: any) {
    return of({});
  }
}

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let mockProductService: MockProductService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ProductFormComponent],
      providers: [
        {provide: ProductService, useClass: MockProductService},
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '1' : null)
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    mockProductService = TestBed.inject(ProductService) as unknown as MockProductService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load product for editing on init', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.productForm.value.name).toBe('Mock Product');
    expect(component.productForm.get('id')?.disabled).toBe(true);
  });

  it('should validate and enable date_revision based on date_release', () => {
    const dateReleaseControl = component.productForm.get('date_release');
    const dateRevisionControl = component.productForm.get('date_revision');

    dateReleaseControl?.setValue('2023-01-01');
    fixture.detectChanges();
    expect(dateRevisionControl?.enabled).toBe(false);
    expect(dateRevisionControl?.value).toBe(null);
  });

});
