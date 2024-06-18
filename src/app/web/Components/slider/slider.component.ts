import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {

  constructor() { }

  imageObject = [
    {
      image: 'assets/Sliders/slider/slider1.png',
      thumbImage: 'assets/Sliders/slider/slider1.png',
      title: ''
    },{
      image: 'assets/Sliders/slider/kannan.png',
      thumbImage: 'assets/Sliders/slider/kannan.png',
      title: ''
    }, {
      image: 'assets/Sliders/slider/crown.png',
      thumbImage: 'assets/Sliders/slider/crown.png',
      title: ''
    }, {
      image: 'assets/Sliders/slider/balaji.png',
      thumbImage: 'assets/Sliders/slider/balaji.png',
      title: ''
    }];

  ngOnInit(): void { }

}
