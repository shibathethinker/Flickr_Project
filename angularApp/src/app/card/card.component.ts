import { Component, OnInit,Input,OnChanges,ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'card',
  template: `  <img (mouseenter)="onMouseHover()" (mouseleave)="onMouseLeave()"  (click)="onImageClick()"  src={{imageSource.$.href}}/>
  <div class={{visibilty}}><label>{{imageName}}<span>{{separator}}</span>{{imageAuthor}}</label></div>

  <div class={{overlayClass}}  [style.width]="wdth">
  <a href="javascript:void(0)" class="closebtn" (click)="closeNav()">&times;</a>  
  <div class="overlay-content">
    <img  src={{imageSource.$.href}}/>
  </div>
</div>
  
  `,
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit,OnChanges {
@Input() paramList:any
//@ViewChild('scrollMe') private myScrollContainer: ElementRef;

imageSource:any;
visibilty="invisible";
imageLabel='';

wdth="0%"
overlayClass="overlay"

imageAuthor='';
imageName='';
separator="";

modalDisplay="modal_invisible";

  constructor() { }

  ngOnInit() {
  }
//   onMouseOverModal(e)
//   {
// e.preventDefault();
//   }

  closeNav()
  {
//this.overlayClass="overlay"
this.wdth="0%";
  }
  onImageClick()
  {
//this.modalDisplay="modal_visible"
//this.overlayClass="overlay_full"
this.wdth="100%";
  }

  modalClose()
  {
    this.modalDisplay="modal_invisible"
  }

onMouseHover()
{
this.visibilty="visible";
}

onMouseLeave()
{
  this.visibilty="invisible"
}

  ngOnChanges()
  {
    for(let item of this.paramList.link)
    {
      let type=item.$.type;
      if(type.indexOf("text/html")>=0)
      continue;
      else
      {
        this.imageSource=item;
                
        this.imageAuthor=this.paramList.author[0].name[0];
        if(this.paramList.title[0].trim()=="")
        {
          this.imageName="Author";
          this.separator=" : ";          
        }
        else
        {
          let fullTitle=this.paramList.title[0];
          this.imageName=fullTitle.length>10?fullTitle.substr(0,9)+"...":fullTitle;
          this.separator=" by ";
        }

        break;
      }
    }
    //console.log(this.paramList)
    //console.log(this.paramList.link[1].$.href);
  }
}
