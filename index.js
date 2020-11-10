#!/usr/bin/env node

import 'minimist'
const parseArgs = require('minimist');
const request = require('request');

const SERVER_URL = "https://ytb-ruler.herokuapp.com/apis/playlist?playlistId={playlistId}"
const YT_PLAYLIST_FORMAT = /^([\S]+list=)?([\w_-]+)[\S]*$/;
const PLAYLIST_ITEM_URL = 'https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&fields=items/contentDetails/videoId,nextPageToken&key=AIzaSyAhMj9pBxRpzUlD8elg-ckIclhY_5ngEBk&playlistId={playlistId}&pageToken={pageToken}';

const measure = (playlistId) => {
    const url = SERVER_URL.replace("{playlistId}", playlistId);

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
      }
    });
}

const start = () => {

  const args = parseArgs(process.argv.slice(2));

  if (args == null) {
    console.log("Youtube playlist url is required.");
    return;
  }

  const youtubeUrl = args['_'][0];

  if (youtubeUrl == null || youtubeUrl == undefined) {
    console.log("Youtube playlist url is required.");
    return;
  }

  const playlistId = youtubeUrl.match(YT_PLAYLIST_FORMAT)[2];

  if (playlistId == null) {
    console.log("Invalid youtube playlist url.");
  }

  measure(playlistId);
}

start()
