import {
  Credentials
} from "./Credentials.js";
import axios from 'axios';

class SpotifyAPI {

  constructor() {
    this.loginToken = localStorage.getItem("spotify_token");
    if (!this.loginToken) {
      this.loginToken = this.generateToken();
    }

  }

  generateToken() {
    const spotify = Credentials();
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret),
      }
    };
    const data = 'grant_type=client_credentials';

    return axios
      .post('https://accounts.spotify.com/api/token', data, config)
      .then(response => {
        const access_token = response.data.access_token;
        localStorage.setItem("spotify_token", access_token);

        return access_token;
      });
  }

  search(offset) {
    const config = {
      headers: {
        Authorization: `Bearer ${this.loginToken}`
      },
    };
    return axios
      .get(`https://api.spotify.com/v1/search?q=kpop&limit=50&type=track&market=PH&offset=${offset}`, config)
      .then(searchResponse => {
        return searchResponse.data.tracks.items.map((track, idx) => {

          return {

            "idx": idx,
            "artist_name": track.artists[0].name,
            "artist_href": track.artists[0].href,
            "artist_id": track.artists[0].id,
          }
        });
      })
      .catch(error => {
        console.log(error);
        if (error.response.status === 401) {
          this.generateToken().then(() => this.Search(offset));
        }
      });
  }

  async getKpopPlaylist(index) {
    const config = {
      headers: {
        Authorization: `Bearer ${await this.loginToken}`
      },
    };
    //Kpop 2000-2021 open.spotify.com/playlist/61iOYD59VWPF0AQpqJaPot
    //const playlistId = "61iOYD59VWPF0AQpqJaPot";

    //kpop my playlist
    const playlistId = "60qFjnatxFdTPyPgcI7JZI";
    const fields = `
      items(
        track(
          artists(name,href,id)
      ))`.replace(/[ \n]/g,'');

    return axios
      .get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${index}&fields=${fields}`, config)
      .then(searchResponse => {
        return searchResponse.data.items.map((response, idx) => {
          return {
            "idx": idx,
            "artist_name": response.track.artists[0].name,
            "artist_href": response.track.artists[0].href,
            "artist_id": response.track.artists[0].id,
          }
        });
      })
      .catch(error => {
        debugger;
        console.log(error);
        if (error.response.status === 401) {
          this.generateToken().then(() => this.getKpopPlaylist(index));
        }
      });
  }

  async getArtistImage(id) {
    const config = {
      headers: {
        Authorization: `Bearer ${await this.loginToken}`
      },
    };

    return axios
      .get(`https://api.spotify.com/v1/artists/${id}`, config)
      .then(searchArtistResponse => {
        return searchArtistResponse.data.images[0];
      })
      .catch(error => {
        console.log(error);
        if (error.response.status === 401) {
          this.generateToken().then(() => this.getKpopPlaylist(id));
        }
      });
  }
  
}

export default SpotifyAPI;