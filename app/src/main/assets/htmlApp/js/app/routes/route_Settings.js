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
    var $minicontainer = $("<div></div>");
    for (var key in globalSettings.timeFilters){
        $filterDiv = $("<div></div>");
        $filterDiv.html(key);
        $minicontainer.append($filterDiv);
    }
    $thisContainer.html($minicontainer);
}

var Route_Settings_TimeFilter_AddCustom = function (event, $thisContainer, isEdit){
    if (isEdit){
        //do something specific only for edits
        //e.g: disable editing name of filter
    }

    //blank out the html; maybe remove this if we use loader spinners to indicate loading instead?
    $thisContainer.html(" ");

    var startFormInterface = appendFilterMenu("Start", $thisContainer);

}

var appendFilterMenu = function (idPrefix, $parentElement) {
    /*idPrefix is a unique value we will prefix to all elements that require an ID, to ensure we can generate unique IDs*/
    var $form = $("<form class='col s12' id='" +idPrefix+ "StartForm'></form>");

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
        yearsMonthsDateRowContents +=   '   <i class="small mdi-content-remove-circle-outline prefix"></i>'
        yearsMonthsDateRowContents +=   '   <input type="tel" placeholder="0" id="' +idPrefix+ 'YearsInput" data-positivity="-1"> </input> '
        yearsMonthsDateRowContents +=   '   <label for="'+idPrefix+'YearsInput" class="active">Years</label>'
        yearsMonthsDateRowContents +=   '</div>';
        yearsMonthsDateRowContents +=   '<div class="input-field col s3">';
        yearsMonthsDateRowContents +=   '   <i class="small mdi-content-remove-circle-outline prefix"></i>'
        yearsMonthsDateRowContents +=   '   <input type="tel" placeholder="0" id="' +idPrefix+ 'MonthsInput" data-positivity="-1"> </input> '
        yearsMonthsDateRowContents +=   '   <label for="'+idPrefix+'MonthsInput" class="active">Months</label>'
        yearsMonthsDateRowContents +=   '</div>';
        yearsMonthsDateRowContents +=   '<div class="input-field col s4">';
        yearsMonthsDateRowContents +=   '   <i class="small mdi-content-remove-circle-outline prefix"></i>'
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
        hoursRowContents +=     '           <i class="small mdi-content-remove-circle-outline prefix"></i>'
        hoursRowContents +=     '           <input type="tel" placeholder="0" id="' +idPrefix+ 'HoursInput" data-positivity="-1"> </input> '
        hoursRowContents +=     '           <label for="'+idPrefix+'HoursInput" class="active">Hours</label>'
        hoursRowContents +=     '       </div>';
        hoursRowContents +=     '       <div class="input-field col s4 offset-s1">'
        hoursRowContents +=     '           <i class="small mdi-content-remove-circle-outline prefix"></i>'
        hoursRowContents +=     '           <input type="tel" placeholder="0" id="' +idPrefix+ 'MinutesInput" data-positivity="-1"> </input> '
        hoursRowContents +=     '           <label for="'+idPrefix+'MinutesInput" class="active">Minutes</label>'
        hoursRowContents +=     '       </div>';
        hoursRowContents +=     '   </div>';
        hoursRowContents +=     '   <div id="'+idPrefix+'SpecificHours">'
        hoursRowContents +=     '       <div class="input-field input-group clockpicker col s10 offset-s1">'
        hoursRowContents +=     '           <i class="small mdi-device-access-time prefix"></i>'
        hoursRowContents +=     '           <input type="text" class="form-control" id="' +idPrefix+ 'SpecificHoursInput" value="00:00">'
        hoursRowContents +=     '       </div>'
        hoursRowContents +=     '   </div>';
    $hoursRow.append(hoursRowContents);


    var buttonsRowContents =    '<br/> <div class="row">';
        buttonsRowContents +=   '   <div class="col s4 offset-s1">'
        buttonsRowContents +=   '       <a id="'+idPrefix+'PreviewButton" class="waves-effect waves-light btn">Preview</a>'
        buttonsRowContents +=   '   </div>'
        buttonsRowContents +=   '   <div class="col s4 offset-s2">'
        buttonsRowContents +=   '       <a id="'+idPrefix+'SaveButton" class="waves-effect waves-light btn light-blue darken-1"><i class="mdi-content-save"></i>Save</a>'
        buttonsRowContents +=   '   </div>'
        buttonsRowContents +=   '</div>'


    $form.append(headerContent).append($nameRow).append($yearsMonthsDateRow).append($hoursRow).append(buttonsRowContents);
    $parentElement.append($form);


    /*now that the form is appended to the parent, we can start binding our event handlers/bootup our JS dependent elements*/
    //enable tabs
    $('ul.tabs').tabs();

    //enable clockpicker
    $('.clockpicker').clockpicker({
        placement: 'top',
        autoclose:"true",
        donetext: 'Done'
    });

    //flip the positive-negative values of the icons on click
    $parentElement.find("i").on("click", function (){
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
    $parentElement.find("#"+idPrefix+"HoursTabs").find("a").on("click", function(){
        var $thisEle = $(this);
        var $hoursRow = $("#"+idPrefix+"HoursRow");


        if ($thisEle.attr("href") === "#"+idPrefix+"RelativeHours"){
            $hoursRow.data("isspecific",false);

        }else{
            $hoursRow.data("isspecific",true);
        }
        console.log("Hours setting is specific hours? Answer: " + $hoursRow.data("isspecific"));
    });


    //preview button
    $parentElement.find("#"+idPrefix+"PreviewButton").on("click", function(){
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

        console.log(JSON.stringify(internalFilter));
        formInterface =  internalFilter;
    });


    return formInterface;
    /*
        years:0, months:0, date:0,
        hours:-2, minutes:0, seconds:0,
        specifigHours:null
    */
    /* NOTE NOTE NOTE: THERE IS NO SECONDS SETTING FOR USERS TO USE! IT DOESNT EXIST! DONT EXPECT IT! THE SCRAPER WORKS MINUTELY ANYWAY! *******************************************/


}
