'use strict';

const { spawn } = require('child_process');

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', async (req, res) => {
  console.log(`checking link ${req.query.url}`)
  const pythonProcess = spawn('python3', [
    './python_script/check_link.py',
    req.query.url
    // 'https://www.youtube.com/watch?v=yDKJMdZTEXQ',
  ]);

  pythonProcess.stdout.on('data', function(data) {
    console.log(data.toString())
    res.setHeader('Content-Type', 'application/json')
    res.send({
      link_status: data.toString().slice(0, -1)
    })
  })

  return
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});