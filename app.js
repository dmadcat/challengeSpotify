const express = require('express')
const app = express()
const path = require('path');

const ejsMate = require('ejs-mate');


const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')


const spotiApi = require('./public/javascripts/spotifyApiFunctions');
const complement = require('./public/javascripts/complements');

// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);

//path
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))





//routes
app.get('/api/v1/albums',catchAsync(async (req, res) =>{

    let uncodeArtist = req.query.q;
    let artist = encodeURIComponent(req.query.q);

    //token getter private methods
    const token = await spotiApi._getToken();

    //artist's finder
    const spotifyArtist = await spotiApi.getSpotifyArtist(token,artist)
    

    //correct artist's chooser
    const artistSelected = complement.artistChooser(uncodeArtist,spotifyArtist)
    const Id = spotifyArtist.artists.items[artistSelected].id
    const Name = spotifyArtist.artists.items[artistSelected].name

    //album's finder
    const albums = await spotiApi.spotifyAlbums(token,Id)
    
    //json maker
    const allAlbums = complement.getAllAlbums(albums)

    res.render('albums', { allAlbums, Name})
}))




app.get('/', async(req, res) =>{

    res.render('home')
    /* res.send("Try this route /api/v1/albums") */
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})


const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Serving on port ${port}`)
})