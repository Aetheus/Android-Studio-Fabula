$(document).ready(function(){

    $("#backButton").on("click", function (){
        FabulaSysApp.closeActivity();
    });

    //the 3 stages: "getting question", "verifying answer", "resetting password"
    var resetStage = "getting question";

    function gettingQuestion(){
        resetStage = "getting question";
        var userid = $("#userid").val();

        if (userid == ""){
            errHandler(new Error("Please provide a user id"));
            return;
        }

        $.ajax({
            method: "GET",
            url: "https://fabula-node.herokuapp.com/passwordreset/question",
            data: {
                userid:userid,
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
                verifyingAnswer(userid, data);

            }
        });
    }

    function verifyingAnswer(userid, secretQuestion){
        resetStage = "verifyingAnswer";
        console.log("secret question is: " + secretQuestion);

        var $boardroom = $("#boardroom");

        var newContent   = '<div class="input-field col s10 offset-s1">'
        newContent      += '    <textarea disabled value="'+ secretQuestion +'" id="question" class="materialize-textarea">'+ secretQuestion +'</textarea>'
        newContent      += '    <label class="active" for="question">Question</label>'
        newContent      += '</div>'
        newContent      += '<br />'
        newContent      += '<div class="input-field col s10 offset-s1">'
        newContent      += '    <input id="answer" type="text" class="validate">'
        newContent      += '    <label class="active" for="answer">Answer</label>'
        newContent      += '</div>'

        $boardroom.html(newContent);

        $("#submitButton").off("click");
        $("#submitButton").on("click", function (){
            var answer = $("#answer").val();

            console.log("userid: " + userid);

            $.ajax({
                method: "GET",
                url: "https://fabula-node.herokuapp.com/passwordreset/answer",
                data: {
                    userid:userid,
                    answer:answer
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
                    if(data = "success"){
                        resettingPassword(userid,answer);
                    }else{
                        errHandler(new Error("Incorrect answer!"));
                    }
                }
            });
        });

    }


    function resettingPassword(userid,answer){
        resetStage = "resettingPassword";
        var $boardroom = $("#boardroom");

        var newContent   = '<div class="input-field col s10 offset-s1">'
        newContent      += '    <p class="center"> Reset your password by entering a new one below and tapping Submit </p>'
        newContent      += '</div>'
        newContent      += '<br />'
        newContent      += '<div class="input-field col s10 offset-s1">'
        newContent      += '    <input id="password" type="password" class="validate">'
        newContent      += '    <label class="active" for="password">Password</label>'
        newContent      += '</div>'
        newContent      += '<br />'
        newContent      += '<div class="input-field col s10 offset-s1">'
        newContent      += '    <input id="verifypassword" type="password" class="validate">'
        newContent      += '    <label class="active" for="verifypassword">Verify Password</label>'
        newContent      += '</div>'

        $boardroom.html(newContent);

        $("#submitButton").off("click");
        $("#submitButton").on("click", function (){
            var password = $("#password").val();
            var verpassword = $("#verifypassword").val();

            if(password != verpassword){
                errHandler(new Error("The two password fields don't match!"));
                return;
            }

            $.ajax({
                method: "GET",
                url: "https://fabula-node.herokuapp.com/passwordreset/reset",
                data: {
                    userid:userid,
                    answer:answer,
                    password:password
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
                    if(data = "success"){
                        toaster("successfully reset password");
                    }else{
                        errHandler(new Error("Incorrect answer!"));
                    }
                }
            });

        });

    }

    $("#submitButton").on("click", function (){
        /*if (resetStage == "getting question"){
            gettingQuestion();
        }else if (resetStage == "verifying answer"){

        }else if (resetStage == "resetting password"){

        }*/

        gettingQuestion();
    });

});