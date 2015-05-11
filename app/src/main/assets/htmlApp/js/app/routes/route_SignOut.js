var route = new Router().route;

route("#SignOut", function (event, $thisContainer){
     //if the loading animation is NOT in thisContainer, that means this route was already loaded previously. no need to reload since the contents wont change
    if($thisContainer.children(".loaderAnim").length != 1){
        console.log("no need to redraw startScraper page since its already been loaded");
        return;     /*no need to redraw this page since its already been loaded*/
    }

    var $content = $(
            '<form class="col s12">'
        +       '<div class="row">'
        +           '<div class="col s8 offset-s2">'
        +               '<div> Click the below button to sign out of the current user account (' + FabulaSysUsername + ') </div>'
        +           '</div>'
        +           '<div class="col s8 offset-s2">'
        +               '<a id="toLogout" class="waves-effect waves-light btn col s8 offset-s2">Log Out</a>'
        +           '</div>'
        +       '</div>'
        +   '</form>'
    );

    $thisContainer.html(" ");
    $thisContainer.append($content);

    $("#toLogout").on("click", function(){
        FabulaSysApp.signOut();
    });

});