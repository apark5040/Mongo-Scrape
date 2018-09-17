//Another way of grabbing JSON data and appending it to page
$.getJSON("/article", function(data) {
    for(var i = 0; i < data.length; i++){
        $(".articleList").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].summary + "<br />" + data[i].link + "</p>")
    };
});

// $.ajax({
//     method: "GET",
//     url: "/article/"+thisId
// })