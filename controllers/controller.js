/*
*  Responsible - Aaditya Prakash
*************************************
*   Content Description:
*   1. Forwarding the HTTP request to appropiate MongoDBService functions
*   2. Returns static pages
*************************************/

//Returns the static HTML File under public Folder
exports.display_website = function(req, res){
  // Set the response HTTP header with HTTP status and Content type
  res.writeHead(200, {'Content-Type': 'text/html'});

  //Send the response to Client with Index.html File.
  //It will automatically find and locate index.html from public or script
  res.sendFile('index.html');

};

//Creating variable of MongoDBService (Data Model), Backend & Export for using their functions.
const mongodb = require('../service/database');
const backend = require('../service/backend');
const exportFeed = require('../service/export');

/*
*   Retrieves all the webfeeds from the database.
*/
exports.show_all_feeds = function(req, res){
   mongodb.ShowAllWebFeed(req, res);
   console.log("Database : ShowAllWebFeed()" );
};

/*
*   Retrieves all the Providers from the database.
*/
exports.show_all_providers = function(req, res){
    mongodb.ShowAllProviders(req, res);
    console.log("Database : ShowAllProviders()" );
};

/*
*   Deletes all the data of the database.
*   This would delete both the Collection namely "webfeeds" & "provider"
*/
exports.delete_all_items = function(req, res){
    mongodb.DeleteAll(req, res);
    console.log("Database : DeleteAll()" );
};

/*
*   This is to reload the database with the content of
*      five inbuilt RSS Feed providers.
*
*/
exports.process_items = function(req, res){
    backend.processFeeds(req, res);
    console.log("Backend : ProcessFeeds()" );
};


/*
*   This function is resposible for exporting web feeds into RSS or ATOM feeds.
*   This exported feeds can be later used in our web application too.
*
*/
exports.export_feeds = function(req, res){
    exportFeed.exportFeed(req, res);
    console.log("Export : Exporting of web feed begins..." );
};

/*
*   Retrieves all data from Config table of the database.
*/
exports.get_interval = function(req, res){
    mongodb.ShowConfigData(req, res);
    console.log("Database : ShowConfigData()" );
};

/*
*   This function is use to update the "interval data" in the Config table.
*/
exports.set_interval = function(req, res){
    mongodb.UpdateIntervalData(req, res);
    console.log("Database : UpdateIntervalData()" );
};

/*
*   This function is use to "age" data in the Config table.
*/
exports.set_feed_age = function(req, res){
    mongodb.UpdateAgeData(req, res);
    console.log("Database : UpdateAgeData()" );
};

/*
*   This inserts new provider in the database.
*/
exports.insert_new_custom_feed = function(req, res){
    mongodb.InsertCustomFeedData(req, res);
    console.log("Database : InsertCustomFeed()" );
};

/*
*   Retrieves single provider data by inputting provider's Id.
*/
exports.retrieve_provider_data_byId = function(req, res) {
    mongodb.RetrieveProviderDataById(req, res);
    console.log("Database : RetrieveProviderDataById()" );
};

exports.update_custom_feed = function(req, res){
    mongodb.UpdateCustomFeedData(req, res);
    console.log("Database : UpdateCustomFeedData()" );

};

exports.reload_provider_web_feed = function(req, res){
    backend.ReloadProviderFeed(req, res);
    console.log("Backend : ReloadProviderFeed()");

};

exports.delete_provider_web_feed = function(req, res){
    backend.DeleteProviderFeedByName(req, res);
    console.log("Backend : DeleteProviderFeedByName()");
};

exports.disable_provider_web_feed = function(req, res){
    backend.DisableProviderWebFeed(req, res);
    console.log("Backend : DisableProviderWebFeed()");
};

exports.enable_provider_web_feed = function(req, res){
  backend.EnableProviderWebFeed(req, res);
  console.log("Backend : DisableProviderWebFeed()");
};

exports.management_feed = function(req, res){
    backend.management_feed(req, res);
    console.log("Backend : Web feed management processing..." );
};
