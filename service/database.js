/*
*  Responsible - Ila Gautam
*************************************
*   Content Description:
*   1. Creation of MongoDB Database
*   2. Creation of MongoDB Database Collection
*   3. CRUD Operation & Query Database
*************************************/

//Initializing the MongoDB Client
var MongoClient = require('mongodb').MongoClient;
var baseUrl = "mongodb://localhost:27017/";
var ObjectId = require('mongodb').ObjectID;

/*
 *  Avoid “current URL string parser is deprecated” warning by setting useNewUrlParser to true
 */
var newUrlP = { useNewUrlParser: true};

// Initializing the variables
const DATABASE_NAME = "mydb";
const WEB_FEED_TABLE_NAME = "webfeed";
const PROVIDER_TABLE_NAME = "provider";
const CONFIG_TABLE_NAME = "config";
const CUSTOM_FEED_TABLE_NAME = "customfeed";

//MongoDB will create the database if it does not exist, and make a connection to it.
function CreateDB() {
  var url = baseUrl + DATABASE_NAME;
  MongoClient.connect(url, newUrlP ,function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
  });
}

//Function to create the collection/table
function CreateTable(table_name) {
  var url = baseUrl + DATABASE_NAME;
  MongoClient.connect(url, newUrlP, function(err, db) {
    if (err) throw err;
    var dbobj = db.db(DATABASE_NAME);
    dbobj.createCollection(table_name, function(err, res) {
      if (err) throw err;
      console.log("Collection: " + table_name + " Table created!");
    db.close();
  });
 });
}

//Function to Insert Web-Feed Data Items into collection/table
function InsertWebFeedData(myObj) {

  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    var Obj = JSON.parse(myObj);
    dbo.collection(WEB_FEED_TABLE_NAME).insertMany(Obj, function(err, res) {
      if (err) throw err;
      console.log("success! Web Feeds inserted");
      console.log("Number of items inserted: " + res.insertedCount);
      db.close();
    });
  });
}

//Function to Insert Provider Data Items into collection/table
function InsertProviderData(myObj) {

  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo.collection(PROVIDER_TABLE_NAME).insertMany(myObj, function(err, res) {
      if (err) throw err;
      console.log("success! Provider Data Inserted!");
      console.log("Number of items inserted: " + res.insertedCount);
      db.close();
    });
  });
}

function InsertCustomFeedData(req, res) {
  var success = { "status" : "success"};
  var failure = { "status" : "failure"};
  var name = req.body.name;
  var url = req.body.url;
  var imageUrl = req.body.imageUrl;
  var Obj = {'name' : name , 'link' : url, 'imageUrl' : imageUrl , 'last_successful_update' : 'N.A' , 'latest_record' : 'N.A' , 'last_attempt' : 'N.A' , 'last_attempt_message' : 'N.A' , 'disableflag' : false };
  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) {
      res.json(failure);
      throw err;
    }
    var dbo = db.db(DATABASE_NAME);
    dbo.collection(PROVIDER_TABLE_NAME).insertOne(Obj, function(err, result) {
      if (err) throw err;
      console.log("success! Web Feeds inserted");
      console.log("Number of items inserted: " + result.insertedCount);
      db.close();
      res.json(success);
    });
  });
}

function UpdateProviderData(feedItem) {
  var name = feedItem.name;
  var last_successful_update = feedItem.last_successful_update;
  var latest_record = feedItem.latest_record;
  var last_attempt = feedItem.last_attempt;
  var last_attempt_message = feedItem.last_attempt_message + " records fetched & saved.";

  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo.collection(PROVIDER_TABLE_NAME).updateOne(
      { name :{ $eq : name } },
      { $set: { "last_successful_update" : last_successful_update , "latest_record" : latest_record , "last_attempt" : last_attempt , "last_attempt_message" : last_attempt_message } },
      function(err, result) {
      if (err) {
        res.json(failure);
        throw err;
      }
      console.log("Number of items found: " + result.matchedCount);
      console.log("Number of items updated: " + result.modifiedCount);
      db.close();
    });
  });
}

function UpdateErrorProviderData(feedItem) {
  var name = feedItem.name;
  var last_attempt = feedItem.last_attempt;
  var last_attempt_message = feedItem.last_attempt_message;

  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo.collection(PROVIDER_TABLE_NAME).updateOne(
      { name :{ $eq : name } },
      { $set: { "last_attempt" : last_attempt , "last_attempt_message" : last_attempt_message } },
      function(err, result) {
      if (err) {
        res.json(failure);
        throw err;
      }
      console.log("Number of items found: " + result.matchedCount);
      console.log("Number of items updated: " + result.modifiedCount);
      db.close();
    });
  });
}

function UpdateCustomFeedData(req, res) {
  var id = req.body._id;
  var name = req.body.name;
  var link = req.body.url;
  var imageUrl = req.body.imageUrl;
  var success = { "status" : "success"};
  var failure = { "status" : "failure"};

  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo.collection(PROVIDER_TABLE_NAME).updateOne(
      { _id :{ $eq : new ObjectId(id) } },
      { $set: { "name" : name , "link" : link , "imageUrl" : imageUrl } },
      function(err, result) {
      if (err) {
        res.json(failure);
        throw err;
      }
      console.log("Number of items found: " + result.matchedCount);
      console.log("Number of items updated: " + result.modifiedCount);
      db.close();
      res.json(success);
    });
  });
}

//Function to Retrieves all Items from collection "Menu"
function ShowAllWebFeed(req, res){

  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo.collection(WEB_FEED_TABLE_NAME).find({ disableflag : false }).toArray(function(err, result) {
      if (err) throw err;
      //console.log(result);
      console.log("Search Results: " + result.length + "\n\n");
      res.json(result)
    db.close();
    });
  });
}

//Function to Retrieves all Items from collection "Menu"
function GetExportFeeds(){
  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo.collection(WEB_FEED_TABLE_NAME).find({}).toArray(function(err, result) {
      if (err) throw err;
       //console.log(result);
      // console.log("Search Results: " + result.length + "\n\n");
      return result;
    db.close();
    });
  });
}

//Function to Retrieves all Items from collection "restaurant"
function ShowAllProviders(req, res){
  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo.collection(PROVIDER_TABLE_NAME).find({}).toArray(function(err, result) {
      if (err) throw err;
      //console.log(result);
      console.log("Search Results: " + result.length + "\n\n");
      res.json(result)
    db.close();
    });
  });
}

function RetrieveProviderDataById(req, res){
  var id = req.body._id;
  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo.collection(PROVIDER_TABLE_NAME).find({ _id: new ObjectId(id)}).toArray(function (err, result) {
      if (err) throw err;
      res.json(result)
    db.close();
    });
  });
}

//Function to Delete all Items in both Tables parallelly!
function DeleteAll(req, res){
  var json = { "status" : "success"};

  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo.collection(WEB_FEED_TABLE_NAME).drop(function(err, delOK) {
      if (err){
        DeleteProvider();
        console.log("Collection name: "+ WEB_FEED_TABLE_NAME + " Already deleted")
      }
      if (delOK) {
        console.log("Collection name: "+ WEB_FEED_TABLE_NAME +" deleted");
        DeleteProvider();
      }
      db.close();
    });

    res.json(json);
  });
}

function DeleteWebFeedData(name){
  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);

    dbo.collection(WEB_FEED_TABLE_NAME).deleteMany(
        { source : { $eq : name } }, function(err, result) {
        if (err) throw err;
        console.log("Old feeds deleted successfully!");
        console.log("Delete Count: " + result.deletedCount);
      });
    db.close();
  });
}

function DeleteProviderDataByName(name){

  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);

    dbo.collection(PROVIDER_TABLE_NAME).deleteOne(
        { name : { $eq : name } }, function(err, result) {
        if (err) throw err;
        console.log("Old feeds deleted successfully!");
        console.log("Delete Count: " + result.deletedCount);
      });
    db.close();
  });
}

//Function to Delete all Items of Collection  "restaurant"
function DeleteProvider(){

  MongoClient.connect(baseUrl, newUrlP ,function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo.collection(PROVIDER_TABLE_NAME).drop(function(err, delOK) {
      if (err)
        console.log("Collection name: "+ PROVIDER_TABLE_NAME +"Already deleted!")
      if (delOK)
        console.log("Collection name: "+ PROVIDER_TABLE_NAME +" deleted!")
      });
    db.close();
  });
}

//Function to Insert Provider Data Items into collection/table
function InsertConfigData() {

  var myObj = {"name" : "config" , "age" : 30 , "interval" : 10 };
  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo.collection(CONFIG_TABLE_NAME).insertOne(myObj, function(err, res) {
      if (err) throw err;
      console.log("success! Provider Data Inserted!");
      console.log("Number of items inserted: " + res.insertedCount);
      db.close();
    });
  });
}

//Function to Update Config Data Items into collection/table
function UpdateAgeData(req, res) {
  var age = req.body.value;
  var success = { "status" : "success"};
  var failure = { "status" : "failure"};

  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo.collection(CONFIG_TABLE_NAME).updateOne(
      { "name" : "config" },
      { $set: { "age" : age }},
      function(err, result) {
      if (err) {
        res.json(failure);
        throw err;
      }
      console.log("success! Age upated to : " + age);
      db.close();
      res.json(success);
    });
  });
}

function UpdateIntervalData(req, res) {
  var success = { "status" : "success"};
  var failure = { "status" : "failure"};
  var interval = req.body.interval;
  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo.collection(CONFIG_TABLE_NAME).updateOne(
      { "name" : "config" },
      { $set: {"interval" : interval}},
      function(err, result) {
      if (err) {
        res.json(failure);
        throw err;
      }
      console.log("success! Interval value upated to : " + interval);
      db.close();
      res.json(success);
    });
  });
}

function UpdateWebFeedData() {

  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo.collection(WEB_FEED_TABLE_NAME).updateMany(
      { "source" : "Uni aktuell - News overview of TU Chemnitz" },
      { $set: { "imageUrl" : "https://static.fernstudiumcheck.de/media/images/institute_logos/square/tu-chemnitz.jpg"}} , function(err, res) {
      if (err) throw err;
      console.log("Number of items found: " + res.matchedCount);
      console.log("Number of items updated: " + res.modifiedCount);
      db.close();
    });
  });
}

//Function to Retrieves all Items from collection "Menu"
function ShowConfigData(req, res){

  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo.collection(CONFIG_TABLE_NAME).find({}).toArray(function(err, result) {
      if (err) throw err;
      //console.log("Search Results: " + result.length + "\n\n");
      console.log(result);
      console.log("config data successfully retrieved!");
      res.json(result)
    db.close();
    });
  });
}

//Function to Delete all Items of Collection  "restaurant"
function DeleteConfigTable(){

  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo.collection(CONFIG_TABLE_NAME).drop(function(err, delOK) {
      if (err)
        console.log("Collection name: "+ CONFIG_TABLE_NAME +"Already deleted!")
      if (delOK)
        console.log("Collection name: "+ CONFIG_TABLE_NAME +" deleted!")
      });
    db.close();
  });
}

//Function to Remove the feeds older than 30 days.
function DeleteAgedFeeds(){

  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);

    dbo.collection(WEB_FEED_TABLE_NAME).deleteMany(
        { deleteflag : { $eq : true } }, function(err, res) {
        if (err) throw err;
        console.log("Old feeds deleted successfully!");
        console.log("Delete Count: " + res.deletedCount);
      });
    db.close();
  });
}

//Function to Remove the feeds older than 30 days.
function FlagAgedFeeds(deletionDate){

  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);

    dbo.collection(WEB_FEED_TABLE_NAME).find({ deleteflag : false }).forEach(function(result) {

        var pubDate = new Date(result.pubDate);
        if(pubDate < deletionDate) {
           console.log("Need to be deleted: " + result._id);
           setDeleteFlag(result._id);
         }
     });
    db.close();
  });
}

function setDeleteFlag(id) {

  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo.collection(WEB_FEED_TABLE_NAME).updateMany(
      { _id : id },
      { $set: { "deleteflag" : true }} , function(err, res) {
      if (err) throw err;
      console.log("Number of items updated: " + res.modifiedCount);
      db.close();
    });
  });
}

function SetFeedDisableFlag(name){

  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo.collection(WEB_FEED_TABLE_NAME).updateMany(
      { source : { $eq : name } },
      { $set: { "disableflag" : true }} , function(err, res) {
      if (err) throw err;
      console.log("Number of items updated: " + res.modifiedCount);
      db.close();
    });
  });
}

function SetFeedEnableFlag(name){

  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo.collection(WEB_FEED_TABLE_NAME).updateMany(
      { source : { $eq : name } },
      { $set: { "disableflag" : false }} , function(err, res) {
      if (err) throw err;
      console.log("Number of items updated: " + res.modifiedCount);
      db.close();
    });
  });
}

function SetProviderDisableFlag(name){

  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo.collection(PROVIDER_TABLE_NAME).updateMany(
      { source : { $eq : name } },
      { $set: { "disableflag" : true }} , function(err, res) {
      if (err) throw err;
      console.log("Number of items updated: " + res.modifiedCount);
      db.close();
    });
  });
}

function SetProviderEnableFlag(name){

  MongoClient.connect(baseUrl, newUrlP, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo.collection(PROVIDER_TABLE_NAME).updateMany(
      { source : { $eq : name } },
      { $set: { "disableflag" : false }} , function(err, res) {
      if (err) throw err;
      console.log("Number of items updated: " + res.modifiedCount);
      db.close();
    });
  });
}

module.exports.CreateDB = CreateDB;
module.exports.CreateTable = CreateTable;
module.exports.InsertWebFeedData = InsertWebFeedData;
module.exports.InsertProviderData = InsertProviderData;
module.exports.ShowAllWebFeed = ShowAllWebFeed;
module.exports.ShowAllProviders = ShowAllProviders;
module.exports.DeleteAll = DeleteAll;
module.exports.DeleteProvider = DeleteProvider;
module.exports.UpdateWebFeedData = UpdateWebFeedData;
module.exports.FlagAgedFeeds = FlagAgedFeeds;
module.exports.GetExportFeeds = GetExportFeeds;
module.exports.ShowConfigData = ShowConfigData;
module.exports.UpdateAgeData = UpdateAgeData;
module.exports.UpdateIntervalData = UpdateIntervalData;
module.exports.InsertCustomFeedData = InsertCustomFeedData;
module.exports.RetrieveProviderDataById = RetrieveProviderDataById;
module.exports.UpdateCustomFeedData = UpdateCustomFeedData;
module.exports.UpdateProviderData = UpdateProviderData;
module.exports.DeleteWebFeedData = DeleteWebFeedData;
module.exports.DeleteProviderDataByName = DeleteProviderDataByName;
module.exports.SetFeedDisableFlag = SetFeedDisableFlag;
module.exports.SetFeedEnableFlag = SetFeedEnableFlag;
module.exports.SetProviderEnableFlag = SetProviderEnableFlag;
module.exports.SetProviderDisableFlag = SetProviderDisableFlag;
module.exports.UpdateErrorProviderData = UpdateErrorProviderData;
