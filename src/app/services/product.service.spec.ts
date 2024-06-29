import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {ProductService} from './product.service';
import {Product} from '../interfaces/product.interface';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products', () => {
    const mockProducts: Product[] = [
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

    service.getProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products');
    expect(req.request.method).toBe('GET');
    req.flush({data: mockProducts});
  });

  it('should verify product id', () => {
    service.verifyProductId('1').subscribe(isValid => {
      expect(isValid).toBeTrue();
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products/verification/1');
    expect(req.request.method).toBe('GET');
    req.flush('true');
  });

  it('should create a product', () => {
    const newProduct: Product = {
      id: '3',
      name: 'Product 3',
      description: 'Description 3',
      logo: 'url3',
      date_release: '2023-03-01',
      date_revision: '2024-03-01'
    };

    service.createProduct(newProduct).subscribe(response => {
      expect(response).toEqual(newProduct);
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products');
    expect(req.request.method).toBe('POST');
    req.flush(newProduct);
  });

  it('should fetch product by id', () => {
    const product: Product = {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'url1',
      date_release: '2023-01-01',
      date_revision: '2024-01-01'
    };

    service.getProductById('1').subscribe(fetchedProduct => {
      expect(fetchedProduct).toEqual(product);
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products/1');
    expect(req.request.method).toBe('GET');
    req.flush(product);
  });

  it('should update a product', () => {
    const updatedProduct: Product = {
      id: '1',
      name: 'Updated Product 1',
      description: 'Updated Description 1',
      logo: 'updatedUrl1',
      date_release: '2023-01-01',
      date_revision: '2024-01-01'
    };

    service.updateProduct('1', updatedProduct).subscribe(response => {
      expect(response).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedProduct);
  });

  it('should delete a product', () => {
    service.deleteProduct('1').subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
