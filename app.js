"use strict"

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require("dotenv").config();
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const randomstring = require("randomstring");
const cors = require('cors');
const dns = require('dns');
const path = require('path');
const shortUrl = require('./models/shortUrl');

let app = express();

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('/public', express.static(process.cwd() + '/public'));


app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/public/index.html');
});

mongoose.Promise = global.Promise;
let dbUrl = process.env.MONGOLAB_URI;
mongoose.connect(dbUrl || 'mongodb://localhost/shortUrls');

app.post('/api/shorturl/new/', (req, res) => {
  
// Regexp for domains
  let userUrl = req.body.url;
  let formatRegex =/(?:[\w-]+\.)+[\w-]+/;
  let findUrl = formatRegex.test(userUrl);

  dns.lookup(userUrl, () => {

    let shortId = randomstring.generate(6);//generates 6 digit id for short url.

    if (findUrl === true) {
      let postedUrl = new shortUrl({//user url db structure
        original_url: userUrl,
        short_url: shortId
      });
      postedUrl.save((err, url) => { //saves to database
        res.json({
          original_url: userUrl,
          short_url: shortId
        });
      });
    } else{
      res.json({
        error: "Invalid Url"
      });
    }
  });
});

app.get("/api/shorturl/:urlShort", (req, res) => {
  
  shorter_url = req.params.urlShort;//grabs short url

 shortUrl.findOne({ 'short_url': shorter_url })
.then( (data) => {
   
 let format = new RegExp("^(http|https)://", "i");
    let checkForShort = data.original_url;
//if statement to check for original url from short url entered
    if(format.test(checkForShort)){
      return res.redirect(data.original_url);
    }else{
      return res.redirect("https://" + data.original_url);
   }

 });
});
    //return data ? res.redirect("https://" + data.original_url) : res.send("Error redirecting from the short Url");
//Listen on connection port
let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Listening on port: " + port);
});
