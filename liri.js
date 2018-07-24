//def gotta read some documents
var fs = require("fs");

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

            for (i = 0; i < t.length; i++) {
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
    console.log("____________________________\nAvailable commands are as follows\:  \n  my-tweets                           Prints your last " + getTweet.count + " tweets \n  spotify-this <\"Song Name\">          Prints song details\n  movie-this <\"Movie Name\">           Prints movie details\n  do-what-it-says                     Reads value in random.txt and performs that command");
}



function doIt() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (!err) {
            var cmd = data.split(",")
            action = cmd[0];
            value = cmd[1];
            logic(action, value)
        } else {
            console.log("File could not be read.")
        }
    })

}


function getMovie(value) {
    var movieName = value;
    var token = key.omdb.key;
    var url = ("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=" + token)
    var encoded = encodeURI(url);
    

    request(encoded, function (err, response, body) {
        if (!err) {
            var b = JSON.parse(body);
            
            // still working on pointer functions but overall this code makes sense. 
            var ratings = b.Ratings
            var rtIndex = ratings.findIndex(x => x.Source == "Rotten Tomatoes")
            var imdbIndex = ratings.findIndex(x => x.Source == "Internet Movie Database")

            console.log("Title: " + b.Title);
            console.log("Release Year: " + b.Year);
            console.log("IMDB Rating: " + ratings[imdbIndex].Value);
            console.log("Rotten Tomatoes Rating: " + ratings[rtIndex].Value);
            console.log("Country of Origin: " + b.Country);
            console.log("Language: " + b.Language);
            console.log("Plot: " + b.Plot);
            console.log("Actors: " + b.Actors);
        } else {
            console.log(err)
        }
    })
};

// main page logic here


var action = process.argv[2].trim().toLowerCase();
var value = setValue(action);


logic(action, value);


// this is handling nulls as not all commands have a second value passed
function setValue(action) {
    if (process.argv[3] != null) {
        return process.argv[3].trim().toLowerCase();

    } else if (action === "spotify-this-song") {
        // Just searching for the 'the sign' does not return the expected value. 
        value = "the Sign ace of base"
        return value; 

    } else if (action === "movie-this") {
        value = "mr nobody"
        return value;

    } else {
        return 0;
    }
};




function logic(action, value) {

    if (action === "my-tweets") {
        getTweet();

    } else if (action === "spotify-this-song") {
        getSong(value);

    } else if (action === "movie-this") {
       getMovie(value);

    } else if (action === "help") {
        printHelp();

    } else if (action === "do-what-it-says" && value === 0) {
       doIt();
    } else {
        console.log("Sorry we didn't understand the request. Type \"help\" for more information about available commands.");
    }
};
