require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post("/result", (req, res) => {
    const query = req.body.cityName;
    const unit = "metric";
    const apiKey = process.env.CLIENT_ID;
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + apiKey;

    https.get(url, (response) => {
        if(response.statusCode === 200){
            response.on("data", (data) => {
                const weatherData = JSON.parse(data);
                const temp = weatherData.main.temp;
                const description = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const humidity = weatherData.main.humidity;
                const wind = weatherData.wind.speed;

                res.render("result", {temperature: temp, query: query, image: icon, desc: description, humidity: humidity, wind: wind});
            })
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
    })
})

app.post("/again", (req, res) => {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port-server ${port} and port-local 3000");
})