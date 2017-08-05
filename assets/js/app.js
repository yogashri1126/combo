var articleList = [];
var searchTerm;

// create div variables
var divArticleList = $('#article-list');
var divArticleCurrent = $('#article-current');

// populate article list
function populateArticleList () {
  divArticleList.html("<h4 class='text-center'>Table of Contents</h4>");
  articleList.forEach((article, index) => {
    var html = "<div class='article-title' value='" + index + "'>";
    html += article.title;
    html += '</div>';

    divArticleList.append(html);
  });
}

// display current article
function displayCurrentArticle (article) {
  var articleID = article.link.split('/')[4];

  var html = '<h4>' + article.title + '</h4>';
  html = html + '<iframe src="' + article.link + '" ></iframe>';
  // html = html + '<iframe src="https://www.nature.com/articles/'+articleID+'" ></iframe>';
  divArticleCurrent.html(html);
  // console.log(article.link);
}

var config = {
  apiKey: 'AIzaSyBMspl9CpK0mjnwum55Jg1r8BH-E_YEt-k',
  authDomain: 'exemplar-eadfd.firebaseapp.com',
  databaseURL: 'https://exemplar-eadfd.firebaseio.com',
  projectId: 'exemplar-eadfd',
  storageBucket: 'exemplar-eadfd.appspot.com',
  messagingSenderId: '200572986712'
};
firebase.initializeApp(config);

var ref;

// TODO: I think this click event listener needs to be on a link that gets populated in the current article detail.
// add click listener to each article title
divArticleList.on('click', '.article-title', function () {
  var currentIndex = $(this).attr('value');
  displayCurrentArticle(articleList[currentIndex]);

  var key = firebase.auth().currentUser.uid;

  var count = 0;
  var day = new Date();
  var postData = {

    paperSearchTerm: searchTerm,
    paperLink: articleList[currentIndex].link,
    paperID: articleList[currentIndex].id,
    paperPublisher: articleList[currentIndex]['sru:recordData']['pam:message']['pam:article']['xhtml:head']['dc:publisher'],
    paperGenre: articleList[currentIndex]['sru:recordData']['pam:message']['pam:article']['xhtml:head']['prism:genre'],
    paperISSN: articleList[currentIndex]['sru:recordData']['pam:message']['pam:article']['xhtml:head']['prism:issn'],
    paperDate: articleList[currentIndex]['sru:recordData']['pam:message']['pam:article']['xhtml:head']['prism:publicationDate'],
    paperPubName: articleList[currentIndex]['sru:recordData']['pam:message']['pam:article']['xhtml:head']['prism:publicationName'],
    paperDate: day,
    paperTime: 'empty'
  };

        // //////////updating the firebase with new data that clicked paper
  ref = firebase.database().ref('/users/' + key + '/papers/' + day.getTime() + '/' + currentIndex);
  firebase.database().ref('/users/' + key + '/papers/' + day.getTime() + '/' + currentIndex).update(postData);

        // ///////////controlling timer and appearance of timer and table///////
  stopwatch.start();
  $('.row').hide();
  $('#wrapper').attr('class', 'show');
  window.open(articleList[currentIndex].link);
});

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////TIMER FOR CLICKED LINK/////////////////////////////////////
// ////////////////////////////////////////////////////////////////////
//  Variable that will hold our setInterval that runs the stopwatch
var intervalId;

// prevents the clock from being sped up unnecessarily
var clockRunning = false;
var converted;
// Our stopwatch object
var stopwatch = {

  time: 0,
  lap: 1,

  reset: function () {
    stopwatch.time = 0;
    stopwatch.lap = 1;

    // DONE: Change the "display" div to "00:00."
    $('#display').html('00:00');

    // DONE: Empty the "laps" div.
    $('#laps').html('');
  },
  start: function () {
    // DONE: Use setInterval to start the count here and set the clock to running.
    if (!clockRunning) {
      intervalId = setInterval(stopwatch.count, 1000);
      clockRunning = true;
    }
  },
  stop: function () {
    // DONE: Use clearInterval to stop the count here and set the clock to not be running.
    clearInterval(intervalId);
    clockRunning = false;
  },
  recordLap: function () {
    // DONE: Get the current time, pass that into the stopwatch.timeConverter function,
    //       and save the result in a variable.
    var converted = stopwatch.timeConverter(stopwatch.time);

    // DONE: Add the current lap and time to the "laps" div.
    $('#laps').append('<p>Lap ' + stopwatch.lap + ' : ' + converted + '</p>');

    // DONE: Increment lap by 1. Remember, we can't use "this" here.
    stopwatch.lap++;
  },
  count: function () {
    // DONE: increment time by 1, remember we cant use "this" here.
    stopwatch.time++;

    // DONE: Get the current time, pass that into the stopwatch.timeConverter function,
    //       and save the result in a variable.
    converted = stopwatch.timeConverter(stopwatch.time);
    // console.log(converted);

    // DONE: Use the variable we just created to show the converted time in the "display" div.
    $('#display').html(converted);
  },
  timeConverter: function (t) {
    var minutes = Math.floor(t / 60);
    var seconds = t - (minutes * 60);

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    if (minutes === 0) {
      minutes = '00';
    } else if (minutes < 10) {
      minutes = '0' + minutes;
    }

    return minutes + ':' + seconds;
  }
};

// ///////stopping timer and pushing time to firebase/////////
$(document).on('click', '#stop', function () {
  ref.once('value', function (user) {
    ref.child('paperTime').set(converted);
  });

  stopwatch.stop();
  $('#wrapper').hide();
  $('.row').show();
  stopwatch.time = 0;
});

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// //listening any change on state of firebase
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    $('#displayName').html(' Welcome ' + user.displayName + ' ' + user.email);
  } else {
    console.log('not logged in');
  }
});

// main reference firebase
// var ref = firebase.database().ref("/users");
//
// // ref.on("value", function(data){
//   var keyz = firebase.auth().currentUser.uid;
//   var dat = data.val();
  // array of all keys - users
  // console.log(Object.keys(dat));
  // selecting logged in user key
  // console.log(dat[keyz]);

$(document).on('click', '.btn.btn-primary.dropdown-toggle.logout', function () {
  event.preventDefault();

  firebase.auth().signOut().then(function () {
              // Sign-out successful. Back to log in page
    window.location = 'logIn.html';
  }).catch(function (error) {
              // Handling error
    console.log(error);
  });
});

$(document).on('click', '#newButton', function () {
  event.preventDefault();
  searchTerm = $('input').val().trim();
  var comment = $('input').val().trim();
  searchNatureAPI(comment);
  // add search term to iframe format
  // var iframe = '<iframe id="ytplayer" type="text/html" width="720" height="405" src="https://www.youtube.com/embed/?listType=search&list=' + searchTerm + '"frameborder="0" allowfullscreen></iframe>';
 var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: encodeURIComponent($('input').val().trim()).replace(/%20/g, "+"),
            maxResults: 1,
            order: "relevance",
            topicId: "/m/01k8wb",
            safeSearch: "strict",
            publishedAfter: "2015-01-01T00:00:00Z"
  // add iframe to html
  // $('#ytNew').html(iframe);
});

        // execute the request
      function tplawesome(e,t){res=e;for(var n=0;n<t.length;n++){res=res.replace(/\{\{(.*?)\}\}/g,function(e,r){return t[n][r]})}return res}
       request.execute(function(response) {
          var results = response.result;
          $("#ytNew").html("");
          $.each(results.items, function(index, item) {
            $.get("tpl.html", function(data) {
                $("#ytNew").append(tplawesome(data, [{"title":item.snippet.title, "videoid":item.id.videoId}]));
            });
          });
          // resetVideoHeight();
          console.log(results)
       });
    });
    
//     $(window).on("resize", resetVideoHeight);

// function resetVideoHeight() {
//     $("#ytNew").css("height", "405px","width","720px");
// }

function init() {
    gapi.client.setApiKey("AIzaSyDZh8uYaoVKAcc9hYsRzC1o9HuQH3SwTYk");
    gapi.client.load("youtube", "v3", function() {
        // yt api is ready
    });
}

// search natureAPI
function searchNatureAPI (search) {
  var apiURL = 'https://www.nature.com/opensearch/request?httpAccept=application/json&query=' + search;

  var data;
  fetch(apiURL).then(response => {
    return response.json();
  }).then(returnData => {
    console.log(returnData.feed.entry);
    articleList = returnData.feed.entry;
    populateArticleList();
  });
}

var database = firebase.database();

// **********************************************
//    Click event for article-list
// **********************************************

$('#article-list').on('click', function () {
  event.preventDefault();
  dateAdded = $('#dateAdded-input').val().trim();

  database.ref().push({
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
});

database.ref().orderByChild('dateAdded').limitToLast(1).on('child_added', function (snapshot) {
  var sv = snapshot.val();
      // Log everything that's coming out of snapshot
  console.log(sv.dateAdded);
});
