
var Router = (function (){
    var RouterConstructor =
    function () { //class constructor
        var thisSpecific = this;    //helps us access public variables from within our public functions. Otherwise, wed only be able to access private ones
        Router.routesList = []; //static variable

        /*callback must have a func signature of : function (event, $thisContainer) { ...  }*/
        this.route = function (hrefID, callback){
           var selectorString = "a[href=" + hrefID + "]";

           if ($("section").children(hrefID).length == 0){
                console.log(hrefID + " wasn't found in the section");
                $('<div id="'+hrefID.substring(1)+'">'+hrefID+'</div>').appendTo("section").hide();
                console.log(hrefID + " was added to the section");
           }

           $(selectorString).click(function (event){
                var targetHrefID = $(event.target).attr("href");
                var $thisContainer = $(targetHrefID);

                $("section").children().hide();
                $thisContainer.show();

                callback(event, $thisContainer);
           });


           Router.routesList[Router.routesList.length] = hrefID;
           console.log("Route added for " + hrefID); console.log("Current Routes: " + Router.routesList.toString());
        }

    }

    return RouterConstructor;
}());
var route = new Router().route;

