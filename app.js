const express = require('express')
const app = express()
const path = require('path');

const fetch = require('node-fetch');
var btoa = require('btoa');
require('dotenv').config()

const clientId=process.env.CLIENT_ID;
const clientSecret=process.env.CLIENT_SECRET;

//path
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))





//routes
app.get('/api/v1/albums', async (req, res) =>{

    if(!req.query.q){
        res.send('No search query')
        return
    }
    let artist = req.query.q;
    /* console.log(artist) */

    // private methods
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
    const token = await _getToken();
    /* console.log(token) */


    
    const spotifyArtistId = fetch(`https://api.spotify.com/v1/search?q=${artist}&type=artist`, {
        method: 'GET',
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization':'Bearer '+ token
        }
    })
    .then(res => res.json())
    .then(json => {
        try{
            return json.artists.items[0].id
        }catch(error){
            console.error(error)
            res.send('Invalid query')
        }
    } );  

    const Id = await spotifyArtistId

    const spotifyAlbums = fetch(`https://api.spotify.com/v1/artists/${Id}/albums?limit=50`, {
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
    } );
    const albums = await spotifyAlbums
    /* console.log(albums) */

    
    let sameDate = 'none';
    let sameName = 'none';
    let allAlbums = [];

    for(let item of albums.items){
        if(sameDate!==item.release_date && sameName!==item.name){
            /* console.log(item) */
            let albumItems  = {
                "name":item.name,
                "released":item.release_date,
                "tracks":item.total_tracks,
                "cover":{
                    "height":640,
                    "width":640,
                    "url":item.images[0].url
                }

            };            
            allAlbums.push(albumItems);
            sameDate = item.release_date;
            sameName = item.name;
        }
    }
    console.log(allAlbums)
    res.send(allAlbums)
})
 



app.listen(3000)