import { Component, OnInit ,Renderer2, NgZone,HostListener} from '@angular/core';
import {Response} from '@angular/http';
import { HttpService} from '../http-service/http-service';
import {CardContainerComponent} from '../card-container/card-container.component';
import { R3TargetBinder } from '@angular/compiler';
import {DropdownitemComponent} from '../dropdownitem/dropdownitem.component';

@Component({
  selector: 'grid',
  template: `
  
  <div class="textBoxContainer"  [style.width]="wdth"  >
<input id='inputText'  [attr.tabindex]="0"  class="customTextbox" required  (keyup)="onTextChangedFunc($event)"   value={{inputVal}} />
<label class={{labelClass}} name='placeholder_label' (click)="labelClicked()">{{placeholder}}</label>

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


  @HostListener('click', ['$event'])
  onClick(e) {
    if(e.target.id!=='customDropDown')
    this.dropDownDisplay="none";
 }
  constructor(flickrServiceInstance:HttpService, private renderer: Renderer2,private ngZone: NgZone) { 
   this.serviceInstance=flickrServiceInstance;
     }

     totalSearchableList=[];
     //This is the trie generated for faster lookup
      completeTrie={};
      matchingListFromTrie=[];

      errorText='';
      placeholder='Search by available Tags or Names or Title....';
      labelClass='lbl'
      wdth="90%"

      inputVal='';
      dropDownDisplay="flex"
   ngOnInit() {    
    this.serviceInstance.getPublicFeed().subscribe((data:Response)=>
         {
           this.paramList.jsonResponse=data;           
          this.cardContainerFullData=data;
           this.createTrieForSearch= this.createTrieForSearch.bind(this);
           this.createTrieForSearch();
          //console.log(data)
        });
       ;
  }

  setFocus(selector: string): void {
    this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
            this.renderer.selectRootElement(selector).classList.add("")
            console.log(this.renderer.selectRootElement(selector));
        }, 0);
    });
}


  labelClicked()
  {
    this.labelClass='lbl_moved';
  }

  dropdownStartSelect()
  {
    if(this.matchingListFromTrie.length>0)
    {
//data-index
//this.setFocus('[data-index="0"]');
    }
  }

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
console.log(this.dictionaryOfKeyWordAndObjects);
this.paramList.jsonResponse=this.dictionaryOfKeyWordAndObjects[this.inputVal.toLocaleLowerCase()];
console.log(this.paramList.jsonResponse);
  }
  onTextChangedFunc(e)
  {
    this.inputVal=e.target.value;
    if(this.inputVal!=='')
    {
    let trieMatch=this.getFromTrie(e.target.value,this.completeTrie);
    this.matchingListFromTrie=[];
    for(let item of trieMatch)
    if(this.dictionaryOfKeyWordAndObjects.hasOwnProperty(item))
    this.matchingListFromTrie.push(item);
    
    if(this.matchingListFromTrie!==undefined && this.matchingListFromTrie.length>0)
    this.dropDownDisplay="flex";
    console.log(this.matchingListFromTrie);
    }
    else
    {this.paramList.jsonResponse=this.cardContainerFullData;this.dropDownDisplay="none";}
  }

   getFromTrie(inputText,fullTrie)
  {
    return this.findMatchingEntries(fullTrie,0,inputText.toLowerCase());
  }

findMatchingEntries(obj,currIndex,fullWord)
{
let currChar=fullWord[currIndex];
let nextObj={};
if(obj.hasOwnProperty(currChar))
{
  nextObj=obj[currChar]; currIndex++;
        if(currIndex<fullWord.length)
      return this.findMatchingEntries(nextObj,currIndex,fullWord);
      else
      {
        let wordArrReachableFromThisNode=[]; 
        this.getAllEOWFromThisNode(nextObj,wordArrReachableFromThisNode,5,fullWord)  //Max 5 entries 
        return wordArrReachableFromThisNode;
      }
}
else
return;
}

getAllEOWFromThisNode(obj,returnArr,entryCount,wordSoFar)
{
  if(obj!=={}){
if(obj.hasOwnProperty("EOW") && obj["EOW"])
{
  returnArr.push(wordSoFar);
  entryCount--;
}
        if(entryCount>0)
        {
        for(let i in obj )
            {
              if(i!=='value' && i!=='EOW')
              {
              wordSoFar=wordSoFar+obj[i].value;
              this.getAllEOWFromThisNode(obj[i],returnArr,entryCount,wordSoFar);
              entryCount--;
              }
            }
        }
        else
        return;
      }

}

dictionaryOfKeyWordAndObjects={};

createMapObject(targetMap,propertyName,value)
{
  let prop=propertyName.toLocaleLowerCase();
if(!targetMap.hasOwnProperty(prop))
targetMap[prop]=[];

targetMap[prop].push(value);
}

  createTrieForSearch()
  {
    let nameList=[],tagList=[],titleList=[];

    for (let item of this.cardContainerFullData)
    {
      console.log(item.author[0].name[0]);
      //Add Name
      nameList.push(item.author[0].name[0]);
      this.createMapObject(this.dictionaryOfKeyWordAndObjects,item.author[0].name[0],item);
     //Add categories
      let catList=item.category;
      for(let item1 of catList)
      {
      if(item1.$.term.trim()!=='')
      {
        tagList.push(item1.$.term);
         this.createMapObject(this.dictionaryOfKeyWordAndObjects,item1.$.term,item);
      }
      }
     //Add title
      titleList.push(item.title[0]);
      this.createMapObject(this.dictionaryOfKeyWordAndObjects,item.title[0],item);
    }
    this.totalSearchableList=nameList.concat(tagList).concat(titleList);
    console.log(this.totalSearchableList);
    this.completeTrie= this.generateDataStructure(this.totalSearchableList);
    console.log(this.completeTrie);
  }

  generateDataStructure(completeArr)
  {
    let returnTrie={};

    for(let item of completeArr)
        {     
    this.checkAndPushIntoTrie(returnTrie,0,item) ;          
       }
 console.log(completeArr);      
console.log(returnTrie);
    return returnTrie;
  }

  checkAndPushIntoTrie(obj,currIndex,fullWord)
{
  let target=fullWord[currIndex].toLowerCase();
  let nexObj={};

          if(!obj.hasOwnProperty(target))
          {
            obj[target]={value:target};                   
            nexObj=obj[target];  

            if(currIndex+1==fullWord.length) //EOW reached
            nexObj["EOW"]=true;  //Mark EOW node
          }
          else 
              nexObj=obj[target];          

                if(currIndex+1<fullWord.length)
                {
                  currIndex=currIndex+1;
                    return this.checkAndPushIntoTrie(nexObj,currIndex,fullWord);
                    
                }
                else
                      return  obj;

}

}
