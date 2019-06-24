/*
*  Responsible - Aaditya Prkash
*************************************
*   Content Description:
*   1. Defining various Event Handlers
*   2. Dynamic Generatation of layout
*   3. Sending Server Request via $.getJSON & $.ajax jQuery function
*   4. Receiving JSON Response
*************************************/

$(document).ready(function() {
  "use strict";

  $("#display_insert_feed").hide();
  $("#update_interval").hide();
  $("#update_feed_age").hide();
  $("#update_new_feed").hide();

  //Browse Menu Button Click Event
  $("#btn_feeds").click(function(){
    initialize_with_feeds();
  });

  //Browse Restaurants Button Click Event
  $("#btn_providers").click(function(){
    initialize_with_providers();
  });

  //Browse Menu Button Click Event
  $("#btn_management_new_feed").click(function(){
      $("#display_heading").text(" ");
      $(".feedItem-listing").empty();
      $("#update_interval").hide();
      $("#update_feed_age").hide();
     $.getJSON("/management/feed" , function(data, status){
       if(status == "success") {
            $("#feed-name").val(" ");
            $("#feed-url").val(" ");
            $("#image-url").val(" ");
            $("#display_insert_feed").show();
         }
       else {
         $("#display_heading").text(status);
       }
    });
  });

  //Browse Menu Button Click Event
  $("#btn_reload_database").click(function(){
      $("#display_heading").text("Reloading Database...");
      $(".feedItem-listing").empty();
      $("#update_interval").hide();
      $("#update_feed_age").hide();
     $.getJSON("/database/reload" , function(data, status){
       if(status == "success") {
          $("#display_heading").text("Database reload Successful!");
          alert("Database Reload Successful!");
          initialize_with_feeds();
         }
       else {
         $("#display_heading").text(status);
       }
    });
  });

  //Browse Menu Button Click Event
  $("#btn_delete_database").click(function(){
      $("#display_heading").text("Deleting Database...");
      $(".feedItem-listing").empty();
      $("#update_interval").hide();
      $("#update_feed_age").hide();
     $.getJSON("/database/delete" , function(data, status){
       if(status == "success") {
          $("#display_heading").text("Database deleted successfully!");
          alert("Database deleted successfully!");
         }
       else {
         $("#display_heading").text(status);
       }
    });
  });

    //Browse Menu Button Click Event
  $("#btn_update_interval").click(function(){
        $("#display_heading").text(" ");
        $(".feedItem-listing").empty();
        $("#update_feed_age").hide();
        $("#display_insert_feed").hide();
       $.getJSON("/settings" , function(data, status){
         if(status == "success") {
              $("#update_interval").show();
              $.each(data, function(index, value){
                  displayInterval(value);
                });
           }
         else {
           $("#display_heading").text(status);
         }
      });
    });

  //Browse Menu Button Click Event
  $("#btn_update_feed_age").click(function(){
      $("#display_heading").text(" ");
      $(".feedItem-listing").empty();
      $("#update_interval").hide();
      $("#display_insert_feed").hide();

     $.getJSON("/settings" , function(data, status){
       if(status == "success") {
            $("#update_feed_age").show();
            $.each(data, function(index, value){
                displayAge(value);
              });
         }
       else {
         $("#display_heading").text(status);
       }
    });
  });

  $("#submit_new_feed").click(function(){
    var name = $("#feed-name").val().trim();
    var url = $("#feed-url").val().trim();
    var imageUrl = $("#image-url").val().trim();
    var baseUrl = "/provider/actions/insert";
    var data =  { 'name' : name, 'url' : url , 'imageUrl' : imageUrl };
    //alert(name + " " +url);

    if(name!=null && url!= null && name !== " " && url != " "){

        $.ajax({
          type: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json',
          url: baseUrl,
          success: function(data) {
            alert("Data saved!");
            initialize_with_providers();
          }, error: function(jqXHR, textStatus, err){
            alert('text status '+ textStatus +', err '+err);
          }
        });
      }
      else {
        alert("Kindly input valid data.!");
      }
  });



  $("#btn_age_submit").click(function(){
    var age = $("#selectAge").val().trim();
    var baseUrl = "/settings/age/";
    var data =  {'value' : age };

    if(age != null && age != " " && age != "" && $.isNumeric(age)) {

        $.ajax({
          type: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json',
          url: baseUrl,
          success: function(data) {
            alert("Success changed!");
          }, error: function(jqXHR, textStatus, err){
            alert('text status '+textStatus+', err '+err);
          }
        });
      } else {
        alert("Kindly input some valid number.!");
      }
  });

  $("#btn_interval_submit").click(function(){
    var interval = $("#selectInterval").val().trim();
    var baseUrl = "/settings/interval/";
    var data = { "interval" : interval };

    if(interval != null && interval != " " && interval != "" && $.isNumeric(interval)) {

        $.ajax({
          type: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json',
          url: baseUrl,
          success: function(data) {
            alert("Success changed!");
          }, error: function(jqXHR, textStatus, err){
            alert('text status '+textStatus+', err '+err);
          }
        });
      } else {
        alert("Kindly input some valid number.!");
      }
  });

  initialize_with_feeds();
  // End of main Function
});

  function initialize_with_feeds() {

    $.getJSON("/feeds" , function(data){
      $("#display_heading").text('Loading...');
      $(".feedItem-listing").empty();
      $("#display_insert_feed").hide();
      $("#update_interval").hide();
      $("#update_feed_age").hide();
      if(!(data.length == 0)) {
        $("#display_heading").text("Showing " + data.length + " feeds items from all providers...");
        } else {
        $("#display_heading").text("No feeds available! Reload Database or Insert New Providers.");
      }
      $.each(data, function(index, value){
        displayFeeds(value);
      });
    });
  }

  function initialize_with_providers() {

    $("#display_heading").text('Loading...');
    $("#display_insert_feed").hide();
    $("#update_interval").hide();
    $("#update_feed_age").hide();
    $.getJSON("/providers" , function(data, status){
      if(status == "success") {
        $(".feedItem-listing").empty();
        if(!(data.length == 0)) {
          $("#display_heading").text("Showing " + data.length + " Web Feed Providers");
        } else {
          $("#display_heading").text("No providers available! Reload Database or Insert New Providers.");
        }

        $.each(data, function(index, value){
          displayProvider(value);
        });
      }
      else {
        $("#display_heading").text(status);
      }
    });
  }

















  function displayInterval(res) { $("#selectInterval").val(res.interval); }
  function displayAge(res) { $("#selectAge").val(res.age); }

  function displayFeeds(feedItem){

  $.extend({
    el: function(el, props) {
      var $el = $(document.createElement(el));
      $el.attr(props);
      return $el;
    }
  });

  //alert(moment(feedItem.pubDate).format('llll'));

  // Dynamic Generation of Dish Items

  $(".feedItem-listing").append(
    $.el('div', {'class': 'col-xs-12 col-sm-6 food-item'}).append(
      $.el('div', {'class': 'food-item-wrap'}).append(
        $.el('div', {'class': 'content'}).append(
          $.el('div', {'class': 'product-name'}).append(
            $.el('a' , {'class': 'pull-right' , 'href': feedItem.source_link}).append(
              $.el('img' ,{'class': 'logo-img-small' , 'src' : feedItem.imageUrl})))
              .append($.el('h5', {'class': 'title'}).append(
                $.el('a' , {'href': feedItem.link}).text(feedItem.title))))
          .append( $.el('div', {'class': 'cot'}).append(
            $.el('div', {'class': 'provider'}).append(
              $.el('a' , {'href': feedItem.source_link}).text(feedItem.source)).append(
              $.el('span', {'class': 'span'}).text(" ")))).append(
              $.el('div', {'class': 'pubDate'}).text(moment(feedItem.pubDate).format('llll'))).append(feedItem.content)
          .append($.el('div', {'cot': 'content'}).append(
            $.el('a' , {'class': 'margin-top product-name btn theme-btn pull-right' , 'href': feedItem.link}).text("Read More"))))
        .append($.el('div', {'class': 'restaurant-block'}).append(
          $.el('div', {'class': 'left'}).append(
            $.el('div', {'class': 'pull-left right-text'}).append(
              $.el('a' , {'class': 'cot'}).text("Entry in Database: ")).append(
              $.el('span', {'class': 'span'}).text(moment(feedItem.date).format('llll'))))).append(
            $.el('div', {'class': 'right-like-part pull-right'}).append(
              $.el('i', {'href': '/remove' , 'class': 'fa fa-trash-o'}))).append(
            $.el('div', {'class': 'right-like-part pull-right'}).append(
              $.el('i', {'href': '#' ,'class': 'fa fa-heart-o'}))))));

}

  function displayProvider(feedItem){

    $.extend({
      el: function(el, props) {
        var $el = $(document.createElement(el));
        $el.attr(props);
        return $el;
      }
    });
    // Dynamic Generation of Dish Items

        $(".feedItem-listing").append(
          $.el('div', {'class': 'col-xs-12 col-sm-6 food-item'}).append(
            $.el('div', {'class': 'food-item-wrap'}).append(
              $.el('div', {'class': 'content'}).append(
                $.el('div', {'class': 'product-name'}).append(
                  $.el('a' , {'class': 'pull-right' , 'href': feedItem.link}).append(
                    $.el('img' ,{'class': 'logo-img' , 'src' : feedItem.imageUrl})))
                    .append($.el('h5', {'class': 'title'}).append(
                      $.el('a' , {'href': feedItem.link}).text(feedItem.name)))
                .append( $.el('div', {'class': 'product-name'}).append(
                    $.el('a' , {'href': feedItem.link}).text(feedItem.link)))
                .append( $.el('div', {'class': 'product-name'}).text(feedItem.title))
                .append($.el('div', {'class': 'form-group col-sm-12 float-lg-right'}).append(
                    $.el('div', {'class': 'btn-group'}).append(
                      $.el('label', {'class': 'btn custom-btn' , 'name' : feedItem._id}).click(function(){ modifyProvider(feedItem)}).append(
                        $.el('input', {'type': 'radio'})).text("Modify")).append(
                          $.el('label', {'class': 'btn custom-btn' , 'name' : feedItem._id }).click(function(){ reloadProvider(feedItem)}).append(
                            $.el('input', {'type': 'radio'})).text("Reload")).append(
                      $.el('label', {'class': 'btn custom-btn', 'name' : feedItem._id }).click(function(){ disableProvider(feedItem)}).append(
                          $.el('input', {'type': 'radio'})).text("Disable")).append(
                      $.el('label', {'class': 'btn custom-btn' , 'name' : feedItem._id}).click(function(){ deleteProvider(feedItem)}).append(
                          $.el('input', {'type': 'radio' })).text("Delete"))))
               .append($.el('div', {'class': 'restaurant-block'}).append(
                $.el('div', {'class': 'left'}).append(
                  $.el('div', {'class': 'pull-left right-text'}).append(
                    $.el('a' , {'class': 'cot', 'href' : '#'}).text("Last Successful Update: ")).append(
                      $.el('span', {'class': 'span'}).text(moment(feedItem.last_successful_update).format('llll'))))))
               .append($.el('div', {'class': 'restaurant-block'}).append(
                  $.el('div', {'class': 'left'}).append(
                    $.el('div', {'class': 'pull-left right-text'}).append(
                      $.el('a' , {'class': 'cot' , 'href' : '#'}).text("Latest Records: ")).append(
                        $.el('span', {'class': 'span'}).text(moment(feedItem.latest_record).format('llll'))))))
               .append($.el('div', {'class': 'restaurant-block'}).append(
                  $.el('div', {'class': 'left'}).append(
                    $.el('div', {'class': 'pull-left right-text'}).append(
                      $.el('a' , {'class': 'cot' , 'href' : '#'}).text("Latest Update Attempt: ")).append(
                        $.el('span', {'class': 'span'}).text(moment(feedItem.last_attempt).format('llll'))))))
                .append($.el('div', {'class': 'restaurant-block'}).append(
                    $.el('div', {'class': 'left'}).append(
                      $.el('div', {'class': 'pull-left right-text'}).append(
                        $.el('a' , {'class': 'cot' , 'href' : '#'}).text("Latest Attempt Message: ")).append(
                          $.el('span', {'class': 'span'}).text(feedItem.last_attempt_message)))))))));

                                  // $("#provider-modify").click(function(){
                                  //   alert($("#provider-modify").attr('name'));
                                  //
                                  // });


    }

  function modifyProvider(feedItem) {

      var baseUrl = "/providers/actions/modify";
      var data =  { '_id' : feedItem._id };

      $("#display_heading").text(" ");
      $(".feedItem-listing").empty();
      $("#update_interval").hide();
      $("#update_feed_age").hide();

    if(feedItem._id!=null && feedItem._id!== " "){

        $.ajax({
          type: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json',
          url: baseUrl,
          success: function(data) {
            $.each(data, function(index, value){
              displayInsertFeed(value);
          });
        }, error: function(jqXHR, textStatus, err){
              alert('text status '+ textStatus +', err '+err);
          }
        });
      }
    }

  function reloadProvider(feedItem){
      var data = { 'name' : feedItem.name , 'link' : feedItem.link , 'imageUrl' : feedItem.imageUrl };
      var baseUrl = "/providers/actions/reload";

          $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: baseUrl,
            success: function(data) {
              alert("Reload Successful!");
                  initialize_with_providers();
            }, error: function(jqXHR, textStatus, err){
              alert('text status '+ textStatus +', err '+err);
            }
          });
    }

  function disableProvider(feedItem){

      var data = { 'name' : feedItem.name};
      var baseUrl = "/providers/actions/disable";

          $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: baseUrl,
            success: function(data) {
              alert("Provider Disabled!");
                  initialize_with_providers();
            }, error: function(jqXHR, textStatus, err){
              alert('text status '+ textStatus +', err '+err);
            }
          });

          $("#disable-btn").text("ENABLE");


    }

  function enableProvider(feedItem){

        var data = { 'name' : feedItem.name};
        var baseUrl = "/providers/actions/enable";

            $.ajax({
              type: 'POST',
              data: JSON.stringify(data),
              contentType: 'application/json',
              url: baseUrl,
              success: function(data) {
                alert("Provider Enabled!");
                    initialize_with_providers();
              }, error: function(jqXHR, textStatus, err){
                alert('text status '+ textStatus +', err '+err);
              }
            });

            $("#disable-btn").text("DISABLE");


      }

  function deleteProvider(feedItem) {
      var data = { 'name' : feedItem.name};

      var baseUrl = "/providers/actions/delete";

          $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: baseUrl,
            success: function(data) {
              alert("Deleted Successfully!");
              initialize_with_providers();
            }, error: function(jqXHR, textStatus, err){
              alert('text status '+ textStatus +', err '+err);
            }
          });
    }

  function displayInsertFeed(feedItem) {
      $("#display_insert_feed").show();
      $("#update_new_feed").show();
      $("#feed-name").val(feedItem.name);
      $("#feed-url").val(feedItem.link);
      $("#image-url").val(feedItem.imageUrl);
      $("#submit_new_feed").hide();

      $("#update_new_feed").click(function(){
        event.preventDefault();

        var data = {};
        var name = $("#feed-name").val().trim();
        var url = $("#feed-url").val().trim();
        var imageUrl = $("#image-url").val().trim();

        if(name != feedItem.name || url != feedItem.link ||  imageUrl != feedItem.imageUrl) {

        data =  { '_id' : feedItem._id , 'name' : name, 'url' : url , 'imageUrl' : imageUrl };
        var baseUrl = "/management/feed/actions/update";

            $.ajax({
              type: 'POST',
              data: JSON.stringify(data),
              contentType: 'application/json',
              url: baseUrl,
              success: function(data) {
                alert("Data saved!");
                    initialize_with_providers();
              }, error: function(jqXHR, textStatus, err){
                alert('text status '+ textStatus +', err '+err);
              }
            });
      }
     else {
      alert("Same content exists!");
    }
      });
    }
