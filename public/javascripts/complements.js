//correct artist's chooser
const artistChooser = (uncodeArtist,spotifyArtist) =>{
    let f=0;
    let i=0;

    for(let item of spotifyArtist.artists.items){  /* i = 0; i < 10; i++ */
        if(uncodeArtist.toLowerCase()==item.name.toLowerCase()){
            f=i;
        }
        i++
    }
    return f
}

const getAllAlbums = (albums)=>{
    let sameDate = 'none';
    let sameName = 'none';
    let allAlbums = [];

    for(let item of albums.items){
        if(sameDate!==item.release_date && sameName!==item.name){
            let albumItems = {
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
    return allAlbums
}


module.exports = {
    artistChooser,
    getAllAlbums
};