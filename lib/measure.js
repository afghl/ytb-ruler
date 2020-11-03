import fetch from 'node-fetch'
import _ from 'underscore'
import moment from 'moment'

const YT_PLAYLIST_FORMAT = /^([\S]+list=)?([\w_-]+)[\S]*$/;

// youtube apis, see: https://developers.google.com/youtube/v3/docs/

const PLAYLIST_ITEM_URL = 'https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&fields=items/contentDetails/videoId,nextPageToken&key=AIzaSyAhMj9pBxRpzUlD8elg-ckIclhY_5ngEBk';
const VIDEO_URL = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&key=AIzaSyAhMj9pBxRpzUlD8elg-ckIclhY_5ngEBk'

const measure = async (url) => {
  const playlistId = extract(url)

  // 1. get full video infos of playlist
  return getVideos(playlistId)
            .then(getInfos)
            .then(analyse)
}

const getVideos = async (playlistId) => {
  var videos = []
  
  let pageToken = null
  do {
    const url = `${PLAYLIST_ITEM_URL}&playlistId=${playlistId}&pageToken=${pageToken == null ? '' : pageToken }`      
    const json = await fetch(url).then(res => res.json())

    videos = videos.concat(json.items)
    pageToken = json.nextPageToken
    
  } while (videos.length <= 500 && pageToken != null)
  
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

    videoInfos = videoInfos.concat(json)
  }))

  return videoInfos
}

const analyse = (videoInfos) => {
  const total = videoInfos.map(i => moment.duration(i.details.duration))
                    .reduce((total, cur) => total.add(cur), moment.duration())
  
  const analysed = {
    total: total.toISOString(),
    avarage: devide(total, videoInfos.length).toISOString(),
    x125: devide(total, 1.25).toISOString(),
    x150: devide(total, 1.5).toISOString(),
    x175: devide(total, 1.75).toISOString(),
    x200: devide(total, 2).toISOString()
  }

  return { items: videoInfos, analysed: analysed }
}

const extract = (url) => url.match(YT_PLAYLIST_FORMAT)[2]

const chunk = (arr, size) => arr.reduce((acc, e, i) => (i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc), [])

const devide = (m, d) =>  moment.duration(m.asMilliseconds() / d)

export default measure