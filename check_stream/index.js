const { checkRTSP } = require('./check_rtsp');
const { checkWebRTC, checkYoutube } = require('./check_link');

const checkStream = async (url) => {
    console.log('checking stream', url)

    if(url.startsWith('rtsp://') && await checkRTSP(url)){
        console.log({
            link_status: "online",
            stream_type: "rtsp"
        })
        return true
    }

    if(url.startsWith('https://video.elumicate.com') && await checkWebRTC(url)){
        console.log({
            link_status: "online",
            stream_type: "elumicate webrtc"
        })
        return true
    }

    if(url.startsWith('https://www.youtube') && await checkYoutube(url)){
        console.log({
            link_status: "online",
            stream_type: "youtube"
        })
        return true
    }

    return false
}

module.exports = { checkStream }
