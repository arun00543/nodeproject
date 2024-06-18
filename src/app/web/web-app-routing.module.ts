import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./Pages/home/home.component";
import { AboutComponent } from "./Pages/about/about.component";
import { GalleryComponent } from "./Pages/gallery/gallery.component";
import { ProductsComponent } from "./Pages/products/products.component";
import { ContactComponent } from "./Pages/contact/contact.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  { path: "home", component: HomeComponent },
  { path: "about-us", component: AboutComponent },
  { path: "gallery", component: GalleryComponent },
  { path: "products", component: ProductsComponent },
  { path: "contact", component: ContactComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebAppRoutingModule {}
