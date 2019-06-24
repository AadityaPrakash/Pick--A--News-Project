  /*
  *  Responsible -
  *     - Aaditya Prakash
  *     - Ila Gautam
  *************************************
  */

  //Loading of all dependent Modules
  const Parser = require('rss-parser');
  var currentDate = new Date(Date.now());

  //Creating variable of MongoDBService to saving Data into Database
  const database = require('../service/database');

  //RSS Feed Url Links of the Website Providers
  const rss_feed_01 =  "http://newsfeed.zeit.de/index";
  const rss_feed_02 =  "https://www.spiegel.de/international/index.rss";
  const rss_feed_03 =  "https://www.thelocal.de/feeds/rss.php";
  const rss_feed_04 =  "https://www.tu-chemnitz.de/tu/pressestelle/aktuell/aktuell.rss.en";
  const rss_feed_05 =  "https://rss.dw.com/atom/rss-en-all";
  const rss_feed_06 =  "https://www.jungewelt.de/feeds/newsticker.rss";
  const rss_feed_07 = "https://www.freiepresse.de/rss/rss_chemnitz.php";

  const rss_providers = [
    rss_feed_01,
    rss_feed_02,
    rss_feed_03,
    rss_feed_04,
    rss_feed_05,
    rss_feed_06,
    rss_feed_07
  ];

  const WEB_FEED_TABLE_NAME = "webfeed";
  const PROVIDER_TABLE_NAME = "provider";
  const CONFIG_TABLE_NAME = "config";

  //Parsing and saving to RSS Feeds
  function parseFeed(name, url, imageUrl) {

  let parser = new Parser();
  (async () => {

    try {
    let feed = await parser.parseURL(url);
    console.log("\n\nParsing RSS feeds from the URL " + url + " .....\n");

    // Initializing variables
    var latest_record = 0;
    var itemNo = checkUrl(url);
    var content = "sample content";

    var count = 0;
    var json = [];

    feed.items.forEach(item => {

      var pubDate = new Date(item.pubDate);

      if(latest_record < pubDate)
        latest_record = pubDate;

     if (typeof item.description !== 'undefined' && item.description !== null)
        content = item.description;
    else if(typeof item.content !== 'undefined' && item.content !== null)
        content = item.content;
        else
        content = item.summary;


     json.push({ "title" : item.title,
                 "link" : item.link,
                 "source_link" : feed.link,
                 "source" : name,
                 "pubDate" : pubDate,
                 "content" : content,
                 "date" : currentDate,
                 "imageUrl" : imageUrl,
                 "fav" : false,
                 "deleteflag" : false,
                 "disableflag" : false
              });

              count++;
    });

    console.log("Successful Parsed!");
    database.InsertWebFeedData(JSON.stringify(json, null, 4));
    console.log(count + " feeds parsed! Saving in database...");

    var providerData = {      "name" : name,
                              "last_successful_update" : currentDate,
                              "latest_record" : latest_record,
                              "last_attempt" : currentDate,
                              "last_attempt_message" : count

                       };

    database.UpdateProviderData(providerData);
    console.log("Saving provider Data...\n\n");


  } catch(error) {
    console.log("Error occured: " + error);
    var providerData = {      "name" : name,
                              "last_attempt" : currentDate,
                              "last_attempt_message" : "Error occured: " + error
                       };
    database.UpdateErrorProviderData(providerData);
  }

  })();

  }

  function checkUrl(url){

      if(url == rss_feed_01) return 1;
      else if(url == rss_feed_02) return 2;
      else if(url == rss_feed_03) return 3;
      else if(url == rss_feed_04) return 4;
      else if(url == rss_feed_05) return 5;
      else if(url == rss_feed_07) return 6;
      else if(url == rss_feed_07) return 7;

      else
        return 1;
  }

  function getName(itemNo){
    switch (itemNo) {
      case 1: return "ZEIT ONLINE";
      case 2: return "SPIEGEL ONLINE";
      case 3: return "THE LOCAL";
      case 4: return "TU Chemnitz";
      case 5: return "Deutsche Welle";
      case 6: return "Junge Welt";
      case 7: return "Freie Presse";

        break;
      default:

    }
  }

  function getImageUrl(itemNo){

    switch (itemNo) {
      case 1: return "https://belzer-solingen.de/wp-content/uploads/2017/04/zeit-online.png";
      case 2: return "https://www.designtagebuch.de/wp-content/uploads/mediathek//2016/09/spiegel-online-logo.png";
      case 3: return "https://www.thelocal.se/userdata/images/article/990651ead079dbf757594756efdde05f68e3a2e67cd51d6b4347125ae71a306b.jpg";
      case 4: return "https://static.fernstudiumcheck.de/media/images/institute_logos/square/tu-chemnitz.jpg";
      case 5: return "http://penplusbytes.org/wp-content/uploads/2017/05/DW.png";
      case 6: return "http://www.internacionalismo21.org/wp/wp-content/uploads/logo-jungewelt.jpg"
      case 7: return "https://pbs.twimg.com/profile_images/1583374231/icon_512x512px_400x400.png"

        break;
      default: return "https://belzer-solingen.de/wp-content/uploads/2017/04/zeit-online.png";

    }
  }

  function getFeedUrl(itemNo){

    switch (itemNo) {

      case 1: return rss_feed_01;
      case 2: return rss_feed_02;
      case 3: return rss_feed_03;
      case 4: return rss_feed_04;
      case 5: return rss_feed_05;

        break;
      default: return "http://newsfeed.zeit.de/index";

    }
  }

  //Automatical parsing to feed from Front-end.
  async function processFeeds (req, res){

    database.CreateDB("mydb");
    database.CreateTable(WEB_FEED_TABLE_NAME);
    database.CreateTable(PROVIDER_TABLE_NAME);
    database.CreateTable(CONFIG_TABLE_NAME);

    var obj = [];
    console.log("ProcessFeeds()");
    for (var i = 1; i <= rss_providers.length; i++) {
      obj.push({'name' : getName(i) , 'link' : rss_providers[i], 'imageUrl' : getImageUrl(i) , 'last_successful_update' : 'N.A' , 'latest_record' : 'N.A' , 'last_attempt' : 'N.A' , 'last_attempt_message' : 'N.A' , 'disableflag' : false })
    }

    database.InsertProviderData(obj);

    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("done!"), 500)
    });

    var json = { "status" : "success"};

    await parseFeed(rss_feed_01);

    await parseFeed(rss_feed_02);

    await parseFeed(rss_feed_03);

    await parseFeed(rss_feed_04);

    await parseFeed(rss_feed_05);

    await parseFeed(rss_feed_06);

    await parseFeed(rss_feed_07);


    res.json(json);

  }

  function deleteAgedWebFeeds(){

    var _date = new Date();
    var _daysToDeletion = 10;
    var _deletionDate = new Date(_date.setDate(_date.getDate() - _daysToDeletion));

    database.FlagAgedFeeds(_deletionDate);
    console.log("Deleting old records published before " + _deletionDate);
  }

  function management_feed(req, res){
    var json = { "status" : "management"};
     res.json(json);
    //console.log("Management Insert Web Feed called!");
  }

  async function ReloadProviderFeed(req, res){
    var name = req.body.name;
    var link = req.body.link;
    var imageUrl = req.body.imageUrl;

    await database.DeleteWebFeedData(name);

    res.json({'status' : "success"});

    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("done!"), 500)
    });

    await parseFeed(name, link, imageUrl);

  }

  async function DeleteProviderFeedByName(req, res){
        var name = req.body.name;

        await database.DeleteWebFeedData(name);

        let promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve("done!"), 500)
        });

        await database.DeleteProviderDataByName(name);
        res.json({'status' : "success"});

  }

  async function DisableProviderWebFeed(req, res){
        var name = req.body.name;

        await database.SetFeedDisableFlag(name);

        await database.SetProviderDisableFlag(name);
        res.json({'status' : "success"});

  }

  async function EnableProviderWebFeed(req, res){
        var name = req.body.name;

        await database.SetFeedEnableFlag(name);

        await database.SetProviderEnableFlag(name);
        res.json({'status' : "success"});

  }


  module.exports.processFeeds = processFeeds;
  module.exports.parseFeed = parseFeed;
  module.exports.deleteAgedWebFeeds = deleteAgedWebFeeds;
  module.exports.management_feed = management_feed;
  module.exports.ReloadProviderFeed = ReloadProviderFeed;
  module.exports.DeleteProviderFeedByName = DeleteProviderFeedByName;
  module.exports.DisableProviderWebFeed = DisableProviderWebFeed;
  module.exports.EnableProviderWebFeed = EnableProviderWebFeed;
