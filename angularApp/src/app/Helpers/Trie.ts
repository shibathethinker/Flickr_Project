
function    createMapObject(targetMap,propertyName,value)
{
  let prop=propertyName.toLocaleLowerCase();
if(!targetMap.hasOwnProperty(prop))
targetMap[prop]=[];

targetMap[prop].push(value);
}

export function   getFromTrie(inputText,fullTrie)
{
return findMatchingEntries(fullTrie,0,inputText.toLowerCase());
}

function findMatchingEntries(obj,currIndex,fullWord)
{
let currChar=fullWord[currIndex];
debugger;
let nextObj={};
if(obj.hasOwnProperty(currChar))
{
  nextObj=obj[currChar]; currIndex++;
        if(currIndex<fullWord.length)
      return findMatchingEntries(nextObj,currIndex,fullWord);
      else
      {
        let wordArrReachableFromThisNode=[]; 
        getAllEOWFromThisNode(nextObj,wordArrReachableFromThisNode,5,fullWord)  //Max 5 entries 
        return wordArrReachableFromThisNode;
      }
}
else
return;
}

function getAllEOWFromThisNode(obj,returnArr,entryCount,wordSoFar)
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
              //wordSoFar=wordSoFar+obj[i].value;
              let temp=wordSoFar+obj[i].value;
              getAllEOWFromThisNode(obj[i],returnArr,entryCount,temp);
              entryCount--;
              }
            }
        }
        else
        return;
      }

}

export function createTrieForSearch(fullData,dictionaryOfKeyWordAndObjects,totalSearchableList,completeTrie)
  {
    let nameList=[],tagList=[],titleList=[];

    for (let item of fullData)
    {
//      console.log(item.author[0].name[0]);
      //Add Name
      nameList.push(item.author[0].name[0]);
      createMapObject(dictionaryOfKeyWordAndObjects,item.author[0].name[0],item);
     //Add categories
      let catList=item.category;
      for(let item1 of catList)
      {
      if(item1.$.term.trim()!=='')
      {
        tagList.push(item1.$.term);
         createMapObject(dictionaryOfKeyWordAndObjects,item1.$.term,item);
      }
      }
     //Add title
      titleList.push(item.title[0]);
      createMapObject(dictionaryOfKeyWordAndObjects,item.title[0],item);
    }
    totalSearchableList=nameList.concat(tagList).concat(titleList);
    //console.log(totalSearchableList);
    completeTrie= generateDataStructure(totalSearchableList);
    return completeTrie;
    //console.log(completeTrie);
  }

function     generateDataStructure(completeArr)
  {
    let returnTrie={};

    for(let item of completeArr)
        {     
    checkAndPushIntoTrie(returnTrie,0,item) ;          
       }       
  //console.log('checking....')     
 //console.log(completeArr);      
//console.log(returnTrie);
    return returnTrie;
  }

function checkAndPushIntoTrie(obj,currIndex,fullWord)
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
                    return checkAndPushIntoTrie(nexObj,currIndex,fullWord);
                    
                }
                else
                      return  obj;

}


