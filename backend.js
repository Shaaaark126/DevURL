const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.static('public'));
const axios = require('axios');
const bodyParser = require('body-parser');
app.set('view engine', 'ejs');

const communityCoordinates = require('./latlongs.js')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var area = ""

let thetext
let crimeObject

const genAI = new GoogleGenerativeAI(process.env.GAPI_KEY);

async function gemini(prompt) {
    
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const result = await model.generateContent(prompt);
  const response = await result.response;
  thetext = response.text();
}

app.post('/submit-area-code', async (req, res) => {

    var gotstring = req.body.area
    area = gotstring.slice(3)

  var theprompt = `Among all other community districts in Chicago, give a percentage possibility of crime in ${area} Give output like this Possibility of crime:(answer)  Most Likely type of crime to occur(only one answer)`;

    console.log(theprompt)
  
    await gemini(theprompt) 
  
    let possibilityIndex = thetext.indexOf("Possibility of crime: ") + "Possibility of crime: ".length;
    let typeIndex = thetext.indexOf("Most Likely type of crime to occur: ") + "Most Likely type of crime to occur: ".length;
    
    let possibilitySubstring = thetext.substring(possibilityIndex, thetext.indexOf("%", possibilityIndex));
    let typeSubstring = thetext.substring(typeIndex);

    crimeObject = {
      possibility: parseFloat(possibilitySubstring), 
      type: typeSubstring.trim(), 
      ttext: thetext,
      tarea: area
  };

console.log(crimeObject.possibility)
console.log(crimeObject.type)

  res.redirect('/result')
});

app.get('/result', (req,res) => {

  res.render('result', { crimeObject });
})

app.get('/location',(req,res) => {

  res.render('geo.ejs');

})

app.get('/table',(req,res) => {

  res.render('table.ejs');

})

app.get('/outreach', (req,res) => {

  res.render("outreach.ejs");
})

app.get('/', (req,res) => {

    res.render("index.ejs")
})
app.listen(3000, () => {

    console.log("Port is running")
})

  
