import fetch from 'node-fetch'
import _ from 'underscore'

const YT_PLAYLIST_FORMAT = /^([\S]+list=)?([\w_-]+)[\S]*$/;

// youtube apis, see: https://developers.google.com/youtube/v3/docs/

const PLAYLIST_ITEM_URL = 'https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&fields=items/contentDetails/videoId,nextPageToken&key=AIzaSyAhMj9pBxRpzUlD8elg-ckIclhY_5ngEBk';
const VIDEO_URL = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&key=AIzaSyAhMj9pBxRpzUlD8elg-ckIclhY_5ngEBk'

const measure = async (url) => {
  const playlistId = extract(url)

  // 1. get full video infos of playlist
  const info = await getVideos(playlistId).then(videos => getInfos(videos))
  
  // const info = await getInfos(videos)
  return info
}

const extract = (url) => url.match(YT_PLAYLIST_FORMAT)[2]

const chunk = (arr, size) => arr.reduce((acc, e, i) => (i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc), [])

const getVideos = async (playlistId) => {
  var videos = []
  
    let pageToken = null
    do {
      const url = `${PLAYLIST_ITEM_URL}&playlistId=${playlistId}`
      if (pageToken != null) {
        url = `${url}&pageToken=${pageToken}`
      }
  
      const json = await fetch(url).then(res => res.json())
      pageToken = json.nextPageToken
  
      videos = videos.concat(json.items)      
    } while (videos.length >= 500 || pageToken == null);
  
  return videos
}

const getInfos = async (videos) => {
  let videoInfos = []
  const videoIds = videos.map(v => v.contentDetails.videoId)
  await Promise.all(chunk(videoIds, 50).map(async (vids) => {
  
    const url = `${VIDEO_URL}&id=${vids.join(',')}`
      
    const json = await fetch(url)
      .then(res => res.json())
      .then(json => json.items.map(i => { return { id: i.id, details: i.contentDetails } }))
    console.log(json)
    videoInfos = videoInfos.concat(json)
  }))

  return videoInfos
}

export default measure