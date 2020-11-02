const YT_PLAYLIST_FORMAT = /^([\S]+list=)?([\w_-]+)[\S]*$/;
const PLAYLIST_ITEM_URL = 'https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&fields=items/contentDetails/videoId,nextPageToken&key=AIzaSyAhMj9pBxRpzUlD8elg-ckIclhY_5ngEBk&playlistId={playlistId}&pageToken={pageToken}';

const measure = (url) => {
  const playlistId = extract(url)
  
}

const extract = (url) => {
  const playlistId = youtubeUrl.match(YT_PLAYLIST_FORMAT)[2];
  return playlistId
}
