const { readdirSync, readFileSync } = require("fs")

const all = [{
  spotify_track_uri: "",
  ts: "",
  ms_played: 0,
  reason_end: "",
  master_metadata_track_name: "song",
  master_metadata_album_artist_name: "artist",
  master_metadata_album_album_name: "album",
  conn_country: ""
}]
all.splice(0)

readdirSync("json").forEach(file => {
  all.push(...JSON.parse(readFileSync("json/" + file).toString()))
})

const parse = (datequery) => {
  keys = ["track_name", "album_album_name", "album_artist_name", "conn_country"]
  let total = {
    count: 0,
    skips: 0,
    ms: 0,
  }
  keys.forEach(k => total[k] = {})
  const template = {
    count: 0, ms: 0, skip: 0
  }

  all.forEach(s => {
    if (!s.spotify_track_uri) return
    if (datequery && !s.ts.startsWith(datequery)) return
  
    if (s.ms_played > 30 * 1000) {
      total.count = total.count + 1
      total.ms = total.ms + s.ms_played
    } else {
      total.skips = total.skips + 1
    }
  
    keys.forEach(k => {
      let i = {
        "track_name": s.spotify_track_uri,
        "album_album_name": `${s.master_metadata_album_album_name} - ${s.master_metadata_album_artist_name}`,
        "album_artist_name": s.master_metadata_album_artist_name,
        "conn_country": s.conn_country
      }[k]
  
      if (!total[k][i])
        total[k][i] = {
          ...template,
          artist: s.master_metadata_album_artist_name,
          first: s.ts,
          uri: s.spotify_track_uri // uri of first song
        }
    
      if (s.ms_played > 30 * 1000) {
        total[k][i].ms = total[k][i].ms + s.ms_played
        total[k][i].count = total[k][i].count + 1
      } else {
        total[k][i].skip = total[k][i].skip + 1
      }
    })  
  })

  let songs = Object.entries(total.track_name)
    // .filter(a => a[1].count > 10)
    .filter(a => a[1].count)
    .sort(([,a],[,b]) => b.count-a.count)
  let albums = Object.entries(total.album_album_name)
    // .filter(a => a[1].ms >= 60 * 60 * 1000)
    .filter(a => a[1].ms > 60 * 1000)
    .sort(([,a],[,b]) => b.ms-a.ms)
  let artists = Object.entries(total.album_artist_name)
    // .filter(a => a[1].ms >= 60 * 60 * 1000)
    .filter(a => a[1].ms > 60 * 1000)
    .sort(([,a],[,b]) => b.ms-a.ms)

  return {
    total, songs, albums, artists
  }
}

findSkips = (datequery, minSkip=20, threshold=80) => {
  const { total } = parse(datequery)
  Object.values(total.track_name).forEach(s => {
    skipRate = 100 * s.skip / (s.skip+s.count)
    if (s.skip > minSkip && skipRate > threshold)
      console.log(`${s.name} ${s.skip} ${skipRate.toFixed(2)}%`)
  })
}

const hourStr = ms => (ms / 1000 / 60 / 60).toFixed(2) + 'h';
const minStr = ms => (ms / 1000 / 60).toFixed(2) + 'min'

topTracks = (datequery, n=25) => {
  const { songs } = parse(datequery);
  songs.slice(0,n).forEach(([,s], i) => console.log(`${String(i+1).padStart(n.toString().length+2, ' ')}. ${s.name} - ${s.artist} (${s.count})`))
}

topAlbums = (datequery, n=25) => {
  const { albums } = parse(datequery)
  const timeFormat = albums[0][1].ms > 60 * 60 * 1000 ? hourStr : minStr
  albums.slice(0,n).forEach(([,s], i) => console.log(`${String(i+1).padStart(n.toString().length+2, ' ')}. ${s.name} - ${s.artist} (${timeFormat(s.ms)})`))
}

topArtists = (datequery, n=25) => {
  const { artists } = parse(datequery)
  const timeFormat = artists[0][1].ms > 60 * 60 * 1000 ? hourStr : minStr
  artists.slice(0,n).forEach(([,s], i) => console.log(`${String(i+1).padStart(n.toString().length+2, ' ')}. ${s.name} (${timeFormat(s.ms)})`))
}

require('repl').start({ignoreUndefined: true});