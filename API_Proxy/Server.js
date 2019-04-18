const express = require('express')
const request = require('request-promise-native')
var cors = require('cors');
const app = express();
const _GUID='b6242120-5bce-4b10-9839-d3045a7682da';
const _PORT=8100;

app.use(cors()); 

app.get('/Names', async (req, res) => {
  try{
  let url=`https://abr.business.gov.au/json/MatchingNames.aspx?name=${req.query.name}&maxResults=10&guid=${_GUID}`;
  const user = await request(url)
  let pos=user.toString().indexOf("Names");  
  let resjson=user.substr(pos+"Names\":".length,user.substr(pos+"Names\":".length).lastIndexOf("}"))
  res.json(resjson)
  }
  catch(err)
  {res.json('error')}
})

app.get('/ABN', async (req, res) => {
  try{
      let url=`https://abr.business.gov.au/json/AbnDetails.aspx?abn=${req.query.abn}&maxResults=10&guid=${_GUID}`;
      const user = await request(url)
      let pos=user.toString().indexOf("(");
      let ret=user.substr(pos+1,user.substr(pos+1).lastIndexOf(")"))
      res.json("["+ret+"]");
  }
  catch(err)
  {res.json('error')}
    })

app.listen(_PORT);