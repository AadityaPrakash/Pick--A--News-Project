/*
*  Responsible - Ila Gautam
*************************************
*   Content Description:
*   1. Initialising port no.
*   2. Starting Local Server at specified
*      port.
*************************************/

//Getting an express Object from App.js File
var app = require('./app');

//For common scenarios setting port to 3000
var port = 3000;

//Starting server
var server = app.listen(port, function(){
  console.log('Web Application started at port - ' + port);

});
