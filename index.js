require("dotenv").config();
const NodeGeocoder = require('node-geocoder');
const request=require("request")

const accountSid = 'ACed2b13130e0f13db14e82bf79918f4c0';
const authToken = '1e810a36cdba4ac81fb8b57110405f19';
const client = require("twilio")(accountSid, authToken);

const { initializeApp } = require("@firebase/app");
const { getDatabase, ref, onValue } = require("@firebase/database");



const firebaseConfig = {
  apiKey: "AIzaSyBJckN6aQCxJCzwhFTeEdCL3NiH3HK2Ays",
  authDomain: "falldetection-9430d.firebaseapp.com",
  databaseURL:
    "https://falldetection-9430d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "falldetection-9430d",
  storageBucket: "falldetection-9430d.appspot.com",
  messagingSenderId: "741894320646",
  appId: "1:741894320646:web:35c6fe71eee789d10ec987",
  measurementId: "G-VTV8THDB9Q",
};
const location_call = {
  provider: 'google',
  httpAdapter: 'https', 
  apiKey: 'AIzaSyA5EDWX1Zp99tW6cnklYp4vDUURgbZVA6o',
  formatter: 'json' 
};
const app = initializeApp(firebaseConfig);

const db = getDatabase();

const dbref = ref(db, "test");

const geocoder = NodeGeocoder(location_call);

onValue(dbref, (s) => {
  // console.log(s)
  const data = s.val();
  console.log(data)
 
 
  // console.log(data[2])
  const post_body={
    wifiAccessPoints:data.wifiAccessPoints
  }
  
  // sleep
  function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
  // console.log(data.wifiAccessPoints)
  console.log(post_body)
  console.log(data["customerId"]);
  console.log(data["phoneNumber"]);
  

  // let date_ob = new Date();

  // let date = ("0" + date_ob.getDate()).slice(-2);


  // let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);


  // let year = date_ob.getFullYear();


  // let hours = date_ob.getHours();


  // let minutes = date_ob.getMinutes();


  // let seconds = date_ob.getSeconds();

  const send_body={
    url:'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyA5EDWX1Zp99tW6cnklYp4vDUURgbZVA6o',
    json:true,
    body:post_body

  }
  const link='https://www.google.com/maps/place/'
  request.post(send_body,(err,res,body)=>{
    if(err){
      return console.log(err)
    }
    console.log(`Latitude: ${body.location.lat}`)
    console.log(`Longitude: ${body.location.lng}`)
    

    geocoder.reverse({lat:body.location.lat, lon:body.location.lng}, function(err, res) {
      console.log(res);
      // sleep(30000);
      client.messages.create({body: `Accident detected for ${data.Name} on: ${data.date} ${data.time}
at location - Latitude ${body.location.lat} & Latitude ${body.location.lng}
Address:- 
Neighbourhood: ${res[0].extra.neighborhood}
AdministrativeLevels: ${res[0].administrativeLevels.level1long}
City- ${res[0].city} ZipCode- ${res[0].zipcode} Country- ${res[0].country}

Link google maps :- ${link+body.location.lat+"N"+"+"+body.location.lng+"E/"}`, from: '+18596666671', to: `+91${data['phoneNumber']}`})
.then(message => console.log(message));
  })
  
    });
    

    

  

// client.messages.create({body: `Accident detected for ${data.Name} on: ${date}/${month}/${year} ${hours}:${minutes}:${seconds}
  
//   at location - ${JSON.stringify(data.wifiAccessPoints)}`, from: '+14245872655', to: `+91${data['phoneNumber']}`})
// .then(message => console.log(message));



 
});
