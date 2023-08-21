const { spawn } = require('child_process');
var kill = require('tree-kill');

// Replace this with your RTSP feed URL
const rtspUrl = 'rtsp://admin:Bitcoin!24@10.0.0.143:554/h264Preview_01_main';
// const rtspUrl = 'rtsp://admin:Bitcoin!24@110.0.0.143:554/h264Preview_01_main';

async function checkRTSP(rtspUrl) {
    return new Promise((resolve) => {

        const ffprobe = spawn('ffprobe', [
            '-rtsp_transport',
            'tcp',
            '-i',
            rtspUrl,
            '-show_frames',
        ]);

        const killffprobe = () => {
            console.log('exiting ffprobe')
            kill(ffprobe.pid)
        }

        const timeout = setTimeout(()=>{
            console.log('timeout')
            killffprobe()
            resolve(false)
        }, 5000)

        ffprobe.stdout.on('data', (data) => {
            console.log(data)
            console.log('got a buffer')
            clearTimeout(timeout)
            killffprobe()
            resolve(true)
        });

        ffprobe.on('close', (code) => {
            if (code !== 0) {
                console.error(`ffprobe process exited with code ${code}`);
                console.log('an error occurred while processing the rtsp feed.');
            }
        });

        ffprobe.stderr.on('data', (data) => {
            console.error(`ffprobe error: ${data}`);
            console.log('an error occurred while processing the rtsp feed.');
        });
    })

}

module.exports = { checkRTSP }