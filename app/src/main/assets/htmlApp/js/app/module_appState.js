

appState = {
    //buttonStateDictionary = {route_id: $('#route_Example_ID'),button_id:$('#example_button_id'),state:true}
    //when state == true, button was recently clicked and its action is pending
    //when state == false, button was not recently clicked or its pending action is already completed
    buttonStateList: [],

    //where route is a jqueryObj, button is a jQueryObj, and booleanState is a boolean value
    setButtonState: function ($routeObj, $buttonObj, booleanState){
        var buttonStateDictionary = {
            $route: $routeObj,
            $button: $buttonObj,
            state: booleanState
        }

        if (this.getButtonState($routeObj, $buttonObj) === null){
            this.buttonStateList[buttonStateList.length] = buttonStateDictionary;
        }else{
            for (var i = 0; i < this.buttonStateList.length; i++){
                if ((this.buttonStateList[i].$route == $routeObj) && (this.buttonStateList[i].$button == $buttonObj)){
                    returnVal == this.buttonStateList[i];
                    break;
                }
            }
        }
    },

    getButtonState: function ($routeObj, $buttonObj){
        var returnVal = null;

        for (var i = 0; i < this.buttonStateList.length; i++){
            if ((this.buttonStateList[i].$route == $routeObj) && (this.buttonStateList[i].$button == $buttonObj)){
                returnVal == this.buttonStateList[i];
                break;
            }
        }

        return returnVal;
    },

}