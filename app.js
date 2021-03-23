const express = require('express')
const app = express()
const path = require('path');

const ejsMate = require('ejs-mate');
const fetch = require('node-fetch');
var btoa = require('btoa');
require('dotenv').config();


const clientId=process.env.CLIENT_ID;
const clientSecret=process.env.CLIENT_SECRET;




// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);

//path
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))





//routes
app.get('/api/v1/albums', async (req, res) =>{

    /* if(!req.query.q){
        const message = 'No search query'
        /* res.send('No search query')
        res.render('error', { message})
        return
    } */
    try{
        console.log(req.query.q)
    }catch(error){
        res.render('error', { error})
    }

    let unencodeArtist = req.query.q;
    let artist = encodeURIComponent(req.query.q);

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
    const token = await _getToken();
    /* console.log(token) */ 

    //artist's finder
    const getSpotifyArtist = fetch(`https://api.spotify.com/v1/search?q=${artist}&type=artist`, {
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
            console.log(json.artists.items[0].id)
            return json

        }catch(error){
            console.error(error);
            /* res.send('Invalid query') */
            const message = 'Invalid query'
            res.render('error', { error})
        }
    });
    


    //correct artist's chooser
    const spotifyArtist = await getSpotifyArtist    
    let f=0;
    for(let i = 0; i < 10; i++){
        if(unencodeArtist.toLowerCase()==spotifyArtist.artists.items[i].name.toLowerCase()){
            f=i;
        }
    }    
    const Id = spotifyArtist.artists.items[f].id
    const Name = spotifyArtist.artists.items[f].name



    
    //album's finder
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

    
    //json maker
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
    /* res.send(allAlbums) */
    res.render('albums', { allAlbums, Name})
})




app.get('/', async (req, res) =>{

    res.render('home')
    /* res.send("Try this route /api/v1/albums") */
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})
 

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Serving on port ${port}`)
})