/*
*  Responsible - - -
*     - Aaditya Prakash
*************************************
*
*   Content Description:
*   1. Export the enabled feeds into RSS 2.0 version which is available on the
*        REST API link : http://localhost:3000/feeds/export
*
*
*************************************/

//Loading of all dependent Modules
const Feed = require('feed').Feed;
const xml = require('xml');

const database = require('../service/database');

//Initializing the MongoDB Client
var MongoClient = require('mongodb').MongoClient;
var baseUrl = "mongodb://localhost:27017/";

/*
 *  Avoid “current URL string parser is deprecated” warning by setting useNewUrlParser to true
 */
var newUrlP = { useNewUrlParser: true};

// Initializing the variables
const DATABASE_NAME = "mydb";
const WEB_FEED_TABLE_NAME = "webfeed";
const PROVIDER_TABLE_NAME = "provider";
const CONFIG_TABLE_NAME = "config";

async function exportFeed(req, res) {

    const feed = new Feed({

    title: "Database Project Feed Export",
    description: "This project is developed by students of TU Chemntiz for Database & Techniques Practical Task 2019.",
    link: "http://localhost:3000/",
    copyright: "All rights reserved 2019, Aaditya & Ila",
    docs: "TU Chemnitz Project"
    });


    MongoClient.connect(baseUrl, newUrlP, function(err, db) {
      if (err) throw err;
      db.db(DATABASE_NAME).collection(WEB_FEED_TABLE_NAME).find().forEach(function(item) {
        if (err) throw err;

        feed.addItem({
            title: item.title,
            id: item.link,
            link: item.link,
            description: item.content,
            content: item.content,
            date: new Date(item.pubDate)
          });
        });
      db.close();
      });

      let promise = new Promise((resolve, reject) => {
          setTimeout(() => resolve("Done!"), 500)
      });

//console.log(feed.rss2());
// Output: RSS 2.0

//console.log(feed.atom1());

// Output: Atom 1.0

//console.log(feed.json1());
// Output: JSON Feed 1.0


    let result = await promise;
    res.set('Content-Type', 'text/xml');
    res.send(feed.rss2());

}


module.exports.exportFeed = exportFeed;
