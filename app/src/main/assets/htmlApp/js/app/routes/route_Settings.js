var route = new Router().route;

route("#Settings", function (event, $thisContainer){
    var titleHTML = "<h4 class='col s8 offset-s2 center'>Settings</h4>";
    var $Settings_TimeFilter_Button = $("<a class='col s8 offset-s2 btn small-vertical-margines' href='#Settings_TimeFilter'>Time Filters</a>");
    var $Settings_Tags_Button = $("<a class='col s8 offset-s2 btn small-vertical-margines' href='#Settings_Tags'>Tags Settings</a>");
    var $Settings_Notifications_Button = $("<a class='col s8 offset-s2 btn small-vertical-margines' href='#Settings_Notifications'>Notifications</a>");
    var $Settings_NewsFeed_Button = $("<a class='col s8 offset-s2 btn small-vertical-margines' href='#Settings_NewsFeed'>News Feed</a>");
    var $Settings_CloudSave_Button = $("<a class='col s8 offset-s2 btn small-vertical-margines' href='#Settings_CloudSave'>Cloud Save</a>");

    var $row = $('<div class="row small-vertical-margins"></div>');
    $row.append(titleHTML).append($Settings_TimeFilter_Button).append($Settings_Tags_Button).append($Settings_Notifications_Button).append($Settings_NewsFeed_Button).append($Settings_CloudSave_Button);

    $thisContainer.html($row);

    //we have to move the route declaration here instead of outside, since Click listeners aren't bound while the elements they're listening for don't exist yet
    route("#Settings_TimeFilter", Route_Settings_TimeFilter);
    route("#Settings_Tags", Route_Settings_Tags);
    route("#Settings_Notifications", Route_Settings_Notifications);
    route("#Settings_NewsFeed", Route_Settings_NewsFeed);
    route("#Settings_CloudSave", Route_Settings_CloudSave);
});

var CloudSaveDownload = function (){
        $.ajax({
            method: "GET",
            url: "https://fabula-node.herokuapp.com/usersappsettings/" + FabulaSysUsername,
            data: {
            },
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
                        var errorMessage = responseText.match("<h1>(.*)</h1>")[1];
                        //match returns an array: the result we want is the second one

                        console.log(errorMessage);
                        errHandler(new Error(errorMessage));
                    }
                }
                /*errHandler(new Error(errorThrown));*/
            },
            success: function(data, status){
                console.log("Retrieved cloud app settings are: " + JSON.stringify(data));
                console.log(data);

                if (data.isEmptyFlag){
                    toaster("No previously saved settings found");
                }else{
                    toaster("Cloud settings stored to device!");
                }

                globalSettings = data;
                globalSettingsSave();
            }
        });
}

var CloudSaveUpload = function (){
        $.ajax({
            method: "GET",
            url: "https://fabula-node.herokuapp.com/usersappsettings/set/" + FabulaSysUsername,
            data: {
                globalSettings: JSON.stringify(globalSettings)
            },
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
                        var errorMessage = responseText.match("<h1>(.*)</h1>")[1];
                        //match returns an array: the result we want is the second one

                        console.log(errorMessage);
                        errHandler(new Error(errorMessage));
                    }
                }
                /*errHandler(new Error(errorThrown));*/
            },
            success: function(data, status){
                console.log(data);
                if (data == "success"){
                    toaster("Settings saved to the cloud");
                }else{
                    toaster("Settings failed to save!");
                }
            }
        });
}

var Route_Settings_CloudSave = function (event, $thisContainer){
    var htmlTitle = '<div class="col s10 offset-s1" style="text-align: justify;"><h4 class="center"> Cloud Save Settings </h4> <p class="center" style="text-align: justify;"> here you can enable/disable auto cloud saving, as well as download settings previously saved to the cloud or upload your current one </p></div>';


    //globalSettings.isNewsFeedColourOn;
    //globalSettings.isNewsFeedImagesOn;

    var htmlFields      = "";
    htmlFields          +=  '<br />'
    htmlFields          +=  '<div class="input-field col s10 offset-s1 small-side-margins">'
    htmlFields          +=  '   <input type="checkbox" class="filled-in" ' + ((globalSettings.isCloudSyncOn) ? ' checked="checked" ' : "") + 'id="isCloudSyncOn"  />'
    htmlFields          +=  '   <label for="isCloudSyncOn">toggle cloud sync on/off</label>'
    htmlFields          +=  '</div>'
    htmlFields          +=  '<div class="input-field col s10 offset-s1"></div><br />'
    htmlFields          +=  '<div class="input-field col s10 offset-s1"></div><br />'
    htmlFields          +=  '<div class="input-field col s10 offset-s1 small-side-margins">'
    htmlFields          +=  '   <a id="SettingsCloudSaveDownload" class="col s5  waves-effect waves-light btn red darken-1">'
    htmlFields          +=  '       Download'
    htmlFields          +=  '   </a>'
    htmlFields          +=  '   <a id="SettingsCloudSaveUpload" class="col s5 offset-s2 waves-effect waves-light btn light-blue darken-1">'
    htmlFields          +=  '       Upload'
    htmlFields          +=  '   </a>'
    htmlFields          +=  '</div>'

    var $row =
        $('<div class="row small-vertical-margins"></div>').append(htmlTitle).append("<br />").append(htmlFields);
    $thisContainer.html($row);

    $("#SettingsCloudSaveDownload").on("click", function (){
        CloudSaveDownload();
    });
    $("#SettingsCloudSaveUpload").on("click", function (){
        CloudSaveUpload();
    });

    $('#isCloudSyncOn').change(function() {
        var checkboxVal = $(this).is(":checked");
        globalSettings.isCloudSyncOn = checkboxVal;
        globalSettingsSave();
    });



}

var Route_Settings_NewsFeed = function (event, $thisContainer){
    var htmlTitle = '<div class="col s10 offset-s1"><h4 class="center"> News Feed Settings </h4> <p class="center" style="text-align: justify;"> Here you can edit settings that will change how the news feed is displayed </p></div>';


    //globalSettings.isNewsFeedColourOn;
    //globalSettings.isNewsFeedImagesOn;

    var htmlFields      = "";
    htmlFields          +=  '<br />'
    htmlFields          +=  '<div class="input-field col s10 offset-s1 small-side-margins">'
    htmlFields          +=  '   <input id="paginationLimit" value="' + globalSettings.paginationLimit + '" type="tel" class="validate">'
    htmlFields          +=  '   <label class="active" for="paginationLimit"> news items per request (pagination) </label>'
    htmlFields          +=  '</div>'
    htmlFields          +=  '<div class="input-field col s10 offset-s1 small-side-margins">'
    htmlFields          +=  '   <input type="checkbox" class="filled-in" ' + ((globalSettings.isNewsFeedColourOn) ? ' checked="checked" ' : "") + 'id="isNewsFeedColourOn"  />'
    htmlFields          +=  '   <label for="isNewsFeedColourOn">toggle background colours on/off</label>'
    htmlFields          +=  '</div>'
    htmlFields          +=  '<br />'
    htmlFields          +=  '<div class="input-field col s10 offset-s1"></div><br />'
    htmlFields          +=  '<div class="input-field col s10 offset-s1 small-side-margins">'
    htmlFields          +=  '   <input type="checkbox" class="filled-in" ' + ((globalSettings.isNewsFeedImagesOn) ? ' checked="checked" ' : "") + 'id="isNewsFeedImagesOn"  />'
    htmlFields          +=  '   <label for="isNewsFeedImagesOn">toggle thumbnail images on/off</label>'
    htmlFields          +=  '</div>'
    htmlFields          +=  '<div class="input-field col s10 offset-s1"></div><br />'
    htmlFields          +=  '<div class="input-field col s10 offset-s1 small-side-margins">'
    htmlFields          +=  '   <input type="checkbox" class="filled-in" ' + ((globalSettings.isNewsFeedGoogleImageCompressionOn) ? ' checked="checked" ' : " ") + (!(globalSettings.isNewsFeedImagesOn) ? ' disabled="disabled" ' : "") + 'id="isNewsFeedGoogleImageCompressionOn"  />'
    htmlFields          +=  '   <label for="isNewsFeedGoogleImageCompressionOn">toggle thumbnail compression on/off (saves data, but may affect load time) </label>'
    htmlFields          +=  '</div>'
    htmlFields          +=  '<div class="input-field col s10 offset-s1"></div><br />'
    htmlFields          +=  '<div class="input-field col s10 offset-s1 small-side-margins">'
    htmlFields          +=  '   <a id="SettingsNewsFeedSave" class="col s6 offset-s6 waves-effect waves-light btn light-blue darken-1">'
    htmlFields          +=  '       <i class="mdi-content-save left"></i> Save'
    htmlFields          +=  '   </a>'
    htmlFields          +=  '</div>'

    var $row =
        $('<div class="row small-vertical-margins"></div>').append(htmlTitle).append("<br />").append(htmlFields);
    $thisContainer.html($row);

    //if the newsfeedimages option is checked, enable the newsfeedgoogleimagecompression option. else, disable it
    $("#isNewsFeedImagesOn").click(function (){
        if ( $(this).is(":checked") ){
            $("#isNewsFeedGoogleImageCompressionOn").removeAttr("disabled");
        }else{
            $("#isNewsFeedGoogleImageCompressionOn").attr("disabled","disabled");
        }
    });

    $("#SettingsNewsFeedSave").on("click", function (){
        globalSettings.isNewsFeedColourOn                   = $("#isNewsFeedColourOn").is(":checked");
        globalSettings.isNewsFeedImagesOn                   = $("#isNewsFeedImagesOn").is(":checked");
        globalSettings.isNewsFeedGoogleImageCompressionOn   = $("#isNewsFeedGoogleImageCompressionOn").is(":checked");

        var paginationLimit = $("#paginationLimit").val();
        if ($.isNumeric(paginationLimit)  && paginationLimit % 1 === 0 && parseInt(paginationLimit) > 1){
            globalSettings.paginationLimit = parseInt(paginationLimit);
            globalSettingsSave();

        }else{
            errHandler(new Error("Please enter a valid, positive whole number!"));
        }


    });

}

var Route_Settings_Notifications = function (event, $thisContainer){
    var htmlTitle = '<div class="col s10 offset-s1"><h4 class="center"> Notification Settings </h4> <p class="center style="text-align: justify;""> Here you can enable or disable the notifications. Additionally, you can set the frequency of how often they are checked for. </p></div>';

    var jsonNotificationSettings = JSON.parse(FabulaSysApp.getBackgroundTaskSettingsAsJSONString());
    console.log(jsonNotificationSettings);

    var backgroundInterval = jsonNotificationSettings.backgroundInterval;
    var isBackgroundTaskOn = jsonNotificationSettings.isBackgroundTaskOn;


    var htmlFields      = "";
    htmlFields          +=  '<br />'
    htmlFields          +=  '<div class="input-field col s10 offset-s1 small-side-margins">'
    htmlFields          +=  '   <input type="checkbox" class="filled-in" ' + ((isBackgroundTaskOn) ? ' checked="checked" ' : "") + 'id="NotificationsIsBackgroundTaskOn"  />'
    htmlFields          +=  '   <label for="NotificationsIsBackgroundTaskOn">toggle background tasks on/off</label>'
    htmlFields          +=  '</div>'
    htmlFields          +=  '<br />'
    htmlFields          +=  '<div class="input-field col s10 offset-s1"></div><br />'
    htmlFields          +=  '<div class="input-field col s10 offset-s1"></div><br />'
    htmlFields          +=  '<div class="input-field col s10 offset-s1 small-side-margins">'
    htmlFields          +=  '   <input id="NotificationsBackgroundInterval" value="' + backgroundInterval + '" type="tel" class="validate">'
    htmlFields          +=  '   <label class="active" for="NotificationsBackgroundInterval">Notification Checking Intervals (in minutes) </label>'
    htmlFields          +=  '</div>'
    htmlFields          +=  '<br />'
    htmlFields          +=  '<div class="input-field col s10 offset-s1 small-side-margins">'
    htmlFields          +=  '   <a id="SettingsNotificationsSave" class="col s6 offset-s6 waves-effect waves-light btn light-blue darken-1">'
    htmlFields          +=  '       <i class="mdi-content-save left"></i> Save'
    htmlFields          +=  '   </a>'
    htmlFields          +=  '</div>'
    var $saveButton = $('<a id="SettingsNotificationsSave" class="waves-effect waves-light btn light-blue darken-1"><i class="mdi-content-save left"></i> Save</a>');


    var $row =
        $('<div class="row small-vertical-margins"></div>').append(htmlTitle).append("<br />").append(htmlFields);

    $thisContainer.html($row);

    $("#SettingsNotificationsSave").on("click", function (){
        var interval = parseInt($("#NotificationsBackgroundInterval").val());
        var isOn = $("#NotificationsIsBackgroundTaskOn").is(":checked");

        var isNumber = !isNaN(parseFloat(interval)) && isFinite(interval);

        if(isNumber){
            //boolean isBackgroundTaskOn, int intervalTime
            FabulaSysApp.setBackgroundTaskSettings(isOn,interval);
            toaster("Save successful");
        }else{
            errHandler(new Error("Please enter only numbers"));
        }
    });
}

var Route_Settings_Tags = function (event, $thisContainer){
    var $toplevelrow = $('<div class="row"></div>');



    var $form = $('<form class="col s12"></form>');
    var $addTagsButton = $('<a id="SettingsTagsSave" class="col s4 offset-s1 waves-effect waves-light btn light-teal darken-1"><i class="mdi-av-my-library-add left"></i>Add Tag</a>');
    var $saveButton = $('<a id="SettingsTagsSave" class="col s4 offset-s2 waves-effect waves-light btn light-blue darken-1"><i class="mdi-content-save left"></i> Save</a>');

    var userTags = globalSettings.tagsList;

    for (var i =0; i< userTags.length; i++){
        var $row = $('<div class="row"></row>');
        var $deleteButton = $('<i class="col s1 mdi-navigation-close small" style="margin-top: 15px;"></i>');
        var $inputFieldWrapper = $('<div class="input-field col s9 offset-s1 "></div>');
        var $inputField = $('<input class="center-align" value="' +  userTags[i] +  '" type="text"></input>');

        $inputFieldWrapper.append($inputField);
        $row.append($inputFieldWrapper).append($deleteButton);
        $form.append($row);

        $deleteButton.on("click", function(){
            var inputVal = $(this).parent().find("div.input-field > input").val();

            //prevents the "all" tag from being removed
            if (inputVal == "all"){
                toaster("The 'all' tag cannot be removed!");
            }else{
                $(this).parent().remove();
            }
        })
    }

    $toplevelrow.append('<div class="row no-vertical-margins"><h4 class="col s6 offset-s3 center-align">Tags List</h4></div>').append('<div class="row no-vertical-margins"><p class="col s10 offset-s1 center-align" style="text-align: justify;">Edit any of the tags below or click the Add Tags button to add more. Click on the Save button to save changes. </p></div>').append($form).append($('<div class="row"></div>').append($addTagsButton).append($saveButton));

    $saveButton.on("click", function (){
        var newArr = [];
        $form.find("div.input-field > input").each(function (){
            if ($(this).val() != ""){
                newArr[newArr.length] =  $(this).val();
            }
        });
        globalSettings.tagsList = newArr;
        toaster("Changes saved");

        //just incase the currentTag was deleted, substitute current tag with a null
        var isInList = false;
        for (var i= 0; i< globalSettings.tagsList.length; i++){
            if (globalSettings.currentTags == globalSettings.tagsList[i]){
                isInList = true;
                break;
            }
        }
        if (!isInList){
            globalSettings.currentTags = null;
        }

        globalSettingsSave();
    });

    $addTagsButton.on("click", function (){
        var $row = $('<div class="row"></row>');
        var $deleteButton = $('<i class="col s1 mdi-navigation-close small" style="margin-top: 15px;"></i>');
        var $inputFieldWrapper = $('<div class="input-field col s9 offset-s1 "></div>');
        var $inputField = $('<input class="center-align" type="text"></input>');

        $inputFieldWrapper.append($inputField);
        $row.append($inputFieldWrapper).append($deleteButton);
        $form.append($row);

        $deleteButton.on("click", function(){
            var inputVal = $(this).parent().find("div.input-field > input").val();

            //prevents the "all" tag from being removed
            if (inputVal == "all"){
                toaster("The 'all' tag cannot be removed!");
            }else{
                $(this).parent().remove();
            }
        })
    })

    $thisContainer.html($toplevelrow);
    $(window).scrollTop(0);
}

var Route_Settings_TimeFilter = function (event, $thisContainer){
    var titleHTML = '<div class="col s8 offset-s2 "><h4 class="center">Time Filter Settings</h4></div>';
    var $Settings_TimeFilter_View_Button = $("<a class='col s8 offset-s2 btn small-vertical-margines' href='#Settings_TimeFilter_View'>View Time Filters</a>");
    var $Settings_TimeFilter_AddCustom_Button = $("<a class='col s8 offset-s2 btn small-vertical-margines' href='#Settings_TimeFilter_AddCustom'>Add Custom Time Filters</a>");

    var $row = $('<div class="row small-vertical-margins"></div>');
    $row.append(titleHTML).append('<br />').append($Settings_TimeFilter_View_Button).append('<br />').append($Settings_TimeFilter_AddCustom_Button);

    $thisContainer.html($row);

    route("#Settings_TimeFilter_View", Route_Settings_TimeFilter_View);
    route("#Settings_TimeFilter_AddCustom", Route_Settings_TimeFilter_AddCustom);
}

var Route_Settings_TimeFilter_View = function (event, $thisContainer){
    var $list = $('<ul id="timeFilterList" class="collection with-header"></ul>');
    var listItems = '';
    console.log("debug message - timefilter looks like this now: " + JSON.stringify(globalSettings.timeFilters))
    for (var key in globalSettings.timeFilters){
        console.log("debug message - current key is : " + key);
        if(globalSettings.timeFilters.hasOwnProperty(key)){
            listItems += '<li class="collection-item"><div> <span class="filterKey">' +key+ '</span> <a href="#!" class="secondary-content FilterDeleteButton"><i class="mdi-action-delete small"></i></a></div></li>'
        }
    }
    var saveButtonRow =     '<div class="row">'
        saveButtonRow +=    '   <div class="col s5 offset-s7">'
        saveButtonRow +=    '       <a id="TimeFilterViewSave" class="waves-effect waves-light btn light-blue darken-1"><i class="mdi-content-save left"></i> Save Changes</a>'
        saveButtonRow +=    '   </div>'
        saveButtonRow +=    '</div>'
    $list.html(listItems);

    var $header = $('<ul class="collection with-header"><li class="collection-header"><h4>Current Filters</h4></li></ul>');
    var $listItemWrapper = $('<li class="collection-item"></li>');
    var $inputWrapper = $('<div class="input-field small-vertical-margins"></div>');
    var $checkbox = $('<input type="checkbox" class="filled-in" id="sortableLever" />');

    $inputWrapper.append($checkbox).append('<label for="sortableLever">enable repositioning</label>');
    $header.find(".collection-header").append('<div class="no-vertical-margins">To reposition, check or uncheck the checkbox below. To delete, ensure the checkbox is unchecked and click on the garbage bin icons </div>').append($inputWrapper);

    $thisContainer.html($list).append(saveButtonRow).prepend($header);


    //bind the sortability of the #timeFilterList list to our #sortableLever checkbox
    $("#sortableLever").on("change", function (){
        var isChecked = $(this).is(':checked');
        if (isChecked){
            //make list sortable
            $('#timeFilterList').sortable();
        }else{
            //make list unsortable
            $('#timeFilterList').sortable("destroy");
        }
    });


    //listener for delete button
    $(".FilterDeleteButton").on("click", function(event){
        var $parent = $(this).closest(".collection-item").remove();

    });


    //event listener for the savebutton
    $("#TimeFilterViewSave").on("click", function(){
        var newTimeFiltersContainer = {};

        $("#timeFilterList").find("li.collection-item").each(function(){
            var $thisListItem = $(this);
            var thisKey = $thisListItem.find(".filterKey").text();

            newTimeFiltersContainer[thisKey] = globalSettings.timeFilters[thisKey];
        });
        globalSettings.timeFilters = undefined;
        globalSettings.timeFilters = newTimeFiltersContainer;
        toaster("Changes saved");
        globalSettingsSave(); //save the global settings to the app's shared preferences
    });
}

var Route_Settings_TimeFilter_AddCustom = function (event, $thisContainer, isEdit){
    if (isEdit){
        //do something specific only for edits
        //e.g: disable editing name of filter
    }

    var initialHTML =   '<h5> Time Filters </h5>';
        initialHTML +=  '<div>'
        initialHTML +=  '   <p>To create your own custom time filter, specify the Start and End points of your filter</p>'
        initialHTML +=  '</div>'
        initialHTML +=  '<div class="row">'
        initialHTML +=  '   <div class="col s10 offset-s1 input-field">'
        initialHTML +=  '       <input placeholder="enter filter name here" id="filterName" type="text">'
        initialHTML +=  '       <label for="filterName" class="active">Filter Name</label>'
        initialHTML +=  '   </div>'
        initialHTML +=  '</div>'
        initialHTML +=  '<ul class="collapsible" data-collapsible="accordion" id="timeFilterCollapsible"></ul>'
        initialHTML +=  '<div class="row">';

        initialHTML +=  '   <div class="col s5 offset-s7">'
        initialHTML +=  '       <a id="TimeFilterSaveButton" class="waves-effect waves-light btn light-blue darken-1"><i class="mdi-content-save small right"></i>Save</a>'
        initialHTML +=  '   </div>'
        initialHTML +=  '</div>'
    $thisContainer.html(initialHTML);

    var $collapsibleList = $("#timeFilterCollapsible");
    var isCollapsibleItem = true;

    var $StartForm = appendFilterMenu("Start", $collapsibleList, isCollapsibleItem);
    var $EndForm = appendFilterMenu("End", $collapsibleList, isCollapsibleItem);

    //enable collapsible list
    $thisContainer.find('.collapsible').collapsible({
          // settings go here
    });

    /*$("#TimeFilterPreviewButton").on("click", function(){
        var startInternalFilter = convertFormToFilter("Start");
        var endInternalFilter = convertFormToFilter("End");

        var fullFilter = {
            name: "testing",
            startFilter: startInternalFilter,
            endFilter: endInternalFilter,
        }

        var timeConfig = timeHelper.useRelativeFilter(fullFilter);
        console.log("The current time filter of this page is defined as: " + JSON.stringify(timeConfig));
        console.log("ALL the SAVED time filters are: " + JSON.stringify(globalSettings.timeFilters));
    });*/

    $("#TimeFilterSaveButton").on("click", function(){
        var startInternalFilter = convertFormToFilter("Start");
        var endInternalFilter = convertFormToFilter("End");

        var filterName = $("#filterName").val();

        if(!filterName || filterName == ""){
            errHandler(new Error("Filter name was empty or invalid!"));
        }else if(typeof globalSettings.timeFilters[filterName] !== 'undefined'){
            errHandler(new Error("That filter name has already been used! Pick another one!"));
        }else{
              var fullFilter = {
                  name: filterName,
                  startFilter: startInternalFilter,
                  endFilter: endInternalFilter,
              }
              globalSettings.timeFilters[filterName] = fullFilter;
              toaster('"' +filterName+ '" has been added to the custom filters list!');
              globalSettingsSave(); //save the global settings to the app's shared preferences
              //var timeConfig = timeHelper.useRelativeFilter(fullFilter);
        }
    });

}

var appendFilterMenu = function (idPrefix, $parentElement, isCollapsibleItem) {
    /*idPrefix is a unique value we will prefix to all elements that require an ID, to ensure we can generate unique IDs*/
    var $form = $("<form class='col s12' id='" +idPrefix+ "Form'></form>");

    //our form-to-filter interface. we return this at the end. very important.
    var formInterface = {};

    var headerContent =     '<div class="row">'
        headerContent +=    '   <div class="col s10 offset-s1">'
        headerContent +=    '       <h5 class=".center-align">' +idPrefix+ '</h5>'
        headerContent +=    '   </div>'
        headerContent +=    '</div>'

    var $nameRow =  $("<div class='row' id='" +idPrefix+ "NameRow'></div>");
    var nameRowContents =       '<div class="input-field col s10 offset-s1">';
        nameRowContents +=      '   <input type="text" id="'+idPrefix+'NameInput" placeholder="enter time filter name here"> </input> '
        nameRowContents +=      '   <label for="'+idPrefix+'NameInput" class="active">Filter Name</label>'
        nameRowContents +=      '</div>';
    $nameRow.append(nameRowContents);


    // Icons for plus/minus symbols
    // mdi-content-remove ; mdi-content-add
    // mdi-content-remove-circle-outline ; mdi-content-add-circle-outline


    // All inputs of the type=tel have a "data-positivity" html5 data attribute
    // this attribute can be set to either "1" or "-1" (see events far below)
    // this determines if the time was "ago" (-1) or "ahead" (1)


    var $yearsMonthsDateRow =  $("<div class='row' id='" +idPrefix+ "YearsMonthsRow'></div>");
    var yearsMonthsDateRowContents =    '<div class="input-field col s3 offset-s1">';
        yearsMonthsDateRowContents +=   '   <i class="small mdi-content-remove-circle-outline active prefix"></i>'
        yearsMonthsDateRowContents +=   '   <input type="tel" placeholder="0" id="' +idPrefix+ 'YearsInput" data-positivity="-1"> </input> '
        yearsMonthsDateRowContents +=   '   <label for="'+idPrefix+'YearsInput" class="active">Years</label>'
        yearsMonthsDateRowContents +=   '</div>';
        yearsMonthsDateRowContents +=   '<div class="input-field col s3">';
        yearsMonthsDateRowContents +=   '   <i class="small mdi-content-remove-circle-outline active prefix"></i>'
        yearsMonthsDateRowContents +=   '   <input type="tel" placeholder="0" id="' +idPrefix+ 'MonthsInput" data-positivity="-1"> </input> '
        yearsMonthsDateRowContents +=   '   <label for="'+idPrefix+'MonthsInput" class="active">Months</label>'
        yearsMonthsDateRowContents +=   '</div>';
        yearsMonthsDateRowContents +=   '<div class="input-field col s4">';
        yearsMonthsDateRowContents +=   '   <i class="small mdi-content-remove-circle-outline active prefix"></i>'
        yearsMonthsDateRowContents +=   '   <input type="tel" placeholder="0" id="' +idPrefix+ 'DateInput" data-positivity="-1"> </input> '
        yearsMonthsDateRowContents +=   '   <label for="'+idPrefix+'DateInput" class="active">Days</label>'
        yearsMonthsDateRowContents +=   '</div>';
    $yearsMonthsDateRow.append(yearsMonthsDateRowContents);

    //Hours settings has two kinds: specific or relative. We programatically find out which is being used via the data-isSpecific data attribute of
    //HoursRow.
    // access by $("#HoursRow").data("isspecific");
    // modify by $("#HoursRow").data("isspecific", true);   NOTE: the value WILL NOT be changed in the DOM. only in jQuery's internal "memory"
    var $hoursRow = $("<div class='row' id='" +idPrefix+ "HoursRow' data-isspecific='false'></div>");
    var hoursRowContents =      '   <div id="'+idPrefix+'HoursTabs" class="col s10 offset-s1">'
        hoursRowContents +=     '       <ul class="tabs">'
        hoursRowContents +=     '           <li class="tab col s5">  <a href="#'+idPrefix+'RelativeHours">Relative</a>  </li>'
        hoursRowContents +=     '           <li class="tab col s5">  <a href="#'+idPrefix+'SpecificHours">Specific</a>  </li>'
        hoursRowContents +=     '       </ul>'
        hoursRowContents +=     '   </div>'
        hoursRowContents +=     '   <div id="'+idPrefix+'RelativeHours">'
        hoursRowContents +=     '       <div class="input-field col s4 offset-s1">'
        hoursRowContents +=     '           <i class="small mdi-content-remove-circle-outline active prefix"></i>'
        hoursRowContents +=     '           <input type="tel" placeholder="0" id="' +idPrefix+ 'HoursInput" data-positivity="-1"> </input> '
        hoursRowContents +=     '           <label for="'+idPrefix+'HoursInput" class="active">Hours</label>'
        hoursRowContents +=     '       </div>';
        hoursRowContents +=     '       <div class="input-field col s4 offset-s1">'
        hoursRowContents +=     '           <i class="small mdi-content-remove-circle-outline active prefix"></i>'
        hoursRowContents +=     '           <input type="tel" placeholder="0" id="' +idPrefix+ 'MinutesInput" data-positivity="-1"> </input> '
        hoursRowContents +=     '           <label for="'+idPrefix+'MinutesInput" class="active">Minutes</label>'
        hoursRowContents +=     '       </div>';
        hoursRowContents +=     '   </div>';
        hoursRowContents +=     '   <div id="'+idPrefix+'SpecificHours">'
        hoursRowContents +=     '       <div class="input-field input-group clockpicker col s10 offset-s1">'
        hoursRowContents +=     '           <i class="small mdi-device-access-time active prefix"></i>'
        hoursRowContents +=     '           <input type="text" class="form-control" id="' +idPrefix+ 'SpecificHoursInput" value="00:00" onfocus="blur();">'
        hoursRowContents +=     '       </div>'
        hoursRowContents +=     '   </div>';
    $hoursRow.append(hoursRowContents);


    /*var buttonsRowContents =    '<br/> <div class="row">';
        buttonsRowContents +=   '   <div class="col s4 offset-s1">'
        buttonsRowContents +=   '       <a id="'+idPrefix+'PreviewButton" class="waves-effect waves-light btn">Preview</a>'
        buttonsRowContents +=   '   </div>'
        buttonsRowContents +=   '   <div class="col s4 offset-s2">'
        buttonsRowContents +=   '       <a id="'+idPrefix+'SaveButton" class="waves-effect waves-light btn light-blue darken-1"><i class="mdi-content-save"></i>Save</a>'
        buttonsRowContents +=   '   </div>'
        buttonsRowContents +=   '</div>'
    */

    //$form.append(headerContent).append($nameRow).append($yearsMonthsDateRow).append($hoursRow).append(buttonsRowContents);
    $form.append("<br />").append($yearsMonthsDateRow).append($hoursRow);


    if (!isCollapsibleItem){
        //if not a collapsible item, just append the form to the parent element directly
        $parentElement.append($form);
    }else{
        //else, this should be a collapsible item and the parent is a collapsible list. format it appropriately.
        var $collapsibleListItem = $('<li id="'+idPrefix+ 'ListItem" ></li>');
        var collapsibleHeaderContent = '<div class="collapsible-header"><i class="mdi-action-schedule"></i>'+idPrefix+'</div>';
        var $collapsibleBody = $('<div class="collapsible-body"></div>').append($form);
        $collapsibleListItem.append(collapsibleHeaderContent).append($collapsibleBody);
        $parentElement.append($collapsibleListItem);
    }


    /*now that the form is appended to the parent, we can start binding our event handlers/bootup our JS dependent elements*/
    //enable tabs
    var $thisForm = $("#" + idPrefix + "Form");
    $thisForm.find('ul.tabs').tabs();

    //enable clockpicker
    $thisForm.find('.clockpicker').clockpicker({
        placement: 'top',
        autoclose:"true",
        donetext: 'Done'
    });

    //flip the positive-negative values of the icons on click

   $thisForm.find("i").on("click", function (){
        var $thisEle = $(this);

        if( $thisEle.hasClass("mdi-content-remove-circle-outline") ){
            $thisEle.removeClass("mdi-content-remove-circle-outline");
            $thisEle.addClass("mdi-content-add-circle-outline");

            $thisEle.next("input").data("positivity", 1);
        }else if ($thisEle.hasClass("mdi-content-add-circle-outline")){
            $thisEle.removeClass("mdi-content-add-circle-outline");
            $thisEle.addClass("mdi-content-remove-circle-outline");

            $thisEle.next("input").data("positivity", -1);
        }
    });

    //configure the tabs for the hours settings
    $thisForm.find("#"+idPrefix+"HoursTabs").find("a").on("click", function(){
        var $thisEle = $(this);
        var $hoursRow = $("#"+idPrefix+"HoursRow");


        if ($thisEle.attr("href") === "#"+idPrefix+"RelativeHours"){
            $hoursRow.data("isspecific",false);

        }else{
            $hoursRow.data("isspecific",true);
        }
        console.log("Hours setting is specific hours? Answer: " + $hoursRow.data("isspecific"));
    });





    return $thisForm;
    /*
        years:0, months:0, date:0,
        hours:-2, minutes:0, seconds:0,
        specifigHours:null
    */
    /* NOTE NOTE NOTE: THERE IS NO SECONDS SETTING FOR USERS TO USE! IT DOESNT EXIST! DONT EXPECT IT! THE SCRAPER WORKS MINUTELY ANYWAY! *******************************************/


}

var convertFormToFilter = function (idPrefix){
    var internalFilter = {
        years:0, months:0, date:0,
        hours:0, minutes:0, seconds:0,
        specifigHours:null
    };

    var yearsInput = $("#" + idPrefix + "YearsInput");
    var yearsValue =  ( yearsInput.val() !== "" ) ? yearsInput.val() * yearsInput.data("positivity") : 0;
    internalFilter.years = yearsValue;

    var monthsInput = $("#" + idPrefix + "MonthsInput");
    var monthsValue =  ( monthsInput.val() !== "" ) ? monthsInput.val() * monthsInput.data("positivity") : 0;
    internalFilter.months = monthsValue;

    var dateInput = $("#" + idPrefix + "DateInput");
    var dateValue =  ( dateInput.val() !== "" ) ? dateInput.val() * dateInput.data("positivity") : 0;
    internalFilter.date = dateValue;

    var isSpecific = $("#" + idPrefix + "HoursRow").data("isspecific");
    if( isSpecific === true ){
        var timestamp = $("#" + idPrefix + "SpecificHoursInput").val();
        var hours = parseInt(timestamp.substring(0,2));
        var minutes = parseInt(timestamp.substring(3,5));

        var specifigHours = [hours,minutes,0,0];
        internalFilter.specifigHours = specifigHours;
        //console.log("hours are:" + hours + " while minutes are:" + minutes);
        //[hour,min,second,milsecond]
        //[23,59,59,999]
    }else{
        var hoursInput = $("#" + idPrefix + "HoursInput");
        var hoursValue =  ( hoursInput.val() !== "" ) ? hoursInput.val() * hoursInput.data("positivity") : 0;
        internalFilter.hours = hoursValue;

        var minutesInput = $("#" + idPrefix + "MinutesInput");
        var minutesValue =  ( minutesInput.val() !== "" ) ? minutesInput.val() * minutesInput.data("positivity") : 0;
        internalFilter.minutes = minutesValue;
    }


    //internalFilter.years =

    //console.log(JSON.stringify(internalFilter));
    return internalFilter;
}
