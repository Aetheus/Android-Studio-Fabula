var route = new Router().route;

route("#Settings", function (event, $thisContainer){
    var $TimeFilterRouteButton = $("<a class='btn' href='#Settings_TimeFilter'>Customize Time Filters</a>");
    $thisContainer.html($TimeFilterRouteButton);

    //we have to move the route declaration
    route("#Settings_TimeFilter", function (event, $thisContainer){
        Route_Settings_TimeFilter(event, $thisContainer);
    });
});

//we have to move
var Route_Settings_TimeFilter = function (event, $thisContainer){
    var sentenceDiv = $("<div>test message</div>");
    $thisContainer.html(sentenceDiv);
}

