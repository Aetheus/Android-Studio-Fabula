//generic toast making function =D
var toaster = function (message, time){
    /*alert(err.message);*/
    var toasterTime = 4000;
    if(time){toasterTime = time;}
    Materialize.toast(message,toasterTime,"myToastDialog");
}