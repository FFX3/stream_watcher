const { spawn } = require('child_process');
const kill = require('tree-kill');
const fs = require('fs')

const file_path = 'output.raw'
const max_file_size = 10 * 1024 * 1024; // 10 MB (adjust as needed)

async function checkRTSP(rtspUrl) {
    for(let tries=0; tries<2; tries++){ //TODO we shouldn't retry on 404s
        if(await check_ffprobe(rtspUrl)){
            return true
        }

        if(await check_cv(rtspUrl)){
            return true
        }

        // if(await check_vlc(rtspUrl)){
        //     return true
        // }
    }
    return false
}

async function check_cv(url){
    return new Promise((resolve) => {
        const cv_process = (() => {
            if(process.env.OS == 'windows'){
                return spawn('python', [
                    './python/open_cv_check.py',
                    url
                ])
            } else {
                return spawn('python3', [
                    './python/open_cv_check.py',
                    url
                ])
            }
        })();

        const kill_cv = () => {
            console.log('exiting cv')
            kill(cv_process.pid)
        }

        const timeout = setTimeout(()=>{
            console.log('timeout')
            kill_cv()
            resolve(false)
        }, 10000)

        cv_process.stdout.on('data', (data) => {
            const result = data.toString().trim()
            if(result == 'online'){
                console.log('script result online')
                clearTimeout(timeout)
                kill_cv()
                resolve(true)
            }
        });

        cv_process.on('close', (code) => {
            if (code !== 0) {
                console.error(`cv process exited with code ${code}`);
                console.log('an error occurred while processing the rtsp feed.');
            }
        });

        cv_process.stderr.on('data', (data) => {
            console.error(`cv error: ${data}`);
            console.log('an error occurred while processing the rtsp feed.');
        });
    })
}

async function check_vlc(url){ //work in progress
    const vlcProcess = spawn('vlc', [
        '-I', 'dummy',
        url,
        '--sout', `#transcode{vcodec=I420}:standard{access=file,mux=raw,dst=${file_path}}`
    ]);


    const kill_vlc = () => {
        console.log('exiting ffprobe')
        kill(ffprobe.pid)
    }

    vlcProcess.stderr.on('data', (data) => {
        console.error(`VLC Error: ${data}`);
    });

    vlcProcess.on('close', (code) => {
        console.log(`VLC process exited with code ${code}`);
    });

    while(true) {
        fs.stat(file_path, (err, stats) => {
            console.log(stats.size)
            if (err) {
                console.error(err);
                return;
            }
        })
    }
}

function check_ffprobe(url){
    return new Promise((resolve) => {

        const ffprobe = spawn('ffprobe', [
            '-rtsp_transport',
            'tcp',
            '-i',
            url,
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
        }, 10000)

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