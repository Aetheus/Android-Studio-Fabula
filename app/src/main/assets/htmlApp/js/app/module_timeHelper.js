var timeHelper = {
    timeList : ["all", "last 2 hours","today","yesterday","2 days ago","3 days ago"],

    decide : function (decisionString){
        var timeConfig = {start:null, end:null};
        var present = new Date();

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
            timeConfig.start = startDate.toISOString();
            timeConfig.end = endDate.toISOString();
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

        return timeConfig;
    }
}
var TimeHelper = timeHelper;
//just an alias for timeHelper