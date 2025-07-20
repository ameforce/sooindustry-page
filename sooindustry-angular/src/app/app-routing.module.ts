import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ProductsComponent } from './components/products/products.component'
import { CustomerSupportComponent } from './components/customer-support/customer-support.component';
import { IconDemoComponent } from './components/icon-demo/icon-demo.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',             component: HomeComponent },
  { path: 'about-us',         component: AboutUsComponent },
  { path: 'products',         component: ProductsComponent },
  { path: 'customer-support', component: CustomerSupportComponent },
  { path: 'icon-demo',        component: IconDemoComponent },
  { path: '**',               redirectTo: 'home' } // 404 페이지 처리
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      enableTracing: false,
      scrollPositionRestoration: 'top'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
