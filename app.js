require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const https = require("https");

const app = express();

app.use(express.static("public"))
app.use(bodyParser.urlencoded({
  extended: true
}));


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
});



app.post("/failure", function(req, res) {
  res.redirect("/");
});



app.post("/", function(req, res) {

  const firstName = req.body.姓氏;
  const lastName = req.body.名字;
  const emailAddress = req.body.email;
  const data = {
    members: [{
      email_address: emailAddress,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };
  const jsonData = JSON.stringify(data);
  const url =process.env.SECRET_URL
  const options = {
    method: "POST",
    auth:process.env.SECRET_AUTH
  }
  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    };
    response.on("data", function(data) {
      console.log(JSON.parse(data));

    })
  });

  request.write(jsonData);
  request.end()
});
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000")
});
