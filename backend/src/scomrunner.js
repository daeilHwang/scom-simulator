//const { hasUncaughtExceptionCaptureCallback } = require('process');

// var exec = require('child_process').exec, child;
// var child;

// export function start(port) {
//     child = exec('java -jar' + ' ../libs/scomrunner.jar 8001');
//     child.stdout.on('data', function(data) {
//         console.log(data);
//     });
    
//     child.stderr.on("data", function (data) {
//         console.log(data.toString());
//     });
// }

// export function stop(){
//     child.kill();
// }

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.start = start;
exports.stop = stop;
const spawn = require('child_process').spawn;

let child;

function start(port) {
    // child = exec('java -jar' + ' ../libs/scomrunner.jar ' + port);
    if(child) child.kill();
    // child = exec('java -jar' + ' ../libs/scomrunner.jar ' + port);
    child = spawn('java', ['-jar', '../libs/scomrunner.jar' , port], {cwd:__dirname});
    child.stdout.on('data', function (data) {
        console.log(data.toString());
    });

    child.stderr.on("data", function (data) {
        console.log(data.toString());
    });
}

function stop() {
    try{
        child.kill();
    }catch(ex){
        child;
    }
    
}