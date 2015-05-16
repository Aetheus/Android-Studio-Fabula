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


    var bindTimeChoice = function ($timeChoice) {
        $timeChoice.click(function (){
            globalSettings.currentFilter = $(this).text();
            var timeConfig = TimeHelper.decide(globalSettings.currentFilter);
            postRequest(timeConfig, globalSettings.currentTags);
        });
    }

    /*where $list is a jQuery unordered list element, and the time list is taken from TimeHelper*/
    var populateTimeList = function ($list) {
        for (var key in globalSettings.timeFilters){
            if (globalSettings.timeFilters.hasOwnProperty(key)){
                var choice = key;
                var $litem = $('<li></li>');
                var $timeChoice = $('<a href="#!">' + choice +'</a>');

                bindTimeChoice($timeChoice);

                $litem.append($timeChoice);
                $list.append($litem);
            }
        }
    }

    var bindTagInput = function ($input){
        $input.on("focusout", function(){
            globalSettings.currentTags = $(this).val();
            postRequest(TimeHelper.decide(globalSettings.currentFilter),globalSettings.currentTags);
        });
    }

    //adds a Listener to the clickedElem that makes the page scroll to the very bottom on clicking it
    var onClickGoBottom = function ($clickedElem, timeBeforeGo){
        /*$clickedElem.on("click", function (){
            var waitTime = timeBeforeGo ? timeBeforeGo : 0;
            setTimeout(function(){
                window.scrollTo(0,document.body.scrollHeight);
                console.log('this worked');
            }, waitTime);
        });*/

        $clickedElem.on("click", function (){
            var counter = 0;

            var timeOut = timeBeforeGo ? timeBeforeGo : 0;
            setTimeout(function(){
                    var isBottomOfPage = false;

                    while(!isBottomOfPage){
                            counter++;
                            console.log("this is loop " + counter);
                            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                                //we're at the bottom of the page
                                isBottomOfPage = true;
                                window.scrollTo(0,document.body.scrollHeight);
                                //console.log("we've reached bottom");
                                break;
                            }else{
                                //console.log("still looping");
                                window.scrollTo(0,document.body.scrollHeight);
                            }
                    }
            }, timeOut);
        });

    }

    //resizes the $content so it fills whatever vertical space is between $footer and $header
    var resizeRouteContent = function ($content, $header, $footer){
        var parentHeight = window.innerHeight - $(".navbar-fixed").height();
        var headerHeight = $header.height();
        var footerHeight = $footer.height();

        //console.log("Parent height: " + parentHeight + "\n Header Height: " + headerHeight + "\n Footer height: " + footerHeight);
        $content.height(parentHeight - headerHeight - footerHeight);
    }


    var bindTagItems = function ($tagItem){
        $tagItem.on("click", function(){
            var extractedTag = $(this).text();
            extractedTag = (extractedTag != "all") ? extractedTag : null;
            globalSettings.currentTags = extractedTag;
            postRequest(TimeHelper.decide(globalSettings.currentFilter),globalSettings.currentTags);
        })
    }

    //builds and returns a tagRow jquery elem
    var buildTagRow = function (){
        //replace this placeholder code with actual tags from settings later
        var tagsArr = ["all", "games", "local", "uni"];
        var currentTag = globalSettings.currentTags;

        var $tagRow = $('<div id="tagsRow" class="row no-vertical-margins"></div>');
        var $columnWrapper = $('<div class="col s12"></div>');
        var $unorderedList = $('<ul class="tabs"></ul');

        for(var i =0; i< tagsArr.length; i++){
            var cssclass = (currentTag == tagsArr[i]) ? "active" : "";

            var $entry = $('<a href="#' +  tagsArr[i] + '" class="' + cssclass + '">' +  tagsArr[i] + '</a>');
            var $listItemWrapper = $('<li class="tab col s3"></li>').append($entry);
            $unorderedList.append($listItemWrapper);
            bindTagItems($entry);
        }

        $columnWrapper.append($unorderedList);
        $tagRow.append($columnWrapper);
        return $tagRow;
    }

    var onSuccess = function (data, status){
        //{"fitfeeditemid":20280,"fitfeedchannelid":1,"fitfeeditemtitle":"APU CAREERS CENTRE: JOB OPPORTUNITIES","fitfeeditemlink":"http://webspace.apiit.edu.my/user/view.php?id=24345&course=1","fitfeeditemdescription":"by WEBSPACE   - Friday, 10 April 2015, 2:48 PM","fittimestamp":"2015-04-10T08:39:05.457Z","fitfeeditemimagelink":"%%%NULL%%%","fitisread":false}
        var JSONarray = data;


        var $timeDropdownButton = $("<a id='timedropdownbutton' class='dropdown-button btn col s12' href='#' data-activates='timedropdown'>time filter</a>");
        var $timeDropdownList = $("<ul id='timedropdown' class='dropdown-content'></ul>");
        var $timeDropdownRow = $('<div id="timeDropdownRow" class="row no-vertical-margins" id="filterContainer"></div>').append($timeDropdownButton).append($timeDropdownList);

        //var $tagRow = $('<div id="tagsRow" class="row no-vertical-margins"><div class="col s12"><ul class="tabs"><li class="tab col s3"><a href="#test1">Test 1</a></li><li class="tab col s3"><a class="active" href="#test2">Test 2</a></li><li class="tab col s3"><a href="#test3">Test 3</a></li><li class="tab col s3"><a href="#test4">Test 4</a></li></ul></div><div id="test1" class="col s12">Test 1</div><div id="test2" class="col s12">Test 2</div><div id="test3" class="col s12">Test 3</div><div id="test4" class="col s12">Test 4</div></div>');
        var $tagRow = buildTagRow();

        var list = $('<ul id="newsList" class="collapsible" data-collapsible="accordion"></ul>');
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
        var $listRow = $('<div id="listRow" class="row no-vertical-margins"></div>').append(list);

        $thisContainer.html($listRow);
        $thisContainer.prepend($tagRow);
        $thisContainer.append($timeDropdownRow);

        populateTimeList($('#timedropdown'));


        $('.collapsible').collapsible({ accordion:true });  //initialize the collapsible list
        $('ul.tabs').tabs();    //initialize tabs
        $('.dropdown-button').dropdown({    //initialize dropdown
            inDuration: 0,
            outDuration: 100,
            gutter: 0,

          }
        );

        onClickGoBottom($('#timedropdownbutton'), 110);
        resizeRouteContent($("#listRow"), $("#tagsRow"), $("#timeDropdownRow"))
    };

    var postRequest = function (timeConfig, tags){
        console.log("Request posted with a timeConfig: " + JSON.stringify(timeConfig) + " and tag: " + tags);
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
                toaster("Request Status: " + textStatus, 500);
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
    var currentTag = globalSettings.currentTags;
    postRequest(currentTimeConfig,currentTag);
});