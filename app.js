const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

app.post("/", function (request, response) {
    const firstName = request.body.firstName;
    const lastName = request.body.lastName;
    const email = request.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data)

    const url = "https://us10.api.mailchimp.com/3.0/lists/b620731322";

    const options = {
        method: "POST",
        auth: "abhipatel7:b39d90d6e55ceb2c3c0edf776c261520-us10"
    }


    const req = https.request(url, options, function (res) {
        res.on("data", function (data) {
            console.log(JSON.parse(data))


            if (res.statusCode === 200) {
                response.sendFile(__dirname + "/success.html")
            } else {
                response.sendFile(__dirname + "failure.html")
            }
        })
    })

    req.write(jsonData)
    req.end()
})

app.post("/failure", function (request, response) {
    response.redirect("/")
})

app.get("/", function (request, response) {
    response.sendFile(__dirname + "/signup.html")

})

app.listen(process.env.PORT || 3000);
