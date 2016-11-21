sox = require("sox");
SoxCommand = require('sox-audio');
im = require("imagemagick");
fs = require("fs");
var exec = require('child_process').exec;

transform = "speed"

wavRaw("test.wav", "test.raw", function() {
    rawToPng("test.raw", "test.png", function() {
        cmd = "python color.py test.png " + transform;
        exec(cmd, function(error, stdout, stderr) {
            PngToRaw("test.png", "out.raw", function() {
                wavRaw("out.raw", "out.wav", function() {
                    console.log("finito");
                });
            });
        });
    });
});

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

function wavRaw(src, dest, callback) {
    var command = SoxCommand();
    command.input(src).inputSampleRate(44100)
  .inputEncoding('signed-integer')
  .inputBits(32)
  .inputChannels(2).inputFileType('raw');
  command.output(dest)
    .outputEncoding('signed-integer')
    .outputFileType('wav')
    .outputBits(32)
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


function PngToRaw(src, dest, callback) {
    console.log("[*] Converting back to raw...")
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
