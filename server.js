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

var databaseUri = "mongodb://localhost/mongoscrape";

if(process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
} else {
    mongoose.connect(databaseUri);
}

htmlRoutes(app);
apiRoutes(app);


app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});