import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-client-review",
  templateUrl: "./client-review.component.html",
  styleUrls: ["./client-review.component.css"],
})
export class ClientReviewComponent implements OnInit {
  constructor() {}

  imageObject = [
    {
      image: "assets/img/black.jpg",
      thumbImage: "assets/img/black.jpg",
      // title: "John Doe",
      title:
        "Excellent service! Highly satisfied with their work. Professional and timely. Will definitely recommend.",
    },
    {
      image: "assets/img/black.jpg",
      thumbImage: "assets/img/black.jpg",
      // title: "Jane Smith",
      title:
        "Exceptional experience. They went above and beyond. Prompt communication and exceptional results.",
    },
    {
      image: "assets/img/black.jpg",
      thumbImage: "assets/img/black.jpg",
      // title: "Robert Johnson",
      title:
        "Outstanding quality and professionalism. Highly recommend their services for exceptional outcomes.",
      
      },
  ];

  ngOnInit(): void {}
}
