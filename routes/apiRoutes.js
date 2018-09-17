var db = require("../models");

module.exports = function(app) {

    //GET route to get all articles
    app.get("/article", function(req, res) {
        db.Article.find({}, function(error, found){
            if(error){
                console.log(error);
            }
            else {
                res.json(found);
            }
        });
    });

    //GET route to get article based on id
    app.get("/article/:id", function(req, res) {
        db.Article.find({_id: req.params.id}).populate("Comment").then(function(dbArticle){
            res.json(dbArticle);
        }).catch(function(err){
            res.json(err);
        });
    });

    //POST route to saving comment on specific article
    app.post("/article/:id", function(req, res) {
        db.Comment.create(req.body).then(function(dbComment){
            return db.Article.findOneAndUpdate({_id: req.params.id}, { note: dbComment._id }, { new: true });
        }).then(function(updated){
            res.json(updated);
        }).catch(function(error){
            res.json(error);
        });
    });


};