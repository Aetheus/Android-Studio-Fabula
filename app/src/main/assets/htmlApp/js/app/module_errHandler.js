/*MODULE: define our error handler callback*/
var errHandler = function (err){
    alert(err.message);
    Materialize.toast("Error: " + err, 1500 );
}
/*******************************************/