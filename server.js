var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

var htmlRoutes = require("./routes/htmlRoutes.js");
var apiRoutes = require("./routes/apiRoutes.js");

var db = require("./models");

var PORT = 3000;

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/mongoscrape");

htmlRoutes(app);
apiRoutes(app);


app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});