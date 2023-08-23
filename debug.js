const dotenv = require('dotenv')
dotenv.config()
const { checkStream } = require('./check_stream')
const { supabase } = require('./supabase')

const batch_size = process.env.BATCH_SIZE ?? 2

;(async () => {
    try {
        if (await checkStream('rtsp://elumicatecamera.ddns.net:554/user=admin&password=Dva+Tri=5&channel=1&stream=0.sdp')) {
            console.log('online')
        } else {
            console.log('offline')
        }
    } catch (e) {
        console.error('error checking stream', e)
    }
})()
