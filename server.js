const express = require('express')
const app = express()

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World')
})


app.get('/apis/playlist', (req, res) => {
  res.send(req.query.playlistId)
})

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
