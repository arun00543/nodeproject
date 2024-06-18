import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-service-breakdown',
  templateUrl: './add-service-breakdown.component.html',
  styleUrls: ['./add-service-breakdown.component.scss']
})
export class AddServiceBreakdownComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

}
