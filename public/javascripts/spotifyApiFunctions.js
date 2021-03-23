const fetch = require('node-fetch');
var btoa = require('btoa');
require('dotenv').config();

const clientId=process.env.CLIENT_ID;
const clientSecret=process.env.CLIENT_SECRET;


//token getter private methods
const _getToken = async () => {

    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded', 
            'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    return data.access_token;
}


//artist's finder
const getSpotifyArtist = async (token,artist) => {
    
    const result = fetch(`https://api.spotify.com/v1/search?q=${artist}&type=artist`, {
        method: 'GET',
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization':'Bearer '+ token
        }
    })
    .then(res => res.json())
    .then(json => {
        return json
    });
    const data = await result
    return data

}



//album's finder
const spotifyAlbums = async (token,Id) => {

    const result = fetch(`https://api.spotify.com/v1/artists/${Id}/albums?limit=50`, {
        method: 'GET',
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization':'Bearer '+ token
        }
        })
        .then(res => res.json())
        .then(json => {
            //console.log(json)
            return json
        });
    const data = await result
    return data
}



module.exports = {
    _getToken,
    getSpotifyArtist,
    spotifyAlbums
};