/*
*  Responsible - Aaditya Prakash
*************************************
*   Content Description:
*   1. Defining appropriate controller functions to the supported HTTP requests
*   2. Creating of REST Based APIs.
*************************************/
'use strict';

//Using Expressing Application Object
module.exports = function(app) {

var controller = require('../controllers/controller');

/*
*   Display Static Website
*   Returns the static HTML File under public Folder
*/

app.route('/')
  .get(controller.display_website);

/*
*   ------------------------ REST-API Interface ------------------------
*   Accept only JSON Request as parameters & retuns only JSON Response.
*/

/*
*   Retrieves all the web-feeds items from the database.
*/
app.route('/feeds')
  .get(controller.show_all_feeds);

/*
*   Convert web feeds into RSS Feed and get exported.
*/
app.route('/feeds/export')
 .get(controller.export_feeds);

/*
 *   Deletes all the data of the database.
 *   This would delete both the Collection namely "Menu" & "Restaurant"
*/
app.route('/database/delete')
   .get(controller.delete_all_items);

app.route('/database/reload')
   .get(controller.process_items);

app.route('/management/feed')
 .get(controller.management_feed);

app.route('/management/feed/actions/update')
    .post(controller.update_custom_feed);

/*
*   Retrieves all the providers data from the database.
*/
app.route('/settings')
  .get(controller.get_interval);

app.route('/settings/interval/')
    .post(controller.set_interval);

app.route('/settings/age/')
    .post(controller.set_feed_age);

/*
*   Retrieves all the providers data from the database.
*/
app.route('/providers')
   .get(controller.show_all_providers);

app.route('/providers/actions/modify')
    .post(controller.retrieve_provider_data_byId);

app.route('/providers/actions/reload')
    .post(controller.reload_provider_web_feed);

app.route('/providers/actions/disable')
    .post(controller.disable_provider_web_feed);

app.route('/providers/actions/enable')
    .post(controller.enable_provider_web_feed);

app.route('/providers/actions/delete')
    .post(controller.delete_provider_web_feed);

app.route('/provider/actions/insert')
    .post(controller.insert_new_custom_feed);

};
