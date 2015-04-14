var route = new Router().route;

route("#AllNews", function (event, $thisContainer){
    if (typeof FabulaSysUsername == "undefined" || typeof FabulaSysPassword == "undefined"){
        return errHandler(new Error("Username or password was not provided!"));
    }


    /*$("section").html('<div class="preloader-wrapper big active"><div class="spinner-layer spinner-blue"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div>');*/

    var onSuccess = function (data, status){
        //{"fitfeeditemid":20280,"fitfeedchannelid":1,"fitfeeditemtitle":"APU CAREERS CENTRE: JOB OPPORTUNITIES","fitfeeditemlink":"http://webspace.apiit.edu.my/user/view.php?id=24345&course=1","fitfeeditemdescription":"by WEBSPACE   - Friday, 10 April 2015, 2:48 PM","fittimestamp":"2015-04-10T08:39:05.457Z","fitfeeditemimagelink":"%%%NULL%%%","fitisread":false}
        var JSONarray = data;

        var list = $('<ul class="collapsible" data-collapsible="accordion"></ul>');

        for(var i=0; i< JSONarray.length; i++){
            var listItem = $(document.createElement('li'));

            var collapsibleHeader = $('<div class="collapsible-header" style="white-space: nowrap; overflow: auto; -webkit-overflow-scrolling: touch;"><i class="medium mdi-av-my-library-books"></i></div>');
            var collapsibleBody = $('<div class="collapsible-body"></div>');

            collapsibleHeader.append(JSONarray[i].fitfeeditemtitle);

            var innerBody = $('<blockquote class="inner-body"  style="overflow: auto;"></blockquote>')
            innerBody.append(JSONarray[i].fitfeeditemdescription);
            if(JSONarray[i].fitfeeditemimagelink != null && JSONarray[i].fitfeeditemimagelink != DBNull){
                //var image = $("<img src='" + JSONarray[i].fitfeeditemimagelink + "' />");
                var imageButton = $('<a class="waves-effect waves-light btn">show image</a>');
                var imageLink = JSONarray[i].fitfeeditemimagelink;

                (function(imageLink,imageButton) {
                    imageButton.click(function (){
                        var thisButton = $(this);

                        if(thisButton.text() == "show image"){
                            if(thisButton.next("img").length == 0){
                                var image = new Image();
                                image.onload = function (){
                                    thisButton.after(image);
                                    thisButton.text("hide image");
                                }
                                image.onerror = function(){
                                    thisButton.after("<p>Image could not be loaded!</p>");
                                }
                                image.src = imageLink;
                            }else{
                                thisButton.next("img").show();
                                thisButton.text("hide image");
                            }
                        }else{
                            thisButton.next("img").hide();
                            thisButton.text("show image");
                        }

                    });
                })(imageLink,imageButton);

                innerBody.append(imageButton);
            }
            collapsibleBody.append(innerBody);

            listItem.append(collapsibleHeader);
            listItem.append(collapsibleBody);
            list.append(listItem);
        }

        $thisContainer.html(list);
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