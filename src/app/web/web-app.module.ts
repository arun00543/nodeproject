
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WebAppRoutingModule } from './web-app-routing.module';
import { HomeComponent } from './Pages/home/home.component';
import { AboutComponent } from './Pages/about/about.component';
import { GalleryComponent } from './Pages/gallery/gallery.component';
import { ProductsComponent } from './Pages/products/products.component';
import { ContactComponent } from './Pages/contact/contact.component';
import { HeaderComponent } from './Components/header/header.component';
import { FooterComponent } from './Components/footer/footer.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { SliderComponent } from './Components/slider/slider.component';
import {MatSelectModule} from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgOptimizedImage } from '@angular/common';
import { WelcomeComponent } from './Components/welcome/welcome.component';
import { ClientReviewComponent } from './Components/client-review/client-review.component';
import { OurTeamComponent } from './Components/our-team/our-team.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmbeddedMapComponent } from './Components/embedded-map/embedded-map.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { ContactFormComponent } from './Components/contact-form/contact-form.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { RecipesComponent } from './Components/recipes/recipes.component';
import { OurBrandComponent } from './Components/our-brand/our-brand.component';


@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    GalleryComponent, 
    ProductsComponent,
    ContactComponent,
    HeaderComponent,
    FooterComponent,
    NavbarComponent,
    SliderComponent,
    WelcomeComponent,
    ClientReviewComponent,
    OurTeamComponent,
    EmbeddedMapComponent,
    ContactFormComponent,
    RecipesComponent,
    OurBrandComponent
  ],
  imports: [
    BrowserModule,
    WebAppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule,
    MatSelectModule,
    NgOptimizedImage,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    NgImageSliderModule,
    NgxSpinnerModule
  ],
  providers: [NgImageSliderModule],
  exports : [
    HeaderComponent,
    NavbarComponent,
    FooterComponent
  ]
})
export class WebAppModule { }
