'use strict';

const { spawn } = require('child_process');

(async () => {
    while(true) {
        const links = [
            'https://www.youtube.com/watch?v=yDKJMdZTEXQ'
        ]
        console.log(links)
        const pythonProcess = spawn('python3', [
            './python_script/check_link.py',
            links
        ]);

        pythonProcess.stdout.on('data', function(data) {
            console.log(data.toString())
        })

        await new Promise(r => setTimeout(r, 5000))
    }
})()
