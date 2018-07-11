//bring in the .env
require('dotenv').config()
var key = require("./keys.js")

//bring in the request
var request = require('request');

//bring in the twitter
var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: Twitter.consumer_key,
    consumer_secret: Twitter.consumer_secret,
    access_token_key: Twitter.access_token_key,
    access_token_secret: Twitter.access_token_secret
});

// bring in the spotify

var Spotify = require('node-spotify-api');

// var spotify = new Spotify({
//     id: Spotify.id,
//     secret: Spotify.secret
// });

// spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
//     if (err) {
//       return console.log('Error occurred: ' + err);
//     }

//   console.log(data); 
//   });



function getTweet() {
    var params = {
        screen_name: "tbizz22"
    };

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            return console.log(tweets);
        } else {
            return console.log(error);
        }
    })
}




var action = process.argv[2];
var value = setValue();

function setValue() {
    if (process.argv[3] != null) {
        return process.argv[3];
    } else {
        return 0;
    }
}

switch (action) {
    case 'my-tweets':
        getTweet()
        break;
    case 'spotify-this-song':
        getSong(value);
        break;
    case 'movie-this' :
        getMovie(value);
        break;
    case 'do-what-it-says' :
        DoIt();
        break;
    case 'help' :
        printHelp();
    default: 
        console.log("Sorry we didn't understand the request. Type \"help\" for more information about available commands.");
}