var timeHelper = {
    /*default time filters start here*/
    defaultTimeFilters : {
        "all":null,
        "last 2 hours":
            {
                name: "last 2 hours",
                startFilter:{
                    years:0, months:0, date:0,
                    hours:-2, minutes:0, seconds:0,
                    specifigHours:null
                },endFilter:{
                    years:0, months:0, date:0,
                    hours:0, minutes:0, seconds:0,
                    specifigHours:null
                }
            },
        "today":
            {
                name: "today",
                startFilter:{
                    years:0, months:0, date:0,
                    hours:0, minutes:0, seconds:0,
                    specifigHours:[0,0,0,0]
                },endFilter:{
                    years:0, months:0, date:0,
                    hours:0, minutes:0, seconds:0,
                    specifigHours:null
                }
            },
        "yesterday":
            {
                name: "yesterday",
                startFilter: {
                    years:0,months:0,date:-1,
                    hours:0,minutes:0,seconds:0,
                    specifigHours: [0,0,0,0]
                },
                endFilter: {
                    years:0,months:0,date:-1,
                    hours:0,minutes:0,seconds:0,
                    specifigHours: [23,59,59,999]
                }
            },
        "2 days ago":
            {
                name: "2 days ago",
                startFilter: {
                    years:0,months:0,date:-2,
                    hours:0,minutes:0,seconds:0,
                    specifigHours: [0,0,0,0]
                },
                endFilter: {
                    years:0,months:0,date:-2,
                    hours:0,minutes:0,seconds:0,
                    specifigHours: [23,59,59,999]
                }
            },
        "3 days ago":
            {
                name: "3 days ago",
                startFilter: {
                    years:0,months:0,date:-3,
                    hours:0,minutes:0,seconds:0,
                    specifigHours: [0,0,0,0]
                },
                endFilter: {
                    years:0,months:0,date:-3,
                    hours:0,minutes:0,seconds:0,
                    specifigHours: [23,59,59,999]
                }
            },
        "4 days ago":
            {
                name: "4 days ago",
                startFilter: {
                    years:0,months:0,date:-4,
                    hours:0,minutes:0,seconds:0,
                    specifigHours: [0,0,0,0]
                },
                endFilter: {
                    years:0,months:0,date:-4,
                    hours:0,minutes:0,seconds:0,
                    specifigHours: [23,59,59,999]
                }
            }
    },
    /*default time filters end here*/

    //for an example of a timeFilter, check the defualt filters above (filterToday, filterYesterday, etc)
    useRelativeFilter : function (timeFilter){
        if (!timeFilter){
            console.log("No time filter was given to useRelativeFilter function!");
            return null;    //if no timeFilter was given, return null instead of a timeConfig
        }

        var timeConfig = {start:null, end:null};

        var useInnerFilter = function (innerfilter){
            var modtime = new Date();
            modtime = new Date(modtime.setFullYear( modtime.getFullYear() + innerfilter.years ));
            modtime = new Date(modtime.setMonth( modtime.getMonth() + innerfilter.months ));
            modtime = new Date(modtime.setDate( modtime.getDate() + innerfilter.date ));
            modtime = new Date(modtime.setHours( modtime.getHours() + innerfilter.hours ));
            modtime = new Date(modtime.setMinutes( modtime.getMinutes() + innerfilter.minutes ));
            modtime = new Date(modtime.setSeconds( modtime.getSeconds() + innerfilter.seconds ));

            if (innerfilter.specifigHours){
                modtime.setHours(innerfilter.specifigHours[0],innerfilter.specifigHours[1],innerfilter.specifigHours[2],innerfilter.specifigHours[3]);
            }
            return modtime;
        }

        timeConfig.start = useInnerFilter(timeFilter.startFilter).toISOString();
        timeConfig.end = useInnerFilter(timeFilter.endFilter).toISOString();
        return timeConfig;
    },

    decide : function (keyString){
        var timeConfig = {start:null, end:null};
        var present = new Date();

        if ( this.defaultTimeFilters.hasOwnProperty(keyString) ){
            console.log("keystirng was " + keyString);
            timeConfig = this.useRelativeFilter(this.defaultTimeFilters[keyString]);
        }


        /*
        if (decisionString == "last 2 hours"){
            timeConfig.start = new Date( new Date().setHours(present.getHours() - 2) ).toISOString();
            timeConfig.end = present.toISOString();
        }else if (decisionString == "today"){
            timeConfig.start = new Date( new Date().setHours(0,0,0,0) ).toISOString();
            timeConfig.end = present.toISOString();
        }else if (decisionString == "yesterday"){
            var startDate = new Date( new Date().setDate(present.getDate() - 1) );
            var endDate = startDate;
            startDate = new Date ( startDate.setHours(0,0,0,0) );
            endDate = new Date ( endDate.setHours(23,59,59,999) );

            var yesterdayFilter = {
                name: "yesterday",
                startFilter: {
                    years:0,
                    months:0,
                    date:-1,
                    hours:0,
                    minutes:0,
                    seconds:0,
                    specifigHours: [0,0,0,0]
                },
                endFilter: {
                    years:0,
                    months:0,
                    date:-1,
                    hours:0,
                    minutes:0,
                    seconds:0,
                    specifigHours: [23,59,59,999]
                }
            }

            timeConfig = this.useRelativeFilter(yesterdayFilter);
        }else if (decisionString == "2 days ago"){
            var startDate = new Date( new Date().setDate(present.getDate() - 2) );
            var endDate = startDate;
            startDate = new Date ( startDate.setHours(0,0,0,0) );
            endDate = new Date ( endDate.setHours(23,59,59,999) );
            timeConfig.start = startDate.toISOString();
            timeConfig.end = endDate.toISOString();
        }else if (decisionString == "3 days ago"){
            var startDate = new Date( new Date().setDate(present.getDate() - 3) );
            var endDate = startDate;
            startDate = new Date ( startDate.setHours(0,0,0,0) );
            endDate = new Date ( endDate.setHours(23,59,59,999) );
            timeConfig.start = startDate.toISOString();
            timeConfig.end = endDate.toISOString();
        }else if (decisionString == "all"){
             timeConfig = null;
        }
        */

        return timeConfig;
    }
}
var TimeHelper = timeHelper;
//just an alias for timeHelper