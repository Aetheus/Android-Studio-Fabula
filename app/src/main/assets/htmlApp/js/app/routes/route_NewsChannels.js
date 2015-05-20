
route("#NewsChannels", function (event, $thisContainer){



    var save = function (channelID, channelName, channelTags){
        $.ajax({
            method: "GET",
            url: "https://fabula-node.herokuapp.com/userschannels/edit/" + channelID,
            data: {
                channelname:channelName,
                channeltags:channelTags
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
                        //console.log("XHR object is " + JSON.stringify(XHR));
                        //var json = JSON.parse(XHR.responseText);
                        //errHandler(new Error(json.Message));
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
            }
        });
    }

    var del  = function (channelID, channelName, channelTags){
        $.ajax({
            method: "GET",
            url: "https://fabula-node.herokuapp.com/userschannels/delete/" + channelID,
            data: {
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
                        //console.log("XHR object is " + JSON.stringify(XHR));
                        //var json = JSON.parse(XHR.responseText);
                        //errHandler(new Error(json.Message));
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
                $('#channel'+channelID).remove();
            }
        });
    }

    var onSuccess = function (rows){
        $thisContainer.html("<div class='row'>  <div class='col s10 offset-s1 center'> <h4> Channels </h4> </div> </div>");
        for(var i=0; i< rows.length; i++){
            var channelID   = rows[i].fedfeedchannelid   !== null ? rows[i].fedfeedchannelid   : "";
            var channelName = rows[i].fedfeedchannelname !== null ? rows[i].fedfeedchannelname : "";
            var channelTags = rows[i].fedfeedchanneltags !== null ? rows[i].fedfeedchanneltags : "";

            var content = "";
            content +=      '<div id="channel' + channelID +'" class="row">'
            content +=      '   <div class="col s12 m6">'
            content +=      '       <div class="card-panel black-text">'
            content +=      '           <div class="card-content no-vertical-margins">'
            content +=      '               <div class="input-field col s12 small-vertical-margins">'
            content +=      '                   <input style="color:black;" value="' + channelName +'" id="channel'+channelID+'name" type="text" class="validate">'
            content +=      '                   <label class="active" for="channel' + channelID + 'name">Channel Name</label>'
            content +=      '               </div>'
            content +=      '               <div class="input-field col s12 small-vertical-margins">'
            content +=      '                   <input style="color:black;" value="' + channelTags +'" id="channel'+channelID+'tag" type="text" class="validate">'
            content +=      '                   <label class="active" for="channel'+channelID+'tag">Tag</label>'
            content +=      '               </div>'
            content +=      '           </div>'
            content +=      '           <div class="card-action">'
            content +=      '               <a id="channel'+channelID+'DeleteButton" class="waves-effect waves-teal btn-flat red  lighten-3 center white-text col s4 offset-s1" href="#">Delete</a>'
            content +=      '               <a id="channel'+channelID+'SaveButton"   class="waves-effect waves-teal btn-flat blue lighten-3 center white-text " href="#">Save Changes</a>'
            content +=      '           </div>'
            content +=      '       </div>'
            content +=      '   </div>'
            content +=      '</div>'

            $thisContainer.append(content);


            (function (channelID){
                $('#channel'+channelID+'SaveButton').on("click", function(){
                    var localChannelID = channelID;
                    var channelName = $('#channel'+localChannelID+'name').val();
                    var channelTags = $('#channel'+localChannelID+'tag').val();

                    save(channelID, channelName, channelTags);
                });

                $('#channel'+channelID+'DeleteButton').on("click", function(){
                    del(channelID);
                });
            })(channelID);


        }
        window.scrollTo(0,0);
    }

    $.ajax({
        method: "GET",
        url: "https://fabula-node.herokuapp.com/userschannels/" + FabulaSysUsername,
        data: {
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
                    //console.log("XHR object is " + JSON.stringify(XHR));
                    //var json = JSON.parse(XHR.responseText);
                    //errHandler(new Error(json.Message));
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
            onSuccess(data, status);
        }
    });
});