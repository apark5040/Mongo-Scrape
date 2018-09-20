var request = require("request");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {

    //GET route to get all articles
    app.get("/article", function (req, res) {
        db.Article.find({}, function (error, found) {
            if (error) {
                console.log(error);
            }
            else {
                res.json(found);
            }
        });
    });

    //DELETE route to delete all articles
    app.delete("/article", function (req, res) {
        db.Article.deleteMany({}, function (error, found) {
            if (error) {
                console.log(error);
            }
            else {
                res.json(found);
            }
        });
    });

    //GET route to get article based on id
    app.get("/article/:id", function (req, res) {
        db.Article.findOne({ _id: req.params.id })
            .populate("comment")
            .then(function (dbArticle) {
                res.json(dbArticle);
            }).catch(function (err) {
                res.json(err);
            });
    });

    //POST route to saving comment on specific article
    app.post("/article/:id", function (req, res) {
        db.Comment.create(req.body).then(function (dbComment) {
            console.log(dbComment);
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comment: dbComment._id } }, { new: true });
        }).then(function (updated) {
            res.json(updated);
        }).catch(function (error) {
            res.json(error);
        });
    });

    //DELETE route to delete comment
    app.delete("/article/:id", function (req, res) {
        var articleId = req.body.articleId;

        db.Comment.deleteOne({ _id: req.params.id })
            .then(function (result) {
                return db.Article.findOneAndUpdate({ _id: articleId }, { $pull: { comment: req.params.id } }, { new: true });
            }).then(function (deleted) {
                res.json(deleted);
            }).catch(function (error) {
                res.json(error);
            });
    });

    //Scrapes the latest articles. 
    app.get("/scrape", function (req, res) {
        request("http://www.siliconera.com/", function (error, response, html) {
            var $ = cheerio.load(html);

            $("div.post").each(function (i, element) {
                var result = {};

                result.title = $(this).children("h2.title").children("a").text();
                result.summary = $(this).children("div.postdescription").children("p").text();
                result.link = $(this).children("h2.title").children("a").attr("href");

                //images using wordpress uses lazy-loading. If 'src' doesn't work, use 'data-cfsrc'
                if($(this).children("a").children("img").attr("src")){
                    result.image = $(this).children("a").children("img").attr("src");
                }
                else if($(this).children("a").children("img").attr("data-cfsrc")) {
                    result.image = $(this).children("a").children("img").attr("data-cfsrc");
                }
                
                db.Article.findOne({ title: result.title }).then(function (dbArticle) {
                    if (dbArticle) {
                        console.log("Already exists");
                    } else {
                        db.Article.create(result).then(function (dbArticle) {
                            console.log(dbArticle);
                        });
                    }
                });
            });
            res.json("Scrape Complete");
        });
    });
};