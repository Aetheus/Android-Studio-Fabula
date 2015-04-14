
//var FabulaSysUsername = "superuser";
//var FabulaSysPassword = "superuser";
/*FabulaSysApp is the name of our JS-to-Android interface*/
var DBNull = "%%%NULL%%%";

$(document).ready(function(){



    //initialize sidenav
    $(".button-collapse").sideNav();

    //this automatically closes the sideNav when an option is chosen(clicked/tapped on)
    $("nav > ul > li").click(function (event){
        $('.button-collapse').sideNav('hide');
    });



    //set the height of the <section> to "100%" (i.e: the window height)
    //this allows us to make use of our .vertcenter class or Materialize CSS .valign-wrapper+valign classes to vertically center tags
    //$("section").height(window.innerHeight);



    /***ROUTES START HERE**************************************************************/



    route("#NewsChannels", function (event){
        errHandler(new Error("We need to move this outta main.js and give it a job ^^'' "));
        /*try{
            $("section").html("<p class='flow-text'> Welcome from NewsChannel. This is obviously placeholder text. I'mn actrually trying ot overflow the display with text. Wanna help me? <br /><br /><br /><br /><br /><br /><br /><br /> HI HI HI HI HI H IH IH IH I HIH IH IH I HIASDFASDFASDF Welcome from NewsChannel. This is obviously placeholder text. I'mn actrually trying ot overflow the display with text. Wanna help me? <br /><br /><br /><br /><br /><br /><br /><br /> HI HI HI HI HI H IH IH IH I HIH IH IH I HIASDFASDFASDF Welcome from NewsChannel. This is obviously placeholder text. I'mn actrually trying ot overflow the display with text. Wanna help me? <br /><br /><br /><br /><br /><br /><br /><br /> HI HI HI HI HI H IH IH IH I HIH IH IH I HIASDFASDFASDF Welcome from NewsChannel. This is obviously placeholder text. I'mn actrually trying ot overflow the display with text. Wanna help me? <br /><br /><br /><br /><br /><br /><br /><br /> HI HI HI HI HI H IH IH IH I HIH IH IH I HIASDFASDFASDF Welcome from NewsChannel. This is obviously placeholder text. I'mn actrually trying ot overflow the display with text. Wanna help me? <br /><br /><br /><br /><br /><br /><br /><br /> HI HI HI HI HI H IH IH IH I HIH IH IH I HIASDFASDFASDF Welcome from NewsChannel. This is obviously placeholder text. I'mn actrually trying ot overflow the display with text. Wanna help me? <br /><br /><br /><br /><br /><br /><br /><br /> HI HI HI HI HI H IH IH IH I HIH IH IH I HIASDFASDFASDF Welcome from NewsChannel. This is obviously placeholder text. I'mn actrually trying ot overflow the display with text. Wanna help me? <br /><br /><br /><br /><br /><br /><br /><br /> HI HI HI HI HI H IH IH IH I HIH IH IH I HIASDFASDFASDF Welcome from NewsChannel. This is obviously placeholder text. I'mn actrually trying ot overflow the display with text. Wanna help me? <br /><br /><br /><br /><br /><br /><br /><br /> HI HI HI HI HI H IH IH IH I HIH IH IH I HIASDFASDFASDF Welcome from NewsChannel. This is obviously placeholder text. I'mn actrually trying ot overflow the display with text. Wanna help me? <br /><br /><br /><br /><br /><br /><br /><br /> HI HI HI HI HI H IH IH IH I HIH IH IH I HIASDFASDFASDF </p>");
        }catch(err){
            return errHandler(err);
        }*/
    });


    /**********************************************************************************/


});
