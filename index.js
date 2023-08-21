const dotenv = require('dotenv')
dotenv.config()
const { checkStream } = require('./check_stream')
const { supabase } = require('./supabase')

const batch_size = 2

;(async () => {
    while(true) {
        const datetime = new Date()
        const timestamp = `${datetime.getUTCFullYear()}-${datetime.getUTCMonth() + 1}-${datetime.getUTCDate()} ${datetime.getUTCHours()}:${datetime.getMinutes()}:${datetime.getSeconds()}.${datetime.getMilliseconds()}`

        console.log(timestamp)

        const { data: streams } = await supabase
            .from('private_cameras')
            .select()
            .limit(batch_size)
            .order("stream_last_checked", {
                ascending: true,
                nullsFirst: true,
            })

        const stream_ids = streams.map(stream=>stream.camera_id)

        const {data, error} = await supabase
            .from('private_cameras')
            .update({ stream_last_checked: timestamp })
            .in('camera_id', stream_ids)
            .select()
        console.log(data, error)

        const promises = streams.map((stream) => {
            return new Promise(async (resolve, reject) => {
                try {
                    if (await checkStream(stream.access_link)) {
                        await supabase
                            .from('private_cameras')
                            .update({ online: true })
                            .eq('camera_id', stream.camera_id)
                        console.log(stream.camera_id, 'online')
                        resolve(true)
                    } else {
                        await supabase
                            .from('private_cameras')
                            .update({ online: false })
                            .eq('camera_id', stream.camera_id)
                        console.log(stream.camera_id, 'offline')
                        resolve(false)
                    }
                } catch (e) {
                    reject(e)
                    console.error('error checking stream', e, stream)
                }
            })
        });
        await Promise.all(promises)
    }
})()
