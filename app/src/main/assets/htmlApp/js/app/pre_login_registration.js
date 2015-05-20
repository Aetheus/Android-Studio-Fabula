$(document).ready(function(){

    $("#backButton").on("click", function (){
        FabulaSysApp.closeActivity();
    });


    $("#registrationButton").on("click", function (){
        var userid      = $("#userid").val();
        var userpw      = $("#userpw").val();
        var pwquestion  = $("#pwquestion").val();
        var pwanswer    = $("#pwanswer").val();

        if(userid == "" || userpw == "" || pwquestion == "" || pwanswer == "" ){
            errHandler(new Error(" Please fill in ALL fields! "));
            return;
        }

        console.log("userid was " + userid);
        console.log("userpw was " + userpw);
        console.log("pwquestion was " + pwquestion);
        console.log("pwanswer was " + pwanswer);

        $.ajax({
            method: "POST",
            url: "https://fabula-node.herokuapp.com/registration",
            data: {
                userid:userid,
                userpw:userpw,
                pwquestion:pwquestion,
                pwanswer:pwanswer
            },
            complete : function(XHR,textStatus){
                toaster("Request Status: " + textStatus, 500);
            },
            timeout: 15000,/*15 second timeout; if we don't get a response in this time, something's up*/
            error : function (XHR,textStatus, errorThrown){
                if(textStatus == "timeout" || XHR.statusText == "timeout") {
                    errHandler(new Error("Timed out while waiting for response"));
                }else{
                    if (XHR.responseText == undefined || XHR.responseText == 'undefined'){
                        errHandler(new Error("Unable to get a response from server"));
                    }else{
                        console.log("XHR object is " + JSON.stringify(XHR));
                        var responseText = XHR.responseText;
                        var errorMessage = responseText.match("<h1>(.*)</h1>")[1];
                        //match returns an array: the result we want is the second one

                        console.log(errorMessage);
                        errHandler(new Error(errorMessage));
                    }
                }
                /*errHandler(new Error(errorThrown));*/
            },
            success: function(data, status){
                console.log(data);
                if (data != "registration successful"){

                }else{
                    toaster("registration successful!");
                }
            }
        });

    });

});