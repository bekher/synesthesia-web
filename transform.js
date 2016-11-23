var sox = require("sox");
var SoxCommand = require('sox-audio');
var im = require("imagemagick");
var fs = require("fs");
var exec = require('child_process').exec;
var ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath('/usr/local/bin/ffmpeg/ffmpeg');
ffmpeg.setFfprobePath('/usr/local/bin/ffmpeg/ffprobe');

/*
    A module export to provide two functions: taking a sound file, transforming it,
    and outputting a sound file; and taking a picture and transforming it to a sound file.

    SOUND FILES SHOULD BE IN uploads/
    PNG FILES SHOULD BE IN ouputs/images/

    transform: takes three parameters
        @param filename: the full filename (not path) of the input sound file
            include any file extensions
        @param transform: a string representing the transformation to perform
        @param cb: the function to call when transformation is complete

    pic: takes two parameters
        @param filename: the full filename (not path) of the input png
            include the file extension
        @param cb: the function to call when conversion is complete
*/
module.exports = {
    transform: function(filename, transform, cb) {
        musToWav('uploads/' + filename, 'outputs/audio/' + filename + '.wav', function() {
            wavToRaw('outputs/audio/' + filename + '.wav', 
                'outputs/audio/' + filename + '.raw', function() {
                rawToPng('outputs/audio/' + filename + '.raw', 
                    'outputs/images/' + filename + '.png', function() {
                    cmd = 'python color.py outputs/images/' + filename + '.png ' + transform
                    exec(cmd, function(error, stdout, stderr) {
                        pngToRaw('outputs/images/' + filename + '.png',
                            'outputs/audio/' + filename + '.raw', function() {
                            rawToWav('outputs/audio/' + filename + '.raw',
                               'outputs/audio/' + filename + '.wav', function() {
                                musToWav('outputs/audio/' + filename + '.wav',
                                    'outputs/audio/' + filename + '.mp3', function() {
                                       cb(filename);   
                                    });
                            });         
                        });
                    });
                });        
            });
        });
    },

    pic: function(filename, cb) {
        pngToRaw('outputs/images/' + filename + '.png',
            'outputs/audio/' + filename + '.raw', function() {
            rawToWav('outputs/audio/' + filename + '.raw',
                'outputs/audio/' + filename + '.wav', function() {
                musToWav('outputs/audio/' + filename + '.wav',
                    'outputs/audio/' + filename + '.mp3', function() {
                      cb(filename);
                    });       
            });         
        });
    },

    getImg: function(filename, cb) {
        musToWav('uploads/' + filename, 'inputs/audio/' + filename + '.wav', function() {
            wavToRaw('inputs/audio/' + filename + '.wav', 
                'inputs/audio/' + filename + '.raw', function() {
                rawToPng('inputs/audio/' + filename + '.raw', 
                    'inputs/images/' + filename + '.png', function() {
                      cb(filename);
                    });
            });
        });
    },

    transformPartial: function(filename, cb) {
        cmd = 'python color.py outputs/images/' + filename + '.png ' + transform
        exec(cmd, function(error, stdout, stderr) {
            pngToRaw('outputs/images/' + filename + '.png',
                'outputs/audio/' + filename + '.raw', function() {
                rawToWav('outputs/audio/' + filename + '.raw',
                   'outputs/audio/' + filename + '.wav', function() {
                    musToWav('outputs/audio/' + filename + '.wav',
                        'outputs/audio/' + filename + '.mp3', function() {
                           cb(filename);   
                        });
                });         
            });
        });
    }
}

function factors(n) {
    var num_factors = [], i;
    for (i = 1; i <= Math.floor(Math.sqrt(n)); i += 1) {
        if (n % i === 0) {
            num_factors.push(i);
            if (n / i !== i) {num_factors.push(n / i);}
        }
    }
    num_factors.sort(function(x, y){return x - y;});  // numeric sort
    return num_factors;
}

function musToWav(src, dest, callback) {
    var com = ffmpeg(src)
        .output(dest)
        .on('end', callback);

    com.run();
}

function rawToWav(src, dest, callback) {
    var command = SoxCommand();
    command.input(src).inputSampleRate(44100)
        .inputEncoding('signed-integer')
        .inputBits(16)
        .inputChannels(2).inputFileType('raw');
    command.output(dest)
        .outputEncoding('signed-integer')
        .outputFileType('wav')
        .outputBits(16)
        .outputChannels(2)
        .outputSampleRate(44100);

    command.on('prepare', function(args) {
        console.log('Preparing sox command with args ' + args.join(' '));
    });

    command.on('start', function(commandLine) {
        console.log('Spawned sox with command ' + commandLine);
    });

    command.on('progress', function(progress) {
        console.log('Processing progress: ', progress);
    });

    command.on('error', function(err, stdout, stderr) {
        console.log('Cannot process audio: ' + err.message);
        console.log('Sox Command Stdout: ', stdout);
        console.log('Sox Command Stderr: ', stderr)
    });

    command.on('end', function() {
        if (callback) { callback(); }
        console.log('Sox command succeeded!');
    });

    command.run();
}

function wavToRaw(src, dest, callback) {
    var command = SoxCommand();
    command.input(src).inputSampleRate(44100)
        .inputEncoding('signed-integer')
        .inputBits(16)
        .inputChannels(2).inputFileType('wav');
    command.output(dest)
        .outputEncoding('signed-integer')
        .outputFileType('raw')
        .outputBits(16)
        .outputChannels(2)
        .outputSampleRate(44100);

    command.on('prepare', function(args) {
        console.log('Preparing sox command with args ' + args.join(' '));
    });

    command.on('start', function(commandLine) {
        console.log('Spawned sox with command ' + commandLine);
    });

    command.on('progress', function(progress) {
        console.log('Processing progress: ', progress);
    });

    command.on('error', function(err, stdout, stderr) {
        console.log('Cannot process audio: ' + err.message);
        console.log('Sox Command Stdout: ', stdout);
        console.log('Sox Command Stderr: ', stderr)
    });

    command.on('end', function() {
        if (callback) { callback(); }
        console.log('Sox command succeeded!');
    });

    command.run();
}

function pngToRaw(src, dest, callback) {
    console.log("Converting back to raw...")
        var size = Math.floor(fs.statSync(src)["size"] / 3)
        f = factors(size);
    var x = f[f.length/2];
    var y = size/x;
    console.log("Size: "+size+": ("+x+","+y+")")
        im.convert(["-size", x+"x"+y, "-depth", "8", src, "rgb:"+dest], function(err, stdout) {
            if (err) throw err;
            if (callback) { callback(); }
            console.log('stdout:', stdout);
        });
    console.log("all done");
}
function rawToPng(src, dest, callback) {
    var size = Math.floor(fs.statSync(src)["size"] / 3)
        f = factors(size);
    var x = f[f.length/2];
    var y = size/x;
    console.log("Size: "+size+": ("+x+","+y+")")
        im.convert(["-size", x+"x"+y, "-depth", "8", "rgb:"+src, dest], function(err, stdout) {
            if (err) throw err;
            if (callback) { callback(); }
            console.log('stdout:', stdout);
        });
    console.log("all done");
}
