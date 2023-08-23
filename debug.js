const dotenv = require('dotenv')
dotenv.config()
const { checkStream } = require('./check_stream')
const { supabase } = require('./supabase')

const batch_size = process.env.BATCH_SIZE ?? 2

;(async () => {
    try {
        if (await checkStream('')) {
            console.log('online')
        } else {
            console.log('offline')
        }
    } catch (e) {
        console.error('error checking stream', e)
    }
})()
