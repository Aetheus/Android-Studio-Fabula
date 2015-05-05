var route = new Router().route;

route("#AllNews", function (event, $thisContainer){
    if (typeof FabulaSysUsername == "undefined" || typeof FabulaSysPassword == "undefined"){
        return errHandler(new Error("Username or password was not provided!"));
    }


    /*$("section").html('<div class="preloader-wrapper big active"><div class="spinner-layer spinner-blue"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div>');*/

    /*where imagebutton is a jQuery element, and imagelink is a string for a link*/
    var bindImageButton = function (imageLink,imageButton){
        imageButton.click(function (){
            var thisButton = $(this);

            if(thisButton.text() == "show image"){
                if(thisButton.next("img").length == 0){
                    var image = new Image();
                    image.onload = function (){
                        thisButton.after(image);
                        $(image).before("<br />");
                        thisButton.text("hide image");
                    }
                    image.onerror = function(errorMsg, url, lineNumber){
                        errHandler(new Error(errorMsg));
                    }
                    image.src = imageLink;
                }else{
                    thisButton.siblings.show();

                    thisButton.text("hide image");
                }
            }else{
                thisButton.next("br").hide().next("img").hide();
                /*thisButton.siblings("br").hide();*/
                thisButton.text("show image");
            }

        });
    }

    /*where linkButton is a jQuery element, and link is a string for a link*/
    var bindLinkButton = function(link, $linkButton){
        $linkButton.click(function(){
            var $thisButton = $(this);

            //window.location = link;
            window.open(link);
        });
    }

    var bindSelectOptions = function ($selectList){
        $selectList.on("change", function (){
            globalSettings.currentFilter = $(this).val();
            var timeConfig = TimeHelper.decide(globalSettings.currentFilter);
            postRequest(timeConfig, globalSettings.currentTags);
        });
    }

    var populateSelectList = function ($selectList){
        for (var key in globalSettings.timeFilters){
            if (globalSettings.timeFilters.hasOwnProperty(key)){
                var choice = key;
                var $option = $('<option value="'+key+'">'+key+'</option>');
                if(choice == globalSettings.currentFilter){
                    $option.prop("selected",true);
                }
                $selectList.append($option);
            }
        }
        $($selectList).material_select();
        bindSelectOptions($selectList);
    }

    var bindTagInput = function ($input){
        $input.on("focusout", function(){
            globalSettings.currentTags = $(this).val();
            postRequest(TimeHelper.decide(globalSettings.currentFilter),globalSettings.currentTags);
        });
    }

    var onSuccess = function (data, status){
        //{"fitfeeditemid":20280,"fitfeedchannelid":1,"fitfeeditemtitle":"APU CAREERS CENTRE: JOB OPPORTUNITIES","fitfeeditemlink":"http://webspace.apiit.edu.my/user/view.php?id=24345&course=1","fitfeeditemdescription":"by WEBSPACE   - Friday, 10 April 2015, 2:48 PM","fittimestamp":"2015-04-10T08:39:05.457Z","fitfeeditemimagelink":"%%%NULL%%%","fitisread":false}
        var JSONarray = data;

        //var $timeDropdownButton = $("<a class='dropdown-button btn' href='#' data-activates='timedropdown'>time filter</a>");
        //var $timeDropdownList = $("<ul id='timedropdown' class='dropdown-content'></ul>");
        //var $dropdownContainer = $('<div class="input-field col s6"></div>').append($timeDropdownButton).append($timeDropdownList);

        var $tagsInput = $( '<div class="input-field col s6">' +
                                  '<input placeholder="tags" id="last_name" type="text">' +
                            '</div>');

        var $selectList = $('<select id="selectTimeDropdown"></select>');
        var $selectContainer = $('<div class="input-field col s6"></div>').append($selectList);//.append('<label>Time Selection</label>');
        var $filterOptionsContainer = $('<div class="row" id="filterContainer"></div>').append($selectContainer).append($tagsInput);


        var list = $('<ul class="collapsible" data-collapsible="accordion"></ul>');
        for(var i=0; i< JSONarray.length; i++){
            var listItem = $(document.createElement('li'));

            var collapsibleHeader = $('<div class="collapsible-header" style="white-space: nowrap; overflow: auto; -webkit-overflow-scrolling: touch;"><i class="medium mdi-av-my-library-books"></i></div>');
            var collapsibleBody = $('<div class="collapsible-body"></div>');

            collapsibleHeader.append(JSONarray[i].fitfeeditemtitle);

            var innerBody = $('<blockquote class="inner-body"  style="overflow: auto;"></blockquote>')
            if(JSONarray[i].fitfeeditemlink != null && JSONarray[i].fitfeeditemlink != DBNull){
                var link = JSONarray[i].fitfeeditemlink;
                var $linkButton = $('<a class="waves-effect waves-light btn small-side-margins">go to link</a>');

                bindLinkButton(link,$linkButton);
                innerBody.append($linkButton);
            }
            if(JSONarray[i].fitfeeditemimagelink != null && JSONarray[i].fitfeeditemimagelink != DBNull){
                /*var image = $("<img src='" + JSONarray[i].fitfeeditemimagelink + "' />");*/
                var imageLink = JSONarray[i].fitfeeditemimagelink;
                var $imageButton = $('<a class="waves-effect waves-light btn small-side-margins">show image</a>');

                bindImageButton(imageLink,$imageButton);
                innerBody.append($imageButton);
            }
            innerBody.append("<br />");
            innerBody.append(JSONarray[i].fitfeeditemdescription);
            collapsibleBody.append(innerBody);

            listItem.append(collapsibleHeader);
            listItem.append(collapsibleBody);
            list.append(listItem);
        }

        $thisContainer.html(list);
        $thisContainer.prepend($filterOptionsContainer);
        //$thisContainer.prepend($timeDropdownList);
        //$thisContainer.prepend($timeDropdownButton);

        bindTagInput($tagsInput.find("input"));
        populateSelectList($selectList);
        $tagsInput.find("input").val(globalSettings.currentTags);


        $('.collapsible').collapsible({ accordion:true });  //initialize the collapsible list
        $('.dropdown-button').dropdown({    //initialize dropdown
            inDuration: 300,
            outDuration: 225,
            gutter: 0,
            belowOrigin: true
          }
        );
    };

    var postRequest = function (timeConfig, tags){
        $.ajax({
            method: "POST",
            url: "https://fabula-node.herokuapp.com/usersfeeditems",
            data: {
                userid:FabulaSysUsername,
                password:FabulaSysPassword,
                timerange:timeConfig,
                tags:tags
            },
            complete : function(XHR,textStatus){
                toaster("Request Status: " + textStatus, 2500);
            },
            timeout: 15000,/*15 second timeout; if we don't get a response in this time, something's up*/
            error : function (XHR,textStatus, errorThrown){
                if(textStatus == "timeout" || XHR.statusText == "timeout") {
                    errHandler(new Error("Timed out while waiting for response"));
                }else{
                    if (XHR.responseText == undefined || XHR.responseText == 'undefined'){
                        errHandler(new Error("Unable to get a response from server"));
                    }else{
                        console.log("XHR object is " + JSON.stringify(XHR));
                        var json = JSON.parse(XHR.responseText);
                        errHandler(new Error(json.Message));
                    }
                }
                /*errHandler(new Error(errorThrown));*/
            },
            success: function(data, status){
                onSuccess(data, status);
            }
        });

    }

    var currentTimeConfig = TimeHelper.decide(globalSettings.currentFilter);
    var tags = globalSettings.currentTags;
    postRequest(currentTimeConfig,tags);
});