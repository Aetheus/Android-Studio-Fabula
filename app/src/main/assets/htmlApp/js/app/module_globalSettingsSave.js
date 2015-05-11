
//save the global settings to the app's shared preferences
var globalSettingsSave = function (){
    var JSONstring = JSON.stringify(globalSettings);
    FabulaSysApp.saveJSONSettings(JSONstring);
    toaster("Settings saved to phone");
}