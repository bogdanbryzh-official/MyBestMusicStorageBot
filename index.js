const express = require('express')
const fetch = require('node-fetch')

const app = express()
const port = PORT || 3000

app.use(express.static('public'))
app.get('/', (req, res) => res.sendFile('index.html'))

const getSearchJSON = searchData => {
  return new Promise(async resolve => {
    const response = await fetch(
      `https://api.deezer.com/search?q=${searchData}&limit=24`
    )
    const data = await response.json()
    resolve(data.data)
  })
}

const getTrackJSON = trackID => {
  return new Promise(async resolve => {
    const response = await fetch(`https://api.deezer.com/track/${trackID}`)
    const data = await response.json()
    resolve(data)
  })
}

const buildTrackJSON = async trackID => {
  const trackInfo = await getTrackJSON(trackID)
  return {
    title: trackInfo.title,
    artist: trackInfo.artist.name,
    album: trackInfo.album.title,
    release_date: trackInfo.release_date,
    cover: trackInfo.album.cover_medium,
    link: trackInfo.link,
  }
}

const search = async query => {
  const searchData = await getSearchJSON(query)
  const tracksID = searchData.map(track => {
    return track.id
  })

  let searchResults = tracksID.map(buildTrackJSON)

  await Promise.all(searchResults).then(data => {
    searchResults = data
  })

  return searchResults
}

app.get('/search', async (req, res) => {
  const searchQuery = req.query.query

  const result = await search(searchQuery)

  res.send({ data: result })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
