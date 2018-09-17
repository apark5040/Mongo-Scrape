//Another way of grabbing JSON data and appending it to page

$(".scrapeBtn").on("click", function(){
    $.getJSON("/scrape", function(data) {
        $(".articleList").empty();
        for(var i = 0; i < data.length; i++){
            $(".articleList").append("<img src="+data[i].image+"><p class='article'>" + data[i].title + "<br />" + data[i].summary + "<br />" + data[i].link + "</p>");
        };
    });
})


// $.ajax({
//     method: "GET",
//     url: "/article/"+thisId
// })