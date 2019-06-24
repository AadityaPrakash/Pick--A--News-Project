/*
*  Responsible - Aaditya Prakash
*************************************
*   Content Description:
*   1. Loading of various Modules
*   2. Starting Local Server at specified
*      port.
*   3. Serving Static Files
*   4. Initializing "routes" variable to forward the HTTP requests to the controller functions.
*************************************/

//Load express Module
const express = require('express');


//Load Body-Parser Module
const bodyParser = require('body-parser');


//Create an express application
const app = express();


// support json encoded bodies
app.use(bodyParser.json());
// support encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));



//Fetching the static HTML file from public folder.
app.use(express.static(__dirname + '/public'));



/*   Fetching all the static JS and CSS from script folder.
 *   Path - public/script
 */

app.use(express.static(__dirname + '/script'));


/*   Initializing the "routes" variable to forward the supported HTTP requests &
*    any encoded data to the appropriate controller functions.
*/

var routes = require('./routes/index'); //importing route
routes(app);


//exporting express object
module.exports = app;
