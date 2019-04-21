import { Component, OnInit ,Input, Output,EventEmitter} from '@angular/core';

@Component({
  selector: 'dropdownitem',
  template:`<div (click)="returnSelectedVal()">{{paramList}}</div>`,
  styleUrls: ['./dropdownitem.component.css']
})
export class DropdownitemComponent implements OnInit {
@Input() paramList:any;
@Output() outList=new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    //console.log(this.paramList)
  }


  returnSelectedVal()
  {
this.outList.emit(this.paramList);
  }
}
