import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {

  constructor() {}

   imageObject = [
    {
      image: 'assets/img/Products-1.jpg',
      thumbImage: 'assets/img/Products-1.jpg',
      title: "Kannan",
      subtitle:
        "Excellent service! Highly satisfied with their work. Professional and timely. Will definitely recommend.",
    },
    {
      image: 'assets/img/Products-2.jpg',
      thumbImage: 'assets/img/Products-2.jpg',
      title: "Crown",
      subtitle:
        "Exceptional experience. They went above and beyond. Prompt communication and exceptional results.",
    },
    {
      image: 'assets/img/Products-3.jpg',
      thumbImage: 'assets/img/Products-3.jpg',
      title: "Kannan",
      subtitle:
        "Outstanding quality and professionalism. Highly recommend their services for exceptional outcomes.",
    },
    {
      image: 'assets/img/Products-4.jpg',
      thumbImage: 'assets/img/Products-4.jpg',
      title: "Kannan",
      subtitle:
        "Outstanding quality and professionalism. Highly recommend their services for exceptional outcomes.",
    },
    {
      image: 'assets/img/Products-5.jpg',
      thumbImage: 'assets/img/Products-5.jpg',
      title: "Crown",
      subtitle:
        "Outstanding quality and professionalism. Highly recommend their services for exceptional outcomes.",
    },
    {
      image: 'assets/img/Products-7.jpg',
      thumbImage: 'assets/img/Products-7.jpg',
      title: "Kannan",
      subtitle:
        "Outstanding quality and professionalism. Highly recommend their services for exceptional outcomes.",
    },
   ]

  ngOnInit(): void {
    }
   
}
