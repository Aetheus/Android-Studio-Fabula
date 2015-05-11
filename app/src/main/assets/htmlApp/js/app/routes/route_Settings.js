var route = new Router().route;

route("#Settings", function (event, $thisContainer){
    var $Settings_TimeFilter_Button = $("<a class='btn' href='#Settings_TimeFilter'>Time Filters</a>");
    $thisContainer.html($Settings_TimeFilter_Button);

    //we have to move the route declaration here instead of outside, since Click listeners aren't bound while the elements they're listening for don't exist yet
    route("#Settings_TimeFilter", Route_Settings_TimeFilter);
});

var Route_Settings_TimeFilter = function (event, $thisContainer){
    var $Settings_TimeFilter_View_Button = $("<a class='btn' href='#Settings_TimeFilter_View'>View Time Filters</a>");
    var $Settings_TimeFilter_AddCustom_Button = $("<a class='btn' href='#Settings_TimeFilter_AddCustom'>Add Custom Time Filters</a>");

    var $minicontainer = $("<div></div>").append($Settings_TimeFilter_View_Button).append($Settings_TimeFilter_AddCustom_Button);
    $thisContainer.html($minicontainer);

    route("#Settings_TimeFilter_View", Route_Settings_TimeFilter_View);
    route("#Settings_TimeFilter_AddCustom", Route_Settings_TimeFilter_AddCustom);
}

var Route_Settings_TimeFilter_View = function (event, $thisContainer){
    var $list = $('<ul id="timeFilterList" class="collection with-header"></ul>');
    var listItems = '<li class="collection-header"><h4>Current Filters</h4><p>Drag the filters up/down to reposition them</p></li>';
    for (var key in globalSettings.timeFilters){
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
    $thisContainer.html($list).append(saveButtonRow);

    //make list sortable
    $('#timeFilterList').sortable();

    //listener for delete button
    $(".FilterDeleteButton").on("click", function(){
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
        initialHTML +=  '   <div class="col s5 offset-s1">'
        initialHTML +=  '       <a id="TimeFilterPreviewButton" class="waves-effect waves-light btn">Console Log</a>'
        initialHTML +=  '   </div>'
        initialHTML +=  '   <div class="col s5 ">'
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

    $("#TimeFilterPreviewButton").on("click", function(){
        var startInternalFilter = convertFormToFilter("Start");
        var endInternalFilter = convertFormToFilter("End");

        var fullFilter = {
            name: "testing",
            startFilter: startInternalFilter,
            endFilter: endInternalFilter,
        }

        var timeConfig = timeHelper.useRelativeFilter(fullFilter);
        console.log(JSON.stringify(timeConfig));
    });

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
