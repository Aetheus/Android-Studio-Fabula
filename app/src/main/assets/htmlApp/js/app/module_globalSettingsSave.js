
//save the global settings to the app's shared preferences
globalSettingsSave = function (){
    var JSONstring = JSON.stringify(globalSettings);
    var isRunningOnPhone = (typeof FabulaSysApp != "undefined");

    if (isRunningOnPhone){
        FabulaSysApp.saveJSONSettings(JSONstring);

        //we're going to replace the original globalSettings with the parsed serialized JSONstring
        //hopefully this fixes the bizarre bug that can't be replicated on mobile where any newly added settings won't be seen until the app restarts and the JSON is deserialized
        console.log("Debug - we saved this into the phone: " + JSONstring);
        globalSettings = null;
        globalSettings = undefined;
        globalSettings = JSON.parse(JSONstring);
        console.log("Debug - and this is what the globalSettings is now; it SHOULD be the same as the phone's JSONstring: " + JSON.stringify(window.globalSettings));

        toaster("Settings saved to phone");
    }else{
        console.log("Not running on phone, so not saving to it")
    }

}