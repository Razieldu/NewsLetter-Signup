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
  const url = "https://us14.api.mailchimp.com/3.0/lists/a500e5aabe";
  const options = {
    method: "POST",
    auth: "Jeremy:1e322b684087d244e84d2e07f916491b-us14"
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
  console.log("Server is  running on port 3000")
});
