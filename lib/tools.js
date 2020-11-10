import moment from 'moment'

const YT_PLAYLIST_FORMAT = /^([\S]+list=)?([\w_-]+)[\S]*$/;

export const extract = (url) => url.match(YT_PLAYLIST_FORMAT)[2]

export const chunk = (arr, size) => arr.reduce((acc, e, i) => (i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc), [])

export const devide = (m, d) =>  moment.duration(m.asMilliseconds() / d)
