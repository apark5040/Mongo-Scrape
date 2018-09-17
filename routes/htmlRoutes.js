var request = require("request");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {
    app.get("/", function (req, res) {
        res.render("index");
    });

    //GET route to get initial article scrapes
    app.get("/scrape", function (req, res) {
        request("http://www.siliconera.com/", function (error, response, html) {
            var $ = cheerio.load(html);

            $("div.post").each(function (i, element) {
                var result = {};

                result.title = $(this).children("h2.title").children("a").text();
                result.summary = $(this).children("div.postdescription").children("p").text();
                result.link = $(this).children("h2.title").children("a").attr("href");

                db.Article.create(result)
                    .then(function (dbArticle) {
                        console.log(dbArticle);
                    })
                    .catch(function (error) {
                        return res.json(error);
                    });
            });
        });
        res.send("Scrape Complete. Go back to home page");
    });
};