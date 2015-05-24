var route = new Router().route;

route("#AllNews", function (event, $thisContainer){
    if (typeof FabulaSysUsername == "undefined" || typeof FabulaSysPassword == "undefined"){
        return errHandler(new Error("Username or password was not provided!"));
    }


    /*$("section").html('<div class="preloader-wrapper big active"><div class="spinner-layer spinner-blue"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div>');*/

    var timeAgo = function (date) {
        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
            return interval + " years";
        }

        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + " months";
        }

        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            if(interval == 1) {
                return interval + "day";
            }
            return interval + " days";
        }


        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            if (interval == 1) {
                var minuteTime = Math.floor(seconds / 60);
                minuteTime -= 60;
                var minutesString = (minuteTime > 0) ? minuteTime + ( minuteTime>1 ? " minutes" : " minute") : "";
                return (interval + " hour and " + minutesString);
            }
            return interval + " hours";
        }

        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            if(interval == 1){
                return interval + " minute";
            }
            return interval + " minutes";
        }

        return Math.floor(seconds) + " seconds";
    }

    var linesOccupiedByElement = function ($element){
        var DOMelement = $element[0];
        var height = DOMelement.offsetHeight;
        var lineHeight = parseInt($element.css("line-height").slice(0,-2) , 10);


        //console.log("lines: " + (height/lineHeight) + " || flooredLines: " + Math.floor(height/lineHeight));
        lines = Math.floor(height/lineHeight);
        return lines;
    }

    //opens the link by creating an iframe and appending it to $thisContainer
    var openLink = function (link){
        FabulaSysApp.openLink(link);
        /*
        var $iframe = $('<iframe src="' + link +'"></iframe>');
        var $topBar = $('<div class="topBar"></div>');

        console.log("provided link is: " + link);

        var $closeButton = $('<i class="medium mdi-navigation-cancel"></i>');
        $closeButton.on("click", function(){
            $(this).parents(".externalContentWrapper").remove();
        })

        var $buttonWrapper = $('<span class="closeButtonWrapper"></span>').append($closeButton);
        $topBar.append($buttonWrapper);



        var $divWrapper = $('<div class="externalContentWrapper"></div>').append($topBar).append($iframe);
        $thisContainer.append($divWrapper);*/
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

                var cssclass = (globalSettings.currentFilter == choice) ? "redFont" : "";
                var $timeChoice = $('<a class="'+ cssclass +'" href="#!">' + choice +'</a>');

                bindTimeChoice($timeChoice);

                $litem.append($timeChoice);
                $list.append($litem);
            }
        }
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
                            //console.log("this is loop " + counter);
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

    var bindTagItems = function ($tagItem, $tagRow){
        $tagItem.on("click", function(){
            //scroll to the element and give this the "activeTag" class
            /*$tagRow.animate({
                scrollLeft: $(this).parent().position().left - $(this).position().left + 'px'
            }, 100);*/
            $tagRow.find(".activeTag").removeClass("activeTag");
            $(this).parent().addClass("activeTag");

            //make the request
            var extractedTag = $(this).text();
            extractedTag = (extractedTag != "all") ? extractedTag : null;
            globalSettings.currentTags = extractedTag;
            postRequest(TimeHelper.decide(globalSettings.currentFilter),globalSettings.currentTags);
        })
    }

    var trackElemSwipe = function ($elem, direction, callback){
        var domelem = $elem[0];

        var hammertime = new Hammer(domelem, {});

        hammertime.get('swipe').set({ direction: direction, threshold:20, velocity:0.35 });
        hammertime.on('swipe', function(ev) {
            callback(this);
        });
    }

    //builds and returns a tagRow jquery elem
    var buildTagRow = function (){
        //replace this placeholder code with actual tags from settings later
        var tagsArr = globalSettings.tagsList;
        var currentTag = globalSettings.currentTags;

        //var $tagRow = $('<div id="tagsRow" class="row no-vertical-margins"></div>');
        //var $columnWrapper = $('<div class="col s12"></div>');
        //var $unorderedList = $('<ul class="tabs"></ul');
        var $tagRow = $('<div id="tagsRow" class="no-vertical-margins"></div>');
        var $columnWrapper = $('<div class=""></div>');
        var $unorderedList = $('<ul class="tags-tabs"></ul');

        for(var i =0; i< tagsArr.length; i++){
            var cssclass = (currentTag == tagsArr[i]) ? "activeTag" : "";
            if(currentTag == null && tagsArr[i] == "all"){
                cssclass = "activeTag";
            }

            var $entry = $('<a href="#' +  tagsArr[i] + '" class="">' +  tagsArr[i] + '</a>');
            var $listItemWrapper = $('<li class="' + cssclass + '"></li>').append($entry);
            $unorderedList.append($listItemWrapper);
            bindTagItems($entry, $tagRow);
        }


        $columnWrapper.append($unorderedList);
        $tagRow.append($columnWrapper);


        return $tagRow;
    }

    //to be called by onSuccess ONLY
    var touchUpNewsList = function ($list, isRequestFromNotification){

        //trim titles that are too long
        $list.find("li.collection-item").each(function (){

            var $listItem = $(this);
            var $title = $listItem.find(".title");
            var isDescription = $listItem.find(".itemDescription").length > 0 ? true : false;

            var occupiedLines = linesOccupiedByElement($title);

            //(function (occupiedLines,$listItem,$title,isDescription){
                if((occupiedLines >= 2 && isDescription) || (occupiedLines >= 3) ){
                    $title.addClass("avatarCollectionOverflow");

                    //var doubleLineHeight = parseInt( $title.css("line-height").slice(0,-2)  );
                    //$title.css("height", doubleLineHeight + "px");
                }

                //we need 3 lines per news item to look tidy. if we don't have 3 lines ... make margins compensate.
                if((occupiedLines == 1) && (!isDescription) || (occupiedLines >= 3) && (!isDescription) ){
                    $title.css('margin-bottom', $title.css("line-height") );
                }
            //})(occupiedLines,$listItem,$title,isDescription);

        });

        //if from a notification, remove the active tags, since this is from a notification and thus doesn't use the user's previously selected options
        if(isRequestFromNotification){
            $("#timeDropdownRow").find(".redFont").removeClass("redFont");
            $("#tagsRow").find(".activeTag").removeClass("activeTag");
        }

        //make the refresh div the same width as its sibling. makes our animations a bit smoother
        $("#refreshDiv").css( "width", $("#refreshDiv").next().css("width") );

    }

    var populateNewsList = function ($list, JSONarray){
       for(var i=0; i< JSONarray.length; i++){
            var itemID = JSONarray[i].fitfeeditemid;
            var $listItem = $('<li class="collection-item avatar" ></li>');
            var $iconImage;
            var $title = $('<div  class="title boldFont">' + JSONarray[i].fitfeeditemtitle + '</div>'); //id="NewsItem' + itemID + 'Title"
            var $content = $('<div></div>');


            //if image exists and globalSettings permits its use, use it as thumbnail. else, use a default icon
            if(JSONarray[i].fitfeeditemimagelink != null && JSONarray[i].fitfeeditemimagelink != DBNull && globalSettings.isNewsFeedImagesOn){
                $iconImage = $('<img src="' + JSONarray[i].fitfeeditemimagelink + '" class="circle avatarCollectionImage" />');
            }else{
                $iconImage = $('<i class="mdi-action-assessment large circle green avatarCollectionIcon"></i>');
            }


            //$title.removeClass("avatarCollectionOverflow");
            //if desc exists, use it
            if (JSONarray[i].fitfeeditemdescription != null && JSONarray[i].fitfeeditemdescription != DBNull){
                var feedItemDesc = JSONarray[i].fitfeeditemdescription.replace(/(\r\n|\n|\r)/gm," ");   //get the description, but replace all linebreaks with a space to preserve our formatting
                $content.append('<div class="itemDescription avatarCollectionOverflow">' + feedItemDesc + '</div>');
                /*$content.children(".truncate").on("click", function (){
                    $(this).toggleClass("truncate");
                    //$(this).parents("li.collection-item.avatar").addClass("y-overflow")
                });*/
            }

            var timeSinceNow = timeAgo(new Date(JSONarray[i].fittimestamp));
            $content.append('<p class="right">' + timeSinceNow +' ago </p>');


            //add a link button - the immediately invoked function expression is to "freeze" the value of link by providing a function scope
            //if there is no link, use the channel's URL instead
            var link = (JSONarray[i].fitfeeditemlink != null && JSONarray[i].fitfeeditemlink != DBNull) ? JSONarray[i].fitfeeditemlink : JSONarray[i].fedfeedchannelurl;
            (function (link){
                if(link != null){
                    $iconImage.on("click", function (){
                        openLink(link);
                    });

                    $title.on("click", function (){
                        openLink(link);
                    });
                    //bindLinkButton(link,$linkButton);
                    //$content.append($linkButton);
                }
            })(link);

            //add backgorund colour if applicable
            var backgroundColour = JSONarray[i].fedfeedchannelcolour;
            if(backgroundColour && globalSettings.isNewsFeedColourOn){
                $listItem.addClass(backgroundColour);
                //add a darker border to the list item if backgroundcolour is being used
                //$listItem.css("border-bottom", "1px solid #808080");
            }


            $listItem.append($iconImage).append($title).append($content);
            $list.append($listItem);


        }


        var $enderDiv = $('<div id="enderDiv" class="center">----</div>');
        $list.append($enderDiv);


        var $refreshDiv = $('<div id="refreshDiv" class="center"></div>').html(reusableAssets.simplePreloader).append("");
        $list.prepend($refreshDiv);
    }

    var onSuccess = function (data, status,isRequestFromNotification){
        //{"fitfeeditemid":20280,"fitfeedchannelid":1,"fitfeeditemtitle":"APU CAREERS CENTRE: JOB OPPORTUNITIES","fitfeeditemlink":"http://webspace.apiit.edu.my/user/view.php?id=24345&course=1","fitfeeditemdescription":"by WEBSPACE   - Friday, 10 April 2015, 2:48 PM","fittimestamp":"2015-04-10T08:39:05.457Z","fitfeeditemimagelink":"%%%NULL%%%","fitisread":false}
        var JSONarray = data;


        var $timeDropdownButton = $("<a id='timedropdownbutton' class='dropdown-button btn col s12' href='#' data-activates='timedropdown'>time filter</a>");
        var $timeDropdownList = $("<ul id='timedropdown' class='dropdown-content'></ul>");
        var $timeDropdownRow = $('<div id="timeDropdownRow" class="row no-vertical-margins" id="filterContainer"></div>').append($timeDropdownButton).append($timeDropdownList);

        //var $tagRow = $('<div id="tagsRow" class="row no-vertical-margins"><div class="col s12"><ul class="tabs"><li class="tab col s3"><a href="#test1">Test 1</a></li><li class="tab col s3"><a class="active" href="#test2">Test 2</a></li><li class="tab col s3"><a href="#test3">Test 3</a></li><li class="tab col s3"><a href="#test4">Test 4</a></li></ul></div><div id="test1" class="col s12">Test 1</div><div id="test2" class="col s12">Test 2</div><div id="test3" class="col s12">Test 3</div><div id="test4" class="col s12">Test 4</div></div>');
        var $tagRow = buildTagRow();

        var $list = $('<ul id="newsList" class="collection no-vertical-margins"></ul>');
        populateNewsList($list, JSONarray);
        var $listRow = $('<div id="listRow" class="row no-vertical-margins"></div>').append($list);

        $thisContainer.html($listRow);
        $thisContainer.prepend($tagRow);
        $thisContainer.append($timeDropdownRow);

        populateTimeList($('#timedropdown'));


        //scroll to active tag
        if($tagRow.find(".activeTag").length > 0){
            //console.log("position value: " + $tagRow.find(".activeTag").position().left);
            /*$tagRow.animate({
                scrollLeft: $tagRow.find(".activeTag").position().left + 'px'
            }, 200);*/
            $tagRow.scrollLeft($tagRow.find(".activeTag").position().left);
        }

        //$('ul.tabs').tabs();    //initialize tabs
        $('.dropdown-button').dropdown(
            {    //initialize dropdown
                inDuration: 0,
                outDuration: 100,
                gutter: 0,
            }
        );

        onClickGoBottom($('#timedropdownbutton'), 110);
        resizeRouteContent($("#listRow"), $("#tagsRow"), $("#timeDropdownRow"));
        touchUpNewsList($list,isRequestFromNotification);

        //trackElemSwipe($("#listRow"));
        trackElemSwipe($("#newsList"), Hammer.DIRECTION_DOWN, function (){
            if ($("#listRow").scrollTop() == 0){
                $("#refreshDiv").slideDown(150, function (){
                    postRequest(TimeHelper.decide(globalSettings.currentFilter),globalSettings.currentTags);
                });
            }else{
                    console.log("swiped up, but not at the top of the list yet");
            }
        });
    };

    var postRequest = function (timeConfig, tags, isRequestFromNotification){
        console.log("Request posted with a timeConfig: " + JSON.stringify(timeConfig) + " and tag: " + tags);
        var requestParams = {
            userid:FabulaSysUsername,
            password:FabulaSysPassword,
            timerange:timeConfig,
            tags:tags
        };

        console.log("Request posted with the following params: " + JSON.stringify(requestParams));

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
                        //console.log("XHR object is " + JSON.stringify(XHR));
                        //var json = JSON.parse(XHR.responseText);
                        //errHandler(new Error(json.Message));
                        console.log("XHR object is " + JSON.stringify(XHR));
                        var responseText = XHR.responseText;
                        var errorMessage = responseText.match("<h1>(.*)</h1>")[1];
                        //match returns an array: the result we want is the second one

                        console.log(errorMessage);
                        errHandler(new Error(errorMessage));
                    }
                }
                /*errHandler(new Error(errorThrown));*/
            },
            success: function(data, status){
                onSuccess(data, status, isRequestFromNotification);
                FabulaSysApp.updateCheckTime(); //update the last checked time
            }
        });

    }


    var currentTimeConfig = TimeHelper.decide(globalSettings.currentFilter);
    var currentTag = globalSettings.currentTags;

    //isPendingNotification and notificationFilter come from our app's LandingWebViewClient in the LandingActivity
    if(typeof isPendingFromNotification != "undefined"){
        console.log("isPendingFromNotification is " + isPendingFromNotification);
        console.log("notificationFilter is " + JSON.stringify(notificationFilter));
    }else{
        console.log("isPendingFromNotification was not provided");
    }

    var isRequestFromNotification = false;  //for postRequest
    if(typeof isPendingFromNotification != "undefined" && isPendingFromNotification){
        currentTimeConfig = notificationFilter;
        console.log("sending news request that originated from a notification");
        isPendingFromNotification = false;  //disable it since its done its job, so this set of actions won't be executed again
        isRequestFromNotification  = true;   //pass this flag to postRequest to indicate that this is a request from the notification
    }

    postRequest(currentTimeConfig,currentTag,isRequestFromNotification);


});