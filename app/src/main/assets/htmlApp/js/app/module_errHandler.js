/*MODULE: define our error handler callback*/
var errHandler = function (err){
    /*alert(err.message);*/
    Materialize.toast("<span> <i class='mdi-alert-warning'></i> Error: " + err.message + "</span>" ,4000,"myToastDialog");
}
/*******************************************/