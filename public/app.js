//Loads all articles in database from scrape if there are any.
$.getJSON("/article", function (data) {
    $(".articleList").empty();
    for (var i = 0; i < data.length; i++) {
        var newDiv = $("<div class='articleScrape row'>");
        newDiv.append("<img class='imageScrape' src=" + data[i].image + "><h3>" + data[i].title + "</h3><br><p class='col-md-10 article'>" + data[i].summary + "</p><br>");
        newDiv.append("<a href='"+data[i].link+"'>Original URL</a>");
        newDiv.append("<button data-toggle='modal' data-target='#exampleModal' type='button' data-id=" + data[i]._id + " class='col-md-2 commentBtn btn btn-info'>Comment</button>");
        // newDiv.append("<button type='button' class='col-md-2 linkBtn btn btn-info'><a href="+data[i].link+">Link</a></button>");
        $(".articleList").append(newDiv);
    };
});

//Event handler for scrape button. Runs API call to get articles from website
$(".scrapeBtn").on("click", function () {
    $.ajax({
        method: "GET",
        url: "/scrape"
    })
    .then(function(data){

        //Refreshes page with articles
        location.reload();
        console.log(data);
    });
});

//Event handler to remove all the articles on the page
$(".removeBtn").on("click", function() {
    $.ajax({
        method: "DELETE",
        url: "/article",
    }).then(function (data) {
        console.log(data);

        //Refreshes page to remove the articles
        location.reload();
    });
});

//Event handler for DOM comment buttons. Opens modal with comments
$(document).on("click", ".commentBtn", function () {
    var thisId = $(this).attr("data-id");

    console.log(thisId);

    $("#modalTitle").empty();
    $("#articleComments").empty();
    $("#message-text").val("");

    //Gets title of article and any comments associated with it
    $.ajax({
        method: "GET",
        url: "/article/" + thisId
    })
        .then(function (data) {
            console.log(data);
            console.log(data.comment);
            $(".modal-body").prepend("<h2 id='modalTitle'>" + data.title + "</h2>");
            $(".submitBtn").attr("data-id", thisId);

            if (!data.comment.length == 0) {
                for(var i = 0; i<data.comment.length; i++){
                    $("#articleComments").append("<p class='border border-dark' id='comment'>"+data.comment[i].body+"<button data-dismiss='modal' data-id='"+data.comment[i]._id+"'type='button' class='btn btn-danger deleteBtn'>X</button></p>");
                }
            }
        });
});

//Event handler for comment submit button
$(document).on("click", ".submitBtn", function () {
    var postId = $(this).attr("data-id");

    var comment = $("#message-text").val();

    $.ajax({
        method: "POST",
        url: "/article/" + postId,
        data: {
            body: comment
        }
    })
        .then(function (data) {
            console.log(data);
            $("#message-text").empty();
        });
});

//Event handler for delete comment button
$(document).on("click", ".deleteBtn", function(){
    var deleteId = $(this).attr("data-id");
    var articleId = $(".submitBtn").attr("data-id");

    //Removes comment parameter from article object
    $.ajax({
        method: "DELETE",
        url: "/article/"+deleteId,
        data: {
            articleId: articleId
        }
    })
        .then(function(data){
            console.log("Deleted");
        });
});


