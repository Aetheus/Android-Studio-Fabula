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
        if (interval >= 1) {
            if(interval == 1) {
                return interval + " day";
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

    //produces a loading screen and replaces either #listRow or #AllNews with it depending on the isReplaceAll flag
    var loaderScreen = function (isReplaceAll){
        if (isReplaceAll){
            $("#AllNews").html(reusableAssets.loaderAnim);
        }else{
            $("#listRow").html(reusableAssets.loaderAnim);
        }
    }

    //opens the link by calling our JS interface in the app and having it launch a new activity
    var openLink = function (link){
        console.log("opening link: " + link);
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



    var bindTimeChoice = function ($timeChoice) {
        $timeChoice.click(function (){
            globalSettings.currentFilter = $(this).text();
            var timeConfig = TimeHelper.decide(globalSettings.currentFilter);
            loaderScreen(false);
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
            loaderScreen(false);
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

    var populateNewsList = function ($list, JSONarray, paginationOffset, searchQuery){
       for(var i=0; i< JSONarray.length; i++){
            var itemID = JSONarray[i].fitfeeditemid;
            var $listItem = $('<li class="collection-item avatar" ></li>');
            var $iconImage;
            var $title = $('<div  class="title boldFont">' + JSONarray[i].fitfeeditemtitle + '</div>'); //id="NewsItem' + itemID + 'Title"
            var $content = $('<div></div>');


            //if image exists and globalSettings permits its use, use it as thumbnail. else, use a default icon
            if(JSONarray[i].fitfeeditemimagelink != null && JSONarray[i].fitfeeditemimagelink != DBNull && globalSettings.isNewsFeedImagesOn){
                //if image compression option turned on, make use of Google image compression API.
                if (globalSettings.isNewsFeedGoogleImageCompressionOn){
                    var compressedURL = "https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url=" + encodeURIComponent(JSONarray[i].fitfeeditemimagelink) + "&container=focus&resize_w=60&refresh=1800";
                    $iconImage = $('<img src="' + compressedURL + '" class="circle avatarCollectionImage" />');
                }else{
                    $iconImage = $('<img src="' + JSONarray[i].fitfeeditemimagelink + '" class="circle avatarCollectionImage" />');
                }

                //if any errors occur, fallback to our icon
                $iconImage.on("error", function (){
                    $(this).replaceWith('<i class="mdi-action-assessment large circle green avatarCollectionIcon"></i>');
                });
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
            //one final check - if this item has no description and no title and no image - remove it. It's likely a bugged news item or a hidden div that sites like BBC seem to use
            //else, include it into the list as usual
            var finalCheckFailed
                    =   (JSONarray[i].fitfeeditemimagelink == null || JSONarray[i].fitfeeditemimagelink == DBNull)
                    &&  (JSONarray[i].fitfeeditemdescription == null || JSONarray[i].fitfeeditemdescription == DBNull)
                    &&  (JSONarray[i].fitfeeditemtitle == null || JSONarray[i].fitfeeditemtitle == DBNull)

            if (finalCheckFailed){
                $listItem.remove();
                console.log("bugged news item removed");
            }else{
                $list.append($listItem);
            }
        }

        var $enderDiv = $('<div id="enderDiv" class="center waves-effect"> <a href="#!"> &#x21bb; double tap here to load older news </a> </div>');
        $list.append($enderDiv);

        $enderDiv.data("paginationOffset", paginationOffset ? paginationOffset : 0);

        var confirmedSearchQuery = (typeof searchQuery !== 'undefined') ? searchQuery : null;
        $enderDiv.find("a").on("click", function(event){
            event.preventDefault();
            var $thisEnderDiv = $(this).parent();

            //if($thisEnderDiv.find(".preloader-wrapper").length < 1){
            var currentTimeConfig = TimeHelper.decide(globalSettings.currentFilter);
            var currentTag = globalSettings.currentTags;

            $thisEnderDiv.data("paginationOffset", $thisEnderDiv.data("paginationOffset") + globalSettings.paginationLimit);

            $(this).addClass("myHidden");
            $thisEnderDiv.append(reusableAssets.simplePreloader);
            $thisEnderDiv.find(".preloader-wrapper").css("margin-top", "10px");

            postRequest(currentTimeConfig,currentTag,false, $thisEnderDiv.data("paginationOffset"), true, confirmedSearchQuery);
            //}else{
            //console.log("Already loading next page. ignoring this request.")
            //}

        });


        var $refreshDiv = $('<div id="refreshDiv" class="center"></div>').html(reusableAssets.simplePreloader).append("");
        $list.prepend($refreshDiv);
    }


    var bindSearchModalButton = function ($searchButton,$input){
        $searchButton.on("click", function(){
            //make the request
            loaderScreen(false);
            //timeConfig, tags, isRequestFromNotification, paginationOffset, isPaginationRequest, searchQuery
            postRequest(TimeHelper.decide(globalSettings.currentFilter),globalSettings.currentTags,false, 0, false, $input.val());
        })
    }

    var onSuccess = function (data, status,isRequestFromNotification, paginationOffset, isPaginationRequest, searchQuery){
        //{"fitfeeditemid":20280,"fitfeedchannelid":1,"fitfeeditemtitle":"APU CAREERS CENTRE: JOB OPPORTUNITIES","fitfeeditemlink":"http://webspace.apiit.edu.my/user/view.php?id=24345&course=1","fitfeeditemdescription":"by WEBSPACE   - Friday, 10 April 2015, 2:48 PM","fittimestamp":"2015-04-10T08:39:05.457Z","fitfeeditemimagelink":"%%%NULL%%%","fitisread":false}

        //if running on the phone, update our last check time
        if (typeof FabulaSysApp !== "undefined"){
            console.log("Updating app's last checked time");
            FabulaSysApp.updateCheckTime();
            console.log("App's last checked time successfully updated");
        }else{
            console.log("Not running in the phone, so not updating the last checked time");
        }

        var confirmedSearchQuery = (typeof searchQuery !== 'undefined') ? searchQuery : null;
        var confirmedPaginationRequest = (typeof isPaginationRequest === 'undefined') ? false : isPaginationRequest;
        var JSONarray = data;

        if(JSONarray.length == 0){
            toaster("No news found");
        }

        if (!confirmedPaginationRequest){
        //for loading the entire page

            var $timeDropdownButton = $("<a id='timedropdownbutton' class='dropdown-button btn col s10' href='#' data-activates='timedropdown'>time filter</a>");
            var $searchButton = $('<a class="modal-trigger waves-effect waves-light btn col s2  red lighten-2" style="height: 45px;" href="#searchModal"><i class="large mdi-action-search" style="font-size: 2rem;"></i></a>' +
                                    '<div id="searchModal" class="modal">' +
                                     	'<div class="modal-content">'+
                                     		'<h4>Search News</h4>' +
                                     		'<div class="input-field">'+
                                     			'<input id="searchModalInput" type="text"></input>'+
                                     			'<label for="searchModalInput">enter search query here</label>' +
                                     		'</div>'+
                                         '</div>'+
                                         '<div class="modal-footer">'+
                                     		'<a id="searchModalButton" href="#!" class="modal-action modal-close waves-effect waves-green btn-flat ">Search</a>'+
                                     		'<a class="modal-action modal-close waves-effect waves-green btn-flat ">Cancel</a>'+
                                         '</div>'+
                                     '</div>');

            var $timeDropdownList = $("<ul id='timedropdown' class='dropdown-content'></ul>");
            var $timeDropdownRow = $('<div id="timeDropdownRow" class="row no-vertical-margins" id="filterContainer"></div>').append($timeDropdownButton).append($timeDropdownList).append($searchButton);

            //var $tagRow = $('<div id="tagsRow" class="row no-vertical-margins"><div class="col s12"><ul class="tabs"><li class="tab col s3"><a href="#test1">Test 1</a></li><li class="tab col s3"><a class="active" href="#test2">Test 2</a></li><li class="tab col s3"><a href="#test3">Test 3</a></li><li class="tab col s3"><a href="#test4">Test 4</a></li></ul></div><div id="test1" class="col s12">Test 1</div><div id="test2" class="col s12">Test 2</div><div id="test3" class="col s12">Test 3</div><div id="test4" class="col s12">Test 4</div></div>');
            var $tagRow = buildTagRow();

            var $list = $('<ul id="newsList" class="collection no-vertical-margins"></ul>');
            populateNewsList($list, JSONarray, paginationOffset, confirmedSearchQuery);
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

            //enable modals
            $('.modal-trigger').leanModal();

            //bind search modal button
            bindSearchModalButton($("#searchModalButton"),$("#searchModalInput"));

            touchUpNewsList($list,isRequestFromNotification);
            //$("#enderDiv").data("offset", paginationOffset);

        }else{
        //for pagination requests only
            var $actualNewsList = $("#newsList");
            var $tempList = $('<ul id="tempList" class="myHidden collection no-vertical-margins"></ul>');
            $thisContainer.append($tempList);


            populateNewsList($tempList, JSONarray, null, confirmedSearchQuery);
            $tempList.find("li").each(function (){
                var thisListItem = $(this);
                //$actualNewsList.before("#enderDiv").append(thisListItem);
                $("#enderDiv").before(thisListItem);
            })

            $("#enderDiv").data("offset", paginationOffset);
            $("#enderDiv").find(".preloader-wrapper").remove();
            $("#enderDiv").find("a").removeClass("myHidden");
            //$("#enderDiv").html("<a href='#!'> &#x21bb; tap here to load older news </a>");

            $tempList.remove();

            touchUpNewsList($actualNewsList,isRequestFromNotification);
        }

        //if there's not even enough news to fit the paginationLimit, there aren't any older news. So, no need to display the enderDiv
        if(JSONarray.length < globalSettings.paginationLimit){
            $("#enderDiv").addClass("myHidden");
            if(JSONarray.length > 0 && confirmedPaginationRequest){
                toaster("reached the oldest news for this filter and tag settings!");
            }
        }

        if((JSONarray.length == 0) && (typeof isPaginationRequest !== 'undefined') && !(isPaginationRequest)){
            $("#newsList").append(reusableAssets.pullToRefresh);
        }

        if (typeof searchQuery !== 'undefined'){
            toaster("search results for: " + searchQuery, 6000);
        }
    };

    var postRequest = function (timeConfig, tags, isRequestFromNotification, paginationOffset, isPaginationRequest, searchQuery){
        console.log("Request posted with a timeConfig: " + JSON.stringify(timeConfig) + " and tag: " + tags);

        var paginationOffsetConfirmed = (typeof paginationOffset === 'undefined') ? 0 : paginationOffset;
        var limit = globalSettings.paginationLimit;
        var requestRowLimit = { offset:paginationOffsetConfirmed, limit:limit};

        var searchQueryConfirmed = (typeof searchQuery !== 'undefined') ? searchQuery : null;
        //RowLimit.limit; RowLimit.offset;
        var requestParams = {
            userid:FabulaSysUsername,
            password:FabulaSysPassword,
            timerange: timeConfig,
            rowlimit : requestRowLimit,
            searchquery: searchQueryConfirmed,
            tags:tags
        };

        console.log("Request posted with the following params: " + JSON.stringify(requestParams));

        $.ajax({
            method: "POST",
            url: "https://fabula-node.herokuapp.com/usersfeeditems",
            data: requestParams,
            complete : function(XHR,textStatus){
                //toaster("Request Status: " + textStatus, 500);
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

                        var errorMessage;
                        try{
                            errorMessage = responseText.match("<h1>(.*)</h1>")[1];
                            //match returns an array: the result we want is the second one
                        }catch(err) {
                            //errorMessage = "An error occured and no appropriate error message was found for it";
                            errorMessage = "A server error has occured. Kindly try again in a few minutes time";
                        }


                        console.log(errorMessage);
                        errHandler(new Error(errorMessage));
                    }
                }
                /*errHandler(new Error(errorThrown));*/
            },
            success: function(data, status){
                var isRequestFromNotificationConfirmed = (typeof isRequestFromNotification === 'undefined') ? false : isRequestFromNotification;
                var isPaginationRequestConfirmed = (typeof isPaginationRequest === 'undefined') ? false : isPaginationRequest;
                onSuccess(data, status, isRequestFromNotificationConfirmed, paginationOffset, isPaginationRequestConfirmed, searchQuery);
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

    loaderScreen(true);
    postRequest(currentTimeConfig,currentTag,isRequestFromNotification, 0, false);


});