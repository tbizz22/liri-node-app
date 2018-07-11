//bring in the .env
require('dotenv').config()
var key = require("./keys.js")

//bring in the request
var request = require('request');

//bring in the twitter
var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: key.twitter.consumer_key,
    consumer_secret: key.twitter.consumer_secret,
    access_token_key: key.twitter.access_token_key,
    access_token_secret: key.twitter.access_token_secret
});

// bring in the spotify

var Spotify = require('node-spotify-api');


// command functions here

function getSong(value) {
    var spotify = new Spotify({
        id: key.spotify.id,
        secret: key.spotify.secret
    });

    spotify.search({
        type: 'track',
        query: value,
        limit: 1
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        r = data.tracks.items[0];

        console.log("Artist: " + r.artists[0].name)
        console.log("Song Title: " + r.name)
        console.log("Preview the Song: " + r.preview_url)
        console.log("Album: " + r.album.name + " (" + r.album.release_date + ")")

    });
}


function getTweet() {
    var params = {
        screen_name: "tbizz22",
        // homework calls for 20. That feels like a lot...
        count: "5"
    };

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            var t = tweets
          
            for (i=0; i < t.length; i++) {
                console.log(t[i].text);
                console.log(t[i].created_at);
                console.log("---------------------------");
            }          
        } else {
            return console.log(error);
        }
    })
}



function printHelp() {

}



function doIt() {

}


// main page logic here


var action = process.argv[2];
var value = setValue();

// this is handling nulls as not all commands have a second value passed
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
    case 'movie-this':
        getMovie(value);
        break;
    case 'do-what-it-says':
        doIt();
        break;
    case 'help':
        printHelp();
    default:
        console.log("Sorry we didn't understand the request. Type \"help\" for more information about available commands.");
}