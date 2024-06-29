import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {of} from 'rxjs';

import {ProductListComponent} from './product-list.component';
import {ProductService} from '../../../services/product.service';
import {Product} from '../../../interfaces/product.interface';

class MockProductService {
  getProducts() {
    return of([
      {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        logo: 'url1',
        date_release: '2023-01-01',
        date_revision: '2024-01-01'
      },
      {
        id: '2',
        name: 'Product 2',
        description: 'Description 2',
        logo: 'url2',
        date_release: '2023-02-01',
        date_revision: '2024-02-01'
      }
    ]);
  }

  deleteProduct(id: string) {
    return of({});
  }
}

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: ProductService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        ProductListComponent  // Importar el componente como standalone
      ],
      providers: [
        {provide: ProductService, useClass: MockProductService}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    component.ngOnInit();
    expect(component.products.length).toBe(2);
    expect(component.totalProducts).toBe(2);
  });

  it('should filter products based on search input', () => {
    component.products = [
      {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        logo: 'url1',
        date_release: '2023-01-01',
        date_revision: '2024-01-01'
      },
      {
        id: '2',
        name: 'Product 2',
        description: 'Description 2',
        logo: 'url2',
        date_release: '2023-02-01',
        date_revision: '2024-02-01'
      }
    ];

    component.searchControl.setValue('Product 1');
    component.filterProducts();

    expect(component.displayedProducts.length).toBe(1);
    expect(component.displayedProducts[0].name).toBe('Product 1');
  });

  it('should paginate products based on results per page', () => {
    component.products = Array.from({length: 15}, (_, i) => ({
      id: `${i + 1}`,
      name: `Product ${i + 1}`,
      description: `Description ${i + 1}`,
      logo: `url${i + 1}`,
      date_release: '2023-01-01',
      date_revision: '2024-01-01'
    }));

    component.resultsPerPageControl.setValue('10');
    component.filterProducts();

    expect(component.displayedProducts.length).toBe(10);

    component.resultsPerPageControl.setValue('');
    component.filterProducts();

    expect(component.displayedProducts.length).toBe(15);
  });

  it('should show the context menu on toggle', () => {
    component.contextMenuVisible = [false, false];
    component.toggleContextMenu(1);
    expect(component.contextMenuVisible[1]).toBe(true);
  });

  it('should confirm delete product', () => {
    const product: Product = {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'url1',
      date_release: '2023-01-01',
      date_revision: '2024-01-01'
    };

    component.confirmDeleteProduct(product);
    expect(component.selectedProduct).toBe(product);
    expect(component.isModalVisible).toBe(true);
  });

  it('should cancel delete product', () => {
    component.isModalVisible = true;
    component.selectedProduct = {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'url1',
      date_release: '2023-01-01',
      date_revision: '2024-01-01'
    };

    component.cancelDelete();

    expect(component.isModalVisible).toBe(false);
    expect(component.selectedProduct).toBeNull();
  });
});
