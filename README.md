![Synesthesia](http://pre00.deviantart.net/910d/th/pre/i/2015/109/8/7/synesthesia___can_you_see_the_music__by_azendia-d6se3bm.png)

# Synesthesia

## Installation

Dependencies: NodeJS, MongoDB, Python, SoX, FFMPEG, Imagemagick, Scikit, PIL 

After above deps are installed, install the NodeJS dependencies with:

`npm install` 

Then, you can start Synesthesia with:

`npm start`


## Usage

Synesthesia was designed to apply image transformations to songs as an experiment to listen to the result. With Synesthesia, you can tint a song red, listen to your profile picture, and apply a host of pixel-level transformations to a song.  Once the app starts, upload a song on the web app, choose a transformation! Wait a minute or two (songs are big pictures!), and the app will display the result. Note that although Google's Deep Dream is listed as an option, it has been intentionally disabled due to intensive processing required. 

## How it works

Once a song is uploaded, the Synesthesia web app passes it to the backend for conversion.  It converts the .mp3 to a .wav, the .wav to a .raw, and then the .raw to a .png (for loseless compression).  The .png is then transformed per request, and then converted back up the chain to a .mp3. The edited .png file and .mp3 file are shown to the user. 
