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
        method: "POST",
        url: "/scrape",
    }).done(function (data) {
        location.reload();
        console.log(data);
    });
});

$(document).on("click", ".commentBtn", function () {
    var thisId = $(this).attr("data-id");

    console.log(thisId);

    $("#modalTitle").empty();

    $.ajax({
        method: "GET",
        url: "/article/" + thisId
    })
        .then(function (data) {
            console.log(data);
            $(".modal-body").prepend("<h2 id='modalTitle'>" + data.title + "</h2>");

            if (data.Comment) {
                $("#articleComments").val(data.Comment.body);
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
        });
});


