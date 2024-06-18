import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';


@Component({
  selector: 'app-manage-service-breakdown',
  templateUrl: './manage-service-breakdown.component.html',
  styleUrls: ['./manage-service-breakdown.component.scss']
})
export class ManageServiceBreakdownComponent implements OnInit {

  constructor(
    private router:Router,
    private route:ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

}
