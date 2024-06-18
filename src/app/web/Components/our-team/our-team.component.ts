import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-our-team',
  templateUrl: './our-team.component.html',
  styleUrls: ['./our-team.component.css'],
  animations: [
    trigger('cardHover', [
      state('hovered', style({
        transform: 'scale(1)'
      })),
      state('notHovered', style({
        transform: 'scale(1)'
      })),
      transition('notHovered <=> hovered', [
        animate('0.5s ease')
      ])
    ]),
    trigger('socialIconsFade', [
      state('visible', style({
        opacity: 1
      })),
      state('hidden', style({
        opacity: 0
      })),
      transition('hidden <=> visible', [
        animate('1s ease')
      ])
    ])
  ]
})
export class OurTeamComponent {
  isHovered: boolean[] = [false, false];

  toggleHover(index: number): void {
    this.isHovered[index] = !this.isHovered[index];
  }
}
