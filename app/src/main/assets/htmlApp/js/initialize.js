//var FabulaSysUsername = "superuser";
//var FabulaSysPassword = "superuser";
/*FabulaSysApp is the name of our JS-to-Android interface*/
var DBNull = "%%%NULL%%%";

$(document).ready(function(){
    //define our error handler callback
    var errHandler = function (err){
        alert(err.message);
    }


    //define our routeList and router object
    var routesList = [];
    var Router = {
        //callback must have a func signature of : function (event) { ...  }
        route: function route (hrefID, callback){
           //if (hrefID.charAt(0) == '#'){ hrefID = hrefID.substring(1); }
           var selectorString = "a[href=" + hrefID + "]";

           $(selectorString).click(function (event){
                callback(event);
           });

           routesList[routesList.length] = hrefID;
           console.log("Route added for " + hrefID);
           console.log("Current Routes: " + routesList.toString());
        }
    }
    var route = Router.route;

    //initialize sidenav
    $(".button-collapse").sideNav();

    //this hides the sideNav when an option is chosen
    $("nav > ul > li").click(function (event){
        $('.button-collapse').sideNav('hide');
    });

    //set the height of the <section> to "100%" (i.e: the window height)
    //this allows us to make use of our .vertcenter class or Materialize CSS .valign-wrapper+valign classes to vertically center tags
    $("section").height(window.innerHeight);



    /***ROUTES START HERE**************************************************************/
    route("#AllNews", function (event){
        if (typeof FabulaSysUsername == "undefined"){
            //return errHandler(new Error("Username was undefined!"));
        }


        //$("section").html('<div class="preloader-wrapper big active"><div class="spinner-layer spinner-blue"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div>');

        var onSuccess = function (data, status){
            //{"fitfeeditemid":20280,"fitfeedchannelid":1,"fitfeeditemtitle":"APU CAREERS CENTRE: JOB OPPORTUNITIES","fitfeeditemlink":"http://webspace.apiit.edu.my/user/view.php?id=24345&course=1","fitfeeditemdescription":"by WEBSPACE   - Friday, 10 April 2015, 2:48 PM","fittimestamp":"2015-04-10T08:39:05.457Z","fitfeeditemimagelink":"%%%NULL%%%","fitisread":false}
            var JSONarray = data;

            var list = $('<ul class="collapsible popout" data-collapsible="accordion"></ul>');
            for(var i=0; i< JSONarray.length; i++){
                var listItem = $(document.createElement('li'));

                var collapsibleHeader = $('<div class="collapsible-header"><i class="medium mdi-av-my-library-books"></i></div>');
                var collapsibleBody = $('<div class="collapsible-body"></div>');

                collapsibleHeader.append(JSONarray[i].fitfeeditemtitle);
                collapsibleBody.append(JSONarray[i].fitfeeditemdescription);

                if(JSONarray[i].fitfeeditemimagelink != null && JSONarray[i].fitfeeditemimagelink != DBNull){
                    var image = $("<img src='" + JSONarray[i].fitfeeditemimagelink + "' />");
                    collapsibleBody.append(image);
                }

                listItem.append(collapsibleHeader);
                listItem.append(collapsibleBody);
                list.append(listItem);
            }

            $("section").html(list);
            $('.collapsible').collapsible({ accordion:true });  //initialize the collapsible list
        };

        $.ajax({
            method: "POST",
            url: "https://fabula-node.herokuapp.com/usersfeeditems",
            data: {
                userid:FabulaSysUsername,
                password:FabulaSysPassword,

            },
            complete : function(XHR,textStatus){
                alert("Request Status: " + textStatus);
            },
            error : function (XHR,textStatus, errorThrown){
                errHandler(new Error(errorThrown));
            },
            success: function(data, status){
                onSuccess(data, status);
            }
        });

    });


    route("#NewsChannels", function (event){
        try{
            $("section").html("<p class='flow-text'> Welcome from NewsChannel. This is obviously placeholder text. I'mn actrually trying ot overflow the display with text. Wanna help me? <br /><br /><br /><br /><br /><br /><br /><br /> HI HI HI HI HI H IH IH IH I HIH IH IH I HIASDFASDFASDF Welcome from NewsChannel. This is obviously placeholder text. I'mn actrually trying ot overflow the display with text. Wanna help me? <br /><br /><br /><br /><br /><br /><br /><br /> HI HI HI HI HI H IH IH IH I HIH IH IH I HIASDFASDFASDF Welcome from NewsChannel. This is obviously placeholder text. I'mn actrually trying ot overflow the display with text. Wanna help me? <br /><br /><br /><br /><br /><br /><br /><br /> HI HI HI HI HI H IH IH IH I HIH IH IH I HIASDFASDFASDF Welcome from NewsChannel. This is obviously placeholder text. I'mn actrually trying ot overflow the display with text. Wanna help me? <br /><br /><br /><br /><br /><br /><br /><br /> HI HI HI HI HI H IH IH IH I HIH IH IH I HIASDFASDFASDF Welcome from NewsChannel. This is obviously placeholder text. I'mn actrually trying ot overflow the display with text. Wanna help me? <br /><br /><br /><br /><br /><br /><br /><br /> HI HI HI HI HI H IH IH IH I HIH IH IH I HIASDFASDFASDF Welcome from NewsChannel. This is obviously placeholder text. I'mn actrually trying ot overflow the display with text. Wanna help me? <br /><br /><br /><br /><br /><br /><br /><br /> HI HI HI HI HI H IH IH IH I HIH IH IH I HIASDFASDFASDF Welcome from NewsChannel. This is obviously placeholder text. I'mn actrually trying ot overflow the display with text. Wanna help me? <br /><br /><br /><br /><br /><br /><br /><br /> HI HI HI HI HI H IH IH IH I HIH IH IH I HIASDFASDFASDF Welcome from NewsChannel. This is obviously placeholder text. I'mn actrually trying ot overflow the display with text. Wanna help me? <br /><br /><br /><br /><br /><br /><br /><br /> HI HI HI HI HI H IH IH IH I HIH IH IH I HIASDFASDFASDF Welcome from NewsChannel. This is obviously placeholder text. I'mn actrually trying ot overflow the display with text. Wanna help me? <br /><br /><br /><br /><br /><br /><br /><br /> HI HI HI HI HI H IH IH IH I HIH IH IH I HIASDFASDFASDF </p>");
        }catch(err){
            return errHandler(err);
        }
    });

    route("#StartScraper", function (event){
        try{
            FabulaSysApp.goToScraper();
        }catch(err){
            return errHandler(err);
        }
    });
    /**********************************************************************************/


});