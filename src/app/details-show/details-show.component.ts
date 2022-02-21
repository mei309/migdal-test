import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-details-show',
  templateUrl: './details-show.component.html'
})
export class DetailsShowComponent implements OnInit {
  @Input() insured: any;
  constructor() { }

  ngOnInit(): void {
  }

}

