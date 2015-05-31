
route("#NewsChannels", function (event, $thisContainer){



    var save = function (channelID, channelName, channelTags, channelColour){
        var temp = {
                        channelname:channelName,
                        channeltags:channelTags,
                        channelcolour:channelColour
                   };
        console.log("this is what we'red updating to: " + JSON.stringify(temp));
        $.ajax({
            method: "GET",
            url: "https://fabula-node.herokuapp.com/userschannels/edit/" + channelID,
            data: {
                channelname:channelName,
                channeltags:channelTags,
                channelcolour:channelColour
            },
            complete : function(XHR,textStatus){
                //toaster("Request Status: " + textStatus, 500);
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
                toaster("Changes successfully saved!");
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
                //toaster("Request Status: " + textStatus, 500);
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
                toaster("Changes successfully saved!");
            }
        });
    }

    var onSuccess = function (rows){
        $thisContainer.html("<div class='row' style='margin-bottom: 0px;'> <div class='col s10 offset-s1 center'> <h4> Channels </h4> </div> </div>");

        var $newsChannelRefreshDiv = $('<div id="NewsChannelRefreshDiv" class="center"></div>').html(reusableAssets.simplePreloader).append("");
        $thisContainer.append($newsChannelRefreshDiv );
        $newsChannelRefreshDiv.hide();

        $thisContainer.append(
            '<div class="row">'
        +   '   <div class="col s10 offset-s1 center" style="text-align: justify;">'
        +   '       Here you can edit settings for your currently subscribed channels or delete them. Click on the save changes button to commit your changes'
        +   '   </div>'
        +   '</div>'
        )


        var hammertime = new Hammer($thisContainer[0], {});
        hammertime.get('swipe').set({ direction: Hammer.DIRECTION_DOWN, threshold:20, velocity:0.35 });
        hammertime.on('swipe', function(ev) {
            //console.log($thisContainer.scrollTop());
            if (frames.top.scrollY == 0){
                $newsChannelRefreshDiv.slideDown(250, function (){
                    $('a[href=#NewsChannels]').trigger('click');
                });
            }else{
                    //console.log("swiped up, but not at the top of the list yet");
            }
        });


        for(var i=0; i< rows.length; i++){
            var channelID   = rows[i].fedfeedchannelid   !== null ? rows[i].fedfeedchannelid   : "";
            var channelName = rows[i].fedfeedchannelname !== null ? rows[i].fedfeedchannelname : "";
            var channelTags = rows[i].fedfeedchanneltags !== null ? rows[i].fedfeedchanneltags : "";
            var channelColour = rows[i].fedfeedchannelcolour !== null ? rows[i].fedfeedchannelcolour : "";

            //color-choice-circle
            var content = "";
            content +=      '<div id="channel' + channelID +'" class="row">'
            content +=      '   <div class="col s12 m6">'
            content +=      '       <div class="card-panel black-text ' + channelColour + '">'
            content +=      '           <div class="card-content no-vertical-margins">'
            content +=      '               <div class="input-field col s12 small-vertical-margins">'
            content +=      '                   <input style="color:black;" value="' + channelName +'" id="channel'+channelID+'name" type="text" class="validate">'
            content +=      '                   <label class="active" for="channel' + channelID + 'name">Channel Name</label>'
            content +=      '               </div>'
            content +=      '               <div class="input-field col s12 small-vertical-margins">'
            content +=      '                   <input style="color:black;" value="' + channelTags +'" id="channel'+channelID+'tag" type="text" class="validate">'
            content +=      '                   <label class="active" for="channel'+channelID+'tag">Tag</label>'
            content +=      '               </div>'
            content +=      '               <div class="col s12 small-vertical-margins">'
            content +=      '                   <input style="display:none;" value="' + channelColour +'" id="channel'+channelID+'colour" type="text" ></input>'
            content +=      '                   <div class="color-choice-circle white lighten-4"></div>'
            content +=      '                   <div class="color-choice-circle blue-grey lighten-4"></div>'
            content +=      '                   <div class="color-choice-circle red lighten-4"></div>'
            content +=      '                   <div class="color-choice-circle green lighten-4"></div>'
            content +=      '                   <div class="color-choice-circle blue lighten-4"></div>'
            content +=      '                   <div class="color-choice-circle yellow lighten-4"></div>'
            content +=      '                   <div class="color-choice-circle purple lighten-4"></div>'
            content +=      '                   <div class="color-choice-circle orange lighten-4"></div>'
            content +=      '               </div>'
            //content +=      '               <div class="input-field col s12 small-vertical-margins">'
            //content +=      '                   <a id="channel'+channelID+'redefineButton" class="col s5 waves-effect waves-light btn teal darken-1">redefine channel</a>'
            //content +=      '               </div>'
            content +=      '           </div>'
            content +=      '           <div class="card-action row" style="margin-bottom: -10px;" >'
            content +=      '               <a id="channel'+channelID+'DeleteButton" href="#channel'+channelID+'DeleteConfirmation" class="modal-trigger waves-effect waves-teal btn-flat red  lighten-2 center white-text col s4">Delete</a>'
            content +=      '               <a id="channel'+channelID+'RedefineButton"   class="waves-effect waves-teal btn-flat teal lighten-2 center white-text col s4" href="#">Redefine</a>'
            content +=      '               <a id="channel'+channelID+'SaveButton"   class="waves-effect waves-teal btn-flat blue lighten-2 center white-text col s4" href="#">Save</a>'
            content +=      '               <div id="channel'+channelID+'DeleteConfirmation" class="modal">'
            content +=      '                   <div class="modal-content">'
            content +=      '                       <h4>Delete confirmation</h4>'
            content +=      '                       <p>You are about to delete this subscribed channel. Deleting it will PERMANENTLY remove both the channel and all its associated news items. This action cannot be undone. Are you sure? </p>'
            content +=      '                   </div>'
            content +=      '                   <div class="modal-footer">'
            content +=      '                       <a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat">Cancel</a>'
            content +=      '                       <a id="channel'+channelID+'TrueDeleteButton"  href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat redFont">Delete</a>'
            content +=      '                   </div>'
            content +=      '               </div>'
            content +=      '           </div>'
            content +=      '       </div>'
            content +=      '   </div>'
            content +=      '</div>'

            $thisContainer.append(content);

            //enable modals
            $('.modal-trigger').leanModal();

            //store channel url into button's data
            $('#channel'+channelID+'RedefineButton').data("channelLink", rows[i].fedfeedchannelurl);

            (function (channelID){
                $('#channel'+channelID+'SaveButton').on("click", function(event){
                    event.preventDefault();
                    var localChannelID = channelID;
                    var channelName = $('#channel'+localChannelID+'name').val();
                    var channelTags = $('#channel'+localChannelID+'tag').val();
                    var channelColour = $('#channel'+localChannelID+'colour').val();


                    if (channelName.trim() != "" && channelTags.trim() != ""){
                        save(channelID, channelName, channelTags,channelColour);
                    }else{
                        errHandler(new Error("channel MUST have a name and a tag!"));
                    }


                });

                $('#channel'+channelID+'TrueDeleteButton').on("click", function(){
                    del(channelID);
                });


                $('#channel'+channelID+'RedefineButton').on("click", function(){
                    if(typeof FabulaSysApp !== 'undefined'){
                        var link = $(this).data("channelLink");
                        FabulaSysApp.redefineSubscription(link);
                    }
                });

                //.className.split(/\s+/);
                $('#channel'+channelID).find(".color-choice-circle").each(function (){

                    $(this).on("click", function() {
                        var thisItem = this;
                        var classList = $(this)[0].className.split(/\s+/);
                        var colourClassStringList = [];
                        for (var i= 0; i< classList.length; i++){
                            if (classList[i] != "color-choice-circle"){
                                colourClassStringList[colourClassStringList.length] = classList[i];
                            }
                        }

                        var $cardPanelParent = $(thisItem).parents(".card-panel");
                        $cardPanelParent.removeClass();
                        $cardPanelParent.addClass("card-panel").addClass("black-text");
                        for (var i=0; i< colourClassStringList.length; i++){
                                $cardPanelParent.addClass(colourClassStringList[i]);

                        }
                        console.log("we're going to save this to channel" +channelID+"colour: " + colourClassStringList.join(" "));
                        //$('#channel'+channelID+'colour').val(colourClassStringList.join(" "));
                        document.getElementById('channel'+channelID+'colour').setAttribute('value', colourClassStringList.join(" "));
                    });

                });
                window.scrollTo(0, 0);
            })(channelID);


        }

    }

    $("#NewsChannels").html(reusableAssets.loaderAnim);
    $.ajax({
        method: "GET",
        url: "https://fabula-node.herokuapp.com/userschannels/" + FabulaSysUsername,
        data: {
        },
        complete : function(XHR,textStatus){
            //toaster("Request Status: " + textStatus, 500);
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