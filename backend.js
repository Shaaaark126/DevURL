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

var gotstring = ""
var code = ""
var area = ""

let thetext
let crimeObject
const genAI = new GoogleGenerativeAI(process.env.GAPI_KEY);

async function gemini(prompt) {
    
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const result = await model.generateContent(prompt);
  const response = await result.response;
  thetext = response.text();
    console.log(thetext);
}


// Function to retrieve latitude and longitude for a given area name
function getCoordinates(area) {
  const coordinates = communityCoordinates[area];
  if (coordinates) {
    return coordinates; // Return an object with latitude and longitude
  } else {
    return null; // Return null if areaName doesn't exist in the object
  }
}

app.post('/submit-area-code', async (req, res) => {

    gotstring = req.body.area
    code = gotstring.slice(0,2)
    area = gotstring.slice(3)
    console.log(code," and ", area)

    const coordinates = getCoordinates(area);
  if (coordinates) {
    console.log(`Latitude: ${coordinates.latitude}, Longitude: ${coordinates.longitude}`);
  } 
  else {
  console.log(`No coordinates found for ${area}`);
  }

  var theprompt = `Among all other community districts in Chicago, give a percentage possibility of crime in ${area} Give output like this Possibility of crime:(answer)  Most Likely type of crime to occur(only one answer)`;

  
    console.log(theprompt)
  
    await gemini(theprompt)

  
    let possibilityIndex = thetext.indexOf("Possibility of crime: ") + "Possibility of crime: ".length;
    let typeIndex = thetext.indexOf("Most Likely type of crime to occur: ") + "Most Likely type of crime to occur: ".length;
    
    // Extracting data
    let possibilitySubstring = thetext.substring(possibilityIndex, thetext.indexOf("%", possibilityIndex));
    let typeSubstring = thetext.substring(typeIndex);

    crimeObject = {
      possibility: parseFloat(possibilitySubstring), // Convert possibility to a float
      type: typeSubstring.trim(), // Remove leading/trailing spaces
      ttext: thetext
  };

console.log(crimeObject.possibility)
console.log(crimeObject.type)

  res.redirect('/result')
});

/*async function findPoliceStations() {
  try {
    const response = await axios.post('https://places.googleapis.com/v1/places:searchNearby', {
      includedTypes: ['police'],
      maxResultCount: 10,
      locationRestriction: {
        circle: {
          center: {
            latitude: 19.2183,
            longitude: 72.9781
          },
          radius: 10000.0
        }
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GAPI_KEY,
        'X-Goog-FieldMask': 'places.displayName'
      }
    });

    // Handle response
    console.log('Police Stations near',);
    response.data.places.forEach(place => {
      console.log(place.displayName);
    });
  } catch (error) {
    console.error('Error fetching coffee shops:', error.message);
  }
}

findPoliceStations();*/

app.get('/result', (req,res) => {

  res.render('result', { crimeObject });
})

app.get('/', (req,res) => {

    res.render("index.ejs")
})
app.listen(3000, () => {

    console.log("Port is running")
})

  
