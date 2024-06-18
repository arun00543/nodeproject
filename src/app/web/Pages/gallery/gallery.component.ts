import { Component, OnInit } from "@angular/core";

interface GalleryItem {
  image: {
    url: string;
  };
  head: string;
  paragraph: string;
  isLeft: boolean;
}
@Component({
  selector: "app-gallery",
  templateUrl: "./gallery.component.html",
  styleUrls: ["./gallery.component.css"],
})
export class GalleryComponent implements OnInit {
  galleryItems: Array<GalleryItem>
  constructor() {}

  ngOnInit() {
    this.galleryItems = [
      {
        image: { url: "assets/img/Products-4.jpg" },
        head: "Experience the delight",
        paragraph:
          "Experience the delight of exquisite fruits, carefully picked at their peak of freshness, ensuring a symphony of flavors and a treasure trove of essential nutrients. These fruits are a testament to nature s bounty, bringing vitality and lusciousness to every bite. Experience the delight of exquisite fruits, carefully picked at their peak of freshness, ensuring a symphony of flavors and a treasure trove of essential nutrients. These fruits are a testament to nature s bounty, bringing vitality and lusciousness to every bite",
        isLeft: false,
      },
      {
        image: { url: "assets/img/Products-5.jpg" },
        head: "Experience the delight",
        paragraph:
          "Experience the delight of exquisite fruits, carefully picked at their peak of freshness, ensuring a symphony of flavors and a treasure trove of essential nutrients. These fruits are a testament to nature s bounty, bringing vitality and lusciousness to every bite. Experience the delight of exquisite fruits, carefully picked at their peak of freshness, ensuring a symphony of flavors and a treasure trove of essential nutrients. These fruits are a testament to nature s bounty, bringing vitality and lusciousness to every bite",
        isLeft: true,
      },
      {
        image: { url: "assets/img/Products-1.jpg" },
        head: "Experience the delight",
        paragraph:
          "Experience the delight of exquisite fruits, carefully picked at their peak of freshness, ensuring a symphony of flavors and a treasure trove of essential nutrients. These fruits are a testament to nature s bounty, bringing vitality and lusciousness to every bite. Experience the delight of exquisite fruits, carefully picked at their peak of freshness, ensuring a symphony of flavors and a treasure trove of essential nutrients. These fruits are a testament to nature s bounty, bringing vitality and lusciousness to every bite",
        isLeft: false,
      },
      {
        image: { url: "assets/img/Products-5.jpg" },
        head: "Experience the delight",
        paragraph:
          "Experience the delight of exquisite fruits, carefully picked at their peak of freshness, ensuring a symphony of flavors and a treasure trove of essential nutrients. These fruits are a testament to nature s bounty, bringing vitality and lusciousness to every bite. Experience the delight of exquisite fruits, carefully picked at their peak of freshness, ensuring a symphony of flavors and a treasure trove of essential nutrients. These fruits are a testament to nature s bounty, bringing vitality and lusciousness to every bite",
        isLeft: true,
      },
      {
        image: { url: "assets/img/Products-1.jpg" },
        head: "Experience the delight",
        paragraph:
          "Experience the delight of exquisite fruits, carefully picked at their peak of freshness, ensuring a symphony of flavors and a treasure trove of essential nutrients. These fruits are a testament to nature s bounty, bringing vitality and lusciousness to every bite. Experience the delight of exquisite fruits, carefully picked at their peak of freshness, ensuring a symphony of flavors and a treasure trove of essential nutrients. These fruits are a testament to nature s bounty, bringing vitality and lusciousness to every bite",
        isLeft: false,
      },
    ];
  }

  
}
