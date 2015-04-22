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

    var $startForm = MakeFilterMenu("start");

    $thisContainer.html($startForm);
}

var MakeFilterMenu = function (idPrefix) {
    /*idPrefix is a unique value we will prefix to all elements that require an ID, to ensure we can generate unique IDs*/
    var $form = $("<form class='col s12' id='" +idPrefix+ "StartForm'></form>");


    var $nameRow =  $("<div class='row' id='" +idPrefix+ "NameRow'></div>");
    var nameRowContents =   '<div class="input-field col s10 offset-s1">';
        nameRowContents +=  '   <input type="text" id="'+idPrefix+'NameInput" placeholder="enter time filter name here"> </input> '
        nameRowContents +=  '   <label for="'+idPrefix+'NameInput" class="active">Filter Name</label>'
        nameRowContents +=  '</div>';
    $nameRow.append(nameRowContents);



    var $yearsMonthsRow =  $("<div class='row' id='" +idPrefix+ "YearsMonthsRow'></div>");
    var yearsMonthsRowContents =      '<div class="input-field col s4 offset-s1">';
        yearsMonthsRowContents +=     '   <input type="tel" placeholder="0" id="' +idPrefix+ 'YearsInput"> </input> '
        yearsMonthsRowContents +=     '   <label for="'+idPrefix+'YearsInput" class="active">Years</label>'
        yearsMonthsRowContents +=     '</div>';
        yearsMonthsRowContents +=     '<div class="input-field col s4 offset-s2">';
        yearsMonthsRowContents +=     '   <input type="tel" placeholder="0" id="' +idPrefix+ 'MonthsInput"> </input> '
        yearsMonthsRowContents +=     '   <label for="'+idPrefix+'MonthsInput" class="active">Months</label>'
        yearsMonthsRowContents +=     '</div>';
    $yearsMonthsRow.append(yearsMonthsRowContents);


                        /*
                        years:0, months:0, date:0,
                        hours:-2, minutes:0, seconds:0,
                        specifigHours:null
                        */

    $form.append($nameRow).append($yearsMonthsRow);
    return $form;
}
