# challengeSpotify
Get band or artist's albums from spotify.

## Requirements
* NodeJs v14.15.3 or higher
* Enviroment Variables

## Installation
### Step 1 (intall package.json dependencies)
From inside your app directory (i.e. where package.json is located) will install the dependencies for your app, using: "npm install"

### Step 2 (set enviroment variables)
You will need a client id and a client secret code from https://developer.spotify.com/dashboard. You will need to log in it and create an app for get both codes.

| Variable        | Required           | Default  | Example |
| --------------- |--------------------| ---------| --------|
| CLIENT_ID       | Yes                |None      | 4a94e7f417c3533ae3ee268ddc100b66
| CLIENT_SECRET   | Yes                |None      | 5b13c1346394841b4663d4cd1cbf4f5c

## Usage
Run the program
To run the program you can use the console from your app directory, using the command: "node app.js", "nodemon app.js" or "npm start". Then go to your browser and use this route: "http://localhost:3000/api/v1/albums?q=$BAND-NAME" $BAND-NAME should be replaced by the name of the band that you are looking for.
