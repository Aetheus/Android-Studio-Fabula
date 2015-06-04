
//save the global settings to the app's shared preferences
//isSilentMode : when true, saves without producing a toaster message
globalSettingsSave = function (isSilentModeFlag){
    var JSONstring = JSON.stringify(globalSettings);
    var isRunningOnPhone = (typeof FabulaSysApp != "undefined");
    var isSilentMode = (typeof isSilentMode !== "undefined") ? isSilentMode : "false";

    if (isRunningOnPhone){
        FabulaSysApp.saveJSONSettings(JSONstring);

        //we're going to replace the original globalSettings with the parsed serialized JSONstring
        //hopefully this fixes the bizarre bug that can't be replicated on mobile where any newly added settings won't be seen until the app restarts and the JSON is deserialized
        //console.log("Debug - we saved this into the phone: " + JSONstring);
        //globalSettings = null;
        //globalSettings = undefined;
        //globalSettings = JSON.parse(JSONstring);
        //console.log("Debug - and this is what the globalSettings is now; it SHOULD be the same as the phone's JSONstring: " + JSON.stringify(window.globalSettings));

        if(!isSilentMode){
            toaster("Settings saved to phone");
        }

        if (globalSettings.isCloudSyncOn){
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
                        //errHandler(new Error("Timed out while waiting for response"));
                    }else{
                        if (XHR.responseText == undefined || XHR.responseText == 'undefined'){
                           // errHandler(new Error("Unable to get a response from server"));
                        }else{
                            //console.log("XHR object is " + JSON.stringify(XHR));
                            //var json = JSON.parse(XHR.responseText);
                            //errHandler(new Error(json.Message));
                            //console.log("XHR object is " + JSON.stringify(XHR));
                            var responseText = XHR.responseText;
                            var errorMessage = responseText.match("<h1>(.*)</h1>")[1];
                            //match returns an array: the result we want is the second one

                            console.log(errorMessage);
                            //errHandler(new Error(errorMessage));
                        }
                    }
                    /*errHandler(new Error(errorThrown));*/
                },
                success: function(data, status){
                    /*
                    console.log(data);
                    if (data == "success"){
                        toaster("Settings saved to the cloud");
                    }else{
                        toaster("Settings failed to save!");
                    }*/
                }
            });
        }

    }else{
        console.log("Not running on phone, so not saving to it")
    }

}