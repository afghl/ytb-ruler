import express from 'express'
import path from 'path'
import measure from './measure'

const app = express()

app.get('/', (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/` + '../view/index.html'))
})

app.get('/apis/playlist', (req, res) => {
  const url = req.query.playlistUrl
  
  return measure(url).then(r => res.send(r))
})

export const bootServer = (port) => {
  app.listen(port, function(error) {
    if (error) {
      console.error(error)
    } else {
      console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
    }
  })
}
