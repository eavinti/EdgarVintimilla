import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component'
import { ProductListComponent } from './dashboard/pages/product-list/product-list.component'
import { ProductFormComponent } from './dashboard/pages/product-form/product-form.component'

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => DashboardComponent,
    children: [
      {path: 'list', loadComponent: () => ProductListComponent,},
      {path: 'form', loadComponent: () => ProductFormComponent,},
      {path: 'form/:id', loadComponent: () => ProductFormComponent,},
      {path: '', redirectTo: 'list', pathMatch: 'full',},
    ]
  },
  {path: '', redirectTo: '/dashboard', pathMatch: 'full',},
];
