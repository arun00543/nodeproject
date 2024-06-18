import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {
  ispopup =false;
  currentSrc : string ='assets/Sliders/Videos/Facts-UrithDal.mp4';
  constructor() { }

  ngOnInit(): void {
  }

  togglePopup() {
    document.getElementById("video-popup").remove();
  }
  
  playVideo(event:Event, popup?) {
    const target = event.currentTarget as HTMLElement;
    const video = target.querySelector('video');
    this.currentSrc = video.currentSrc//.slice(22);
    if(popup){
      this.ispopup = true;  
      video.play();  
    } else {
    this.ispopup = false;    
      video.play();
    }
  }

  pauseVideo(event: Event) {
    const target = event.currentTarget as HTMLElement;
    const video = target.querySelector('video') as HTMLVideoElement;
    video.pause();

  }
}
