$.getJSON("/article", function (data) {
    $(".articleList").empty();
    for (var i = 0; i < data.length; i++) {
        var newDiv = $("<div class='articleScrape row'>");
        newDiv.append("<p class='col-md-10 article'><img class='imageScrape' src=" + data[i].image + ">" + data[i].title + "<br />" + data[i].summary + "<br />" + data[i].link + "</p>");
        newDiv.append("<button data-toggle='modal' data-target='#exampleModal' type='button' data-id=" + data[i]._id + " class='col-md-2 commentBtn btn btn-info'>Comment</button>");
        $(".articleList").append(newDiv);
    };
});

$(".scrapeBtn").on("click", function () {
    $.ajax({
        method: "GET",
        url: "/scrape"
    })
    .then(function(data){
        location.reload();
        console.log(data);
    });
});

$(".removeBtn").on("click", function() {
    $.ajax({
        method: "DELETE",
        url: "/article",
    }).then(function (data) {
        console.log(data);
        location.reload();
    });
});

$(document).on("click", ".commentBtn", function () {
    var thisId = $(this).attr("data-id");

    console.log(thisId);

    $("#modalTitle").empty();
    $("#articleComments").empty();
    $("#message-text").val("");


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

$(document).on("click", ".deleteBtn", function(){
    var deleteId = $(this).attr("data-id");
    var articleId = $(".submitBtn").attr("data-id");

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


