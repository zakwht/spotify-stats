# Spotify Stats

[![License](https://img.shields.io/github/license/zakwht/spotify-stats)](./LICENSE.md)
[![top album](https://img.shields.io/badge/dynamic/json?color=f7b4c6&label=top%20album&query=%24.albums[0][1].name&url=https%3A%2F%2Fraw.githubusercontent.com%2Fzakwht%2Fspotify-stats%2Fmain%2Fout.json)](./out.json)

A javascript program that compiles Spotify streaming history to analyze data with the command line.

### Getting started

[Request the extended streaming history](https://support.spotify.com/us/article/data-rights-and-privacy-settings/) of your Spotify account. Add the `.json` files from the export to the `/json` directory, replacing any other files inside.

### Usage

The the command line explorer with `node stats.js`

Running `node stats.js dist` produces the JSON output in `out.json`

#### Global Functions

All functions can be supplied with a `datequery` to filter the stream data by time range.

`topTracks(datequery='', n=25)` prints the top `n` most streamed tracks (by number of streams)

`topAlbums(datequery='', n=25)` prints the top `n` most streamed artists (by stream time)

`topArtists(datequery='', n=25)` prints the top `n` most streamed albums (by stream time)

`findSkips(datequery='', minSkip=20, threshold=80)` prints songs that have been skipped at least `minSkip` times, and at least `threshold`% of time

#### Examples

```javascript
// print all the top artists of all time
> topArtists('', -1)

// print the top 25 albums of 2018
> topAlbums('2018')

// find songs skipped more than 80% of the time & at least 50 times in 2021
> findSkips('2021', 50, 80)

// print the top 5 tracks on October 7th, 2022
> topTracks('2022-10-07', 5)
```

#### Global variables

`all` is the array that contains information on every stream and skip ever

