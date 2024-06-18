import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  unitCount = 0;
  workerCount = 0;
  tonCount = 0;
  factoryImg = "assets/img/about-section.jpg";

  constructor(){}

  ngOnInit(){
    this.updateCountWithAnimation();
  }

  updateCountWithAnimation(): void {
    const targetUnitCount = 3;
    const targetWorkerCount = 100;
    const targetTonCount = 720;

    const animationDuration = 5000; // 10 seconds in milliseconds
    const steps = 50; // Number of steps (frames) to achieve the desired duration
    const increment = {
      unit: targetUnitCount / steps,
      worker: targetWorkerCount / steps,
      ton: targetTonCount / steps
    };

    let currentStep = 0;

    const interval = setInterval(() => {
      this.unitCount += Math.floor(increment.unit);
      this.workerCount += Math.floor(increment.worker);
      this.tonCount += Math.floor(increment.ton);

      currentStep++;

      if (currentStep >= steps) {
        clearInterval(interval);
        this.unitCount = targetUnitCount;
        this.workerCount = targetWorkerCount;
        this.tonCount = targetTonCount;
      }
    }, animationDuration / steps);
  }

  galleryItems = [
    {
      image: { url: 'assets/Sliders/Videos/Flex-Video1.gif' },
      head: 'Radha Krishna Gram Flour: The Secret Ingredient for Besan Burfi Varieties',
      paragraph:
        'Radha Krishna Gram Flour is the key ingredient in crafting a variety of mouthwatering besan burfi varieties that will tantalize your taste buds. At Radha Krishna Gram Flour, we are passionate about delivering the finest quality gram flour to elevate your culinary experiences. Our extensive range of besan burfi is the result of our dedication to traditional recipes and the use of premium Radha Krishna Gram Flour.',
      points: [
        'Nutrient-Rich: Radha Krishna Gram Flour is a good source of essential nutrients, including protein, fiber, iron, and vitamins. It provides a nutritious base for your besan burfi treats.',
        'Gluten-Free: Gram flour is naturally gluten-free, making it a suitable choice for individuals with gluten sensitivities or those seeking alternative flours.',
        'Weight Management: The high protein and fiber content in gram flour can help with satiety and weight management by reducing overall calorie intake.',
      ],
      isLeft: false,
    },
    {
      image: { url: 'assets/Sliders/Videos/Flex-Video2.gif' },
      head: 'Kannan Urid Dhal: The Versatile Ingredient for Delicious Snacks',
      paragraph: 'Kannan Urid Dhal is the perfect ingredient for crafting a variety of delicious and nutritious snacks. Its mild flavor and creamy texture make it a versatile ingredient that can be used in a variety of recipes, from savory to sweet.',
      points: [
        'High in Protein: Urid dhal is a good source of protein, which is essential for building and repairing muscle tissue.',
        'Rich in Fiber: Urid dhal is also a good source of fiber, which helps to keep you feeling full and satisfied.',
        'Gluten-Free: Urid dhal is naturally gluten-free, making it a suitable choice for individuals with gluten sensitivities or those seeking alternative flours.',
        'Affordable: Urid dhal is a relatively affordable ingredient, making it a budget-friendly option for creating healthy and delicious snacks.'
      ],
      isLeft: true,
    },
    {
      image: { url: 'assets/Sliders/Videos/Flex-Video3.gif' },
      head: 'Kannan Urid Dhal: The Essential Ingredient for Dosa and Idli',
      paragraph: 'Kannan Urid Dhal is the essential ingredient for crafting two of India\'s most popular breakfast dishes, dosa and idli. Its unique flavor and texture is what gives dosa and idli their signature taste and texture.',
      points: [
        'Authentic Flavor: Kannan Urid Dhal is sourced from India and is known for its authentic flavor and quality.',
        'Easy to Digest: Urid dhal is relatively easy to digest, making it a good choice for people with sensitive stomachs.',
        'Versatile: Urid dhal can also be used to make other popular Indian dishes, such as vada and sambar.'
      ],
      isLeft: false,
    },
    {
      image: { url: 'assets/Sliders/Videos/Flex-Video4.gif' },
      head: 'Radha Kirshna Gram Flour: Snacks',
      paragraph: 'Radha Krishna Gram Flour is a healthy and delicious alternative to traditional snacks. Its high protein and fiber content makes it a satisfying snack that will keep you feeling full and energized.',
      points: [
        'Nutritious: Gram flour is a good source of protein, fiber, iron, and vitamins. It provides a nutritious snack that will benefit your overall health.',
        'Gluten-Free: Gram flour is naturally gluten-free, making it a suitable choice for individuals with gluten sensitivities or those seeking alternative flours.',
        'Versatile: Gram flour can be used to make a variety of snacks, such as chila, pakoras, and dhokla.'
      ],
      isLeft: true,
    },
    {
      image: { url: 'assets/Sliders/Videos/Flex-Video5.gif' },
      head: 'Radha Kirshna Gram Flour: Trick or Treat With Sweat',
      paragraph: 'Radha Kirshna Gram Flour is the perfect ingredient for crafting healthy and delicious Halloween treats. Its high protein and fiber content will help to satisfy your sweet tooth without leaving you feeling sluggish.',
      points: [
        'Healthy Alternative: Gram flour is a healthy alternative to traditional Halloween treats, such as candy and sugary baked goods.',
        'Nutrient-Rich: Gram flour is a good source of protein, fiber, iron, and vitamins. It provides a nutritious snack that will benefit your overall health.',
        'Versatile: Gram flour can be used to make a variety of Halloween treats, such as besan burfi, ladoos, and more.'
      ],
      isLeft: false,
    },
  ];

}

