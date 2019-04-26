import { Component, OnInit ,Renderer2, NgZone,HostListener} from '@angular/core';
import {Response} from '@angular/http';
import { HttpService} from '../http-service/http-service';
import {CardContainerComponent} from '../card-container/card-container.component';
import { R3TargetBinder } from '@angular/compiler';
import {DropdownitemComponent} from '../dropdownitem/dropdownitem.component';
import {getFromTrie,createTrieForSearch} from '../Helpers/Trie';

@Component({
  selector: 'grid',
  template: `
  
  <div class="textBoxContainer"  [style.width]="wdth"  >
<input id='inputText'  [attr.tabindex]="0"  class="customTextbox" required (keyup)="onTextChangedFunc($event)"   value={{inputVal}} />
<label class={{labelClass}} name='placeholder_label' (click)="labelClicked()">{{placeholder}}</label>
<a href="javascript:void(0)" class={{closeBtnClass}}  (click)="clearInput()">&times;</a>  

<div id="customDropDown" class="customDropDown"  [style.display]="dropDownDisplay" attr.tabindex="-1">
<dropdownitem  (outList)="dropDownSelected($event)" class="dropDownItems"  attr.data-index={{i}} attr.tabindex={{i}} 
*ngFor="let suggestion of matchingListFromTrie;let i=index" [paramList]="suggestion" ></dropdownitem>
</div>

<label id='inputError'  class="err">{{errorText}}</label>
</div>

  <div *ngIf="!paramList.jsonResponse"><label>Loading......</label></div>
  <card-container *ngIf="paramList.jsonResponse" [paramList]="paramList.jsonResponse"></card-container>  

  ` 
  ,
  styleUrls: ['./grid.component.css']  
})

export class GridComponent implements OnInit {
  serviceInstance:HttpService;

  paramList={jsonResponse:null};
  cardContainerFullData=null;
  totalSearchableList=[];
  //This is the trie generated for faster lookup
   completeTrie={};
   matchingListFromTrie=[];

   errorText='';
   placeholder='Search by available Tags or Names or Titles....';
   labelClass='lbl'
   wdth="90%"
   dictionaryOfKeyWordAndObjects={};
   closeBtnClass="closeBtnHiddn";
   inputVal='';
   dropDownDisplay="flex"
   createTrieForSearch;

  @HostListener('click', ['$event'])
  onClick(e) {
    if(e.target.id!=='customDropDown')
    this.dropDownDisplay="none";
 }
  constructor(flickrServiceInstance:HttpService, private renderer: Renderer2,private ngZone: NgZone) { 
   this.serviceInstance=flickrServiceInstance;
     }

     
   ngOnInit() {    
    this.serviceInstance.getPublicFeed().subscribe((data:Response)=>
         {
           this.paramList.jsonResponse=data;           
          this.cardContainerFullData=data;
           this.createTrieForSearch= createTrieForSearch.bind(this);
           this.completeTrie=this.createTrieForSearch(this.cardContainerFullData,this.dictionaryOfKeyWordAndObjects,this.totalSearchableList,this.completeTrie);
          //console.log(this.completeTrie)
        });
       ;
  }

  //Called by the clear text button from the input
  clearInput()
  {
    this.inputVal='';
    this.closeBtnClass="closeBtnHiddn";
    console.debug('calling...')
    this.onTextChangedFunc({target:{value:''}});
  }

//   setFocus(selector: string): void {
//     this.ngZone.runOutsideAngular(() => {
//         setTimeout(() => {
//             this.renderer.selectRootElement(selector).classList.add("")
//             console.log(this.renderer.selectRootElement(selector));
//         }, 0);
//     });
// }


  labelClicked()
  {
    this.labelClass='lbl_moved';
  }

//   dropdownStartSelect()
//   {
//     if(this.matchingListFromTrie.length>0)
//     {
// //data-index
// //this.setFocus('[data-index="0"]');
//     }
//   }

  dropdownfocusout(e)
  {
    //console.log(e.target.id);
    if(e.target.id!=='customDropDown')
    this.dropDownDisplay="none";
  }
  dropDownSelected(e)
  {
this.inputVal=e;
this.dropDownDisplay="none";
//console.log(this.dictionaryOfKeyWordAndObjects);
this.paramList.jsonResponse=this.dictionaryOfKeyWordAndObjects[this.inputVal.toLocaleLowerCase()];
//console.log(this.paramList.jsonResponse);
  }

  onTextChangedFunc(e)
  {
    console.log(e);
    this.inputVal=e.target.value;
    if(this.inputVal!=='')
    {
      this.closeBtnClass="closeBtn";
    let trieMatch=getFromTrie(e.target.value,this.completeTrie);
    this.matchingListFromTrie=[];
    for(let item of trieMatch)
    //if(this.dictionaryOfKeyWordAndObjects.hasOwnProperty(item))
    this.matchingListFromTrie.push(item);
    
    if(this.matchingListFromTrie!==undefined && this.matchingListFromTrie.length>0)
    this.dropDownDisplay="flex";
    console.log(this.matchingListFromTrie);
    }
    else
    {this.paramList.jsonResponse=this.cardContainerFullData;this.dropDownDisplay="none";}
  }  



}
