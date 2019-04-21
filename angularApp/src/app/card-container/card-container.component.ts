import { Component, OnInit, Input, OnChanges } from '@angular/core';
import {CardComponent} from '../card/card.component';

@Component({
  selector: 'card-container',
  template: `<card *ngFor="let item of paramList" [paramList]="item"></card> `,
  styleUrls: ['./card-container.component.css']
})
export class CardContainerComponent implements OnInit,OnChanges {
@Input() paramList:any

  constructor() { 
//console.log(this.paramList);
  }
  ngOnInit() {
  }

  ngOnChanges()
  {
    //console.log(this.paramList);
  }

}
