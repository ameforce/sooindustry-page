import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ComponentsComponent } from './components.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ProductsComponent } from './products/products.component';
import { CustomerSupportComponent } from './customer-support/customer-support.component';

@NgModule({
  declarations: [
    ComponentsComponent,
    AboutUsComponent,
    ProductsComponent,
    CustomerSupportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    RouterModule
  ],
  exports: [ ComponentsComponent ]
})
export class ComponentsModule { }
