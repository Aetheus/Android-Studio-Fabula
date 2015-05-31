

globalSettings = {
    /*add in some default time filters; see timeHelper.js for more details*/
    timeFilters: {
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
        /*"yesterday":
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
            },*/
        "all":null,
    },
    tagsList: ["all", "politics", "sports", "science", "technology"],

    /*set the "current filter" option to this by default; users can switch by tapping on different options.*/
    currentFilter:"last 2 hours",
    currentTags:null,

    paginationLimit:15,

    isNewsFeedColourOn:true,
    isNewsFeedImagesOn:true,

    isCloudSyncOn:false,



}