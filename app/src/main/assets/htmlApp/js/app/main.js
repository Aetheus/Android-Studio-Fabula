
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



    //toaster("Resolution is :" + screen.width + " x " + screen.height);


});
