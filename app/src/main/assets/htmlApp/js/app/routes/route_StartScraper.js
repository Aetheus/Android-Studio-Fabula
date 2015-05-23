var route = new Router().route;

route("#StartScraper", function (event, $thisContainer){

    //if the loading animation is NOT in thisContainer, that means this route was already loaded previously. no need to reload since the contents wont change
    if($thisContainer.children(".loaderAnim").length != 1){
        console.log("no need to redraw startScraper page since its already been loaded");
        return;     /*no need to redraw this page since its already been loaded*/
    }

    var $form = $(
         '<div class="row">'
        +   '<form class="col s12">'
        +       '<div class="row" style="margin-bottom: 0px;"> <h4 class="center"> Subscribe </h4> </div>'
        +       '<div class="row no-vertical-margins">'
        +           '<div class="input-field col s10 offset-s1"> enter the exact URL of the site you wish to subscribe to in order to start the web scraper</div>'
        +       '</div>'
        +       '<div class="row no-vertical-margins">'
        +           '<div class="input-field col s10 offset-s1">'
        +               '<i class="mdi-action-open-in-browser prefix"></i>'
        +               '<input value="http://" placeholder="" id="url_to_scrape" type="text" class="validate" autocomplete="off" spellcheck="false" autocorrect="off"> '
        +               '<label class="active" for="url_to_scrape"> URL Address </label>'
        +           '</div>'
        +       '</div>'
        +       '<div class="row">'
        +           '<div class="input-field col s10 offset-s1">'
        +               '<a id="toAndroidInterface" class="waves-effect waves-light btn col s4 offset-s4">Go To</a>'
        +           '</div>'
        +       '</div>'
        +   '</form>'
        +'</div>'
    );



    $thisContainer.html($form);
    $("#toAndroidInterface").click(function (){
        var url = $("#url_to_scrape").val();

        try{
            FabulaSysApp.goToScraper(url);
        }catch(err){
            return errHandler(err);
        }
    });


});