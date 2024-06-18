import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/core/service/user.service';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {
  faqs:any
  enable:boolean =false
  searchTerm:string=""
  button:any="View";
  panelOpenState = false;
  constructor(public userService:UserService) { }
  ngOnInit(): void {
    this.getFAQByRating()
  }

  getFAQByRating(){
    this.userService
    .getFAQByRating(this.searchTerm)
    .subscribe((response: any) => {
      this.faqs = response.data;
    });
  }
}
